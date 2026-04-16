/* ==========================================================
   student.js — 학생 전용 화면 (감성적 앱 스타일)
   ========================================================== */

/* ----------------------------------------------------------
   공통 헬퍼
---------------------------------------------------------- */
function stuBack(page) {
  return `<div class="stu-page-header stu-animate">
    <button class="stu-back-btn" onclick="navigate('${page}')">←</button>
    <div class="stu-page-title-wrap" id="stu-page-title"></div>
  </div>`;
}

function setStuTitle(title, sub) {
  const el = document.getElementById('stu-page-title');
  if (el) el.innerHTML = `<div class="stu-ptitle">${title}</div>${sub ? `<div class="stu-psub">${sub}</div>` : ''}`;
}

/* ==========================================================
   0. 온보딩 — 첫 로그인 대화형 입력 (5단계)
   ========================================================== */
const ONB = {
  step: 0,   // 현재 완료된 단계 (0 = 아직 시작 전)
  data: {},  // 입력 수집
};

function renderStudentOnboarding() {
  ONB.step = 0;
  ONB.data = {};

  document.getElementById('app-content').innerHTML = `
  <div style="max-width:600px;margin:0 auto;padding:28px 20px">

    <!-- 상단 인사 -->
    <div style="text-align:center;margin-bottom:28px" class="stu-animate">
      <div style="font-size:44px;margin-bottom:10px">👋</div>
      <div style="font-size:22px;font-weight:900;color:#1f2937;margin-bottom:6px">처음 오셨군요!</div>
      <div style="font-size:14px;color:#6b7280;line-height:1.6">
        간단한 정보를 입력하면 AI가<br>나만의 진로 포트폴리오를 만들어드려요
      </div>
      <!-- 단계 표시 -->
      <div style="display:flex;justify-content:center;gap:8px;margin-top:20px" id="onb-steps">
        ${[1,2,3,4,5].map(n => `
          <div id="onb-dot-${n}"
            style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;
              justify-content:center;font-size:11px;font-weight:800;transition:all .3s;
              background:#e5e7eb;color:#9ca3af">
            ${n}
          </div>`).join('')}
      </div>
    </div>

    <!-- 대화 흐름 영역 -->
    <div id="onb-chat" style="display:flex;flex-direction:column;gap:16px"></div>

    <!-- 현재 입력 폼 -->
    <div id="onb-form" style="margin-top:16px"></div>
  </div>`;

  // 1단계 시작
  setTimeout(() => onbNextStep(), 300);
}

function onbBubble(text) {
  return `
    <div class="stu-animate" style="display:flex;gap:10px;align-items:flex-start">
      <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#4f46e5,#7c3aed);
        display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🤖</div>
      <div style="background:#f3f4f6;border-radius:0 14px 14px 14px;padding:14px 16px;
        max-width:420px;font-size:14px;color:#1f2937;line-height:1.6">
        ${text}
      </div>
    </div>`;
}

function onbAnswer(text) {
  return `
    <div style="display:flex;justify-content:flex-end">
      <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;border-radius:14px 0 14px 14px;
        padding:12px 16px;max-width:320px;font-size:14px;font-weight:600">
        ${esc(text)}
      </div>
    </div>`;
}

const ONB_STEPS = [
  {
    msg: '안녕하세요! 😊 먼저 <strong>학과와 학년</strong>을 알려주세요.',
    form: () => `
      <div style="background:#fff;border-radius:16px;padding:20px;box-shadow:0 2px 12px rgba(0,0,0,.08)">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
          <div>
            <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:6px">학과</label>
            <select id="onb-dept"
              style="width:100%;border:1.5px solid #e5e7eb;border-radius:10px;padding:10px 12px;font-size:14px">
              <option value="">선택하세요</option>
              ${['AI소프트웨어학과','경영학과','전기전자공학과','심리학과','디자인학과','간호학과','기타'].map(d =>
                `<option value="${d}">${d}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:6px">학년</label>
            <select id="onb-grade"
              style="width:100%;border:1.5px solid #e5e7eb;border-radius:10px;padding:10px 12px;font-size:14px">
              <option value="">선택하세요</option>
              ${[1,2,3,4].map(g => `<option value="${g}">${g}학년</option>`).join('')}
            </select>
          </div>
        </div>
        <button onclick="onbSubmit(1)" class="stu-onb-btn">다음 →</button>
      </div>`,
    validate: () => {
      const d = document.getElementById('onb-dept')?.value;
      const g = document.getElementById('onb-grade')?.value;
      if (!d || !g) { showToast('학과와 학년을 모두 선택해주세요.', 'error'); return false; }
      ONB.data.department = d; ONB.data.grade = g; return true;
    },
    summary: () => `${ONB.data.department} ${ONB.data.grade}학년`,
  },
  {
    msg: '멋져요! 🎉 혹시 <strong>MBTI 유형</strong>을 알고 있나요? 모르면 비워도 괜찮아요.',
    form: () => `
      <div style="background:#fff;border-radius:16px;padding:20px;box-shadow:0 2px 12px rgba(0,0,0,.08)">
        <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:8px">MBTI (선택)</label>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:14px">
          ${['ISTJ','ISFJ','INFJ','INTJ','ISTP','ISFP','INFP','INTP',
             'ESTP','ESFP','ENFP','ENTP','ESTJ','ESFJ','ENFJ','ENTJ'].map(m => `
            <button onclick="selectMbti('${m}',this)"
              data-mbti="${m}"
              style="padding:8px 4px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:12px;
                font-weight:700;cursor:pointer;background:#fff;color:#374151;transition:all .15s">
              ${m}
            </button>`).join('')}
        </div>
        <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:6px">검사 방법 (선택)</label>
        <select id="onb-mbti-method"
          style="width:100%;border:1.5px solid #e5e7eb;border-radius:10px;padding:10px 12px;font-size:14px;margin-bottom:14px">
          <option value="">선택 안 함</option>
          <option>공식 검사 (MBTI Foundation)</option>
          <option>인터넷 검사</option>
          <option>학교 검사</option>
        </select>
        <button onclick="onbSubmit(2)" class="stu-onb-btn">다음 →</button>
      </div>`,
    validate: () => {
      ONB.data.mbti = ONB.data._mbtiSelected || '미작성';
      ONB.data.mbtiMethod = document.getElementById('onb-mbti-method')?.value || '';
      return true;
    },
    summary: () => ONB.data.mbti === '미작성' ? '(MBTI 미입력)' : ONB.data.mbti,
  },
  {
    msg: '좋아요! 😊 <strong>진로 목표</strong>와 <strong>희망 직무</strong>가 어떻게 되나요?',
    form: () => `
      <div style="background:#fff;border-radius:16px;padding:20px;box-shadow:0 2px 12px rgba(0,0,0,.08)">
        <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:8px">진로 목표</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
          ${['취업','진학','창업','기타'].map(g => `
            <button onclick="selectCareerGoal('${g}',this)"
              data-goal="${g}"
              style="padding:10px 20px;border:2px solid #e5e7eb;border-radius:999px;font-size:14px;
                font-weight:700;cursor:pointer;background:#fff;color:#374151;transition:all .15s">
              ${g === '취업' ? '💼' : g === '진학' ? '🎓' : g === '창업' ? '🚀' : '🌀'} ${g}
            </button>`).join('')}
        </div>
        <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:6px">희망 직무 (자유 입력)</label>
        <input id="onb-job" type="text" placeholder="예: 데이터 분석가, UX 디자이너, 공무원..."
          style="width:100%;border:1.5px solid #e5e7eb;border-radius:10px;padding:10px 14px;font-size:14px;margin-bottom:14px">
        <button onclick="onbSubmit(3)" class="stu-onb-btn">다음 →</button>
      </div>`,
    validate: () => {
      const goal = ONB.data._careerGoalSelected;
      const job  = document.getElementById('onb-job')?.value.trim();
      if (!goal) { showToast('진로 목표를 선택해주세요.', 'error'); return false; }
      ONB.data.careerGoal  = goal;
      ONB.data.desiredJob  = job || '미정';
      return true;
    },
    summary: () => `${ONB.data.careerGoal} → ${ONB.data.desiredJob}`,
  },
  {
    msg: '거의 다 왔어요! 🌟 요즘 <strong>건강</strong>과 <strong>마음 상태</strong>는 어때요?',
    form: () => `
      <div style="background:#fff;border-radius:16px;padding:20px;box-shadow:0 2px 12px rgba(0,0,0,.08)">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
          <div>
            <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:6px">🏃 건강 상태</label>
            <select id="onb-health"
              style="width:100%;border:1.5px solid #e5e7eb;border-radius:10px;padding:10px 12px;font-size:14px">
              <option value="">선택하세요</option>
              <option>매우 좋음</option><option>좋음</option><option>보통</option>
              <option>다소 나쁨</option><option>나쁨</option>
            </select>
          </div>
          <div>
            <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:6px">💙 심리 상태</label>
            <select id="onb-psych"
              style="width:100%;border:1.5px solid #e5e7eb;border-radius:10px;padding:10px 12px;font-size:14px">
              <option value="">선택하세요</option>
              <option>매우 안정적</option><option>안정적</option><option>보통</option>
              <option>약간 불안</option><option>불안함</option>
            </select>
          </div>
        </div>
        <button onclick="onbSubmit(4)" class="stu-onb-btn">다음 →</button>
      </div>`,
    validate: () => {
      const h = document.getElementById('onb-health')?.value;
      const p = document.getElementById('onb-psych')?.value;
      if (!h || !p) { showToast('건강 상태와 심리 상태를 모두 선택해주세요.', 'error'); return false; }
      ONB.data.health = h; ONB.data.psych = p; return true;
    },
    summary: () => `건강 ${ONB.data.health} / 심리 ${ONB.data.psych}`,
  },
  {
    msg: '마지막이에요! 💪 지금 <strong>가장 큰 고민이나 걱정</strong>이 있다면 자유롭게 적어주세요.<br><span style="font-size:12px;color:#9ca3af">없으면 비워도 됩니다</span>',
    form: () => `
      <div style="background:#fff;border-radius:16px;padding:20px;box-shadow:0 2px 12px rgba(0,0,0,.08)">
        <textarea id="onb-concern" rows="4" placeholder="예: 진로 방향을 아직 모르겠어요. 학점이 걱정돼요. 취업이 막막해요..."
          style="width:100%;border:1.5px solid #e5e7eb;border-radius:10px;padding:12px 14px;
            font-size:14px;resize:none;line-height:1.7"></textarea>
        <button onclick="onbSubmit(5)"
          style="width:100%;margin-top:12px;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;
            border:none;border-radius:12px;padding:14px;font-size:15px;font-weight:800;cursor:pointer">
          ✨ 완료! 포트폴리오 시작하기
        </button>
      </div>`,
    validate: () => {
      ONB.data.concern = document.getElementById('onb-concern')?.value.trim() || '없음';
      return true;
    },
    summary: () => ONB.data.concern === '없음' ? '(고민 없음)' : ONB.data.concern.substring(0, 20) + '...',
  },
];

function onbNextStep() {
  ONB.step++;
  const stepDef = ONB_STEPS[ONB.step - 1];
  if (!stepDef) return;

  // 도트 업데이트
  for (let i = 1; i <= 5; i++) {
    const dot = document.getElementById(`onb-dot-${i}`);
    if (!dot) continue;
    if (i < ONB.step) {
      dot.style.background = '#4f46e5'; dot.style.color = '#fff'; dot.innerHTML = '✓';
    } else if (i === ONB.step) {
      dot.style.background = 'linear-gradient(135deg,#4f46e5,#7c3aed)'; dot.style.color = '#fff'; dot.innerHTML = i;
    } else {
      dot.style.background = '#e5e7eb'; dot.style.color = '#9ca3af'; dot.innerHTML = i;
    }
  }

  const chat = document.getElementById('onb-chat');
  const form = document.getElementById('onb-form');
  if (!chat || !form) return;

  // AI 말풍선 추가
  const bubble = document.createElement('div');
  bubble.innerHTML = onbBubble(stepDef.msg);
  chat.appendChild(bubble);

  // 폼 렌더
  form.innerHTML = stepDef.form();

  // 스크롤
  setTimeout(() => form.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
}

function onbSubmit(step) {
  const stepDef = ONB_STEPS[step - 1];
  if (!stepDef.validate()) return;

  const chat = document.getElementById('onb-chat');
  const form = document.getElementById('onb-form');
  if (!chat) return;

  // 답변 말풍선 추가
  const ans = document.createElement('div');
  ans.innerHTML = onbAnswer(stepDef.summary());
  chat.appendChild(ans);

  if (step < 5) {
    form.innerHTML = '';
    setTimeout(() => onbNextStep(), 500);
  } else {
    // 완료 처리
    form.innerHTML = '';
    State.stuOnboardingDone = true;

    // 수집된 데이터를 USERS.student에 반영
    const stu = USERS.student;
    if (ONB.data.department) stu.department = ONB.data.department;
    if (ONB.data.grade) stu.grade = parseInt(ONB.data.grade);
    if (ONB.data.mbti && ONB.data.mbti !== '미작성') {
      const ic = INITIAL_CONSULTATIONS['stu-001'];
      if (ic) { ic.mbti = ONB.data.mbti; ic.careerGoal = ONB.data.careerGoal; }
    }
    stu.desiredJob = ONB.data.desiredJob || stu.desiredJob;

    // 완료 메시지
    setTimeout(() => {
      const done = document.createElement('div');
      done.innerHTML = onbBubble(`
        완벽해요! 🎉 입력해주신 정보로 AI가 진로 포트폴리오를 준비 중이에요.<br>
        지금 바로 홈 화면으로 이동할게요 ✨
      `);
      chat.appendChild(done);
      setTimeout(() => navigate('stu-home'), 2000);
    }, 400);
  }
}

function selectMbti(val, btn) {
  document.querySelectorAll('[data-mbti]').forEach(b => {
    b.style.borderColor = '#e5e7eb'; b.style.background = '#fff'; b.style.color = '#374151';
  });
  btn.style.borderColor = '#4f46e5'; btn.style.background = '#eef2ff'; btn.style.color = '#4f46e5';
  ONB.data._mbtiSelected = val;
}

function selectCareerGoal(val, btn) {
  document.querySelectorAll('[data-goal]').forEach(b => {
    b.style.borderColor = '#e5e7eb'; b.style.background = '#fff'; b.style.color = '#374151';
  });
  btn.style.borderColor = '#4f46e5'; btn.style.background = '#eef2ff'; btn.style.color = '#4f46e5';
  ONB.data._careerGoalSelected = val;
}

/* ==========================================================
   1. 학생 메인 홈
   ========================================================== */
function renderStudentHome() {
  const stu  = USERS.student;
  const diag = (DIAGNOSES['stu-001'] || []);
  const port = (PORTFOLIOS['stu-001'] || [])[0];
  const emp  = EMPLOYMENT_STATUS['stu-001'];

  const cards = [
    {
      key: 'self', cls: 'stu-card-self', emoji: '🧠',
      name: '자기이해', page: 'stu-self',
      desc: '나의 강점·성향·흥미 탐색',
      pct: 85, fillCls: 'fill-indigo',
      badgeLabel: '업데이트됨', badgeCls: 'badge-indigo',
    },
    {
      key: 'diag', cls: 'stu-card-diag', emoji: '🔬',
      name: '진단검사', page: 'stu-diagnosis',
      desc: `검사 ${diag.length}건 완료`,
      pct: diag.length > 0 ? 100 : 0, fillCls: 'fill-purple',
      badgeLabel: diag.length > 0 ? `${diag.length}건 완료` : '미완료',
      badgeCls: diag.length > 0 ? 'badge-purple' : 'badge-gray',
    },
    {
      key: 'plan', cls: 'stu-card-plan', emoji: '🗓️',
      name: '학업설계', page: 'stu-plan',
      desc: '수강 추천 · 이수 현황',
      pct: 60, fillCls: 'fill-blue',
      badgeLabel: '진행 중', badgeCls: 'badge-blue',
    },
    {
      key: 'portfolio', cls: 'stu-card-portfolio', emoji: '✨',
      name: '포트폴리오', page: 'stu-portfolio',
      desc: '나의 성장 스토리',
      pct: port ? (port.isFinal ? 100 : 70) : 0, fillCls: 'fill-green',
      badgeLabel: port ? (port.isFinal ? '확정' : '작성 중') : '시작 전',
      badgeCls: port ? (port.isFinal ? 'badge-green' : 'badge-teal') : 'badge-gray',
    },
    {
      key: 'job', cls: 'stu-card-job', emoji: '💼',
      name: '취업준비', page: 'stu-job',
      desc: '준비도 · 체크리스트',
      pct: emp ? 35 : 0, fillCls: 'fill-red',
      badgeLabel: emp ? emp.prepLevel.split(' ')[0] : '미시작',
      badgeCls: emp ? 'badge-yellow' : 'badge-gray',
    },
  ];

  const overallPct = Math.round(cards.reduce((s, c) => s + c.pct, 0) / cards.length);

  document.getElementById('app-content').innerHTML = `
  <div class="stu-home">

    <!-- 히어로 배너 -->
    <div class="stu-hero stu-animate">
      <div class="stu-hero-greeting">안녕하세요 👋</div>
      <div class="stu-hero-name">${esc(stu.name)} 님의 진로 여정</div>
      <div class="stu-hero-sub">
        ${esc(stu.department)} ${stu.grade}학년<br>
        오늘도 한 걸음씩, 나답게 성장하고 있어요 🌱
      </div>
      <div class="stu-hero-chips">
        <span class="stu-hero-chip">📊 전체 완성도 ${overallPct}%</span>
        <span class="stu-hero-chip">🔬 검사 ${diag.length}건</span>
        <span class="stu-hero-chip">📋 상담 3회기</span>
        <span class="stu-hero-chip">${stu.department.substring(0,4)}</span>
      </div>
    </div>

    <!-- AI 챗봇 상담 CTA 배너 -->
    <div onclick="navigate('stu-chat')"
      class="stu-animate"
      style="background:linear-gradient(135deg,#312e81,#4f46e5,#7c3aed);border-radius:18px;
        padding:18px 22px;margin:0 16px 20px;cursor:pointer;
        display:flex;align-items:center;gap:14px;box-shadow:0 6px 24px rgba(79,70,229,.35);
        transition:transform .15s"
      onmouseover="this.style.transform='scale(1.01)'"
      onmouseout="this.style.transform='scale(1)'">
      <div style="font-size:36px;flex-shrink:0">🤖</div>
      <div style="flex:1">
        <div style="font-size:16px;font-weight:900;color:#fff;margin-bottom:4px">AI 진로 상담 챗봇</div>
        <div style="font-size:13px;color:rgba(255,255,255,.75)">
          궁금한 거 뭐든 물어보세요 → 포트폴리오에 자동 반영돼요 ✨
        </div>
      </div>
      <div style="color:rgba(255,255,255,.6);font-size:20px">→</div>
    </div>

    <!-- 메뉴 카드 -->
    <div class="stu-section-title stu-animate stu-animate-delay-1">
      📌 내 진로 포트폴리오
    </div>
    <div class="stu-menu-grid">
      ${cards.map((c, i) => `
        <div class="stu-menu-card ${c.cls} stu-animate stu-animate-delay-${i + 1}"
          onclick="navigate('${c.page}')">
          <div class="stu-menu-emoji">${c.emoji}</div>
          <div class="stu-menu-name">${c.name}</div>
          <div class="stu-menu-desc">${c.desc}</div>
          <div class="stu-menu-progress-row">
            <div class="progress-bar" style="flex:1">
              <div class="progress-fill ${c.fillCls}" style="width:${c.pct}%"></div>
            </div>
            <span class="stu-menu-pct">${c.pct}%</span>
          </div>
          <div class="stu-menu-status-badge">
            <span class="badge ${c.badgeCls}">${c.badgeLabel}</span>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- 다음 일정 -->
    <div class="stu-section-title stu-animate">📅 다가오는 일정</div>
    <div style="background:#fff;border-radius:var(--radius-lg);padding:16px 20px;
      box-shadow:0 2px 12px rgba(0,0,0,.07);margin-bottom:16px" class="stu-animate">
      ${[
        { icon:'🎤', title:'AI 특강: 실무 데이터 분석', date:'4.22 (화)', color:'#4f46e5' },
        { icon:'🏕️', title:'취업캠프 (데이터·IT 직군)', date:'5.10~12', color:'#059669' },
        { icon:'📅', title:'다음 상담 예약', date:'4.5 (토) 14:00', color:'#7c3aed' },
      ].map(s => `
        <div style="display:flex;align-items:center;gap:12px;padding:10px 0;
          border-bottom:1px solid #f3f4f6">
          <span style="font-size:20px">${s.icon}</span>
          <span style="font-size:14px;font-weight:600;color:#1f2937;flex:1">${s.title}</span>
          <span style="font-size:12px;font-weight:700;color:${s.color};
            background:${s.color}18;padding:3px 10px;border-radius:999px">${s.date}</span>
        </div>`).join('')}
    </div>

    <!-- AI 한마디 -->
    <div class="stu-ai-box stu-animate" style="background:linear-gradient(135deg,#f5f3ff,#fdf4ff);">
      <div class="stu-ai-box-label">🤖 AI 상담사의 한마디</div>
      <div class="stu-ai-text">
        진로 방향(데이터 분석가)이 검사 결과와 아주 잘 맞아요! 💫<br>
        이번 달 안에 <strong>ADsP 시험 등록</strong>을 마치면 목표에 한 걸음 더 가까워질 거예요.
        궁금한 게 있으면 <strong onclick="navigate('stu-chat')" style="cursor:pointer;text-decoration:underline">AI 챗봇</strong>을 활용해 보세요.
      </div>
    </div>

    <!-- 기본 정보 수정 버튼 -->
    <div style="text-align:center;padding:8px 0 24px">
      <button onclick="navigate('stu-onboarding')"
        style="background:none;border:1.5px solid #e5e7eb;border-radius:999px;
          padding:8px 20px;font-size:13px;font-weight:700;color:#6b7280;cursor:pointer">
        ✏️ 기본 정보 다시 입력하기
      </button>
    </div>

  </div>`;
}

/* ==========================================================
   2. 자기이해
   ========================================================== */
// 자기이해 수정 모드 상태
let stuSelfEditMode = false;

function renderStudentSelf() {
  stuSelfEditMode = false;
  const ic = INITIAL_CONSULTATIONS['stu-001'];

  document.getElementById('app-content').innerHTML = `
  <div class="stu-self-wrap">
    ${stuBack('stu-home')}

    <!-- MBTI 대형 카드 -->
    <div class="stu-mbti-card stu-animate">
      <div style="font-size:13px;opacity:.6;margin-bottom:8px">나의 성격 유형</div>
      <div class="stu-mbti-type">${esc(ic?.mbti || 'ISTJ')}</div>
      <div class="stu-mbti-name">청렴결백한 논리주의자</div>
      <div class="stu-mbti-desc">
        원칙과 책임감을 중요시하고, 꼼꼼하게 계획을 세워 실행하는 타입이에요.
        한번 맡은 일은 끝까지 해내는 믿음직한 사람이에요 💪
      </div>
    </div>

    <!-- 나의 강점 -->
    <div class="stu-section-title stu-animate stu-animate-delay-1">✨ 나의 강점</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px" class="stu-animate stu-animate-delay-1">
      ${['꼼꼼한 업무 처리','높은 성실성','논리적 사고','배려심','집중력','데이터 분석 적성'].map(s =>
        `<span style="background:linear-gradient(135deg,#eef2ff,#f5f3ff);color:#4f46e5;
          padding:7px 14px;border-radius:999px;font-size:13px;font-weight:700;
          border:1.5px solid #c7d2fe">${s}</span>`
      ).join('')}
    </div>

    <!-- 성향 카드 4개 -->
    <div class="stu-section-title stu-animate stu-animate-delay-2">🧩 나의 성향</div>
    <div class="stu-trait-grid stu-animate stu-animate-delay-2">
      ${[
        { e:'🧭', n:'목표 지향', d:'한번 목표를 세우면 끝까지 달려가는 집중력이 있어요' },
        { e:'📋', n:'계획형', d:'즉흥적인 것보다 계획적으로 움직일 때 더 빛나요' },
        { e:'🤝', n:'책임감', d:'맡은 일에 끝까지 책임지는 신뢰할 수 있는 사람이에요' },
        { e:'🔍', n:'분석형', d:'데이터와 사실을 바탕으로 판단하는 걸 좋아해요' },
      ].map(t => `
        <div class="stu-trait-card">
          <div class="stu-trait-emoji">${t.e}</div>
          <div class="stu-trait-name">${t.n}</div>
          <div class="stu-trait-desc">${t.d}</div>
        </div>`).join('')}
    </div>

    <!-- 보완 포인트 -->
    <div class="stu-ai-box stu-animate stu-animate-delay-3"
      style="background:linear-gradient(135deg,#fff7ed,#fef9c3);border:1.5px solid #fed7aa">
      <div class="stu-ai-box-label" style="color:#d97706">🌱 이렇게 성장해볼까요?</div>
      <div class="stu-ai-text">
        새로운 사람들과 교류하는 경험을 조금씩 늘려보세요.<br>
        스터디 그룹이나 팀 프로젝트에 참여하면 <strong>협업 스킬</strong>도 자연스럽게 키울 수 있어요 🙌<br>
        목표를 작게 쪼개서 하나씩 달성하다 보면 자신감이 쑥쑥 올라갈 거예요!
      </div>
    </div>

    <!-- 기본 정보 (수정 모드 포함) -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin:20px 0 10px">
      <div class="stu-section-title" style="margin:0">📌 기본 정보</div>
      <button id="self-edit-btn" onclick="toggleSelfEditMode()"
        style="background:#eef2ff;color:#4f46e5;border:none;border-radius:999px;
          padding:6px 16px;font-size:13px;font-weight:700;cursor:pointer">
        ✏️ 수정하기
      </button>
    </div>

    <!-- 조회 모드 -->
    <div id="self-view-mode" class="stu-ai-box stu-animate" style="padding:0;overflow:hidden">
      ${[
        ['학과', USERS.student.department],
        ['학년', `${USERS.student.grade}학년`],
        ['진로 목표', ic?.careerGoal || '취업'],
        ['희망 직무', '데이터 분석가'],
        ['진로 확신도', ic?.careerGoalConfidence || '보통'],
        ['의사 결정 주체', ic?.decisionMaker || '본인'],
      ].map((r, i) => `
        <div style="display:flex;padding:12px 20px;${i > 0 ? 'border-top:1px solid #f3f4f6' : ''}">
          <span style="font-size:13px;font-weight:700;color:#9ca3af;width:120px;flex-shrink:0">${r[0]}</span>
          <span style="font-size:14px;color:#1f2937;font-weight:600">${esc(r[1])}</span>
        </div>`).join('')}
    </div>

    <!-- 수정 모드 (초기 숨김) -->
    <div id="self-edit-mode" style="display:none"
      class="stu-ai-box stu-animate" style="padding:20px">
      <div style="padding:20px;display:flex;flex-direction:column;gap:12px">
        <div>
          <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:4px">진로 목표</label>
          <select id="edit-career-goal"
            style="width:100%;border:1.5px solid #c7d2fe;border-radius:8px;padding:9px 12px;font-size:14px">
            ${['취업','진학','창업','기타'].map(g =>
              `<option ${(ic?.careerGoal||'취업')===g?'selected':''}>${g}</option>`).join('')}
          </select>
        </div>
        <div>
          <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:4px">희망 직무</label>
          <input id="edit-desired-job" type="text" value="데이터 분석가"
            style="width:100%;border:1.5px solid #c7d2fe;border-radius:8px;padding:9px 12px;font-size:14px">
        </div>
        <div>
          <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:4px">MBTI</label>
          <input id="edit-mbti" type="text" value="${esc(ic?.mbti||'ISTJ')}" maxlength="4"
            style="width:100%;border:1.5px solid #c7d2fe;border-radius:8px;padding:9px 12px;font-size:14px;text-transform:uppercase"
            placeholder="예: ISTJ">
        </div>
        <div style="display:flex;gap:8px;margin-top:4px">
          <button onclick="saveSelfEdit()"
            style="flex:1;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;border:none;
              border-radius:10px;padding:12px;font-size:14px;font-weight:800;cursor:pointer">
            💾 저장하기
          </button>
          <button onclick="toggleSelfEditMode()"
            style="flex:1;background:#f3f4f6;color:#6b7280;border:none;
              border-radius:10px;padding:12px;font-size:14px;font-weight:700;cursor:pointer">
            취소
          </button>
        </div>
      </div>
    </div>

  </div>`;
  setStuTitle('자기이해', '나는 어떤 사람일까요?');
}

function toggleSelfEditMode() {
  stuSelfEditMode = !stuSelfEditMode;
  document.getElementById('self-view-mode').style.display = stuSelfEditMode ? 'none' : 'block';
  document.getElementById('self-edit-mode').style.display = stuSelfEditMode ? 'block' : 'none';
  const btn = document.getElementById('self-edit-btn');
  if (btn) btn.textContent = stuSelfEditMode ? '✕ 닫기' : '✏️ 수정하기';
}

function saveSelfEdit() {
  const ic = INITIAL_CONSULTATIONS['stu-001'];
  if (ic) {
    ic.careerGoal = document.getElementById('edit-career-goal')?.value;
    ic.mbti       = document.getElementById('edit-mbti')?.value.toUpperCase();
  }
  showToast('기본 정보가 저장되었습니다.', 'success');
  renderStudentSelf();
}

/* ==========================================================
   3. 진단검사 업로드
   ========================================================== */
const DiagUpload = { state: 'idle', fileName: '' }; // idle | loading | done

/* ==========================================================
   3. 진단검사 — 탭 선택형 (MBTI / 직업선호도 / 성격·심리)
   ========================================================== */

const StuDiag = {
  tab:        'mbti',  // 'mbti' | 'job' | 'psych'
  mbtiResult: null,    // 분석 완료된 MBTI 코드
  jobResult:  null,    // 분석 완료된 직업선호도 결과
  psychResult:null,    // 분석 완료된 심리검사 결과
  jobFile:    '',
  psychFile:  '',
};

/* ---- 메인 렌더 ---- */
function renderStudentDiagnosis() {
  document.getElementById('app-content').innerHTML = `
  <div class="stu-diag-wrap">
    ${stuBack('stu-home')}

    <!-- 검사 종류 탭 -->
    <div style="display:flex;gap:0;margin-bottom:24px;background:#f3f4f6;
      border-radius:14px;padding:4px" class="stu-animate">
      ${[
        { id:'mbti', icon:'🧠', label:'MBTI' },
        { id:'job',  icon:'💼', label:'직업선호도검사' },
        { id:'psych',icon:'💙', label:'성격·심리검사' },
      ].map(t => `
        <button id="diag-tab-${t.id}" onclick="diagSwitchTab('${t.id}')"
          style="flex:1;border:none;border-radius:10px;padding:10px 8px;font-size:13px;font-weight:700;
            cursor:pointer;transition:all .2s;
            ${StuDiag.tab === t.id
              ? 'background:#fff;color:#4f46e5;box-shadow:0 2px 8px rgba(0,0,0,.1)'
              : 'background:transparent;color:#9ca3af'}">
          ${t.icon} ${t.label}
        </button>`).join('')}
    </div>

    <!-- 탭 콘텐츠 -->
    <div id="diag-tab-content">
      ${diagRenderCurrentTab()}
    </div>
  </div>`;
  setStuTitle('진단검사', '검사 결과를 쉽게 확인해요');
}

function diagSwitchTab(tab) {
  StuDiag.tab = tab;
  // 탭 버튼 스타일 갱신
  ['mbti','job','psych'].forEach(id => {
    const btn = document.getElementById(`diag-tab-${id}`);
    if (!btn) return;
    if (id === tab) {
      btn.style.background = '#fff'; btn.style.color = '#4f46e5';
      btn.style.boxShadow  = '0 2px 8px rgba(0,0,0,.1)';
    } else {
      btn.style.background = 'transparent'; btn.style.color = '#9ca3af';
      btn.style.boxShadow  = 'none';
    }
  });
  const el = document.getElementById('diag-tab-content');
  if (el) el.innerHTML = diagRenderCurrentTab();
}

function diagRenderCurrentTab() {
  if (StuDiag.tab === 'mbti')  return diagRenderMbtiTab();
  if (StuDiag.tab === 'job')   return diagRenderJobTab();
  if (StuDiag.tab === 'psych') return diagRenderPsychTab();
  return '';
}

/* ============================================================
   탭 1: MBTI
   ============================================================ */
function diagRenderMbtiTab() {
  return `
    <!-- 입력 폼 -->
    <div style="background:#fff;border-radius:16px;padding:24px;
      box-shadow:0 2px 12px rgba(0,0,0,.07);margin-bottom:20px" class="stu-animate">
      <div style="font-size:15px;font-weight:800;color:#1f2937;margin-bottom:6px">🧠 MBTI 코드 입력</div>
      <div style="font-size:13px;color:#9ca3af;margin-bottom:16px">
        검사 결과지의 4글자 유형 코드를 입력하세요 (예: ISTJ, ENFP)
      </div>
      <div style="display:flex;gap:10px;align-items:center">
        <input id="mbti-input" type="text" maxlength="4"
          placeholder="예: ISTJ"
          value="${esc(StuDiag.mbtiResult || '')}"
          style="flex:1;border:2px solid #c7d2fe;border-radius:12px;padding:14px 16px;
            font-size:22px;font-weight:900;text-align:center;text-transform:uppercase;
            letter-spacing:6px;color:#4f46e5;outline:none"
          oninput="this.value=this.value.toUpperCase()"
          onkeydown="if(event.key==='Enter') diagMbtiAnalyze()">
        <button onclick="diagMbtiAnalyze()"
          style="background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;border:none;
            border-radius:12px;padding:14px 20px;font-size:14px;font-weight:800;cursor:pointer;
            white-space:nowrap;box-shadow:0 4px 12px rgba(79,70,229,.35)">
          🤖 AI 분석하기
        </button>
      </div>
      <!-- 16개 빠른 선택 -->
      <div style="margin-top:14px">
        <div style="font-size:12px;color:#9ca3af;margin-bottom:8px;font-weight:600">빠른 선택</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${['ISTJ','ISFJ','INFJ','INTJ','ISTP','ISFP','INFP','INTP',
             'ESTP','ESFP','ENFP','ENTP','ESTJ','ESFJ','ENFJ','ENTJ'].map(m => `
            <button onclick="document.getElementById('mbti-input').value='${m}'"
              style="padding:5px 10px;border:1.5px solid #e5e7eb;border-radius:8px;
                font-size:12px;font-weight:700;cursor:pointer;background:#fff;color:#374151;
                transition:all .1s"
              onmouseover="this.style.borderColor='#4f46e5';this.style.color='#4f46e5'"
              onmouseout="this.style.borderColor='#e5e7eb';this.style.color='#374151'">
              ${m}
            </button>`).join('')}
        </div>
      </div>
    </div>

    <!-- 결과 영역 -->
    <div id="mbti-result-area">
      ${StuDiag.mbtiResult ? diagRenderMbtiResult(StuDiag.mbtiResult) : ''}
    </div>`;
}

function diagMbtiAnalyze() {
  const val = (document.getElementById('mbti-input')?.value || '').toUpperCase().trim();
  const valid = /^[EI][SN][TF][JP]$/.test(val);
  if (!valid) {
    showToast('올바른 MBTI 코드를 입력해주세요 (예: ISTJ)', 'error');
    return;
  }

  const area = document.getElementById('mbti-result-area');
  if (!area) return;

  // 로딩
  area.innerHTML = diagLoadingHtml('MBTI 유형을 분석하고 있어요...');

  setTimeout(() => {
    StuDiag.mbtiResult = val;
    area.innerHTML = diagRenderMbtiResult(val);
    showToast(`${val} 분석 완료! 포트폴리오에 반영되었습니다.`, 'success');
  }, 1800);
}

/* MBTI 데이터 DB */
const MBTI_DB = {
  ISTJ: { name:'청렴결백한 논리주의자', emoji:'📋',
    traits:['원칙과 규칙을 철저히 준수','꼼꼼하고 신중한 업무 처리','강한 책임감과 성실성','체계적·계획적 사고'],
    learning:'반복 학습·요약 정리에 강함. 혼자 집중하는 환경 선호',
    social:'소수의 깊은 관계 선호. 신뢰 쌓이면 든든한 파트너',
    careers:['회계사','데이터 분석가','공무원','IT 시스템 관리자','법무사'],
    growth:'예상치 못한 변화에 유연하게 대응하는 연습이 필요해요' },
  ISFJ: { name:'용감한 수호자', emoji:'🛡️',
    traits:['배려심 깊고 헌신적','세심한 관찰력','안정 지향적','충성스러운 팀 플레이어'],
    learning:'실습·경험 중심 학습. 구체적 사례와 연계할 때 효과적',
    social:'온화하고 배려 깊음. 갈등 회피 성향 있음',
    careers:['간호사','사회복지사','교사','상담사','행정직'],
    growth:'자신의 감정과 필요도 표현하는 연습이 중요해요' },
  INFJ: { name:'선의의 옹호자', emoji:'🌿',
    traits:['통찰력과 직관 뛰어남','이상주의적·사명감 강함','깊이 있는 사고','공감 능력 탁월'],
    learning:'큰 그림과 의미 연결 학습. 글쓰기·성찰 활동 효과적',
    social:'깊은 유대 관계 추구. 피상적 관계에 에너지 소모',
    careers:['상담사','작가','교수','사회운동가','심리치료사'],
    growth:'완벽주의에서 벗어나 실행력을 높여보세요' },
  INTJ: { name:'용의주도한 전략가', emoji:'♟️',
    traits:['독립적·자기주도적','장기 전략 수립 능력','높은 기준과 목표 지향','논리적·분석적 사고'],
    learning:'독립 연구·심층 학습 선호. 비효율적 반복 학습 기피',
    social:'소수 정예 관계 선호. 논쟁적 대화도 즐김',
    careers:['전략 컨설턴트','AI 연구원','IT 아키텍트','투자 분석가','과학자'],
    growth:'다른 사람의 감정과 관점을 이해하는 공감 연습이 도움 돼요' },
  ISTP: { name:'만능 재주꾼', emoji:'🔧',
    traits:['문제 해결 능력 탁월','현실적·실용적','논리적 분석','독립적 행동'],
    learning:'직접 해보는 실습 학습. 이론보다 응용에 강함',
    social:'자유로운 관계 선호. 혼자 있는 시간 중요',
    careers:['엔지니어','파일럿','외과의사','데이터 엔지니어','기술자'],
    growth:'장기 계획 세우는 습관을 길러보세요' },
  ISFP: { name:'호기심 많은 예술가', emoji:'🎨',
    traits:['감성적·예술적 감각','친절하고 배려 깊음','현재에 충실','유연하고 개방적'],
    learning:'시각적·체험 학습. 자유로운 창작 활동에서 몰입',
    social:'따뜻하고 비판 없는 관계 선호',
    careers:['디자이너','예술가','간호사','수의사','요리사'],
    growth:'결정을 미루는 경향을 극복하고 실행력을 높여보세요' },
  INFP: { name:'열정적인 중재자', emoji:'🌈',
    traits:['이상주의적·가치 중심','깊은 공감 능력','창의적 표현력','진정성 추구'],
    learning:'의미 있는 주제 몰입 학습. 자유로운 사고 환경 필요',
    social:'진정성 있는 소수 관계 소중히 여김',
    careers:['작가','심리상담사','예술가','사회복지사','교육자'],
    growth:'현실적인 목표 설정과 구체적인 실행 계획 수립이 필요해요' },
  INTP: { name:'논리적인 사색가', emoji:'🔭',
    traits:['분석적·논리적 사고','지식 탐구 욕구 강함','독창적 아이디어','비판적 사고'],
    learning:'개념·원리 이해 중심. 토론·논증 학습 효과적',
    social:'지적 대화 즐김. 감정적 소통에 어려움 있을 수 있음',
    careers:['소프트웨어 개발자','수학자','AI 연구원','철학자','경제 분석가'],
    growth:'아이디어를 실제로 구현하는 실행력 강화가 필요해요' },
  ESTP: { name:'모험을 즐기는 사업가', emoji:'⚡',
    traits:['행동력·추진력 강함','현실적·즉각적 문제 해결','대담하고 직접적','관찰력 뛰어남'],
    learning:'실전·경험 중심 학습. 빠른 피드백 환경에서 성장',
    social:'활발하고 넓은 네트워크. 에너지 넘치는 대화 즐김',
    careers:['영업 전문가','기업가','스포츠 선수','응급의학과 의사','마케터'],
    growth:'충동적 결정을 줄이고 장기적 결과를 고려하는 습관이 중요해요' },
  ESFP: { name:'자유로운 연예인', emoji:'🎉',
    traits:['활기차고 낙천적','사람 지향적','즉흥적·유연함','감각적 즐거움 추구'],
    learning:'그룹 활동·발표·체험 학습 선호',
    social:'광범위한 사교 관계. 분위기 메이커',
    careers:['공연 예술가','이벤트 기획자','교사','영업직','관광 가이드'],
    growth:'장기 목표 설정과 꾸준한 실행 습관 강화가 필요해요' },
  ENFP: { name:'재기발랄한 활동가', emoji:'✨',
    traits:['창의적·열정적','아이디어 풍부','인간 중심적','가능성 탐구'],
    learning:'브레인스토밍·프로젝트 학습 선호. 새로운 주제에 빠르게 몰입',
    social:'따뜻하고 영감을 주는 관계. 다양한 사람과 쉽게 어울림',
    careers:['마케터','상담사','기업가','작가','교육 기획자'],
    growth:'한 가지에 집중하고 끝까지 완수하는 습관이 필요해요' },
  ENTP: { name:'뜨거운 논쟁을 즐기는 변론가', emoji:'💡',
    traits:['창의적·독창적 사고','논쟁과 토론 즐김','다양한 관점 탐구','빠른 적응력'],
    learning:'토론·논증 학습. 새로운 아이디어 탐구에서 동기 부여',
    social:'지적 자극이 있는 관계 선호. 도전적 대화 즐김',
    careers:['변호사','기업가','마케터','컨설턴트','발명가'],
    growth:'아이디어를 완성까지 끌고 가는 집중력과 인내가 필요해요' },
  ESTJ: { name:'엄격한 관리자', emoji:'🏛️',
    traits:['조직력·리더십 강함','규칙과 질서 중시','체계적·효율적','책임감 강함'],
    learning:'구조화된 학습. 명확한 목표와 계획 아래 효율적 학습',
    social:'명확한 역할 관계 선호. 팀을 이끄는 리더 역할 선호',
    careers:['경영자','군인·경찰','판사','공무원','프로젝트 매니저'],
    growth:'다른 사람의 방식도 존중하고 유연성을 키워보세요' },
  ESFJ: { name:'사교적인 외교관', emoji:'🤝',
    traits:['협력적·사교적','타인 배려 깊음','전통과 규범 중시','충성스럽고 헌신적'],
    learning:'그룹 학습·협력 프로젝트에서 동기 부여',
    social:'넓고 따뜻한 인간관계. 화합을 중요시함',
    careers:['의료인','교사','HR 담당자','사회복지사','이벤트 기획자'],
    growth:'비판을 개인적으로 받아들이지 않고 성장 기회로 삼아보세요' },
  ENFJ: { name:'정의로운 사회운동가', emoji:'🌟',
    traits:['카리스마 있는 리더십','타인 성장 지원','공감 능력 탁월','사명감 강함'],
    learning:'멘토링·교육 활동에서 동기 부여. 협력 학습 선호',
    social:'사람들에게 영감을 주는 관계. 넓고 의미 있는 네트워크',
    careers:['교사','상담사','HR 리더','사회운동가','코치'],
    growth:'자신의 필요와 감정도 챙기는 셀프케어 습관이 중요해요' },
  ENTJ: { name:'대담한 통솔자', emoji:'👑',
    traits:['강력한 리더십','전략적·장기적 사고','목표 지향적','결단력 강함'],
    learning:'도전적 목표 중심 학습. 경쟁적 환경에서 성장',
    social:'목표 공유 관계 선호. 직접적이고 효율적인 소통',
    careers:['CEO','전략 컨설턴트','변호사','정치인','투자 전문가'],
    growth:'팀원의 감정과 페이스도 배려하는 여유가 리더십을 더 강하게 해요' },
};

function diagRenderMbtiResult(code) {
  const d = MBTI_DB[code];
  if (!d) return `<div style="text-align:center;padding:20px;color:#9ca3af">알 수 없는 유형입니다</div>`;

  return `
    <div class="stu-animate">
      <!-- 유형 헤더 -->
      <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);border-radius:20px;
        padding:28px 24px;color:#fff;text-align:center;margin-bottom:16px">
        <div style="font-size:44px;margin-bottom:8px">${d.emoji}</div>
        <div style="font-size:36px;font-weight:900;letter-spacing:6px;margin-bottom:6px">${code}</div>
        <div style="font-size:16px;font-weight:700;opacity:.9">${d.name}</div>
      </div>

      <!-- 주요 특징 -->
      <div style="background:#fff;border-radius:16px;padding:20px;
        box-shadow:0 2px 12px rgba(0,0,0,.07);margin-bottom:14px">
        <div style="font-size:13px;font-weight:800;color:#4f46e5;margin-bottom:12px">✨ 주요 특징</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          ${d.traits.map(t => `
            <span style="background:#eef2ff;color:#4f46e5;padding:6px 14px;
              border-radius:999px;font-size:13px;font-weight:700;border:1.5px solid #c7d2fe">
              ${t}
            </span>`).join('')}
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px">
        <!-- 선호 학습 유형 -->
        <div style="background:#fff;border-radius:16px;padding:18px;
          box-shadow:0 2px 12px rgba(0,0,0,.07)">
          <div style="font-size:13px;font-weight:800;color:#0891b2;margin-bottom:10px">📖 선호 학습 유형</div>
          <div style="font-size:13px;color:#374151;line-height:1.7">${d.learning}</div>
        </div>
        <!-- 교우 관계 -->
        <div style="background:#fff;border-radius:16px;padding:18px;
          box-shadow:0 2px 12px rgba(0,0,0,.07)">
          <div style="font-size:13px;font-weight:800;color:#059669;margin-bottom:10px">🤝 교우 관계</div>
          <div style="font-size:13px;color:#374151;line-height:1.7">${d.social}</div>
        </div>
      </div>

      <!-- 진로 적합도 -->
      <div style="background:#fff;border-radius:16px;padding:20px;
        box-shadow:0 2px 12px rgba(0,0,0,.07);margin-bottom:14px">
        <div style="font-size:13px;font-weight:800;color:#7c3aed;margin-bottom:12px">💼 진로 적합 직업군</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          ${d.careers.map((c, i) => `
            <div style="display:flex;align-items:center;gap:6px;background:#f5f3ff;
              border:1.5px solid #e0e7ff;border-radius:10px;padding:8px 14px">
              <span style="font-size:11px;font-weight:900;color:#7c3aed;
                background:#ede9fe;width:20px;height:20px;border-radius:50%;
                display:flex;align-items:center;justify-content:center">${i+1}</span>
              <span style="font-size:13px;font-weight:700;color:#374151">${c}</span>
            </div>`).join('')}
        </div>
      </div>

      <!-- 성장 포인트 -->
      <div style="background:linear-gradient(135deg,#fff7ed,#fef9c3);border-radius:16px;
        padding:18px;border:1.5px solid #fed7aa">
        <div style="font-size:13px;font-weight:800;color:#d97706;margin-bottom:8px">🌱 이렇게 성장해봐요</div>
        <div style="font-size:14px;color:#374151;line-height:1.7">${d.growth}</div>
      </div>
    </div>`;
}

/* ============================================================
   탭 2: 직업선호도검사
   ============================================================ */

/* Holland 코드 DB (주요 2코드 조합) */
const HOLLAND_DB = {
  RI: { name:'현실형–탐구형', desc:'실용적이고 분석적인 기술자 유형',
    jobs:['소프트웨어 엔지니어','데이터 과학자','기계공학자','IT 시스템 전문가','환경공학자'],
    code_r:'물리적·기계적 활동을 좋아하고 도구·기계 조작에 능숙', code_i:'호기심이 많고 관찰·분석·연구 활동을 즐김' },
  IR: { name:'탐구형–현실형', desc:'과학적 탐구와 실무 적용을 동시에 즐기는 유형',
    jobs:['데이터 분석가','연구원','의료기기 개발자','컴퓨터 과학자','AI 엔지니어'],
    code_r:'실용적 도구·기술에 능숙', code_i:'분석·연구 중심 사고' },
  IA: { name:'탐구형–예술형', desc:'창의적 사고와 분석력을 겸비한 유형',
    jobs:['UX 연구원','데이터 시각화 전문가','과학 저널리스트','건축가','심리학자'],
    code_r:'분석적 탐구 선호', code_i:'창의적·미적 표현 욕구' },
  SA: { name:'사회형–예술형', desc:'사람과의 소통에서 창의성을 발휘하는 유형',
    jobs:['교사','상담사','광고 기획자','소셜 미디어 매니저','이벤트 기획자'],
    code_r:'타인 교육·지원에 능숙', code_i:'창의적 표현과 미적 감각' },
  SE: { name:'사회형–진취형', desc:'사람을 이끌고 동기부여하는 리더형',
    jobs:['HR 관리자','영업 관리자','교육 기획자','사회복지사','팀 리더'],
    code_r:'대인관계·교육에 강점', code_i:'추진력과 설득력' },
  EC: { name:'진취형–관습형', desc:'체계적으로 목표를 달성하는 경영인 유형',
    jobs:['경영 컨설턴트','금융 분석가','마케팅 매니저','기업가','감사인'],
    code_r:'목표 지향적·리더십', code_i:'조직적·체계적 업무 처리' },
  CS: { name:'관습형–사회형', desc:'정확한 업무와 대인 서비스를 결합하는 유형',
    jobs:['회계사','행정 공무원','의료 원무과','도서관 사서','인사 담당자'],
    code_r:'정확성·규칙 준수 강점', code_i:'서비스·지원 지향' },
  default: { name:'다재다능형', desc:'다양한 분야에 걸친 균형 잡힌 흥미',
    jobs:['프로젝트 매니저','교사','콘텐츠 크리에이터','창업가','컨설턴트'],
    code_r:'광범위한 흥미', code_i:'유연한 적응력' },
};

function diagRenderJobTab() {
  return `
    <!-- 안내 -->
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;
      padding:14px 18px;margin-bottom:16px;font-size:13px;color:#1d4ed8" class="stu-animate">
      💡 워크넷(직업선호도검사 L형·S형), 커리어넷 검사 결과지를<br>
      <strong>PDF 또는 이미지</strong>로 업로드하면 AI가 흥미코드와 추천 직업군을 분석해요.
    </div>

    <!-- 업로드 영역 -->
    <div id="job-upload-zone"
      style="border:2.5px dashed #93c5fd;border-radius:16px;padding:32px 20px;
        text-align:center;background:linear-gradient(135deg,#eff6ff,#f0f9ff);cursor:pointer;
        transition:all .2s;margin-bottom:16px" class="stu-animate"
      onclick="document.getElementById('job-file-input').click()"
      ondragover="event.preventDefault();this.style.borderColor='#2563eb'"
      ondragleave="this.style.borderColor='#93c5fd'">
      <div id="job-upload-inner">
        ${StuDiag.jobFile
          ? `<div style="font-size:32px;margin-bottom:8px">📄</div>
             <div style="font-size:14px;font-weight:700;color:#2563eb">${esc(StuDiag.jobFile)}</div>
             <div style="font-size:12px;color:#9ca3af;margin-top:4px">파일 변경하려면 클릭하세요</div>`
          : `<div style="font-size:40px;margin-bottom:10px">📊</div>
             <div style="font-size:15px;font-weight:800;color:#2563eb;margin-bottom:6px">
               직업선호도검사 결과지 업로드
             </div>
             <div style="font-size:13px;color:#9ca3af;line-height:1.6">
               워크넷 직업선호도검사 L형·S형, 커리어넷 적성검사 결과 등<br>
               PDF, JPG, PNG 파일 지원 · 최대 10MB
             </div>
             <div style="margin-top:14px">
               <span style="background:#2563eb;color:#fff;padding:8px 24px;border-radius:999px;
                 font-size:14px;font-weight:700;display:inline-block">파일 선택하기</span>
             </div>`}
      </div>
      <input type="file" id="job-file-input" style="display:none" accept=".pdf,.jpg,.jpeg,.png"
        onchange="handleDiagFileUpload(this,'job')">
    </div>

    <!-- AI 분석하기 버튼 -->
    ${StuDiag.jobFile ? `
      <button onclick="diagJobAnalyze()"
        style="width:100%;background:linear-gradient(135deg,#1d4ed8,#2563eb);color:#fff;border:none;
          border-radius:12px;padding:14px;font-size:15px;font-weight:800;cursor:pointer;
          box-shadow:0 4px 16px rgba(37,99,235,.35);margin-bottom:16px">
        🤖 AI 분석하기
      </button>` : ''}

    <!-- 결과 영역 -->
    <div id="job-result-area">
      ${StuDiag.jobResult ? diagRenderJobResult() : ''}
    </div>`;
}

function diagJobAnalyze() {
  if (!StuDiag.jobFile) { showToast('먼저 파일을 업로드해주세요.', 'error'); return; }
  const area = document.getElementById('job-result-area');
  if (!area) return;

  area.innerHTML = diagLoadingHtml('직업선호도 흥미코드를 분석하고 있어요...');

  setTimeout(() => {
    StuDiag.jobResult = true;
    area.innerHTML = diagRenderJobResult();
    showToast('직업선호도검사 분석 완료! 포트폴리오에 반영되었습니다.', 'success');
  }, 2200);
}

function diagRenderJobResult() {
  const code     = 'RI';
  const d        = HOLLAND_DB[code];
  const diagData = (DIAGNOSES['stu-001'] || []).find(x => x.psychTest);

  /* ── 코드별 선호 일 스타일 ── */
  const WORK_STYLES = {
    R:['실용적인 도구·기술 사용하기', '직접 눈으로 확인 가능한 결과 만들기', '혼자 집중해서 처리하는 업무', '기술·컴퓨터 다루기'],
    I:['데이터를 분석해 패턴 찾기', '문제 원인을 끝까지 파악하기', '새로운 지식 탐구하기', '논리적으로 해결책 도출하기'],
    S:['사람들을 가르치고 지원하기', '팀원과 협력해 목표 달성', '상담·코칭 활동', '다양한 사람과 소통하기'],
    A:['창의적인 아이디어 표현하기', '디자인·글쓰기 활동', '기존 틀을 벗어난 접근', '감성적 표현과 미적 작업'],
    E:['목표를 향해 팀 이끌기', '설득·협상·영업 활동', '새로운 기회 개척하기', '리더십 발휘하는 업무'],
    C:['정확한 데이터 정리·관리', '체계적인 절차 따르기', '꼼꼼하게 오류 없이 처리', '규칙과 기준에 따라 업무'],
  };

  /* ── 잘 맞는 직무 환경 ── */
  const JOB_ENVS = {
    RI:['자율적·독립적인 업무 환경', '데이터·기술 기반 업무', '조용하고 집중 가능한 공간', '결과물로 평가받는 조직 문화'],
    IR:['연구·개발 중심 환경', '실험·탐구 가능한 공간', '소규모 전문가 팀', '지적 성장을 지원하는 조직'],
    IA:['창의적 기술 융합 환경', 'UX·데이터 시각화 업무', '아이디어를 구현하는 공간', '자유로운 사고가 허용되는 문화'],
    SA:['사람과 창의성이 만나는 환경', '교육·미디어·콘텐츠 분야', '협력과 창작이 공존하는 팀', '다양성을 존중하는 조직'],
    SE:['사람 중심의 역동적 환경', 'HR·영업·교육 분야', '팀워크와 성장을 중시하는 문화', '성과를 인정받는 조직'],
    EC:['체계적인 목표 관리 환경', '경영·금융·마케팅 분야', '성과 지향적 조직', '커리어 성장 기회가 많은 곳'],
    CS:['정확성과 서비스가 중요한 환경', '공공기관·금융·의료 분야', '안정적이고 체계적인 조직', '규칙이 명확한 환경'],
  };
  const envList = JOB_ENVS[code] || ['자율적인 업무 환경', '기술 중심 업무', '논리적 사고 활용', '결과로 평가받는 문화'];
  const c1 = code[0], c2 = code[1];
  const s1 = WORK_STYLES[c1] || [], s2 = WORK_STYLES[c2] || [];

  /* ── 강점 & 성장 포인트 데이터 ── */
  let strengthCards = [];
  let growthCards   = [];

  if (diagData) {
    const allPos = [
      { key:'sincerity',       label:'성실함',    icon:'⭐', color:'#059669', bg:'#f0fdf4', border:'#bbf7d0',
        score: diagData.psychTest.sincerity,
        desc:'맡은 일을 끝까지 해내는 힘이에요. 쉽게 포기하지 않는 꾸준함이 가장 큰 무기예요.',
        usage:'자격증 준비나 장기 프로젝트처럼 꾸준함이 필요한 분야에서 특히 빛나요! ✨' },
      { key:'responsibility',  label:'책임감',    icon:'🛡️', color:'#4f46e5', bg:'#eef2ff', border:'#c7d2fe',
        score: diagData.psychTest.responsibility,
        desc:'맡은 역할을 절대 포기하지 않는 신뢰감 있는 사람이에요.',
        usage:'팀 프로젝트나 인턴십에서 "믿을 수 있는 사람"으로 인정받아요 👍' },
      { key:'goalOrientation', label:'목표의식',  icon:'🎯', color:'#7c3aed', bg:'#f5f3ff', border:'#e0e7ff',
        score: diagData.psychTest.goalOrientation,
        desc:'어디로 가야 하는지 명확히 알고, 그 방향으로 꾸준히 나아가요.',
        usage:'취업 로드맵을 스스로 설계하고 실행하는 데 정말 강해요 🗺️' },
      { key:'receptivity',     label:'열린 마음', icon:'🌈', color:'#0891b2', bg:'#ecfeff', border:'#a5f3fc',
        score: diagData.psychTest.receptivity,
        desc:'다양한 경험과 새 아이디어를 잘 받아들이는 유연함이 있어요.',
        usage:'새로운 기술 트렌드를 빠르게 흡수해 성장 속도가 빨라요 🚀' },
      { key:'academics',       label:'학업 역량', icon:'📚', color:'#1d4ed8', bg:'#eff6ff', border:'#bfdbfe',
        score: diagData.lifeHistory.academics,
        desc:'꾸준히 공부하는 습관과 학업 성취 능력이 있어요.',
        usage:'자격증 취득과 전공 심화에 유리하고, 면접에서도 강점이 돼요 🏅' },
      { key:'independence',    label:'독립심',    icon:'🦅', color:'#d97706', bg:'#fffbeb', border:'#fde68a',
        score: diagData.lifeHistory.independence,
        desc:'스스로 판단하고 혼자 실행하는 자립심이 강해요.',
        usage:'혼자 하는 공부, 개인 프로젝트, 자기주도 업무에서 두각을 나타내요 💪' },
      { key:'ambition',        label:'도전 의지', icon:'🔥', color:'#dc2626', bg:'#fef2f2', border:'#fca5a5',
        score: diagData.lifeHistory.ambition,
        desc:'높은 목표를 두려워하지 않고 도전하는 에너지가 있어요.',
        usage:'취업 목표를 높게 잡고, 끝까지 달성하는 데 강해요 🏆' },
    ];
    strengthCards = allPos.filter(t => t.score >= 58).sort((a, b) => b.score - a.score).slice(0, 4);

    const allGrowth = [
      { key:'sociability',     label:'사람들과 어울리기',   icon:'🤝',
        score: diagData.psychTest.sociability,
        desc:'사람들과 교류하는 게 아직 편하지 않을 수 있어요. 조금씩 연습하면 충분히 늘어나요!',
        tips:['소그룹 스터디나 동아리에 한 번 참여해보기', '발표 수업에서 짧게 말하는 연습 시작하기', '상담사 선생님께 네트워킹 방법 상담 요청하기'] },
      { key:'interpersonal',   label:'새 사람과 관계 맺기', icon:'👥',
        score: diagData.lifeHistory.interpersonal,
        desc:'새로운 사람과 친해지는 게 아직 어색할 수 있어요. 처음엔 다 그래요, 걱정 마세요!',
        tips:['학과 행사나 소모임에 한 번만 참여해보기', '같은 관심사를 가진 동기 찾아보기', '선배 멘토링 프로그램 신청해 연결되기'] },
      { key:'receptivity',     label:'새 경험 받아들이기',  icon:'🌱',
        score: diagData.psychTest.receptivity,
        desc:'새로운 환경에 적응하는 데 시간이 걸릴 수 있어요. 충분히 자연스러운 일이에요 😊',
        tips:['비교과 프로그램 하나만 골라 신청해보기', '평소 관심 없던 분야 강의 하나 도전해보기', '현장실습이나 인턴십 경험 미리 계획하기'] },
      { key:'goalOrientation', label:'목표 꾸준히 붙잡기',  icon:'🗺️',
        score: diagData.psychTest.goalOrientation,
        desc:'목표를 세우긴 하지만 중간에 흔들릴 수 있어요. 완벽하지 않아도 괜찮아요 🙆',
        tips:['큰 목표를 작은 주간 목표로 나눠보기', '목표 달성 체크리스트 앱 활용하기', '상담사 선생님과 월 1회 목표 점검 상담하기'] },
      { key:'sincerity',       label:'꾸준히 지속하기',     icon:'⏰',
        score: diagData.psychTest.sincerity,
        desc:'시작은 잘 하지만 지속하는 게 어렵게 느껴질 수 있어요. 매우 흔한 고민이에요!',
        tips:['하루 30분 공부 루틴 먼저 만들기', '스터디 파트너를 만들어 서로 관리하기', '매일 소소한 성취를 기록하는 습관 만들기'] },
    ];
    growthCards = allGrowth.filter(g => g.score < 58).sort((a, b) => a.score - b.score).slice(0, 3);
  }

  /* ── 검사 데이터 없을 때 기본 카드 ── */
  if (strengthCards.length === 0) {
    strengthCards = [
      { label:'분석적 사고', icon:'🔍', color:'#4f46e5', bg:'#eef2ff', border:'#c7d2fe', score:75,
        desc:'데이터와 논리를 좋아하고 꼼꼼하게 분석하는 능력이 있어요.',
        usage:'데이터 분석, AI 개발 업무에 정말 잘 맞아요! ✨' },
      { label:'기술 활용력', icon:'💻', color:'#059669', bg:'#f0fdf4', border:'#bbf7d0', score:72,
        desc:'새로운 기술을 빠르게 배우고 실무에 적용하는 능력이 뛰어나요.',
        usage:'IT·데이터 분야 취업 시 가장 큰 경쟁력이 돼요! 🚀' },
    ];
  }

  return `
    <div class="stu-animate">

      <!-- ========== 1단계: 흥미코드 ========== -->
      <div style="background:linear-gradient(135deg,#1d4ed8,#2563eb);border-radius:20px;
        padding:24px 20px;color:#fff;text-align:center;margin-bottom:6px">
        <div style="font-size:11px;font-weight:800;opacity:.65;letter-spacing:3px;margin-bottom:6px">STEP 1</div>
        <div style="font-size:13px;opacity:.8;margin-bottom:8px">흥미코드</div>
        <div style="font-size:62px;font-weight:900;letter-spacing:18px;margin-bottom:10px">${code}</div>
        <div style="font-size:15px;font-weight:800;margin-bottom:4px">${d.name}</div>
        <div style="font-size:13px;opacity:.7">${d.desc}</div>
      </div>

      <!-- 코드 의미 + 일 스타일 -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
        ${[
          { letter:c1, typeLabel:d.code_r, styles:s1, color:'#2563eb', bg:'#eff6ff', border:'#bfdbfe' },
          { letter:c2, typeLabel:d.code_i, styles:s2, color:'#7c3aed', bg:'#f5f3ff', border:'#e0e7ff' },
        ].map(c => `
          <div style="background:${c.bg};border:1.5px solid ${c.border};border-radius:16px;padding:16px">
            <div style="font-size:30px;font-weight:900;color:${c.color};margin-bottom:4px">${c.letter}형</div>
            <div style="font-size:12px;color:#4b5563;line-height:1.6;margin-bottom:12px">${c.typeLabel}</div>
            <div style="font-size:11px;font-weight:800;color:${c.color};margin-bottom:8px">선호하는 일 스타일</div>
            ${c.styles.map(s => `
              <div style="display:flex;align-items:flex-start;gap:6px;margin-bottom:6px">
                <div style="width:6px;height:6px;border-radius:50%;background:${c.color};
                  flex-shrink:0;margin-top:5px"></div>
                <span style="font-size:12px;color:#374151;line-height:1.5">${s}</span>
              </div>`).join('')}
          </div>`).join('')}
      </div>

      <!-- 잘 맞는 직무 환경 -->
      <div style="background:#fff;border-radius:14px;padding:16px 20px;
        box-shadow:0 2px 10px rgba(0,0,0,.06);margin-bottom:14px">
        <div style="font-size:13px;font-weight:800;color:#1d4ed8;margin-bottom:12px">🏢 이런 환경에서 제일 잘 빛나요</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          ${envList.map(e => `
            <span style="background:#eff6ff;color:#1d4ed8;border:1.5px solid #bfdbfe;
              border-radius:999px;padding:7px 16px;font-size:13px;font-weight:700">
              ✓ ${e}
            </span>`).join('')}
        </div>
      </div>

      <!-- 추천 직업군 -->
      <div style="background:#fff;border-radius:14px;padding:16px 20px;
        box-shadow:0 2px 10px rgba(0,0,0,.06);margin-bottom:28px">
        <div style="font-size:13px;font-weight:800;color:#1d4ed8;margin-bottom:12px">💼 추천 직업군 TOP 5</div>
        ${d.jobs.map((job, i) => {
          const colors = ['#1d4ed8','#2563eb','#3b82f6','#60a5fa','#93c5fd'];
          return `
            <div style="display:flex;align-items:center;gap:12px;padding:9px 0;
              ${i < d.jobs.length - 1 ? 'border-bottom:1px solid #f3f4f6' : ''}">
              <div style="width:26px;height:26px;border-radius:50%;background:${colors[i]};
                display:flex;align-items:center;justify-content:center;
                font-size:11px;font-weight:900;color:#fff;flex-shrink:0">${i + 1}</div>
              <span style="font-size:14px;font-weight:700;color:#1f2937">${job}</span>
            </div>`;
        }).join('')}
      </div>

      <!-- ========== 2단계: 나의 강점 ========== -->
      <div style="background:linear-gradient(135deg,#059669,#10b981);border-radius:16px;
        padding:18px 20px;color:#fff;margin-bottom:14px;text-align:center">
        <div style="font-size:11px;font-weight:800;opacity:.65;letter-spacing:3px;margin-bottom:4px">STEP 2</div>
        <div style="font-size:17px;font-weight:900;margin-bottom:4px">✨ 나의 강점</div>
        <div style="font-size:13px;opacity:.85">성격검사 + 생활사검사 결과를 함께 분석했어요</div>
      </div>

      <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:28px">
        ${strengthCards.map(s => `
          <div style="background:${s.bg};border:1.5px solid ${s.border};border-radius:16px;padding:18px">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
              <span style="font-size:28px">${s.icon}</span>
              <div style="flex:1">
                <div style="font-size:15px;font-weight:900;color:${s.color}">${s.label}</div>
                <div style="font-size:12px;color:#6b7280;margin-top:1px">점수 ${s.score}점</div>
              </div>
              <div style="background:${s.color};color:#fff;border-radius:999px;padding:4px 12px;
                font-size:11px;font-weight:800;white-space:nowrap">
                ${s.score >= 75 ? '최상위' : s.score >= 65 ? '상위권' : '평균 이상'}
              </div>
            </div>
            <div style="background:#e5e7eb;border-radius:99px;height:6px;margin-bottom:12px">
              <div style="background:${s.color};height:6px;border-radius:99px;
                width:${s.score}%;transition:width .6s ease"></div>
            </div>
            <div style="font-size:13px;color:#374151;line-height:1.7;margin-bottom:10px">
              ${s.desc}
            </div>
            <div style="background:rgba(255,255,255,.75);border-radius:10px;padding:10px 14px;
              font-size:13px;color:${s.color};font-weight:700;line-height:1.6">
              💡 활용법: ${s.usage}
            </div>
          </div>`).join('')}
      </div>

      <!-- ========== 3단계: 성장 포인트 ========== -->
      <div style="background:linear-gradient(135deg,#f59e0b,#fbbf24);border-radius:16px;
        padding:18px 20px;color:#fff;margin-bottom:14px;text-align:center">
        <div style="font-size:11px;font-weight:800;opacity:.65;letter-spacing:3px;margin-bottom:4px">STEP 3</div>
        <div style="font-size:17px;font-weight:900;margin-bottom:4px">🌱 이렇게 성장해봐요</div>
        <div style="font-size:13px;opacity:.9">약점이 아니에요 — 앞으로 더 빛날 포인트예요!</div>
      </div>

      <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:24px">
        ${growthCards.length > 0
          ? growthCards.map(g => `
            <div style="background:#fff;border:1.5px solid #fde68a;border-radius:16px;padding:18px">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
                <span style="font-size:26px">${g.icon}</span>
                <div style="flex:1">
                  <div style="font-size:15px;font-weight:900;color:#d97706">${g.label}</div>
                  <div style="font-size:12px;color:#9ca3af;margin-top:1px">현재 점수 ${g.score}점</div>
                </div>
                <div style="background:#fef3c7;color:#d97706;border:1.5px solid #fde68a;
                  border-radius:999px;padding:4px 12px;font-size:11px;font-weight:800">
                  성장 기회 ↑
                </div>
              </div>
              <div style="background:#fffbeb;border-radius:10px;padding:10px 14px;
                font-size:13px;color:#4b5563;line-height:1.7;margin-bottom:12px">
                ${g.desc}
              </div>
              <div style="font-size:12px;font-weight:800;color:#d97706;margin-bottom:8px">📋 이렇게 해봐요</div>
              ${g.tips.map((tip, i) => `
                <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:7px">
                  <div style="width:20px;height:20px;border-radius:50%;background:#fef3c7;
                    border:1.5px solid #fde68a;display:flex;align-items:center;justify-content:center;
                    font-size:10px;font-weight:900;color:#d97706;flex-shrink:0;margin-top:1px">${i + 1}</div>
                  <span style="font-size:13px;color:#374151;line-height:1.6">${tip}</span>
                </div>`).join('')}
            </div>`).join('')
          : `<div style="text-align:center;padding:24px;color:#9ca3af;font-size:14px;
               background:#fffbeb;border-radius:14px;border:1.5px dashed #fde68a">
               🎉 주요 항목에서 고루 좋은 점수를 받았어요! 정말 잘하고 있어요.
             </div>`}
      </div>

      <!-- AI 종합 코멘트 -->
      <div style="background:linear-gradient(135deg,#eff6ff,#f0f9ff);border-radius:14px;
        padding:16px 20px;border:1.5px solid #bfdbfe">
        <div style="font-size:12px;font-weight:800;color:#2563eb;margin-bottom:8px">🤖 AI 종합 분석</div>
        <div style="font-size:14px;color:#374151;line-height:1.8">
          <strong>${code} 흥미코드</strong>는 현재 희망하는 <strong>데이터 분석가</strong> 방향과 매우 잘 맞아요! 💪<br>
          기술력 + 분석력을 동시에 갖춘 조합이에요. 강점을 꾸준히 살려나가면
          충분히 원하는 진로를 이룰 수 있어요 🚀
        </div>
      </div>

    </div>`;
}

/* ============================================================
   탭 3: 성격·심리검사
   ============================================================ */
function diagRenderPsychTab() {
  return `
    <!-- 안내 -->
    <div style="background:#fdf4ff;border:1px solid #e9d5ff;border-radius:12px;
      padding:14px 18px;margin-bottom:16px;font-size:13px;color:#7c3aed" class="stu-animate">
      💡 학교에서 실시한 <strong>성격검사, 심리검사, MMPI, PAI, SCT</strong> 등<br>
      결과지를 업로드하면 AI가 강점·약점·생활사를 종합 분석해드려요.
    </div>

    <!-- 업로드 영역 -->
    <div id="psych-upload-zone"
      style="border:2.5px dashed #d8b4fe;border-radius:16px;padding:32px 20px;
        text-align:center;background:linear-gradient(135deg,#fdf4ff,#faf5ff);cursor:pointer;
        transition:all .2s;margin-bottom:16px" class="stu-animate"
      onclick="document.getElementById('psych-file-input').click()"
      ondragover="event.preventDefault();this.style.borderColor='#7c3aed'"
      ondragleave="this.style.borderColor='#d8b4fe'">
      <div id="psych-upload-inner">
        ${StuDiag.psychFile
          ? `<div style="font-size:32px;margin-bottom:8px">📄</div>
             <div style="font-size:14px;font-weight:700;color:#7c3aed">${esc(StuDiag.psychFile)}</div>
             <div style="font-size:12px;color:#9ca3af;margin-top:4px">파일 변경하려면 클릭하세요</div>`
          : `<div style="font-size:40px;margin-bottom:10px">💙</div>
             <div style="font-size:15px;font-weight:800;color:#7c3aed;margin-bottom:6px">
               성격·심리검사 결과지 업로드
             </div>
             <div style="font-size:13px;color:#9ca3af;line-height:1.6">
               성격검사, 심리검사, 생활사 검사 결과지<br>
               PDF, JPG, PNG 파일 지원 · 최대 10MB
             </div>
             <div style="margin-top:14px">
               <span style="background:#7c3aed;color:#fff;padding:8px 24px;border-radius:999px;
                 font-size:14px;font-weight:700;display:inline-block">파일 선택하기</span>
             </div>`}
      </div>
      <input type="file" id="psych-file-input" style="display:none" accept=".pdf,.jpg,.jpeg,.png"
        onchange="handleDiagFileUpload(this,'psych')">
    </div>

    <!-- AI 분석하기 버튼 -->
    ${StuDiag.psychFile ? `
      <button onclick="diagPsychAnalyze()"
        style="width:100%;background:linear-gradient(135deg,#6d28d9,#7c3aed);color:#fff;border:none;
          border-radius:12px;padding:14px;font-size:15px;font-weight:800;cursor:pointer;
          box-shadow:0 4px 16px rgba(124,58,237,.35);margin-bottom:16px">
        🤖 AI 분석하기
      </button>` : ''}

    <!-- 결과 영역 -->
    <div id="psych-result-area">
      ${StuDiag.psychResult ? diagRenderPsychResult() : ''}
    </div>`;
}

function diagPsychAnalyze() {
  if (!StuDiag.psychFile) { showToast('먼저 파일을 업로드해주세요.', 'error'); return; }
  const area = document.getElementById('psych-result-area');
  if (!area) return;

  area.innerHTML = diagLoadingHtml('성격·심리 데이터를 분석하고 있어요...');

  setTimeout(() => {
    StuDiag.psychResult = true;
    area.innerHTML = diagRenderPsychResult();
    showToast('성격·심리검사 분석 완료! 포트폴리오에 반영되었습니다.', 'success');
  }, 2500);
}

function diagRenderPsychResult() {
  // data.js의 샘플 데이터 기반으로 렌더
  const d = (DIAGNOSES['stu-001'] || []).find(x => x.psychTest);
  if (!d) return '';

  const psychFields = [
    { label:'사교성',     val: d.psychTest.sociability,     tip:'사람과의 교류·네트워킹 활동 선호도' },
    { label:'포감성',     val: d.psychTest.receptivity,     tip:'다양한 경험·감정에 대한 수용성' },
    { label:'성실성',     val: d.psychTest.sincerity,       tip:'책임감·꾸준함·약속 이행 정도' },
    { label:'책임감',     val: d.psychTest.responsibility,  tip:'맡은 일에 대한 완수 의지' },
    { label:'목표지향성', val: d.psychTest.goalOrientation, tip:'명확한 목표 설정·추진 능력' },
    { label:'불안',       val: d.psychTest.anxiety,         tip:'높을수록 걱정·긴장 수준 높음' },
    { label:'우울',       val: d.psychTest.depression,      tip:'높을수록 정서적 어려움 수준 높음' },
  ];
  const lifeFields = [
    { label:'대인관계', val: d.lifeHistory.interpersonal },
    { label:'독립심',   val: d.lifeHistory.independence },
    { label:'학업',     val: d.lifeHistory.academics },
    { label:'야망',     val: d.lifeHistory.ambition },
    { label:'운동선호', val: d.lifeHistory.sportsPreference },
  ];

  const gradeColor = v => v >= 60 ? '#059669' : v >= 40 ? '#d97706' : '#dc2626';
  const gradeLabel = v => v >= 60 ? '높음' : v >= 40 ? '보통' : '낮음';

  const strengths = psychFields.filter(f =>
    !['불안','우울'].includes(f.label) && f.val >= 60);
  const weaknesses = psychFields.filter(f =>
    !['불안','우울'].includes(f.label) && f.val < 40);
  const risks = psychFields.filter(f =>
    ['불안','우울'].includes(f.label) && f.val >= 50);

  return `
    <div class="stu-animate">

      <!-- 성격 강점 -->
      <div style="background:#fff;border-radius:16px;padding:20px;
        box-shadow:0 2px 12px rgba(0,0,0,.07);margin-bottom:14px">
        <div style="font-size:13px;font-weight:800;color:#059669;margin-bottom:12px">💪 성격 강점</div>
        ${strengths.length > 0
          ? `<div style="display:flex;flex-wrap:wrap;gap:8px">
              ${strengths.map(f => `
                <span style="background:#d1fae5;color:#065f46;padding:7px 14px;border-radius:999px;
                  font-size:13px;font-weight:700;border:1.5px solid #6ee7b7">
                  ${f.label} (${f.val}점)
                </span>`).join('')}
             </div>`
          : '<p style="font-size:13px;color:#9ca3af">전반적으로 균형 잡힌 성격 프로파일이에요.</p>'}
      </div>

      <!-- 성격 약점 -->
      <div style="background:#fff;border-radius:16px;padding:20px;
        box-shadow:0 2px 12px rgba(0,0,0,.07);margin-bottom:14px">
        <div style="font-size:13px;font-weight:800;color:#d97706;margin-bottom:12px">🌱 보완이 필요한 부분</div>
        ${weaknesses.length > 0
          ? `<div style="display:flex;flex-wrap:wrap;gap:8px">
              ${weaknesses.map(f => `
                <span style="background:#fef3c7;color:#92400e;padding:7px 14px;border-radius:999px;
                  font-size:13px;font-weight:700;border:1.5px solid #fde68a">
                  ${f.label} (${f.val}점)
                </span>`).join('')}
             </div>
             <p style="font-size:13px;color:#6b7280;margin:10px 0 0;line-height:1.6">
               낮은 점수가 꼭 단점은 아니에요. 상담사 선생님과 함께 성장 전략을 세워봐요 🙌
             </p>`
          : '<p style="font-size:13px;color:#9ca3af">두드러진 약점 항목이 없어요. 고르게 발달되어 있어요!</p>'}
      </div>

      <!-- 점수 시각화 -->
      <div style="background:#fff;border-radius:16px;padding:20px;
        box-shadow:0 2px 12px rgba(0,0,0,.07);margin-bottom:14px">
        <div style="font-size:13px;font-weight:800;color:#7c3aed;margin-bottom:14px">📊 성격 점수 상세</div>
        ${psychFields.map(f => `
          <div style="margin-bottom:12px">
            <div style="display:flex;justify-content:space-between;align-items:center;
              font-size:13px;margin-bottom:5px">
              <div>
                <span style="font-weight:700;color:#374151">${f.label}</span>
                <span style="font-size:11px;color:#9ca3af;margin-left:6px">${f.tip}</span>
              </div>
              <span style="font-weight:800;color:${gradeColor(f.val)};font-size:13px">
                ${f.val}점 <span style="font-size:11px">(${gradeLabel(f.val)})</span>
              </span>
            </div>
            <div style="background:#f3f4f6;border-radius:99px;height:8px">
              <div style="background:${gradeColor(f.val)};height:8px;border-radius:99px;
                width:${f.val}%;transition:width .5s"></div>
            </div>
          </div>`).join('')}

        ${risks.length > 0 ? `
          <div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:10px;
            padding:12px 14px;margin-top:8px;font-size:13px;color:#991b1b">
            ⚠️ <strong>${risks.map(r => r.label).join(', ')}</strong> 수치가 높게 나타났어요.
            상담사 선생님과 이야기 나눠보시기를 권장해요.
          </div>` : ''}
      </div>

      <!-- 생활사 연계 분석 -->
      <div style="background:#fff;border-radius:16px;padding:20px;
        box-shadow:0 2px 12px rgba(0,0,0,.07);margin-bottom:14px">
        <div style="font-size:13px;font-weight:800;color:#0891b2;margin-bottom:14px">🏃 생활사 연계 분석</div>
        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px">
          ${lifeFields.map(f => `
            <div style="text-align:center;background:#f0f9ff;border-radius:12px;padding:12px 6px;
              border:1.5px solid #bae6fd">
              <div style="font-size:11px;color:#0891b2;font-weight:700;margin-bottom:6px">${f.label}</div>
              <div style="font-size:20px;font-weight:900;color:#0369a1">${f.val}</div>
              <div style="font-size:10px;color:${gradeColor(f.val)};font-weight:700;margin-top:3px">
                ${gradeLabel(f.val)}</div>
            </div>`).join('')}
        </div>
        <p style="font-size:13px;color:#374151;line-height:1.7;margin:14px 0 0">
          학업(${d.lifeHistory.academics}점)과 독립심(${d.lifeHistory.independence}점)이 평균 이상으로,
          자기 주도적 학습 능력이 뛰어납니다. 대인관계(${d.lifeHistory.interpersonal}점) 역량을
          꾸준히 키워가면 팀 환경에서도 더욱 빛날 수 있어요.
        </p>
      </div>

      <!-- 종합 해석 -->
      <div style="background:linear-gradient(135deg,#f5f3ff,#ede9fe);border-radius:16px;
        padding:20px;border:1.5px solid #c4b5fd">
        <div style="font-size:13px;font-weight:800;color:#4f46e5;margin-bottom:10px">🤖 AI 종합 해석</div>
        <div style="font-size:14px;color:#374151;line-height:1.8">
          ${d.studentInterpretation.description}<br><br>
          <strong>성장 포인트:</strong> ${d.studentInterpretation.growthPoint}
        </div>
      </div>
    </div>`;
}

/* ---- 공통 헬퍼 ---- */

// 파일 업로드 공통 처리
function handleDiagFileUpload(input, type) {
  if (!input.files.length) return;
  const file = input.files[0];
  const name = file.name;

  if (type === 'job') {
    StuDiag.jobFile   = name;
    StuDiag.jobResult = false;
  } else {
    StuDiag.psychFile   = name;
    StuDiag.psychResult = false;
  }

  showToast(`"${name}" 파일이 선택되었습니다.`, 'info');

  // 탭 콘텐츠 재렌더 (업로드 영역 + 분석 버튼 표시)
  const el = document.getElementById('diag-tab-content');
  if (el) el.innerHTML = diagRenderCurrentTab();
}

// 로딩 HTML 공통
function diagLoadingHtml(msg) {
  return `
    <div style="background:linear-gradient(135deg,#f5f3ff,#ede9fe);border-radius:16px;
      padding:32px;text-align:center;border:1.5px solid #c4b5fd;margin-bottom:16px">
      <div style="font-size:32px;margin-bottom:10px">🤖</div>
      <div style="font-size:15px;font-weight:800;color:#4f46e5;margin-bottom:6px">${msg}</div>
      <div style="font-size:12px;color:#9ca3af;margin-bottom:16px">잠시만 기다려주세요</div>
      <div style="display:flex;justify-content:center;gap:4px">
        ${[0,150,300].map(d =>
          `<div style="width:9px;height:9px;background:#c4b5fd;border-radius:50%;
            animation:bounce .8s ease-in-out ${d}ms infinite alternate"></div>`
        ).join('')}
      </div>
    </div>`;
}

/* ==========================================================
   4. 학업설계 (수강이력 입력 + AI 추천)
   ========================================================== */

// 수강이력 상태 (화면 유지용)
const StuPlan = {
  courses: [
    // 기본 예시 데이터
    { id: 1, year: '2025', sem: '2학기', name: 'Python 프로그래밍', credit: 3, grade: 'A+', type: '전공선택' },
    { id: 2, year: '2025', sem: '2학기', name: '자료구조',           credit: 3, grade: 'B+', type: '전공필수' },
    { id: 3, year: '2026', sem: '1학기', name: '인공지능 개론',      credit: 3, grade: 'A',  type: '전공선택' },
  ],
  nextId: 4,
  aiShown: false,
};

function renderStudentPlan() {
  document.getElementById('app-content').innerHTML = `
  <div style="max-width:720px;margin:0 auto">
    ${stuBack('stu-home')}

    <!-- ① 수강이력 입력 폼 -->
    <div class="stu-section-title stu-animate stu-animate-delay-1">📝 수강이력 입력</div>
    <div class="stu-animate stu-animate-delay-1"
      style="background:#fff;border-radius:var(--radius-lg);padding:20px;
        box-shadow:0 2px 12px rgba(0,0,0,.07);margin-bottom:20px">

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
        <!-- 학년도 -->
        <div>
          <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:5px">학년도</label>
          <select id="plan-year"
            style="width:100%;border:1.5px solid #e5e7eb;border-radius:9px;padding:9px 10px;font-size:14px;color:#374151">
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>
        <!-- 학기 -->
        <div>
          <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:5px">학기</label>
          <select id="plan-sem"
            style="width:100%;border:1.5px solid #e5e7eb;border-radius:9px;padding:9px 10px;font-size:14px;color:#374151">
            <option>1학기</option>
            <option>2학기</option>
          </select>
        </div>
      </div>

      <!-- 과목명 (한 줄 전체) -->
      <div style="margin-bottom:10px">
        <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:5px">과목명</label>
        <input id="plan-name" type="text" placeholder="예: 머신러닝 기초"
          style="width:100%;border:1.5px solid #e5e7eb;border-radius:9px;padding:9px 12px;font-size:14px"
          onkeydown="if(event.key==='Enter') planAddCourse()">
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px">
        <!-- 학점 -->
        <div>
          <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:5px">학점</label>
          <select id="plan-credit"
            style="width:100%;border:1.5px solid #e5e7eb;border-radius:9px;padding:9px 10px;font-size:14px;color:#374151">
            <option value="3">3학점</option>
            <option value="2">2학점</option>
            <option value="1">1학점</option>
          </select>
        </div>
        <!-- 성적 -->
        <div>
          <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:5px">성적</label>
          <select id="plan-grade"
            style="width:100%;border:1.5px solid #e5e7eb;border-radius:9px;padding:9px 10px;font-size:14px;color:#374151">
            ${['A+','A','B+','B','C+','C','D','F'].map(g =>
              `<option value="${g}">${g}</option>`).join('')}
          </select>
        </div>
        <!-- 이수구분 -->
        <div>
          <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:5px">이수구분</label>
          <select id="plan-type"
            style="width:100%;border:1.5px solid #e5e7eb;border-radius:9px;padding:9px 10px;font-size:14px;color:#374151">
            <option>전공필수</option>
            <option>전공선택</option>
            <option>교양필수</option>
            <option>교양선택</option>
          </select>
        </div>
      </div>

      <button onclick="planAddCourse()"
        style="width:100%;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;border:none;
          border-radius:10px;padding:12px;font-size:14px;font-weight:800;cursor:pointer;
          transition:opacity .15s"
        onmouseover="this.style.opacity='.88'" onmouseout="this.style.opacity='1'">
        ➕ 추가하기
      </button>
    </div>

    <!-- ② 입력된 과목 목록 -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <div class="stu-section-title" style="margin:0">📚 입력된 수강이력
        <span id="plan-count-badge"
          style="background:#eef2ff;color:#4f46e5;font-size:12px;font-weight:800;
            padding:2px 9px;border-radius:999px;margin-left:6px">
          ${StuPlan.courses.length}과목
        </span>
      </div>
      ${StuPlan.courses.length > 0 ? `
        <button onclick="planClearAll()"
          style="background:none;border:none;font-size:12px;color:#9ca3af;cursor:pointer;
            text-decoration:underline">전체 삭제</button>` : ''}
    </div>

    <div id="plan-course-list" style="margin-bottom:20px">
      ${planRenderCourseList()}
    </div>

    <!-- ③ AI 추천받기 버튼 -->
    <button onclick="planAiRecommend()"
      style="width:100%;background:linear-gradient(135deg,#312e81,#4f46e5,#7c3aed);color:#fff;
        border:none;border-radius:14px;padding:16px;font-size:15px;font-weight:900;cursor:pointer;
        box-shadow:0 6px 20px rgba(79,70,229,.35);margin-bottom:24px;transition:transform .15s"
      onmouseover="this.style.transform='scale(1.01)'"
      onmouseout="this.style.transform='scale(1)'">
      🤖 AI 추천받기 — 입력한 수강이력 기반으로 다음 학기 추천
    </button>

    <!-- ④ AI 추천 결과 (처음엔 숨김) -->
    <div id="plan-ai-result" style="${StuPlan.aiShown ? '' : 'display:none'}">
      ${StuPlan.aiShown ? planRenderAiResult() : ''}
    </div>

    <!-- ⑤ 이수 현황 요약 -->
    <div class="stu-section-title stu-animate">📊 이수 현황 요약</div>
    <div id="plan-summary-bar"
      style="background:#fff;border-radius:var(--radius-lg);padding:20px;
        box-shadow:0 2px 12px rgba(0,0,0,.07);margin-bottom:20px">
      ${planRenderSummaryBars()}
    </div>

    <!-- ⑥ 추천 비교과 -->
    <div class="stu-section-title stu-animate">🏆 추천 비교과 프로그램</div>
    <div style="background:#fff;border-radius:var(--radius-lg);padding:16px 20px;
      box-shadow:0 2px 12px rgba(0,0,0,.07);margin-bottom:24px">
      ${[
        { icon:'🎤', name:'AI 특강: 실무 데이터 분석', date:'4.22 (화)', tag:'강력 추천', color:'#059669' },
        { icon:'🏕️', name:'취업캠프 (데이터·IT 직군)',  date:'5.10~12',  tag:'추천',     color:'#4f46e5' },
        { icon:'🤝', name:'AI 멘토링 프로그램',         date:'상시',     tag:'추천',     color:'#4f46e5' },
        { icon:'💻', name:'SQL·Python 집중 특강',      date:'5.20',     tag:'권장',     color:'#6b7280' },
      ].map(p => `
        <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #f3f4f6">
          <span style="font-size:20px">${p.icon}</span>
          <div style="flex:1">
            <div style="font-size:14px;font-weight:600;color:#1f2937">${p.name}</div>
            <div style="font-size:12px;color:#9ca3af">${p.date}</div>
          </div>
          <span style="font-size:12px;font-weight:700;color:${p.color};
            background:${p.color}15;padding:3px 10px;border-radius:999px">${p.tag}</span>
        </div>`).join('')}
    </div>

  </div>`;
  setStuTitle('학업설계', '수강이력 · AI 추천');
}

/* ---- 수강이력 헬퍼 ---- */

// 과목 목록 HTML 생성
function planRenderCourseList() {
  if (StuPlan.courses.length === 0) {
    return `<div style="text-align:center;padding:28px;color:#9ca3af;font-size:14px;
      background:#f9fafb;border-radius:12px;border:1.5px dashed #e5e7eb">
      아직 입력된 과목이 없어요<br>
      <span style="font-size:12px">위 폼에서 수강한 과목을 추가해보세요</span>
    </div>`;
  }

  // 학년도·학기별로 묶어서 표시
  const grouped = {};
  StuPlan.courses.forEach(c => {
    const key = `${c.year} ${c.sem}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(c);
  });

  const gradeColor = { 'A+':'#059669','A':'#059669','B+':'#4f46e5','B':'#4f46e5',
                       'C+':'#d97706','C':'#d97706','D':'#dc2626','F':'#dc2626' };
  const typeColor  = { '전공필수':'#6366f1','전공선택':'#8b5cf6','교양필수':'#0891b2','교양선택':'#0891b2' };

  return Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0])).map(([key, list]) => `
    <div style="margin-bottom:16px">
      <div style="font-size:12px;font-weight:800;color:#6b7280;margin-bottom:8px;
        display:flex;align-items:center;gap:6px">
        <span style="background:#f3f4f6;padding:3px 10px;border-radius:6px">📅 ${esc(key)}</span>
        <span style="color:#9ca3af">${list.length}과목 ·
          ${list.reduce((s, c) => s + Number(c.credit), 0)}학점</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${list.map(c => `
          <div style="background:#fff;border:1.5px solid #e5e7eb;border-radius:12px;
            padding:12px 16px;display:flex;align-items:center;gap:12px;
            box-shadow:0 1px 4px rgba(0,0,0,.04)">
            <div style="flex:1;min-width:0">
              <div style="font-size:14px;font-weight:700;color:#1f2937;margin-bottom:4px">
                ${esc(c.name)}
              </div>
              <div style="display:flex;gap:6px;flex-wrap:wrap">
                <span style="font-size:11px;font-weight:700;background:${typeColor[c.type]||'#6366f1'}18;
                  color:${typeColor[c.type]||'#6366f1'};padding:2px 8px;border-radius:6px">
                  ${esc(c.type)}</span>
                <span style="font-size:11px;color:#9ca3af">${c.credit}학점</span>
              </div>
            </div>
            <!-- 성적 뱃지 -->
            <div style="width:38px;height:38px;border-radius:50%;
              background:${gradeColor[c.grade]||'#6b7280'}18;
              border:2px solid ${gradeColor[c.grade]||'#6b7280'};
              display:flex;align-items:center;justify-content:center;
              font-size:13px;font-weight:900;color:${gradeColor[c.grade]||'#6b7280'};
              flex-shrink:0">
              ${esc(c.grade)}
            </div>
            <!-- 삭제 버튼 -->
            <button onclick="planDeleteCourse(${c.id})"
              style="background:#fff0f0;color:#dc2626;border:none;border-radius:8px;
                padding:6px 10px;font-size:12px;font-weight:700;cursor:pointer;flex-shrink:0">
              🗑️
            </button>
          </div>`).join('')}
      </div>
    </div>`).join('');
}

// 이수 현황 요약 바 (입력 데이터 기반 동적 계산)
function planRenderSummaryBars() {
  const typeCreditMap = { '전공필수': 0, '전공선택': 0, '교양필수': 0, '교양선택': 0 };
  const typeTotalMap  = { '전공필수': 36, '전공선택': 30, '교양필수': 9, '교양선택': 12 };
  const typeClsMap    = { '전공필수': 'fill-indigo', '전공선택': 'fill-purple',
                          '교양필수': 'fill-blue', '교양선택': 'fill-green' };

  // F 학점 제외하고 취득 학점 합산
  StuPlan.courses.forEach(c => {
    if (c.grade !== 'F' && typeCreditMap[c.type] !== undefined) {
      typeCreditMap[c.type] += Number(c.credit);
    }
  });

  const totalDone  = Object.values(typeCreditMap).reduce((a, b) => a + b, 0);
  const totalNeed  = Object.values(typeTotalMap).reduce((a, b) => a + b, 0);
  const totalPct   = Math.min(100, Math.round((totalDone / totalNeed) * 100));

  return `
    <!-- 전체 진행도 -->
    <div style="text-align:center;margin-bottom:18px">
      <div style="font-size:28px;font-weight:900;color:#4f46e5">${totalDone}학점</div>
      <div style="font-size:13px;color:#9ca3af">취득 완료 (졸업 필요 ${totalNeed}학점 기준 ${totalPct}%)</div>
      <div class="progress-bar" style="margin-top:8px;height:10px;border-radius:99px">
        <div class="progress-fill fill-indigo" style="width:${totalPct}%;height:10px;border-radius:99px"></div>
      </div>
    </div>
    <!-- 구분별 -->
    ${Object.entries(typeCreditMap).map(([type, done]) => {
      const total = typeTotalMap[type];
      const pct   = Math.min(100, Math.round((done / total) * 100));
      const cls   = typeClsMap[type];
      return `
        <div style="margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px">
            <span style="font-weight:700;color:#374151">${type}</span>
            <span style="color:#6b7280">${done}/${total}학점 ·
              <strong style="color:#1f2937">${pct}%</strong></span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill ${cls}" style="width:${pct}%"></div>
          </div>
        </div>`;
    }).join('')}`;
}

// 과목 추가
function planAddCourse() {
  const name   = document.getElementById('plan-name')?.value.trim();
  const year   = document.getElementById('plan-year')?.value;
  const sem    = document.getElementById('plan-sem')?.value;
  const credit = document.getElementById('plan-credit')?.value;
  const grade  = document.getElementById('plan-grade')?.value;
  const type   = document.getElementById('plan-type')?.value;

  if (!name) {
    showToast('과목명을 입력해주세요.', 'error');
    document.getElementById('plan-name').focus();
    return;
  }

  StuPlan.courses.push({ id: StuPlan.nextId++, year, sem, name, credit: Number(credit), grade, type });
  StuPlan.aiShown = false; // 새 과목 추가 시 AI 추천 초기화

  // 입력창 초기화
  document.getElementById('plan-name').value = '';

  // 목록·요약·배지 갱신 (화면 전체 재렌더 없이 부분 갱신)
  const listEl    = document.getElementById('plan-course-list');
  const summaryEl = document.getElementById('plan-summary-bar');
  const badgeEl   = document.getElementById('plan-count-badge');
  const aiEl      = document.getElementById('plan-ai-result');

  if (listEl)    listEl.innerHTML    = planRenderCourseList();
  if (summaryEl) summaryEl.innerHTML = planRenderSummaryBars();
  if (badgeEl)   badgeEl.textContent = `${StuPlan.courses.length}과목`;
  if (aiEl)      { aiEl.style.display = 'none'; }

  showToast(`"${name}" 과목이 추가되었습니다.`, 'success');
}

// 과목 삭제
function planDeleteCourse(id) {
  const idx = StuPlan.courses.findIndex(c => c.id === id);
  if (idx < 0) return;
  const name = StuPlan.courses[idx].name;
  StuPlan.courses.splice(idx, 1);
  StuPlan.aiShown = false;

  const listEl    = document.getElementById('plan-course-list');
  const summaryEl = document.getElementById('plan-summary-bar');
  const badgeEl   = document.getElementById('plan-count-badge');
  const aiEl      = document.getElementById('plan-ai-result');

  if (listEl)    listEl.innerHTML    = planRenderCourseList();
  if (summaryEl) summaryEl.innerHTML = planRenderSummaryBars();
  if (badgeEl)   badgeEl.textContent = `${StuPlan.courses.length}과목`;
  if (aiEl)      aiEl.style.display  = 'none';

  showToast(`"${name}" 과목이 삭제되었습니다.`, 'info');
}

// 전체 삭제
function planClearAll() {
  if (!confirm('입력된 수강이력을 모두 삭제할까요?')) return;
  StuPlan.courses = [];
  StuPlan.nextId  = 1;
  StuPlan.aiShown = false;
  renderStudentPlan();
}

// AI 추천받기
function planAiRecommend() {
  if (StuPlan.courses.length === 0) {
    showToast('먼저 수강이력을 1개 이상 입력해주세요.', 'error');
    return;
  }

  const aiEl = document.getElementById('plan-ai-result');
  if (!aiEl) return;

  // 로딩 표시
  aiEl.style.display = 'block';
  aiEl.innerHTML = `
    <div style="background:linear-gradient(135deg,#f5f3ff,#ede9fe);border-radius:16px;
      padding:28px;text-align:center;margin-bottom:24px;border:1.5px solid #c4b5fd">
      <div style="font-size:32px;margin-bottom:10px">🤖</div>
      <div style="font-size:15px;font-weight:800;color:#4f46e5;margin-bottom:6px">
        AI가 분석하고 있어요...
      </div>
      <div style="font-size:13px;color:#9ca3af;margin-bottom:14px">
        수강이력 ${StuPlan.courses.length}과목을 기반으로 다음 학기를 설계 중이에요
      </div>
      <div style="display:flex;justify-content:center;gap:4px">
        ${[0,150,300].map(d =>
          `<div style="width:8px;height:8px;background:#c4b5fd;border-radius:50%;
            animation:bounce .8s ease-in-out ${d}ms infinite alternate"></div>`
        ).join('')}
      </div>
    </div>`;
  aiEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // 2초 후 결과 표시
  setTimeout(() => {
    StuPlan.aiShown = true;
    aiEl.innerHTML  = planRenderAiResult();
  }, 2000);
}

// AI 추천 결과 HTML (수강이력 기반으로 이미 들은 과목 제외)
function planRenderAiResult() {
  const taken = StuPlan.courses.map(c => c.name);

  // 전체 후보 과목 풀
  const allCandidates = [
    { name:'머신러닝 기초',        credit:3, type:'전공선택', why:'데이터 분석가 핵심 직무 역량',      level:'강력 추천' },
    { name:'데이터베이스 설계',     credit:3, type:'전공필수', why:'SQLD 자격증 연계 · SQL 기반 강화',  level:'강력 추천' },
    { name:'통계학 개론',           credit:3, type:'교양필수', why:'데이터 분석 필수 수학 기초',        level:'추천' },
    { name:'캡스톤 디자인',         credit:3, type:'전공선택', why:'실무 프로젝트 포트폴리오 제작',     level:'추천' },
    { name:'빅데이터 분석',         credit:3, type:'전공선택', why:'ADsP 자격증 준비 연계',            level:'추천' },
    { name:'딥러닝 기초',           credit:3, type:'전공선택', why:'AI·머신러닝 심화 학습',            level:'권장' },
    { name:'소프트웨어 공학',       credit:3, type:'전공필수', why:'졸업 필수 · 개발 방법론 학습',     level:'권장' },
    { name:'컴퓨터 네트워크',       credit:3, type:'전공선택', why:'IT 직군 기초 지식',                level:'권장' },
  ];

  // 이미 들은 과목 제외 (과목명 포함 여부로 판단)
  const recs = allCandidates.filter(c =>
    !taken.some(t => t.includes(c.name) || c.name.includes(t))
  ).slice(0, 5);

  // 취득 학점 부족 구분 체크
  const typeCreditMap = { '전공필수': 0, '전공선택': 0, '교양필수': 0, '교양선택': 0 };
  StuPlan.courses.forEach(c => {
    if (c.grade !== 'F' && typeCreditMap[c.type] !== undefined)
      typeCreditMap[c.type] += Number(c.credit);
  });
  const weakTypes = Object.entries({ '전공필수': 36, '전공선택': 30, '교양필수': 9 })
    .filter(([t, need]) => typeCreditMap[t] < need * 0.5)
    .map(([t]) => t);

  const levelColor = {
    '강력 추천': { color:'#059669', bg:'#f0fdf4', border:'#bbf7d0' },
    '추천':      { color:'#4f46e5', bg:'#eef2ff', border:'#c7d2fe' },
    '권장':      { color:'#6b7280', bg:'#f9fafb', border:'#e5e7eb' },
  };

  return `
    <div style="background:linear-gradient(135deg,#f5f3ff,#ede9fe);border-radius:16px;
      padding:20px;margin-bottom:24px;border:1.5px solid #c4b5fd">

      <!-- 헤더 -->
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
        <div style="font-size:28px">🤖</div>
        <div>
          <div style="font-size:15px;font-weight:900;color:#4f46e5">AI 추천 완료!</div>
          <div style="font-size:12px;color:#7c3aed">수강이력 ${StuPlan.courses.length}과목 분석 기반</div>
        </div>
      </div>

      ${weakTypes.length > 0 ? `
        <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:10px;
          padding:10px 14px;margin-bottom:14px;font-size:13px;color:#92400e">
          ⚠️ <strong>${weakTypes.join(', ')}</strong> 학점이 부족해요. 우선 이수를 추천드려요!
        </div>` : ''}

      <!-- 추천 과목 목록 -->
      <div style="display:flex;flex-direction:column;gap:10px">
        ${recs.length === 0
          ? `<div style="text-align:center;padding:20px;color:#7c3aed;font-size:14px">
               🎉 이미 다양한 과목을 수강했네요! 심화 과목을 탐색해보세요.
             </div>`
          : recs.map((c, i) => {
              const s = levelColor[c.level] || levelColor['권장'];
              return `
                <div class="stu-animate" style="background:${s.bg};border:1.5px solid ${s.border};
                  border-radius:12px;padding:14px 16px;display:flex;align-items:center;gap:12px">
                  <div style="font-size:13px;font-weight:800;color:#9ca3af;width:20px;
                    flex-shrink:0;text-align:center">${i+1}</div>
                  <div style="flex:1;min-width:0">
                    <div style="font-size:14px;font-weight:800;color:#1f2937;margin-bottom:4px">
                      ${esc(c.name)}
                      <span style="font-size:12px;color:#9ca3af;font-weight:400;margin-left:4px">${c.credit}학점</span>
                    </div>
                    <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
                      <span style="font-size:11px;color:#9ca3af">${esc(c.type)}</span>
                      <span style="font-size:11px;color:#6b7280">·</span>
                      <span style="font-size:12px;color:#374151">${esc(c.why)}</span>
                    </div>
                  </div>
                  <span style="font-size:11px;font-weight:800;color:${s.color};
                    background:${s.color}18;padding:3px 10px;border-radius:999px;
                    white-space:nowrap;flex-shrink:0">${c.level}</span>
                </div>`;
            }).join('')}
      </div>

      <!-- 총 추천 학점 -->
      <div style="margin-top:14px;padding:12px 14px;background:rgba(79,70,229,.08);
        border-radius:10px;font-size:13px;color:#4f46e5;text-align:center;font-weight:700">
        📊 추천 총 학점: ${recs.reduce((s, c) => s + c.credit, 0)}학점
        · 상담사 선생님과 최종 확인 후 수강 신청하세요
      </div>
    </div>`;
}

/* ==========================================================
   5. 포트폴리오 (성장 스토리)
   ========================================================== */
function renderStudentPortfolio() {
  const port = (PORTFOLIOS['stu-001'] || [])[0];

  document.getElementById('app-content').innerHTML = `
  <div class="stu-portfolio-wrap">
    ${stuBack('stu-home')}

    ${!port ? `
      <div class="stu-ai-box stu-animate" style="text-align:center;padding:40px">
        <div style="font-size:48px;margin-bottom:12px">✨</div>
        <div style="font-size:16px;font-weight:800;color:#1f2937;margin-bottom:6px">포트폴리오를 시작해볼까요?</div>
        <div style="font-size:14px;color:#6b7280">상담사 선생님과 함께 나만의 성장 스토리를 만들어가요</div>
      </div>` : `

      <!-- 진행 단계 -->
      <div class="stu-animate" style="background:linear-gradient(135deg,#4f46e5,#7c3aed);
        border-radius:var(--radius-xl);padding:24px 20px;color:#fff;margin-bottom:20px;text-align:center">
        <div style="font-size:13px;opacity:.75;margin-bottom:6px">현재 진로 단계</div>
        <div style="font-size:24px;font-weight:900;margin-bottom:8px">
          ${port.currentStage === '진로탐색' ? '🔍 진로 탐색 중' :
            port.currentStage === '진로설정' ? '🎯 진로 설정 완료' :
            port.currentStage === '취업준비' ? '💼 취업 준비 중' : '🎓 진학 준비 중'}
        </div>
        <div style="font-size:13px;opacity:.8">${port.year}학년도 ${port.semester}학기 · v${port.version}</div>
        ${port.isFinal
          ? `<div style="margin-top:10px;background:rgba(255,255,255,.2);border-radius:999px;
              display:inline-block;padding:5px 16px;font-size:13px;font-weight:700">✅ 최종 확정</div>`
          : `<div style="margin-top:10px;background:rgba(255,255,255,.15);border-radius:999px;
              display:inline-block;padding:5px 16px;font-size:13px;font-weight:700">🔄 작성 중</div>`}
      </div>

      <!-- 로드맵 3단계 -->
      <div class="stu-section-title stu-animate stu-animate-delay-1">🗺️ 나의 진로 로드맵</div>
      ${[
        { term:'단기',  data: port.shortTermRoadmap, color:'#4f46e5', bg:'#eef2ff', emoji:'⚡' },
        { term:'중기',  data: port.midTermRoadmap,   color:'#0891b2', bg:'#ecfeff', emoji:'🚀' },
        { term:'장기',  data: port.longTermRoadmap,  color:'#059669', bg:'#f0fdf4', emoji:'🏆' },
      ].map((r, i) => `
        <div class="stu-growth-card stu-animate stu-animate-delay-${i + 1}"
          style="background:${r.bg};border-left-color:${r.color}">
          <div class="stu-growth-stage" style="color:${r.color}">${r.emoji} ${r.term} 목표</div>
          <div class="stu-growth-title">${esc(r.data.goal)}</div>
          <div class="stu-growth-body">
            <span style="color:${r.color};font-weight:700">📅 ${esc(r.data.schedule)}</span><br>
            ${esc(r.data.coreActivities)}
          </div>
        </div>`).join('')}

      <!-- 실행 계획 -->
      <div class="stu-section-title stu-animate">✅ 실행 계획</div>
      <div class="stu-checklist stu-animate">
        ${port.actionPlans.map(a => `
          <div class="stu-check-item ${a.isCompleted ? 'done' : ''}"
            onclick="this.classList.toggle('done');this.querySelector('.stu-check-circle').innerHTML=this.classList.contains('done')?'✓':''">
            <div class="stu-check-circle">${a.isCompleted ? '✓' : ''}</div>
            <div style="flex:1">
              <div class="stu-check-label">${esc(a.activityName)}</div>
              <div style="font-size:12px;color:#9ca3af;margin-top:2px">${esc(a.goal)} · ${esc(a.schedule)}</div>
            </div>
            <span style="font-size:12px;font-weight:700;color:#9ca3af;
              background:#f3f4f6;padding:2px 8px;border-radius:999px">${esc(a.category)}</span>
          </div>`).join('')}
      </div>

      <!-- 상담사 한마디 -->
      ${port.counselorOpinion ? `
        <div class="stu-ai-box stu-animate"
          style="background:linear-gradient(135deg,#f0fdf4,#ecfdf5);border:1.5px solid #bbf7d0;margin-top:16px">
          <div class="stu-ai-box-label" style="color:#059669">💬 상담 선생님의 한마디</div>
          <div class="stu-ai-text">${esc(port.counselorOpinion)}</div>
        </div>` : ''}
    `}
  </div>`;
  setStuTitle('포트폴리오', '나의 성장 스토리');
}

/* ==========================================================
   6. 취업준비 (수정 모드 포함)
   ========================================================== */
let stuJobEditMode = false;

function renderStudentJob() {
  stuJobEditMode = false;
  const emp  = EMPLOYMENT_STATUS['stu-001'];
  const pct  = emp ? 35 : 0;
  const circ = 2 * Math.PI * 54;
  const offset = circ - (pct / 100) * circ;

  document.getElementById('app-content').innerHTML = `
  <div class="stu-job-wrap">
    ${stuBack('stu-home')}

    <!-- 준비도 링 -->
    <div class="stu-readiness-ring-wrap stu-animate">
      <div class="stu-readiness-ring-label">취업 준비도</div>
      <div class="stu-ring-container">
        <svg class="stu-ring-svg" width="140" height="140" viewBox="0 0 140 140">
          <circle class="stu-ring-bg" cx="70" cy="70" r="54"/>
          <circle class="stu-ring-fg" cx="70" cy="70" r="54"
            stroke-dasharray="${circ}"
            stroke-dashoffset="${offset}"/>
        </svg>
        <div class="stu-ring-text">
          <span class="stu-ring-pct">${pct}</span>
          <span class="stu-ring-unit">%</span>
        </div>
      </div>
      <div style="font-size:15px;font-weight:700;opacity:.9;margin-bottom:4px">
        ${emp ? emp.prepLevel : '아직 시작 전이에요'}
      </div>
      <div style="font-size:13px;opacity:.65">
        ${emp ? `${emp.desiredTiming}까지 ${emp.desiredJobs.join(', ')} 목표` : ''}
      </div>
    </div>

    <!-- 희망 직무 섹션 + 수정 버튼 -->
    ${emp ? `
      <div style="display:flex;align-items:center;justify-content:space-between;margin:16px 0 10px">
        <div class="stu-section-title" style="margin:0">🎯 희망 직무 & 조건</div>
        <button id="job-edit-btn" onclick="toggleJobEditMode()"
          style="background:#fef3c7;color:#d97706;border:none;border-radius:999px;
            padding:6px 16px;font-size:13px;font-weight:700;cursor:pointer">
          ✏️ 수정하기
        </button>
      </div>

      <!-- 조회 모드 -->
      <div id="job-view-mode" style="background:#fff;border-radius:var(--radius-lg);padding:20px;
        box-shadow:0 2px 12px rgba(0,0,0,.07);margin-bottom:16px" class="stu-animate stu-animate-delay-1">
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px">
          ${emp.desiredJobs.map(j =>
            `<span style="background:linear-gradient(135deg,#eef2ff,#f5f3ff);color:#4f46e5;
              padding:7px 14px;border-radius:999px;font-size:13px;font-weight:700;
              border:1.5px solid #c7d2fe">${esc(j)}</span>`
          ).join('')}
        </div>
        ${[
          ['📅 목표 시기', emp.desiredTiming],
          ['📍 희망 지역', emp.desiredLocation],
          ['🏢 희망 업종', emp.desiredIndustry],
          ['💰 희망 연봉', emp.desiredSalary],
        ].map(([k, v]) => `
          <div style="display:flex;gap:12px;padding:8px 0;border-top:1px solid #f3f4f6;font-size:14px">
            <span style="color:#9ca3af;width:100px;flex-shrink:0">${k}</span>
            <span style="font-weight:600;color:#1f2937">${esc(v)}</span>
          </div>`).join('')}
      </div>

      <!-- 수정 모드 (초기 숨김) -->
      <div id="job-edit-mode" style="display:none;background:#fff;border:1.5px solid #fde68a;
        border-radius:var(--radius-lg);padding:20px;margin-bottom:16px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
          <div>
            <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:4px">희망 직무</label>
            <input id="edit-job1" type="text" value="${esc(emp.desiredJobs[0]||'')}"
              style="width:100%;border:1.5px solid #fde68a;border-radius:8px;padding:8px 10px;font-size:13px">
          </div>
          <div>
            <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:4px">희망 직무 2</label>
            <input id="edit-job2" type="text" value="${esc(emp.desiredJobs[1]||'')}"
              style="width:100%;border:1.5px solid #fde68a;border-radius:8px;padding:8px 10px;font-size:13px">
          </div>
          <div>
            <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:4px">목표 시기</label>
            <input id="edit-timing" type="text" value="${esc(emp.desiredTiming)}"
              style="width:100%;border:1.5px solid #fde68a;border-radius:8px;padding:8px 10px;font-size:13px">
          </div>
          <div>
            <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:4px">희망 지역</label>
            <select id="edit-location"
              style="width:100%;border:1.5px solid #fde68a;border-radius:8px;padding:8px 10px;font-size:13px">
              ${['수도권','서울','경기/인천','지방','무관'].map(l =>
                `<option ${emp.desiredLocation===l?'selected':''}>${l}</option>`).join('')}
            </select>
          </div>
        </div>
        <div style="margin-bottom:12px">
          <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:4px">희망 자격증</label>
          <input id="edit-cert1" type="text" value="${esc(emp.cert1)}"
            style="width:100%;border:1.5px solid #fde68a;border-radius:8px;padding:8px 10px;font-size:13px">
        </div>
        <div style="display:flex;gap:8px">
          <button onclick="saveJobEdit()"
            style="flex:1;background:linear-gradient(135deg,#d97706,#f59e0b);color:#fff;border:none;
              border-radius:10px;padding:12px;font-size:14px;font-weight:800;cursor:pointer">
            💾 저장하기
          </button>
          <button onclick="toggleJobEditMode()"
            style="flex:1;background:#f3f4f6;color:#6b7280;border:none;
              border-radius:10px;padding:12px;font-size:14px;font-weight:700;cursor:pointer">
            취소
          </button>
        </div>
      </div>

      <!-- 자격증·스킬 -->
      <div class="stu-section-title stu-animate stu-animate-delay-2">🏅 자격증 & 스킬</div>
      <div style="background:#fff;border-radius:var(--radius-lg);padding:20px;
        box-shadow:0 2px 12px rgba(0,0,0,.07);margin-bottom:16px" class="stu-animate stu-animate-delay-2">
        ${[
          ['자격증 1', emp.cert1],
          ['자격증 2', emp.cert2],
          ['IT 스킬',  emp.itSkill],
        ].filter(([,v]) => v).map(([k, v]) => `
          <div style="display:flex;gap:12px;padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:14px">
            <span style="color:#9ca3af;width:80px;flex-shrink:0">${k}</span>
            <span style="font-weight:600;color:#1f2937">${esc(v)}</span>
          </div>`).join('')}
      </div>` : ''}

    <!-- 준비 체크리스트 -->
    <div class="stu-section-title stu-animate stu-animate-delay-3">📋 취업 준비 체크리스트</div>
    <div class="stu-checklist stu-animate stu-animate-delay-3">
      ${[
        { label:'이력서 작성 완료',     done: emp?.resumeReady   || false, icon:'📄' },
        { label:'자기소개서 작성',      done: emp?.introReady    || false, icon:'✍️' },
        { label:'면접 준비 (모의 면접)', done: emp?.interviewReady|| false, icon:'🎤' },
        { label:'ADsP 자격증 취득',     done: false,                       icon:'🏅' },
        { label:'GitHub 포트폴리오',    done: false,                       icon:'💻' },
        { label:'인턴십 경험',          done: false,                       icon:'🏢' },
      ].map(item => `
        <div class="stu-check-item ${item.done ? 'done' : ''}"
          onclick="this.classList.toggle('done');this.querySelector('.stu-check-circle').innerHTML=this.classList.contains('done')?'✓':''">
          <div class="stu-check-circle">${item.done ? '✓' : ''}</div>
          <span style="font-size:18px;width:24px;text-align:center">${item.icon}</span>
          <span class="stu-check-label">${item.label}</span>
        </div>`).join('')}
    </div>

    <!-- AI 조언 -->
    <div class="stu-ai-box stu-animate"
      style="background:linear-gradient(135deg,#fdf4ff,#fce7f3);border:1.5px solid #f9a8d4;margin-top:16px">
      <div class="stu-ai-box-label" style="color:#be185d">🤖 AI의 취업 준비 조언</div>
      <div class="stu-ai-text">
        지금 단계에서 가장 중요한 건 <strong>ADsP 자격증</strong>이에요!<br>
        2026년 5월 시험에 등록하고, 이력서도 조금씩 써보기 시작하면 딱 좋은 타이밍이에요 📝<br>
        작은 것 하나씩 해나가다 보면 어느새 준비가 다 되어 있을 거예요 💪
      </div>
    </div>

  </div>`;
  setStuTitle('취업준비', '나의 취업 준비 현황');
}

function toggleJobEditMode() {
  stuJobEditMode = !stuJobEditMode;
  document.getElementById('job-view-mode').style.display = stuJobEditMode ? 'none' : 'block';
  document.getElementById('job-edit-mode').style.display = stuJobEditMode ? 'block' : 'none';
  const btn = document.getElementById('job-edit-btn');
  if (btn) btn.textContent = stuJobEditMode ? '✕ 닫기' : '✏️ 수정하기';
}

function saveJobEdit() {
  const emp = EMPLOYMENT_STATUS['stu-001'];
  if (emp) {
    const j1 = document.getElementById('edit-job1')?.value.trim();
    const j2 = document.getElementById('edit-job2')?.value.trim();
    emp.desiredJobs    = [j1, j2].filter(Boolean);
    emp.desiredTiming  = document.getElementById('edit-timing')?.value || emp.desiredTiming;
    emp.desiredLocation= document.getElementById('edit-location')?.value || emp.desiredLocation;
    emp.cert1          = document.getElementById('edit-cert1')?.value || emp.cert1;
  }
  showToast('취업 준비 정보가 저장되었습니다.', 'success');
  renderStudentJob();
}

/* ==========================================================
   7. AI 챗봇 대화 화면
   ========================================================== */
const StuChat = {
  messages: [
    {
      role: 'ai',
      text: '안녕하세요! 저는 M-Cap AI 진로 상담사예요 🤖\n\n진로·취업·수강신청 등 궁금한 건 뭐든 물어보세요.\n대화 내용은 포트폴리오에 자동으로 반영돼요 ✨',
      time: '방금',
    },
  ],
  thinking: false,
};

const CHAT_QUICK = [
  '내 진로 방향 어때요?',
  'ADsP 어떻게 준비해요?',
  '다음 학기 수강 추천해줘',
  '자기소개서 어떻게 써요?',
  'AI 취업 시장 전망은?',
];

// AI 응답 시뮬레이션 풀
const AI_RESPONSES = {
  '내 진로 방향 어때요?': `진단검사 결과와 희망 직무를 분석했을 때, **데이터 분석가** 방향이 아주 잘 맞아요! 🎯\n\n- 직업선호도검사 1순위: 컴퓨터공학 관련직\n- MBTI(ISTJ): 꼼꼼하고 데이터 기반 판단에 강점\n- 현재 AI소프트웨어학과 전공도 딱 맞아요\n\n지금 방향 그대로 쭉 가세요 💪`,
  '다음 학기 수강 추천해줘': `희망 직무(데이터 분석가)와 현재 이수 현황을 기반으로 추천드려요!\n\n1️⃣ **머신러닝 기초** (강력 추천)\n   → 데이터 분석가 핵심 역량\n2️⃣ **데이터베이스 설계** (추천)\n   → SQLD 자격증 연계\n3️⃣ **통계학 개론** (추천)\n   → 데이터 분석 필수 지식\n\n총 9학점 조합이면 취업 준비에 딱 좋아요!`,
  default: `좋은 질문이에요! 😊\n\n현재 입력된 정보를 바탕으로 답변드릴게요.\n\n진로 방향(데이터 분석가)과 현재 학업 현황을 종합했을 때, 지금 단계에서 가장 중요한 건 **실무 경험 축적**이에요. 학교 프로젝트나 공모전 참여를 적극 추천드려요 🚀\n\n더 구체적인 내용이 궁금하시면 상담사 선생님과 연결해드릴 수 있어요!`,
};

function renderStudentChat() {
  document.getElementById('app-content').innerHTML = `
  <div style="display:flex;flex-direction:column;height:calc(100vh - 64px);max-width:720px;margin:0 auto">

    <!-- 헤더 -->
    <div style="padding:16px 20px;border-bottom:1px solid #e5e7eb;background:#fff;
      display:flex;align-items:center;gap:12px;flex-shrink:0">
      <button onclick="navigate('stu-home')"
        style="background:none;border:none;cursor:pointer;font-size:20px;color:#6b7280;padding:4px">←</button>
      <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#4f46e5,#7c3aed);
        display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">🤖</div>
      <div>
        <div style="font-size:15px;font-weight:800;color:#1f2937">AI 진로 상담사</div>
        <div style="display:flex;align-items:center;gap:4px;font-size:12px;color:#059669">
          <div style="width:7px;height:7px;background:#059669;border-radius:50%"></div>
          온라인 · 포트폴리오 자동 연동
        </div>
      </div>
    </div>

    <!-- 포트폴리오 연동 안내 배너 -->
    <div style="background:linear-gradient(135deg,#eff6ff,#f0fdf4);border-bottom:1px solid #e5e7eb;
      padding:10px 20px;display:flex;align-items:center;gap:8px;font-size:12px;color:#374151;flex-shrink:0">
      <span>✨</span>
      <span>대화 내용은 <strong>포트폴리오에 자동 반영</strong>돼요. 자유롭게 물어보세요!</span>
    </div>

    <!-- 메시지 영역 -->
    <div id="chat-messages"
      style="flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:14px;
        background:#f9fafb">
      ${StuChat.messages.map(m => renderChatMsg(m)).join('')}
    </div>

    <!-- 빠른 질문 -->
    <div id="chat-quick" style="padding:10px 16px;background:#fff;border-top:1px solid #f3f4f6;
      overflow-x:auto;white-space:nowrap;flex-shrink:0">
      ${CHAT_QUICK.map(q => `
        <button onclick="sendChatMsg('${q}')"
          style="display:inline-block;margin-right:8px;padding:7px 14px;
            background:#eef2ff;color:#4f46e5;border:1px solid #c7d2fe;border-radius:999px;
            font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;
            transition:all .15s"
          onmouseover="this.style.background='#c7d2fe'"
          onmouseout="this.style.background='#eef2ff'">
          ${esc(q)}
        </button>`).join('')}
    </div>

    <!-- 입력창 -->
    <div style="padding:12px 16px;background:#fff;border-top:1px solid #e5e7eb;
      display:flex;gap:10px;align-items:flex-end;flex-shrink:0">
      <textarea id="chat-input" rows="1" placeholder="메시지를 입력하세요..."
        style="flex:1;border:1.5px solid #e5e7eb;border-radius:14px;padding:10px 14px;
          font-size:14px;resize:none;outline:none;font-family:inherit;line-height:1.5;
          max-height:120px;overflow-y:auto"
        onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendChatMsg()}"
        oninput="this.style.height='auto';this.style.height=Math.min(this.scrollHeight,120)+'px'"></textarea>
      <button onclick="sendChatMsg()"
        style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#4f46e5,#7c3aed);
          color:#fff;border:none;cursor:pointer;font-size:20px;flex-shrink:0;
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 4px 12px rgba(79,70,229,.4)">
        ↑
      </button>
    </div>
  </div>`;

  // 최신 메시지로 스크롤
  scrollChatBottom();
}

function renderChatMsg(m) {
  if (m.role === 'ai') {
    return `
      <div style="display:flex;gap:10px;align-items:flex-start;max-width:85%">
        <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#4f46e5,#7c3aed);
          display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🤖</div>
        <div>
          <div style="background:#fff;border-radius:0 16px 16px 16px;padding:14px 16px;
            font-size:14px;color:#1f2937;line-height:1.8;box-shadow:0 1px 4px rgba(0,0,0,.06);
            white-space:pre-wrap">${m.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>
          <div style="font-size:11px;color:#9ca3af;margin-top:4px;padding-left:4px">${m.time}</div>
        </div>
      </div>`;
  } else {
    return `
      <div style="display:flex;justify-content:flex-end">
        <div style="max-width:75%">
          <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;
            border-radius:16px 0 16px 16px;padding:12px 16px;font-size:14px;line-height:1.6">
            ${esc(m.text)}
          </div>
          <div style="font-size:11px;color:#9ca3af;margin-top:4px;text-align:right;padding-right:4px">${m.time}</div>
        </div>
      </div>`;
  }
}

function sendChatMsg(quickText) {
  const input = document.getElementById('chat-input');
  const text  = quickText || input?.value.trim();
  if (!text || StuChat.thinking) return;

  if (input) { input.value = ''; input.style.height = 'auto'; }

  // 사용자 메시지 추가
  const userMsg = { role: 'user', text, time: '방금' };
  StuChat.messages.push(userMsg);
  appendChatMsg(renderChatMsg(userMsg));
  scrollChatBottom();

  // 빠른 질문 숨기기
  const qEl = document.getElementById('chat-quick');
  if (qEl) qEl.style.display = 'none';

  // AI 타이핑 표시
  StuChat.thinking = true;
  const thinkingId = 'chat-thinking';
  const thinkingHtml = `
    <div id="${thinkingId}" style="display:flex;gap:10px;align-items:center;max-width:85%">
      <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#4f46e5,#7c3aed);
        display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🤖</div>
      <div style="background:#fff;border-radius:0 16px 16px 16px;padding:14px 16px;
        box-shadow:0 1px 4px rgba(0,0,0,.06)">
        <div style="display:flex;gap:4px;align-items:center">
          ${[0,150,300].map(d =>
            `<div style="width:7px;height:7px;background:#c7d2fe;border-radius:50%;
              animation:bounce .8s ease-in-out ${d}ms infinite alternate"></div>`
          ).join('')}
        </div>
      </div>
    </div>`;
  appendChatMsg(thinkingHtml);
  scrollChatBottom();

  // 1.5초 후 AI 응답
  setTimeout(() => {
    const el = document.getElementById(thinkingId);
    if (el) el.remove();

    const aiText = AI_RESPONSES[text] || AI_RESPONSES.default;
    const aiMsg  = { role: 'ai', text: aiText, time: '방금' };
    StuChat.messages.push(aiMsg);
    appendChatMsg(renderChatMsg(aiMsg));
    scrollChatBottom();
    StuChat.thinking = false;

    // 포트폴리오 반영 안내 토스트 (첫 번째 메시지만)
    if (StuChat.messages.filter(m => m.role === 'user').length === 1) {
      setTimeout(() => showToast('대화 내용이 포트폴리오에 반영되었습니다!', 'success'), 500);
    }
  }, 1500);
}

function appendChatMsg(html) {
  const el = document.getElementById('chat-messages');
  if (!el) return;
  const div = document.createElement('div');
  div.className = 'stu-animate';
  div.innerHTML = html;
  el.appendChild(div);
}

function scrollChatBottom() {
  const el = document.getElementById('chat-messages');
  if (el) setTimeout(() => { el.scrollTop = el.scrollHeight; }, 50);
}
