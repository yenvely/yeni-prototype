document.addEventListener('DOMContentLoaded', () => {
  
  // --- UI Elements ---
  const htmlNode = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle');
  const deviceTimeEl = document.getElementById('device-time');
  
  const screenLogin = document.getElementById('screen-login');
  const screenHome = document.getElementById('screen-home');
  const screenMypage = document.getElementById('screen-mypage');
  const bottomNav = document.getElementById('bottom-nav');
  
  const navHome = document.getElementById('nav-home');
  const navMypage = document.getElementById('nav-mypage');
  
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
  
  const popupOverlay = document.getElementById('popup-overlay');
  const popupIconBox = document.getElementById('popup-icon-box');
  const popupTitle = document.getElementById('popup-title');
  const popupBody = document.getElementById('popup-body');
  const popupButtonsContainer = document.getElementById('popup-buttons-container');
  
  const dynamicIsland = document.getElementById('island');
  const islandContent = document.getElementById('island-content');
  const toastContainer = document.getElementById('toast-container');
  
  let isLoggedIn = false;
  
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

  // Automatically focus on email input on load (Accessability guideline)
  if (emailInput) {
    emailInput.focus();
  }

  // --- 3. Password Visibility Toggle ---
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
    const screens = [screenLogin, screenHome, screenMypage];
    screens.forEach(s => s.classList.remove('active'));
    
    if (targetScreenId === 'login') {
      screenLogin.classList.add('active');
      bottomNav.classList.remove('visible');
    } else if (targetScreenId === 'home') {
      screenHome.classList.add('active');
      bottomNav.classList.add('visible');
      navHome.classList.add('active');
      navMypage.classList.remove('active');
    } else if (targetScreenId === 'mypage') {
      screenMypage.classList.add('active');
      bottomNav.classList.add('visible');
      navHome.classList.remove('active');
      navMypage.classList.add('active');
    }
  }

  navHome.addEventListener('click', () => {
    if (isLoggedIn) switchScreen('home');
  });

  navMypage.addEventListener('click', () => {
    if (isLoggedIn) switchScreen('mypage');
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
    
    loginBtn.disabled = true;
    loginSpinner.style.display = 'block';
    loginBtn.querySelector('.btn-text').textContent = '로그인 중...';
    
    triggerIslandNotification('인증 서버 연결 중...', 'fa-solid fa-arrows-spin');
    
    setTimeout(() => {
      isLoggedIn = true;
      loginBtn.disabled = false;
      loginSpinner.style.display = 'none';
      loginBtn.querySelector('.btn-text').textContent = '로그인';
      
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

  // --- 9. Side Sandbox Policy Controller Listeners ---
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
                text: '비밀번호 재설정',
                type: 'primary',
                action: () => {
                  showToast('임시 비밀번호 발송 페이지로 이동을 연출합니다.');
                  triggerIslandNotification('인증 링크 발송 완료', 'fa-solid fa-paper-plane');
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
      }
    });
  });

});
