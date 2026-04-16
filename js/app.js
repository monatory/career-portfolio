/* ==========================================================
   app.js — 라우터 · 헤더 · 사이드바 · 공통 로직
   ========================================================== */

/* ----------------------------------------------------------
   라우터 — 페이지 이동
---------------------------------------------------------- */
function navigate(page, params = {}) {
  State.currentPage = page;
  if (params.studentId !== undefined) State.currentStudentId = params.studentId;
  if (params.tab !== undefined)       State.currentTab       = params.tab;

  renderHeader();
  renderSidebar();

  const content = document.getElementById('app-content');

  // 사이드바 여부에 따라 마진 조정
  const hasSidebar = ['counselor', 'professor', 'admin'].includes(State.currentRole);
  content.classList.toggle('has-sidebar', hasSidebar);

  // 페이지별 렌더 함수 호출
  switch (page) {
    // 학생 화면
    case 'stu-onboarding':  renderStudentOnboarding(); break;
    case 'stu-home':        renderStudentHome();       break;
    case 'stu-self':        renderStudentSelf();       break;
    case 'stu-diagnosis':   renderStudentDiagnosis();  break;
    case 'stu-plan':        renderStudentPlan();       break;
    case 'stu-portfolio':   renderStudentPortfolio();  break;
    case 'stu-job':         renderStudentJob();        break;
    case 'stu-chat':        renderStudentChat();       break;

    // 상담사 화면
    case 'cou-list':        renderCounselorList();     break;
    case 'cou-detail':      renderCounselorDetail(params.tab || 'summary'); break;

    // 교수 화면
    case 'prof-list':       renderProfessorList();     break;
    case 'prof-detail':     renderProfessorDetail(params.tab || 'overview'); break;

    // 관리자 화면
    case 'admin-home':      renderAdminHome();         break;
    case 'admin-rag':       renderAdminRag();          break;
    case 'admin-users':     renderAdminUsers();        break;
    case 'admin-stats':     renderAdminStats();        break;

    default:
      renderComingSoon(page);
  }
}

/* ----------------------------------------------------------
   헤더 렌더
---------------------------------------------------------- */
function renderHeader() {
  const user   = State.currentUser;
  const role   = State.currentRole;
  const header = document.getElementById('app-header');
  if (!user) { header.innerHTML = ''; return; }

  const roleLabel = { student: '학생', counselor: '상담사', professor: '교수', admin: '관리자' }[role];
  const badgeClass = {
    student: 'badge-purple', counselor: 'badge-blue',
    professor: 'badge-green', admin: 'badge-yellow'
  }[role];

  // 상담사가 학생 상세 보는 중이면 학생 이름 표시
  let centerInfo = '';
  if ((role === 'counselor' || role === 'professor') && State.currentStudentId) {
    const stu = STUDENTS.find(s => s.id === State.currentStudentId);
    if (stu) {
      centerInfo = `
        <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--gray-500)">
          <button onclick="navigate('${role === 'counselor' ? 'cou-list' : 'prof-list'}')"
            style="background:none;border:none;cursor:pointer;color:var(--gray-400);font-size:18px;padding:2px 6px;border-radius:6px;"
            title="목록으로">←</button>
          <span style="font-weight:700;color:var(--gray-800);font-size:15px">${esc(stu.name)}</span>
          <span>${esc(stu.department)} ${stu.grade}학년</span>
          <span class="badge ${stageBadgeClass(stu.currentStage)}">${stageLabel(stu.currentStage)}</span>
        </div>`;
    }
  }

  header.innerHTML = `
    <div class="header-logo">
      <div class="header-logo-icon">🎓</div>
      <span>M-Cap</span>
    </div>
    ${centerInfo}
    <div class="header-right">
      <span class="badge ${badgeClass}">${roleLabel}</span>
      <div class="header-avatar" style="background:${user.avatarColor}">${user.name[0]}</div>
      <span class="header-user-name">${esc(user.name)}</span>
      <button class="btn btn-ghost btn-sm" onclick="doLogout()">로그아웃</button>
    </div>
  `;
}

/* ----------------------------------------------------------
   사이드바 렌더 (상담사·교수·관리자만)
---------------------------------------------------------- */
const SIDEBAR_MENUS = {
  counselor: [
    { icon: '👥', label: '학생 목록', page: 'cou-list' },
  ],
  professor: [
    { icon: '📋', label: '담당 학생 목록', page: 'prof-list' },
  ],
  admin: [
    { icon: '📊', label: '전체 현황', page: 'admin-home' },
    { icon: '📤', label: 'RAG 자료 업로드', page: 'admin-rag' },
    { icon: '👤', label: '사용자·권한 관리', page: 'admin-users' },
    { icon: '📈', label: '통계', page: 'admin-stats' },
  ],
};

// 상담사 — 학생 상세 탭 목록
const COUNSELOR_TABS = [
  { id: 'summary',     icon: '📊', label: '종합 요약' },
  { id: 'initial',     icon: '👤', label: '초기 상담' },
  { id: 'diagnosis',   icon: '🔬', label: '진단 검사' },
  { id: 'activities',  icon: '📚', label: '교과·비교과' },
  { id: 'academic',    icon: '🎓', label: '학업설계' },
  { id: 'portfolio',   icon: '📁', label: '포트폴리오' },
  { id: 'logs',        icon: '📝', label: '상담 일지' },
  { id: 'employment',  icon: '💼', label: '취업 준비' },
  { id: 'ai',          icon: '🤖', label: 'AI 어시스턴트' },
];

function renderSidebar() {
  const sidebar = document.getElementById('app-sidebar');
  const role    = State.currentRole;

  if (!['counselor', 'professor', 'admin'].includes(role)) {
    sidebar.classList.add('hidden');
    return;
  }
  sidebar.classList.remove('hidden');

  let html = '';

  // 교수: 학생 상세 화면이면 탭 메뉴로 전환
  if (role === 'professor' && State.currentStudentId && State.currentPage === 'prof-detail') {
    html += `
      <div class="sidebar-section">포트폴리오 검토</div>
      <div class="sidebar-menu">
        ${PROFESSOR_TABS.map(t => `
          <button class="sidebar-item ${State.currentTab === t.id ? 'active' : ''}"
            onclick="navigate('prof-detail', {tab:'${t.id}'})">
            <span class="s-icon">${t.icon}</span>${t.label}
          </button>
        `).join('')}
      </div>
      <div class="sidebar-section" style="margin-top:8px">목록</div>
      <div class="sidebar-menu">
        <button class="sidebar-item" onclick="navigate('prof-list')">
          <span class="s-icon">←</span>학생 목록
        </button>
      </div>`;
  }
  // 상담사: 학생 상세 화면이면 탭 메뉴로 전환
  else if (role === 'counselor' && State.currentStudentId && State.currentPage === 'cou-detail') {
    const stu = STUDENTS.find(s => s.id === State.currentStudentId);
    html += `
      <div class="sidebar-section">학생 메뉴</div>
      <div class="sidebar-menu">
        ${COUNSELOR_TABS.map(t => `
          <button class="sidebar-item ${State.currentTab === t.id ? 'active' : ''}"
            onclick="navigate('cou-detail', {tab:'${t.id}'})">
            <span class="s-icon">${t.icon}</span>${t.label}
          </button>
        `).join('')}
      </div>
      <div class="sidebar-section" style="margin-top:8px">목록</div>
      <div class="sidebar-menu">
        <button class="sidebar-item" onclick="navigate('cou-list')">
          <span class="s-icon">←</span>학생 목록
        </button>
      </div>`;
  } else {
    // 기본 메뉴
    const menus = SIDEBAR_MENUS[role] || [];
    html += `
      <div class="sidebar-section">메뉴</div>
      <div class="sidebar-menu">
        ${menus.map(m => `
          <button class="sidebar-item ${State.currentPage === m.page ? 'active' : ''}"
            onclick="navigate('${m.page}')">
            <span class="s-icon">${m.icon}</span>${m.label}
          </button>
        `).join('')}
      </div>`;
  }

  sidebar.innerHTML = html;
}

/* ----------------------------------------------------------
   로그인 / 로그아웃
---------------------------------------------------------- */
function doLogin(role) {
  State.currentRole = role;
  State.currentUser = USERS[role];
  State.currentStudentId = null;
  State.currentTab = null;

  // body 클래스
  document.body.className = `role-${role}`;

  // 화면 전환
  document.getElementById('screen-login').classList.add('hidden');
  document.getElementById('screen-app').classList.remove('hidden');

  // 역할별 첫 화면 (학생: 첫 로그인이면 온보딩으로)
  let firstPage;
  if (role === 'student' && !State.stuOnboardingDone) {
    firstPage = 'stu-onboarding';
  } else {
    firstPage = {
      student:   'stu-home',
      counselor: 'cou-list',
      professor: 'prof-list',
      admin:     'admin-home',
    }[role];
  }

  navigate(firstPage);
}

function doLogout() {
  State.currentRole = null;
  State.currentUser = null;
  State.currentStudentId = null;
  State.currentTab = null;
  State.currentPage = null;

  document.body.className = '';
  document.getElementById('screen-app').classList.add('hidden');
  document.getElementById('screen-login').classList.remove('hidden');
  document.getElementById('app-header').innerHTML = '';
  document.getElementById('app-sidebar').innerHTML = '';
  document.getElementById('app-content').innerHTML = '';
  renderLoginScreen();
}

/* ----------------------------------------------------------
   모달 헬퍼
---------------------------------------------------------- */
function openModal(html, size = '') {
  closeModal();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'modal-overlay';
  overlay.innerHTML = `<div class="modal ${size}">${html}</div>`;
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.body.appendChild(overlay);
}

function closeModal() {
  const el = document.getElementById('modal-overlay');
  if (el) el.remove();
}

/* ----------------------------------------------------------
   토스트 알림
---------------------------------------------------------- */
function showToast(msg, type = 'success') {
  const el = document.createElement('div');
  const colors = { success: '#059669', error: '#dc2626', info: '#4f46e5', warning: '#d97706' };
  el.style.cssText = `
    position:fixed; bottom:24px; right:24px; z-index:9999;
    background:${colors[type] || colors.success}; color:#fff;
    padding:12px 20px; border-radius:10px; font-size:14px; font-weight:600;
    box-shadow:0 4px 12px rgba(0,0,0,.2); display:flex; align-items:center; gap:8px;
    animation:fade-in-up .3s ease;
  `;
  el.innerHTML = `<span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span> ${msg}`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

/* ----------------------------------------------------------
   AI 해석 시뮬레이션 (딜레이 후 콜백)
---------------------------------------------------------- */
function simulateAI(targetEl, resultHtml, delay = 1800) {
  targetEl.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;padding:20px;color:var(--gray-500)">
      <div class="spinner spinner-dark"></div>
      <span>AI가 분석하고 있습니다...</span>
    </div>`;
  setTimeout(() => {
    targetEl.innerHTML = resultHtml;
  }, delay);
}

/* ----------------------------------------------------------
   준비 중 화면
---------------------------------------------------------- */
function renderComingSoon(page) {
  document.getElementById('app-content').innerHTML = `
    <div class="empty-state" style="min-height:60vh">
      <div class="empty-icon">🚧</div>
      <div class="empty-title">준비 중입니다</div>
      <div class="empty-text">이 화면은 다음 단계에서 구현됩니다.</div>
    </div>`;
}

/* ----------------------------------------------------------
   앱 초기화
---------------------------------------------------------- */
window.addEventListener('DOMContentLoaded', () => {
  renderLoginScreen();
});
