/* ==========================================================
   professor.js — 교수 화면 (학생 목록 + 포트폴리오 열람 + 최종 승인)
   ========================================================== */

/* ----------------------------------------------------------
   교수용 탭 정의
---------------------------------------------------------- */
const PROFESSOR_TABS = [
  { id: 'overview',    icon: '📊', label: '종합 현황' },
  { id: 'portfolio',   icon: '📁', label: '포트폴리오' },
  { id: 'roadmap',     icon: '🗺️', label: '진로 로드맵' },
  { id: 'courses',     icon: '🎓', label: '수강 추천' },
  { id: 'feedback',    icon: '📝', label: '교수 피드백' },
  { id: 'approval',    icon: '✅', label: '최종 승인' },
];

/* ----------------------------------------------------------
   학생 목록
---------------------------------------------------------- */
function renderProfessorList() {
  const el = document.getElementById('app-content');
  el.classList.remove('has-sidebar');

  const confirmedCount = STUDENTS.filter(s => s.currentStage === '취업준비' || s.progressPct >= 90).length;
  const pendingCount   = STUDENTS.filter(s => s.progressPct >= 60 && s.progressPct < 90).length;

  el.innerHTML = `
    <div style="padding:28px 32px">

      <!-- 상단 타이틀 + 통계 -->
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:16px">
        <div>
          <h2 style="font-size:22px;font-weight:900;color:#111827;margin:0">담당 학생 포트폴리오</h2>
          <p style="font-size:13px;color:#6b7280;margin:4px 0 0">박교수 담당 · 총 ${STUDENTS.length}명 · 포트폴리오 최종 확정 권한</p>
        </div>
        <div style="display:flex;gap:12px">
          <div style="background:#d1fae5;border:1px solid #6ee7b7;border-radius:12px;padding:12px 20px;text-align:center">
            <div style="font-size:22px;font-weight:900;color:#059669">${confirmedCount}</div>
            <div style="font-size:11px;color:#065f46;font-weight:600">승인 완료</div>
          </div>
          <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:12px;padding:12px 20px;text-align:center">
            <div style="font-size:22px;font-weight:900;color:#d97706">${pendingCount}</div>
            <div style="font-size:11px;color:#92400e;font-weight:600">검토 대기</div>
          </div>
        </div>
      </div>

      <!-- 검색 -->
      <div style="display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap">
        <div class="search-bar" style="flex:1;min-width:220px">
          <span class="search-icon">🔍</span>
          <input id="prof-search" class="search-input" placeholder="이름·학번·학과 검색..."
            oninput="filterProfStudentList()" style="width:100%">
        </div>
        <select id="prof-filter-stage" onchange="filterProfStudentList()"
          style="border:1px solid #e5e7eb;border-radius:8px;padding:0 12px;font-size:13px;height:40px;color:#374151">
          <option value="전체">전체 단계</option>
          <option value="포트폴리오">포트폴리오</option>
          <option value="취업준비">취업준비</option>
          <option value="진단검사">진단검사</option>
          <option value="초기상담">초기상담</option>
        </select>
      </div>

      <!-- 학생 카드 목록 -->
      <div id="prof-student-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:16px">
        ${STUDENTS.map(s => renderProfStudentCard(s)).join('')}
      </div>
    </div>`;
}

function renderProfStudentCard(s) {
  const isApproved = s.progressPct >= 90;
  const isPending  = s.progressPct >= 60 && !isApproved;
  const borderColor = isApproved ? '#6ee7b7' : isPending ? '#fde68a' : '#e5e7eb';
  const approvalBadge = isApproved
    ? `<span class="badge badge-green">✅ 승인완료</span>`
    : isPending
    ? `<span class="badge badge-yellow">⏳ 검토대기</span>`
    : `<span class="badge badge-gray">📋 준비중</span>`;

  return `
    <div onclick="navigate('prof-detail',{studentId:'${s.id}',tab:'overview'})"
      style="background:#fff;border:1.5px solid ${borderColor};border-radius:16px;
        padding:20px;cursor:pointer;transition:all .15s;box-shadow:0 1px 4px rgba(0,0,0,.06)"
      onmouseover="this.style.borderColor='#059669';this.style.boxShadow='0 4px 16px rgba(5,150,105,.15)'"
      onmouseout="this.style.borderColor='${borderColor}';this.style.boxShadow='0 1px 4px rgba(0,0,0,.06)'">

      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
        <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#059669,#10b981);
          display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:18px;flex-shrink:0">
          ${s.name[0]}
        </div>
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span style="font-weight:800;font-size:16px;color:#111827">${esc(s.name)}</span>
            ${approvalBadge}
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
          <div style="background:linear-gradient(90deg,#059669,#10b981);height:7px;border-radius:99px;width:${s.progressPct}%"></div>
        </div>
      </div>

      <!-- 하단 정보 -->
      <div style="display:flex;justify-content:space-between;font-size:12px;color:#9ca3af">
        <span>🎯 ${esc(s.desiredJob || '미정')}</span>
        <span>최근 상담 ${fmtDate(s.lastDate)}</span>
      </div>
    </div>`;
}

function filterProfStudentList() {
  const query  = (document.getElementById('prof-search')?.value || '').toLowerCase();
  const stage  = document.getElementById('prof-filter-stage')?.value || '전체';

  const filtered = STUDENTS.filter(s => {
    const matchQ = !query ||
      s.name.toLowerCase().includes(query) ||
      s.studentId.includes(query) ||
      s.department.toLowerCase().includes(query);
    const matchStage = stage === '전체' || s.currentStage === stage;
    return matchQ && matchStage;
  });

  document.getElementById('prof-student-grid').innerHTML =
    filtered.length > 0
      ? filtered.map(s => renderProfStudentCard(s)).join('')
      : `<div class="empty-state" style="grid-column:1/-1">
           <div class="empty-icon">🔍</div>
           <div class="empty-title">검색 결과 없음</div>
         </div>`;
}

/* ----------------------------------------------------------
   학생 상세 — 탭 라우팅
---------------------------------------------------------- */
function renderProfessorDetail(tab = 'overview') {
  State.currentTab = tab;
  const stu = STUDENTS.find(s => s.id === State.currentStudentId);
  if (!stu) { renderComingSoon('prof-detail'); return; }

  // 사이드바 탭 재렌더 (탭 active 갱신)
  renderSidebar();

  const el = document.getElementById('app-content');
  switch (tab) {
    case 'overview':   renderProfOverview(el, stu);   break;
    case 'portfolio':  renderProfPortfolio(el, stu);  break;
    case 'roadmap':    renderProfRoadmap(el, stu);    break;
    case 'courses':    renderProfCourses(el, stu);    break;
    case 'feedback':   renderProfFeedback(el, stu);   break;
    case 'approval':   renderProfApproval(el, stu);   break;
    default:           renderProfOverview(el, stu);
  }
}

/* ----------------------------------------------------------
   탭 1: 종합 현황
---------------------------------------------------------- */
function renderProfOverview(el, stu) {
  const port  = (PORTFOLIOS[stu.id] || [])[0];
  const logs  = CONSULTATION_LOGS[stu.id] || [];
  const diags = DIAGNOSES[stu.id] || [];
  const emp   = EMPLOYMENT_STATUS[stu.id];
  const ic    = INITIAL_CONSULTATIONS[stu.id];

  el.innerHTML = `
    <div style="padding:28px 32px;max-width:960px">
      <h3 style="font-size:18px;font-weight:900;color:#111827;margin:0 0 20px">📊 종합 현황 — ${esc(stu.name)} 학생</h3>

      <!-- KPI 카드 4개 -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px">
        ${[
          { label: '포트폴리오 진행도', value: stu.progressPct + '%', color: '#6366f1', bg: '#eef2ff' },
          { label: '상담 횟수',        value: logs.length + '회',     color: '#0891b2', bg: '#ecfeff' },
          { label: '진단검사',         value: diags.length + '건',    color: '#d97706', bg: '#fef3c7' },
          { label: '현재 단계',        value: stageLabel(stu.currentStage), color: '#059669', bg: '#d1fae5' },
        ].map(k => `
          <div style="background:${k.bg};border-radius:14px;padding:16px 18px;text-align:center">
            <div style="font-size:24px;font-weight:900;color:${k.color}">${k.value}</div>
            <div style="font-size:12px;color:#6b7280;font-weight:600;margin-top:4px">${k.label}</div>
          </div>`).join('')}
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">

        <!-- 기본정보 -->
        <div style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:20px">
          <h4 style="font-size:14px;font-weight:800;color:#374151;margin:0 0 14px">👤 기본 정보</h4>
          ${[
            ['이름', stu.name], ['학번', stu.studentId],
            ['학과', stu.department + ' ' + stu.grade + '학년'],
            ['희망 직무', stu.desiredJob || '—'],
            ['담당 상담사', stu.counselor],
            ['초기 상담일', fmtDate(stu.firstDate)],
          ].map(([k, v]) => `
            <div style="display:flex;gap:8px;font-size:13px;padding:5px 0;border-bottom:1px solid #f3f4f6">
              <span style="color:#9ca3af;width:90px;flex-shrink:0">${k}</span>
              <span style="color:#111827;font-weight:600">${esc(String(v))}</span>
            </div>`).join('')}
        </div>

        <!-- 최근 상담 일지 -->
        <div style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:20px">
          <h4 style="font-size:14px;font-weight:800;color:#374151;margin:0 0 14px">📝 최근 상담 내역</h4>
          ${logs.length === 0
            ? `<p style="font-size:13px;color:#9ca3af">상담 일지 없음</p>`
            : logs.slice(0, 3).map(l => `
              <div style="padding:10px 0;border-bottom:1px solid #f3f4f6">
                <div style="display:flex;justify-content:space-between;font-size:12px;color:#6b7280;margin-bottom:4px">
                  <span>${fmtDate(l.date)} · ${l.type}</span>
                  <span style="font-weight:600">${l.sessionNumber}회차</span>
                </div>
                <p style="font-size:13px;color:#374151;margin:0;line-height:1.5;
                  overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">
                  ${esc(l.content)}
                </p>
              </div>`).join('')
          }
        </div>

        <!-- 진로 목표 요약 -->
        <div style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:20px">
          <h4 style="font-size:14px;font-weight:800;color:#374151;margin:0 0 14px">🎯 진로 목표</h4>
          ${ic ? `
            <div style="font-size:13px;color:#374151;line-height:1.7">
              <div style="margin-bottom:8px"><span style="color:#9ca3af">목표 유형:</span>
                <strong> ${esc(ic.careerGoal)}</strong></div>
              <div style="margin-bottom:8px"><span style="color:#9ca3af">목표 상세:</span></div>
              <div style="background:#f9fafb;border-radius:8px;padding:10px;font-size:12px;color:#374151">
                ${esc(ic.careerGoalDetail)}
              </div>
              <div style="margin-top:8px"><span style="color:#9ca3af">준비 단계:</span>
                <strong> ${esc(ic.careerPreparationLevel)}</strong></div>
            </div>` : `<p style="font-size:13px;color:#9ca3af">초기 상담 정보 없음</p>`}
        </div>

        <!-- 취업 준비 현황 -->
        <div style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:20px">
          <h4 style="font-size:14px;font-weight:800;color:#374151;margin:0 0 14px">💼 취업 준비 현황</h4>
          ${emp ? `
            <div style="font-size:13px;color:#374151;line-height:1.8">
              <div><span style="color:#9ca3af">희망 직무:</span> <strong>${esc(emp.desiredJobs.join(', '))}</strong></div>
              <div><span style="color:#9ca3af">희망 시기:</span> <strong>${esc(emp.desiredTiming)}</strong></div>
              <div><span style="color:#9ca3af">자격증:</span> ${esc([emp.cert1, emp.cert2].filter(Boolean).join(', ') || '없음')}</div>
              <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
                <span style="padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;
                  background:${emp.resumeReady?'#d1fae5':'#f3f4f6'};color:${emp.resumeReady?'#065f46':'#9ca3af'}">
                  이력서 ${emp.resumeReady?'✅':'준비중'}</span>
                <span style="padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;
                  background:${emp.introReady?'#d1fae5':'#f3f4f6'};color:${emp.introReady?'#065f46':'#9ca3af'}">
                  자소서 ${emp.introReady?'✅':'준비중'}</span>
                <span style="padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;
                  background:${emp.interviewReady?'#d1fae5':'#f3f4f6'};color:${emp.interviewReady?'#065f46':'#9ca3af'}">
                  면접 ${emp.interviewReady?'✅':'준비중'}</span>
              </div>
            </div>` : `<p style="font-size:13px;color:#9ca3af">취업 준비 정보 없음</p>`}
        </div>
      </div>
    </div>`;
}

/* ----------------------------------------------------------
   탭 2: 포트폴리오 (AI 원문 | 수정 | 이력 3단 구성)
---------------------------------------------------------- */
function renderProfPortfolio(el, stu) {
  const port = (PORTFOLIOS[stu.id] || [])[0];
  const hist = EDIT_HISTORY[stu.id + '-port'] || [];

  if (!port) {
    el.innerHTML = `<div class="empty-state" style="min-height:60vh">
      <div class="empty-icon">📁</div>
      <div class="empty-title">포트폴리오 초안 없음</div>
      <div class="empty-text">상담사가 포트폴리오를 작성한 후 교수 검토가 가능합니다.</div>
    </div>`;
    return;
  }

  el.innerHTML = `
    <div style="padding:28px 32px;max-width:1100px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
        <h3 style="font-size:18px;font-weight:900;color:#111827;margin:0">📁 포트폴리오 — ${esc(stu.name)} 학생</h3>
        <span style="font-size:12px;color:#6b7280">${port.year}년도 ${port.semester}학기 · v${port.version}</span>
      </div>

      <!-- 3단 레이아웃 -->
      <div style="display:grid;grid-template-columns:1fr 1fr 280px;gap:16px;align-items:start">

        <!-- AI 원문 -->
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:20px">
          <div style="font-size:12px;font-weight:700;color:#64748b;margin-bottom:12px;
            display:flex;align-items:center;gap:6px">
            <span style="background:#e0f2fe;color:#0369a1;padding:2px 8px;border-radius:6px">🤖 AI 초안</span>
          </div>
          ${[
            ['단기 목표', port.shortTermRoadmap?.goal, port.shortTermRoadmap?.coreActivities],
            ['중기 목표', port.midTermRoadmap?.goal, port.midTermRoadmap?.coreActivities],
            ['장기 목표', port.longTermRoadmap?.goal, port.longTermRoadmap?.coreActivities],
          ].map(([label, goal, act]) => `
            <div style="margin-bottom:14px">
              <div style="font-size:12px;font-weight:700;color:#374151;margin-bottom:4px">${label}</div>
              <div style="font-size:13px;color:#111827;font-weight:600;margin-bottom:2px">${esc(goal||'')}</div>
              <div style="font-size:12px;color:#6b7280">${esc(act||'')}</div>
            </div>`).join('')}
          <div style="border-top:1px solid #e2e8f0;padding-top:12px;margin-top:4px">
            <div style="font-size:12px;font-weight:700;color:#374151;margin-bottom:6px">상담사 의견</div>
            <div style="font-size:13px;color:#374151;line-height:1.6">${esc(port.counselorOpinion || '—')}</div>
          </div>
        </div>

        <!-- 교수 수정 입력창 -->
        <div style="background:#fff;border:1.5px solid #6ee7b7;border-radius:14px;padding:20px">
          <div style="font-size:12px;font-weight:700;color:#059669;margin-bottom:12px;
            display:flex;align-items:center;gap:6px">
            <span style="background:#d1fae5;color:#065f46;padding:2px 8px;border-radius:6px">✏️ 교수 수정</span>
          </div>
          <div style="margin-bottom:12px">
            <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:4px">단기 목표 수정</label>
            <textarea id="prof-port-short" rows="2"
              style="width:100%;border:1px solid #d1d5db;border-radius:8px;padding:8px;font-size:13px;resize:vertical"
              placeholder="수정 내용을 입력하세요...">${esc(port.shortTermRoadmap?.goal||'')}</textarea>
          </div>
          <div style="margin-bottom:12px">
            <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:4px">중기 목표 수정</label>
            <textarea id="prof-port-mid" rows="2"
              style="width:100%;border:1px solid #d1d5db;border-radius:8px;padding:8px;font-size:13px;resize:vertical"
              placeholder="수정 내용을 입력하세요...">${esc(port.midTermRoadmap?.goal||'')}</textarea>
          </div>
          <div style="margin-bottom:12px">
            <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:4px">교수 의견</label>
            <textarea id="prof-port-opinion" rows="3"
              style="width:100%;border:1px solid #d1d5db;border-radius:8px;padding:8px;font-size:13px;resize:vertical"
              placeholder="교수 의견을 입력하세요..."></textarea>
          </div>
          <button onclick="saveProfPortfolio()"
            style="width:100%;background:#059669;color:#fff;border:none;border-radius:8px;
              padding:10px;font-size:14px;font-weight:700;cursor:pointer">
            💾 수정 저장
          </button>
        </div>

        <!-- 수정 이력 -->
        <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:14px;padding:20px">
          <div style="font-size:12px;font-weight:700;color:#92400e;margin-bottom:12px">📋 수정 이력</div>
          ${hist.length === 0
            ? `<p style="font-size:12px;color:#9ca3af">이력 없음</p>`
            : hist.map(h => `
              <div style="border-bottom:1px solid #fde68a;padding:8px 0;font-size:12px">
                <div style="font-weight:700;color:#374151">${esc(h.who)}</div>
                <div style="color:#6b7280;margin:2px 0">${esc(h.when)}</div>
                <div style="color:#374151">${esc(h.what)}</div>
              </div>`).join('')
          }
        </div>
      </div>
    </div>`;
}

function saveProfPortfolio() {
  showToast('포트폴리오 수정 내용이 저장되었습니다.', 'success');
  const hist = EDIT_HISTORY[State.currentStudentId + '-port'] = EDIT_HISTORY[State.currentStudentId + '-port'] || [];
  hist.unshift({ who: '박교수 교수', when: '2026-04-16 10:00', what: '교수 의견 및 목표 수정' });
}

/* ----------------------------------------------------------
   탭 3: 진로 로드맵
---------------------------------------------------------- */
function renderProfRoadmap(el, stu) {
  const port = (PORTFOLIOS[stu.id] || [])[0];

  el.innerHTML = `
    <div style="padding:28px 32px;max-width:860px">
      <h3 style="font-size:18px;font-weight:900;color:#111827;margin:0 0 20px">🗺️ 진로 로드맵 — ${esc(stu.name)} 학생</h3>

      ${!port ? `<div class="empty-state"><div class="empty-icon">🗺️</div><div class="empty-title">로드맵 없음</div></div>` : `

      <!-- 단계별 타임라인 -->
      <div style="position:relative;padding-left:32px">
        <div style="position:absolute;left:11px;top:0;bottom:0;width:2px;background:#d1fae5"></div>

        ${[
          { step: '1단계', period: port.shortTermRoadmap?.schedule, goal: port.shortTermRoadmap?.goal, act: port.shortTermRoadmap?.coreActivities, color: '#059669', done: true },
          { step: '2단계', period: port.midTermRoadmap?.schedule, goal: port.midTermRoadmap?.goal, act: port.midTermRoadmap?.coreActivities, color: '#0891b2', done: false },
          { step: '3단계', period: port.longTermRoadmap?.schedule, goal: port.longTermRoadmap?.goal, act: port.longTermRoadmap?.coreActivities, color: '#7c3aed', done: false },
        ].map(r => `
          <div style="position:relative;margin-bottom:24px">
            <div style="position:absolute;left:-32px;top:2px;width:22px;height:22px;border-radius:50%;
              background:${r.done ? r.color : '#fff'};border:2.5px solid ${r.color};
              display:flex;align-items:center;justify-content:center;font-size:10px;color:${r.done?'#fff':r.color};font-weight:700">
              ${r.done ? '✓' : ''}
            </div>
            <div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:16px 20px">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
                <span style="background:${r.color}1a;color:${r.color};font-size:11px;font-weight:800;
                  padding:2px 10px;border-radius:99px">${r.step}</span>
                <span style="font-size:12px;color:#6b7280">${esc(r.period||'')}</span>
              </div>
              <div style="font-size:15px;font-weight:800;color:#111827;margin-bottom:6px">${esc(r.goal||'')}</div>
              <div style="font-size:13px;color:#6b7280;line-height:1.6">${esc(r.act||'')}</div>
            </div>
          </div>`).join('')}
      </div>

      <!-- 실행 계획 체크리스트 -->
      <h4 style="font-size:15px;font-weight:800;color:#374151;margin:24px 0 12px">📋 실행 계획 현황</h4>
      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead style="background:#f9fafb">
            <tr>
              ${['상태','분류','활동명','목표','일정','비고'].map(h =>
                `<th style="padding:10px 12px;text-align:left;font-weight:700;color:#374151;
                  border-bottom:1px solid #e5e7eb">${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${(port.actionPlans||[]).map(a => `
              <tr style="border-bottom:1px solid #f3f4f6">
                <td style="padding:10px 12px">
                  <span style="font-size:16px">${a.isCompleted ? '✅' : '⬜'}</span>
                </td>
                <td style="padding:10px 12px"><span class="badge badge-blue">${esc(a.category)}</span></td>
                <td style="padding:10px 12px;font-weight:600;color:#111827">${esc(a.activityName)}</td>
                <td style="padding:10px 12px;color:#6b7280">${esc(a.goal)}</td>
                <td style="padding:10px 12px;color:#6b7280;white-space:nowrap">${esc(a.schedule)}</td>
                <td style="padding:10px 12px;color:#9ca3af">${esc(a.note||'')}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`}
    </div>`;
}

/* ----------------------------------------------------------
   탭 4: 수강 추천 수정
---------------------------------------------------------- */
function renderProfCourses(el, stu) {
  const courses = [
    { name: '머신러닝 기초', credit: 3, type: '전공선택', reason: '희망 직무(데이터 분석) 핵심 과목', priority: '높음' },
    { name: '데이터베이스 설계', credit: 3, type: '전공필수', reason: 'SQL 역량 강화, SQLD 자격증 연계', priority: '높음' },
    { name: '캡스톤 디자인', credit: 3, type: '전공선택', reason: '실무 프로젝트 경험, 포트폴리오 제작', priority: '중간' },
    { name: '빅데이터 분석', credit: 3, type: '전공선택', reason: 'ADsP 자격증 준비 연계', priority: '중간' },
    { name: '통계학 개론', credit: 3, type: '기초교양', reason: '데이터 분석 기반 역량', priority: '낮음' },
  ];

  el.innerHTML = `
    <div style="padding:28px 32px;max-width:900px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
        <h3 style="font-size:18px;font-weight:900;color:#111827;margin:0">🎓 수강 추천 수정 — ${esc(stu.name)} 학생</h3>
        <button onclick="saveProfCourses()"
          style="background:#059669;color:#fff;border:none;border-radius:8px;
            padding:8px 18px;font-size:13px;font-weight:700;cursor:pointer">
          💾 저장
        </button>
      </div>

      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:14px 18px;margin-bottom:20px;font-size:13px;color:#1d4ed8">
        💡 AI가 학생의 진로 목표·진단검사 결과를 기반으로 추천한 수강 과목입니다. 교수님이 직접 수정·추가·삭제할 수 있습니다.
      </div>

      <!-- 추천 과목 테이블 -->
      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;margin-bottom:20px">
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead style="background:#f9fafb">
            <tr>
              ${['과목명','학점','구분','추천 이유','우선순위','포함'].map(h =>
                `<th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;
                  border-bottom:1px solid #e5e7eb">${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${courses.map((c, i) => {
              const priColor = c.priority === '높음' ? '#dc2626' : c.priority === '중간' ? '#d97706' : '#6b7280';
              return `
              <tr style="border-bottom:1px solid #f3f4f6">
                <td style="padding:10px 14px;font-weight:700;color:#111827">${esc(c.name)}</td>
                <td style="padding:10px 14px;color:#6b7280">${c.credit}학점</td>
                <td style="padding:10px 14px"><span class="badge badge-blue">${esc(c.type)}</span></td>
                <td style="padding:10px 14px;color:#374151">${esc(c.reason)}</td>
                <td style="padding:10px 14px">
                  <span style="color:${priColor};font-weight:700;font-size:12px">${c.priority}</span>
                </td>
                <td style="padding:10px 14px">
                  <input type="checkbox" checked
                    style="width:16px;height:16px;cursor:pointer;accent-color:#059669">
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- 추가 의견 -->
      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:20px">
        <label style="font-size:14px;font-weight:700;color:#374151;display:block;margin-bottom:8px">
          교수 추가 의견 (수강 추천 관련)
        </label>
        <textarea id="prof-course-memo" rows="3"
          style="width:100%;border:1px solid #d1d5db;border-radius:8px;padding:10px;font-size:13px;resize:vertical"
          placeholder="수강 추천에 대한 추가 의견이나 특이사항을 입력하세요..."></textarea>
      </div>
    </div>`;
}

function saveProfCourses() {
  showToast('수강 추천이 저장되었습니다.', 'success');
}

/* ----------------------------------------------------------
   탭 5: 교수 피드백
---------------------------------------------------------- */
function renderProfFeedback(el, stu) {
  el.innerHTML = `
    <div style="padding:28px 32px;max-width:800px">
      <h3 style="font-size:18px;font-weight:900;color:#111827;margin:0 0 20px">📝 교수 피드백 — ${esc(stu.name)} 학생</h3>

      <!-- 기존 피드백 이력 -->
      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:20px;margin-bottom:20px">
        <h4 style="font-size:14px;font-weight:800;color:#374151;margin:0 0 14px">📋 기존 피드백 이력</h4>
        <div style="padding:14px 0;border-bottom:1px solid #f3f4f6">
          <div style="display:flex;justify-content:space-between;font-size:12px;color:#6b7280;margin-bottom:6px">
            <span>박교수 교수</span><span>2026.03.20</span>
          </div>
          <p style="font-size:13px;color:#374151;margin:0;line-height:1.6">
            중기 목표 문구를 보다 구체적으로 수정함. 데이터 분석가로의 진로 방향이 적합하며, 자격증 준비와 병행하여 실무 프로젝트 경험을 쌓는 방향을 권장.
          </p>
        </div>
        <div style="padding:14px 0">
          <div style="display:flex;justify-content:space-between;font-size:12px;color:#6b7280;margin-bottom:6px">
            <span>박교수 교수</span><span>2026.02.15</span>
          </div>
          <p style="font-size:13px;color:#374151;margin:0;line-height:1.6">
            초기 상담 결과 확인. AI·데이터 분야 관심이 뚜렷하며, 학업 성취도와 연계하여 체계적인 진로 계획 수립 권고.
          </p>
        </div>
      </div>

      <!-- 새 피드백 작성 -->
      <div style="background:#fff;border:1.5px solid #6ee7b7;border-radius:14px;padding:20px">
        <h4 style="font-size:14px;font-weight:800;color:#059669;margin:0 0 14px">✏️ 새 피드백 작성</h4>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
          <div>
            <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:4px">피드백 유형</label>
            <select id="prof-fb-type"
              style="width:100%;border:1px solid #d1d5db;border-radius:8px;padding:8px 10px;font-size:13px">
              <option>진로 방향</option>
              <option>포트폴리오</option>
              <option>학업 계획</option>
              <option>취업 준비</option>
              <option>기타</option>
            </select>
          </div>
          <div>
            <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:4px">우선순위</label>
            <select id="prof-fb-priority"
              style="width:100%;border:1px solid #d1d5db;border-radius:8px;padding:8px 10px;font-size:13px">
              <option>중요</option>
              <option>일반</option>
              <option>참고</option>
            </select>
          </div>
        </div>

        <div style="margin-bottom:12px">
          <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:4px">피드백 내용</label>
          <textarea id="prof-fb-content" rows="5"
            style="width:100%;border:1px solid #d1d5db;border-radius:8px;padding:10px;font-size:13px;resize:vertical"
            placeholder="학생에게 전달할 피드백을 입력하세요...&#10;&#10;예) 진로 방향에 대해 잘 정리되어 있습니다. 다만 중기 목표에서 구체적인 활동 계획을 보완하면 더욱 좋겠습니다."></textarea>
        </div>

        <button onclick="saveProfFeedback()"
          style="background:#059669;color:#fff;border:none;border-radius:8px;
            padding:10px 24px;font-size:14px;font-weight:700;cursor:pointer">
          📨 피드백 저장
        </button>
      </div>
    </div>`;
}

function saveProfFeedback() {
  const content = document.getElementById('prof-fb-content')?.value.trim();
  if (!content) { showToast('피드백 내용을 입력해주세요.', 'error'); return; }
  showToast('피드백이 저장되어 학생에게 전달됩니다.', 'success');
  document.getElementById('prof-fb-content').value = '';
}

/* ----------------------------------------------------------
   탭 6: 최종 승인
---------------------------------------------------------- */
function renderProfApproval(el, stu) {
  const port = (PORTFOLIOS[stu.id] || [])[0];
  const isApproved = stu.progressPct >= 90;

  el.innerHTML = `
    <div style="padding:28px 32px;max-width:700px">
      <h3 style="font-size:18px;font-weight:900;color:#111827;margin:0 0 20px">✅ 최종 승인 — ${esc(stu.name)} 학생</h3>

      <!-- 승인 전 체크리스트 -->
      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:20px;margin-bottom:20px">
        <h4 style="font-size:14px;font-weight:800;color:#374151;margin:0 0 14px">📋 승인 전 확인 체크리스트</h4>
        ${[
          ['포트폴리오 초안 작성 완료', !!port],
          ['상담사 검토 완료', (CONSULTATION_LOGS[stu.id]||[]).length > 0],
          ['진단검사 결과 입력', (DIAGNOSES[stu.id]||[]).length > 0],
          ['진로 로드맵 수립', !!port?.shortTermRoadmap],
          ['취업 준비 현황 입력', !!EMPLOYMENT_STATUS[stu.id]],
        ].map(([label, done]) => `
          <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #f3f4f6">
            <span style="font-size:18px">${done ? '✅' : '⬜'}</span>
            <span style="font-size:13px;color:${done ? '#111827' : '#9ca3af'};font-weight:${done?'600':'400'}">${label}</span>
            ${done ? '' : `<span style="font-size:11px;color:#ef4444;margin-left:auto">미완료</span>`}
          </div>`).join('')}
      </div>

      <!-- 최종 의견 -->
      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:20px;margin-bottom:20px">
        <h4 style="font-size:14px;font-weight:800;color:#374151;margin:0 0 12px">💬 최종 승인 의견</h4>
        <textarea id="prof-approval-comment" rows="4"
          style="width:100%;border:1px solid #d1d5db;border-radius:8px;padding:10px;font-size:13px;resize:vertical"
          placeholder="포트폴리오 최종 승인 시 의견을 남겨주세요..."
        >${isApproved ? '진로 방향 및 실행 계획이 적절히 수립되어 최종 승인합니다. 향후 계획대로 진행을 권장합니다.' : ''}</textarea>
      </div>

      <!-- 승인 버튼 -->
      <div style="display:flex;gap:12px">
        <button onclick="doProfApprove('confirm')"
          style="flex:1;background:${isApproved?'#6b7280':'#059669'};color:#fff;border:none;border-radius:10px;
            padding:14px;font-size:15px;font-weight:800;cursor:pointer">
          ${isApproved ? '✅ 이미 승인됨' : '✅ 최종 승인'}
        </button>
        <button onclick="doProfApprove('return')"
          style="flex:1;background:#fff;color:#dc2626;border:1.5px solid #fca5a5;border-radius:10px;
            padding:14px;font-size:15px;font-weight:800;cursor:pointer">
          🔄 반려 (재검토 요청)
        </button>
      </div>

      ${isApproved ? `
        <div style="background:#d1fae5;border:1px solid #6ee7b7;border-radius:10px;padding:14px;margin-top:16px;
          font-size:13px;color:#065f46;text-align:center;font-weight:600">
          ✅ 이 포트폴리오는 최종 승인 완료 상태입니다.
        </div>` : ''}
    </div>`;
}

function doProfApprove(action) {
  const comment = document.getElementById('prof-approval-comment')?.value.trim();
  if (action === 'confirm') {
    if (!comment) { showToast('승인 의견을 입력해주세요.', 'error'); return; }
    showToast('포트폴리오가 최종 승인되었습니다. 학생에게 알림이 전송됩니다.', 'success');
    // 상태 업데이트 (데모)
    const stu = STUDENTS.find(s => s.id === State.currentStudentId);
    if (stu) stu.progressPct = 100;
    setTimeout(() => navigate('prof-detail', { tab: 'approval' }), 1500);
  } else {
    showToast('반려 처리되었습니다. 상담사에게 재검토 요청이 전송됩니다.', 'warning');
  }
}
