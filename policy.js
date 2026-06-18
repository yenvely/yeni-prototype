/**
 * CloudGate 3.0 — 정책서 관리 (policy.js)
 * 3-depth 메뉴, 메뉴 관리 모달, 정책 편집, 테마 전환 등 인터랙션 로직
 */

(function () {
  'use strict';

  // ==========================================
  // DATA MODEL
  // ==========================================
  const menuData = [
    {
      id: 'consulting',
      name: '상담 관리',
      count: 8,
      children: [
        { id: 'call-consulting', name: '콜 상담' },
        { id: 'assign-consulting', name: '배정 상담' }
      ]
    },
    { id: 'dashboard', name: '대시보드', count: 1, children: [] },
    { id: 'midnight-consulting', name: '자정 상담', count: null, children: [] },
    { id: 'customer-info', name: '고객 정보', count: 1, children: [] },
    { id: 'call-management', name: '통화 관리', count: 1, children: [] },
    { id: 'order-integration', name: '주문 연동', count: 1, children: [] },
    { id: 'settings', name: '설정', count: null, children: [] }
  ];

  let activeMenuId = 'call-consulting';

  // ==========================================
  // CLOCK
  // ==========================================
  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const el = document.getElementById('device-time');
    if (el) el.textContent = `${h}:${m}`;
  }
  updateClock();
  setInterval(updateClock, 30000);

  // ==========================================
  // THEME TOGGLE
  // ==========================================
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const html = document.documentElement;
      const isDark = html.getAttribute('data-theme') === 'dark';
      html.setAttribute('data-theme', isDark ? 'light' : 'dark');
      themeToggle.innerHTML = isDark
        ? '<i class="fa-solid fa-moon"></i>'
        : '<i class="fa-solid fa-sun"></i>';
      showToast(isDark ? '라이트 모드로 전환' : '다크 모드로 전환', 'info');
    });
  }

  // ==========================================
  // SIDEBAR: 3-DEPTH ACCORDION MENU
  // ==========================================
  function initSidebarMenu() {
    const menuGroups = document.querySelectorAll('.menu-group');

    menuGroups.forEach(group => {
      const parent = group.querySelector('.menu-parent');
      const children = group.querySelector('.menu-children');

      if (!parent) return;

      // If has children → toggle accordion
      if (children && children.children.length > 0) {
        parent.addEventListener('click', () => {
          // Close other groups
          menuGroups.forEach(other => {
            if (other !== group && other.classList.contains('open')) {
              other.classList.remove('open');
            }
          });
          group.classList.toggle('open');
        });
      }

      // Standalone parents (no children)
      if (parent.classList.contains('standalone')) {
        parent.addEventListener('click', () => {
          setActiveMenu(parent.dataset.menu);
        });
      }
    });

    // Child menu items
    const childItems = document.querySelectorAll('.menu-child');
    childItems.forEach(child => {
      child.addEventListener('click', (e) => {
        e.stopPropagation();
        setActiveMenu(child.dataset.menu);
      });
    });
  }

  function setActiveMenu(menuId) {
    activeMenuId = menuId;

    // Remove all active states
    document.querySelectorAll('.menu-child').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.menu-parent.standalone').forEach(el => el.classList.remove('active'));

    // Set new active
    const childEl = document.querySelector(`.menu-child[data-menu="${menuId}"]`);
    if (childEl) {
      childEl.classList.add('active');
      // Ensure parent is open
      const parentGroup = childEl.closest('.menu-group');
      if (parentGroup) parentGroup.classList.add('open');
    }

    const standaloneEl = document.querySelector(`.menu-parent.standalone[data-menu="${menuId}"]`);
    if (standaloneEl) {
      standaloneEl.classList.add('active');
    }

    showToast(`"${getMenuName(menuId)}" 메뉴로 이동`, 'success');
  }

  function getMenuName(menuId) {
    for (const item of menuData) {
      if (item.id === menuId) return item.name;
      for (const child of item.children) {
        if (child.id === menuId) return child.name;
      }
    }
    return menuId;
  }

  // ==========================================
  // MODAL: MENU MANAGEMENT
  // ==========================================
  const modalOverlay = document.getElementById('modal-menu-manage');
  const modalMenuList = document.getElementById('modal-menu-list');
  const btnMenuManage = document.getElementById('btn-menu-manage');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalAddBtn = document.getElementById('modal-add-btn');
  const newMenuNameInput = document.getElementById('new-menu-name');
  const newMenuPosition = document.getElementById('new-menu-position');

  function openModal() {
    renderModalMenuList();
    updatePositionDropdown();
    modalOverlay.classList.add('active');
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
  }

  if (btnMenuManage) btnMenuManage.addEventListener('click', openModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  // Close on overlay click
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  function renderModalMenuList() {
    if (!modalMenuList) return;
    modalMenuList.innerHTML = '';

    menuData.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'modal-menu-item';
      row.dataset.index = index;

      // Count display
      const countText = item.count !== null && item.count !== undefined ? item.count : '';

      row.innerHTML = `
        <span class="modal-menu-name" title="${item.name}">${item.name} ${item.children.length > 0 ? `<span style="font-size:10px; color: var(--text-tertiary);">(${item.children.length})</span>` : ''}</span>
        ${countText !== '' ? `<span class="modal-menu-count">${countText}</span>` : ''}
        <button class="modal-menu-btn" data-action="up" data-index="${index}" title="위로 이동">
          <i class="fa-solid fa-chevron-up"></i>
        </button>
        <button class="modal-menu-btn" data-action="down" data-index="${index}" title="아래로 이동">
          <i class="fa-solid fa-chevron-down"></i>
        </button>
        <button class="modal-menu-btn" data-action="rename" data-index="${index}" title="이름 변경">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="modal-menu-btn danger" data-action="delete" data-index="${index}" title="삭제">
          <i class="fa-solid fa-trash"></i>
        </button>
      `;

      modalMenuList.appendChild(row);
    });

    // Bind button events
    modalMenuList.querySelectorAll('.modal-menu-btn').forEach(btn => {
      btn.addEventListener('click', handleModalMenuAction);
    });
  }

  function handleModalMenuAction(e) {
    const btn = e.currentTarget;
    const action = btn.dataset.action;
    const index = parseInt(btn.dataset.index, 10);

    switch (action) {
      case 'up':
        if (index > 0) {
          [menuData[index], menuData[index - 1]] = [menuData[index - 1], menuData[index]];
          renderModalMenuList();
          rebuildSidebarMenu();
          showToast('메뉴 순서가 변경되었습니다.', 'success');
        }
        break;

      case 'down':
        if (index < menuData.length - 1) {
          [menuData[index], menuData[index + 1]] = [menuData[index + 1], menuData[index]];
          renderModalMenuList();
          rebuildSidebarMenu();
          showToast('메뉴 순서가 변경되었습니다.', 'success');
        }
        break;

      case 'rename':
        const currentName = menuData[index].name;
        const newName = prompt('새 메뉴 이름을 입력하세요:', currentName);
        if (newName && newName.trim() !== '' && newName !== currentName) {
          menuData[index].name = newName.trim();
          renderModalMenuList();
          rebuildSidebarMenu();
          showToast(`"${currentName}" → "${newName.trim()}" 이름 변경 완료`, 'success');
        }
        break;

      case 'delete':
        const deleteName = menuData[index].name;
        if (confirm(`"${deleteName}" 메뉴를 삭제하시겠습니까?`)) {
          menuData.splice(index, 1);
          renderModalMenuList();
          rebuildSidebarMenu();
          updatePositionDropdown();
          showToast(`"${deleteName}" 메뉴가 삭제되었습니다.`, 'warning');
        }
        break;
    }
  }

  // Add new menu
  if (modalAddBtn) {
    modalAddBtn.addEventListener('click', () => {
      const name = newMenuNameInput.value.trim();
      if (!name) {
        showToast('메뉴 이름을 입력해주세요.', 'error');
        newMenuNameInput.focus();
        return;
      }

      const parentValue = newMenuPosition.value;

      if (parentValue === 'top') {
        // Add as top-level standalone
        menuData.push({
          id: `menu-${Date.now()}`,
          name: name,
          count: 0,
          children: []
        });
      } else {
        // Add as child of parent
        const parentIndex = menuData.findIndex(m => m.id === parentValue);
        if (parentIndex !== -1) {
          menuData[parentIndex].children.push({
            id: `child-${Date.now()}`,
            name: name
          });
        }
      }

      newMenuNameInput.value = '';
      renderModalMenuList();
      rebuildSidebarMenu();
      updatePositionDropdown();
      showToast(`"${name}" 메뉴가 추가되었습니다.`, 'success');
    });
  }

  function updatePositionDropdown() {
    if (!newMenuPosition) return;
    const currentVal = newMenuPosition.value;
    newMenuPosition.innerHTML = '<option value="top">최상위 메뉴</option>';
    menuData.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.id;
      opt.textContent = `${item.name} 하위`;
      newMenuPosition.appendChild(opt);
    });
    // Restore selection if exists
    if (newMenuPosition.querySelector(`option[value="${currentVal}"]`)) {
      newMenuPosition.value = currentVal;
    }
  }

  // Rebuild sidebar HTML from menuData
  function rebuildSidebarMenu() {
    const sidebarMenu = document.getElementById('sidebar-menu');
    if (!sidebarMenu) return;
    sidebarMenu.innerHTML = '';

    menuData.forEach(item => {
      const group = document.createElement('div');
      group.className = 'menu-group';
      group.dataset.group = item.id;

      const hasChildren = item.children && item.children.length > 0;

      // Parent
      const parent = document.createElement('div');
      parent.className = `menu-parent${hasChildren ? '' : ' standalone'}`;
      if (!hasChildren) parent.dataset.menu = item.id;

      const countDisplay = item.count !== null && item.count !== undefined
        ? `<span class="menu-parent-count">${item.count}</span>`
        : '';

      parent.innerHTML = `
        <div class="menu-parent-left">
          <span class="menu-parent-name">${item.name}</span>
          ${countDisplay}
        </div>
        ${hasChildren ? '<i class="fa-solid fa-chevron-right menu-parent-arrow"></i>' : ''}
      `;

      group.appendChild(parent);

      // Children
      if (hasChildren) {
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'menu-children';

        item.children.forEach(child => {
          const childEl = document.createElement('div');
          childEl.className = `menu-child${child.id === activeMenuId ? ' active' : ''}`;
          childEl.dataset.menu = child.id;
          childEl.textContent = child.name;
          childrenContainer.appendChild(childEl);
        });

        group.appendChild(childrenContainer);

        // Open if active child is inside
        if (item.children.some(c => c.id === activeMenuId)) {
          group.classList.add('open');
        }
      } else {
        if (item.id === activeMenuId) {
          parent.classList.add('active');
        }
      }

      sidebarMenu.appendChild(group);
    });

    // Re-init sidebar event listeners
    initSidebarMenu();
  }

  // ==========================================
  // SEARCH
  // ==========================================
  const searchInput = document.getElementById('policy-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      const blocks = document.querySelectorAll('.policy-block');
      let visibleCount = 0;

      blocks.forEach(block => {
        const text = block.textContent.toLowerCase();
        if (!query || text.includes(query)) {
          block.style.display = '';
          visibleCount++;
        } else {
          block.style.display = 'none';
        }
      });

      // Update count badge
      const countBadge = document.querySelector('.count-badge');
      if (countBadge && query) {
        countBadge.textContent = `${visibleCount}건 검색됨`;
      } else if (countBadge) {
        countBadge.textContent = `${blocks.length}건 등록`;
      }
    });
  }

  // ==========================================
  // TAG FILTER TOGGLE
  // ==========================================
  const tagFilters = document.querySelectorAll('.tag-filter');
  tagFilters.forEach(tag => {
    tag.addEventListener('click', () => {
      tag.classList.toggle('active');
    });
  });

  // ==========================================
  // POLICY BLOCK ACTIONS
  // ==========================================
  // Edit buttons
  document.querySelectorAll('.block-action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const icon = btn.querySelector('i');
      if (icon && icon.classList.contains('fa-pen')) {
        showToast('편집 모드가 활성화되었습니다. (데모)', 'info');
      } else if (icon && icon.classList.contains('fa-trash')) {
        const block = btn.closest('.policy-block');
        if (block && confirm('이 정책 블록을 삭제하시겠습니까?')) {
          block.style.transition = 'all 0.3s ease';
          block.style.opacity = '0';
          block.style.transform = 'translateX(-20px)';
          setTimeout(() => {
            block.remove();
            // Update count
            const remaining = document.querySelectorAll('.policy-block').length;
            const countBadge = document.querySelector('.count-badge');
            if (countBadge) countBadge.textContent = `${remaining}건 등록`;
            showToast('정책 블록이 삭제되었습니다.', 'warning');
          }, 300);
        }
      }
    });
  });

  // ==========================================
  // ADD POLICY
  // ==========================================
  const btnAddPolicy = document.getElementById('btn-add-policy');
  if (btnAddPolicy) {
    btnAddPolicy.addEventListener('click', () => {
      const policyContent = document.getElementById('policy-content');
      const section = document.querySelector('.policy-section');
      if (!section) return;

      const blockCount = document.querySelectorAll('.policy-block').length;
      const newId = `P${String(blockCount + 1).padStart(3, '0')}`;

      const newBlock = document.createElement('div');
      newBlock.className = 'policy-block';
      newBlock.id = `policy-block-${blockCount + 1}`;
      newBlock.style.animation = 'fadeIn 0.4s ease';
      newBlock.innerHTML = `
        <div class="block-header">
          <span class="block-id">${newId}</span>
          <span class="block-title">새 정책 블록</span>
          <div class="block-tags">
            <span class="block-tag">#미분류</span>
          </div>
        </div>
        <div class="block-body">
          <div class="block-rule normal">
            <span class="rule-label normal">정상</span>
            <span class="rule-text">새 정책 내용을 입력해주세요.</span>
          </div>
        </div>
        <div class="block-footer">
          <span class="block-meta">
            <i class="fa-regular fa-clock"></i>
            방금 생성됨
          </span>
          <div class="block-actions">
            <button class="block-action-btn"><i class="fa-solid fa-pen"></i> 수정</button>
            <button class="block-action-btn danger"><i class="fa-solid fa-trash"></i> 삭제</button>
          </div>
        </div>
      `;

      section.appendChild(newBlock);

      // Bind actions to new block
      newBlock.querySelectorAll('.block-action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const icon = btn.querySelector('i');
          if (icon && icon.classList.contains('fa-pen')) {
            showToast('편집 모드가 활성화되었습니다. (데모)', 'info');
          } else if (icon && icon.classList.contains('fa-trash')) {
            if (confirm('이 정책 블록을 삭제하시겠습니까?')) {
              newBlock.style.transition = 'all 0.3s ease';
              newBlock.style.opacity = '0';
              newBlock.style.transform = 'translateX(-20px)';
              setTimeout(() => {
                newBlock.remove();
                const remaining = document.querySelectorAll('.policy-block').length;
                const countBadge = document.querySelector('.count-badge');
                if (countBadge) countBadge.textContent = `${remaining}건 등록`;
                showToast('정책 블록이 삭제되었습니다.', 'warning');
              }, 300);
            }
          }
        });
      });

      // Update count
      const totalBlocks = document.querySelectorAll('.policy-block').length;
      const countBadge = document.querySelector('.count-badge');
      if (countBadge) countBadge.textContent = `${totalBlocks}건 등록`;

      // Scroll to new block
      newBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });

      showToast(`새 정책 블록 ${newId}가 추가되었습니다.`, 'success');
    });
  }

  // ==========================================
  // FOOTER BUTTONS
  // ==========================================
  const footerNewVersion = document.getElementById('footer-new-version');
  const footerHistory = document.getElementById('footer-history');
  const btnNewVersion = document.getElementById('btn-new-version');
  const btnHistory = document.getElementById('btn-history');

  if (footerNewVersion) {
    footerNewVersion.addEventListener('click', () => {
      showToast('새 버전이 생성되었습니다. (v2.0)', 'success');
    });
  }

  if (footerHistory) {
    footerHistory.addEventListener('click', () => {
      showToast('과거 이력 패널이 열렸습니다. (데모)', 'info');
    });
  }

  if (btnNewVersion) {
    btnNewVersion.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('새 버전이 생성되었습니다. (v2.0)', 'success');
    });
  }

  if (btnHistory) {
    btnHistory.addEventListener('click', () => {
      showToast('과거 이력 패널이 열렸습니다. (데모)', 'info');
    });
  }

  // ==========================================
  // TOAST NOTIFICATIONS
  // ==========================================
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const iconMap = {
      success: 'fa-circle-check',
      error: 'fa-circle-xmark',
      warning: 'fa-triangle-exclamation',
      info: 'fa-circle-info'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <i class="fa-solid ${iconMap[type] || iconMap.info}" style="font-size: 16px;"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    // Auto-remove after 3s
    setTimeout(() => {
      toast.style.animation = 'toastOut 0.3s forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ==========================================
  // INIT
  // ==========================================
  initSidebarMenu();

})();
