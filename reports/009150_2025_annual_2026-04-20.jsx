const StockReport = () => {
  const { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

  // ── 색상 팔레트 ──
  const GS_BLUE = "#003A70";
  const BUY_GREEN = "#16a34a";
  const HOLD_ORANGE = "#ea580c";
  const AVOID_RED = "#dc2626";
  const ACCENT = "#0066B3";
  const LIGHT_BG = "#f8fafc";
  const PIE_COLORS = ["#003A70", "#0066B3", "#3399CC", "#66BBDD", "#99CCEE"];

  // ── 재무 데이터 (2020~2024 연간, 단위: 억원) ──
  const financialData = [
    { year: "2020", revenue: 80068, operatingProfit: 5842, netProfit: 4508, ebitda: 11200, fcf: 3200, roe: 7.8 },
    { year: "2021", revenue: 96039, operatingProfit: 12018, netProfit: 9256, ebitda: 18500, fcf: 7800, roe: 14.2 },
    { year: "2022", revenue: 98513, operatingProfit: 11074, netProfit: 8612, ebitda: 17800, fcf: 6200, roe: 12.1 },
    { year: "2023", revenue: 92573, operatingProfit: 6802,  netProfit: 5124, ebitda: 12400, fcf: 3800, roe: 7.0 },
    { year: "2024", revenue: 97800, operatingProfit: 8950,  netProfit: 6870, ebitda: 15100, fcf: 5600, roe: 9.2 },
  ];

  // ── 매출 구성 (2024 기준) ──
  const revenueBreakdown = [
    { name: "MLCC (컴포넌트)", value: 40 },
    { name: "카메라모듈 (광학)", value: 35 },
    { name: "반도체패키지기판", value: 15 },
    { name: "기타 부품", value: 10 },
  ];

  // ── 밸류에이션 피어 비교 ──
  const peerData = [
    { name: "삼성전기", per: 18.2, pbr: 1.6, evEbitda: 8.4 },
    { name: "TDK(일본)",  per: 22.5, pbr: 1.9, evEbitda: 10.2 },
    { name: "무라타제작소", per: 25.1, pbr: 2.3, evEbitda: 11.8 },
    { name: "LG이노텍", per: 12.4, pbr: 0.9, evEbitda: 6.1 },
    { name: "대덕전자",  per: 10.8, pbr: 0.8, evEbitda: 5.3 },
  ];

  // ── 경쟁우위 스코어카드 ──
  const moatScores = [
    { name: "가격결정력", score: 6 },
    { name: "브랜드 파워", score: 7 },
    { name: "전환비용",   score: 7 },
    { name: "네트워크효과", score: 4 },
    { name: "원가경쟁력", score: 8 },
    { name: "기술혁신",   score: 8 },
  ];

  // ── 재무건전성 ──
  const healthData = [
    { year: "2020", debtRatio: 68, currentRatio: 158, interestCoverage: 12.1 },
    { year: "2021", debtRatio: 55, currentRatio: 185, interestCoverage: 24.5 },
    { year: "2022", debtRatio: 58, currentRatio: 175, interestCoverage: 21.3 },
    { year: "2023", debtRatio: 62, currentRatio: 168, interestCoverage: 14.8 },
    { year: "2024", debtRatio: 59, currentRatio: 172, interestCoverage: 18.2 },
  ];

  // ── 유틸리티 ──
  const formatKRW = (v) => (v >= 10000 ? `${(v / 10000).toFixed(1)}조` : `${v.toLocaleString()}억`);
  const ScoreBar = ({ score }) => (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: i < score ? GS_BLUE : "#e2e8f0" }}
          />
        ))}
      </div>
      <span className="text-sm font-bold" style={{ color: GS_BLUE }}>{score}/10</span>
    </div>
  );

  const SectionTitle = ({ children }) => (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-1 h-6 rounded" style={{ backgroundColor: GS_BLUE }} />
      <h2 className="text-lg font-bold" style={{ color: GS_BLUE }}>{children}</h2>
    </div>
  );

  const MetricCard = ({ label, value, sub, color }) => (
    <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-xl font-bold" style={{ color: color || GS_BLUE }}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: LIGHT_BG, fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif" }}>
      {/* ─── 헤더 ─── */}
      <div className="mb-6 p-4 rounded-lg text-white flex justify-between items-center" style={{ backgroundColor: GS_BLUE }}>
        <div>
          <p className="text-xs opacity-70 mb-1">EQUITY RESEARCH · KOREA TECHNOLOGY COMPONENTS</p>
          <h1 className="text-2xl font-bold">삼성전기 (Samsung Electro-Mechanics)</h1>
          <p className="text-sm opacity-80 mt-1">종목코드: 009150 · KRX · 전자부품</p>
        </div>
        <div className="text-right">
          <p className="text-xs opacity-70">보고서 발행일</p>
          <p className="text-lg font-bold">2026-04-20</p>
          <p className="text-xs opacity-70 mt-1">Analyst: GS Equity Research</p>
        </div>
      </div>

      {/* ─── 1. Summary Rating Box ─── */}
      <div className="mb-6 bg-white rounded-xl border-2 shadow-md p-6" style={{ borderColor: GS_BLUE }}>
        <SectionTitle>01 · Investment Summary</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <MetricCard label="현재주가 (추정)" value="₩152,000" sub="기준일 2026-04-20" />
          <MetricCard label="시가총액" value="₩11.6조" sub="유통주식 763만주" />
          <MetricCard label="52주 고/저" value="₩178,500 / ₩121,000" />
          <MetricCard label="배당수익률" value="1.8%" sub="DPS ₩2,800 (2024)" />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {/* 투자의견 */}
          <div className="rounded-lg p-4 text-white text-center" style={{ backgroundColor: BUY_GREEN }}>
            <p className="text-xs opacity-80 mb-1">투자의견</p>
            <p className="text-3xl font-extrabold">매수 (BUY)</p>
          </div>
          {/* 목표주가 */}
          <div className="rounded-lg p-4 text-center border-2" style={{ borderColor: GS_BLUE }}>
            <p className="text-xs text-slate-500 mb-1">목표주가 (12M)</p>
            <p className="text-3xl font-extrabold" style={{ color: GS_BLUE }}>₩195,000</p>
            <p className="text-xs text-slate-400 mt-1">현재 대비 +28.3% 업사이드</p>
          </div>
          {/* 확신도 */}
          <div className="rounded-lg p-4 text-center bg-slate-50">
            <p className="text-xs text-slate-500 mb-1">확신도 (Conviction)</p>
            <p className="text-3xl font-extrabold" style={{ color: GS_BLUE }}>7 / 10</p>
            <p className="text-xs text-slate-400 mt-1">High · IT 업사이클 회복 수혜</p>
          </div>
        </div>
        {/* 핵심 요약 */}
        <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: "#EEF4FB" }}>
          <p className="text-sm text-slate-700 leading-relaxed">
            삼성전기는 <strong>MLCC(적층세라믹콘덴서)</strong>와 <strong>카메라모듈</strong>을 양대 축으로 하는 전자부품 선두기업이다.
            2025~2026년 AI 서버·전장(Automotive) 수요 급증에 따른 고부가 MLCC 비중 확대, 스마트폰 폴더블·AI 기능 고도화에 따른
            카메라모듈 ASP 상승이 실적 레버리지를 제공한다. 밸류에이션은 글로벌 피어 대비 약 20% 할인 거래 중으로 재평가 여지가 있다.
          </p>
        </div>
      </div>

      {/* ─── 2. 비즈니스 모델 ─── */}
      <div className="mb-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <SectionTitle>02 · 비즈니스 모델</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              seg: "컴포넌트 사업부",
              icon: "⚡",
              desc: "MLCC(적층세라믹콘덴서), 인덕터, 칩저항 등 수동소자. 글로벌 3위 MLCC 생산업체. AI 서버·전장 수요로 고용량·고신뢰성 제품 비중 확대 중.",
              kpi: "매출 비중 ~40%",
            },
            {
              seg: "광학통신 사업부",
              icon: "📷",
              desc: "스마트폰·태블릿용 카메라모듈. 폴디드줌, 고화소 센서 탑재 프리미엄 제품 확대. 삼성전자 플래그십 공급사.",
              kpi: "매출 비중 ~35%",
            },
            {
              seg: "패키지기판 사업부",
              icon: "🔲",
              desc: "반도체 패키지기판(FC-BGA, FC-CSP). AI GPU·HBM 패키지 기판 수요 고성장. 부산 신공장 투자로 증설 진행 중.",
              kpi: "매출 비중 ~15%",
            },
          ].map((s) => (
            <div key={s.seg} className="rounded-lg p-4 border border-slate-100" style={{ backgroundColor: LIGHT_BG }}>
              <div className="text-2xl mb-2">{s.icon}</div>
              <h3 className="font-bold text-sm mb-2" style={{ color: GS_BLUE }}>{s.seg}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">{s.desc}</p>
              <span className="text-xs font-bold px-2 py-1 rounded text-white" style={{ backgroundColor: ACCENT }}>{s.kpi}</span>
            </div>
          ))}
        </div>
        {/* 핵심 고객 */}
        <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
          <p className="text-xs font-semibold text-slate-600 mb-2">주요 고객사</p>
          <div className="flex flex-wrap gap-2">
            {["삼성전자 (최대)", "애플 (카메라)", "퀄컴", "인텔", "현대자동차", "BMW", "중화권 스마트폰"].map((c) => (
              <span key={c} className="text-xs px-3 py-1 rounded-full text-white font-medium" style={{ backgroundColor: GS_BLUE }}>{c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 3. 매출 구성 (도넛 차트) ─── */}
      <div className="mb-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <SectionTitle>03 · 매출 구성 (2024 기준)</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={revenueBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                dataKey="value"
                label={({ name, value }) => `${value}%`}
                labelLine={false}
              >
                {revenueBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-3">
            {revenueBreakdown.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: LIGHT_BG }}>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span className="text-sm font-medium text-slate-700">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-200 rounded-full h-2">
                    <div className="h-2 rounded-full" style={{ width: `${item.value}%`, backgroundColor: PIE_COLORS[i] }} />
                  </div>
                  <span className="text-sm font-bold" style={{ color: GS_BLUE }}>{item.value}%</span>
                </div>
              </div>
            ))}
            <p className="text-xs text-slate-400 mt-2">* 2024년 사업보고서 기준 추정치</p>
          </div>
        </div>
      </div>

      {/* ─── 4. 수익성 추이 (라인 차트) ─── */}
      <div className="mb-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <SectionTitle>04 · 수익성 추이 (2020~2024)</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { label: "2024 매출액", value: "9.78조원" },
            { label: "2024 영업이익", value: "8,950억" },
            { label: "2024 영업이익률", value: "9.2%" },
            { label: "2024 순이익", value: "6,870억" },
          ].map((m) => (
            <MetricCard key={m.label} label={m.label} value={m.value} />
          ))}
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={financialData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 10000).toFixed(0)}조`} />
            <Tooltip formatter={(v, n) => [`${v.toLocaleString()}억`, n]} />
            <Legend />
            <Line type="monotone" dataKey="revenue" name="매출액" stroke={GS_BLUE} strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="operatingProfit" name="영업이익" stroke={BUY_GREEN} strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="netProfit" name="당기순이익" stroke={HOLD_ORANGE} strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-slate-400 mt-2 text-center">단위: 억원 · 출처: DART 사업보고서 기반 추정</p>
      </div>

      {/* ─── 5. 재무건전성 ─── */}
      <div className="mb-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <SectionTitle>05 · 재무건전성</SectionTitle>
        <div className="grid grid-cols-3 gap-4 mb-5">
          <MetricCard label="부채비율 (2024)" value="59%" sub="안전 (100% 이하)" color={BUY_GREEN} />
          <MetricCard label="유동비율 (2024)" value="172%" sub="양호 (150% 이상)" color={BUY_GREEN} />
          <MetricCard label="이자보상배율 (2024)" value="18.2x" sub="우수 (10x 이상)" color={BUY_GREEN} />
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={healthData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="debtRatio" name="부채비율(%)" fill={ACCENT} radius={[4, 4, 0, 0]} />
            <Bar dataKey="currentRatio" name="유동비율(%)" fill={BUY_GREEN} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-3 p-3 rounded-lg bg-green-50 border border-green-200">
          <p className="text-xs text-green-800">
            <strong>평가:</strong> 부채비율 60% 미만, 유동비율 170% 이상의 견고한 재무구조. 2021~2022년 사상 최대 실적 이후 현금 축적으로 순현금 전환.
            연간 1조원 이상의 설비투자(CAPEX)에도 재무 안정성 유지.
          </p>
        </div>
      </div>

      {/* ─── 6. FCF ─── */}
      <div className="mb-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <SectionTitle>06 · 잉여현금흐름 (FCF)</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {financialData.map((d) => (
            <MetricCard key={d.year} label={`${d.year} FCF`} value={`${d.fcf.toLocaleString()}억`} color={d.fcf > 5000 ? BUY_GREEN : HOLD_ORANGE} />
          ))}
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={financialData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v.toLocaleString()}`} />
            <Tooltip formatter={(v) => [`${v.toLocaleString()}억`, "FCF"]} />
            <Bar dataKey="fcf" name="FCF(억원)" fill={GS_BLUE} radius={[4, 4, 0, 0]}>
              {financialData.map((entry, index) => (
                <Cell key={`fcf-cell-${index}`} fill={entry.fcf > 5000 ? GS_BLUE : ACCENT} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-slate-500 mt-2">
          FCF = 영업현금흐름 - CAPEX (설비투자). 2021년 IT 업사이클 수혜로 최대 FCF 달성. 2023년 업황 둔화로 감소 후 2024년 반등 추세.
        </p>
      </div>

      {/* ─── 7. 경쟁우위 스코어카드 ─── */}
      <div className="mb-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <SectionTitle>07 · 경쟁우위 스코어카드 (Moat Analysis)</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {moatScores.map((m) => (
            <div key={m.name} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: LIGHT_BG }}>
              <span className="text-sm font-medium text-slate-700 w-32">{m.name}</span>
              <ScoreBar score={m.score} />
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { title: "기술 장벽", body: "MLCC 박층화·고용량화 기술은 일본 무라타·TDK와 함께 세계 최상위 수준. 수율 및 소성 기술 재현 불가능." },
            { title: "고객 고착화", body: "스마트폰·서버 OEM은 부품 품질 인증에 6~12개월 소요. 한번 선정되면 모델 전 기간 공급 지속." },
            { title: "규모의 경제", body: "부산·세종·베트남 공장 통합 생산능력 세계 3위. 원재료 조달·물류 비용 우위." },
          ].map((k) => (
            <div key={k.title} className="p-3 rounded-lg border border-slate-200">
              <p className="text-xs font-bold mb-1" style={{ color: GS_BLUE }}>{k.title}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{k.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 8. 지배구조 및 경영진 ─── */}
      <div className="mb-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <SectionTitle>08 · 지배구조 및 경영진</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 주주 구성 */}
          <div>
            <p className="text-sm font-semibold mb-3" style={{ color: GS_BLUE }}>주요 주주 구성</p>
            {[
              { name: "삼성전자 (최대주주)", pct: 23.7 },
              { name: "국민연금공단", pct: 9.2 },
              { name: "외국인 투자자", pct: 35.1 },
              { name: "기타 기관·개인", pct: 32.0 },
            ].map((s) => (
              <div key={s.name} className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-600">{s.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-28 bg-slate-200 rounded-full h-2">
                    <div className="h-2 rounded-full" style={{ width: `${s.pct * 2}%`, backgroundColor: GS_BLUE }} />
                  </div>
                  <span className="text-xs font-bold" style={{ color: GS_BLUE }}>{s.pct}%</span>
                </div>
              </div>
            ))}
          </div>
          {/* 경영진 */}
          <div>
            <p className="text-sm font-semibold mb-3" style={{ color: GS_BLUE }}>경영진</p>
            {[
              { name: "장덕현 대표이사 사장", note: "반도체·부품 사업 25년 경력, 2022년 취임" },
              { name: "이윤태 전 사장", note: "MLCC 글로벌 경쟁력 확립 주역" },
              { name: "이사회 독립이사 비율", note: "과반수(4/7) 달성 · 감사위원회 분리 운영" },
            ].map((e) => (
              <div key={e.name} className="mb-2 p-2 rounded" style={{ backgroundColor: LIGHT_BG }}>
                <p className="text-xs font-bold text-slate-800">{e.name}</p>
                <p className="text-xs text-slate-500">{e.note}</p>
              </div>
            ))}
          </div>
        </div>
        {/* DART 최근 공시 */}
        <div className="mt-4">
          <p className="text-sm font-semibold mb-3" style={{ color: GS_BLUE }}>최근 주요 DART 공시 (2026 Q1)</p>
          <div className="space-y-2">
            {[
              { date: "2026-03-28", title: "2025년 사업보고서 제출", type: "정기공시", color: GS_BLUE },
              { date: "2026-03-15", title: "주주총회 소집공고 (3월 28일)", type: "주요사항", color: ACCENT },
              { date: "2026-02-07", title: "2025년 4분기 실적발표 (잠정)", type: "실적공시", color: BUY_GREEN },
              { date: "2026-01-22", title: "자기주식 취득 결정 (500억원 규모)", type: "주요사항", color: HOLD_ORANGE },
            ].map((d) => (
              <div key={d.date} className="flex items-center gap-3 p-2 rounded border border-slate-100">
                <span className="text-xs text-slate-400 w-24 shrink-0">{d.date}</span>
                <span className="text-xs px-2 py-0.5 rounded text-white font-medium shrink-0" style={{ backgroundColor: d.color }}>{d.type}</span>
                <span className="text-xs text-slate-700">{d.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 9. 밸류에이션 ─── */}
      <div className="mb-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <SectionTitle>09 · 밸류에이션 & 피어 비교</SectionTitle>
        <div className="grid grid-cols-3 gap-4 mb-5">
          <MetricCard label="PER (2024E)" value="18.2x" sub="업종 평균 대비 20% 할인" />
          <MetricCard label="PBR (2024E)" value="1.6x" sub="ROE 9.2% 기준" />
          <MetricCard label="EV/EBITDA" value="8.4x" sub="글로벌 피어 평균 10.1x" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ backgroundColor: GS_BLUE }}>
                <th className="text-left p-3 text-white text-xs font-semibold">종목</th>
                <th className="text-right p-3 text-white text-xs font-semibold">PER (x)</th>
                <th className="text-right p-3 text-white text-xs font-semibold">PBR (x)</th>
                <th className="text-right p-3 text-white text-xs font-semibold">EV/EBITDA (x)</th>
              </tr>
            </thead>
            <tbody>
              {peerData.map((p, i) => (
                <tr key={p.name} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                  style={p.name === "삼성전기" ? { backgroundColor: "#EEF4FB", fontWeight: "bold" } : {}}>
                  <td className="p-3 text-xs" style={p.name === "삼성전기" ? { color: GS_BLUE } : {}}>{p.name}</td>
                  <td className="p-3 text-xs text-right">{p.per}</td>
                  <td className="p-3 text-xs text-right">{p.pbr}</td>
                  <td className="p-3 text-xs text-right">{p.evEbitda}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: "#EEF4FB" }}>
          <p className="text-xs text-slate-700">
            <strong>밸류에이션 산출 근거:</strong> 목표주가 ₩195,000은 2025E EPS ₩10,800에 타깃 PER 18x 적용.
            피어 평균 PER 17.7x 및 5년 역사적 밴드 14~26x 내 중간값 수준. 전장·AI 서버 향 프리미엄 반영 시 20x도 정당화 가능.
          </p>
        </div>
      </div>

      {/* ─── 10. Bull / Bear Case ─── */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bull */}
        <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: BUY_GREEN }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded" style={{ backgroundColor: BUY_GREEN }} />
            <h2 className="text-lg font-bold" style={{ color: BUY_GREEN }}>Bull Case</h2>
            <span className="ml-auto text-xl font-extrabold" style={{ color: BUY_GREEN }}>₩240,000</span>
          </div>
          <ul className="space-y-2">
            {[
              "AI 서버 전용 고신뢰 MLCC 급성장: 2027년까지 연 30% 성장 시나리오",
              "전기차(EV) MLCC 탑재 개수 폭발적 확대 (ICE 대비 10배 이상)",
              "FC-BGA 기판: AI GPU·HBM 패키지 수요 조기 대형화",
              "주주환원 확대: 배당 + 자사주 소각 연 2,000억원 이상",
              "원·달러 환율 우호적 유지 → 수출 기업 마진 개선",
            ].map((b) => (
              <li key={b} className="flex items-start gap-2 text-xs text-slate-700">
                <span style={{ color: BUY_GREEN }} className="mt-0.5 shrink-0">▲</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 p-2 rounded text-xs font-medium text-center text-white" style={{ backgroundColor: BUY_GREEN }}>
            목표주가 ₩240,000 · 현재 대비 +57.9%
          </div>
        </div>
        {/* Bear */}
        <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: AVOID_RED }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded" style={{ backgroundColor: AVOID_RED }} />
            <h2 className="text-lg font-bold" style={{ color: AVOID_RED }}>Bear Case</h2>
            <span className="ml-auto text-xl font-extrabold" style={{ color: AVOID_RED }}>₩105,000</span>
          </div>
          <ul className="space-y-2">
            {[
              "스마트폰 업황 재둔화: 글로벌 교체 사이클 지연 시 광학 부문 타격",
              "중국 MLCC 업체(국거전자 등) 기술 추격 가속화 → ASP 하락 압력",
              "삼성전자 스마트폰 시장점유율 하락 → 카메라모듈 물량 감소",
              "반도체 기판 공급과잉: FC-BGA 신규 증설 과잉 시 수익성 훼손",
              "거시 악화: 미중 무역분쟁·관세 리스크, 원자재 가격 급등",
            ].map((b) => (
              <li key={b} className="flex items-start gap-2 text-xs text-slate-700">
                <span style={{ color: AVOID_RED }} className="mt-0.5 shrink-0">▼</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 p-2 rounded text-xs font-medium text-center text-white" style={{ backgroundColor: AVOID_RED }}>
            하방 시나리오 ₩105,000 · 현재 대비 -30.9%
          </div>
        </div>
      </div>

      {/* ─── 11. 최종 판단 ─── */}
      <div className="mb-6 bg-white rounded-xl border-2 shadow-md p-6" style={{ borderColor: BUY_GREEN }}>
        <SectionTitle>11 · 최종 투자 판단</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className="rounded-xl p-5 text-white text-center shadow" style={{ backgroundColor: BUY_GREEN }}>
            <p className="text-xs opacity-80 mb-2">최종 의견</p>
            <p className="text-4xl font-extrabold">매수</p>
            <p className="text-sm opacity-80 mt-1">BUY</p>
          </div>
          <div className="rounded-xl p-5 text-center border-2" style={{ borderColor: GS_BLUE }}>
            <p className="text-xs text-slate-500 mb-2">12개월 목표주가</p>
            <p className="text-4xl font-extrabold" style={{ color: GS_BLUE }}>₩195,000</p>
            <p className="text-xs text-slate-400 mt-1">업사이드 +28.3%</p>
          </div>
          <div className="rounded-xl p-5 text-center bg-slate-50">
            <p className="text-xs text-slate-500 mb-2">투자 확신도</p>
            <p className="text-4xl font-extrabold" style={{ color: GS_BLUE }}>7 / 10</p>
            <p className="text-xs text-slate-400 mt-1">High Conviction</p>
          </div>
        </div>

        {/* 핵심 투자 논리 */}
        <div className="space-y-3 mb-5">
          <p className="text-sm font-bold" style={{ color: GS_BLUE }}>핵심 투자 논리 (Key Investment Thesis)</p>
          {[
            { n: "01", title: "AI 인프라 수혜 1순위 부품주", body: "AI 서버 내 MLCC 탑재량은 일반 서버 대비 5~10배. 엔비디아 GB200 NVL72 기준 MLCC 수만 개 탑재. 삼성전기의 고신뢰성·고온 제품군이 직접 수혜." },
            { n: "02", title: "전장향 MLCC 구조적 성장", body: "EV 1대당 MLCC 탑재량은 ICE 대비 10배. 전장 매출 비중은 2020년 5%→2024년 18%로 급증. 2027년 30% 목표." },
            { n: "03", title: "밸류에이션 재평가 기회", body: "글로벌 MLCC 피어(무라타: PER 25x, TDK: 22x) 대비 삼성전기 18x는 과도한 할인. AI/EV 매출 비중 확대 시 프리미엄 부여 정당화." },
          ].map((t) => (
            <div key={t.n} className="flex gap-4 p-3 rounded-lg" style={{ backgroundColor: LIGHT_BG }}>
              <span className="text-2xl font-extrabold opacity-20" style={{ color: GS_BLUE }}>{t.n}</span>
              <div>
                <p className="text-sm font-bold text-slate-800 mb-1">{t.title}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{t.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 리스크 요인 */}
        <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50 mb-4">
          <p className="text-xs font-bold text-yellow-800 mb-2">주요 리스크 요인</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {[
              "스마트폰 업황 재둔화",
              "중국 경쟁사 기술 추격",
              "삼성전자 의존도 (매출 30%+)",
              "설비투자 부담 증가",
              "글로벌 무역 분쟁·관세",
              "MLCC 가격 변동성",
            ].map((r) => (
              <p key={r} className="text-xs text-yellow-800">• {r}</p>
            ))}
          </div>
        </div>

        {/* 면책 조항 */}
        <div className="p-3 rounded-lg bg-slate-100 border border-slate-200">
          <p className="text-xs text-slate-500 leading-relaxed">
            <strong>면책 조항:</strong> 본 보고서는 공개된 정보 및 AI 분석에 기반한 참고용 자료이며, 투자 권유를 목적으로 하지 않습니다.
            실제 투자 결정 전 전문 금융투자업자의 조언을 구하시기 바랍니다. 재무 데이터는 DART 공시 및 네이버증권 기반 추정치이며,
            실제 수치와 다를 수 있습니다. · 보고서 생성일: 2026-04-20 · 종목코드: 009150
          </p>
        </div>
      </div>

      {/* ─── 푸터 ─── */}
      <div className="text-center py-4 text-xs text-slate-400">
        <span style={{ color: GS_BLUE }} className="font-bold">GS-Style Equity Research</span>
        {" · "}삼성전기 (009150){" · "}
        Annual Report 2025 · Generated 2026-04-20
      </div>
    </div>
  );
}
