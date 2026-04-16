/* ==========================================================
   admin.js — 관리자 화면 (전체 현황 + RAG 업로드 + 사용자 관리 + 통계)
   ========================================================== */

/* ----------------------------------------------------------
   화면 1: 전체 현황 대시보드
---------------------------------------------------------- */
function renderAdminHome() {
  const el = document.getElementById('app-content');
  const total     = STUDENTS.length;
  const riskCount = STUDENTS.filter(s => s.overallStatus === '고위험군').length;
  const warnCount = STUDENTS.filter(s => s.overallStatus === '주의').length;
  const doneCount = STUDENTS.filter(s => s.progressPct >= 90).length;
  const avgPct    = Math.round(STUDENTS.reduce((a, s) => a + s.progressPct, 0) / total);

  // 단계별 분포
  const stages    = ['초기상담','진단검사','활동관리','포트폴리오','취업준비'];
  const stageCounts = stages.map(st => ({ label: stageLabel(st), count: STUDENTS.filter(s => s.currentStage === st).length }));

  el.innerHTML = `
    <div style="padding:28px 32px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
        <div>
          <h2 style="font-size:22px;font-weight:900;color:#111827;margin:0">📊 전체 현황 대시보드</h2>
          <p style="font-size:13px;color:#6b7280;margin:4px 0 0">기준일: 2026.04.16</p>
        </div>
        <button onclick="showToast('데이터가 새로고침되었습니다.','success')"
          style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:8px 16px;
            font-size:13px;font-weight:600;cursor:pointer;color:#374151">
          🔄 새로고침
        </button>
      </div>

      <!-- KPI 카드 -->
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:16px;margin-bottom:28px">
        ${[
          { icon:'👥', label:'전체 학생',   value: total + '명',    color:'#6366f1', bg:'#eef2ff' },
          { icon:'✅', label:'승인 완료',   value: doneCount + '명', color:'#059669', bg:'#d1fae5' },
          { icon:'⚠️', label:'주의 학생',   value: warnCount + '명', color:'#d97706', bg:'#fef3c7' },
          { icon:'🚨', label:'고위험군',    value: riskCount + '명', color:'#dc2626', bg:'#fee2e2' },
          { icon:'📈', label:'평균 진행도', value: avgPct + '%',     color:'#0891b2', bg:'#ecfeff' },
        ].map(k => `
          <div style="background:${k.bg};border-radius:14px;padding:18px;text-align:center">
            <div style="font-size:22px;margin-bottom:4px">${k.icon}</div>
            <div style="font-size:26px;font-weight:900;color:${k.color}">${k.value}</div>
            <div style="font-size:12px;color:#6b7280;font-weight:600;margin-top:4px">${k.label}</div>
          </div>`).join('')}
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:28px">

        <!-- 단계별 분포 -->
        <div style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:22px">
          <h4 style="font-size:14px;font-weight:800;color:#374151;margin:0 0 16px">📋 단계별 학생 분포</h4>
          ${stageCounts.map(s => {
            const pct = Math.round((s.count / total) * 100);
            return `
            <div style="margin-bottom:12px">
              <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px">
                <span style="font-weight:600;color:#374151">${s.label}</span>
                <span style="color:#6b7280">${s.count}명 (${pct}%)</span>
              </div>
              <div style="background:#f3f4f6;border-radius:99px;height:8px">
                <div style="background:linear-gradient(90deg,#6366f1,#8b5cf6);height:8px;border-radius:99px;width:${pct}%"></div>
              </div>
            </div>`;
          }).join('')}
        </div>

        <!-- 최근 활동 피드 -->
        <div style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:22px">
          <h4 style="font-size:14px;font-weight:800;color:#374151;margin:0 0 16px">🕐 최근 활동</h4>
          ${[
            { icon:'📝', text:'김진로 학생 포트폴리오 수정', who:'이상담 상담사', time:'10분 전' },
            { icon:'✅', text:'박지훈 포트폴리오 최종 승인', who:'박교수 교수', time:'1시간 전' },
            { icon:'🔬', text:'이수민 진단검사 결과 업로드', who:'이상담 상담사', time:'2시간 전' },
            { icon:'📤', text:'2026-1 비교과 프로그램 자료 업로드', who:'관리자', time:'어제' },
            { icon:'👤', text:'최유진 신규 학생 등록', who:'이상담 상담사', time:'어제' },
          ].map(a => `
            <div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid #f3f4f6">
              <span style="font-size:18px;flex-shrink:0">${a.icon}</span>
              <div style="flex:1;min-width:0">
                <div style="font-size:13px;color:#111827;font-weight:600">${a.text}</div>
                <div style="font-size:11px;color:#9ca3af;margin-top:2px">${a.who} · ${a.time}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>

      <!-- 학생 전체 현황 테이블 -->
      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden">
        <div style="padding:16px 20px;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center">
          <h4 style="font-size:14px;font-weight:800;color:#374151;margin:0">학생 전체 현황</h4>
          <span style="font-size:12px;color:#6b7280">총 ${total}명</span>
        </div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:13px">
            <thead style="background:#f9fafb">
              <tr>
                ${['이름','학번','학과/학년','진행 단계','진행도','위험도','최근 상담'].map(h =>
                  `<th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;
                    border-bottom:1px solid #e5e7eb;white-space:nowrap">${h}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${STUDENTS.map(s => `
                <tr style="border-bottom:1px solid #f3f4f6" onclick="adminGoToStudent('${s.id}')"
                  style="cursor:pointer" onmouseover="this.style.background='#f9fafb'"
                  onmouseout="this.style.background=''">
                  <td style="padding:10px 14px;font-weight:700;color:#111827">${esc(s.name)}</td>
                  <td style="padding:10px 14px;color:#6b7280">${esc(s.studentId)}</td>
                  <td style="padding:10px 14px;color:#374151">${esc(s.department)} ${s.grade}학년</td>
                  <td style="padding:10px 14px">
                    <span class="badge ${stageBadgeClass(s.currentStage)}">${stageLabel(s.currentStage)}</span>
                  </td>
                  <td style="padding:10px 14px">
                    <div style="display:flex;align-items:center;gap:8px">
                      <div style="background:#f3f4f6;border-radius:99px;height:6px;width:80px;flex-shrink:0">
                        <div style="background:linear-gradient(90deg,#6366f1,#8b5cf6);height:6px;border-radius:99px;width:${s.progressPct}%"></div>
                      </div>
                      <span style="font-size:12px;font-weight:700;color:#374151">${s.progressPct}%</span>
                    </div>
                  </td>
                  <td style="padding:10px 14px">
                    <span class="badge ${statusBadgeClass(s.overallStatus)}">${s.overallStatus}</span>
                  </td>
                  <td style="padding:10px 14px;color:#9ca3af">${fmtDate(s.lastDate)}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
}

function adminGoToStudent(id) {
  // 관리자는 상담사 뷰로 연결
  State.currentStudentId = id;
  navigate('cou-detail', { studentId: id, tab: 'summary' });
}

/* ----------------------------------------------------------
   화면 2: RAG 자료 업로드
---------------------------------------------------------- */
function renderAdminRag() {
  const el = document.getElementById('app-content');

  el.innerHTML = `
    <div style="padding:28px 32px;max-width:960px">
      <div style="margin-bottom:24px">
        <h2 style="font-size:22px;font-weight:900;color:#111827;margin:0">📤 RAG 자료 업로드</h2>
        <p style="font-size:13px;color:#6b7280;margin:4px 0 0">AI가 포트폴리오 생성 시 참고하는 학사·비교과·취업 자료를 관리합니다</p>
      </div>

      <!-- 업로드 영역 -->
      <div id="rag-dropzone"
        style="border:2.5px dashed #c7d2fe;border-radius:16px;padding:40px;text-align:center;
          background:#f5f3ff;margin-bottom:24px;cursor:pointer;transition:all .2s"
        onclick="document.getElementById('rag-file-input').click()"
        ondragover="event.preventDefault();this.style.borderColor='#6366f1';this.style.background='#eef2ff'"
        ondragleave="this.style.borderColor='#c7d2fe';this.style.background='#f5f3ff'">
        <div style="font-size:40px;margin-bottom:12px">📄</div>
        <div style="font-size:16px;font-weight:700;color:#4f46e5;margin-bottom:6px">파일을 드래그하거나 클릭해서 업로드</div>
        <div style="font-size:13px;color:#6b7280">지원 형식: PDF, DOCX, XLSX, TXT · 최대 10MB</div>
        <input type="file" id="rag-file-input" style="display:none" multiple accept=".pdf,.docx,.xlsx,.txt"
          onchange="handleRagUpload(this)">
      </div>

      <!-- 자료 유형 선택 -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px">
        ${[
          { icon:'🏫', label:'학사 정보', desc:'교육과정·교과목·졸업요건', type:'학사', color:'#6366f1' },
          { icon:'🎪', label:'비교과 정보', desc:'프로그램·특강·멘토링', type:'비교과', color:'#0891b2' },
          { icon:'💼', label:'취업 정보', desc:'직무·자격증·로드맵', type:'취업', color:'#059669' },
          { icon:'🔬', label:'진단 자료', desc:'검사 해석·기준표', type:'진단', color:'#d97706' },
        ].map(c => `
          <div onclick="selectRagType('${c.type}',this)"
            data-type="${c.type}"
            style="background:#fff;border:2px solid #e5e7eb;border-radius:12px;padding:16px;
              text-align:center;cursor:pointer;transition:all .15s"
            onmouseover="this.style.borderColor='${c.color}'"
            onmouseout="this.style.borderColor=this.dataset.selected?'${c.color}':'#e5e7eb'">
            <div style="font-size:26px;margin-bottom:6px">${c.icon}</div>
            <div style="font-size:13px;font-weight:800;color:#374151">${c.label}</div>
            <div style="font-size:11px;color:#9ca3af;margin-top:2px">${c.desc}</div>
          </div>`).join('')}
      </div>

      <!-- 기존 자료 목록 -->
      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden">
        <div style="padding:16px 20px;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center">
          <h4 style="font-size:14px;font-weight:800;color:#374151;margin:0">📚 업로드된 자료 목록</h4>
          <div style="display:flex;gap:8px">
            <select id="rag-filter" onchange="filterRagList()"
              style="border:1px solid #e5e7eb;border-radius:6px;padding:4px 10px;font-size:12px;color:#374151">
              <option value="전체">전체</option>
              <option value="학사">학사</option>
              <option value="비교과">비교과</option>
              <option value="취업">취업</option>
              <option value="진단">진단</option>
            </select>
          </div>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead style="background:#f9fafb">
            <tr>
              ${['파일명','유형','업로드일','파일 크기','상태','관리'].map(h =>
                `<th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;
                  border-bottom:1px solid #e5e7eb">${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody id="rag-table-body">
            ${renderRagRows(RAG_MATERIALS)}
          </tbody>
        </table>
      </div>

      <!-- 프롬프트 설정 -->
      <div style="background:#fff;border:1.5px solid #fde68a;border-radius:14px;padding:22px;margin-top:20px">
        <h4 style="font-size:14px;font-weight:800;color:#92400e;margin:0 0 12px">⚙️ AI 프롬프트 설정</h4>
        <p style="font-size:13px;color:#6b7280;margin:0 0 12px">
          포트폴리오 자동 생성 시 AI에게 전달되는 시스템 지시문입니다. 학교 특성에 맞게 수정할 수 있습니다.
        </p>
        <textarea id="admin-prompt" rows="5"
          style="width:100%;border:1px solid #d1d5db;border-radius:8px;padding:10px;font-size:13px;
            resize:vertical;font-family:monospace">당신은 명지전문대학교 AI융합진로지원센터의 진로 포트폴리오 생성 AI입니다.
학생의 진단검사 결과, 학업 현황, 희망 직무를 바탕으로
구체적이고 실행 가능한 진로 로드맵과 포트폴리오를 생성해주세요.
학교의 교육과정과 비교과 프로그램을 적극 연계하여 추천하세요.</textarea>
        <div style="display:flex;gap:8px;margin-top:10px">
          <button onclick="showToast('프롬프트가 저장되었습니다.','success')"
            style="background:#d97706;color:#fff;border:none;border-radius:8px;
              padding:8px 18px;font-size:13px;font-weight:700;cursor:pointer">
            💾 저장
          </button>
          <button onclick="showToast('기본값으로 복원되었습니다.','info')"
            style="background:#fff;color:#374151;border:1px solid #d1d5db;border-radius:8px;
              padding:8px 18px;font-size:13px;font-weight:600;cursor:pointer">
            복원
          </button>
        </div>
      </div>
    </div>`;
}

function renderRagRows(materials) {
  const typeColors = { '학사':'badge-purple', '비교과':'badge-blue', '취업':'badge-green', '진단':'badge-yellow' };
  return materials.map(r => `
    <tr style="border-bottom:1px solid #f3f4f6">
      <td style="padding:10px 14px;font-weight:600;color:#111827">📄 ${esc(r.title)}</td>
      <td style="padding:10px 14px"><span class="badge ${typeColors[r.type]||'badge-gray'}">${r.type}</span></td>
      <td style="padding:10px 14px;color:#6b7280">${fmtDate(r.uploadedAt)}</td>
      <td style="padding:10px 14px;color:#6b7280">${r.size}</td>
      <td style="padding:10px 14px">
        <span style="background:#d1fae5;color:#065f46;font-size:11px;font-weight:700;
          padding:2px 8px;border-radius:99px">${r.status}</span>
      </td>
      <td style="padding:10px 14px">
        <div style="display:flex;gap:6px">
          <button onclick="showToast('자료를 다운로드합니다.','info')"
            style="background:#eff6ff;color:#2563eb;border:none;border-radius:6px;
              padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer">다운로드</button>
          <button onclick="deleteRagItem('${r.id}')"
            style="background:#fff0f0;color:#dc2626;border:none;border-radius:6px;
              padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer">삭제</button>
        </div>
      </td>
    </tr>`).join('');
}

function filterRagList() {
  const type = document.getElementById('rag-filter')?.value || '전체';
  const filtered = type === '전체' ? RAG_MATERIALS : RAG_MATERIALS.filter(r => r.type === type);
  document.getElementById('rag-table-body').innerHTML = renderRagRows(filtered);
}

function selectRagType(type, el) {
  document.querySelectorAll('[data-type]').forEach(d => {
    d.style.borderColor = '#e5e7eb';
    d.style.background = '#fff';
    delete d.dataset.selected;
  });
  el.style.borderColor = '#6366f1';
  el.style.background = '#eef2ff';
  el.dataset.selected = '1';
  showToast(`자료 유형 "${type}"이 선택되었습니다.`, 'info');
}

function handleRagUpload(input) {
  if (!input.files.length) return;
  const file = input.files[0];
  showToast(`"${file.name}" 업로드 중...`, 'info');
  setTimeout(() => {
    const newItem = {
      id: 'rag-' + Date.now(),
      title: file.name.replace(/\.[^.]+$/, ''),
      type: '학사',
      uploadedAt: '2026-04-16',
      size: (file.size / 1024 / 1024).toFixed(1) + 'MB',
      status: '활성',
    };
    RAG_MATERIALS.unshift(newItem);
    document.getElementById('rag-table-body').innerHTML = renderRagRows(RAG_MATERIALS);
    showToast(`"${file.name}" 업로드 완료! AI 인덱싱 중입니다.`, 'success');
  }, 1500);
}

function deleteRagItem(id) {
  const idx = RAG_MATERIALS.findIndex(r => r.id === id);
  if (idx >= 0) {
    RAG_MATERIALS.splice(idx, 1);
    document.getElementById('rag-table-body').innerHTML = renderRagRows(RAG_MATERIALS);
    showToast('자료가 삭제되었습니다.', 'success');
  }
}

/* ----------------------------------------------------------
   화면 3: 사용자·권한 관리
---------------------------------------------------------- */
function renderAdminUsers() {
  const el = document.getElementById('app-content');

  el.innerHTML = `
    <div style="padding:28px 32px;max-width:960px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
        <div>
          <h2 style="font-size:22px;font-weight:900;color:#111827;margin:0">👤 사용자·권한 관리</h2>
          <p style="font-size:13px;color:#6b7280;margin:4px 0 0">상담사·교수·관리자 계정 및 학생 담당 배정 관리</p>
        </div>
        <button onclick="openAddUserModal()"
          style="background:#6366f1;color:#fff;border:none;border-radius:8px;
            padding:10px 18px;font-size:13px;font-weight:700;cursor:pointer">
          + 사용자 추가
        </button>
      </div>

      <!-- 사용자 목록 -->
      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;margin-bottom:24px">
        <div style="padding:16px 20px;border-bottom:1px solid #e5e7eb">
          <h4 style="font-size:14px;font-weight:800;color:#374151;margin:0">시스템 사용자 목록</h4>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead style="background:#f9fafb">
            <tr>
              ${['이름','이메일','권한','상태','관리'].map(h =>
                `<th style="padding:10px 16px;text-align:left;font-weight:700;color:#374151;
                  border-bottom:1px solid #e5e7eb">${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody id="user-table-body">
            ${renderUserRows(SYSTEM_USERS)}
          </tbody>
        </table>
      </div>

      <!-- 학생 담당 배정 -->
      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;margin-bottom:24px">
        <div style="padding:16px 20px;border-bottom:1px solid #e5e7eb">
          <h4 style="font-size:14px;font-weight:800;color:#374151;margin:0">🔗 학생 담당 배정</h4>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead style="background:#f9fafb">
            <tr>
              ${['학생','학과/학년','담당 상담사','담당 교수','변경'].map(h =>
                `<th style="padding:10px 16px;text-align:left;font-weight:700;color:#374151;
                  border-bottom:1px solid #e5e7eb">${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${STUDENTS.map(s => `
              <tr style="border-bottom:1px solid #f3f4f6">
                <td style="padding:10px 16px;font-weight:700;color:#111827">${esc(s.name)}</td>
                <td style="padding:10px 16px;color:#6b7280">${esc(s.department)} ${s.grade}학년</td>
                <td style="padding:10px 16px">
                  <select style="border:1px solid #e5e7eb;border-radius:6px;padding:4px 8px;font-size:12px">
                    <option selected>${esc(s.counselor)}</option>
                    <option>최상담</option>
                  </select>
                </td>
                <td style="padding:10px 16px">
                  <select style="border:1px solid #e5e7eb;border-radius:6px;padding:4px 8px;font-size:12px">
                    <option selected>박교수</option>
                    <option>김교수</option>
                  </select>
                </td>
                <td style="padding:10px 16px">
                  <button onclick="showToast('담당 배정이 저장되었습니다.','success')"
                    style="background:#eff6ff;color:#2563eb;border:none;border-radius:6px;
                      padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer">저장</button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>

      <!-- 권한 설명 -->
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:20px">
        <h4 style="font-size:14px;font-weight:800;color:#374151;margin:0 0 14px">🔐 권한 체계</h4>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">
          ${[
            { role:'학생', color:'#7c3aed', bg:'#f5f3ff', perms:['포트폴리오 조회','챗봇 입력','PDF 출력'] },
            { role:'상담사', color:'#0891b2', bg:'#ecfeff', perms:['학생 정보 조회','AI 초안 수정','상담 일지 입력'] },
            { role:'교수', color:'#059669', bg:'#d1fae5', perms:['포트폴리오 최종 승인','피드백 작성','수강 추천 수정'] },
            { role:'관리자', color:'#d97706', bg:'#fef3c7', perms:['전체 관리','RAG 업로드','권한 설정','통계 열람'] },
          ].map(r => `
            <div style="background:${r.bg};border-radius:10px;padding:14px">
              <div style="font-size:13px;font-weight:800;color:${r.color};margin-bottom:8px">${r.role}</div>
              ${r.perms.map(p => `<div style="font-size:12px;color:#374151;padding:2px 0">• ${p}</div>`).join('')}
            </div>`).join('')}
        </div>
      </div>
    </div>`;
}

function renderUserRows(users) {
  const roleBadge = { counselor:'badge-blue', professor:'badge-green', admin:'badge-yellow' };
  const roleLabel = { counselor:'상담사', professor:'교수', admin:'관리자' };
  return users.map(u => `
    <tr style="border-bottom:1px solid #f3f4f6">
      <td style="padding:10px 16px">
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:32px;height:32px;border-radius:50%;background:#e0e7ff;
            display:flex;align-items:center;justify-content:center;font-weight:700;color:#6366f1;font-size:14px">
            ${u.name[0]}
          </div>
          <span style="font-weight:700;color:#111827">${esc(u.name)}</span>
        </div>
      </td>
      <td style="padding:10px 16px;color:#6b7280">${esc(u.email)}</td>
      <td style="padding:10px 16px">
        <span class="badge ${roleBadge[u.role]||'badge-gray'}">${roleLabel[u.role]||u.role}</span>
      </td>
      <td style="padding:10px 16px">
        <span style="background:${u.isActive?'#d1fae5':'#f3f4f6'};color:${u.isActive?'#065f46':'#9ca3af'};
          font-size:11px;font-weight:700;padding:2px 8px;border-radius:99px">
          ${u.isActive ? '활성' : '비활성'}
        </span>
      </td>
      <td style="padding:10px 16px">
        <div style="display:flex;gap:6px">
          <button onclick="showToast('권한을 수정합니다.','info')"
            style="background:#eff6ff;color:#2563eb;border:none;border-radius:6px;
              padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer">수정</button>
          <button onclick="toggleUserActive('${u.id}',${u.isActive})"
            style="background:${u.isActive?'#fff0f0':'#f0fdf4'};color:${u.isActive?'#dc2626':'#059669'};
              border:none;border-radius:6px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer">
            ${u.isActive ? '비활성화' : '활성화'}
          </button>
        </div>
      </td>
    </tr>`).join('');
}

function toggleUserActive(id, current) {
  const user = SYSTEM_USERS.find(u => u.id === id);
  if (user) {
    user.isActive = !current;
    document.getElementById('user-table-body').innerHTML = renderUserRows(SYSTEM_USERS);
    showToast(`계정이 ${user.isActive ? '활성화' : '비활성화'}되었습니다.`, 'success');
  }
}

function openAddUserModal() {
  openModal(`
    <div style="padding:28px">
      <h3 style="font-size:17px;font-weight:900;color:#111827;margin:0 0 20px">+ 새 사용자 추가</h3>
      <div style="display:grid;gap:14px">
        <div>
          <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:4px">이름</label>
          <input id="new-user-name" type="text" placeholder="홍길동"
            style="width:100%;border:1px solid #d1d5db;border-radius:8px;padding:8px 12px;font-size:13px">
        </div>
        <div>
          <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:4px">이메일</label>
          <input id="new-user-email" type="email" placeholder="example@mjc.ac.kr"
            style="width:100%;border:1px solid #d1d5db;border-radius:8px;padding:8px 12px;font-size:13px">
        </div>
        <div>
          <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:4px">권한</label>
          <select id="new-user-role"
            style="width:100%;border:1px solid #d1d5db;border-radius:8px;padding:8px 12px;font-size:13px">
            <option value="counselor">상담사</option>
            <option value="professor">교수</option>
            <option value="admin">관리자</option>
          </select>
        </div>
      </div>
      <div style="display:flex;gap:10px;margin-top:20px">
        <button onclick="addNewUser()"
          style="flex:1;background:#6366f1;color:#fff;border:none;border-radius:8px;
            padding:10px;font-size:14px;font-weight:700;cursor:pointer">추가</button>
        <button onclick="closeModal()"
          style="flex:1;background:#fff;color:#374151;border:1px solid #d1d5db;border-radius:8px;
            padding:10px;font-size:14px;font-weight:600;cursor:pointer">취소</button>
      </div>
    </div>`, 'modal-sm');
}

function addNewUser() {
  const name  = document.getElementById('new-user-name')?.value.trim();
  const email = document.getElementById('new-user-email')?.value.trim();
  const role  = document.getElementById('new-user-role')?.value;
  if (!name || !email) { showToast('이름과 이메일을 입력해주세요.', 'error'); return; }
  SYSTEM_USERS.push({ id: 'u-' + Date.now(), name, email, role, isActive: true });
  closeModal();
  renderAdminUsers();
  showToast(`"${name}" 계정이 추가되었습니다.`, 'success');
}

/* ----------------------------------------------------------
   화면 4: 통계
---------------------------------------------------------- */
function renderAdminStats() {
  const el = document.getElementById('app-content');

  const total   = STUDENTS.length;
  const byDept  = {};
  const byStage = {};
  const byGoal  = {};

  STUDENTS.forEach(s => {
    byDept[s.department]   = (byDept[s.department] || 0) + 1;
    byStage[s.currentStage] = (byStage[s.currentStage] || 0) + 1;
    byGoal[s.careerGoal || '기타'] = (byGoal[s.careerGoal || '기타'] || 0) + 1;
  });

  const barColors = ['#6366f1','#0891b2','#059669','#d97706','#dc2626','#8b5cf6'];

  function barChart(data, colors) {
    const max = Math.max(...Object.values(data));
    return Object.entries(data).map(([k, v], i) => `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div style="width:110px;font-size:12px;color:#374151;font-weight:600;text-align:right;
          flex-shrink:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(k)}</div>
        <div style="flex:1;background:#f3f4f6;border-radius:99px;height:22px;overflow:hidden">
          <div style="background:${colors[i % colors.length]};height:22px;border-radius:99px;
            width:${Math.round((v/max)*100)}%;display:flex;align-items:center;padding-left:8px;
            transition:width .3s">
            <span style="font-size:11px;font-weight:700;color:#fff">${v}명</span>
          </div>
        </div>
      </div>`).join('');
  }

  el.innerHTML = `
    <div style="padding:28px 32px;max-width:960px">
      <div style="margin-bottom:24px">
        <h2 style="font-size:22px;font-weight:900;color:#111827;margin:0">📈 통계</h2>
        <p style="font-size:13px;color:#6b7280;margin:4px 0 0">2026학년도 1학기 기준 · 전체 ${total}명</p>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">

        <!-- 학과별 분포 -->
        <div style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:22px">
          <h4 style="font-size:14px;font-weight:800;color:#374151;margin:0 0 16px">🏫 학과별 학생 수</h4>
          ${barChart(byDept, barColors)}
        </div>

        <!-- 단계별 분포 -->
        <div style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:22px">
          <h4 style="font-size:14px;font-weight:800;color:#374151;margin:0 0 16px">📋 진행 단계별 분포</h4>
          ${barChart(
            Object.fromEntries(Object.entries(byStage).map(([k, v]) => [stageLabel(k), v])),
            ['#6366f1','#0891b2','#059669','#d97706','#dc2626']
          )}
        </div>

        <!-- 진로 목표 분포 -->
        <div style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:22px">
          <h4 style="font-size:14px;font-weight:800;color:#374151;margin:0 0 16px">🎯 진로 목표 분포</h4>
          ${barChart(byGoal, ['#059669','#6366f1','#d97706','#dc2626'])}
        </div>

        <!-- 위험도 분포 -->
        <div style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:22px">
          <h4 style="font-size:14px;font-weight:800;color:#374151;margin:0 0 16px">🚨 위험도 현황</h4>
          ${(() => {
            const risk = { '일반': 0, '주의': 0, '고위험군': 0 };
            STUDENTS.forEach(s => { risk[s.overallStatus] = (risk[s.overallStatus]||0)+1; });
            const colors = { '일반':'#059669', '주의':'#d97706', '고위험군':'#dc2626' };
            return Object.entries(risk).map(([k, v]) => `
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
                <span class="badge ${statusBadgeClass(k)}" style="width:60px;text-align:center">${k}</span>
                <div style="flex:1;background:#f3f4f6;border-radius:99px;height:22px;overflow:hidden">
                  <div style="background:${colors[k]};height:22px;border-radius:99px;
                    width:${Math.round((v/total)*100)}%;display:flex;align-items:center;padding-left:8px">
                    <span style="font-size:11px;font-weight:700;color:#fff">${v}명 (${Math.round(v/total*100)}%)</span>
                  </div>
                </div>
              </div>`).join('');
          })()}

          <!-- 월별 상담 현황 (샘플 데이터) -->
          <h4 style="font-size:14px;font-weight:800;color:#374151;margin:20px 0 14px">📅 월별 상담 건수</h4>
          ${[
            { month:'1월', count:8 }, { month:'2월', count:15 },
            { month:'3월', count:22 }, { month:'4월', count:12 },
          ].map(m => `
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
              <div style="width:30px;font-size:12px;color:#374151;font-weight:600;text-align:right;flex-shrink:0">${m.month}</div>
              <div style="flex:1;background:#f3f4f6;border-radius:99px;height:18px;overflow:hidden">
                <div style="background:linear-gradient(90deg,#6366f1,#8b5cf6);height:18px;border-radius:99px;
                  width:${Math.round(m.count/22*100)}%;display:flex;align-items:center;padding-left:6px">
                  <span style="font-size:10px;font-weight:700;color:#fff">${m.count}건</span>
                </div>
              </div>
            </div>`).join('')}
        </div>
      </div>

      <!-- 내보내기 -->
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:18px;
        display:flex;align-items:center;justify-content:space-between">
        <div>
          <div style="font-size:14px;font-weight:700;color:#374151">데이터 내보내기</div>
          <div style="font-size:12px;color:#9ca3af;margin-top:2px">학생 현황 및 통계 데이터를 엑셀·PDF로 다운로드</div>
        </div>
        <div style="display:flex;gap:10px">
          <button onclick="showToast('엑셀 파일을 다운로드합니다.','success')"
            style="background:#059669;color:#fff;border:none;border-radius:8px;
              padding:8px 16px;font-size:13px;font-weight:700;cursor:pointer">
            📊 Excel 다운로드
          </button>
          <button onclick="showToast('PDF 리포트를 생성합니다.','success')"
            style="background:#6366f1;color:#fff;border:none;border-radius:8px;
              padding:8px 16px;font-size:13px;font-weight:700;cursor:pointer">
            📄 PDF 리포트
          </button>
        </div>
      </div>
    </div>`;
}
