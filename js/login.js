/* login.js — 로그인 화면 (3단계에서 완성) */
function renderLoginScreen() {
  const el = document.getElementById('screen-login');
  el.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;
      background:linear-gradient(135deg,#1e1b4b 0%,#4f46e5 50%,#7c3aed 100%);padding:20px">
      <div style="background:#fff;border-radius:24px;padding:44px 40px;width:100%;max-width:460px;
        box-shadow:0 25px 50px rgba(0,0,0,.3)">
        <div style="text-align:center;margin-bottom:32px">
          <div style="width:64px;height:64px;background:linear-gradient(135deg,#4f46e5,#7c3aed);
            border-radius:18px;display:inline-flex;align-items:center;justify-content:center;
            font-size:28px;margin-bottom:12px">🎓</div>
          <h1 style="font-size:22px;font-weight:900;color:#111827">M-Cap</h1>
          <p style="font-size:13px;color:#6b7280;margin-top:4px">진로·취업 통합관리 시스템</p>
        </div>

        <p style="font-size:13px;font-weight:700;color:#374151;margin-bottom:14px;text-align:center">
          사용자 유형을 선택해주세요
        </p>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:28px">
          ${[
            { role:'student',   emoji:'🧑‍🎓', name:'학생',   desc:'포트폴리오·챗봇' },
            { role:'counselor', emoji:'💼',   name:'상담사', desc:'학생 관리·편집' },
            { role:'professor', emoji:'👨‍🏫', name:'교수',   desc:'열람·승인' },
            { role:'admin',     emoji:'⚙️',   name:'관리자', desc:'시스템 전체' },
          ].map(u => `
            <div onclick="doLogin('${u.role}')"
              style="border:2px solid #e5e7eb;border-radius:14px;padding:18px 14px;text-align:center;
                cursor:pointer;transition:all .2s;"
              onmouseover="this.style.borderColor='#4f46e5';this.style.background='#eef2ff'"
              onmouseout="this.style.borderColor='#e5e7eb';this.style.background='#fff'">
              <div style="font-size:28px;margin-bottom:8px">${u.emoji}</div>
              <div style="font-size:15px;font-weight:800;color:#1f2937">${u.name}</div>
              <div style="font-size:11px;color:#9ca3af;margin-top:3px">${u.desc}</div>
            </div>
          `).join('')}
        </div>

        <p style="font-size:12px;color:#9ca3af;text-align:center">
          ※ 프로토타입: 클릭만으로 로그인됩니다
        </p>
      </div>
    </div>`;
}
