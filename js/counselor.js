/* ==========================================================
   counselor.js — 상담사 화면 (학생 목록 + 9개 탭 상세)
   ========================================================== */

/* ----------------------------------------------------------
   학생 목록
---------------------------------------------------------- */
function renderCounselorList() {
  const el = document.getElementById('app-content');
  el.classList.remove('has-sidebar');

  const statusOpts = ['전체', '일반', '주의', '고위험군'];
  const stageOpts  = ['전체', '초기상담', '진단검사', '활동관리', '포트폴리오', '취업준비'];

  // 고위험군 카운트
  const riskCount    = STUDENTS.filter(s => s.overallStatus === '고위험군').length;
  const warningCount = STUDENTS.filter(s => s.overallStatus === '주의').length;

  el.innerHTML = `
    <div style="padding:28px 32px">

      <!-- 상단 타이틀 + 통계 -->
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:16px">
        <div>
          <h2 style="font-size:22px;font-weight:900;color:#111827;margin:0">담당 학생 목록</h2>
          <p style="font-size:13px;color:#6b7280;margin:4px 0 0">이상담 상담사 담당 · 총 ${STUDENTS.length}명</p>
        </div>
        <div style="display:flex;gap:12px">
          <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:12px;padding:12px 20px;text-align:center">
            <div style="font-size:22px;font-weight:900;color:#d97706">${warningCount}</div>
            <div style="font-size:11px;color:#92400e;font-weight:600">주의 학생</div>
          </div>
          <div style="background:#fee2e2;border:1px solid #fca5a5;border-radius:12px;padding:12px 20px;text-align:center">
            <div style="font-size:22px;font-weight:900;color:#dc2626">${riskCount}</div>
            <div style="font-size:11px;color:#991b1b;font-weight:600">고위험군</div>
          </div>
        </div>
      </div>

      <!-- 검색 + 필터 -->
      <div style="display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap">
        <div class="search-bar" style="flex:1;min-width:220px">
          <span class="search-icon">🔍</span>
          <input id="cou-search" class="search-input" placeholder="이름·학번·학과 검색..."
            oninput="filterStudentList()" style="width:100%">
        </div>
        <select id="cou-filter-status" onchange="filterStudentList()"
          style="border:1px solid #e5e7eb;border-radius:8px;padding:0 12px;font-size:13px;height:40px;color:#374151">
          ${statusOpts.map(s => `<option value="${s}">${s}</option>`).join('')}
        </select>
        <select id="cou-filter-stage" onchange="filterStudentList()"
          style="border:1px solid #e5e7eb;border-radius:8px;padding:0 12px;font-size:13px;height:40px;color:#374151">
          ${stageOpts.map(s => `<option value="${s}">${s}</option>`).join('')}
        </select>
      </div>

      <!-- 학생 카드 목록 -->
      <div id="student-card-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px">
        ${STUDENTS.map(s => renderStudentCard(s)).join('')}
      </div>
    </div>`;
}

function renderStudentCard(s) {
  const statusColor = { '일반': '#059669', '주의': '#d97706', '고위험군': '#dc2626' }[s.overallStatus] || '#6b7280';
  const isRisk = s.overallStatus === '고위험군';
  return `
    <div onclick="navigate('cou-detail',{studentId:'${s.id}',tab:'summary'})"
      style="background:#fff;border:1.5px solid ${isRisk ? '#fca5a5' : '#e5e7eb'};border-radius:16px;
        padding:20px;cursor:pointer;transition:all .15s;box-shadow:0 1px 4px rgba(0,0,0,.06)"
      onmouseover="this.style.borderColor='#6366f1';this.style.boxShadow='0 4px 16px rgba(99,102,241,.15)'"
      onmouseout="this.style.borderColor='${isRisk ? '#fca5a5' : '#e5e7eb'}';this.style.boxShadow='0 1px 4px rgba(0,0,0,.06)'">

      <!-- 학생 정보 헤더 -->
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
        <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);
          display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:18px;flex-shrink:0">
          ${s.name[0]}
        </div>
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span style="font-weight:800;font-size:16px;color:#111827">${esc(s.name)}</span>
            <span class="badge ${statusBadgeClass(s.overallStatus)}">${s.overallStatus}</span>
          </div>
          <div style="font-size:12px;color:#6b7280;margin-top:2px">${esc(s.studentId)} · ${esc(s.department)} ${s.grade}학년</div>
        </div>
        <span class="badge ${stageBadgeClass(s.currentStage)}" style="flex-shrink:0">${stageLabel(s.currentStage)}</span>
      </div>

      <!-- 진행도 -->
      <div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:#6b7280;margin-bottom:5px">
          <span>포트폴리오 진행도</span>
          <span style="font-weight:700;color:#374151">${s.progressPct}%</span>
        </div>
        <div style="background:#f3f4f6;border-radius:99px;height:7px">
          <div style="background:linear-gradient(90deg,#6366f1,#8b5cf6);height:7px;border-radius:99px;width:${s.progressPct}%"></div>
        </div>
      </div>

      <!-- 하단 정보 -->
      <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;color:#9ca3af">
        <span>🎯 ${esc(s.desiredJob || '미정')}</span>
        <span>최근 상담 ${fmtDate(s.lastDate)}</span>
      </div>

      ${s.memo ? `<div style="margin-top:10px;font-size:12px;color:#6b7280;background:#f9fafb;border-radius:8px;padding:8px 10px;border-left:3px solid ${statusColor}">
        ${esc(s.memo)}
      </div>` : ''}
    </div>`;
}

function filterStudentList() {
  const q      = document.getElementById('cou-search').value.toLowerCase();
  const status = document.getElementById('cou-filter-status').value;
  const stage  = document.getElementById('cou-filter-stage').value;
  const grid   = document.getElementById('student-card-grid');
  if (!grid) return;

  const filtered = STUDENTS.filter(s => {
    const matchQ = !q || s.name.toLowerCase().includes(q) ||
                   s.studentId.includes(q) || s.department.toLowerCase().includes(q);
    const matchStatus = status === '전체' || s.overallStatus === status;
    const matchStage  = stage  === '전체' || s.currentStage  === stage;
    return matchQ && matchStatus && matchStage;
  });

  grid.innerHTML = filtered.length
    ? filtered.map(s => renderStudentCard(s)).join('')
    : `<div class="empty-state" style="grid-column:1/-1;padding:60px 0">
        <div class="empty-icon">🔍</div>
        <div class="empty-title">검색 결과가 없습니다</div>
       </div>`;
}

/* ----------------------------------------------------------
   학생 상세 (탭 라우터)
---------------------------------------------------------- */
function renderCounselorDetail(tab) {
  State.currentTab = tab || 'summary';
  document.getElementById('app-content').classList.add('has-sidebar');
  renderSidebar(); // 탭 전환 시 사이드바 재렌더

  switch (State.currentTab) {
    case 'summary':    renderTabSummary();    break;
    case 'initial':    renderTabInitial();    break;
    case 'diagnosis':  renderTabDiagnosis();  break;
    case 'activities': renderTabActivities(); break;
    case 'academic':   renderTabAcademic();   break;
    case 'portfolio':  renderTabPortfolio();  break;
    case 'logs':       renderTabLogs();       break;
    case 'employment': renderTabEmployment(); break;
    case 'ai':         renderTabAI();         break;
    default:           renderTabSummary();
  }
}

/* ── 공통: 탭 콘텐츠 컨테이너 ─────────────────────────────── */
function tabWrap(html) {
  document.getElementById('app-content').innerHTML =
    `<div style="padding:28px 32px;max-width:1100px">${html}</div>`;
}

function tabHeader(icon, title, subtitle, actionHtml = '') {
  return `
    <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:12px">
      <div>
        <h3 style="font-size:20px;font-weight:900;color:#111827;margin:0">${icon} ${title}</h3>
        ${subtitle ? `<p style="font-size:13px;color:#6b7280;margin:4px 0 0">${subtitle}</p>` : ''}
      </div>
      <div style="display:flex;gap:8px;align-items:center">${actionHtml}</div>
    </div>`;
}

function card(html, style = '') {
  return `<div style="background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:24px;${style}">${html}</div>`;
}

function sectionTitle(t) {
  return `<div style="font-size:13px;font-weight:700;color:#374151;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #f3f4f6">${t}</div>`;
}

/* ----------------------------------------------------------
   탭 1: 종합 요약
---------------------------------------------------------- */
function renderTabSummary() {
  const sid = State.currentStudentId;
  const stu = STUDENTS.find(s => s.id === sid) || {};
  const ic  = INITIAL_CONSULTATIONS[sid] || {};
  const emp = EMPLOYMENT_STATUS[sid] || {};
  const logs = (CONSULTATION_LOGS[sid] || []).slice(0, 2);
  const diags = DIAGNOSES[sid] || [];

  const isRisk = stu.overallStatus === '고위험군';
  const isWarn = stu.overallStatus === '주의';

  tabWrap(`
    ${tabHeader('📊', '종합 요약', `${stu.name} 학생의 전체 포트폴리오 현황`)}

    ${isRisk ? `<div style="background:#fee2e2;border:1px solid #fca5a5;border-radius:12px;padding:14px 18px;margin-bottom:20px;display:flex;align-items:center;gap:10px">
      <span style="font-size:20px">🚨</span>
      <div>
        <strong style="color:#991b1b">고위험군 학생입니다.</strong>
        <span style="color:#b91c1c;font-size:13px;margin-left:8px">즉각적인 상담 개입이 필요합니다.</span>
      </div>
    </div>` : isWarn ? `<div style="background:#fef3c7;border:1px solid #fde68a;border-radius:12px;padding:14px 18px;margin-bottom:20px;display:flex;align-items:center;gap:10px">
      <span style="font-size:20px">⚠️</span>
      <div>
        <strong style="color:#92400e">주의 학생입니다.</strong>
        <span style="color:#b45309;font-size:13px;margin-left:8px">지속적인 모니터링이 필요합니다.</span>
      </div>
    </div>` : ''}

    <!-- 학생 기본 정보 + 진행도 -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
      ${card(`
        ${sectionTitle('학생 기본 정보')}
        <table class="data-table"><tbody>
          <tr><th>이름</th><td>${esc(stu.name)}</td><th>학번</th><td>${esc(stu.studentId)}</td></tr>
          <tr><th>학과</th><td>${esc(stu.department)}</td><th>학년</th><td>${stu.grade}학년</td></tr>
          <tr><th>진로 목표</th><td>${esc(stu.careerGoal || '—')}</td><th>희망 직무</th><td>${esc(stu.desiredJob || '—')}</td></tr>
          <tr><th>첫 상담일</th><td>${fmtDate(stu.firstDate)}</td><th>최근 상담</th><td>${fmtDate(stu.lastDate)}</td></tr>
        </tbody></table>`)}
      ${card(`
        ${sectionTitle('포트폴리오 진행 현황')}
        <div style="margin-bottom:14px">
          <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px">
            <span style="color:#374151;font-weight:700">전체 진행도</span>
            <span style="font-weight:900;font-size:18px;color:#6366f1">${stu.progressPct}%</span>
          </div>
          <div style="background:#f3f4f6;border-radius:99px;height:10px">
            <div style="background:linear-gradient(90deg,#6366f1,#8b5cf6);height:10px;border-radius:99px;width:${stu.progressPct}%"></div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:16px">
          ${[
            ['초기 상담', ic.date ? '완료' : '미완료', ic.date ? '#059669' : '#9ca3af'],
            ['진단 검사', diags.length > 0 ? `${diags.length}건` : '미완료', diags.length > 0 ? '#6366f1' : '#9ca3af'],
            ['취업 준비', emp.prepLevel ? '진행중' : '미시작', emp.prepLevel ? '#d97706' : '#9ca3af'],
          ].map(([l, v, c]) => `
            <div style="text-align:center;background:#f9fafb;border-radius:10px;padding:10px 8px">
              <div style="font-size:14px;font-weight:800;color:${c}">${v}</div>
              <div style="font-size:11px;color:#9ca3af;margin-top:2px">${l}</div>
            </div>`).join('')}
        </div>`)}
    </div>

    <!-- 상담 메모 + 최근 일지 -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
      ${card(`
        ${sectionTitle('상담사 메모')}
        <textarea id="summary-memo" style="width:100%;min-height:90px;border:1px solid #e5e7eb;border-radius:8px;padding:10px 12px;font-size:13px;resize:vertical;box-sizing:border-box"
          >${esc(stu.memo || '')}</textarea>
        <div style="margin-top:10px;text-align:right">
          <button class="btn btn-primary btn-sm" onclick="saveSummaryMemo()">저장</button>
        </div>`)}
      ${card(`
        ${sectionTitle('최근 상담 일지')}
        ${logs.length ? logs.map(l => `
          <div style="border-left:3px solid #6366f1;padding:8px 12px;margin-bottom:10px;background:#f8f8ff;border-radius:0 8px 8px 0">
            <div style="font-size:12px;color:#9ca3af;margin-bottom:3px">${fmtDate(l.date)} · ${esc(l.type)}</div>
            <div style="font-size:13px;color:#374151;line-height:1.5">${esc(l.content.substring(0, 80))}${l.content.length > 80 ? '...' : ''}</div>
          </div>`).join('') : '<div style="color:#9ca3af;font-size:13px">상담 일지 없음</div>'}
        <button class="btn btn-ghost btn-sm" style="margin-top:4px"
          onclick="navigate('cou-detail',{tab:'logs'})">일지 전체 보기 →</button>`)}
    </div>

    <!-- 진단 요약 -->
    ${diags.length ? card(`
      ${sectionTitle('진단 검사 요약')}
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px">
        ${diags.map(d => `
          <div style="background:#f9fafb;border-radius:10px;padding:14px;border:1px solid #e5e7eb">
            <div style="font-size:12px;color:#6b7280;margin-bottom:4px">${fmtDate(d.date)}</div>
            <div style="font-weight:700;color:#374151;margin-bottom:6px">${esc(d.testType)}</div>
            <div style="font-size:12px;color:#6b7280;line-height:1.5">${esc((d.interpretationMemo || '').substring(0, 100))}${(d.interpretationMemo || '').length > 100 ? '...' : ''}</div>
            <span class="badge ${statusBadgeClass(d.overallStatus)}" style="margin-top:8px">${d.overallStatus}</span>
          </div>`).join('')}
      </div>`) : ''}
  `);
}

function saveSummaryMemo() {
  const memo = document.getElementById('summary-memo').value;
  const stu = STUDENTS.find(s => s.id === State.currentStudentId);
  if (stu) stu.memo = memo;
  showToast('메모가 저장되었습니다.');
}

/* ----------------------------------------------------------
   탭 2: 초기 상담
---------------------------------------------------------- */
function renderTabInitial() {
  const sid = State.currentStudentId;
  const ic  = INITIAL_CONSULTATIONS[sid] || {};

  const fieldRow = (label, name, value, type = 'text', opts = null) => {
    if (opts) {
      return `<tr><th>${label}</th><td><select id="ic-${name}"
        style="border:1px solid #e5e7eb;border-radius:6px;padding:6px 10px;font-size:13px;min-width:160px">
        ${opts.map(o => `<option ${value === o ? 'selected' : ''}>${o}</option>`).join('')}
        </select></td></tr>`;
    }
    return `<tr><th>${label}</th><td><input id="ic-${name}" type="${type}" value="${esc(value || '')}"
      style="border:1px solid #e5e7eb;border-radius:6px;padding:6px 10px;font-size:13px;min-width:200px"></td></tr>`;
  };

  tabWrap(`
    ${tabHeader('👤', '초기 상담', '첫 상담 정보를 입력·수정합니다',
      `<button class="btn btn-primary" onclick="saveTabInitial()">💾 저장</button>`)}

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      ${card(`
        ${sectionTitle('기본 정보')}
        <table class="data-table"><tbody>
          ${fieldRow('상담 일자', 'date', ic.date, 'date')}
          ${fieldRow('상담 방법', 'method', ic.method, 'text', ['대면', '비대면', '전화'])}
          ${fieldRow('MBTI', 'mbti', ic.mbti)}
          ${fieldRow('MBTI 확인 방법', 'mbtiCheckMethod', ic.mbtiCheckMethod, 'text', ['공식 검사', '인터넷 검사', '자가 파악', '미확인'])}
        </tbody></table>`)}

      ${card(`
        ${sectionTitle('건강 및 심리 상태')}
        <table class="data-table"><tbody>
          ${fieldRow('신체 건강', 'healthStatus', ic.healthStatus, 'text', ['매우 좋음', '좋음', '보통', '나쁨', '매우 나쁨'])}
          ${fieldRow('심리 상태', 'psychologicalStatus', ic.psychologicalStatus, 'text', ['매우 안정', '안정적', '보통', '약간 불안', '매우 불안'])}
          ${fieldRow('생활 패턴', 'lifeStatus', ic.lifeStatus, 'text', ['매우 규칙적', '규칙적', '보통', '불규칙', '매우 불규칙'])}
        </tbody></table>`)}

      ${card(`
        ${sectionTitle('진로 정보')}
        <table class="data-table"><tbody>
          ${fieldRow('진로 목표', 'careerGoal', ic.careerGoal, 'text', ['취업', '진학', '창업', '기타'])}
          ${fieldRow('목표 확신도', 'careerGoalConfidence', ic.careerGoalConfidence, 'text', ['매우 높음', '높음', '보통', '낮음', '매우 낮음'])}
          ${fieldRow('준비 수준', 'careerPreparationLevel', ic.careerPreparationLevel, 'text', ['정보 탐색', '기초 단계', '준비 중', '실행 단계', '완성 단계'])}
          ${fieldRow('의사결정자', 'decisionMaker', ic.decisionMaker, 'text', ['본인', '부모', '교수', '기타'])}
        </tbody></table>`)}

      ${card(`
        ${sectionTitle('진로 목표 상세')}
        <textarea id="ic-careerGoalDetail" style="width:100%;height:80px;border:1px solid #e5e7eb;border-radius:8px;padding:10px;font-size:13px;resize:vertical;box-sizing:border-box"
          >${esc(ic.careerGoalDetail || '')}</textarea>
        ${sectionTitle('상담사 메모')}
        <textarea id="ic-memo" style="width:100%;height:80px;border:1px solid #e5e7eb;border-radius:8px;padding:10px;font-size:13px;resize:vertical;box-sizing:border-box"
          >${esc(ic.memo || '')}</textarea>`)}
    </div>
  `);
}

function saveTabInitial() {
  const sid = State.currentStudentId;
  if (!INITIAL_CONSULTATIONS[sid]) INITIAL_CONSULTATIONS[sid] = { studentId: sid };
  const ic = INITIAL_CONSULTATIONS[sid];
  const fields = ['date','method','mbti','mbtiCheckMethod','healthStatus','psychologicalStatus',
    'lifeStatus','careerGoal','careerGoalConfidence','careerPreparationLevel','decisionMaker',
    'careerGoalDetail','memo'];
  fields.forEach(f => {
    const el = document.getElementById('ic-' + f);
    if (el) ic[f] = el.value;
  });
  showToast('초기 상담 정보가 저장되었습니다.');
}

/* ----------------------------------------------------------
   탭 3: 진단 검사
---------------------------------------------------------- */
function renderTabDiagnosis() {
  const sid   = State.currentStudentId;
  const diags = DIAGNOSES[sid] || [];
  const hist  = EDIT_HISTORY[`${sid}-diag`] || [];

  const scoreBar = (label, val) => {
    if (val === null || val === undefined) return '';
    const cls = scoreClass(val);
    const color = cls === 'high' ? '#059669' : cls === 'mid' ? '#d97706' : '#dc2626';
    return `
      <div style="margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px">
          <span style="color:#374151">${label}</span>
          <span style="font-weight:700;color:${color}">${val}</span>
        </div>
        <div style="background:#f3f4f6;border-radius:99px;height:6px">
          <div style="background:${color};height:6px;border-radius:99px;width:${Math.min(val,100)}%"></div>
        </div>
      </div>`;
  };

  tabWrap(`
    ${tabHeader('🔬', '진단 검사', '검사 결과 및 AI 해석 메모',
      `<button class="btn btn-primary" onclick="addDiagModal()">+ 검사 추가</button>`)}

    ${!diags.length ? `<div class="empty-state"><div class="empty-icon">🔬</div>
      <div class="empty-title">진단 검사 결과 없음</div>
      <div class="empty-text">검사 결과를 추가해 주세요.</div></div>` : ''}

    ${diags.map((d, i) => `
      <div style="margin-bottom:20px">
        ${card(`
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:8px">
            <div>
              <span style="font-weight:800;font-size:16px;color:#111827">${esc(d.testType)}</span>
              <span class="badge badge-gray" style="margin-left:10px">${fmtDate(d.date)}</span>
              <span class="badge ${statusBadgeClass(d.overallStatus)}" style="margin-left:6px">${d.overallStatus}</span>
            </div>
            <div style="display:flex;gap:8px">
              <button class="btn btn-ghost btn-sm" onclick="toggleDiagDetail('diag-body-${i}')">상세 접기/펼치기</button>
              <button class="btn btn-primary btn-sm" onclick="saveDiag(${i})">저장</button>
            </div>
          </div>

          <div id="diag-body-${i}">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
              <!-- 점수 차트 -->
              ${d.psychTest ? `<div>
                <div style="font-size:13px;font-weight:700;color:#374151;margin-bottom:10px">성격/심리 검사 점수</div>
                ${scoreBar('사교성', d.psychTest.sociability)}
                ${scoreBar('수용성', d.psychTest.receptivity)}
                ${scoreBar('성실성', d.psychTest.sincerity)}
                ${scoreBar('책임감', d.psychTest.responsibility)}
                ${scoreBar('목표지향성', d.psychTest.goalOrientation)}
                ${scoreBar('불안', d.psychTest.anxiety)}
                ${scoreBar('우울', d.psychTest.depression)}
                ${d.psychTest.followUpRequired ? `<div style="background:#fee2e2;border-radius:8px;padding:8px 12px;font-size:12px;color:#dc2626;font-weight:600;margin-top:8px">⚠️ 추가 심리 지원 필요</div>` : ''}
              </div>` : ''}
              ${d.lifeHistory ? `<div>
                <div style="font-size:13px;font-weight:700;color:#374151;margin-bottom:10px">생활사 검사</div>
                ${scoreBar('대인관계', d.lifeHistory.interpersonal)}
                ${scoreBar('독립성', d.lifeHistory.independence)}
                ${scoreBar('학업', d.lifeHistory.academics)}
                ${scoreBar('성취욕구', d.lifeHistory.ambition)}
                ${scoreBar('운동 선호', d.lifeHistory.sportsPreference)}
              </div>` : ''}
              ${d.jobTest ? `<div style="grid-column:1/-1">
                <div style="font-size:13px;font-weight:700;color:#374151;margin-bottom:10px">직업선호도 검사</div>
                <table class="data-table"><tbody>
                  <tr><th>1순위</th><td>${esc(d.jobTest.rank1)}</td><th>2순위</th><td>${esc(d.jobTest.rank2)}</td></tr>
                  <tr><th>3순위</th><td>${esc(d.jobTest.rank3)}</td><th>추천 직업</th><td>${esc(d.jobTest.recommendedJobs)}</td></tr>
                </tbody></table>
              </div>` : ''}
            </div>

            <!-- 해석 메모 편집 (3열: AI원본 | 수정 | 이력) -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
              <div>
                <div style="font-size:12px;font-weight:700;color:#6b7280;margin-bottom:6px">📋 해석 메모</div>
                <textarea id="diag-interp-${i}" style="width:100%;height:100px;border:1px solid #e5e7eb;border-radius:8px;
                  padding:10px;font-size:13px;resize:vertical;box-sizing:border-box">${esc(d.interpretationMemo || '')}</textarea>
              </div>
              <div>
                <div style="font-size:12px;font-weight:700;color:#6b7280;margin-bottom:6px">💡 코칭 메모</div>
                <textarea id="diag-coach-${i}" style="width:100%;height:100px;border:1px solid #e5e7eb;border-radius:8px;
                  padding:10px;font-size:13px;resize:vertical;box-sizing:border-box">${esc(d.coachingMemo || '')}</textarea>
              </div>
            </div>

            <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
              <div style="display:flex;gap:8px;align-items:center">
                <label style="font-size:13px;color:#374151">위험도:</label>
                <select id="diag-status-${i}" style="border:1px solid #e5e7eb;border-radius:6px;padding:5px 10px;font-size:13px">
                  ${['일반','주의','고위험군'].map(s => `<option ${d.overallStatus===s?'selected':''}>${s}</option>`).join('')}
                </select>
              </div>
              <button class="btn btn-ghost btn-sm" onclick="simulateAI(document.getElementById('diag-ai-result-${i}'), '<div style=\\"color:#374151;font-size:13px;line-height:1.6\\"><strong>AI 재해석 완료</strong><br>${esc(d.interpretationMemo || '')}\\n\\n추가 코칭 제안: ${esc(d.coachingMemo || '')}</div>')">
                🤖 AI 재해석
              </button>
            </div>
            <div id="diag-ai-result-${i}" style="margin-top:8px"></div>
          </div>
        `)}
      </div>`).join('')}

    <!-- 수정 이력 -->
    ${hist.length ? card(`
      ${sectionTitle('수정 이력')}
      <div class="history-list">
        ${hist.map(h => `
          <div class="history-item">
            <div class="history-meta"><span class="history-who">${h.who}</span> · ${h.when}</div>
            <div class="history-text">${h.what}</div>
          </div>`).join('')}
      </div>`) : ''}
  `);
}

function toggleDiagDetail(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = el.style.display === 'none' ? '' : 'none';
}

function saveDiag(i) {
  const sid  = State.currentStudentId;
  const diag = (DIAGNOSES[sid] || [])[i];
  if (!diag) return;
  const interp = document.getElementById(`diag-interp-${i}`);
  const coach  = document.getElementById(`diag-coach-${i}`);
  const status = document.getElementById(`diag-status-${i}`);
  if (interp) diag.interpretationMemo = interp.value;
  if (coach)  diag.coachingMemo       = coach.value;
  if (status) diag.overallStatus      = status.value;

  // 이력 추가
  if (!EDIT_HISTORY[`${sid}-diag`]) EDIT_HISTORY[`${sid}-diag`] = [];
  EDIT_HISTORY[`${sid}-diag`].unshift({
    who: '이상담 상담사', when: new Date().toLocaleString('ko-KR'), what: '진단 메모 수정'
  });
  showToast('진단 검사 정보가 저장되었습니다.');
}

function addDiagModal() {
  openModal(`
    <div style="padding:4px">
      <h3 style="font-size:18px;font-weight:800;margin-bottom:16px">검사 추가</h3>
      <table class="data-table" style="margin-bottom:16px"><tbody>
        <tr><th>검사 유형</th><td><select id="new-diag-type" style="border:1px solid #e5e7eb;border-radius:6px;padding:6px 10px;font-size:13px">
          <option>성격/심리 검사</option>
          <option>직업선호도검사 L형</option>
          <option>직업선호도검사 S형</option>
          <option>기타</option>
        </select></td></tr>
        <tr><th>검사 일자</th><td><input type="date" id="new-diag-date" style="border:1px solid #e5e7eb;border-radius:6px;padding:6px 10px;font-size:13px"></td></tr>
      </tbody></table>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn btn-ghost" onclick="closeModal()">취소</button>
        <button class="btn btn-primary" onclick="closeModal();showToast('검사 항목이 추가되었습니다.')">추가</button>
      </div>
    </div>`);
}

/* ----------------------------------------------------------
   탭 4: 교과·비교과 활동
---------------------------------------------------------- */
function renderTabActivities() {
  tabWrap(`
    ${tabHeader('📚', '교과·비교과 활동', '수강 과목 및 비교과 프로그램 참여 현황')}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      ${card(`
        ${sectionTitle('수강 과목 (2026-1학기)')}
        <table class="data-table">
          <thead><tr><th>과목명</th><th>학점</th><th>현재성적</th><th>관련도</th></tr></thead>
          <tbody>
            <tr><td>머신러닝 기초</td><td>3</td><td><span class="badge badge-green">A</span></td><td>핵심</td></tr>
            <tr><td>데이터베이스</td><td>3</td><td><span class="badge badge-blue">B+</span></td><td>관련</td></tr>
            <tr><td>파이썬 프로그래밍</td><td>2</td><td><span class="badge badge-green">A+</span></td><td>핵심</td></tr>
            <tr><td>통계학 개론</td><td>3</td><td><span class="badge badge-yellow">B</span></td><td>관련</td></tr>
            <tr><td>영어 회화</td><td>2</td><td><span class="badge badge-gray">수강중</span></td><td>기타</td></tr>
          </tbody>
        </table>
        <div style="margin-top:12px;font-size:13px;color:#6b7280">수강 학점: 13학점 · 취득 학점: 92학점</div>`)}

      ${card(`
        ${sectionTitle('비교과 참여 현황')}
        <div style="display:flex;flex-direction:column;gap:10px">
          ${[
            { name: 'AI 특강 (심화과정)', date: '2026.04', status: '예정', color: '#6366f1' },
            { name: '취업캠프 (데이터/IT)', date: '2026.05', status: '예정', color: '#6366f1' },
            { name: '데이터 분석 스터디', date: '2026.03~', status: '참여중', color: '#059669' },
            { name: '진로탐색 워크숍', date: '2026.02', status: '완료', color: '#9ca3af' },
          ].map(a => `
            <div style="display:flex;align-items:center;gap:12px;background:#f9fafb;border-radius:8px;padding:10px 14px">
              <div style="width:8px;height:8px;border-radius:50%;background:${a.color};flex-shrink:0"></div>
              <div style="flex:1">
                <div style="font-size:13px;font-weight:600;color:#374151">${a.name}</div>
                <div style="font-size:11px;color:#9ca3af">${a.date}</div>
              </div>
              <span class="badge" style="background:${a.color}20;color:${a.color}">${a.status}</span>
            </div>`).join('')}
        </div>
        <button class="btn btn-ghost btn-sm" style="margin-top:12px" onclick="showToast('활동 추가 기능은 준비 중입니다.','info')">+ 활동 추가</button>`)}
    </div>
  `);
}

/* ----------------------------------------------------------
   탭 5: 학업 설계
---------------------------------------------------------- */
function renderTabAcademic() {
  tabWrap(`
    ${tabHeader('🎓', '학업 설계', '졸업 이수 현황 및 수강 권고 과목')}
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px">
      ${[
        ['취득 학점', '92', '130', '#6366f1'],
        ['전공 학점', '54', '72', '#059669'],
        ['교양 학점', '18', '20', '#d97706'],
      ].map(([l, cur, tot, c]) => `
        <div style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:18px;text-align:center">
          <div style="font-size:12px;color:#6b7280;margin-bottom:6px">${l}</div>
          <div style="font-size:26px;font-weight:900;color:${c}">${cur}<span style="font-size:14px;color:#9ca3af">/${tot}</span></div>
          <div style="background:#f3f4f6;border-radius:99px;height:6px;margin-top:10px">
            <div style="background:${c};height:6px;border-radius:99px;width:${Math.round(parseInt(cur)/parseInt(tot)*100)}%"></div>
          </div>
        </div>`).join('')}
    </div>

    ${card(`
      ${sectionTitle('권고 수강 과목 (2026-2학기)')}
      <table class="data-table">
        <thead><tr><th>과목명</th><th>학점</th><th>우선순위</th><th>사유</th></tr></thead>
        <tbody>
          <tr><td>데이터 분석 심화</td><td>3</td><td><span class="badge badge-red">필수</span></td><td>진로 핵심 역량</td></tr>
          <tr><td>SQL 실무</td><td>2</td><td><span class="badge badge-red">필수</span></td><td>취업 요구 스킬</td></tr>
          <tr><td>캡스톤 디자인</td><td>3</td><td><span class="badge badge-yellow">권장</span></td><td>포트폴리오 프로젝트</td></tr>
          <tr><td>AI 프로젝트 실습</td><td>3</td><td><span class="badge badge-yellow">권장</span></td><td>실무 경험</td></tr>
          <tr><td>비즈니스 영어</td><td>2</td><td><span class="badge badge-gray">선택</span></td><td>영어 역량 강화</td></tr>
        </tbody>
      </table>`)}
  `);
}

/* ----------------------------------------------------------
   탭 6: 포트폴리오
---------------------------------------------------------- */
function renderTabPortfolio() {
  const sid  = State.currentStudentId;
  const port = (PORTFOLIOS[sid] || [])[0] || {};
  const hist = EDIT_HISTORY[`${sid}-port`] || [];
  const plans = port.actionPlans || [];

  tabWrap(`
    ${tabHeader('📁', '포트폴리오', `v${port.version || 1} · ${fmtDate(port.date)}`,
      `<button class="btn btn-ghost" onclick="showToast('PDF 출력 기능은 3단계에서 구현됩니다.','info')">🖨️ PDF</button>
       <button class="btn btn-primary" onclick="savePortfolio()">💾 저장</button>`)}

    <!-- 진행 상태 -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">
      ${['AI초안','상담사검토','교수확정'].map((s, i) => `
        <div style="display:flex;align-items:center;gap:10px">
          <div style="display:flex;align-items:center;gap:6px">
            <div style="width:24px;height:24px;border-radius:50%;background:${i <= 1 ? '#6366f1' : '#e5e7eb'};
              color:${i <= 1 ? '#fff' : '#9ca3af'};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700">${i+1}</div>
            <span style="font-size:13px;color:${i <= 1 ? '#374151' : '#9ca3af'};font-weight:${i===1?'700':'400'}">${s}</span>
          </div>
          ${i < 2 ? `<div style="width:40px;height:2px;background:${i < 1 ? '#6366f1' : '#e5e7eb'}"></div>` : ''}
        </div>`).join('')}
      <span class="badge badge-yellow" style="margin-left:8px">상담사 검토 중</span>
    </div>

    <!-- 로드맵 -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:16px">
      ${[
        { label: '단기 목표', color: '#6366f1', key: 'shortTermRoadmap' },
        { label: '중기 목표', color: '#059669', key: 'midTermRoadmap' },
        { label: '장기 목표', color: '#d97706', key: 'longTermRoadmap' },
      ].map(({ label, color, key }) => {
        const rm = port[key] || {};
        return `
          <div style="background:#fff;border:1.5px solid ${color}30;border-radius:14px;padding:18px">
            <div style="font-size:12px;font-weight:700;color:${color};margin-bottom:8px">${label}</div>
            <div style="font-size:13px;font-weight:700;color:#374151;margin-bottom:6px">${esc(rm.goal || '—')}</div>
            <div style="font-size:12px;color:#6b7280;margin-bottom:8px">📅 ${esc(rm.schedule || '—')}</div>
            <div style="font-size:12px;color:#6b7280;line-height:1.5">${esc(rm.coreActivities || '—')}</div>
          </div>`;
      }).join('')}
    </div>

    <!-- 실행 계획 -->
    ${card(`
      ${sectionTitle('실행 계획')}
      <table class="data-table">
        <thead><tr><th>분류</th><th>활동명</th><th>목표</th><th>일정</th><th>완료</th></tr></thead>
        <tbody>
          ${plans.map((p, i) => `
            <tr>
              <td><span class="badge badge-gray">${esc(p.category)}</span></td>
              <td>${esc(p.activityName)}</td>
              <td style="font-size:12px;color:#6b7280">${esc(p.goal)}</td>
              <td style="font-size:12px">${esc(p.schedule)}</td>
              <td><input type="checkbox" ${p.isCompleted ? 'checked' : ''}
                onchange="toggleActionPlan('${sid}','${p.id}',this.checked);showToast('저장되었습니다.')"></td>
            </tr>`).join('')}
        </tbody>
      </table>
      <button class="btn btn-ghost btn-sm" style="margin-top:12px" onclick="showToast('항목 추가 기능은 준비 중입니다.','info')">+ 항목 추가</button>`)}

    <!-- 상담사 의견 -->
    ${card(`
      ${sectionTitle('상담사 의견')}
      <textarea id="port-counselor-opinion" style="width:100%;min-height:80px;border:1px solid #e5e7eb;border-radius:8px;
        padding:10px 12px;font-size:13px;resize:vertical;box-sizing:border-box">${esc(port.counselorOpinion || '')}</textarea>
    `)}

    <!-- 수정 이력 -->
    ${hist.length ? card(`
      ${sectionTitle('수정 이력')}
      <div class="history-list">
        ${hist.map(h => `
          <div class="history-item">
            <div class="history-meta"><span class="history-who">${h.who}</span> · ${h.when}</div>
            <div class="history-text">${h.what}</div>
          </div>`).join('')}
      </div>`) : ''}
  `);
}

function savePortfolio() {
  const sid  = State.currentStudentId;
  const port = (PORTFOLIOS[sid] || [])[0];
  if (!port) return;
  const opEl = document.getElementById('port-counselor-opinion');
  if (opEl) port.counselorOpinion = opEl.value;
  if (!EDIT_HISTORY[`${sid}-port`]) EDIT_HISTORY[`${sid}-port`] = [];
  EDIT_HISTORY[`${sid}-port`].unshift({
    who: '이상담 상담사', when: new Date().toLocaleString('ko-KR'), what: '포트폴리오 의견 수정'
  });
  showToast('포트폴리오가 저장되었습니다.');
}

function toggleActionPlan(sid, planId, checked) {
  const port = (PORTFOLIOS[sid] || [])[0];
  if (!port) return;
  const plan = port.actionPlans.find(p => p.id === planId);
  if (plan) plan.isCompleted = checked;
}

/* ----------------------------------------------------------
   탭 7: 상담 일지
---------------------------------------------------------- */
function renderTabLogs() {
  const sid  = State.currentStudentId;
  const logs = CONSULTATION_LOGS[sid] || [];

  tabWrap(`
    ${tabHeader('📝', '상담 일지', `총 ${logs.length}회 상담`,
      `<button class="btn btn-primary" onclick="openAddLogModal()">+ 일지 작성</button>`)}

    ${logs.length ? logs.map(l => `
      <div style="margin-bottom:14px">
        ${card(`
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;margin-bottom:12px">
            <div>
              <span style="font-size:16px;font-weight:800;color:#111827">${l.sessionNumber}회기</span>
              <span class="badge badge-blue" style="margin-left:10px">${esc(l.type)}</span>
              ${l.followUpRequired ? '<span class="badge badge-red" style="margin-left:6px">후속 필요</span>' : ''}
              <span class="badge badge-green" style="margin-left:6px">${l.status}</span>
            </div>
            <div style="font-size:13px;color:#9ca3af">${fmtDate(l.date)}</div>
          </div>
          <table class="data-table" style="margin-bottom:0"><tbody>
            <tr><th style="width:90px">상담 내용</th><td style="line-height:1.6">${esc(l.content)}</td></tr>
            <tr><th>조치 사항</th><td>${esc(l.actions)}</td></tr>
            <tr><th>다음 상담</th><td>${fmtDate(l.nextDate)}</td></tr>
          </tbody></table>
        `)}
      </div>`).join('')
    : `<div class="empty-state"><div class="empty-icon">📝</div><div class="empty-title">상담 일지 없음</div></div>`}
  `);
}

function openAddLogModal() {
  openModal(`
    <div style="padding:4px">
      <h3 style="font-size:18px;font-weight:800;margin-bottom:16px">상담 일지 작성</h3>
      <table class="data-table" style="margin-bottom:12px"><tbody>
        <tr><th>상담 일자</th><td><input type="date" id="nl-date" style="border:1px solid #e5e7eb;border-radius:6px;padding:6px 10px;font-size:13px"></td></tr>
        <tr><th>상담 유형</th><td><select id="nl-type" style="border:1px solid #e5e7eb;border-radius:6px;padding:6px 10px;font-size:13px">
          <option>진로 상담</option><option>포트폴리오 검토</option><option>초기 상담</option>
          <option>심리 지원</option><option>취업 컨설팅</option>
        </select></td></tr>
        <tr><th>다음 상담</th><td><input type="date" id="nl-next" style="border:1px solid #e5e7eb;border-radius:6px;padding:6px 10px;font-size:13px"></td></tr>
      </tbody></table>
      <div style="margin-bottom:10px">
        <div style="font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">상담 내용</div>
        <textarea id="nl-content" style="width:100%;height:90px;border:1px solid #e5e7eb;border-radius:8px;padding:10px;font-size:13px;resize:vertical;box-sizing:border-box"
          placeholder="상담 내용을 입력하세요..."></textarea>
      </div>
      <div style="margin-bottom:16px">
        <div style="font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">조치 사항</div>
        <textarea id="nl-actions" style="width:100%;height:60px;border:1px solid #e5e7eb;border-radius:8px;padding:10px;font-size:13px;resize:vertical;box-sizing:border-box"
          placeholder="취한 조치 또는 과제를 입력하세요..."></textarea>
      </div>
      <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:#374151;margin-bottom:16px;cursor:pointer">
        <input type="checkbox" id="nl-followup"> 후속 조치 필요
      </label>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn btn-ghost" onclick="closeModal()">취소</button>
        <button class="btn btn-primary" onclick="saveNewLog()">저장</button>
      </div>
    </div>`, 'modal-lg');
}

function saveNewLog() {
  const sid  = State.currentStudentId;
  if (!CONSULTATION_LOGS[sid]) CONSULTATION_LOGS[sid] = [];
  const logs = CONSULTATION_LOGS[sid];
  const newLog = {
    id:             `log-${Date.now()}`,
    studentId:      sid,
    date:           document.getElementById('nl-date').value || new Date().toISOString().slice(0,10),
    sessionNumber:  logs.length + 1,
    type:           document.getElementById('nl-type').value,
    content:        document.getElementById('nl-content').value,
    actions:        document.getElementById('nl-actions').value,
    nextDate:       document.getElementById('nl-next').value,
    followUpRequired: document.getElementById('nl-followup').checked,
    authorEmail:    'counselor@mjc.ac.kr',
    status:         '완료',
    createdAt:      new Date().toISOString(),
  };
  logs.unshift(newLog);
  closeModal();
  showToast('상담 일지가 저장되었습니다.');
  renderTabLogs();
}

/* ----------------------------------------------------------
   탭 8: 취업 준비
---------------------------------------------------------- */
function renderTabEmployment() {
  const sid = State.currentStudentId;
  const emp = EMPLOYMENT_STATUS[sid] || {};

  const tf = (label, id, val, placeholder = '') => `
    <tr><th>${label}</th><td>
      <input id="emp-${id}" value="${esc(val || '')}" placeholder="${placeholder}"
        style="border:1px solid #e5e7eb;border-radius:6px;padding:6px 10px;font-size:13px;width:100%;box-sizing:border-box">
    </td></tr>`;

  const cb = (label, id, checked) => `
    <label style="display:flex;align-items:center;gap:8px;padding:10px 12px;background:#f9fafb;border-radius:8px;cursor:pointer;margin-bottom:6px">
      <input type="checkbox" id="emp-${id}" ${checked ? 'checked' : ''} style="width:16px;height:16px;accent-color:#6366f1">
      <span style="font-size:13px;color:#374151;font-weight:500">${label}</span>
    </label>`;

  tabWrap(`
    ${tabHeader('💼', '취업 준비', '취업 준비 현황 관리',
      `<button class="btn btn-primary" onclick="saveEmployment()">💾 저장</button>`)}

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      ${card(`
        ${sectionTitle('취업 목표')}
        <table class="data-table"><tbody>
          ${tf('희망 직무', 'desiredJobs', (emp.desiredJobs || []).join(', '), '데이터 분석가, AI 엔지니어')}
          ${tf('희망 취업 시기', 'desiredTiming', emp.desiredTiming, '2027년 상반기')}
          ${tf('희망 지역', 'desiredLocation', emp.desiredLocation, '수도권')}
          ${tf('희망 업종', 'desiredIndustry', emp.desiredIndustry, 'IT·소프트웨어')}
          ${tf('희망 기업 규모', 'desiredCompanyType', emp.desiredCompanyType, '중견기업 이상')}
          ${tf('희망 연봉', 'desiredSalary', emp.desiredSalary, '3,000만원 이상')}
        </tbody></table>`)}

      ${card(`
        ${sectionTitle('자격증 / 스킬')}
        <table class="data-table" style="margin-bottom:16px"><tbody>
          ${tf('자격증 1', 'cert1', emp.cert1, 'ADsP (준비중)')}
          ${tf('자격증 2', 'cert2', emp.cert2, 'SQLD (계획)')}
          ${tf('IT 스킬', 'itSkill', emp.itSkill, 'Python, SQL, Excel')}
          ${tf('기타 자격', 'otherCerts', emp.otherCerts, '토익 등')}
        </tbody></table>
        ${sectionTitle('취업 준비 체크리스트')}
        ${cb('이력서 작성 완료', 'resumeReady', emp.resumeReady)}
        ${cb('자기소개서 완성', 'introReady',   emp.introReady)}
        ${cb('면접 준비 완료',  'interviewReady', emp.interviewReady)}`)}

      ${card(`
        ${sectionTitle('메모 / 특이사항')}
        <textarea id="emp-notes" style="width:100%;min-height:80px;border:1px solid #e5e7eb;border-radius:8px;
          padding:10px 12px;font-size:13px;resize:vertical;box-sizing:border-box">${esc(emp.notes || '')}</textarea>
      `, 'grid-column:1/-1')}
    </div>
  `);
}

function saveEmployment() {
  const sid = State.currentStudentId;
  if (!EMPLOYMENT_STATUS[sid]) EMPLOYMENT_STATUS[sid] = { studentId: sid };
  const emp = EMPLOYMENT_STATUS[sid];
  const fields = ['desiredTiming','desiredLocation','desiredIndustry','desiredCompanyType','desiredSalary',
    'cert1','cert2','itSkill','otherCerts','notes'];
  fields.forEach(f => {
    const el = document.getElementById('emp-' + f);
    if (el) emp[f] = el.value;
  });
  // 희망직무 — 쉼표 분리
  const jobEl = document.getElementById('emp-desiredJobs');
  if (jobEl) emp.desiredJobs = jobEl.value.split(',').map(s => s.trim()).filter(Boolean);
  // 체크박스
  ['resumeReady','introReady','interviewReady'].forEach(f => {
    const el = document.getElementById('emp-' + f);
    if (el) emp[f] = el.checked;
  });
  emp.updatedAt = new Date().toISOString().slice(0,10);
  showToast('취업 준비 정보가 저장되었습니다.');
}

/* ----------------------------------------------------------
   탭 9: AI 어시스턴트
---------------------------------------------------------- */
function renderTabAI() {
  tabWrap(`
    ${tabHeader('🤖', 'AI 어시스턴트', '상담사를 위한 AI 도우미')}

    <div style="display:grid;grid-template-columns:1fr 320px;gap:16px;align-items:start">
      <!-- 채팅 영역 -->
      <div>
        ${card(`
          ${sectionTitle('AI와 대화하기')}
          <div id="ai-chat-messages" style="height:360px;overflow-y:auto;display:flex;flex-direction:column;gap:12px;padding:4px 0;margin-bottom:12px">
            <div style="align-self:flex-start;max-width:80%">
              <div style="background:#f3f4f6;border-radius:0 12px 12px 12px;padding:12px 16px;font-size:13px;line-height:1.6;color:#374151">
                안녕하세요! 저는 AI 진로 어시스턴트입니다. 담당 학생의 진로 상담에 도움을 드릴 수 있습니다.<br><br>
                무엇이 궁금하신가요? 예를 들어:<br>
                • <strong>"김진로 학생 진단검사 요약해줘"</strong><br>
                • <strong>"적합한 코칭 전략 추천해줘"</strong><br>
                • <strong>"포트폴리오 개선점 알려줘"</strong>
              </div>
              <div style="font-size:11px;color:#9ca3af;margin-top:4px;padding-left:4px">AI · 방금</div>
            </div>
          </div>
          <div style="display:flex;gap:8px">
            <input id="ai-input" placeholder="메시지를 입력하세요..."
              style="flex:1;border:1px solid #e5e7eb;border-radius:8px;padding:10px 14px;font-size:13px"
              onkeydown="if(event.key==='Enter')sendAIMessage()">
            <button class="btn btn-primary" onclick="sendAIMessage()">전송</button>
          </div>
        `)}
      </div>

      <!-- 빠른 질문 -->
      <div>
        ${card(`
          ${sectionTitle('빠른 질문')}
          <div style="display:flex;flex-direction:column;gap:8px">
            ${[
              '진단검사 결과 요약',
              '적합 코칭 전략 추천',
              '포트폴리오 개선 포인트',
              '자격증 취득 로드맵',
              '고위험 학생 대응 방법',
              '취업 준비 체크리스트',
            ].map(q => `
              <button onclick="quickAsk('${q}')"
                style="background:#f8f8ff;border:1px solid #e5e7eb;border-radius:8px;padding:9px 12px;
                  font-size:13px;color:#374151;cursor:pointer;text-align:left;transition:all .15s"
                onmouseover="this.style.background='#eef2ff';this.style.borderColor='#6366f1'"
                onmouseout="this.style.background='#f8f8ff';this.style.borderColor='#e5e7eb'">
                💬 ${q}
              </button>`).join('')}
          </div>
        `)}
      </div>
    </div>
  `);
}

function sendAIMessage() {
  const input = document.getElementById('ai-input');
  const msgs  = document.getElementById('ai-chat-messages');
  if (!input || !msgs || !input.value.trim()) return;

  const userMsg = input.value.trim();
  input.value = '';

  // 사용자 메시지 추가
  msgs.innerHTML += `
    <div style="align-self:flex-end;max-width:80%">
      <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:12px 0 12px 12px;
        padding:12px 16px;font-size:13px;color:#fff;line-height:1.6">${esc(userMsg)}</div>
      <div style="font-size:11px;color:#9ca3af;margin-top:4px;text-align:right;padding-right:4px">나 · 방금</div>
    </div>`;

  // AI 응답 시뮬레이션
  const loaderId = `ai-loader-${Date.now()}`;
  msgs.innerHTML += `
    <div id="${loaderId}" style="align-self:flex-start">
      <div style="background:#f3f4f6;border-radius:0 12px 12px 12px;padding:12px 16px;display:flex;align-items:center;gap:8px">
        <div class="spinner spinner-dark"></div>
        <span style="font-size:13px;color:#9ca3af">AI가 분석 중입니다...</span>
      </div>
    </div>`;
  msgs.scrollTop = msgs.scrollHeight;

  const sid = State.currentStudentId;
  const stu = STUDENTS.find(s => s.id === sid) || {};
  const diags = DIAGNOSES[sid] || [];

  const responses = {
    '진단검사 결과 요약': `<strong>${esc(stu.name)} 학생 진단 요약</strong><br><br>
      ${diags.length ? `총 ${diags.length}건의 검사가 완료되었습니다.<br>
      주요 특성: 성실성·수용성 높음, 사교성·목표지향성 낮음.<br>
      추천 접근: 1:1 상담 중심, 단기 목표 설정 코칭 필요.` : '진단 검사 데이터가 없습니다.'}`,
    '적합 코칭 전략 추천': `<strong>코칭 전략 추천</strong><br><br>
      1. 단기 성취 목표 설정 (주 1회 점검)<br>
      2. 1:1 집중 상담 유지<br>
      3. 데이터 분석 관련 소규모 프로젝트 참여 유도<br>
      4. 자격증 학습 계획 구체화`,
    default: `<strong>AI 분석 결과</strong><br><br>
      "${esc(userMsg)}"에 대한 답변입니다.<br><br>
      ${esc(stu.name)} 학생은 현재 <strong>${esc(stu.currentStage)}</strong> 단계로,
      ${esc(stu.desiredJob || '미정')}을 목표로 하고 있습니다.<br>
      진행도 ${stu.progressPct}% · 상태: ${esc(stu.overallStatus)}<br><br>
      ※ 실제 서비스에서는 Claude API가 RAG 기반으로 답변을 생성합니다.`,
  };

  setTimeout(() => {
    const loader = document.getElementById(loaderId);
    const answer = responses[userMsg] || responses.default;
    if (loader) loader.outerHTML = `
      <div style="align-self:flex-start;max-width:85%">
        <div style="background:#f3f4f6;border-radius:0 12px 12px 12px;padding:12px 16px;font-size:13px;line-height:1.7;color:#374151">
          ${answer}
        </div>
        <div style="font-size:11px;color:#9ca3af;margin-top:4px;padding-left:4px">AI · 방금</div>
      </div>`;
    msgs.scrollTop = msgs.scrollHeight;
  }, 1600);
}

function quickAsk(q) {
  const input = document.getElementById('ai-input');
  if (input) { input.value = q; sendAIMessage(); }
}
