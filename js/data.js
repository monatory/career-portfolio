/* ==========================================================
   data.js — 샘플 데이터 & 전역 상태
   ========================================================== */

/* ----------------------------------------------------------
   전역 상태 (State)
---------------------------------------------------------- */
const State = {
  currentRole: null,          // 'student' | 'counselor' | 'professor' | 'admin'
  currentUser: null,          // 로그인한 사용자 객체
  currentStudentId: null,     // 상담사·교수가 보고 있는 학생 ID
  currentTab: null,           // 상담사 상세 화면 탭
  currentPage: null,          // 현재 페이지 이름
  stuOnboardingDone: false,   // 학생 온보딩 완료 여부 (false면 첫 로그인 시 온보딩으로)
};

/* ----------------------------------------------------------
   사용자 계정 (로그인용)
---------------------------------------------------------- */
const USERS = {
  student: {
    id: 'stu-001',
    role: 'student',
    name: '김진로',
    studentId: '2024001234',
    department: 'AI소프트웨어학과',
    grade: 3,
    counselor: '이상담',
    email: 'jinro@mjc.ac.kr',
    phone: '010-1234-5678',
    gender: '여',
    avatarColor: '#7c3aed',
  },
  counselor: {
    id: 'cou-001',
    role: 'counselor',
    name: '이상담',
    email: 'counselor@mjc.ac.kr',
    avatarColor: '#0891b2',
  },
  professor: {
    id: 'pro-001',
    role: 'professor',
    name: '박교수',
    email: 'professor@mjc.ac.kr',
    avatarColor: '#059669',
  },
  admin: {
    id: 'adm-001',
    role: 'admin',
    name: '관리자',
    email: 'admin@mjc.ac.kr',
    avatarColor: '#d97706',
  },
};

/* ----------------------------------------------------------
   학생 목록 (상담사·교수·관리자용)
---------------------------------------------------------- */
const STUDENTS = [
  {
    id: 'stu-001',
    studentId: '2024001234',
    name: '김진로',
    gender: '여',
    department: 'AI소프트웨어학과',
    grade: 3,
    counselor: '이상담',
    currentStage: '포트폴리오',
    progressPct: 78,
    lastDate: '2026-03-15',
    firstDate: '2026-02-10',
    phone: '010-1234-5678',
    email: 'jinro@mjc.ac.kr',
    memo: '진로 방향 재설정 중. 데이터 분석 분야 관심 높음.',
    overallStatus: '주의',
    careerGoal: '취업',
    desiredJob: '데이터 분석가',
  },
  {
    id: 'stu-002',
    studentId: '2024002345',
    name: '이수민',
    gender: '남',
    department: '경영학과',
    grade: 2,
    counselor: '이상담',
    currentStage: '진단검사',
    progressPct: 45,
    lastDate: '2026-03-12',
    firstDate: '2026-02-20',
    phone: '010-2345-6789',
    email: 'sumin@mjc.ac.kr',
    memo: '진로 목표 불명확. 추가 탐색 필요.',
    overallStatus: '주의',
    careerGoal: '진학',
    desiredJob: '경영 컨설턴트',
  },
  {
    id: 'stu-003',
    studentId: '2023003456',
    name: '박지훈',
    gender: '남',
    department: '전기전자공학과',
    grade: 4,
    counselor: '이상담',
    currentStage: '취업준비',
    progressPct: 91,
    lastDate: '2026-03-10',
    firstDate: '2025-09-05',
    phone: '010-3456-7890',
    email: 'jihun@mjc.ac.kr',
    memo: '취업 준비 적극적. 삼성전자 목표.',
    overallStatus: '일반',
    careerGoal: '취업',
    desiredJob: '회로 설계 엔지니어',
  },
  {
    id: 'stu-004',
    studentId: '2025004567',
    name: '최유진',
    gender: '여',
    department: '심리학과',
    grade: 1,
    counselor: '이상담',
    currentStage: '초기상담',
    progressPct: 20,
    lastDate: '2026-03-08',
    firstDate: '2026-03-08',
    phone: '010-4567-8901',
    email: 'yujin@mjc.ac.kr',
    memo: '부모 압박으로 학과 선정. 본인 의지 탐색 필요.',
    overallStatus: '고위험군',
    careerGoal: '기타',
    desiredJob: '미정',
  },
  {
    id: 'stu-005',
    studentId: '2024005678',
    name: '정민수',
    gender: '남',
    department: 'AI소프트웨어학과',
    grade: 3,
    counselor: '이상담',
    currentStage: '활동관리',
    progressPct: 62,
    lastDate: '2026-03-05',
    firstDate: '2026-01-15',
    phone: '010-5678-9012',
    email: 'minsu@mjc.ac.kr',
    memo: 'AI 스타트업 창업 희망. 아이디어 구체화 중.',
    overallStatus: '일반',
    careerGoal: '창업',
    desiredJob: 'AI 스타트업 창업',
  },
];

/* ----------------------------------------------------------
   초기 상담 데이터
---------------------------------------------------------- */
const INITIAL_CONSULTATIONS = {
  'stu-001': {
    id: 'ic-001',
    studentId: 'stu-001',
    date: '2026-02-10',
    counselor: '이상담',
    method: '대면',
    deptType: '일반학과',
    firstChoiceDept: 'AI소프트웨어학과',
    secondChoiceDept: '컴퓨터공학과',
    mbti: 'ISTJ',
    mbtiCheckMethod: '공식 검사',
    healthStatus: '매우 좋음',
    healthMemo: '특이사항 없음',
    psychologicalStatus: '안정적',
    lifeStatus: '규칙적',
    careerGoal: '취업',
    careerGoalConfidence: '보통',
    careerGoalDetail: '데이터 분석가 또는 AI 엔지니어로 취업하고 싶습니다.',
    careerPreparationLevel: '준비 중 (활동 진행 중)',
    decisionMaker: '본인',
    memo: '진로 방향에 대해 고민이 많으나 방향성은 어느 정도 잡혀 있음. 데이터 분야 관심 집중적.',
  },
  'stu-002': {
    id: 'ic-002',
    studentId: 'stu-002',
    date: '2026-02-20',
    counselor: '이상담',
    method: '비대면',
    deptType: '일반학과',
    firstChoiceDept: '경영학과',
    secondChoiceDept: '경제학과',
    mbti: 'ENFP',
    mbtiCheckMethod: '인터넷 검사',
    healthStatus: '보통',
    healthMemo: '',
    psychologicalStatus: '약간 불안',
    lifeStatus: '보통',
    careerGoal: '진학',
    careerGoalConfidence: '낮음',
    careerGoalDetail: '대학원 진학을 고려 중이나 확실하지 않음.',
    careerPreparationLevel: '기초 단계 (정보 탐색 수준)',
    decisionMaker: '부모',
    memo: '부모님 의견으로 진학을 고려 중. 본인 의지 확인 필요.',
  },
};

/* ----------------------------------------------------------
   진단검사 데이터
---------------------------------------------------------- */
const DIAGNOSES = {
  'stu-001': [
    {
      id: 'diag-001',
      studentId: 'stu-001',
      date: '2026-03-05',
      testType: '성격/심리 검사',
      psychTest: {
        sociability: 29,
        receptivity: 73,
        sincerity: 70,
        responsibility: 70,
        goalOrientation: 20,
        anxiety: 57,
        depression: 0,
        followUpRequired: true,
      },
      lifeHistory: {
        interpersonal: 50,
        independence: 62,
        academics: 75,
        ambition: 30,
        sportsPreference: 45,
      },
      interpretationMemo: '관습형(C) 30성, 현실형(R) 19점으로 가장 높게 나타나며, 조직적이고 안정적이며 실물적인 업무를 선호하는 성향입니다. 포감성(73)과 성실성(70)이 높으나, 사교성(29)이 낮고 목표지향성(20)이 평균 이하로 나타났습니다.',
      coachingMemo: '사교성이 낮으므로 그룹 활동보다는 1:1 상담 방식이 효과적입니다. 목표지향성 부족으로 단기 성취 목표를 함께 설정하는 코칭이 필요합니다.',
      overallStatus: '주의',
      // 학생용 AI 해석 (따뜻한 버전)
      studentInterpretation: {
        headline: '당신은 ✨ 섬세하고 성실한 분석가예요',
        strengths: ['꼼꼼한 업무 처리', '높은 성실성', '배려심 깊음', '학업 집중력'],
        description: '데이터를 꼼꼼하게 분석하고 맡은 일을 끝까지 해내는 힘이 있어요. 혼자서도 집중해서 일하는 걸 잘하는 타입이에요 💪',
        growthPoint: '새로운 사람들과 교류하는 경험을 조금씩 늘려가면, 지금보다 훨씬 더 많은 기회가 생길 거예요. 목표를 작게 쪼개서 하나씩 달성해보세요 🎯',
      },
    },
    {
      id: 'diag-002',
      studentId: 'stu-001',
      date: '2026-03-10',
      testType: '직업선호도검사 L형',
      jobTest: {
        rank1: '컴퓨터공학 관련직',
        rank2: '정보시스템 관련직',
        rank3: '데이터 분석가',
        recommendedJobs: '데이터 분석가, 정보보안 전문가, AI 엔지니어, 시스템 개발자',
        memo: '검사 결과 IT·데이터 관련 직군에 높은 적합도를 보임.',
      },
      lifeHistory: null,
      psychTest: null,
      interpretationMemo: '직업선호도 상위 3개 직종 모두 IT·데이터 분야로 수렴. 희망 직무(데이터 분석가)와 높은 일치도.',
      coachingMemo: '현재 진로 방향(데이터 분석가)이 검사 결과와 잘 일치함. 관련 자격증 준비 및 프로젝트 경험 확대 권장.',
      overallStatus: '일반',
      studentInterpretation: {
        headline: '🎯 당신의 진로 방향이 딱 맞아요!',
        strengths: ['IT·데이터 분야 적합도 최상위', '논리적 사고 강점', '분석 성향'],
        description: '검사 결과 데이터 분석가, AI 엔지니어 직군이 상위에 올랐어요. 지금 생각하는 방향이 정말 잘 맞는 거예요! 🙌',
        growthPoint: '관련 자격증(ADsP, SQLD)을 준비하고, 포트폴리오 프로젝트를 하나씩 쌓아가면 취업 경쟁력이 확실히 올라갈 거예요.',
      },
    },
  ],
  'stu-002': [
    {
      id: 'diag-003',
      studentId: 'stu-002',
      date: '2026-03-12',
      testType: '성격/심리 검사',
      psychTest: {
        sociability: 68,
        receptivity: 80,
        sincerity: 55,
        responsibility: 60,
        goalOrientation: 35,
        anxiety: 72,
        depression: 20,
        followUpRequired: true,
      },
      lifeHistory: {
        interpersonal: 70,
        independence: 40,
        academics: 55,
        ambition: 45,
        sportsPreference: 60,
      },
      interpretationMemo: '사회형(S) 성향이 강하게 나타남. 불안 수준이 다소 높아 추가 심리 지원이 필요할 수 있음.',
      coachingMemo: '불안 지수 높음. 정기적 상담 유지 필요. 목표지향성 낮으므로 단계별 목표 설정 지원.',
      overallStatus: '주의',
      studentInterpretation: {
        headline: '💛 당신은 따뜻한 소통의 달인이에요',
        strengths: ['뛰어난 사교성', '공감 능력', '대인관계 스킬'],
        description: '사람과 함께하는 것을 좋아하고 공감 능력이 뛰어나요. 팀워크가 필요한 환경에서 빛을 발하는 타입이에요!',
        growthPoint: '불안함을 느낄 때는 혼자 고민하지 말고 상담사 선생님과 이야기 나눠보세요. 작은 목표부터 하나씩 해보는 게 도움이 될 거예요 💪',
      },
    },
  ],
};

/* ----------------------------------------------------------
   포트폴리오 데이터
---------------------------------------------------------- */
const PORTFOLIOS = {
  'stu-001': [
    {
      id: 'port-001',
      studentId: 'stu-001',
      year: '2026',
      semester: '1',
      version: 2,
      date: '2026-03-20',
      currentStage: '진로설정',
      isFinal: false,
      counselorOpinion: '데이터 분석가 진로 방향에 적합한 로드맵 수립. 자격증 준비와 프로젝트 경험을 병행 추천.',
      shortTermRoadmap: {
        goal: '데이터 분석 기초 역량 확보',
        schedule: '2026년 1학기',
        coreActivities: 'ADsP 자격증 준비, 머신러닝 수강, Python 스터디 참여',
      },
      midTermRoadmap: {
        goal: '실무 프로젝트 경험 및 포트폴리오 완성',
        schedule: '2026년 2학기 ~ 2027년 1학기',
        coreActivities: '캡스톤 디자인 프로젝트, 공모전 참가, 인턴십 준비',
      },
      longTermRoadmap: {
        goal: '데이터 분석가 취업 또는 AI 대학원 진학',
        schedule: '2027년 2학기',
        coreActivities: '취업 준비 완성, 이력서·포트폴리오 제출, 면접 대비',
      },
      actionPlans: [
        { id: 'ap-001', category: '자격증', activityName: 'ADsP 취득', goal: '데이터 분석 자격증 취득', schedule: '2026.05', isCompleted: false, note: '1회 응시 목표' },
        { id: 'ap-002', category: '학업', activityName: '머신러닝 기초 수강', goal: '핵심 직무 역량 강화', schedule: '2026.03~06', isCompleted: false, note: 'B+ 이상 목표' },
        { id: 'ap-003', category: '비교과', activityName: 'AI 특강 참여', goal: '최신 트렌드 학습', schedule: '2026.04.22', isCompleted: false, note: '' },
        { id: 'ap-004', category: '취업', activityName: '취업캠프 참가', goal: '취업 준비 전략 수립', schedule: '2026.05.10', isCompleted: false, note: '데이터/IT 직군' },
      ],
    },
  ],
};

/* ----------------------------------------------------------
   상담일지 데이터
---------------------------------------------------------- */
const CONSULTATION_LOGS = {
  'stu-001': [
    {
      id: 'log-001',
      studentId: 'stu-001',
      date: '2026-03-15',
      sessionNumber: 3,
      type: '진로 상담',
      content: '데이터 분석가 진로 방향 확정 논의. 희망 직무를 AI 엔지니어에서 데이터 분석가로 좁히기로 함. 관련 자격증(ADsP) 준비 계획 수립.',
      actions: 'ADsP 시험 일정 확인 및 응시 등록 권고. 머신러닝 기초 수강 신청 확인.',
      nextDate: '2026-04-05',
      authorEmail: 'counselor@mjc.ac.kr',
      followUpRequired: false,
      createdAt: '2026-03-15T14:30:00',
      status: '완료',
    },
    {
      id: 'log-002',
      studentId: 'stu-001',
      date: '2026-02-28',
      sessionNumber: 2,
      type: '포트폴리오 검토',
      content: '포트폴리오 1차 초안 검토. 자기이해 항목 구체화 필요. 진로 로드맵 단기 목표 수정.',
      actions: '자기이해 섹션 재작성 요청. 다음 회기 전 수정본 제출.',
      nextDate: '2026-03-15',
      authorEmail: 'counselor@mjc.ac.kr',
      followUpRequired: true,
      createdAt: '2026-02-28T10:00:00',
      status: '완료',
    },
    {
      id: 'log-003',
      studentId: 'stu-001',
      date: '2026-02-10',
      sessionNumber: 1,
      type: '초기 상담',
      content: '첫 상담. 학생 기본 정보 및 진로 희망 파악. MBTI(ISTJ) 확인. 데이터·AI 분야 관심 확인.',
      actions: '직업선호도검사 L형 및 성격/심리 검사 의뢰.',
      nextDate: '2026-02-28',
      authorEmail: 'counselor@mjc.ac.kr',
      followUpRequired: false,
      createdAt: '2026-02-10T11:00:00',
      status: '완료',
    },
  ],
  'stu-002': [
    {
      id: 'log-004',
      studentId: 'stu-002',
      date: '2026-03-12',
      sessionNumber: 1,
      type: '초기 상담',
      content: '첫 상담. 진학과 취업 사이에서 고민 중. 부모님 의견과 본인 희망 간 갈등 탐색 필요.',
      actions: '성격/심리 검사 의뢰. 진로 탐색 워크시트 작성 과제.',
      nextDate: '2026-03-26',
      authorEmail: 'counselor@mjc.ac.kr',
      followUpRequired: true,
      createdAt: '2026-03-12T15:00:00',
      status: '완료',
    },
  ],
};

/* ----------------------------------------------------------
   취업준비 데이터
---------------------------------------------------------- */
const EMPLOYMENT_STATUS = {
  'stu-001': {
    id: 'emp-001',
    studentId: 'stu-001',
    desiredJobs: ['데이터 분석가', 'AI 엔지니어'],
    desiredTiming: '2027년 상반기',
    desiredLocation: '수도권',
    desiredIndustry: 'IT·소프트웨어',
    desiredCompanyType: '중견기업 이상',
    desiredSalary: '3,000만원 이상',
    cert1: 'ADsP (준비 중)',
    cert2: 'SQLD (계획)',
    license: '',
    itSkill: 'Python, SQL, Excel',
    otherCerts: '',
    resumeReady: false,
    introReady: false,
    interviewReady: false,
    prepLevel: '기초 단계 (정보 탐색 수준)',
    notes: '2026년 하반기까지 자격증 취득 후 본격 취업 준비 예정.',
    updatedAt: '2026-03-15',
  },
  'stu-003': {
    id: 'emp-003',
    studentId: 'stu-003',
    desiredJobs: ['회로 설계 엔지니어', 'PCB 설계'],
    desiredTiming: '2026년 하반기',
    desiredLocation: '수도권',
    desiredIndustry: '전자·반도체',
    desiredCompanyType: '대기업',
    desiredSalary: '4,000만원 이상',
    cert1: '전기기사',
    cert2: '전기산업기사',
    license: '',
    itSkill: 'Altium Designer, MATLAB',
    otherCerts: '토익 800점',
    resumeReady: true,
    introReady: true,
    interviewReady: false,
    prepLevel: '실행 단계 (구체적 행동 진행 중)',
    notes: '삼성전자·LG전자 공채 목표. 면접 준비 강화 필요.',
    updatedAt: '2026-03-10',
  },
};

/* ----------------------------------------------------------
   RAG 자료 목록 (관리자용)
---------------------------------------------------------- */
const RAG_MATERIALS = [
  { id: 'rag-001', title: '2026-1 AI소프트웨어학과 교육과정', type: '학사', uploadedAt: '2026-03-01', size: '2.4MB', status: '활성' },
  { id: 'rag-002', title: '2026-1 경영학과 교육과정',         type: '학사', uploadedAt: '2026-03-01', size: '1.8MB', status: '활성' },
  { id: 'rag-003', title: '2026년 비교과 프로그램 안내',       type: '비교과', uploadedAt: '2026-03-05', size: '1.1MB', status: '활성' },
  { id: 'rag-004', title: '직무별 취업 로드맵',               type: '취업', uploadedAt: '2026-03-10', size: '3.2MB', status: '활성' },
  { id: 'rag-005', title: '진단검사 해석 기준표',             type: '진단', uploadedAt: '2026-03-12', size: '0.8MB', status: '활성' },
];

/* ----------------------------------------------------------
   시스템 사용자 목록 (관리자용)
---------------------------------------------------------- */
const SYSTEM_USERS = [
  { id: 'u-001', name: '이상담', email: 'counselor@mjc.ac.kr', role: 'counselor', isActive: true },
  { id: 'u-002', name: '관리자', email: 'admin@mjc.ac.kr',     role: 'admin',     isActive: true },
  { id: 'u-003', name: '최상담', email: 'counselor2@mjc.ac.kr', role: 'counselor', isActive: true },
  { id: 'u-004', name: '신입상담', email: 'new@mjc.ac.kr',     role: 'counselor', isActive: false },
];

/* ----------------------------------------------------------
   수정 이력 (히스토리)
---------------------------------------------------------- */
const EDIT_HISTORY = {
  'stu-001-diag': [
    { who: 'AI 자동 생성', when: '2026-03-05 10:00', what: '진단검사 결과 AI 해석 초안 생성' },
    { who: '이상담 상담사', when: '2026-03-06 14:20', what: '코칭 메모 보완 — 목표지향성 관련 내용 추가' },
  ],
  'stu-001-port': [
    { who: 'AI 자동 생성', when: '2026-03-15 11:00', what: '포트폴리오 v1 초안 생성' },
    { who: '이상담 상담사', when: '2026-03-18 15:30', what: '단기 로드맵 수정 — ADsP 추가' },
    { who: '박교수 교수',   when: '2026-03-20 09:00', what: '중기 목표 문구 조정, 최종 확인 진행 중' },
  ],
};

/* ----------------------------------------------------------
   유틸리티 함수
---------------------------------------------------------- */

/** 단계 → 한국어 */
function stageLabel(stage) {
  const map = {
    '초기상담': '초기 상담',
    '진단검사': '진단 검사',
    '활동관리': '교과·비교과',
    '포트폴리오': '포트폴리오',
    '취업준비': '취업 준비',
  };
  return map[stage] || stage;
}

/** 단계 → 배지 클래스 */
function stageBadgeClass(stage) {
  const map = {
    '초기상담': 'badge-gray',
    '진단검사': 'badge-blue',
    '활동관리': 'badge-teal',
    '포트폴리오': 'badge-purple',
    '취업준비': 'badge-green',
  };
  return map[stage] || 'badge-gray';
}

/** 위험도 → 배지 클래스 */
function statusBadgeClass(status) {
  const map = { '일반': 'badge-green', '주의': 'badge-yellow', '고위험군': 'badge-red' };
  return map[status] || 'badge-gray';
}

/** 점수 → CSS 클래스 (low/mid/high) */
function scoreClass(v) {
  return v < 30 ? 'low' : v < 60 ? 'mid' : 'high';
}

/** 날짜 포맷 */
function fmtDate(dateStr) {
  if (!dateStr) return '—';
  return dateStr.replace(/-/g, '.');
}

/** HTML 이스케이프 */
function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** 완료 퍼센트 계산 (ActionPlan) */
function calcCompletionPct(actionPlans) {
  if (!actionPlans || actionPlans.length === 0) return 0;
  const done = actionPlans.filter(a => a.isCompleted).length;
  return Math.round((done / actionPlans.length) * 100);
}

/** 숫자 → 원형 게이지 stroke-dashoffset */
function ringOffset(pct, r = 54) {
  const circumference = 2 * Math.PI * r;
  return circumference - (pct / 100) * circumference;
}
