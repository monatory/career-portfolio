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
  document.getElementById('app-content').innerHTML = `
  <div style="max-width:520px;margin:0 auto;padding:32px 20px">

    <!-- 상단 인사 -->
    <div style="text-align:center;margin-bottom:32px" class="stu-animate">
      <div style="font-size:50px;margin-bottom:12px">👋</div>
      <div style="font-size:22px;font-weight:900;color:#1f2937;margin-bottom:8px">
        처음 오셨군요, 반가워요!
      </div>
      <div style="font-size:14px;color:#6b7280;line-height:1.7">
        정보를 입력하면 AI가 나만의<br>진로 포트폴리오를 만들어드려요 ✨
      </div>
    </div>

    <!-- 방식 선택 카드 2개 -->
    <div style="display:flex;flex-direction:column;gap:14px">

      <!-- 카드 1: AI 대화형 -->
      <div onclick="onbStartChat()"
        class="stu-animate"
        style="background:linear-gradient(135deg,#4f46e5,#7c3aed);border-radius:22px;
          padding:24px 22px;cursor:pointer;position:relative;overflow:hidden;
          box-shadow:0 6px 28px rgba(79,70,229,.38);transition:transform .15s"
        onmouseover="this.style.transform='scale(1.02)'"
        onmouseout="this.style.transform='scale(1)'">
        <div style="position:absolute;top:-24px;right:-24px;width:110px;height:110px;
          border-radius:50%;background:rgba(255,255,255,.07)"></div>
        <div style="position:absolute;bottom:-28px;right:32px;width:74px;height:74px;
          border-radius:50%;background:rgba(255,255,255,.05)"></div>

        <div style="display:inline-block;background:rgba(255,255,255,.2);color:#fff;
          border:1px solid rgba(255,255,255,.3);border-radius:999px;
          padding:4px 14px;font-size:11px;font-weight:800;margin-bottom:14px">
          ⭐ 처음 오신 분 추천
        </div>
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:12px">
          <span style="font-size:42px">💬</span>
          <div>
            <div style="font-size:18px;font-weight:900;color:#fff;margin-bottom:3px">AI와 대화로 입력하기</div>
            <div style="font-size:13px;color:rgba(255,255,255,.72)">처음이세요? AI가 하나씩 물어봐드려요</div>
          </div>
        </div>
        <div style="background:rgba(255,255,255,.14);border-radius:12px;padding:12px 16px;
          font-size:13px;color:rgba(255,255,255,.82);line-height:1.7;margin-bottom:12px">
          🤖 "안녕하세요! 먼저 학과와 학년을 알려주세요~"<br>
          → 부담 없이 대화하듯 입력할 수 있어요
        </div>
        <div style="text-align:right;color:rgba(255,255,255,.65);font-size:13px;font-weight:700">
          시작하기 →
        </div>
      </div>

      <!-- 카드 2: 직접 입력 -->
      <div onclick="renderOnbDirect(1)"
        class="stu-animate stu-animate-delay-1"
        style="background:#fff;border:2px solid #e9d5ff;border-radius:22px;
          padding:24px 22px;cursor:pointer;position:relative;overflow:hidden;
          box-shadow:0 4px 18px rgba(124,58,237,.12);transition:all .15s"
        onmouseover="this.style.borderColor='#a855f7';this.style.transform='scale(1.02)'"
        onmouseout="this.style.borderColor='#e9d5ff';this.style.transform='scale(1)'">
        <div style="position:absolute;top:-18px;right:-18px;width:88px;height:88px;
          border-radius:50%;background:#fdf4ff"></div>

        <div style="display:inline-block;background:#fdf4ff;color:#7c3aed;
          border:1.5px solid #e9d5ff;border-radius:999px;
          padding:4px 14px;font-size:11px;font-weight:800;margin-bottom:14px">
          📋 재학생·복학생 추천
        </div>
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:12px">
          <span style="font-size:42px">📝</span>
          <div>
            <div style="font-size:18px;font-weight:900;color:#1f2937;margin-bottom:3px">직접 입력하기</div>
            <div style="font-size:13px;color:#6b7280">이미 알고 있다면 빠르게 입력해요</div>
          </div>
        </div>
        <div style="background:#faf5ff;border-radius:12px;padding:12px 16px;
          font-size:13px;color:#6b7280;line-height:1.7;
          border:1px solid #f3e8ff;margin-bottom:12px">
          📌 3단계 폼으로 빠르게 완성<br>
          → 기본정보 · 심리건강 · 진단검사 순으로 입력해요
        </div>
        <div style="text-align:right;color:#7c3aed;font-size:13px;font-weight:700">
          바로 입력 →
        </div>
      </div>

    </div>
  </div>`;
}

/* ── AI 대화형 입력 시작 (기존 5단계 흐름) ── */
function onbStartChat() {
  ONB.step = 0;
  ONB.data = {};

  document.getElementById('app-content').innerHTML = `
  <div style="max-width:600px;margin:0 auto;padding:24px 20px">

    <button onclick="renderStudentOnboarding()"
      style="background:none;border:none;cursor:pointer;color:#9ca3af;font-size:13px;
        margin-bottom:16px;display:flex;align-items:center;gap:4px;padding:4px 0">
      ← 입력 방식 다시 선택
    </button>

    <div style="text-align:center;margin-bottom:24px" class="stu-animate">
      <div style="font-size:40px;margin-bottom:8px">🤖</div>
      <div style="font-size:20px;font-weight:900;color:#1f2937;margin-bottom:5px">AI와 대화로 입력해요</div>
      <div style="font-size:13px;color:#6b7280;line-height:1.6">
        질문에 답하다 보면 자연스럽게 완성돼요 😊
      </div>
      <div style="display:flex;justify-content:center;gap:8px;margin-top:18px" id="onb-steps">
        ${[1,2,3,4,5].map(n => `
          <div id="onb-dot-${n}"
            style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;
              justify-content:center;font-size:11px;font-weight:800;transition:all .3s;
              background:#e5e7eb;color:#9ca3af">
            ${n}
          </div>`).join('')}
      </div>
    </div>

    <div id="onb-chat" style="display:flex;flex-direction:column;gap:16px"></div>
    <div id="onb-form" style="margin-top:16px"></div>
  </div>`;

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
   온보딩 — 직접 입력 (3단계 폼)
   ========================================================== */

const ONB_DIRECT = {
  step: 1,
  data: {},
  jobFile: '',
  psychFile: '',
};

function renderOnbDirect(step) {
  ONB_DIRECT.step = step;
  const stepLabels = ['기본정보', '심리·건강', '진단검사'];
  const stepEmojis = ['👤', '💙', '🔬'];

  document.getElementById('app-content').innerHTML = `
  <div style="max-width:520px;margin:0 auto;padding:24px 20px">

    <!-- 헤더 -->
    <div class="stu-animate" style="margin-bottom:20px">
      <button onclick="renderStudentOnboarding()"
        style="background:none;border:none;cursor:pointer;color:#9ca3af;font-size:13px;
          padding:4px 0;margin-bottom:14px;display:flex;align-items:center;gap:4px">
        ← 입력 방식 다시 선택
      </button>
      <div style="background:linear-gradient(135deg,#fdf4ff,#fce7f3);border-radius:16px;
        padding:16px 20px;border:1.5px solid #e9d5ff;
        display:flex;align-items:center;justify-content:space-between">
        <div>
          <div style="font-size:11px;color:#9ca3af;margin-bottom:4px;font-weight:700">직접 입력 — ${step}/3단계</div>
          <div style="font-size:17px;font-weight:900;color:#7c3aed">
            ${stepEmojis[step - 1]} ${stepLabels[step - 1]}
          </div>
        </div>
        <div style="display:flex;gap:6px;align-items:center">
          ${[1, 2, 3].map(n => `
            <div style="width:${n === step ? '24px' : '10px'};height:10px;border-radius:999px;
              background:${n <= step ? '#7c3aed' : '#e5e7eb'};transition:all .3s"></div>`).join('')}
        </div>
      </div>
    </div>

    <!-- 폼 영역 -->
    <div id="onb-direct-form" class="stu-animate stu-animate-delay-1">
      ${step === 1 ? onbDirectStep1() : step === 2 ? onbDirectStep2() : onbDirectStep3()}
    </div>
  </div>`;
}

/* ---- 1단계: 기본정보 ---- */
function onbDirectStep1() {
  const ic  = INITIAL_CONSULTATIONS['stu-001'];
  const stu = USERS.student;
  const curGoal = ONB_DIRECT.data._goalSelected || ic?.careerGoal || '';

  return `
    <div style="background:#fff;border-radius:18px;padding:22px 20px;
      box-shadow:0 2px 16px rgba(124,58,237,.1);border:1.5px solid #f3e8ff">

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
        <div>
          <label style="font-size:12px;font-weight:700;color:#7c3aed;display:block;margin-bottom:6px">학과</label>
          <select id="dir-dept"
            style="width:100%;border:1.5px solid #e9d5ff;border-radius:10px;padding:10px 12px;font-size:14px;color:#374151">
            <option value="">선택하세요</option>
            ${['AI소프트웨어학과','경영학과','전기전자공학과','심리학과','디자인학과','간호학과','기타'].map(d =>
              `<option value="${d}" ${(ONB_DIRECT.data.department||stu?.department)===d?'selected':''}>${d}</option>`
            ).join('')}
          </select>
        </div>
        <div>
          <label style="font-size:12px;font-weight:700;color:#7c3aed;display:block;margin-bottom:6px">학년</label>
          <select id="dir-grade"
            style="width:100%;border:1.5px solid #e9d5ff;border-radius:10px;padding:10px 12px;font-size:14px;color:#374151">
            <option value="">선택하세요</option>
            ${[1,2,3,4].map(g =>
              `<option value="${g}" ${(ONB_DIRECT.data.grade||stu?.grade)==g?'selected':''}>${g}학년</option>`
            ).join('')}
          </select>
        </div>
      </div>

      <div style="margin-bottom:14px">
        <label style="font-size:12px;font-weight:700;color:#7c3aed;display:block;margin-bottom:6px">이름</label>
        <input id="dir-name" type="text" placeholder="이름을 입력하세요"
          value="${esc(ONB_DIRECT.data.name || stu?.name || '')}"
          style="width:100%;border:1.5px solid #e9d5ff;border-radius:10px;padding:10px 14px;font-size:14px;color:#374151">
      </div>

      <div style="margin-bottom:14px">
        <label style="font-size:12px;font-weight:700;color:#7c3aed;display:block;margin-bottom:8px">진로 목표</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${[['💼','취업'],['🎓','진학'],['🚀','창업'],['🌀','기타']].map(([ico, val]) => `
            <button onclick="onbDirSelectGoal('${val}',this)"
              data-dirgoal="${val}"
              style="padding:9px 18px;border:2px solid ${curGoal===val?'#7c3aed':'#e9d5ff'};
                border-radius:999px;font-size:13px;font-weight:700;cursor:pointer;
                background:${curGoal===val?'#f5f3ff':'#fff'};
                color:${curGoal===val?'#7c3aed':'#374151'};transition:all .15s">
              ${ico} ${val}
            </button>`).join('')}
        </div>
      </div>

      <div style="margin-bottom:22px">
        <label style="font-size:12px;font-weight:700;color:#7c3aed;display:block;margin-bottom:6px">희망 직무</label>
        <input id="dir-job" type="text" placeholder="예: 데이터 분석가, UX 디자이너, 공무원..."
          value="${esc(ONB_DIRECT.data.desiredJob || stu?.desiredJob || '')}"
          style="width:100%;border:1.5px solid #e9d5ff;border-radius:10px;padding:10px 14px;font-size:14px;color:#374151"
          onkeydown="if(event.key==='Enter') onbDirectNext(1)">
      </div>

      <button onclick="onbDirectNext(1)"
        style="width:100%;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;border:none;
          border-radius:12px;padding:14px;font-size:15px;font-weight:800;cursor:pointer;
          box-shadow:0 4px 14px rgba(124,58,237,.35)">
        다음 단계 → 심리·건강
      </button>
    </div>`;
}

/* ---- 2단계: 심리·건강 ---- */
function onbDirectStep2() {
  const d = ONB_DIRECT.data;
  return `
    <div style="background:#fff;border-radius:18px;padding:22px 20px;
      box-shadow:0 2px 16px rgba(124,58,237,.1);border:1.5px solid #f3e8ff">

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
        <div>
          <label style="font-size:12px;font-weight:700;color:#7c3aed;display:block;margin-bottom:6px">🏃 건강 상태</label>
          <select id="dir-health"
            style="width:100%;border:1.5px solid #e9d5ff;border-radius:10px;padding:10px 12px;font-size:14px">
            <option value="">선택하세요</option>
            ${['매우 좋음','좋음','보통','좋지 않음'].map(v =>
              `<option value="${v}" ${d.health===v?'selected':''}>${v}</option>`).join('')}
          </select>
        </div>
        <div>
          <label style="font-size:12px;font-weight:700;color:#7c3aed;display:block;margin-bottom:6px">💙 심리 상태</label>
          <select id="dir-psych"
            style="width:100%;border:1.5px solid #e9d5ff;border-radius:10px;padding:10px 12px;font-size:14px">
            <option value="">선택하세요</option>
            ${['안정적','약간 불안','많이 불안','무기력'].map(v =>
              `<option value="${v}" ${d.psych===v?'selected':''}>${v}</option>`).join('')}
          </select>
        </div>
        <div>
          <label style="font-size:12px;font-weight:700;color:#7c3aed;display:block;margin-bottom:6px">⏰ 생활 패턴</label>
          <select id="dir-life"
            style="width:100%;border:1.5px solid #e9d5ff;border-radius:10px;padding:10px 12px;font-size:14px">
            <option value="">선택하세요</option>
            ${['규칙적','보통','불규칙'].map(v =>
              `<option value="${v}" ${d.lifePattern===v?'selected':''}>${v}</option>`).join('')}
          </select>
        </div>
        <div>
          <label style="font-size:12px;font-weight:700;color:#7c3aed;display:block;margin-bottom:6px">🎯 진로 확신도</label>
          <select id="dir-career-conf"
            style="width:100%;border:1.5px solid #e9d5ff;border-radius:10px;padding:10px 12px;font-size:14px">
            <option value="">선택하세요</option>
            ${['매우 낮음','낮음','보통','높음','매우 높음'].map(v =>
              `<option value="${v}" ${d.careerConf===v?'selected':''}>${v}</option>`).join('')}
          </select>
        </div>
      </div>

      <div style="background:#fdf4ff;border-radius:12px;padding:12px 14px;
        font-size:13px;color:#7c3aed;line-height:1.7;margin-bottom:20px;border:1px solid #f3e8ff">
        💡 솔직하게 입력할수록 AI 추천이 정확해져요.<br>상담사 선생님께만 공유돼요 🔒
      </div>

      <div style="display:flex;gap:10px">
        <button onclick="renderOnbDirect(1)"
          style="flex:1;background:#f5f3ff;color:#7c3aed;border:none;
            border-radius:12px;padding:13px;font-size:14px;font-weight:700;cursor:pointer">
          ← 이전
        </button>
        <button onclick="onbDirectNext(2)"
          style="flex:2;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;border:none;
            border-radius:12px;padding:13px;font-size:15px;font-weight:800;cursor:pointer;
            box-shadow:0 4px 14px rgba(124,58,237,.35)">
          다음 단계 → 진단검사
        </button>
      </div>
    </div>`;
}

/* ---- 3단계: 진단검사 ---- */
function onbDirectStep3() {
  const curMbti = ONB_DIRECT.data.mbti || INITIAL_CONSULTATIONS['stu-001']?.mbti || '';

  return `
    <div style="background:#fff;border-radius:18px;padding:22px 20px;
      box-shadow:0 2px 16px rgba(124,58,237,.1);border:1.5px solid #f3e8ff">

      <!-- MBTI -->
      <div style="margin-bottom:18px">
        <label style="font-size:12px;font-weight:700;color:#7c3aed;display:block;margin-bottom:8px">
          🧠 MBTI 코드 (선택)
        </label>
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:10px">
          <input id="dir-mbti" type="text" maxlength="4"
            placeholder="예: ISTJ"
            value="${esc(curMbti)}"
            style="flex:1;border:1.5px solid #e9d5ff;border-radius:10px;padding:11px 14px;
              font-size:22px;font-weight:900;text-align:center;letter-spacing:6px;
              color:#7c3aed;text-transform:uppercase"
            oninput="this.value=this.value.toUpperCase()">
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:5px">
          ${['ISTJ','ISFJ','INFJ','INTJ','ISTP','ISFP','INFP','INTP',
             'ESTP','ESFP','ENFP','ENTP','ESTJ','ESFJ','ENFJ','ENTJ'].map(m => `
            <button onclick="document.getElementById('dir-mbti').value='${m}'"
              style="padding:4px 9px;border:1px solid #e9d5ff;border-radius:7px;
                font-size:11px;font-weight:700;cursor:pointer;background:#faf5ff;color:#7c3aed;
                transition:background .1s"
              onmouseover="this.style.background='#e9d5ff'"
              onmouseout="this.style.background='#faf5ff'">
              ${m}
            </button>`).join('')}
        </div>
      </div>

      <!-- 직업선호도검사 업로드 -->
      <div style="margin-bottom:14px">
        <label style="font-size:12px;font-weight:700;color:#7c3aed;display:block;margin-bottom:8px">
          💼 직업선호도검사 결과지 <span style="color:#9ca3af;font-weight:400">(선택)</span>
        </label>
        <div onclick="document.getElementById('dir-job-file').click()"
          style="border:2px dashed ${ONB_DIRECT.jobFile?'#7c3aed':'#e9d5ff'};border-radius:12px;
            padding:16px;text-align:center;cursor:pointer;
            background:${ONB_DIRECT.jobFile?'#f5f3ff':'#faf5ff'};transition:all .2s"
          ondragover="event.preventDefault();this.style.borderColor='#7c3aed'"
          ondragleave="this.style.borderColor='${ONB_DIRECT.jobFile?'#7c3aed':'#e9d5ff'}'">
          ${ONB_DIRECT.jobFile
            ? `<div style="font-size:14px;font-weight:700;color:#7c3aed">📄 ${esc(ONB_DIRECT.jobFile)}</div>
               <div style="font-size:11px;color:#9ca3af;margin-top:3px">변경하려면 클릭</div>`
            : `<div style="font-size:18px;margin-bottom:4px">📊</div>
               <div style="font-size:13px;font-weight:700;color:#7c3aed;margin-bottom:2px">파일 업로드</div>
               <div style="font-size:11px;color:#9ca3af">워크넷·커리어넷 결과지 PDF/이미지</div>`}
          <input type="file" id="dir-job-file" style="display:none" accept=".pdf,.jpg,.jpeg,.png"
            onchange="onbDirFileUpload(this,'job')">
        </div>
      </div>

      <!-- 성격·심리검사 업로드 -->
      <div style="margin-bottom:18px">
        <label style="font-size:12px;font-weight:700;color:#7c3aed;display:block;margin-bottom:8px">
          💙 성격·심리검사 결과지 <span style="color:#9ca3af;font-weight:400">(선택)</span>
        </label>
        <div onclick="document.getElementById('dir-psych-file').click()"
          style="border:2px dashed ${ONB_DIRECT.psychFile?'#7c3aed':'#e9d5ff'};border-radius:12px;
            padding:16px;text-align:center;cursor:pointer;
            background:${ONB_DIRECT.psychFile?'#f5f3ff':'#faf5ff'};transition:all .2s"
          ondragover="event.preventDefault();this.style.borderColor='#7c3aed'"
          ondragleave="this.style.borderColor='${ONB_DIRECT.psychFile?'#7c3aed':'#e9d5ff'}'">
          ${ONB_DIRECT.psychFile
            ? `<div style="font-size:14px;font-weight:700;color:#7c3aed">📄 ${esc(ONB_DIRECT.psychFile)}</div>
               <div style="font-size:11px;color:#9ca3af;margin-top:3px">변경하려면 클릭</div>`
            : `<div style="font-size:18px;margin-bottom:4px">💙</div>
               <div style="font-size:13px;font-weight:700;color:#7c3aed;margin-bottom:2px">파일 업로드</div>
               <div style="font-size:11px;color:#9ca3af">성격검사, MMPI, PAI, SCT 등 결과지</div>`}
          <input type="file" id="dir-psych-file" style="display:none" accept=".pdf,.jpg,.jpeg,.png"
            onchange="onbDirFileUpload(this,'psych')">
        </div>
      </div>

      <div style="background:#fdf4ff;border-radius:10px;padding:10px 14px;
        font-size:12px;color:#9ca3af;margin-bottom:18px;border:1px solid #f3e8ff;line-height:1.6">
        ℹ️ 검사 파일이 없으면 건너뛰어도 돼요. 나중에 진단검사 메뉴에서 추가할 수 있어요.
      </div>

      <div style="display:flex;gap:10px">
        <button onclick="renderOnbDirect(2)"
          style="flex:1;background:#f5f3ff;color:#7c3aed;border:none;
            border-radius:12px;padding:13px;font-size:14px;font-weight:700;cursor:pointer">
          ← 이전
        </button>
        <button onclick="onbDirectFinish()"
          style="flex:2;background:linear-gradient(135deg,#7c3aed,#ec4899);color:#fff;border:none;
            border-radius:12px;padding:13px;font-size:15px;font-weight:800;cursor:pointer;
            box-shadow:0 4px 16px rgba(124,58,237,.4)">
          🤖 AI 분석하기 →
        </button>
      </div>
    </div>`;
}

/* ---- 다음 단계 이동 + 유효성 검사 ---- */
function onbDirectNext(step) {
  if (step === 1) {
    const dept  = document.getElementById('dir-dept')?.value;
    const grade = document.getElementById('dir-grade')?.value;
    const name  = document.getElementById('dir-name')?.value.trim();
    const job   = document.getElementById('dir-job')?.value.trim();
    if (!dept)  { showToast('학과를 선택해주세요.', 'error'); return; }
    if (!grade) { showToast('학년을 선택해주세요.', 'error'); return; }
    if (!ONB_DIRECT.data._goalSelected) { showToast('진로 목표를 선택해주세요.', 'error'); return; }
    ONB_DIRECT.data.department = dept;
    ONB_DIRECT.data.grade      = grade;
    ONB_DIRECT.data.name       = name || USERS.student.name;
    ONB_DIRECT.data.careerGoal = ONB_DIRECT.data._goalSelected;
    ONB_DIRECT.data.desiredJob = job || '미정';
    renderOnbDirect(2);
  } else if (step === 2) {
    const health = document.getElementById('dir-health')?.value;
    const psych  = document.getElementById('dir-psych')?.value;
    const life   = document.getElementById('dir-life')?.value;
    const conf   = document.getElementById('dir-career-conf')?.value;
    if (!health || !psych || !life || !conf) {
      showToast('모든 항목을 선택해주세요.', 'error'); return;
    }
    ONB_DIRECT.data.health      = health;
    ONB_DIRECT.data.psych       = psych;
    ONB_DIRECT.data.lifePattern = life;
    ONB_DIRECT.data.careerConf  = conf;
    renderOnbDirect(3);
  }
}

/* ---- 파일 업로드 처리 ---- */
function onbDirFileUpload(input, type) {
  if (!input.files.length) return;
  const name = input.files[0].name;
  if (type === 'job') ONB_DIRECT.jobFile   = name;
  else                ONB_DIRECT.psychFile = name;
  showToast(`"${name}" 파일이 선택되었습니다.`, 'info');
  renderOnbDirect(3);
}

/* ---- 목표 버튼 선택 토글 ---- */
function onbDirSelectGoal(val, btn) {
  document.querySelectorAll('[data-dirgoal]').forEach(b => {
    b.style.borderColor = '#e9d5ff'; b.style.background = '#fff'; b.style.color = '#374151';
  });
  btn.style.borderColor = '#7c3aed';
  btn.style.background  = '#f5f3ff';
  btn.style.color       = '#7c3aed';
  ONB_DIRECT.data._goalSelected = val;
}

/* ---- 완료: 데이터 반영 + AI 분석 로딩 ---- */
function onbDirectFinish() {
  // MBTI 저장
  const mbtiVal = (document.getElementById('dir-mbti')?.value || '').toUpperCase().trim();
  if (mbtiVal && /^[EI][SN][TF][JP]$/.test(mbtiVal)) {
    ONB_DIRECT.data.mbti = mbtiVal;
    const ic = INITIAL_CONSULTATIONS['stu-001'];
    if (ic) ic.mbti = mbtiVal;
    StuDiag.mbtiResult = mbtiVal;
  }

  // 사용자 데이터 반영
  const stu = USERS.student;
  if (ONB_DIRECT.data.department)  stu.department   = ONB_DIRECT.data.department;
  if (ONB_DIRECT.data.grade)       stu.grade        = parseInt(ONB_DIRECT.data.grade);
  if (ONB_DIRECT.data.name)        stu.name         = ONB_DIRECT.data.name;
  if (ONB_DIRECT.data.desiredJob)  stu.desiredJob   = ONB_DIRECT.data.desiredJob;
  if (ONB_DIRECT.data.careerGoal) {
    const ic = INITIAL_CONSULTATIONS['stu-001'];
    if (ic) { ic.careerGoal = ONB_DIRECT.data.careerGoal; }
  }
  if (ONB_DIRECT.jobFile)   StuDiag.jobFile   = ONB_DIRECT.jobFile;
  if (ONB_DIRECT.psychFile) StuDiag.psychFile = ONB_DIRECT.psychFile;
  State.stuOnboardingDone = true;

  // AI 분석 로딩 화면
  document.getElementById('app-content').innerHTML = `
    <div style="max-width:520px;margin:0 auto;padding:60px 20px;text-align:center">
      <div class="stu-animate">
        <div style="font-size:64px;margin-bottom:16px">🤖</div>
        <div style="font-size:20px;font-weight:900;color:#1f2937;margin-bottom:8px">
          AI가 분석하고 있어요!
        </div>
        <div style="font-size:14px;color:#6b7280;margin-bottom:28px;line-height:1.7">
          입력한 정보를 바탕으로<br>나만의 진로 포트폴리오를 준비 중이에요 ✨
        </div>
        <div style="display:flex;justify-content:center;gap:6px;margin-bottom:28px">
          ${[0, 200, 400].map(delay =>
            `<div style="width:12px;height:12px;border-radius:50%;
              background:linear-gradient(135deg,#7c3aed,#ec4899);
              animation:bounce .8s ease-in-out ${delay}ms infinite alternate"></div>`
          ).join('')}
        </div>
        <div style="background:linear-gradient(135deg,#fdf4ff,#fce7f3);border-radius:16px;
          padding:18px 20px;border:1.5px solid #e9d5ff;
          font-size:13px;color:#7c3aed;line-height:2;text-align:left">
          ✅ 기본정보 저장 완료<br>
          ✅ 심리·건강 정보 분석 완료<br>
          ${ONB_DIRECT.jobFile  ? `✅ 직업선호도검사 파일 수신<br>` : ''}
          ${ONB_DIRECT.psychFile? `✅ 성격·심리검사 파일 수신<br>` : ''}
          <span style="color:#a78bfa">🔄 진로 포트폴리오 생성 중...</span>
        </div>
      </div>
    </div>`;

  setTimeout(() => navigate('stu-home'), 2800);
}

/* ==========================================================
   1. 학생 메인 홈
   ========================================================== */
/* ==========================================================
   홈 화면 — 종합 분석 요약 카드
   ========================================================== */
function stuHomeSummaryCard(ic, diagData, port) {
  const mbti        = ic?.mbti || 'ISTJ';
  const hollandCode = StuDiag.jobResult ? 'RI' : 'RI'; // 직업선호도 분석 완료 시 동적 적용
  const hollandName = HOLLAND_DB[hollandCode]?.name || '현실형–탐구형';

  /* ── 유형 한줄 요약 ── */
  const TYPE_LABELS = {
    'ISTJ+RI': { tag:'체계적이고 꼼꼼한 데이터 탐구가형',   desc:'원칙과 분석력을 무기로 정확한 결과를 만들어요' },
    'INTJ+RI': { tag:'전략적인 데이터 설계자형',             desc:'큰 그림과 기술력으로 혁신적인 솔루션을 만들어요' },
    'INTP+RI': { tag:'논리적인 기술 탐구가형',               desc:'아이디어와 데이터로 새로운 가능성을 발견해요' },
    'ISTP+RI': { tag:'실용적인 기술 문제해결사형',           desc:'손으로 직접 데이터를 다루며 결과를 만들어요' },
    'ENTJ+EC': { tag:'목표 지향적인 전략 리더형',            desc:'체계적인 계획과 추진력으로 팀을 이끌어요' },
    'ENFP+SA': { tag:'창의적이고 따뜻한 콘텐츠 기획가형',   desc:'감성과 아이디어로 사람들을 연결해요' },
    'ESTJ+CS': { tag:'체계적이고 믿음직한 관리 전문가형',   desc:'정확성과 조직력으로 모든 일을 완성해요' },
    'ENFJ+SE': { tag:'사람을 이끄는 따뜻한 리더형',         desc:'공감 능력과 리더십으로 팀에 활력을 불어넣어요' },
    'INFP+IA': { tag:'감성적인 창의 탐구가형',              desc:'깊은 공감과 창의성으로 의미 있는 작업을 해요' },
  };
  const typeKey  = `${mbti}+${hollandCode}`;
  const typeInfo = TYPE_LABELS[typeKey] || {
    tag:  `${mbti} + ${hollandCode}형 분석가`,
    desc: '논리적 사고와 기술 역량을 겸비한 강점 있는 유형이에요',
  };

  /* ── 핵심 강점 ── */
  let topStrengths = [
    { icon:'⭐', label:'성실함' },
    { icon:'🛡️', label:'책임감' },
    { icon:'📚', label:'학업 역량' },
  ];
  if (diagData) {
    const pool = [
      { icon:'⭐', label:'성실함',    val: diagData.psychTest.sincerity },
      { icon:'🛡️', label:'책임감',    val: diagData.psychTest.responsibility },
      { icon:'🎯', label:'목표의식',  val: diagData.psychTest.goalOrientation },
      { icon:'📚', label:'학업 역량', val: diagData.lifeHistory.academics },
      { icon:'🦅', label:'독립심',    val: diagData.lifeHistory.independence },
      { icon:'🔥', label:'도전 의지', val: diagData.lifeHistory.ambition },
      { icon:'🌈', label:'열린 마음', val: diagData.psychTest.receptivity },
    ];
    topStrengths = pool.sort((a, b) => b.val - a.val).slice(0, 3);
  }

  /* ── 추천 진로 3가지 (Holland DB 기반) ── */
  const careers = (HOLLAND_DB[hollandCode]?.jobs || []).slice(0, 3);
  const CAREER_DETAIL = {
    '소프트웨어 엔지니어':   'Python·Java 등으로 시스템·앱을 직접 만들어요. 코딩 실력이 핵심 경쟁력이에요.',
    '데이터 과학자':         '통계·ML로 데이터에서 인사이트를 발굴해요. 분석력과 Python이 기본 무기예요.',
    '데이터 분석가':         '숫자로 비즈니스 의사결정을 돕는 직업이에요. ADsP·SQLD 자격증이 첫 목표예요!',
    'AI 엔지니어':           'AI 모델을 개발·배포하는 직업이에요. 딥러닝과 Python 실력이 핵심이에요.',
    '데이터 사이언티스트':   '복잡한 데이터에서 가치를 발굴해요. 분석·통계·프로그래밍을 모두 활용해요.',
    'IT 시스템 전문가':      '서버·네트워크·보안을 관리해요. 꼼꼼함과 기술 이해가 강점인 직종이에요.',
    '기계공학자':            '기계·설비 설계 및 제작을 담당해요. 이공계 전문 지식이 핵심이에요.',
    '환경공학자':            '환경 문제를 기술로 해결하는 직업이에요. 이공계 역량과 가치관이 중요해요.',
    '상담사':                '사람들의 마음을 돕는 직업이에요. 공감 능력과 전문 자격증이 필요해요.',
    '작가':                  '글로 생각을 전달하는 직업이에요. 꾸준한 글쓰기 연습이 경력의 시작이에요.',
    '교수':                  '대학에서 연구·교육을 담당해요. 석·박사 학위와 연구 실적이 필요해요.',
  };

  /* ── 현재 진로 단계 ── */
  const stages   = ['진로 탐색', '진로 설정', '취업 준비', '완료'];
  const stageMap = { '진로탐색': 0, '진로설정': 1, '취업준비': 2, '완료': 3 };
  const curStage = stageMap[port?.currentStage] ?? 0;

  /* ── 이번 달 추천 액션 ── */
  const actions = [
    'ADsP 자격증 시험 접수하기 (5월 시험 마감 임박! 🔥)',
    'GitHub 포트폴리오 첫 번째 레포지토리 만들기 💻',
  ];

  return `
  <div class="stu-animate" style="margin:0 16px 20px">
    <div style="background:linear-gradient(160deg,#312e81 0%,#4f46e5 45%,#7c3aed 100%);
      border-radius:22px;overflow:hidden;box-shadow:0 8px 32px rgba(79,70,229,.38)">

      <!-- ① 나의 유형 한줄 요약 -->
      <div style="padding:22px 20px 18px;text-align:center;
        border-bottom:1px solid rgba(255,255,255,.12)">
        <div style="font-size:11px;font-weight:800;color:rgba(255,255,255,.45);
          letter-spacing:3px;margin-bottom:12px">🤖 AI 종합 분석 요약</div>
        <div style="display:inline-flex;align-items:center;gap:10px;
          background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.2);
          border-radius:999px;padding:7px 20px;margin-bottom:14px">
          <span style="font-size:17px;font-weight:900;color:#a5b4fc;letter-spacing:3px">${mbti}</span>
          <span style="color:rgba(255,255,255,.35);font-size:16px">+</span>
          <span style="font-size:17px;font-weight:900;color:#c4b5fd;letter-spacing:3px">${hollandCode}형</span>
        </div>
        <div style="font-size:17px;font-weight:900;color:#fff;margin-bottom:7px;line-height:1.4">
          ${typeInfo.tag}
        </div>
        <div style="font-size:13px;color:rgba(255,255,255,.68);line-height:1.6">
          ${typeInfo.desc}
        </div>
      </div>

      <!-- ② 핵심 강점 3가지 -->
      <div style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,.12)">
        <div style="font-size:11px;font-weight:800;color:rgba(255,255,255,.5);
          letter-spacing:2px;margin-bottom:11px">✨ 핵심 강점</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${topStrengths.map(s => `
            <div style="background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.22);
              border-radius:12px;padding:9px 16px;display:flex;align-items:center;gap:7px">
              <span style="font-size:20px">${s.icon}</span>
              <span style="font-size:14px;font-weight:800;color:#fff">${s.label}</span>
            </div>`).join('')}
        </div>
      </div>

      <!-- 하단 흰 배경 섹션 -->
      <div style="background:#fff;border-radius:0 0 22px 22px">

        <!-- ③ 추천 진로 방향 -->
        <div style="padding:16px 20px;border-bottom:1px solid #f0f0f8">
          <div style="font-size:12px;font-weight:800;color:#4f46e5;
            letter-spacing:1px;margin-bottom:12px">💼 추천 진로 방향</div>
          <div style="display:flex;flex-direction:column;gap:7px">
            ${careers.map((job, i) => {
              const detail = CAREER_DETAIL[job] || `${hollandCode}형 흥미코드에 잘 맞는 직업이에요. 전공 역량을 살릴 수 있어요!`;
              const colors = ['#4f46e5', '#7c3aed', '#0891b2'];
              const bgs    = ['#f5f3ff', '#faf5ff', '#ecfeff'];
              return `
                <div>
                  <div onclick="const d=this.nextElementSibling;d.style.display=d.style.display==='block'?'none':'block'"
                    style="display:flex;align-items:center;gap:10px;padding:10px 14px;
                      background:${bgs[i]};border-radius:12px;cursor:pointer;
                      border:1.5px solid ${colors[i]}22;transition:background .15s"
                    onmouseover="this.style.background='${colors[i]}14'"
                    onmouseout="this.style.background='${bgs[i]}'">
                    <div style="width:24px;height:24px;border-radius:50%;background:${colors[i]};
                      display:flex;align-items:center;justify-content:center;
                      font-size:11px;font-weight:900;color:#fff;flex-shrink:0">${i + 1}</div>
                    <span style="flex:1;font-size:14px;font-weight:700;color:#1f2937">${job}</span>
                    <span style="font-size:12px;color:${colors[i]};font-weight:700">자세히 ▾</span>
                  </div>
                  <div style="display:none;padding:10px 14px 12px;margin-top:-4px;
                    background:${colors[i]}08;border:1.5px solid ${colors[i]}18;
                    border-top:none;border-radius:0 0 12px 12px;
                    font-size:13px;color:#4b5563;line-height:1.7">
                    ${detail}
                  </div>
                </div>`;
            }).join('')}
          </div>
        </div>

        <!-- ④ 현재 진로 단계 -->
        <div style="padding:16px 20px;border-bottom:1px solid #f0f0f8">
          <div style="font-size:12px;font-weight:800;color:#4f46e5;
            letter-spacing:1px;margin-bottom:14px">🗺️ 현재 진로 단계</div>
          <div style="display:flex;align-items:flex-start">
            ${stages.map((s, i) => {
              const isActive = i === curStage;
              const isDone   = i < curStage;
              const isLast   = i === stages.length - 1;
              return `
                <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:5px">
                  <div style="width:30px;height:30px;border-radius:50%;
                    display:flex;align-items:center;justify-content:center;
                    font-size:${isDone ? '14px' : '11px'};font-weight:900;
                    ${isActive
                      ? 'background:#4f46e5;color:#fff;box-shadow:0 0 0 4px #c7d2fe'
                      : isDone
                        ? 'background:#4f46e5;color:#fff'
                        : 'background:#f3f4f6;color:#9ca3af'}">
                    ${isDone ? '✓' : i + 1}
                  </div>
                  <div style="font-size:10px;font-weight:${isActive ? '900' : '600'};
                    color:${isActive ? '#4f46e5' : isDone ? '#6366f1' : '#9ca3af'};
                    text-align:center;white-space:nowrap">
                    ${s}${isActive ? ' 🔵' : ''}
                  </div>
                </div>
                ${!isLast ? `<div style="flex:0 0 16px;height:2px;
                  background:${i < curStage ? '#4f46e5' : '#e5e7eb'};
                  margin-top:14px;flex-shrink:0"></div>` : ''}`;
            }).join('')}
          </div>
        </div>

        <!-- ⑤ 이번 달 추천 액션 -->
        <div style="padding:16px 20px 20px">
          <div style="font-size:12px;font-weight:800;color:#d97706;
            letter-spacing:1px;margin-bottom:12px">📋 이번 달 추천 액션</div>
          ${actions.map(a => `
            <div onclick="
              const box=this.querySelector('.act-box');
              const txt=this.querySelector('.act-txt');
              const done=box.dataset.done==='1';
              box.dataset.done=done?'0':'1';
              box.innerHTML=done?'':'✓';
              box.style.background=done?'#fffbeb':'#fef3c7';
              box.style.borderColor=done?'#fde68a':'#d97706';
              txt.style.textDecoration=done?'none':'line-through';
              txt.style.color=done?'#374151':'#9ca3af';"
              style="display:flex;align-items:flex-start;gap:10px;padding:9px 0;
                border-bottom:1px solid #fef9ec;cursor:pointer">
              <div class="act-box" data-done="0"
                style="width:22px;height:22px;border:2px solid #fde68a;border-radius:6px;
                  background:#fffbeb;display:flex;align-items:center;justify-content:center;
                  font-size:12px;font-weight:900;color:#d97706;flex-shrink:0;margin-top:1px;
                  transition:all .15s"></div>
              <span class="act-txt" style="font-size:13px;font-weight:600;
                color:#374151;line-height:1.6;transition:all .15s">${a}</span>
            </div>`).join('')}
          <div style="font-size:11px;color:#9ca3af;text-align:center;margin-top:10px">
            터치하면 완료 처리돼요 ✅
          </div>
        </div>

      </div>
    </div>
  </div>`;
}

function renderStudentHome() {
  const stu      = USERS.student;
  const diag     = (DIAGNOSES['stu-001'] || []);
  const port     = (PORTFOLIOS['stu-001'] || [])[0];
  const emp      = EMPLOYMENT_STATUS['stu-001'];
  const ic       = INITIAL_CONSULTATIONS['stu-001'];
  const diagData = diag.find(x => x.psychTest) || null;

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

    ${stuHomeSummaryCard(ic, diagData, port)}

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
   5. 포트폴리오 (성장 스토리 + AI 종합 분석 + PDF 출력)
   ========================================================== */

/* --- AI 분석 상태 --- */
const PORT_AI = { shown: false };

/* --- AI 종합 분석 샘플 데이터 --- */
const PORT_AI_DATA = {
  self: {
    strengths: [
      { icon: '⭐', label: '성실함·책임감', desc: '꾸준히 과제를 완수하고 약속을 지키는 신뢰할 수 있는 사람이에요. 팀 프로젝트에서 특히 빛나요.' },
      { icon: '🔍', label: '분석적 사고', desc: '데이터와 수치를 꼼꼼하게 살피고 논리적으로 정리하는 능력이 뛰어나요.' },
      { icon: '🤝', label: '협력·배려', desc: '주변 사람들의 감정을 잘 이해하고, 팀에서 중재자 역할을 자연스럽게 맡아요.' },
    ],
    weaknesses: [
      { icon: '💬', label: '자기표현', desc: '좋은 생각이 있어도 먼저 말하기를 망설이는 편이에요. 발표나 면접 준비로 보완할 수 있어요.', tip: '소규모 모임에서 먼저 의견 내는 연습을 해보세요.' },
      { icon: '⏰', label: '시간관리', desc: '큰 목표보다는 하루 단위 계획을 세우면 더 실천하기 쉬울 거예요.', tip: '매주 일요일 밤 15분 한 주 계획 루틴을 만들어보세요.' },
    ],
    hollandSummary: '현실형(R) + 탐구형(I) 조합으로, 손으로 직접 다루며 분석하는 일을 좋아해요. 데이터 기반 문제 해결이나 기술 직무에 잘 맞아요.',
    mbtiSummary: 'ISTJ 유형으로 신중하고 체계적이에요. 규칙과 구조가 있는 환경에서 탁월한 성과를 내고, 책임감 있게 일을 마무리해요.',
  },
  major: {
    fitScore: 88,
    fitDesc: '스마트소프트웨어학과 교육과정이 희망 직무(데이터 분석가)와 매우 잘 맞아요.',
    recCourses: [
      { name: '데이터베이스설계', reason: '데이터 분석의 기초 — 다음 학기 필수 수강 권장', tag: '필수' },
      { name: '파이썬응용프로그래밍', reason: '분석 실무에서 가장 많이 쓰는 언어', tag: '권장' },
      { name: '머신러닝기초', reason: '데이터 분석 → AI 확장을 위한 핵심 과목', tag: '권장' },
      { name: '캡스톤디자인', reason: '포트폴리오에 직접 넣을 수 있는 실전 프로젝트', tag: '심화' },
    ],
    certs: [
      { name: '데이터분석준전문가(ADsP)', timeline: '2026년 하반기', desc: '데이터 직무 입문 자격증, 학부생 합격률 높음' },
      { name: 'SQL개발자(SQLD)', timeline: '2027년 상반기', desc: '실무 DB 역량 증명' },
    ],
    extracurr: [
      { name: 'AI 취업캠프', type: '비교과', desc: '데이터·AI 직무 실전 준비, 3월·9월 운영' },
      { name: '취업멘토링', type: '비교과', desc: '현직 데이터 분석가 1:1 멘토링' },
    ],
  },
  roadmap: {
    stages: [
      {
        term: '1단계 (현재 ~ 2026년 하반기)',
        icon: '🌱',
        color: '#4f46e5',
        bg: '#eef2ff',
        goal: '기초 역량 강화 & 진로 확정',
        items: [
          '데이터베이스설계·파이썬응용 수강',
          'ADsP 자격증 취득',
          'AI 취업캠프 참여',
          '학과 소모임 프로젝트 참여',
        ],
      },
      {
        term: '2단계 (2027년 상반기)',
        icon: '🚀',
        color: '#0891b2',
        bg: '#ecfeff',
        goal: '실무 역량 & 포트폴리오 구축',
        items: [
          'SQLD 자격증 취득',
          '캡스톤디자인 프로젝트 (데이터 분석 주제)',
          '인턴십 또는 현장실습 지원',
          '깃허브 포트폴리오 정리',
        ],
      },
      {
        term: '3단계 (2027년 하반기 ~ 졸업)',
        icon: '🏆',
        color: '#059669',
        bg: '#f0fdf4',
        goal: '취업 준비 & 최종 목표 달성',
        items: [
          '자기소개서·이력서 작성 완료',
          '데이터 분석 직무 채용 지원 (5곳 이상)',
          '모의 면접 훈련 (학교 취업지원팀 활용)',
          '최종 취업 또는 대학원 진학 결정',
        ],
      },
    ],
  },
};

/* --- 포트폴리오 메인 화면 --- */
function renderStudentPortfolio() {
  const port = (PORTFOLIOS['stu-001'] || [])[0];
  PORT_AI.shown = false;

  document.getElementById('app-content').innerHTML = `
  <div class="stu-portfolio-wrap">
    ${stuBack('stu-home')}

    ${!port ? `
      <div class="stu-ai-box stu-animate" style="text-align:center;padding:40px">
        <div style="font-size:48px;margin-bottom:12px">✨</div>
        <div style="font-size:16px;font-weight:800;color:#1f2937;margin-bottom:6px">포트폴리오를 시작해볼까요?</div>
        <div style="font-size:14px;color:#6b7280">상담사 선생님과 함께 나만의 성장 스토리를 만들어가요</div>
      </div>` : `

      <!-- 진행 단계 배너 -->
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

      <!-- AI 종합 분석 버튼 -->
      <div id="port-ai-btn-wrap" class="stu-animate" style="margin-bottom:20px">
        <button id="port-ai-btn" onclick="portAiAnalyze()"
          style="width:100%;padding:18px;border-radius:var(--radius-xl);border:none;cursor:pointer;
            background:linear-gradient(135deg,#7c3aed,#ec4899);color:#fff;
            font-size:16px;font-weight:800;display:flex;align-items:center;justify-content:center;gap:10px;
            box-shadow:0 4px 16px rgba(124,58,237,.35)">
          <span style="font-size:22px">✨</span>
          AI 종합 분석 보고서 생성하기
          <span style="font-size:13px;font-weight:500;opacity:.85">자기분석·학과분석·진로로드맵 자동 생성</span>
        </button>
      </div>

      <!-- AI 분석 결과 영역 (처음엔 숨김) -->
      <div id="port-ai-result" style="display:none;margin-bottom:24px"></div>

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

/* --- AI 분석 실행 (2.2초 로딩 시뮬레이션) --- */
function portAiAnalyze() {
  const btn  = document.getElementById('port-ai-btn');
  const area = document.getElementById('port-ai-result');
  if (!btn || !area) return;

  // 버튼 로딩 상태
  btn.disabled = true;
  btn.innerHTML = `
    <div class="spinner" style="width:20px;height:20px;border-color:rgba(255,255,255,.3);border-top-color:#fff;margin-right:10px"></div>
    AI가 분석하고 있어요...`;

  area.style.display = 'block';
  area.innerHTML = `
    <div style="background:linear-gradient(135deg,#faf5ff,#fdf2f8);border:1.5px solid #e9d5ff;
      border-radius:var(--radius-xl);padding:28px;text-align:center">
      <div style="font-size:36px;margin-bottom:10px">🤖</div>
      <div style="font-weight:800;font-size:15px;color:#6d28d9;margin-bottom:6px">AI가 종합 분석 중이에요</div>
      <div style="font-size:13px;color:#9ca3af">진단 결과·상담 이력·학과 정보를 통합 분석하고 있습니다</div>
      <div style="margin-top:16px;display:flex;flex-direction:column;gap:6px;max-width:240px;margin:16px auto 0">
        ${['자기분석 리포트 생성 중...','학과 적합도 분석 중...','진로 로드맵 최적화 중...'].map(t => `
          <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:#a78bfa;font-weight:600">
            <div class="spinner" style="width:12px;height:12px;border-color:rgba(167,139,250,.3);border-top-color:#a78bfa;flex-shrink:0"></div>
            ${t}
          </div>`).join('')}
      </div>
    </div>`;

  setTimeout(() => {
    PORT_AI.shown = true;
    btn.innerHTML = `<span style="font-size:18px">✅</span> AI 종합 분석 완료 — PDF로 저장하기`;
    btn.style.background = 'linear-gradient(135deg,#059669,#0891b2)';
    btn.disabled = false;
    btn.onclick = null; // 재분석 방지
    portRenderAiResult();
  }, 2200);
}

/* --- AI 분석 결과 렌더링 --- */
function portRenderAiResult() {
  const d    = PORT_AI_DATA;
  const area = document.getElementById('port-ai-result');
  if (!area) return;

  area.innerHTML = `
    <!-- 섹션 헤더 스타일 공통 -->
    <style>
      .port-sec { background:#fff; border-radius:16px; border:1.5px solid #e5e7eb; margin-bottom:16px; overflow:hidden; }
      .port-sec-hd { background:#f5f5f5; padding:14px 18px; font-size:14px; font-weight:800; color:#333;
        display:flex; align-items:center; gap:8px; border-bottom:1px solid #e5e7eb; }
      .port-sec-body { padding:16px 18px; }
      .port-tag { display:inline-block; font-size:11px; font-weight:700; padding:2px 8px;
        border-radius:999px; margin-left:6px; }
    </style>

    <!-- ① 자기분석 -->
    <div class="port-sec stu-animate">
      <div class="port-sec-hd">🧠 자기분석 리포트</div>
      <div class="port-sec-body">

        <!-- MBTI + Holland -->
        <div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap">
          <div style="flex:1;min-width:140px;background:#eef2ff;border-radius:10px;padding:12px 14px">
            <div style="font-size:11px;color:#6d28d9;font-weight:700;margin-bottom:4px">MBTI 유형</div>
            <div style="font-size:14px;font-weight:800;color:#1f2937">${d.self.mbtiSummary}</div>
          </div>
          <div style="flex:1;min-width:140px;background:#fdf2f8;border-radius:10px;padding:12px 14px">
            <div style="font-size:11px;color:#be185d;font-weight:700;margin-bottom:4px">Holland 흥미코드</div>
            <div style="font-size:14px;font-weight:800;color:#1f2937">${d.self.hollandSummary}</div>
          </div>
        </div>

        <!-- 강점 -->
        <div style="font-size:13px;font-weight:800;color:#374151;margin-bottom:8px">✨ 핵심 강점</div>
        ${d.self.strengths.map(s => `
          <div style="display:flex;align-items:flex-start;gap:10px;padding:10px 12px;
            background:#f9fafb;border-radius:10px;margin-bottom:6px">
            <span style="font-size:20px;flex-shrink:0">${s.icon}</span>
            <div>
              <div style="font-size:13px;font-weight:800;color:#1f2937">${s.label}</div>
              <div style="font-size:12px;color:#6b7280;margin-top:2px">${s.desc}</div>
            </div>
          </div>`).join('')}

        <!-- 성장 포인트 -->
        <div style="font-size:13px;font-weight:800;color:#374151;margin:12px 0 8px">🌱 성장 포인트</div>
        ${d.self.weaknesses.map(w => `
          <div style="display:flex;align-items:flex-start;gap:10px;padding:10px 12px;
            background:#fffbeb;border-radius:10px;margin-bottom:6px;border-left:3px solid #f59e0b">
            <span style="font-size:20px;flex-shrink:0">${w.icon}</span>
            <div>
              <div style="font-size:13px;font-weight:800;color:#92400e">${w.label}</div>
              <div style="font-size:12px;color:#6b7280;margin-top:2px">${w.desc}</div>
              <div style="font-size:12px;color:#d97706;margin-top:4px;font-weight:600">💡 ${w.tip}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>

    <!-- ② 학과 분석 -->
    <div class="port-sec stu-animate">
      <div class="port-sec-hd">🎓 학과 분석 &amp; 추천</div>
      <div class="port-sec-body">

        <!-- 적합도 -->
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;
          background:linear-gradient(135deg,#ecfdf5,#f0fdf4);border-radius:10px;padding:14px">
          <div style="text-align:center;flex-shrink:0">
            <div style="font-size:32px;font-weight:900;color:#059669">${d.major.fitScore}%</div>
            <div style="font-size:11px;color:#059669;font-weight:700">직무 적합도</div>
          </div>
          <div style="font-size:13px;color:#374151;line-height:1.6">${d.major.fitDesc}</div>
        </div>

        <!-- 추천 과목 -->
        <div style="font-size:13px;font-weight:800;color:#374151;margin-bottom:8px">📚 다음 학기 추천 수강</div>
        <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:14px">
          <thead>
            <tr style="background:#333;color:#fff">
              <th style="padding:8px 10px;text-align:left;border-radius:6px 0 0 0">과목명</th>
              <th style="padding:8px 10px;text-align:left">추천 이유</th>
              <th style="padding:8px 10px;text-align:center;border-radius:0 6px 0 0">구분</th>
            </tr>
          </thead>
          <tbody>
            ${d.major.recCourses.map((c, i) => `
              <tr style="background:${i % 2 === 0 ? '#fff' : '#f9fafb'}">
                <td style="padding:8px 10px;font-weight:700;color:#1f2937;border-bottom:1px solid #f3f4f6">${c.name}</td>
                <td style="padding:8px 10px;color:#6b7280;border-bottom:1px solid #f3f4f6">${c.reason}</td>
                <td style="padding:8px 10px;text-align:center;border-bottom:1px solid #f3f4f6">
                  <span class="port-tag" style="background:${c.tag==='필수'?'#fee2e2':c.tag==='권장'?'#dbeafe':'#f3e8ff'};
                    color:${c.tag==='필수'?'#dc2626':c.tag==='권장'?'#1d4ed8':'#7c3aed'}">${c.tag}</span>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>

        <!-- 자격증 -->
        <div style="font-size:13px;font-weight:800;color:#374151;margin-bottom:8px">🏅 추천 자격증</div>
        ${d.major.certs.map(c => `
          <div style="display:flex;justify-content:space-between;align-items:flex-start;
            padding:10px 12px;background:#f9fafb;border-radius:8px;margin-bottom:6px">
            <div>
              <div style="font-size:13px;font-weight:700;color:#1f2937">${c.name}</div>
              <div style="font-size:12px;color:#6b7280;margin-top:2px">${c.desc}</div>
            </div>
            <span style="font-size:11px;font-weight:700;color:#4f46e5;background:#eef2ff;
              padding:3px 8px;border-radius:999px;white-space:nowrap;margin-left:8px">${c.timeline}</span>
          </div>`).join('')}

        <!-- 비교과 -->
        <div style="font-size:13px;font-weight:800;color:#374151;margin:12px 0 8px">🌟 추천 비교과 프로그램</div>
        ${d.major.extracurr.map(e => `
          <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;
            background:#f0fdf4;border-radius:8px;margin-bottom:6px;border-left:3px solid #059669">
            <span style="font-size:12px;font-weight:700;color:#059669;background:#dcfce7;
              padding:2px 8px;border-radius:999px;white-space:nowrap">${e.type}</span>
            <div>
              <div style="font-size:13px;font-weight:700;color:#1f2937">${e.name}</div>
              <div style="font-size:12px;color:#6b7280;margin-top:1px">${e.desc}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>

    <!-- ③ 진로 로드맵 -->
    <div class="port-sec stu-animate">
      <div class="port-sec-hd">🗺️ AI 추천 진로 로드맵</div>
      <div class="port-sec-body">
        ${d.roadmap.stages.map(s => `
          <div style="background:${s.bg};border-radius:12px;padding:14px 16px;margin-bottom:10px;border-left:4px solid ${s.color}">
            <div style="font-size:12px;font-weight:700;color:${s.color};margin-bottom:4px">${s.icon} ${s.term}</div>
            <div style="font-size:14px;font-weight:800;color:#1f2937;margin-bottom:8px">${s.goal}</div>
            ${s.items.map(item => `
              <div style="display:flex;align-items:flex-start;gap:6px;font-size:12px;color:#374151;margin-bottom:4px">
                <span style="color:${s.color};font-size:14px;line-height:1.2">•</span> ${item}
              </div>`).join('')}
          </div>`).join('')}
      </div>
    </div>

    <!-- PDF 출력 버튼 2개 -->
    <div style="display:flex;gap:10px;margin-top:8px;margin-bottom:8px">
      <button onclick="pdfSummary()"
        style="flex:1;padding:14px;border-radius:12px;border:2px solid #4f46e5;cursor:pointer;
          background:#fff;color:#4f46e5;font-size:14px;font-weight:800;
          display:flex;align-items:center;justify-content:center;gap:6px">
        📄 요약 리포트 PDF (1페이지)
      </button>
      <button onclick="pdfDetailed()"
        style="flex:1;padding:14px;border-radius:12px;border:none;cursor:pointer;
          background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;
          font-size:14px;font-weight:800;
          display:flex;align-items:center;justify-content:center;gap:6px;
          box-shadow:0 4px 12px rgba(79,70,229,.3)">
        📋 전체 포트폴리오 PDF
      </button>
    </div>
  `;
}

/* ----------------------------------------------------------
   PDF — 요약 리포트 (1페이지)
---------------------------------------------------------- */
function pdfSummary() {
  const stu  = USERS.student;
  const d    = PORT_AI_DATA;
  const today = new Date().toLocaleDateString('ko-KR');

  const html = `
  <div style="font-family:'맑은 고딕',Arial,sans-serif;width:794px;padding:40px 56px;color:#222;font-size:12px;line-height:1.6">

    <!-- 헤더 -->
    <div style="border-bottom:3px solid #4f46e5;padding-bottom:12px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:flex-end">
      <div>
        <div style="font-size:20px;font-weight:900;color:#4f46e5">M-Cap 진로 포트폴리오 요약</div>
        <div style="font-size:12px;color:#6b7280;margin-top:3px">명지전문대학 AI융합진로지원센터</div>
      </div>
      <div style="text-align:right;font-size:11px;color:#9ca3af">출력일: ${today}</div>
    </div>

    <!-- 기본정보 -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:12px">
      <tr style="background:#f5f5f5">
        <th style="padding:7px 12px;text-align:left;width:15%;border:1px solid #e5e7eb;color:#333">이름</th>
        <td style="padding:7px 12px;border:1px solid #e5e7eb;width:20%">${stu?.name || '김민준'}</td>
        <th style="padding:7px 12px;text-align:left;width:15%;background:#f5f5f5;border:1px solid #e5e7eb;color:#333">학과</th>
        <td style="padding:7px 12px;border:1px solid #e5e7eb;width:20%">${stu?.department || '스마트소프트웨어학과'}</td>
        <th style="padding:7px 12px;text-align:left;width:10%;background:#f5f5f5;border:1px solid #e5e7eb;color:#333">학년</th>
        <td style="padding:7px 12px;border:1px solid #e5e7eb">${stu?.grade || 2}학년</td>
      </tr>
      <tr>
        <th style="padding:7px 12px;text-align:left;background:#f5f5f5;border:1px solid #e5e7eb;color:#333">MBTI</th>
        <td style="padding:7px 12px;border:1px solid #e5e7eb">ISTJ</td>
        <th style="padding:7px 12px;text-align:left;background:#f5f5f5;border:1px solid #e5e7eb;color:#333">Holland코드</th>
        <td style="padding:7px 12px;border:1px solid #e5e7eb">RI (현실·탐구형)</td>
        <th style="padding:7px 12px;text-align:left;background:#f5f5f5;border:1px solid #e5e7eb;color:#333">진로단계</th>
        <td style="padding:7px 12px;border:1px solid #e5e7eb">진로탐색</td>
      </tr>
    </table>

    <!-- 핵심 강점 -->
    <div style="background:#f5f5f5;padding:8px 12px;font-size:13px;font-weight:700;color:#333;margin-bottom:8px;border-radius:4px">
      ✨ 핵심 강점
    </div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:12px">
      <thead>
        <tr style="background:#333;color:#fff">
          <th style="padding:7px 10px;text-align:left;width:20%">강점</th>
          <th style="padding:7px 10px;text-align:left">설명</th>
        </tr>
      </thead>
      <tbody>
        ${d.self.strengths.map((s, i) => `
          <tr style="background:${i%2===0?'#fff':'#f9fafb'}">
            <td style="padding:7px 10px;font-weight:700;border-bottom:1px solid #f3f4f6">${s.label}</td>
            <td style="padding:7px 10px;color:#374151;border-bottom:1px solid #f3f4f6">${s.desc}</td>
          </tr>`).join('')}
      </tbody>
    </table>

    <!-- 다음 학기 추천 수강 -->
    <div style="background:#f5f5f5;padding:8px 12px;font-size:13px;font-weight:700;color:#333;margin-bottom:8px;border-radius:4px">
      📚 다음 학기 추천 수강
    </div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:12px">
      <thead>
        <tr style="background:#333;color:#fff">
          <th style="padding:7px 10px;text-align:left;width:25%">과목명</th>
          <th style="padding:7px 10px;text-align:left">추천 이유</th>
          <th style="padding:7px 10px;text-align:center;width:12%">구분</th>
        </tr>
      </thead>
      <tbody>
        ${d.major.recCourses.map((c, i) => `
          <tr style="background:${i%2===0?'#fff':'#f9fafb'}">
            <td style="padding:7px 10px;font-weight:700;border-bottom:1px solid #f3f4f6">${c.name}</td>
            <td style="padding:7px 10px;color:#6b7280;border-bottom:1px solid #f3f4f6">${c.reason}</td>
            <td style="padding:7px 10px;text-align:center;border-bottom:1px solid #f3f4f6;font-weight:700">${c.tag}</td>
          </tr>`).join('')}
      </tbody>
    </table>

    <!-- 진로 로드맵 요약 -->
    <div style="background:#f5f5f5;padding:8px 12px;font-size:13px;font-weight:700;color:#333;margin-bottom:8px;border-radius:4px">
      🗺️ 진로 로드맵 요약
    </div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:12px">
      <thead>
        <tr style="background:#333;color:#fff">
          <th style="padding:7px 10px;text-align:left;width:28%">단계</th>
          <th style="padding:7px 10px;text-align:left">목표</th>
        </tr>
      </thead>
      <tbody>
        ${d.roadmap.stages.map((s, i) => `
          <tr style="background:${i%2===0?'#fff':'#f9fafb'}">
            <td style="padding:7px 10px;font-weight:700;border-bottom:1px solid #f3f4f6">${s.term}</td>
            <td style="padding:7px 10px;color:#374151;border-bottom:1px solid #f3f4f6">${s.goal} — ${s.items.join(' / ')}</td>
          </tr>`).join('')}
      </tbody>
    </table>

    <!-- 서명란 -->
    <div style="border-top:1px solid #e5e7eb;padding-top:16px;display:flex;justify-content:space-between;font-size:11px;color:#6b7280">
      <div>학생 확인: _________________ (서명)</div>
      <div>상담사 확인: _________________ (서명)</div>
      <div>교수 확인: _________________ (서명)</div>
      <div>발급일: ${today}</div>
    </div>
  </div>`;

  const el = document.createElement('div');
  el.innerHTML = html;
  document.body.appendChild(el);

  html2pdf().set({
    margin:       [15, 15, 15, 15],
    filename:     '진로포트폴리오_요약_' + (stu?.name || '학생') + '.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak:    { mode: 'avoid-all' },
  }).from(el.firstElementChild).save().then(() => {
    document.body.removeChild(el);
    showToast('요약 리포트 PDF가 저장되었어요!', 'success');
  });
}

/* ----------------------------------------------------------
   PDF — 전체 포트폴리오 (상세)
---------------------------------------------------------- */
function pdfDetailed() {
  const stu   = USERS.student;
  const d     = PORT_AI_DATA;
  const port  = (PORTFOLIOS['stu-001'] || [])[0];
  const today = new Date().toLocaleDateString('ko-KR');

  const roadmapRows = d.roadmap.stages.map(s =>
    s.items.map((item, i) => `
      <tr style="background:#fff">
        ${i === 0 ? `<td style="padding:7px 10px;font-weight:700;border-bottom:1px solid #f3f4f6;vertical-align:top"
          rowspan="${s.items.length}">${s.icon} ${s.term}</td>` : ''}
        <td style="padding:7px 10px;border-bottom:1px solid #f3f4f6">${item}</td>
      </tr>`).join('')
  ).join('');

  const actionRows = port ? port.actionPlans.map((a, i) => `
    <tr style="background:${i%2===0?'#fff':'#f9fafb'}">
      <td style="padding:7px 10px;border-bottom:1px solid #f3f4f6">${a.activityName}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #f3f4f6">${a.goal}</td>
      <td style="padding:7px 10px;text-align:center;border-bottom:1px solid #f3f4f6">${a.schedule}</td>
      <td style="padding:7px 10px;text-align:center;border-bottom:1px solid #f3f4f6">${a.category}</td>
      <td style="padding:7px 10px;text-align:center;border-bottom:1px solid #f3f4f6">${a.isCompleted ? '✅' : '⬜'}</td>
    </tr>`).join('') : '';

  const html = `
  <div style="font-family:'맑은 고딕',Arial,sans-serif;width:794px;padding:40px 56px;color:#222;font-size:12px;line-height:1.6">

    <!-- 표지 -->
    <div style="text-align:center;padding:40px 0 30px;border-bottom:3px solid #4f46e5;margin-bottom:28px">
      <div style="font-size:13px;color:#6b7280;margin-bottom:6px">명지전문대학 AI융합진로지원센터</div>
      <div style="font-size:26px;font-weight:900;color:#4f46e5;margin-bottom:6px">AI 기반 진로 포트폴리오</div>
      <div style="font-size:14px;color:#374151;margin-bottom:16px">개인 맞춤형 진로 설계 보고서</div>
      <table style="margin:0 auto;border-collapse:collapse;font-size:13px">
        <tr>
          <td style="padding:5px 12px;font-weight:700;color:#4f46e5">이름</td>
          <td style="padding:5px 12px">${stu?.name || '김민준'}</td>
          <td style="padding:5px 12px;font-weight:700;color:#4f46e5">학과</td>
          <td style="padding:5px 12px">${stu?.department || '스마트소프트웨어학과'}</td>
          <td style="padding:5px 12px;font-weight:700;color:#4f46e5">학년</td>
          <td style="padding:5px 12px">${stu?.grade || 2}학년</td>
        </tr>
      </table>
      <div style="font-size:11px;color:#9ca3af;margin-top:12px">출력일: ${today}</div>
    </div>

    <!-- 1. 자기분석 -->
    <div style="background:#f5f5f5;padding:9px 12px;font-size:14px;font-weight:800;color:#333;margin-bottom:10px;border-radius:4px">
      1. 자기분석 리포트
    </div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:8px;font-size:12px">
      <tr style="background:#f5f5f5">
        <th style="padding:7px 10px;text-align:left;width:20%;border:1px solid #e5e7eb;color:#333">MBTI</th>
        <td style="padding:7px 10px;border:1px solid #e5e7eb" colspan="3">ISTJ — ${d.self.mbtiSummary}</td>
      </tr>
      <tr>
        <th style="padding:7px 10px;text-align:left;background:#f5f5f5;border:1px solid #e5e7eb;color:#333">Holland코드</th>
        <td style="padding:7px 10px;border:1px solid #e5e7eb" colspan="3">RI (현실형·탐구형) — ${d.self.hollandSummary}</td>
      </tr>
    </table>
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:12px">
      <thead>
        <tr style="background:#333;color:#fff">
          <th style="padding:7px 10px;text-align:center;width:12%">구분</th>
          <th style="padding:7px 10px;text-align:left;width:22%">항목</th>
          <th style="padding:7px 10px;text-align:left">내용</th>
        </tr>
      </thead>
      <tbody>
        ${d.self.strengths.map((s, i) => `
          <tr style="background:${i%2===0?'#fff':'#f9fafb'}">
            ${i===0?`<td style="padding:7px 10px;text-align:center;font-weight:700;border-bottom:1px solid #f3f4f6;vertical-align:middle" rowspan="${d.self.strengths.length}">강점</td>`:''}
            <td style="padding:7px 10px;font-weight:700;border-bottom:1px solid #f3f4f6">${s.label}</td>
            <td style="padding:7px 10px;border-bottom:1px solid #f3f4f6">${s.desc}</td>
          </tr>`).join('')}
        ${d.self.weaknesses.map((w, i) => `
          <tr style="background:${i%2===0?'#fffbeb':'#fff8ed'}">
            ${i===0?`<td style="padding:7px 10px;text-align:center;font-weight:700;border-bottom:1px solid #f3f4f6;vertical-align:middle" rowspan="${d.self.weaknesses.length}">성장포인트</td>`:''}
            <td style="padding:7px 10px;font-weight:700;border-bottom:1px solid #f3f4f6">${w.label}</td>
            <td style="padding:7px 10px;border-bottom:1px solid #f3f4f6">${w.desc} / 실천팁: ${w.tip}</td>
          </tr>`).join('')}
      </tbody>
    </table>

    <!-- 2. 학과 분석 -->
    <div style="background:#f5f5f5;padding:9px 12px;font-size:14px;font-weight:800;color:#333;margin-bottom:10px;border-radius:4px">
      2. 학과 분석 &amp; 추천
    </div>
    <div style="margin-bottom:8px;font-size:12px;color:#374151;padding:8px 12px;background:#ecfdf5;border-radius:6px;border-left:3px solid #059669">
      직무 적합도 <strong>${d.major.fitScore}%</strong> — ${d.major.fitDesc}
    </div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:8px;font-size:12px">
      <thead>
        <tr style="background:#333;color:#fff">
          <th style="padding:7px 10px;text-align:left;width:25%">추천 과목</th>
          <th style="padding:7px 10px;text-align:left">추천 이유</th>
          <th style="padding:7px 10px;text-align:center;width:12%">구분</th>
        </tr>
      </thead>
      <tbody>
        ${d.major.recCourses.map((c, i) => `
          <tr style="background:${i%2===0?'#fff':'#f9fafb'}">
            <td style="padding:7px 10px;font-weight:700;border-bottom:1px solid #f3f4f6">${c.name}</td>
            <td style="padding:7px 10px;color:#6b7280;border-bottom:1px solid #f3f4f6">${c.reason}</td>
            <td style="padding:7px 10px;text-align:center;font-weight:700;border-bottom:1px solid #f3f4f6">${c.tag}</td>
          </tr>`).join('')}
      </tbody>
    </table>
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:12px">
      <thead>
        <tr style="background:#333;color:#fff">
          <th style="padding:7px 10px;text-align:left;width:35%">추천 자격증</th>
          <th style="padding:7px 10px;text-align:left">설명</th>
          <th style="padding:7px 10px;text-align:center;width:22%">목표 시기</th>
        </tr>
      </thead>
      <tbody>
        ${d.major.certs.map((c, i) => `
          <tr style="background:${i%2===0?'#fff':'#f9fafb'}">
            <td style="padding:7px 10px;font-weight:700;border-bottom:1px solid #f3f4f6">${c.name}</td>
            <td style="padding:7px 10px;color:#6b7280;border-bottom:1px solid #f3f4f6">${c.desc}</td>
            <td style="padding:7px 10px;text-align:center;border-bottom:1px solid #f3f4f6">${c.timeline}</td>
          </tr>`).join('')}
      </tbody>
    </table>

    <!-- 3. 진로 로드맵 -->
    <div style="background:#f5f5f5;padding:9px 12px;font-size:14px;font-weight:800;color:#333;margin-bottom:10px;border-radius:4px">
      3. 진로 로드맵
    </div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:12px">
      <thead>
        <tr style="background:#333;color:#fff">
          <th style="padding:7px 10px;text-align:left;width:30%">단계</th>
          <th style="padding:7px 10px;text-align:left">세부 실행 계획</th>
        </tr>
      </thead>
      <tbody>${roadmapRows}</tbody>
    </table>

    <!-- 4. 실행 계획 체크리스트 -->
    ${port ? `
    <div style="background:#f5f5f5;padding:9px 12px;font-size:14px;font-weight:800;color:#333;margin-bottom:10px;border-radius:4px">
      4. 실행 계획 체크리스트
    </div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:12px">
      <thead>
        <tr style="background:#333;color:#fff">
          <th style="padding:7px 10px;text-align:left;width:30%">활동명</th>
          <th style="padding:7px 10px;text-align:left">목표</th>
          <th style="padding:7px 10px;text-align:center;width:16%">일정</th>
          <th style="padding:7px 10px;text-align:center;width:12%">카테고리</th>
          <th style="padding:7px 10px;text-align:center;width:10%">완료</th>
        </tr>
      </thead>
      <tbody>${actionRows}</tbody>
    </table>` : ''}

    <!-- 서명란 -->
    <div style="border-top:2px solid #4f46e5;padding-top:16px;display:flex;justify-content:space-between;font-size:11px;color:#6b7280">
      <div style="text-align:center">
        <div style="margin-bottom:24px">학생 확인</div>
        <div>_________________ (서명)</div>
      </div>
      <div style="text-align:center">
        <div style="margin-bottom:24px">상담사 확인</div>
        <div>_________________ (서명)</div>
      </div>
      <div style="text-align:center">
        <div style="margin-bottom:24px">담당 교수 확인</div>
        <div>_________________ (서명)</div>
      </div>
      <div style="text-align:right;align-self:flex-end;font-size:11px;color:#9ca3af">
        명지전문대학 AI융합진로지원센터<br>발급일: ${today}
      </div>
    </div>
  </div>`;

  const el = document.createElement('div');
  el.innerHTML = html;
  document.body.appendChild(el);

  html2pdf().set({
    margin:       [15, 15, 15, 15],
    filename:     '진로포트폴리오_전체_' + (stu?.name || '학생') + '.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] },
  }).from(el.firstElementChild).save().then(() => {
    document.body.removeChild(el);
    showToast('전체 포트폴리오 PDF가 저장되었어요!', 'success');
  });
}

/* ==========================================================
   6. 취업준비 — 기초 데이터 수집
   ========================================================== */

/* --- 취업준비 입력 상태 --- */
const StuJob = {
  direction:    '',          // 취업 / 진학 / 창업 / 기타
  timing:       '',          // 희망 취업 시기
  timingEtc:    '',
  regions:      [],          // 희망 지역 (다중)
  jobTypes:     [],          // 희망 직종 (다중)
  jobEtc:       '',          // 기타 직종 직접 입력
  jobTags:      [],          // 희망 직무 키워드 태그
  salary:       '',          // 희망 급여
  certMajor:    [],          // 전공 자격증 태그
  oaLevel:      '',          // 컴퓨터활용능력 등급
  oaEtc:        [],          // OA 기타 체크박스
  license:      '',          // 운전면허
  toeic:        '',          // 토익 점수
  langEtc:      '',          // 기타 어학
  certOther:    [],          // 기타 자격증 태그
  cafeCounsel:  '',          // 잡카페 상담 희망
  natSupport:   '',          // 국민취업지원제도 연계 희망
  counselorMsg: '',          // 상담사에게 한마디
  aiShown:      false,       // AI 분석 결과 표시 여부
};

/* --- 학과별 관련 직종 --- */
const DEPT_JOBS = {
  '스마트소프트웨어학과': ['소프트웨어 개발자', '데이터 분석가', 'AI 엔지니어', '웹·앱 개발자', 'UI/UX 디자이너', 'IT 컨설턴트', '데이터베이스 관리자', '정보보안 전문가'],
  '경영학과':             ['경영기획', '마케터', '인사·노무', '재무·회계', '영업·영업관리', '유통·물류', '창업·스타트업', '컨설턴트'],
  '간호학과':             ['병원 간호사', '보건교사', '보건직 공무원', '의료 코디네이터', '상담 간호사', '연구 간호사'],
  default:                ['사무직', '영업·마케팅', '서비스업', '기술직', '연구개발', '공무원·공공기관', '교육·강사', '창업'],
};

/* --- 섹션 완료 여부 판별 --- */
function jobSecDone(sec) {
  const j = StuJob;
  switch (sec) {
    case 1: return !!j.direction;
    case 2: return j.direction !== '취업' || !!j.timing;
    case 3: return j.regions.length > 0;
    case 4: return j.jobTypes.length > 0 || !!j.jobEtc;
    case 5: return !!j.salary;
    case 6: return j.certMajor.length > 0 || !!j.oaLevel || !!j.toeic || j.certOther.length > 0;
    case 7: return !!j.cafeCounsel && !!j.natSupport;
    case 8: return !!j.counselorMsg;
    default: return false;
  }
}

/* --- 섹션 카드 공통 래퍼 --- */
function jobSecCard(num, icon, title, bodyHtml) {
  const done = jobSecDone(num);
  return `
    <div class="stu-animate" style="background:#fff;border-radius:16px;margin-bottom:14px;
      border:1.5px solid ${done ? '#c4b5fd' : '#e5e7eb'};overflow:hidden;
      box-shadow:${done ? '0 2px 12px rgba(124,58,237,.1)' : '0 2px 8px rgba(0,0,0,.05)'}">
      <!-- 섹션 헤더 -->
      <div style="display:flex;align-items:center;justify-content:space-between;
        padding:14px 18px;background:${done ? 'linear-gradient(135deg,#faf5ff,#fdf4ff)' : '#fafafa'};
        border-bottom:1px solid ${done ? '#e9d5ff' : '#f3f4f6'}">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:20px">${icon}</span>
          <span style="font-size:14px;font-weight:800;color:#1f2937">섹션 ${num}. ${title}</span>
        </div>
        ${done
          ? `<span style="background:#7c3aed;color:#fff;font-size:11px;font-weight:700;
              padding:3px 10px;border-radius:999px">✓ 완료</span>`
          : `<span style="background:#f3f4f6;color:#9ca3af;font-size:11px;font-weight:600;
              padding:3px 10px;border-radius:999px">미입력</span>`}
      </div>
      <!-- 섹션 본문 -->
      <div style="padding:16px 18px">${bodyHtml}</div>
    </div>`;
}

/* --- 선택 버튼 공통 스타일 --- */
function jobBtn(val, selected, onclick, label, sub='') {
  const on = selected;
  return `<button onclick="${onclick}"
    style="padding:${sub?'10px 14px':'9px 16px'};border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;
      border:2px solid ${on?'#7c3aed':'#e5e7eb'};
      background:${on?'linear-gradient(135deg,#7c3aed,#a78bfa)':'#fff'};
      color:${on?'#fff':'#374151'};
      transition:all .15s;text-align:left;line-height:1.4">
    ${label}${sub?`<div style="font-size:11px;opacity:.8;margin-top:2px;font-weight:500">${sub}</div>`:''}
  </button>`;
}

/* --- 태그 입력 공통 렌더 --- */
function jobTagHtml(tags, addFn, removeFn, placeholder, inputId) {
  return `
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px" id="${inputId}-tags">
      ${tags.map((t, i) => `
        <span style="background:linear-gradient(135deg,#ede9fe,#fdf4ff);color:#6d28d9;
          font-size:12px;font-weight:700;padding:4px 10px;border-radius:999px;
          display:flex;align-items:center;gap:4px;border:1px solid #ddd6fe">
          ${esc(t)}
          <button onclick="${removeFn}(${i})" style="background:none;border:none;cursor:pointer;
            color:#a78bfa;font-size:14px;line-height:1;padding:0 2px">&times;</button>
        </span>`).join('')}
    </div>
    <div style="display:flex;gap:6px">
      <input id="${inputId}" type="text" placeholder="${placeholder}"
        style="flex:1;border:1.5px solid #e9d5ff;border-radius:8px;padding:8px 12px;font-size:13px;outline:none"
        onkeydown="if(event.key==='Enter'){event.preventDefault();${addFn}()}">
      <button onclick="${addFn}()"
        style="background:linear-gradient(135deg,#7c3aed,#a78bfa);color:#fff;border:none;
          border-radius:8px;padding:8px 14px;font-size:13px;font-weight:700;cursor:pointer">추가</button>
    </div>`;
}

/* ========== 취업준비 메인 렌더 ========== */
function renderStudentJob() {
  const dept = USERS.student?.department || '';
  const deptJobs = DEPT_JOBS[dept] || DEPT_JOBS.default;
  const j = StuJob;

  /* ---- 섹션 1: 진로 방향 ---- */
  const sec1 = jobSecCard(1, '🧭', '진로 방향', `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      ${[
        { val:'취업',  icon:'💼', sub:'기업·공공기관 취업 목표' },
        { val:'진학',  icon:'🎓', sub:'대학원·편입·유학 목표' },
        { val:'창업',  icon:'🚀', sub:'나만의 사업을 시작할 계획' },
        { val:'기타',  icon:'💡', sub:'아직 고민 중이에요' },
      ].map(d => jobBtn(d.val, j.direction===d.val,
        `stuJobSetDir('${d.val}')`,
        `${d.icon} ${d.val}`, d.sub)).join('')}
    </div>`);

  /* ---- 섹션 2: 취업 희망 시기 (취업 선택 시만) ---- */
  const sec2 = j.direction !== '취업' ? '' : jobSecCard(2, '📅', '취업 희망 시기', `
    <div style="display:flex;flex-direction:column;gap:8px">
      ${[
        '졸업 후 3개월 이내',
        '졸업 후 6개월 이내',
        '졸업 후 1년 이내',
        '재학 중 취업 희망',
      ].map(v => `
        <div onclick="stuJobSetTiming('${v}')"
          style="display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:10px;cursor:pointer;
            border:2px solid ${j.timing===v?'#7c3aed':'#e5e7eb'};
            background:${j.timing===v?'linear-gradient(135deg,#faf5ff,#ede9fe)':'#fff'}">
          <div style="width:18px;height:18px;border-radius:50%;border:2px solid ${j.timing===v?'#7c3aed':'#d1d5db'};
            background:${j.timing===v?'#7c3aed':'#fff'};flex-shrink:0;display:flex;align-items:center;justify-content:center">
            ${j.timing===v?'<div style="width:7px;height:7px;background:#fff;border-radius:50%"></div>':''}
          </div>
          <span style="font-size:13px;font-weight:${j.timing===v?'800':'600'};color:${j.timing===v?'#6d28d9':'#374151'}">${v}</span>
        </div>`).join('')}
      <!-- 기타 직접 입력 -->
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <div onclick="stuJobSetTiming('기타')"
          style="display:flex;align-items:center;gap:10px;cursor:pointer">
          <div style="width:18px;height:18px;border-radius:50%;border:2px solid ${j.timing==='기타'?'#7c3aed':'#d1d5db'};
            background:${j.timing==='기타'?'#7c3aed':'#fff'};flex-shrink:0;display:flex;align-items:center;justify-content:center">
            ${j.timing==='기타'?'<div style="width:7px;height:7px;background:#fff;border-radius:50%"></div>':''}
          </div>
          <span style="font-size:13px;font-weight:${j.timing==='기타'?'800':'600'};color:${j.timing==='기타'?'#6d28d9':'#374151'}">기타</span>
        </div>
        ${j.timing==='기타'?`
          <input id="job-timing-etc" type="text" value="${esc(j.timingEtc)}"
            placeholder="직접 입력" onchange="StuJob.timingEtc=this.value"
            style="flex:1;min-width:120px;border:1.5px solid #e9d5ff;border-radius:8px;
              padding:7px 10px;font-size:13px;outline:none">`:''
        }
      </div>
    </div>`);

  /* ---- 섹션 3: 희망 지역 ---- */
  const regions = ['서울','인천','경기','충청','경상','전라','강원','제주','해외','무관'];
  const sec3 = jobSecCard(3, '📍', '희망 지역 (다중 선택)', `
    <div style="display:flex;flex-wrap:wrap;gap:8px">
      ${regions.map(r => {
        const on = j.regions.includes(r);
        return `<button onclick="stuJobToggleRegion('${r}')"
          style="padding:8px 16px;border-radius:999px;font-size:13px;font-weight:700;cursor:pointer;
            border:2px solid ${on?'#7c3aed':'#e5e7eb'};
            background:${on?'linear-gradient(135deg,#7c3aed,#a78bfa)':'#fff'};
            color:${on?'#fff':'#374151'}">
          ${r}
        </button>`;
      }).join('')}
    </div>
    ${j.regions.length>0?`<div style="margin-top:10px;font-size:12px;color:#7c3aed;font-weight:600">
      선택: ${j.regions.join(' · ')}</div>`:''}
  `);

  /* ---- 섹션 4: 희망 직업·직종 ---- */
  const sec4 = jobSecCard(4, '🎯', '희망 직업·직종', `
    <div style="font-size:12px;color:#6b7280;margin-bottom:10px">전공 관련 직종 (다중 선택)</div>
    <div style="display:flex;flex-wrap:wrap;gap:7px;margin-bottom:14px">
      ${deptJobs.map(jb => {
        const on = j.jobTypes.includes(jb);
        return `<button onclick="stuJobToggleJob('${jb}')"
          style="padding:7px 14px;border-radius:999px;font-size:12px;font-weight:700;cursor:pointer;
            border:2px solid ${on?'#7c3aed':'#e5e7eb'};
            background:${on?'linear-gradient(135deg,#7c3aed,#a78bfa)':'#fff'};
            color:${on?'#fff':'#374151'}">${jb}</button>`;
      }).join('')}
    </div>
    <div style="font-size:12px;color:#6b7280;margin-bottom:6px">기타 직종 직접 입력</div>
    <div style="display:flex;gap:6px;margin-bottom:14px">
      <input id="job-etc-input" type="text" value="${esc(j.jobEtc)}"
        placeholder="예: 프리랜서 작가"
        style="flex:1;border:1.5px solid #e9d5ff;border-radius:8px;padding:8px 12px;font-size:13px;outline:none"
        onchange="StuJob.jobEtc=this.value">
    </div>
    <div style="font-size:12px;color:#6b7280;margin-bottom:6px">희망 직무 키워드 태그</div>
    ${jobTagHtml(j.jobTags, 'stuJobAddTag', 'stuJobRemoveTag', '예: 데이터 분석, 기획, 마케팅', 'job-tag-input')}
  `);

  /* ---- 섹션 5: 희망 급여 ---- */
  const salaries = ['2,400만원 미만','2,400~3,000만원','3,000~3,500만원','3,500만원 이상','무관'];
  const sec5 = jobSecCard(5, '💰', '희망 급여', `
    <div style="display:flex;flex-wrap:wrap;gap:8px">
      ${salaries.map(s => {
        const on = j.salary === s;
        return `<button onclick="stuJobSetSalary('${s}')"
          style="padding:10px 16px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;
            border:2px solid ${on?'#7c3aed':'#e5e7eb'};
            background:${on?'linear-gradient(135deg,#7c3aed,#a78bfa)':'#fff'};
            color:${on?'#fff':'#374151'}">${s}</button>`;
      }).join('')}
    </div>`);

  /* ---- 섹션 6: 자격증 보유 현황 ---- */
  const sec6 = jobSecCard(6, '🏅', '자격증 보유 현황', `
    <!-- 전공 자격증 -->
    <div style="font-size:12px;font-weight:700;color:#374151;margin-bottom:6px">전공 자격증</div>
    ${jobTagHtml(j.certMajor, 'stuJobAddCertMajor', 'stuJobRemoveCertMajor', '예: 정보처리기사, ADsP', 'cert-major-input')}

    <!-- OA 능력 -->
    <div style="font-size:12px;font-weight:700;color:#374151;margin:14px 0 8px">OA 능력</div>
    <div style="margin-bottom:8px">
      <div style="font-size:11px;color:#6b7280;margin-bottom:6px">컴퓨터활용능력</div>
      <div style="display:flex;gap:7px;flex-wrap:wrap">
        ${['1급','2급','없음'].map(v => {
          const on = j.oaLevel === v;
          return `<button onclick="stuJobSetOa('${v}')"
            style="padding:7px 16px;border-radius:999px;font-size:12px;font-weight:700;cursor:pointer;
              border:2px solid ${on?'#7c3aed':'#e5e7eb'};
              background:${on?'linear-gradient(135deg,#7c3aed,#a78bfa)':'#fff'};
              color:${on?'#fff':'#374151'}">컴활 ${v}</button>`;
        }).join('')}
      </div>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px">
      ${['워드프로세서','ITQ','MOS'].map(v => {
        const on = j.oaEtc.includes(v);
        return `<label style="display:flex;align-items:center;gap:6px;cursor:pointer;
          padding:6px 12px;border-radius:8px;border:1.5px solid ${on?'#c4b5fd':'#e5e7eb'};
          background:${on?'#faf5ff':'#fff'};font-size:12px;font-weight:600;color:${on?'#6d28d9':'#374151'}">
          <input type="checkbox" ${on?'checked':''} onchange="stuJobToggleOaEtc('${v}')"
            style="accent-color:#7c3aed">${v}
        </label>`;
      }).join('')}
    </div>

    <!-- 운전면허 -->
    <div style="font-size:12px;font-weight:700;color:#374151;margin-bottom:8px">운전면허</div>
    <div style="display:flex;gap:7px;margin-bottom:14px">
      ${['1종','2종','없음'].map(v => {
        const on = j.license === v;
        return `<button onclick="stuJobSetLicense('${v}')"
          style="padding:7px 18px;border-radius:999px;font-size:12px;font-weight:700;cursor:pointer;
            border:2px solid ${on?'#7c3aed':'#e5e7eb'};
            background:${on?'linear-gradient(135deg,#7c3aed,#a78bfa)':'#fff'};
            color:${on?'#fff':'#374151'}">${v}</button>`;
      }).join('')}
    </div>

    <!-- 어학 -->
    <div style="font-size:12px;font-weight:700;color:#374151;margin-bottom:8px">어학</div>
    <div style="display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap">
      <div style="display:flex;align-items:center;gap:6px;background:#f9fafb;
        border-radius:8px;padding:6px 12px;border:1.5px solid #e9d5ff">
        <span style="font-size:12px;font-weight:700;color:#374151;white-space:nowrap">TOEIC</span>
        <input id="job-toeic" type="number" min="0" max="990" value="${esc(j.toeic)}"
          placeholder="점수 입력"
          onchange="StuJob.toeic=this.value"
          style="width:90px;border:none;background:transparent;font-size:13px;outline:none;font-weight:600">
        <span style="font-size:12px;color:#9ca3af">점</span>
      </div>
      <input id="job-lang-etc" type="text" value="${esc(j.langEtc)}"
        placeholder="기타 어학 (예: JPT 600점)"
        onchange="StuJob.langEtc=this.value"
        style="flex:1;min-width:140px;border:1.5px solid #e9d5ff;border-radius:8px;
          padding:8px 12px;font-size:13px;outline:none">
    </div>

    <!-- 기타 자격증 -->
    <div style="font-size:12px;font-weight:700;color:#374151;margin:14px 0 6px">기타 자격증</div>
    ${jobTagHtml(j.certOther, 'stuJobAddCertOther', 'stuJobRemoveCertOther', '예: 한국사 1급, 바리스타 2급', 'cert-other-input')}
  `);

  /* ---- 섹션 7: 학교·국가 지원 서비스 ---- */
  const natNotice = (j.natSupport === '예' || j.natSupport === '잘 모르겠음') ? `
    <div style="margin-top:12px;background:linear-gradient(135deg,#fdf2f8,#faf5ff);
      border:1.5px solid #f9a8d4;border-radius:10px;padding:14px 16px">
      <div style="font-size:12px;font-weight:800;color:#be185d;margin-bottom:6px">📋 국민취업지원제도 안내</div>
      <div style="font-size:12px;color:#374151;line-height:1.7">
        구직촉진수당 <strong>월 60만원 × 6개월</strong> 지원<br>
        <span style="color:#9ca3af">(1유형 기준 / 유형에 따라 지원 내용이 달라질 수 있으며,<br>
        자세한 사항은 상담사 선생님을 통해 확인하세요)</span>
      </div>
    </div>` : '';

  const sec7 = jobSecCard(7, '🏫', '학교·국가 지원 서비스', `
    <div style="margin-bottom:16px">
      <div style="font-size:13px;font-weight:700;color:#374151;margin-bottom:8px">
        잡카페 컨설턴트 상담 희망 여부
      </div>
      <div style="display:flex;gap:8px">
        ${['예','아니오'].map(v => {
          const on = j.cafeCounsel === v;
          return `<button onclick="stuJobSetCafe('${v}')"
            style="flex:1;padding:10px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;
              border:2px solid ${on?'#7c3aed':'#e5e7eb'};
              background:${on?'linear-gradient(135deg,#7c3aed,#a78bfa)':'#fff'};
              color:${on?'#fff':'#374151'}">${v}</button>`;
        }).join('')}
      </div>
    </div>
    <div>
      <div style="font-size:13px;font-weight:700;color:#374151;margin-bottom:8px">
        국민취업지원제도 연계 희망 여부
      </div>
      <div style="display:flex;gap:8px">
        ${['예','아니오','잘 모르겠음'].map(v => {
          const on = j.natSupport === v;
          return `<button onclick="stuJobSetNat('${v}')"
            style="flex:1;padding:10px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;
              border:2px solid ${on?'#7c3aed':'#e5e7eb'};
              background:${on?'linear-gradient(135deg,#7c3aed,#a78bfa)':'#fff'};
              color:${on?'#fff':'#374151'}">${v}</button>`;
        }).join('')}
      </div>
      ${natNotice}
    </div>`);

  /* ---- 섹션 8: 상담사에게 한마디 ---- */
  const sec8 = jobSecCard(8, '💬', '상담사에게 한마디', `
    <textarea id="job-counsel-msg"
      placeholder="상담 선생님께 전하고 싶은 말을 자유롭게 적어주세요"
      oninput="StuJob.counselorMsg=this.value;stuJobUpdateSec8()"
      style="width:100%;min-height:100px;border:1.5px solid #e9d5ff;border-radius:10px;
        padding:12px 14px;font-size:13px;line-height:1.6;resize:vertical;outline:none;
        font-family:inherit;color:#374151;box-sizing:border-box">${esc(j.counselorMsg)}</textarea>
    <div style="text-align:right;font-size:11px;color:#9ca3af;margin-top:4px" id="job-msg-count">
      ${j.counselorMsg.length}자 입력됨
    </div>`);

  /* ---- 진행도 요약 배너 ---- */
  const doneCount = [1,2,3,4,5,6,7,8].filter(n => jobSecDone(n)).length;
  const totalSec  = j.direction === '취업' ? 8 : 7;
  const pct = Math.round((doneCount / totalSec) * 100);

  document.getElementById('app-content').innerHTML = `
  <div class="stu-job-wrap" style="padding-bottom:40px">
    ${stuBack('stu-home')}

    <!-- 진행도 배너 -->
    <div class="stu-animate" style="background:linear-gradient(135deg,#7c3aed,#ec4899);
      border-radius:16px;padding:20px 22px;color:#fff;margin-bottom:20px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:15px;font-weight:800">📝 취업 기초 정보 입력</div>
        <div style="font-size:18px;font-weight:900">${pct}%</div>
      </div>
      <div style="background:rgba(255,255,255,.25);border-radius:999px;height:8px;overflow:hidden">
        <div style="background:#fff;height:100%;border-radius:999px;width:${pct}%;transition:width .4s"></div>
      </div>
      <div style="font-size:12px;opacity:.8;margin-top:8px">
        ${doneCount}개 섹션 완료 · ${totalSec - doneCount}개 남음
      </div>
    </div>

    ${sec1}
    ${sec2}
    ${sec3}
    ${sec4}
    ${sec5}
    ${sec6}
    ${sec7}
    ${sec8}

    <!-- AI 취업 로드맵 생성 버튼 -->
    <button id="job-ai-btn" onclick="stuJobAiAnalyze()"
      style="width:100%;padding:18px;border-radius:16px;border:none;cursor:pointer;
        background:linear-gradient(135deg,#7c3aed,#ec4899);color:#fff;
        font-size:16px;font-weight:800;display:flex;align-items:center;justify-content:center;gap:10px;
        box-shadow:0 4px 16px rgba(124,58,237,.35);margin-bottom:16px">
      <span style="font-size:22px">🤖</span>
      AI 취업 로드맵 생성하기
      <span style="font-size:12px;font-weight:500;opacity:.85">추천 직무·준비 일정·전략 자동 생성</span>
    </button>

    <!-- AI 분석 결과 영역 -->
    <div id="job-ai-result" style="display:none"></div>

  </div>`;
  setStuTitle('취업준비', '취업 기초 정보 입력');
}

/* ---- 섹션 이벤트 핸들러 ---- */
function stuJobSetDir(val) {
  StuJob.direction = val;
  renderStudentJob();
}
function stuJobSetTiming(val) {
  StuJob.timing = val;
  renderStudentJob();
}
function stuJobToggleRegion(val) {
  const i = StuJob.regions.indexOf(val);
  if (i >= 0) StuJob.regions.splice(i, 1);
  else StuJob.regions.push(val);
  renderStudentJob();
}
function stuJobToggleJob(val) {
  const i = StuJob.jobTypes.indexOf(val);
  if (i >= 0) StuJob.jobTypes.splice(i, 1);
  else StuJob.jobTypes.push(val);
  renderStudentJob();
}
function stuJobAddTag() {
  const el = document.getElementById('job-tag-input');
  const v  = el?.value.trim();
  if (v && !StuJob.jobTags.includes(v)) { StuJob.jobTags.push(v); renderStudentJob(); }
  else if (el) el.value = '';
}
function stuJobRemoveTag(i) {
  StuJob.jobTags.splice(i, 1);
  renderStudentJob();
}
function stuJobSetSalary(val) {
  StuJob.salary = val;
  renderStudentJob();
}
function stuJobAddCertMajor() {
  const el = document.getElementById('cert-major-input');
  const v  = el?.value.trim();
  if (v && !StuJob.certMajor.includes(v)) { StuJob.certMajor.push(v); renderStudentJob(); }
  else if (el) el.value = '';
}
function stuJobRemoveCertMajor(i) {
  StuJob.certMajor.splice(i, 1);
  renderStudentJob();
}
function stuJobSetOa(val) {
  StuJob.oaLevel = val;
  renderStudentJob();
}
function stuJobToggleOaEtc(val) {
  const i = StuJob.oaEtc.indexOf(val);
  if (i >= 0) StuJob.oaEtc.splice(i, 1);
  else StuJob.oaEtc.push(val);
  renderStudentJob();
}
function stuJobSetLicense(val) {
  StuJob.license = val;
  renderStudentJob();
}
function stuJobAddCertOther() {
  const el = document.getElementById('cert-other-input');
  const v  = el?.value.trim();
  if (v && !StuJob.certOther.includes(v)) { StuJob.certOther.push(v); renderStudentJob(); }
  else if (el) el.value = '';
}
function stuJobRemoveCertOther(i) {
  StuJob.certOther.splice(i, 1);
  renderStudentJob();
}
function stuJobSetCafe(val) {
  StuJob.cafeCounsel = val;
  renderStudentJob();
}
function stuJobSetNat(val) {
  StuJob.natSupport = val;
  renderStudentJob();
}
function stuJobUpdateSec8() {
  const cnt = document.getElementById('job-msg-count');
  if (cnt) cnt.textContent = StuJob.counselorMsg.length + '자 입력됨';
}

/* ---- AI 취업 로드맵 분석 ---- */
function stuJobAiAnalyze() {
  const btn  = document.getElementById('job-ai-btn');
  const area = document.getElementById('job-ai-result');
  if (!btn || !area) return;

  btn.disabled = true;
  btn.innerHTML = `
    <div class="spinner" style="width:20px;height:20px;border-color:rgba(255,255,255,.3);border-top-color:#fff;margin-right:10px"></div>
    AI가 분석하고 있어요...`;

  area.style.display = 'block';
  area.innerHTML = `
    <div style="background:linear-gradient(135deg,#faf5ff,#fdf2f8);border:1.5px solid #e9d5ff;
      border-radius:16px;padding:28px;text-align:center;margin-bottom:16px">
      <div style="font-size:36px;margin-bottom:10px">🤖</div>
      <div style="font-weight:800;font-size:15px;color:#6d28d9;margin-bottom:6px">AI 취업 로드맵 생성 중</div>
      <div style="font-size:13px;color:#9ca3af;margin-bottom:16px">입력하신 정보를 분석하고 있어요</div>
      <div style="display:flex;flex-direction:column;gap:6px;max-width:220px;margin:0 auto">
        ${['추천 직무 분석 중...','취업 준비 일정 생성 중...','맞춤 전략 최적화 중...'].map(t => `
          <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:#a78bfa;font-weight:600">
            <div class="spinner" style="width:12px;height:12px;border-color:rgba(167,139,250,.3);border-top-color:#a78bfa;flex-shrink:0"></div>
            ${t}
          </div>`).join('')}
      </div>
    </div>`;

  setTimeout(() => {
    StuJob.aiShown = true;
    btn.innerHTML = `<span style="font-size:18px">✅</span> AI 취업 로드맵 생성 완료!`;
    btn.style.background = 'linear-gradient(135deg,#059669,#0891b2)';
    btn.disabled = true;
    stuJobRenderAiResult(area);
  }, 2400);
}

function stuJobRenderAiResult(area) {
  const j = StuJob;
  const directionLabel = j.direction || '취업';
  const regionLabel    = j.regions.length ? j.regions.join(', ') : '무관';
  const salaryLabel    = j.salary || '무관';

  area.innerHTML = `
    <!-- 추천 직무 3가지 -->
    <div style="background:#fff;border-radius:16px;border:1.5px solid #c4b5fd;
      overflow:hidden;margin-bottom:14px">
      <div style="background:linear-gradient(135deg,#faf5ff,#fdf4ff);padding:14px 18px;
        font-size:14px;font-weight:800;color:#6d28d9;border-bottom:1px solid #e9d5ff">
        🎯 추천 직무 3가지
      </div>
      <div style="padding:16px 18px;display:flex;flex-direction:column;gap:10px">
        ${[
          { rank:'1순위', job:'데이터 분석가', fit:'95%', reason:'전공 일치도 최상, 흥미코드(RI)와 딱 맞아요', color:'#7c3aed' },
          { rank:'2순위', job:'AI 엔지니어',  fit:'88%', reason:'소프트웨어 역량과 AI 트렌드 연계 가능', color:'#0891b2' },
          { rank:'3순위', job:'IT 컨설턴트',  fit:'80%', reason:'분석적 사고 + 커뮤니케이션 강점 활용', color:'#059669' },
        ].map(d => `
          <div style="display:flex;align-items:flex-start;gap:12px;padding:12px 14px;
            background:linear-gradient(135deg,${d.color}0d,${d.color}05);
            border-radius:10px;border-left:4px solid ${d.color}">
            <div style="flex-shrink:0;text-align:center">
              <div style="font-size:11px;font-weight:700;color:${d.color}">${d.rank}</div>
              <div style="font-size:18px;font-weight:900;color:${d.color}">${d.fit}</div>
            </div>
            <div>
              <div style="font-size:14px;font-weight:800;color:#1f2937">${d.job}</div>
              <div style="font-size:12px;color:#6b7280;margin-top:2px">${d.reason}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>

    <!-- 취업 준비 일정 (월별) -->
    <div style="background:#fff;border-radius:16px;border:1.5px solid #c4b5fd;
      overflow:hidden;margin-bottom:14px">
      <div style="background:linear-gradient(135deg,#faf5ff,#fdf4ff);padding:14px 18px;
        font-size:14px;font-weight:800;color:#6d28d9;border-bottom:1px solid #e9d5ff">
        📅 취업 준비 일정 (월별 로드맵)
      </div>
      <div style="padding:16px 18px">
        ${[
          { month:'2026년 5~6월', icon:'🌱', tasks:['ADsP 자격증 시험 등록 및 준비','파이썬 기초 온라인 강의 수강','진로 상담 1회 예약'], color:'#4f46e5' },
          { month:'2026년 7~8월', icon:'🚀', tasks:['ADsP 자격증 취득 목표','깃허브 포트폴리오 기초 정리','인턴십 공고 모니터링 시작'], color:'#0891b2' },
          { month:'2026년 9~10월',icon:'🏆', tasks:['캡스톤디자인 주제 확정','이력서 초안 작성','AI 취업캠프 참가'], color:'#059669' },
          { month:'2026년 11월~', icon:'💼', tasks:['자기소개서 작성 완료','채용공고 지원 시작 (3곳 이상)','모의 면접 훈련'], color:'#ec4899' },
        ].map(m => `
          <div style="display:flex;gap:12px;margin-bottom:12px">
            <div style="flex-shrink:0;width:100px;padding-top:2px">
              <div style="font-size:11px;font-weight:700;color:${m.color}">${m.icon} ${m.month}</div>
            </div>
            <div style="flex:1;border-left:2px solid ${m.color}20;padding-left:12px">
              ${m.tasks.map(t => `
                <div style="font-size:12px;color:#374151;margin-bottom:4px;display:flex;gap:6px">
                  <span style="color:${m.color}">•</span>${t}
                </div>`).join('')}
            </div>
          </div>`).join('')}
      </div>
    </div>

    <!-- 추천 자격증 -->
    <div style="background:#fff;border-radius:16px;border:1.5px solid #c4b5fd;
      overflow:hidden;margin-bottom:14px">
      <div style="background:linear-gradient(135deg,#faf5ff,#fdf4ff);padding:14px 18px;
        font-size:14px;font-weight:800;color:#6d28d9;border-bottom:1px solid #e9d5ff">
        🏅 추천 자격증
      </div>
      <div style="padding:16px 18px;display:flex;flex-direction:column;gap:8px">
        ${[
          { name:'데이터분석준전문가(ADsP)',  timing:'2026 하반기', priority:'높음', reason:'데이터 직무 입문, 학부생 합격률 높음' },
          { name:'SQL개발자(SQLD)',            timing:'2027 상반기', priority:'중간', reason:'데이터베이스 실무역량 증명' },
          { name:'정보처리기사',               timing:'졸업 전',     priority:'중간', reason:'IT 직무 전반 기본 자격' },
        ].map((c, i) => `
          <div style="display:flex;align-items:flex-start;justify-content:space-between;
            padding:10px 12px;background:${i%2===0?'#faf5ff':'#fff'};border-radius:8px;
            border:1px solid #e9d5ff">
            <div>
              <div style="font-size:13px;font-weight:800;color:#1f2937">${c.name}</div>
              <div style="font-size:12px;color:#6b7280;margin-top:2px">${c.reason}</div>
            </div>
            <div style="text-align:right;flex-shrink:0;margin-left:10px">
              <div style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;margin-bottom:3px;
                background:${c.priority==='높음'?'#fef2f2':'#fff7ed'};
                color:${c.priority==='높음'?'#dc2626':'#d97706'}">${c.priority}</div>
              <div style="font-size:11px;color:#9ca3af">${c.timing}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>

    <!-- 맞춤 취업 전략 -->
    <div style="background:linear-gradient(135deg,#fdf2f8,#faf5ff);border-radius:16px;
      border:1.5px solid #f9a8d4;padding:18px 20px;margin-bottom:8px">
      <div style="font-size:14px;font-weight:800;color:#be185d;margin-bottom:12px">
        💡 나를 위한 맞춤 취업 전략
      </div>
      ${[
        { icon:'📊', title:'포트폴리오 우선',  desc:`데이터 분석직은 실력 증명이 핵심이에요. 깃허브에 분석 프로젝트 2~3개를 쌓으면 서류 통과율이 크게 높아져요.` },
        { icon:'📍', title:`${regionLabel} 집중 공략`, desc:`선택하신 지역 기업들의 채용 주기를 미리 파악해두면 좋아요. 상하반기 공채 시즌을 노리세요.` },
        { icon:'💰', title:`연봉 ${salaryLabel} 목표 달성`, desc:`신입 기준 적정 수준이에요. 자격증 + 인턴십 경험이 있으면 협상 여지가 생겨요.` },
        { icon:'🤝', title:'잡카페·국가 지원 적극 활용', desc:`잡카페 컨설턴트 상담과 국민취업지원제도를 연계하면 취업 준비 비용 부담을 줄일 수 있어요.` },
      ].map(s => `
        <div style="display:flex;gap:10px;margin-bottom:10px">
          <span style="font-size:18px;flex-shrink:0">${s.icon}</span>
          <div>
            <div style="font-size:13px;font-weight:800;color:#1f2937">${s.title}</div>
            <div style="font-size:12px;color:#6b7280;margin-top:2px;line-height:1.6">${s.desc}</div>
          </div>
        </div>`).join('')}
    </div>
  `;
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
