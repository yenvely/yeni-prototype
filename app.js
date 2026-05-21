document.addEventListener('DOMContentLoaded', () => {
  
  // --- UI Elements ---
  const htmlNode = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle');
  const deviceTimeEl = document.getElementById('device-time');
  
  // Screens & Navigation
  const screenLogin = document.getElementById('screen-login');
  const screenForgotPw = document.getElementById('screen-forgot-pw');
  const screenHome = document.getElementById('screen-home');
  const screenChat = document.getElementById('screen-chat');
  const screenMypage = document.getElementById('screen-mypage');
  const screenMyInfoSettings = document.getElementById('screen-myinfo-settings');
  const screenDesignSystem = document.getElementById('screen-design-system');
  const bottomNav = document.getElementById('bottom-nav');
  
  const navHome = document.getElementById('nav-home');
  const navChat = document.getElementById('nav-chat');
  const navMypage = document.getElementById('nav-mypage');
  const navDesignSystem = document.getElementById('nav-design-system');
  
  // Login Form
  const emailInput = document.getElementById('email');
  const pwInput = document.getElementById('password');
  const togglePwBtn = document.getElementById('toggle-pw-btn');
  const eyeIcon = document.getElementById('eye-icon');
  
  const emailGroup = document.getElementById('email-group');
  const pwGroup = document.getElementById('pw-group');
  const emailError = document.getElementById('email-error');
  const pwError = document.getElementById('pw-error');
  
  const loginBtn = document.getElementById('login-btn');
  const loginSpinner = document.getElementById('login-spinner');
  const logoutBtn = document.getElementById('logout-btn');
  const triggerForgotPwLink = document.getElementById('trigger-forgot-pw-link');
  
  // Find & Reset Password elements
  const forgotPwBackBtn = document.getElementById('forgot-pw-back-btn');
  const forgotStep1 = document.getElementById('forgot-step-1');
  const forgotStep2 = document.getElementById('forgot-step-2');
  const stepNode1 = document.getElementById('step-node-1');
  const stepNode2 = document.getElementById('step-node-2');
  
  const forgotEmailInput = document.getElementById('forgot-email');
  const sendCodeBtn = document.getElementById('send-code-btn');
  const forgotCodeInput = document.getElementById('forgot-code');
  const forgotTimerBox = document.getElementById('forgot-timer-box');
  const verificationTimer = document.getElementById('verification-timer');
  const verifyCodeBtn = document.getElementById('verify-code-btn');
  
  const forgotNewPw = document.getElementById('forgot-new-pw');
  const forgotConfirmPw = document.getElementById('forgot-confirm-pw');
  const forgotConfirmError = document.getElementById('forgot-confirm-error');
  const changePwSubmitBtn = document.getElementById('change-pw-submit-btn');
  const forgotNewPwGroup = document.getElementById('forgot-new-pw-group');
  const forgotConfirmPwGroup = document.getElementById('forgot-confirm-pw-group');
  
  const forgotTogglePw1 = document.getElementById('forgot-toggle-pw-1');
  const forgotTogglePw2 = document.getElementById('forgot-toggle-pw-2');
  const forgotEye1 = document.getElementById('forgot-eye-1');
  const forgotEye2 = document.getElementById('forgot-eye-2');
  
  const ruleLength = document.getElementById('rule-length');
  const ruleLower = document.getElementById('rule-lower');
  const ruleUpper = document.getElementById('rule-upper');
  const ruleNumber = document.getElementById('rule-number');
  const ruleSpecial = document.getElementById('rule-special');
  const ruleMatch = document.getElementById('rule-match');
  
  // Counseling Desk (Chat Simulator) elements
  const tabWaiting = document.getElementById('tab-waiting');
  const tabOngoing = document.getElementById('tab-ongoing');
  const chatQueueList = document.getElementById('chat-queue-list');
  const waitingRoomMinsu = document.getElementById('waiting-room-minsu');
  const startChatBtn = document.getElementById('start-chat-btn');
  const chatEmptyMsg = document.getElementById('chat-empty-msg');
  const waitingCountBadge = document.getElementById('waiting-count-badge');
  const ongoingCountBadge = document.getElementById('ongoing-count-badge');
  
  const chatInterface = document.getElementById('chat-interface');
  const chatInterfaceBack = document.getElementById('chat-interface-back');
  const chatElapsedTimer = document.getElementById('chat-elapsed-timer');
  const chatHistory = document.getElementById('chat-history');
  const chatQuickTemplates = document.getElementById('chat-quick-templates');
  const chatTextbox = document.getElementById('chat-textbox');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const endChatBtn = document.getElementById('end-chat-btn');
  
  // Dashboard Counters
  const valWaiting = document.getElementById('val-waiting');
  const valOngoing = document.getElementById('val-ongoing');
  const homeStatWaiting = document.getElementById('home-stat-waiting');
  const homeStatOngoing = document.getElementById('home-stat-ongoing');
  
  // My Page Members list
  const memberCount = document.getElementById('member-count');
  const inviteMemberBtn = document.getElementById('invite-member-btn');
  const memberListWrapper = document.getElementById('member-list-wrapper');
  
  // Common Popups
  const popupOverlay = document.getElementById('popup-overlay');
  const popupIconBox = document.getElementById('popup-icon-box');
  const popupTitle = document.getElementById('popup-title');
  const popupBody = document.getElementById('popup-body');
  const popupButtonsContainer = document.getElementById('popup-buttons-container');
  
  // Notifications
  const dynamicIsland = document.getElementById('island');
  const islandContent = document.getElementById('island-content');
  const toastContainer = document.getElementById('toast-container');
  
  // --- Global State ---
  let isLoggedIn = false;
  let customPassword = 'password123!'; // Default user credential, can be updated via Reset PW flow.
  let isTimerRunning = false;
  let timerInterval = null;
  let chatElapsedInterval = null;
  
  let waitingChats = 1;
  let ongoingChats = 0;
  let chatTimeElapsed = 0; // seconds
  let isChatActive = false;
  let activeMemberCount = 3;

  // --- 1. Device Time Update ---
  function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    deviceTimeEl.textContent = `${hours}:${minutes}`;
  }
  updateTime();
  setInterval(updateTime, 1000);
  
  // --- 2. Theme Toggle ---
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlNode.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlNode.setAttribute('data-theme', newTheme);
    
    const icon = themeToggleBtn.querySelector('i');
    if (newTheme === 'dark') {
      icon.className = 'fa-solid fa-sun';
      showToast('다크 테마가 적용되었습니다.');
    } else {
      icon.className = 'fa-solid fa-moon';
      showToast('라이트 테마가 적용되었습니다.');
    }
  });

  // --- 2.5. Collapsible Sandbox Control Panel Sidebar ---
  const controlPanel = document.getElementById('control-panel');
  const controlPanelToggle = document.getElementById('control-panel-toggle');
  if (controlPanel && controlPanelToggle) {
    controlPanelToggle.addEventListener('click', () => {
      controlPanel.classList.toggle('collapsed');
      const icon = controlPanelToggle.querySelector('i');
      if (controlPanel.classList.contains('collapsed')) {
        icon.className = 'fa-solid fa-angles-right';
        showToast('제어판이 축소되었습니다.');
      } else {
        icon.className = 'fa-solid fa-angles-left';
        showToast('제어판이 확장되었습니다.');
      }
    });
  }

  // Autofocus email input on load
  if (emailInput) {
    emailInput.focus();
  }

  // --- 3. Password Visibility Toggle (Login Screen) ---
  togglePwBtn.addEventListener('click', () => {
    const isMasked = pwInput.getAttribute('type') === 'password';
    if (isMasked) {
      pwInput.setAttribute('type', 'text');
      eyeIcon.className = 'fa-solid fa-eye-slash';
      showToast('비밀번호 마스킹을 해제했습니다.');
    } else {
      pwInput.setAttribute('type', 'password');
      eyeIcon.className = 'fa-solid fa-eye';
      showToast('비밀번호가 마스킹 처리되었습니다.');
    }
  });

  // --- 4. Navigation & Screen Switching ---
  function switchScreen(targetScreenId) {
    const screens = [screenLogin, screenForgotPw, screenHome, screenChat, screenMypage, screenMyInfoSettings, screenDesignSystem];
    screens.forEach(s => {
      if (s) s.classList.remove('active');
    });

    const navItems = [navHome, navChat, navMypage, navDesignSystem];
    navItems.forEach(n => {
      if (n) n.classList.remove('active');
    });
    
    if (targetScreenId === 'login') {
      screenLogin.classList.add('active');
      bottomNav.classList.remove('visible');
    } else if (targetScreenId === 'forgot-pw') {
      screenForgotPw.classList.add('active');
      bottomNav.classList.remove('visible');
    } else if (targetScreenId === 'home') {
      screenHome.classList.add('active');
      bottomNav.classList.add('visible');
      if (navHome) navHome.classList.add('active');
    } else if (targetScreenId === 'chat') {
      screenChat.classList.add('active');
      bottomNav.classList.add('visible');
      if (navChat) navChat.classList.add('active');
      
      // Update Tab contents on opening
      renderChatTabs();
    } else if (targetScreenId === 'mypage') {
      screenMypage.classList.add('active');
      bottomNav.classList.add('visible');
      if (navMypage) navMypage.classList.add('active');
    } else if (targetScreenId === 'myinfo-settings') {
      screenMyInfoSettings.classList.add('active');
      bottomNav.classList.add('visible');
      if (navMypage) navMypage.classList.add('active');
    } else if (targetScreenId === 'design-system') {
      if (screenDesignSystem) screenDesignSystem.classList.add('active');
      bottomNav.classList.add('visible');
      if (navDesignSystem) navDesignSystem.classList.add('active');
    }
  }

  navHome.addEventListener('click', () => {
    if (isLoggedIn) switchScreen('home');
  });

  navChat.addEventListener('click', () => {
    if (isLoggedIn) switchScreen('chat');
  });

  navMypage.addEventListener('click', () => {
    if (isLoggedIn) switchScreen('mypage');
  });

  if (navDesignSystem) {
    navDesignSystem.addEventListener('click', () => {
      if (isLoggedIn) switchScreen('design-system');
    });
  }

  // Clicking waiting or ongoing cards on home triggers chat navigation
  homeStatWaiting.addEventListener('click', () => {
    if (isLoggedIn) {
      switchScreen('chat');
      document.getElementById('tab-waiting').click();
    }
  });

  homeStatOngoing.addEventListener('click', () => {
    if (isLoggedIn) {
      switchScreen('chat');
      document.getElementById('tab-ongoing').click();
    }
  });

  // --- 5. Custom Popup Overlay Controller ---
  function showPopup({ iconClass = 'fa-solid fa-circle-exclamation', color = 'var(--error-color)', bg = 'var(--error-glow)', title, body, buttons = [] }) {
    popupIconBox.innerHTML = `<i class="${iconClass}"></i>`;
    popupIconBox.style.color = color;
    popupIconBox.style.background = bg;
    popupTitle.textContent = title;
    popupBody.innerHTML = body;
    
    popupButtonsContainer.innerHTML = '';
    buttons.forEach(btnInfo => {
      const btn = document.createElement('button');
      btn.className = `btn ${btnInfo.type === 'primary' ? 'btn-primary' : 'btn-secondary'}`;
      btn.style.padding = '10px 16px';
      btn.style.fontSize = '13px';
      btn.textContent = btnInfo.text;
      btn.addEventListener('click', () => {
        popupOverlay.classList.remove('active');
        if (btnInfo.action) btnInfo.action();
      });
      popupButtonsContainer.appendChild(btn);
    });
    
    popupOverlay.classList.add('active');
  }

  function closePopup() {
    popupOverlay.classList.remove('active');
  }

  popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay) {
      closePopup();
    }
  });

  // --- 6. Dynamic Island Animations ---
  function triggerIslandNotification(message, iconClass = 'fa-solid fa-circle-check', duration = 3000) {
    islandContent.innerHTML = `<i class="${iconClass}" style="color: var(--accent-color);"></i><span>${message}</span>`;
    dynamicIsland.classList.add('active');
    setTimeout(() => {
      dynamicIsland.classList.remove('active');
    }, duration);
  }

  // --- 7. Toast Alerts ---
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-info-circle" style="color: var(--primary-color);"></i><span>${message}</span>`;
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideIn 0.3s reverse forwards';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 2500);
  }

  // --- 8. Authentication Logic ---
  
  // Validation checker
  function validateForm() {
    let isValid = true;
    
    // Clear error states
    emailGroup.classList.remove('has-error');
    pwGroup.classList.remove('has-error');
    
    const emailVal = emailInput.value.trim();
    const pwVal = pwInput.value.trim();
    
    if (!emailVal) {
      emailGroup.classList.add('has-error');
      emailError.querySelector('.text').textContent = '필수 입력 항목입니다.';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailVal)) {
        emailGroup.classList.add('has-error');
        emailError.querySelector('.text').textContent = '올바른 이메일 주소 형식을 입력하세요.';
        isValid = false;
      }
    }
    
    if (!pwVal) {
      pwGroup.classList.add('has-error');
      pwError.querySelector('.text').textContent = '필수 입력 항목입니다.';
      isValid = false;
    }
    
    return isValid;
  }

  // Execute Login
  function handleLogin() {
    if (!validateForm()) return;
    
    // Password match check
    const emailVal = emailInput.value.trim();
    const pwVal = pwInput.value.trim();
    
    loginBtn.disabled = true;
    loginSpinner.style.display = 'block';
    loginBtn.querySelector('.btn-text').textContent = '로그인 중...';
    
    triggerIslandNotification('인증 서버 연결 중...', 'fa-solid fa-arrows-spin');
    
    setTimeout(() => {
      loginBtn.disabled = false;
      loginSpinner.style.display = 'none';
      loginBtn.querySelector('.btn-text').textContent = '로그인';
      
      // Match customPassword
      if (pwVal !== customPassword) {
        showPopup({
          iconClass: 'fa-solid fa-triangle-exclamation',
          color: 'var(--warning-color)',
          bg: 'hsla(38, 92%, 50%, 0.15)',
          title: '로그인 실패 [3-2]',
          body: '이메일 또는 비밀번호를 확인해주세요.<br><span style="font-size:11px;color:var(--text-tertiary);">임시 비밀번호 또는 재설정한 비밀번호를 정확히 기입하십시오.</span>',
          buttons: [
            {
              text: '확인',
              type: 'primary'
            }
          ]
        });
        return;
      }
      
      isLoggedIn = true;
      switchScreen('home');
      showToast('로그인에 성공했습니다. 대시보드로 이동합니다.');
      
      setTimeout(() => {
        triggerIslandNotification('권예은 소유자님 환영합니다', 'fa-solid fa-crown', 3500);
      }, 500);
    }, 1500);
  }

  loginBtn.addEventListener('click', handleLogin);
  
  // Enter key press mapping
  pwInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  });

  // Execute Logout
  function handleLogout() {
    isLoggedIn = false;
    emailInput.value = '';
    pwInput.value = '';
    emailGroup.classList.remove('has-error');
    pwGroup.classList.remove('has-error');
    
    switchScreen('login');
    showToast('로그아웃되었습니다.');
    triggerIslandNotification('안전하게 로그아웃됨', 'fa-solid fa-lock');
    
    setTimeout(() => {
      emailInput.focus();
    }, 500);
  }

  logoutBtn.addEventListener('click', handleLogout);

  // --- 9. [NEW] Find & Reset Password Step-by-Step Logic ---
  
  // Navigate to Reset Screen
  triggerForgotPwLink.addEventListener('click', (e) => {
    e.preventDefault();
    switchScreen('forgot-pw');
    resetForgotPwWorkflow();
  });

  forgotPwBackBtn.addEventListener('click', () => {
    switchScreen('login');
  });

  // Toggle Password Masking for Reset Inputs
  function hookPwToggle(btn, input, eye) {
    btn.addEventListener('click', () => {
      const isMasked = input.getAttribute('type') === 'password';
      if (isMasked) {
        input.setAttribute('type', 'text');
        eye.className = 'fa-solid fa-eye-slash';
      } else {
        input.setAttribute('type', 'password');
        eye.className = 'fa-solid fa-eye';
      }
    });
  }
  hookPwToggle(forgotTogglePw1, forgotNewPw, forgotEye1);
  hookPwToggle(forgotTogglePw2, forgotConfirmPw, forgotEye2);

  function resetForgotPwWorkflow() {
    forgotEmailInput.value = '';
    forgotCodeInput.value = '';
    forgotCodeInput.disabled = true;
    forgotNewPw.value = '';
    forgotConfirmPw.value = '';
    
    forgotTimerBox.style.display = 'none';
    verifyCodeBtn.disabled = true;
    changePwSubmitBtn.disabled = true;
    
    // Switch to step 1
    forgotStep1.classList.add('active');
    forgotStep2.classList.remove('active');
    stepNode1.className = 'step-node active';
    stepNode2.className = 'step-node';
    
    clearInterval(timerInterval);
    isTimerRunning = false;
    
    // Clear checks
    const rules = [ruleLength, ruleLower, ruleUpper, ruleNumber, ruleSpecial, ruleMatch];
    rules.forEach(r => {
      r.className = '';
      r.querySelector('i').className = 'fa-solid fa-circle-dot';
    });
    forgotConfirmError.style.display = 'none';
    forgotNewPwGroup.classList.remove('has-error');
    forgotConfirmPwGroup.classList.remove('has-error');
  }

  // Send Code Verification Timer (30 minutes)
  sendCodeBtn.addEventListener('click', () => {
    const emailVal = forgotEmailInput.value.trim();
    if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      showToast('올바른 이메일 주소를 먼저 기입해주세요!');
      return;
    }
    
    showToast('이메일로 인증코드가 발송되었습니다. [30분 유효]');
    forgotCodeInput.disabled = false;
    forgotCodeInput.focus();
    forgotTimerBox.style.display = 'inline-flex';
    
    // Start countdown: 30:00 (1800 seconds)
    let timeLeft = 1800;
    
    clearInterval(timerInterval);
    isTimerRunning = true;
    
    function updateCountdown() {
      const mins = Math.floor(timeLeft / 60);
      let secs = timeLeft % 60;
      secs = secs < 10 ? '0' + secs : secs;
      verificationTimer.textContent = `${mins}:${secs}`;
      
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        forgotCodeInput.disabled = true;
        showToast('인증번호 유효시간이 초과되어 만료되었습니다.');
      }
      timeLeft--;
    }
    updateCountdown();
    timerInterval = setInterval(updateCountdown, 1000);
  });

  // Enable verify code button once 6 characters entered
  forgotCodeInput.addEventListener('input', () => {
    const val = forgotCodeInput.value.trim();
    if (val.length === 6) {
      verifyCodeBtn.disabled = false;
    } else {
      verifyCodeBtn.disabled = true;
    }
  });

  // Click Verify Code
  verifyCodeBtn.addEventListener('click', () => {
    // Mock verify success
    clearInterval(timerInterval);
    isTimerRunning = false;
    forgotTimerBox.style.display = 'none';
    
    showToast('이메일 인증이 완료되었습니다. 새 비밀번호를 설정하세요.');
    
    // Transition to Step 2
    forgotStep1.classList.remove('active');
    forgotStep2.classList.add('active');
    
    stepNode1.className = 'step-node completed';
    stepNode2.className = 'step-node active';
    
    setTimeout(() => {
      forgotNewPw.focus();
    }, 300);
  });

  // Validate Password Complexity (Dynamic checklist checks)
  function checkPasswordRules() {
    const pwVal = forgotNewPw.value;
    const confirmVal = forgotConfirmPw.value;
    
    let isLength = pwVal.length >= 8 && pwVal.length <= 90;
    let isLower = /[a-z]/.test(pwVal);
    let isUpper = /[A-Z]/.test(pwVal);
    let isNumber = /[0-9]/.test(pwVal);
    let isSpecial = /[`!@#$%^&*()_+\-=\[\]{}|;:'",.<>\/?]/.test(pwVal);
    let isMatch = pwVal.length > 0 && pwVal === confirmVal;
    
    function toggleRuleStyle(el, isValid) {
      const icon = el.querySelector('i');
      if (isValid) {
        el.className = 'valid';
        icon.className = 'fa-solid fa-circle-check';
      } else {
        el.className = '';
        icon.className = 'fa-solid fa-circle-dot';
      }
    }
    
    toggleRuleStyle(ruleLength, isLength);
    toggleRuleStyle(ruleLower, isLower);
    toggleRuleStyle(ruleUpper, isUpper);
    toggleRuleStyle(ruleNumber, isNumber);
    toggleRuleStyle(ruleSpecial, isSpecial);
    toggleRuleStyle(ruleMatch, isMatch);
    
    // Confirm mismatch warning
    if (confirmVal.length > 0 && !isMatch) {
      forgotConfirmPwGroup.classList.add('has-error');
    } else {
      forgotConfirmPwGroup.classList.remove('has-error');
    }
    
    const allValid = isLength && isLower && isUpper && isNumber && isSpecial && isMatch;
    changePwSubmitBtn.disabled = !allValid;
  }

  forgotNewPw.addEventListener('input', checkPasswordRules);
  forgotConfirmPw.addEventListener('input', checkPasswordRules);

  // Submit Password Change
  changePwSubmitBtn.addEventListener('click', () => {
    const pwVal = forgotNewPw.value;
    
    changePwSubmitBtn.disabled = true;
    showToast('비밀번호 정보를 암호화하는 중...');
    
    setTimeout(() => {
      customPassword = pwVal; // Override local credentials!
      
      showPopup({
        iconClass: 'fa-solid fa-circle-check',
        color: 'var(--success-color)',
        bg: 'var(--success-glow)',
        title: '비밀번호 변경 완료',
        body: '보안 정책을 충족하는 새로운 비밀번호로 변경이 완료되었습니다.<br>로그인 화면으로 이동하여 변경하신 정보로 안전하게 로그인하십시오.',
        buttons: [
          {
            text: '로그인 화면으로 이동',
            type: 'primary',
            action: () => {
              switchScreen('login');
              pwInput.value = ''; // clear password box
            }
          }
        ]
      });
    }, 1200);
  });

  // --- 10. [NEW] Interactive Counseling Desk (Chat Simulator) logic ---
  
  function renderChatTabs() {
    // Waiting count badge
    if (waitingChats > 0) {
      waitingCountBadge.textContent = waitingChats;
      waitingCountBadge.style.display = 'inline-block';
      waitingRoomMinsu.style.display = 'flex';
      chatEmptyMsg.style.display = 'none';
    } else {
      waitingCountBadge.style.display = 'none';
      waitingRoomMinsu.style.display = 'none';
      
      // If waiting tab is active, show empty message
      if (tabWaiting.classList.contains('active')) {
        chatEmptyMsg.style.display = 'block';
      }
    }
    
    // Ongoing count badge
    if (ongoingChats > 0) {
      ongoingCountBadge.textContent = ongoingChats;
      ongoingCountBadge.style.display = 'inline-block';
    } else {
      ongoingCountBadge.style.display = 'none';
    }
  }

  // Switch between tabs
  tabWaiting.addEventListener('click', () => {
    tabWaiting.classList.add('active');
    tabOngoing.classList.remove('active');
    
    if (waitingChats > 0) {
      waitingRoomMinsu.style.display = 'flex';
      chatEmptyMsg.style.display = 'none';
    } else {
      waitingRoomMinsu.style.display = 'none';
      chatEmptyMsg.style.display = 'block';
      chatEmptyMsg.querySelector('span').textContent = '상담 요청 대기 건이 없습니다.';
    }
  });

  tabOngoing.addEventListener('click', () => {
    tabWaiting.classList.remove('active');
    tabOngoing.classList.add('active');
    
    if (ongoingChats > 0) {
      // Re-create the ongoing room card
      renderOngoingRoomCard();
      chatEmptyMsg.style.display = 'none';
    } else {
      chatQueueList.querySelectorAll('.chat-room-item').forEach(r => {
        if (r.id !== 'waiting-room-minsu') r.remove();
      });
      waitingRoomMinsu.style.display = 'none';
      chatEmptyMsg.style.display = 'block';
      chatEmptyMsg.querySelector('span').textContent = '진행 중인 상담이 없습니다.';
    }
  });

  function renderOngoingRoomCard() {
    // Clear old elements if present
    chatQueueList.querySelectorAll('.chat-room-item').forEach(r => {
      if (r.id !== 'waiting-room-minsu') r.remove();
    });
    waitingRoomMinsu.style.display = 'none';

    const card = document.createElement('div');
    card.className = 'chat-room-item';
    card.id = 'ongoing-room-minsu';
    card.innerHTML = `
      <div class="chat-room-info">
        <div class="customer-avatar" style="background: var(--primary-glow); color: var(--primary-color);">김</div>
        <div class="chat-room-text">
          <span class="customer-name">김민수 고객</span>
          <span class="chat-room-lastmsg" id="ongoing-lastmsg">상담 진행 중...</span>
        </div>
      </div>
      <button class="btn btn-secondary" style="width: auto; padding: 6px 12px; font-size: 11px; border-radius: 8px;">
        상담 진입
      </button>
    `;
    
    // Re-entering active chat
    card.querySelector('button').addEventListener('click', () => {
      chatInterface.classList.add('active');
      isChatActive = true;
    });

    chatQueueList.appendChild(card);
  }

  // Start Chat Counseling Room Action
  startChatBtn.addEventListener('click', () => {
    triggerIslandNotification('상담 배분 및 진입 중...', 'fa-solid fa-arrows-spin');
    
    setTimeout(() => {
      waitingChats = 0;
      ongoingChats = 1;
      
      // Update dashboard counters
      valWaiting.textContent = '0';
      valOngoing.textContent = '1';
      
      // Show Chat UI layer
      chatInterface.classList.add('active');
      isChatActive = true;
      
      // Start elapsed timer
      chatTimeElapsed = 0;
      clearInterval(chatElapsedInterval);
      chatElapsedInterval = setInterval(() => {
        chatTimeElapsed++;
        const mins = Math.floor(chatTimeElapsed / 60);
        let secs = chatTimeElapsed % 60;
        secs = secs < 10 ? '0' + secs : secs;
        chatElapsedTimer.textContent = `경과 시간: ${mins}:${secs}`;
      }, 1000);
      
      renderChatTabs();
      showToast('김민수 고객과 상담 세션이 체결되었습니다.');
    }, 1000);
  });

  // Minimize Chat Room (Back button inside Chat dialogue)
  chatInterfaceBack.addEventListener('click', () => {
    chatInterface.classList.remove('active');
    isChatActive = false;
    
    // Update tab to ongoing
    tabOngoing.click();
    
    // Update last message preview
    const ongoingMsgNode = document.getElementById('ongoing-lastmsg');
    const bubbles = chatHistory.querySelectorAll('.msg-bubble');
    if (ongoingMsgNode && bubbles.length > 0) {
      ongoingMsgNode.textContent = bubbles[bubbles.length - 1].textContent;
    }
  });

  // Counseling Templates Injection
  chatQuickTemplates.addEventListener('change', () => {
    const val = chatQuickTemplates.value;
    if (!val) return;
    
    let templateText = "";
    if (val === 'welcome') {
      templateText = "안녕하세요, 반갑습니다! CloudGate 선임상담사 권예은입니다. 무엇을 도와드릴까요?";
    } else if (val === 'plan_info') {
      templateText = "구독 결제 플랜 변경은 오직 [보안 관리 > 결제 권한]을 획득한 '워크플레이스 소유자' 계정에서만 기본 정보 설정 메뉴를 통해 즉시 처리 가능합니다.";
    } else if (val === 'bye') {
      templateText = "답변에 유용한 도움이 되었기를 바라며, 다른 문의사항이 있으시면 언제든지 대시보드를 찾아주십시오. 편안한 하루 되세요. 감사합니다.";
    }
    
    chatTextbox.value = templateText;
    chatTextbox.focus();
    chatQuickTemplates.selectedIndex = 0; // reset selector
    showToast('상담 템플릿 문장을 텍스트 상자에 주입했습니다.');
  });

  // Sending Messages
  function sendCounselorMessage() {
    const text = chatTextbox.value.trim();
    if (!text) return;
    
    // Append counselor bubble
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble counselor';
    bubble.textContent = text;
    chatHistory.appendChild(bubble);
    
    chatTextbox.value = '';
    chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to bottom
    
    // Auto Customer Reply
    setTimeout(() => {
      const replyBubble = document.createElement('div');
      replyBubble.className = 'msg-bubble customer';
      
      let replyText = "확인했습니다. 안내해주셔서 고맙습니다!";
      if (text.includes('구독 결제')) {
        replyText = "아, 그렇군요! 소유자 계정으로 권한 설정해서 대시보드에서 변경해보겠습니다. 감사합니다.";
      } else if (text.includes('도움이 되었기를')) {
        replyText = "네, 친절히 안내해주셔서 대단히 감사드려요. 좋은 하루 보내세요!";
      }
      
      replyBubble.textContent = replyText;
      chatHistory.appendChild(replyBubble);
      chatHistory.scrollTop = chatHistory.scrollHeight;
      
      triggerIslandNotification('김민수 고객 답변 수신', 'fa-solid fa-comment-dots');
    }, 1500);
  }

  chatSendBtn.addEventListener('click', sendCounselorMessage);
  chatTextbox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendCounselorMessage();
    }
  });

  // End Chat (상담 종료) Flow
  endChatBtn.addEventListener('click', () => {
    showPopup({
      iconClass: 'fa-solid fa-circle-check',
      color: 'var(--success-color)',
      bg: 'var(--success-glow)',
      title: '상담 세션 종료',
      body: '고객과의 상담을 최종 완료 및 종료하시겠습니까?<br><span style="font-size:11px;color:var(--text-tertiary);">* 상담 이력은 티켓 통계 및 리포트 분석에 자동 기록됩니다.</span>',
      buttons: [
        {
          text: '상담 종료 완료',
          type: 'primary',
          action: () => {
            triggerIslandNotification('상담 세션 안전 기록됨', 'fa-solid fa-cloud-arrow-up');
            
            clearInterval(chatElapsedInterval);
            chatInterface.classList.remove('active');
            isChatActive = false;
            
            ongoingChats = 0;
            valOngoing.textContent = '0';
            
            // Clear bubbles back to default
            chatHistory.innerHTML = `<div class="msg-bubble customer">안녕하세요. 이번 달 청구 요금제 플랜을 변경하고 싶은데 소유자 계정만 변경 가능한가요?</div>`;
            
            renderChatTabs();
            showToast('상담이 공식 종료되었으며, 후처리가 등록되었습니다.');
          }
        },
        {
          text: '계속 상담',
          type: 'secondary'
        }
      ]
    });
  });

  // --- 11. [NEW] Live Settings & Member Management ---

  // Toggles and Selects logic
  document.getElementById('two-step-toggle').addEventListener('change', (e) => {
    const active = e.target.checked;
    showToast(`2단계 로그인 인증 수단이 ${active ? '활성화' : '비활성화'} 처리되었습니다.`);
  });

  document.getElementById('auto-logout-select').addEventListener('change', (e) => {
    const hrs = e.target.value;
    showToast(`보안 자동 로그아웃 임계시간이 ${hrs}시간으로 단축/연장되었습니다.`);
  });

  // Member Management selects
  function hookMemberSelects() {
    document.querySelectorAll('.member-role-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const memberId = sel.getAttribute('data-member');
        const role = sel.value;
        const name = memberId === 'taehee' ? '김태희' : '박서진';
        const badge = document.getElementById(`badge-${memberId}`);
        const row = document.getElementById(`member-row-${memberId}`);
        
        if (role === 'remove') {
          // Confirm Kick popup
          showPopup({
            iconClass: 'fa-solid fa-user-xmark',
            color: 'var(--error-color)',
            bg: 'var(--error-glow)',
            title: '멤버 워크플레이스 퇴장',
            body: `정말로 [${name}] 계정을 워크플레이스에서 강제 퇴장(강퇴)시키겠습니까?<br><span style="font-size:11px;color:var(--text-tertiary);">* 퇴장 시 해당 계정에 할당된 모든 상담 배분이 자동 회수 처리됩니다.</span>`,
            buttons: [
              {
                text: '강제 퇴장 확정',
                type: 'primary',
                action: () => {
                  row.remove();
                  activeMemberCount--;
                  memberCount.textContent = activeMemberCount;
                  showToast(`${name}님이 워크플레이스에서 퇴장 처리되었습니다.`);
                  triggerIslandNotification('멤버 정보 정리 완료', 'fa-solid fa-user-minus');
                }
              },
              {
                text: '취소',
                type: 'secondary',
                action: () => {
                  // Revert selector
                  sel.value = badge.textContent === '관리자' ? 'admin' : 'member';
                }
              }
            ]
          });
        } else {
          // Promote/Demote
          if (role === 'admin') {
            badge.className = 'member-item-badge admin';
            badge.textContent = '관리자';
            showToast(`${name}님의 직급이 [관리자]로 승격되었습니다.`);
          } else {
            badge.className = 'member-item-badge';
            badge.textContent = '멤버';
            showToast(`${name}님의 직급이 [일반 멤버]로 변경되었습니다.`);
          }
        }
      });
    });
  }
  hookMemberSelects();

  // Invite new member trigger
  inviteMemberBtn.addEventListener('click', () => {
    showPopup({
      iconClass: 'fa-solid fa-envelope-open-text',
      color: 'var(--primary-color)',
      bg: 'var(--primary-glow)',
      title: '새로운 상담원 멤버 초대',
      body: `
        <div style="text-align: left; display:flex; flex-direction:column; gap:6px; margin-top:8px;">
          <label style="font-size:11px; font-weight:700; color:var(--text-secondary);">초대할 계정 이메일</label>
          <input type="email" id="invite-email" class="input-field" placeholder="invite@domain.com" style="padding:10px 12px; font-size:12px;">
        </div>
      `,
      buttons: [
        {
          text: '초대 링크 발송',
          type: 'primary',
          action: () => {
            const emailInputVal = document.getElementById('invite-email').value.trim();
            if (!emailInputVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInputVal)) {
              showToast('올바른 초대 메일 형식이 아닙니다.');
              return;
            }
            
            showToast(`${emailInputVal} 계정으로 공식 가입 초대 링크가 발송되었습니다. [8.2 정책 적용]`);
            triggerIslandNotification('초대 이메일 발송 완료', 'fa-solid fa-paper-plane');
          }
        },
        {
          text: '취소',
          type: 'secondary'
        }
      ]
    });
  });

  // --- 12. Sandbox Controller Custom Handlers ---
  document.querySelectorAll('.policy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const policy = btn.getAttribute('data-policy');
      
      switch(policy) {
        case 'wrong-pw':
          showPopup({
            iconClass: 'fa-solid fa-triangle-exclamation',
            color: 'var(--warning-color)',
            bg: 'hsla(38, 92%, 50%, 0.15)',
            title: '로그인 실패',
            body: '이메일 또는 비밀번호를 확인해주세요.<br><span style="font-size:11px;color:var(--text-tertiary);">* 5회 오류 시 보안 잠금 상태로 전환됩니다. [3-2]</span>',
            buttons: [
              {
                text: '확인',
                type: 'primary',
                action: () => showToast('비밀번호를 정확히 다시 작성해보세요.')
              }
            ]
          });
          break;
          
        case 'too-many-fails':
          showPopup({
            iconClass: 'fa-solid fa-circle-xmark',
            color: 'var(--error-color)',
            bg: 'var(--error-glow)',
            title: '비밀번호 오류 횟수 초과',
            body: '비밀번호 오류 횟수가 5회 초과하였습니다.<br>보안 정책에 따라 이 계정의 로그인이 일시 차단되며, <strong>비밀번호 재설정</strong> 완료 후 정상 이용이 가능합니다. [3-3]',
            buttons: [
              {
                text: '비밀번호 재설정 화면 이동',
                type: 'primary',
                action: () => {
                  switchScreen('forgot-pw');
                  resetForgotPwWorkflow();
                  showToast('비밀번호 찾기 / 재설정 화면으로 직접 이동했습니다.');
                }
              },
              {
                text: '취소',
                type: 'secondary'
              }
            ]
          });
          break;
          
        case 'withdrawn-acc':
          showPopup({
            iconClass: 'fa-solid fa-user-minus',
            color: 'var(--error-color)',
            bg: 'var(--error-glow)',
            title: '탈퇴 처리된 계정',
            body: '해당 이메일은 탈퇴 처리된 계정입니다.<br>개인정보 처리 및 보안 방침에 따라 <strong>탈퇴일로부터 7일간</strong> 동일 계정으로의 재가입 및 로그인이 제한됩니다. [3-4]',
            buttons: [
              {
                text: '확인',
                type: 'primary'
              }
            ]
          });
          break;

        case 'pw-expired':
          showPopup({
            iconClass: 'fa-solid fa-circle-exclamation',
            color: 'var(--warning-color)',
            bg: 'hsla(38, 92%, 50%, 0.15)',
            title: '비밀번호 변경 주기 만료',
            body: '비밀번호 변경 후 90일이 경과하였습니다.<br>보안 정책에 따라 안전을 위해 비밀번호를 변경해주시기 바랍니다. [3-5]',
            buttons: [
              {
                text: '비밀번호 변경하기',
                type: 'primary',
                action: () => {
                  switchScreen('forgot-pw');
                  resetForgotPwWorkflow();
                  showToast('비밀번호 변경 화면으로 이동했습니다.');
                }
              },
              {
                text: '다음에 하기',
                type: 'secondary',
                action: () => {
                  showToast('비밀번호 변경 주기가 초기화되었습니다. (90일 재연장)');
                }
              }
            ]
          });
          break;

        case 'account-disabled':
          showPopup({
            iconClass: 'fa-solid fa-user-slash',
            color: 'var(--error-color)',
            bg: 'var(--error-glow)',
            title: '계정 비활성화 상태',
            body: '비활성화된 계정입니다. 워크플레이스 최고 관리자에게 문의해주십시오. [3-6]',
            buttons: [
              {
                text: '확인',
                type: 'primary'
              }
            ]
          });
          break;

        case 'ip-restricted':
          showPopup({
            iconClass: 'fa-solid fa-network-wired',
            color: 'var(--error-color)',
            bg: 'var(--error-glow)',
            title: '접속 허용 IP 제한',
            body: '허용되지 않은 IP 대역에서의 접속 시도입니다.<br>사내망 연결 또는 허용 IP 범위를 관리자 설정에서 확인해주십시오. [3-7]',
            buttons: [
              {
                text: '확인',
                type: 'primary'
              }
            ]
          });
          break;
          
        case 'double-login':
          showPopup({
            iconClass: 'fa-solid fa-triangle-exclamation',
            color: 'var(--warning-color)',
            bg: 'hsla(38, 92%, 50%, 0.15)',
            title: '중복 로그인 감지',
            body: '다른 기기나 브라우저에서 이미 동일 계정으로 로그인되어 있습니다.<br>기존 연결을 강제 종료하고, 이 기기에서 로그인을 계속 진행하시겠습니까? [3-8]',
            buttons: [
              {
                text: '이어서 로그인',
                type: 'primary',
                action: () => {
                  isLoggedIn = true;
                  switchScreen('home');
                  showToast('이전 기기 세션을 종료하고 새 로그인을 열었습니다.');
                  triggerIslandNotification('중복 로그인 성공', 'fa-solid fa-circle-check');
                }
              },
              {
                text: '취소',
                type: 'secondary'
              }
            ]
          });
          break;

        case 'force-logout-other':
          if (!isLoggedIn) {
            showToast('자동 로그아웃을 테스트하려면 먼저 앱에 로그인해주세요!');
            return;
          }
          showPopup({
            iconClass: 'fa-solid fa-circle-xmark',
            color: 'var(--error-color)',
            bg: 'var(--error-glow)',
            title: '중복 기기 로그인 접속 세션 종료',
            body: '다른 기기 또는 브라우저에서 동일한 계정으로 로그인되어 세션 정보가 끊어졌습니다.<br>안전을 위해 로그아웃 처리됩니다. [7-1]',
            buttons: [
              {
                text: '확인',
                type: 'primary',
                action: () => {
                  handleLogout();
                }
              }
            ]
          });
          break;
          
        case 'auto-logout':
          if (!isLoggedIn) {
            showToast('자동 로그아웃을 테스트하려면 먼저 앱에 로그인해주세요!');
            return;
          }
          showPopup({
            iconClass: 'fa-solid fa-clock',
            color: 'var(--error-color)',
            bg: 'var(--error-glow)',
            title: '보안 자동 로그아웃',
            body: '보안 관리자가 설정한 자동 로그아웃 시간(6시간)이 만료되어 세션 정보가 종료되었습니다. 안전을 위해 다시 로그인해주십시오. [7-2]',
            buttons: [
              {
                text: '다시 로그인하기',
                type: 'primary',
                action: () => {
                  handleLogout();
                }
              }
            ]
          });
          break;

        case 'force-logout-permission':
          if (!isLoggedIn) {
            showToast('자동 로그아웃을 테스트하려면 먼저 앱에 로그인해주세요!');
            return;
          }
          showPopup({
            iconClass: 'fa-solid fa-user-shield',
            color: 'var(--error-color)',
            bg: 'var(--error-glow)',
            title: '워크플레이스 권한 변경 세션 만료',
            body: '해당 워크플레이스 내 소유자/관리자 권한 또는 보안 규칙이 변경되어 보안 세션 유지를 위해 로그아웃 처리됩니다. [7-3]',
            buttons: [
              {
                text: '확인',
                type: 'primary',
                action: () => {
                  handleLogout();
                }
              }
            ]
          });
          break;
      }
    });
  });

  // ==========================================
  // --- '내정보 설정' (My Info Settings) Screen logic ---
  // ==========================================

  // Elements
  const goMyInfoBtn = document.getElementById('go-to-myinfo-btn');
  const myinfoBackBtn = document.getElementById('myinfo-back-btn');
  
  // Sandbox test controls
  const testUserRoleSelect = document.getElementById('test-user-role');
  const testOngoingChatCheckbox = document.getElementById('test-ongoing-chat');

  // Name Editing
  const myinfoNameInput = document.getElementById('myinfo-name-input');
  const myinfoNameError = document.getElementById('myinfo-name-error');
  const myinfoNameActions = document.getElementById('myinfo-name-actions');
  const myinfoNameCancel = document.getElementById('myinfo-name-cancel');
  const myinfoNameSave = document.getElementById('myinfo-name-save');
  const myinfoRoleTxt = document.getElementById('myinfo-role-txt');
  const myinfoBadgeRole = document.getElementById('myinfo-badge-role');
  const profileNameEl = document.querySelector('.profile-name');
  const profileRoleEl = document.querySelector('.profile-role');

  // Password Modal
  const myinfoChangePwBtn = document.getElementById('myinfo-change-pw-btn');
  const myinfoPwModal = document.getElementById('myinfo-pw-modal');
  const myinfoCurrPw = document.getElementById('myinfo-curr-pw');
  const myinfoNewPw = document.getElementById('myinfo-new-pw');
  const myinfoConfirmPw = document.getElementById('myinfo-confirm-pw');
  const myinfoCurrPwError = document.getElementById('myinfo-curr-pw-error');
  const myinfoNewPwError = document.getElementById('myinfo-new-pw-error');
  const myinfoConfirmPwError = document.getElementById('myinfo-confirm-pw-error');
  const myinfoPwCancel = document.getElementById('myinfo-pw-cancel');
  const myinfoPwSubmit = document.getElementById('myinfo-pw-submit');

  const myinfoRuleLength = document.getElementById('myinfo-rule-length');
  const myinfoRuleLower = document.getElementById('myinfo-rule-lower');
  const myinfoRuleUpper = document.getElementById('myinfo-rule-upper');
  const myinfoRuleNumber = document.getElementById('myinfo-rule-number');
  const myinfoRuleSpecial = document.getElementById('myinfo-rule-special');
  const myinfoRuleMatch = document.getElementById('myinfo-rule-match');

  // Phone Modal
  const myinfoChangePhoneBtn = document.getElementById('myinfo-change-phone-btn');
  const myinfoPhoneModal = document.getElementById('myinfo-phone-modal');
  const myinfoPhoneInput = document.getElementById('myinfo-phone-input');
  const myinfoPhoneSendBtn = document.getElementById('myinfo-phone-send-btn');
  const myinfoPhoneError = document.getElementById('myinfo-phone-error');
  const myinfoPhoneCodeGroup = document.getElementById('myinfo-phone-code-group');
  const myinfoPhoneCodeInput = document.getElementById('myinfo-phone-code-input');
  const myinfoPhoneVerifyBtn = document.getElementById('myinfo-phone-verify-btn');
  const myinfoPhoneTimerBox = document.getElementById('myinfo-phone-timer-box');
  const myinfoPhoneTimerTxt = document.getElementById('myinfo-phone-timer-txt');
  const myinfoPhoneResendBtn = document.getElementById('myinfo-phone-resend-btn');
  const myinfoPhoneCodeError = document.getElementById('myinfo-phone-code-error');
  const myinfoPhoneCancel = document.getElementById('myinfo-phone-cancel');
  const myinfoPhoneSubmit = document.getElementById('myinfo-phone-submit');
  const myinfoPhoneTxt = document.getElementById('myinfo-phone-txt');

  // Withdrawal
  const myinfoWithdrawBtn = document.getElementById('myinfo-withdraw-btn');

  // State variables
  let currentMockRole = 'owner'; // default
  let hasOngoingChatMock = false; // default
  let currentSavedName = '권예은';
  let phoneAttemptCount = 0;
  let phoneTimerInterval = null;
  let phoneVerificationCode = "";
  let isPhoneVerified = false;

  // --- A. Navigation & Switching ---
  if (goMyInfoBtn) {
    goMyInfoBtn.addEventListener('click', () => {
      switchScreen('myinfo-settings');
      syncRoleUI();
    });
  }

  if (myinfoBackBtn) {
    myinfoBackBtn.addEventListener('click', () => {
      switchScreen('mypage');
    });
  }

  // --- B. Sandbox Test Controls Sync ---
  if (testUserRoleSelect) {
    testUserRoleSelect.addEventListener('change', () => {
      currentMockRole = testUserRoleSelect.value;
      syncRoleUI();
      showToast(`역할이 '${currentMockRole === 'owner' ? '소유자' : currentMockRole === 'admin' ? '관리자' : '멤버'}'(으)로 테스트 변경되었습니다.`);
    });
  }

  if (testOngoingChatCheckbox) {
    testOngoingChatCheckbox.addEventListener('change', () => {
      hasOngoingChatMock = testOngoingChatCheckbox.checked;
      showToast(`진행 중인 상담 여부가 '${hasOngoingChatMock ? '있음' : '없음'}'(으)로 테스트 변경되었습니다.`);
    });
  }

  function syncRoleUI() {
    let roleText = '소유자';
    let roleClass = 'owner';
    if (currentMockRole === 'admin') {
      roleText = '관리자';
      roleClass = 'admin';
    } else if (currentMockRole === 'member') {
      roleText = '멤버';
      roleClass = 'member';
    }

    // Update Profile Card
    if (profileRoleEl) {
      profileRoleEl.textContent = `워크플레이스 ${roleText}`;
    }

    // Update Settings Page
    if (myinfoRoleTxt) {
      myinfoRoleTxt.textContent = roleText;
      myinfoRoleTxt.className = `user-badge ${roleClass}`;
    }
    if (myinfoBadgeRole) {
      myinfoBadgeRole.textContent = roleText;
      myinfoBadgeRole.className = `user-badge ${roleClass}`;
      myinfoBadgeRole.style.margin = '0 auto';
    }

    // SNS / Email PW change toggle policy (SNS vs Email)
    const pwRow = document.getElementById('myinfo-password-group-row');
    if (pwRow) {
      const emailTxt = document.getElementById('myinfo-email-txt');
      if (currentMockRole === 'member') {
        // Mocking member as an SNS Google login type
        pwRow.style.display = 'none'; // hidden for SNS users
        if (emailTxt) {
          emailTxt.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; background: #fee500; color: #3c1e1e;">
                <i class="fa-solid fa-comment" style="font-size: 9px;"></i> 카카오 연동
              </span>
              <span style="font-size: 12px; font-weight: 500; color: var(--text-primary);">member@kakao.com</span>
            </div>
          `;
        }
      } else if (currentMockRole === 'admin') {
        pwRow.style.display = 'block';
        if (emailTxt) {
          emailTxt.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; background: #03c75a; color: #fff;">
                N 네이버 연동
              </span>
              <span style="font-size: 12px; font-weight: 500; color: var(--text-primary);">admin@naver.com</span>
            </div>
          `;
        }
      } else {
        pwRow.style.display = 'block';
        if (emailTxt) {
          emailTxt.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; background: #ea4335; color: #fff;">
                <i class="fa-brands fa-google" style="font-size: 9px;"></i> 구글 연동
              </span>
              <span style="font-size: 12px; font-weight: 500; color: var(--text-primary);">twc1234@thewc.co.kr</span>
            </div>
          `;
        }
      }
    }
  }

  // --- C. Name Editing with Validations ---
  if (myinfoNameInput) {
    myinfoNameInput.addEventListener('input', () => {
      let val = myinfoNameInput.value;
      
      // 1. Intercept special characters physically
      const cleanVal = val.replace(/[^a-zA-Z0-9가-힣\s]/g, '');
      if (val !== cleanVal) {
        myinfoNameInput.value = cleanVal;
        val = cleanVal;
        showToast('한글, 영문, 숫자만 입력할 수 있습니다.');
      }
      
      // 2. Intercept and truncate 20+ length physically
      if (val.length > 20) {
        myinfoNameInput.value = val.substring(0, 20);
        val = val.substring(0, 20);
        showToast('이름은 최대 20자까지 입력 가능합니다.');
      }

      const trimmedVal = val.trim();
      const parentGroup = document.getElementById('myinfo-name-group');
      
      // Show action buttons when modified
      if (trimmedVal !== currentSavedName) {
        myinfoNameActions.style.display = 'flex';
      } else {
        myinfoNameActions.style.display = 'none';
      }

      // Realtime validation
      let hasError = false;
      let errorMsgText = "";

      if (trimmedVal.length === 0) {
        hasError = true;
        errorMsgText = "필수 입력 항목입니다.";
      }

      if (hasError) {
        parentGroup.classList.add('has-error');
        myinfoNameError.querySelector('.text').textContent = errorMsgText;
        myinfoNameSave.disabled = true;
      } else {
        parentGroup.classList.remove('has-error');
        myinfoNameSave.disabled = false;
      }
    });

    myinfoNameCancel.addEventListener('click', () => {
      myinfoNameInput.value = currentSavedName;
      const parentGroup = document.getElementById('myinfo-name-group');
      parentGroup.classList.remove('has-error');
      myinfoNameActions.style.display = 'none';
      showToast('이름 변경이 취소되었습니다.');
    });

    myinfoNameSave.addEventListener('click', () => {
      const val = myinfoNameInput.value.trim();
      if (val.length === 0 || !/^[a-zA-Z0-9가-힣\s]+$/.test(val)) return;

      currentSavedName = val;
      myinfoNameActions.style.display = 'none';
      
      // Update global profile views
      if (profileNameEl) profileNameEl.textContent = val;
      const dashboardHeader = document.querySelector('.home-header h2');
      if (dashboardHeader) dashboardHeader.textContent = `${val}님`;

      // Update avatar initials
      const avatars = document.querySelectorAll('.avatar-wrapper, .member-item-avatar');
      avatars.forEach(av => {
        if (av.textContent.trim().length === 1 && (av.textContent.trim() === '권' || av.textContent.trim() === currentSavedName.charAt(0))) {
          av.textContent = val.charAt(0);
        }
      });

      showToast(`이름이 '${val}'(으)로 저장 완료되었습니다.`);
    });
  }

  // --- D. Password Change Modal Logic ---
  // Masking toggles for change password modal
  function setupMaskingToggle(btnEl, inputEl, eyeEl) {
    if (btnEl && inputEl && eyeEl) {
      btnEl.addEventListener('click', () => {
        const isMasked = inputEl.getAttribute('type') === 'password';
        if (isMasked) {
          inputEl.setAttribute('type', 'text');
          eyeEl.className = 'fa-solid fa-eye-slash';
        } else {
          inputEl.setAttribute('type', 'password');
          eyeEl.className = 'fa-solid fa-eye';
        }
      });
    }
  }
  setupMaskingToggle(document.getElementById('myinfo-toggle-curr-pw'), myinfoCurrPw, document.getElementById('myinfo-eye-curr'));
  setupMaskingToggle(document.getElementById('myinfo-toggle-new-pw'), myinfoNewPw, document.getElementById('myinfo-eye-new'));
  setupMaskingToggle(document.getElementById('myinfo-toggle-confirm-pw'), myinfoConfirmPw, document.getElementById('myinfo-eye-confirm'));

  if (myinfoChangePwBtn) {
    myinfoChangePwBtn.addEventListener('click', () => {
      myinfoPwModal.classList.add('active');
      resetPwModalState();
    });
  }

  if (myinfoPwCancel) {
    myinfoPwCancel.addEventListener('click', () => {
      myinfoPwModal.classList.remove('active');
    });
  }

  function resetPwModalState() {
    myinfoCurrPw.value = "";
    myinfoNewPw.value = "";
    myinfoConfirmPw.value = "";
    
    // reset masking
    myinfoCurrPw.setAttribute('type', 'password');
    myinfoNewPw.setAttribute('type', 'password');
    myinfoConfirmPw.setAttribute('type', 'password');
    document.getElementById('myinfo-eye-curr').className = 'fa-solid fa-eye';
    document.getElementById('myinfo-eye-new').className = 'fa-solid fa-eye';
    document.getElementById('myinfo-eye-confirm').className = 'fa-solid fa-eye';

    const groups = ['myinfo-curr-pw-group', 'myinfo-new-pw-group', 'myinfo-confirm-pw-group'];
    groups.forEach(g => {
      const el = document.getElementById(g);
      if (el) {
        el.classList.remove('has-error');
        el.classList.remove('has-success');
      }
    });

    const rules = [myinfoRuleLength, myinfoRuleLower, myinfoRuleUpper, myinfoRuleNumber, myinfoRuleSpecial, myinfoRuleMatch];
    rules.forEach(r => {
      if (r) {
        r.className = '';
        r.querySelector('i').className = 'fa-solid fa-circle-dot';
      }
    });
    myinfoPwSubmit.disabled = true;
  }

  function checkMyInfoPwRules() {
    const currVal = myinfoCurrPw.value;
    const newVal = myinfoNewPw.value;
    const confVal = myinfoConfirmPw.value;

    let isLength = newVal.length >= 8 && newVal.length <= 90;
    let isLower = /[a-z]/.test(newVal);
    let isUpper = /[A-Z]/.test(newVal);
    let isNumber = /[0-9]/.test(newVal);
    let isSpecial = /[`!@#$%^&*()_+\-=\[\]{}|;:'",.<>\/?]/.test(newVal);
    let isMatch = newVal.length > 0 && newVal === confVal;

    // Repeats check (5 consecutive identical digits or chars)
    let hasRepeatPattern = /(.)\1{4}/.test(newVal);
    const newGroup = document.getElementById('myinfo-new-pw-group');
    
    if (newVal.length > 0) {
      if (hasRepeatPattern) {
        isLength = false; // invalidate
        if (newGroup) {
          newGroup.classList.add('has-error');
          const errText = document.getElementById('myinfo-new-pw-error');
          if (errText) errText.querySelector('.text').textContent = '동일 문자/숫자를 5회 연속 반복하여 사용할 수 없습니다.';
        }
      } else {
        if (newGroup) newGroup.classList.remove('has-error');
      }
    } else {
      if (newGroup) newGroup.classList.remove('has-error');
    }

    function toggleRule(el, isValid) {
      if (el) {
        const icon = el.querySelector('i');
        if (isValid) {
          el.className = 'valid';
          icon.className = 'fa-solid fa-circle-check';
        } else {
          el.className = '';
          icon.className = 'fa-solid fa-circle-dot';
        }
      }
    }

    toggleRule(myinfoRuleLength, isLength);
    toggleRule(myinfoRuleLower, isLower);
    toggleRule(myinfoRuleUpper, isUpper);
    toggleRule(myinfoRuleNumber, isNumber);
    toggleRule(myinfoRuleSpecial, isSpecial);
    toggleRule(myinfoRuleMatch, isMatch);

    // Dynamic error message for match confirm input
    const confGroup = document.getElementById('myinfo-confirm-pw-group');
    if (confVal.length > 0) {
      if (!isMatch) {
        confGroup.classList.add('has-error');
        myinfoConfirmPwError.querySelector('.text').textContent = '새 비밀번호가 일치하지 않습니다.';
      } else {
        confGroup.classList.remove('has-error');
        confGroup.classList.add('has-success');
      }
    } else {
      confGroup.classList.remove('has-error');
      confGroup.classList.remove('has-success');
    }

    const allValid = isLength && isLower && isUpper && isNumber && isSpecial && isMatch && currVal.length > 0 && !hasRepeatPattern;
    myinfoPwSubmit.disabled = !allValid;
  }

  myinfoCurrPw.addEventListener('input', checkMyInfoPwRules);
  myinfoNewPw.addEventListener('input', checkMyInfoPwRules);
  myinfoConfirmPw.addEventListener('input', checkMyInfoPwRules);

  if (myinfoPwSubmit) {
    myinfoPwSubmit.addEventListener('click', () => {
      const currVal = myinfoCurrPw.value;
      const newVal = myinfoNewPw.value;

      // 1. Current password check
      if (currVal !== customPassword) {
        const currGroup = document.getElementById('myinfo-curr-pw-group');
        currGroup.classList.add('has-error');
        myinfoCurrPwError.querySelector('.text').textContent = '현재 비밀번호가 일치하지 않습니다.';
        return;
      }

      // 2. Collision policy check (new pw same as current)
      if (newVal === customPassword) {
        showPopup({
          iconClass: 'fa-solid fa-triangle-exclamation',
          color: 'var(--warning-color)',
          bg: 'hsla(38, 92%, 50%, 0.15)',
          title: '비밀번호 변경 불가',
          body: '현재 비밀번호와 동일한 새 비밀번호로는 변경할 수 없습니다. [C01]',
          buttons: [
            {
              text: '확인',
              type: 'primary'
            }
          ]
        });
        return;
      }

      // Success
      myinfoPwSubmit.disabled = true;
      myinfoPwSubmit.textContent = "변경 중...";
      
      setTimeout(() => {
        customPassword = newVal; // update internal credential
        myinfoPwModal.classList.remove('active');
        myinfoPwSubmit.textContent = "변경";
        
        // Show success alert dialog
        showPopup({
          iconClass: 'fa-solid fa-circle-check',
          color: 'var(--success-color)',
          bg: 'var(--success-glow)',
          title: '비밀번호 변경 완료',
          body: '정상적으로 비밀번호 변경이 완료되었습니다. [C02]',
          buttons: [
            {
              text: '확인',
              type: 'primary'
            }
          ]
        });
        
        const now = new Date();
        const dateStr = `${now.getFullYear()}. ${String(now.getMonth() + 1).padStart(2, '0')}. ${String(now.getDate()).padStart(2, '0')}`;
        document.getElementById('myinfo-pw-last-changed').textContent = `최종 변경일: ${dateStr} (0일 경과)`;
      }, 1000);
    });
  }

  // --- E. Phone Number Change Modal Logic ---
  // Input hyphen auto formatter
  if (myinfoPhoneInput) {
    myinfoPhoneInput.addEventListener('input', () => {
      const parentGroup = document.getElementById('myinfo-phone-group');
      if (phoneAttemptCount >= 5) {
        parentGroup.classList.add('has-error');
        myinfoPhoneError.querySelector('.text').textContent = '인증번호는 1일 최대 5회까지 발송 가능합니다.';
        myinfoPhoneSendBtn.disabled = true;
        return;
      }

      let val = myinfoPhoneInput.value.replace(/[^0-9]/g, '');
      
      // Auto formatting 3-4-4
      if (val.length > 3 && val.length <= 7) {
        val = val.substring(0, 3) + '-' + val.substring(3);
      } else if (val.length > 7) {
        val = val.substring(0, 3) + '-' + val.substring(3, 7) + '-' + val.substring(7, 11);
      }
      myinfoPhoneInput.value = val;

      const isValid = /^\d{3}-\d{4}-\d{4}$/.test(val);

      if (val.length > 0 && !isValid) {
        parentGroup.classList.add('has-error');
        myinfoPhoneError.querySelector('.text').textContent = '휴대폰 번호를 확인하세요.';
        myinfoPhoneSendBtn.disabled = true;
      } else {
        parentGroup.classList.remove('has-error');
        myinfoPhoneSendBtn.disabled = !isValid;
      }
    });
  }

  if (myinfoChangePhoneBtn) {
    myinfoChangePhoneBtn.addEventListener('click', () => {
      myinfoPhoneModal.classList.add('active');
      resetPhoneModalState();
    });
  }

  if (myinfoPhoneCancel) {
    myinfoPhoneCancel.addEventListener('click', () => {
      myinfoPhoneModal.classList.remove('active');
      clearInterval(phoneTimerInterval);
    });
  }

  function resetPhoneModalState() {
    myinfoPhoneInput.value = "";
    myinfoPhoneInput.disabled = false;
    myinfoPhoneSendBtn.disabled = true;
    myinfoPhoneSendBtn.textContent = "보내기";
    myinfoPhoneSendBtn.className = "btn btn-primary";
    myinfoPhoneSendBtn.onclick = null;
    
    myinfoPhoneCodeGroup.style.display = "none";
    myinfoPhoneCodeInput.value = "";
    myinfoPhoneCodeInput.disabled = true;
    myinfoPhoneVerifyBtn.disabled = true;
    myinfoPhoneSubmit.disabled = true;

    const groups = ['myinfo-phone-group', 'myinfo-phone-code-group'];
    groups.forEach(g => {
      const el = document.getElementById(g);
      if (el) {
        el.classList.remove('has-error');
        el.classList.remove('has-success');
      }
    });

    isPhoneVerified = false;
    clearInterval(phoneTimerInterval);

    if (phoneAttemptCount >= 5) {
      myinfoPhoneInput.disabled = true;
      myinfoPhoneSendBtn.disabled = true;
      const parent = document.getElementById('myinfo-phone-group');
      if (parent) {
        parent.classList.add('has-error');
        myinfoPhoneError.querySelector('.text').textContent = '인증번호는 1일 최대 5회까지 발송 가능합니다.';
      }
    }
  }

  // Send verification code
  if (myinfoPhoneSendBtn) {
    myinfoPhoneSendBtn.addEventListener('click', () => {
      const phoneNum = myinfoPhoneInput.value;

      // Check duplicate with current phone number
      if (phoneNum === myinfoPhoneTxt.textContent) {
        const parent = document.getElementById('myinfo-phone-group');
        parent.classList.add('has-error');
        myinfoPhoneError.querySelector('.text').textContent = '현재 등록된 휴대폰 번호와 동일합니다.';
        return;
      }

      // Check max attempts
      if (phoneAttemptCount >= 5) {
        const parent = document.getElementById('myinfo-phone-group');
        parent.classList.add('has-error');
        myinfoPhoneError.querySelector('.text').textContent = '인증번호는 1일 최대 5회까지 발송 가능합니다.';
        return;
      }

      phoneAttemptCount++;
      sendSMSCodeSimulated();
    });
  }

  if (myinfoPhoneResendBtn) {
    myinfoPhoneResendBtn.addEventListener('click', () => {
      if (phoneAttemptCount >= 5) {
        showToast('하루에 최대 5회만 인증번호 전송이 가능합니다!');
        return;
      }
      phoneAttemptCount++;
      sendSMSCodeSimulated();
    });
  }

  function sendSMSCodeSimulated() {
    showToast('인증번호 SMS 문자를 전송했습니다.');
    
    // Generate simulated 6-digit verification code
    phoneVerificationCode = String(Math.floor(100000 + Math.random() * 900000));
    console.log(`[CG SMS Debug] Verification code: ${phoneVerificationCode}`);
    
    // Show verification island alert
    triggerIslandNotification(`SMS 인증번호: ${phoneVerificationCode}`, 'fa-solid fa-comment-sms', 4000);

    // Disable phone input
    myinfoPhoneInput.disabled = true;
    
    // Toggle send button to "재입력" (Reset / Edit phone number)
    myinfoPhoneSendBtn.textContent = "재입력";
    myinfoPhoneSendBtn.className = "btn btn-secondary";
    myinfoPhoneSendBtn.onclick = () => {
      // Re-enable and reset state to input phone number again
      myinfoPhoneInput.disabled = false;
      myinfoPhoneInput.focus();
      myinfoPhoneSendBtn.textContent = "보내기";
      myinfoPhoneSendBtn.className = "btn btn-primary";
      myinfoPhoneSendBtn.onclick = null;
      myinfoPhoneCodeGroup.style.display = "none";
      clearInterval(phoneTimerInterval);
    };

    // Show verification inputs
    myinfoPhoneCodeGroup.style.display = "block";
    myinfoPhoneCodeInput.disabled = false;
    myinfoPhoneCodeInput.value = "";
    myinfoPhoneCodeInput.focus();
    myinfoPhoneVerifyBtn.disabled = true;
    
    // Start countdown timer: 3 minutes (180 seconds)
    let timeLeft = 180;
    const timerBox = document.getElementById('myinfo-phone-timer-box');
    timerBox.className = "timer-box timer-pulsing";
    
    clearInterval(phoneTimerInterval);
    
    function updatePhoneCountdown() {
      const minutes = Math.floor(timeLeft / 60);
      let seconds = timeLeft % 60;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      myinfoPhoneTimerTxt.textContent = `0${minutes}:${seconds}`;

      if (timeLeft <= 0) {
        clearInterval(phoneTimerInterval);
        timerBox.className = "timer-box";
        myinfoPhoneCodeInput.disabled = true;
        myinfoPhoneVerifyBtn.disabled = true;
        
        const codeGroup = document.getElementById('myinfo-phone-code-group');
        codeGroup.classList.add('has-error');
        myinfoPhoneCodeError.querySelector('.text').textContent = '인증 시간이 만료되었습니다. 다시 요청해 주세요.';
      }
      timeLeft--;
    }
    updatePhoneCountdown();
    phoneTimerInterval = setInterval(updatePhoneCountdown, 1000);
  }

  // Enable code verify button
  if (myinfoPhoneCodeInput) {
    myinfoPhoneCodeInput.addEventListener('input', () => {
      const val = myinfoPhoneCodeInput.value.replace(/[^0-9]/g, '');
      myinfoPhoneCodeInput.value = val;
      myinfoPhoneVerifyBtn.disabled = val.length !== 6;
    });
  }

  // Verify Phone Code
  if (myinfoPhoneVerifyBtn) {
    myinfoPhoneVerifyBtn.addEventListener('click', () => {
      const codeVal = myinfoPhoneCodeInput.value.trim();
      const codeGroup = document.getElementById('myinfo-phone-code-group');

      if (codeVal !== phoneVerificationCode) {
        codeGroup.classList.add('has-error');
        myinfoPhoneCodeError.querySelector('.text').textContent = '인증번호가 일치하지 않습니다.';
        return;
      }

      // Success
      clearInterval(phoneTimerInterval);
      codeGroup.classList.remove('has-error');
      codeGroup.classList.add('has-success');
      
      const timerBox = document.getElementById('myinfo-phone-timer-box');
      timerBox.className = "timer-box";
      
      myinfoPhoneCodeInput.disabled = true;
      myinfoPhoneVerifyBtn.disabled = true;
      
      showToast('휴대폰 점유 인증이 완료되었습니다.');
      isPhoneVerified = true;
      myinfoPhoneSubmit.disabled = false;
    });
  }

  // Submit phone change
  if (myinfoPhoneSubmit) {
    myinfoPhoneSubmit.addEventListener('click', () => {
      if (!isPhoneVerified) return;

      const newPhone = myinfoPhoneInput.value;
      myinfoPhoneSubmit.disabled = true;
      myinfoPhoneSubmit.textContent = "변경 중...";

      setTimeout(() => {
        myinfoPhoneTxt.textContent = newPhone;
        myinfoPhoneModal.classList.remove('active');
        myinfoPhoneSubmit.textContent = "변경";

        showPopup({
          iconClass: 'fa-solid fa-circle-check',
          color: 'var(--success-color)',
          bg: 'var(--success-glow)',
          title: '휴대폰 번호 변경 완료',
          body: `휴대폰 번호가 성공적으로 변경되었습니다.<br><strong style="color: var(--primary-color);">${newPhone}</strong>`,
          buttons: [
            {
              text: '확인',
              type: 'primary'
            }
          ]
        });
      }, 1000);
    });
  }

  // --- F. Withdrawal (회원 탈퇴) Flow by Roles ---
  if (myinfoWithdrawBtn) {
    myinfoWithdrawBtn.addEventListener('click', () => {
      // 1. Check Owner Case
      if (currentMockRole === 'owner') {
        showPopup({
          iconClass: 'fa-solid fa-triangle-exclamation',
          color: 'var(--warning-color)',
          bg: 'hsla(38, 92%, 50%, 0.15)',
          title: '회원 탈퇴 불가 안내',
          body: `
            <div style="font-size:12px; line-height:1.45;">
              현재 계정은 <strong>워크플레이스 소유자</strong>로 지정되어 있어 회원 탈퇴를 처리할 수 없습니다.<br>
              탈퇴를 안전하게 마칠 수 있도록 아래 미해결 절차를 먼저 조치하십시오.
              <ul class="deact-instruction-list">
                <li><i class="fa-solid fa-circle-chevron-right" style="color:var(--primary-color);"></i> 워크플레이스의 소유자 권한을 다른 멤버에게 이관</li>
                <li><i class="fa-solid fa-circle-chevron-right" style="color:var(--primary-color);"></i> 본인 명의로 등록된 구독 결제 수단 이관 또는 해지</li>
              </ul>
            </div>
          `,
          buttons: [
            {
              text: '확인',
              type: 'primary'
            }
          ]
        });
        return;
      }

      // 2. Check Has Ongoing Counseling Case (Admin / Member)
      if (hasOngoingChatMock) {
        showPopup({
          iconClass: 'fa-solid fa-triangle-exclamation',
          color: 'var(--warning-color)',
          bg: 'hsla(38, 92%, 50%, 0.15)',
          title: '상담 중 강제 제한',
          body: `
            <div style="font-size:12px; line-height:1.45;">
              현재 아직 종료되지 않은 <strong>인입 상담 세션이 존재</strong>하여 탈퇴가 불가능합니다.<br>
              배정받은 고객 세션을 먼저 원활히 마무리한 다음 다시 시도하십시오.
              <p style="margin-top: 8px; font-weight: 700; color: var(--error-color);">배정 채널: 브랜드01, 브랜드02</p>
            </div>
          `,
          buttons: [
            {
              text: '확인',
              type: 'primary'
            }
          ]
        });
        return;
      }

      // 3. Allowed Deactivation Case (Admin / Member with NO ongoing chats)
      showPopup({
        iconClass: 'fa-solid fa-circle-exclamation',
        color: 'var(--error-color)',
        bg: 'var(--error-glow)',
        title: '정말 탈퇴하시겠습니까?',
        body: `
          <div style="font-size:12px; line-height:1.45; text-align: left;">
            탈퇴를 진행할 경우 본인 계정과 연계된 모든 활동 기록 및 설정 정보는 절대 복구할 수 없으며, 
            클라우드게이트 상담 데스크 서비스 접근이 영구 정지됩니다.
            <div style="margin-top:8px; padding:8px; background:var(--border-color); border-radius:8px; font-size:10px; color:var(--text-secondary);">
              * 탈퇴 승인 후 30일 이내에는 동일 휴대폰/이메일로 재가입이 불가합니다.<br>
              * 계정 정보 보관 및 비밀번호 정보는 즉시 말소 파기 처리됩니다.
            </div>
          </div>
        `,
        buttons: [
          {
            text: '취소',
            type: 'secondary'
          },
          {
            text: '동의 및 탈퇴 승인',
            type: 'primary',
            action: () => {
              // Perform withdrawal log out success
              showToast('탈퇴 프로세스를 가동하여 계정을 폐기 중입니다...');
              
              setTimeout(() => {
                showPopup({
                  iconClass: 'fa-solid fa-circle-check',
                  color: 'var(--success-color)',
                  bg: 'var(--success-glow)',
                  title: '회원 탈퇴 최종 완료',
                  body: '계정 탈퇴 처리가 안전하게 승인 완료되었습니다.<br>클라우드게이트 서비스를 그동안 이용해주셔서 감사드립니다.',
                  buttons: [
                    {
                      text: '로그인 화면으로 이동',
                      type: 'primary',
                      action: () => {
                        handleLogout(); // standard logout in app.js
                      }
                    }
                  ]
                });
              }, 1200);
            }
          }
        ]
      });
    });
  }

  // --- G. Premium Ripple Interaction Binding ---
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn || btn.disabled) return;

    // Create ripple element
    const ripple = document.createElement('span');
    ripple.className = 'ripple';

    // Calculate dimensions
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;

    // Coordinates relative to the button
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    btn.appendChild(ripple);

    // Fade out and cleanup
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  });

});
