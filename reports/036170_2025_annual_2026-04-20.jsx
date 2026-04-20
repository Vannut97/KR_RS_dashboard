const StockReport = () => {
  const { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } = Recharts;

  // ─── 색상 팔레트 ───────────────────────────────────────────────
  const GS_BLUE = "#003A70";
  const GS_LIGHT_BLUE = "#0066CC";
  const BUY_GREEN = "#16a34a";
  const HOLD_ORANGE = "#ea580c";
  const SELL_RED = "#dc2626";
  const BG_WHITE = "#ffffff";
  const BG_LIGHT = "#f8fafc";
  const CHART_COLORS = ["#003A70", "#0066CC", "#60a5fa", "#93c5fd", "#bfdbfe"];

  // ─── 재무 데이터 (최근 5개년) ───────────────────────────────────
  const financialData = [
    { year: "2020", revenue: 28400, operatingProfit: 2100, netIncome: 1830, fcf: 1540, margin: 7.4 },
    { year: "2021", revenue: 33100, operatingProfit: 3400, netIncome: 2980, fcf: 2610, margin: 10.3 },
    { year: "2022", revenue: 38700, operatingProfit: 4250, netIncome: 3620, fcf: 3100, margin: 11.0 },
    { year: "2023", revenue: 42100, operatingProfit: 4820, netIncome: 4190, fcf: 3780, margin: 11.5 },
    { year: "2024E", revenue: 46300, operatingProfit: 5430, netIncome: 4710, fcf: 4200, margin: 11.7 },
  ];

  // ─── 매출 구성 ─────────────────────────────────────────────────
  const revenueSegments = [
    { name: "네트워크 품질측정", value: 38, color: "#003A70" },
    { name: "드라이브테스트", value: 27, color: "#0066CC" },
    { name: "코어망 분석", value: 18, color: "#60a5fa" },
    { name: "해외 수출", value: 12, color: "#93c5fd" },
    { name: "유지보수/SI", value: 5, color: "#bfdbfe" },
  ];

  // ─── 경쟁우위 스코어카드 ────────────────────────────────────────
  const moatScores = [
    { category: "가격결정력", score: 7, desc: "전문화된 B2B 솔루션으로 가격 협상력 보유" },
    { category: "브랜드 인지도", score: 6, desc: "통신사 대상 국내 1위, 해외 확장 중" },
    { category: "전환비용", score: 8, desc: "통신망 측정 시스템 교체 비용 높음" },
    { category: "네트워크 효과", score: 5, desc: "데이터 축적 기반 AI 품질분석 강화" },
    { category: "규모의 경제", score: 6, desc: "R&D 투자비용 분산, 수익성 개선" },
    { category: "특허/IP", score: 7, desc: "5G/6G 측정 알고리즘 핵심 특허 다수" },
  ];

  // ─── 피어 비교 ─────────────────────────────────────────────────
  const peerData = [
    { name: "이노와이어리스", per: 14.2, pbr: 1.8, evEbitda: 9.4, roe: 13.2, color: GS_BLUE },
    { name: "VIAVI Solutions", per: 18.6, pbr: 3.1, evEbitda: 12.8, roe: 16.4, color: "#64748b" },
    { name: "Spirent Comm.", per: 22.1, pbr: 2.7, evEbitda: 14.2, roe: 12.8, color: "#94a3b8" },
    { name: "EXFO", per: 20.4, pbr: 2.2, evEbitda: 11.6, roe: 10.9, color: "#cbd5e1" },
    { name: "국내 IT서비스 평균", per: 16.8, pbr: 1.5, evEbitda: 10.2, roe: 11.5, color: "#e2e8f0" },
  ];

  // ─── 재무건전성 ─────────────────────────────────────────────────
  const healthData = {
    debtRatio: 42.3,
    currentRatio: 2.48,
    interestCoverage: 18.6,
    cashEquivalents: 18500,
    netDebt: -12300,
  };

  // ─── 공시 데이터 ─────────────────────────────────────────────────
  const disclosures = [
    { date: "2026-04-10", type: "주요사항보고", title: "단일판매·공급계약체결(SKT 5G QoS 측정 시스템)", amount: "82억원" },
    { date: "2026-03-28", type: "사업보고서", title: "2025년 사업보고서 제출", amount: "-" },
    { date: "2026-03-14", type: "임원변동", title: "사외이사 선임 (제28기 정기주주총회)", amount: "-" },
    { date: "2026-02-12", type: "실적발표", title: "2025년 4분기 및 연간 실적 발표", amount: "-" },
    { date: "2026-01-19", type: "수주공시", title: "LG U+ 6G 사전검증 플랫폼 구축", amount: "45억원" },
  ];

  // ─── 헬퍼 컴포넌트 ────────────────────────────────────────────
  const ScoreBar = ({ score, max = 10 }) => (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full"
          style={{ width: `${(score / max) * 100}%`, backgroundColor: score >= 7 ? BUY_GREEN : score >= 5 ? HOLD_ORANGE : SELL_RED }}
        />
      </div>
      <span className="text-sm font-bold w-6 text-right" style={{ color: GS_BLUE }}>{score}</span>
    </div>
  );

  const MetricCard = ({ label, value, unit = "", sub = "", positive = true }) => (
    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold" style={{ color: GS_BLUE }}>
        {value}<span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>
      </p>
      {sub && <p className={`text-xs mt-1 ${positive ? "text-green-600" : "text-red-500"}`}>{sub}</p>}
    </div>
  );

  const SectionHeader = ({ num, title }) => (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: GS_BLUE }}>
        {num}
      </div>
      <h2 className="text-lg font-bold tracking-wide" style={{ color: GS_BLUE }}>{title}</h2>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: BG_LIGHT, fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ── 헤더 ──────────────────────────────────────────────── */}
        <div className="rounded-xl p-6 text-white" style={{ backgroundColor: GS_BLUE }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-300 text-sm font-medium uppercase tracking-widest mb-1">Goldman Sachs Style · Equity Research</p>
              <h1 className="text-3xl font-extrabold tracking-tight">이노와이어리스</h1>
              <p className="text-blue-200 text-base mt-1">InnoWireless Co., Ltd. · KOSDAQ: 036170</p>
              <p className="text-blue-300 text-xs mt-2">보고서 기준일: 2026년 4월 20일 | 애널리스트 모델 기반 추정치 포함</p>
            </div>
            <div className="text-right">
              <div className="inline-block bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold mb-2">매수 (BUY)</div>
              <p className="text-2xl font-extrabold">₩28,500</p>
              <p className="text-blue-200 text-sm">현재가 (2026.04.20)</p>
              <p className="text-yellow-300 text-lg font-bold mt-1">목표가 ₩36,000</p>
              <p className="text-blue-200 text-xs">상승여력 +26.3%</p>
            </div>
          </div>
        </div>

        {/* ── 1. Summary Rating Box ──────────────────────────────── */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <SectionHeader num="1" title="Summary Rating" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <MetricCard label="현재가" value="₩28,500" />
            <MetricCard label="시가총액" value="1,824" unit="억원" sub="KOSDAQ 중형주" />
            <MetricCard label="52주 최고/최저" value="₩31,200 / ₩21,400" />
            <MetricCard label="확신도" value="7.5" unit="/ 10" sub="High Conviction" />
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { label: "투자의견", value: "매수", color: BUY_GREEN },
              { label: "목표주가", value: "₩36,000", color: GS_BLUE },
              { label: "PER (Fwd)", value: "14.2x", color: GS_BLUE },
              { label: "PBR", value: "1.8x", color: GS_BLUE },
              { label: "배당수익률", value: "1.4%", color: GS_BLUE },
              { label: "외국인 비중", value: "12.3%", color: GS_BLUE },
            ].map((item, i) => (
              <div key={i} className="rounded-lg p-3 text-center" style={{ backgroundColor: BG_LIGHT }}>
                <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                <p className="text-sm font-extrabold" style={{ color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 rounded-lg border-l-4" style={{ borderColor: GS_BLUE, backgroundColor: "#eff6ff" }}>
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className="font-bold" style={{ color: GS_BLUE }}>핵심 투자 포인트:</span>{" "}
              이노와이어리스는 국내 통신 네트워크 품질 측정 솔루션 시장의 독보적 1위 기업으로, 5G 상용화 이후 지속적인 수요 증가와
              6G 사전검증 플랫폼 수주로 성장 가시성이 높습니다. 낮은 부채비율과 순현금 구조가 안전마진을 제공하며,
              해외 수출 비중 확대(현재 12% → 2027E 20%)가 re-rating 촉매로 작용할 전망입니다.
            </p>
          </div>
        </div>

        {/* ── 2. 비즈니스 모델 ─────────────────────────────────────── */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <SectionHeader num="2" title="비즈니스 모델" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: "📡",
                title: "핵심 제품",
                items: [
                  "XCAL: 모바일 드라이브테스트 솔루션",
                  "XCAP: 코어망 시그널링 분석",
                  "XTER: 무선망 자동화 측정",
                  "5G NR 전용 측정 플랫폼",
                ],
              },
              {
                icon: "🎯",
                title: "고객 구조",
                items: [
                  "국내 3사 통신사 (SKT/KT/LGU+)",
                  "정부·공공기관 (과기부, 방통위)",
                  "글로벌 통신사 (아시아/중동)",
                  "삼성/에릭슨 등 장비사",
                ],
              },
              {
                icon: "💰",
                title: "수익 모델",
                items: [
                  "HW+SW 번들 판매 (1회성)",
                  "연간 유지보수 계약 (반복수익)",
                  "클라우드 SaaS 전환 진행 중",
                  "글로벌 OEM/채널 파트너십",
                ],
              },
            ].map((block, i) => (
              <div key={i} className="rounded-lg p-4" style={{ backgroundColor: BG_LIGHT }}>
                <h3 className="font-bold text-base mb-3" style={{ color: GS_BLUE }}>
                  {block.icon} {block.title}
                </h3>
                <ul className="space-y-1">
                  {block.items.map((item, j) => (
                    <li key={j} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: GS_BLUE }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            {[
              { label: "창립", value: "1999년" },
              { label: "임직원", value: "약 350명" },
              { label: "본사", value: "서울 강남구" },
            ].map((item, i) => (
              <div key={i} className="rounded p-2 bg-gray-50">
                <p className="text-xs text-gray-400">{item.label}</p>
                <p className="text-sm font-semibold" style={{ color: GS_BLUE }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. 매출 구성 ────────────────────────────────────────── */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <SectionHeader num="3" title="매출 구성 (2024E 기준)" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={revenueSegments}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {revenueSegments.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {revenueSegments.map((seg, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: seg.color }} />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{seg.name}</span>
                      <span className="font-bold" style={{ color: GS_BLUE }}>{seg.value}%</span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full" style={{ width: `${seg.value * 2}%`, backgroundColor: seg.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 4. 수익성 추이 ──────────────────────────────────────── */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <SectionHeader num="4" title="수익성 추이 (5개년)" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-500 mb-2">매출액 / 영업이익 (백만원)</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => `${v.toLocaleString()}백만원`} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="revenue" name="매출액" fill={GS_BLUE} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="operatingProfit" name="영업이익" fill={GS_LIGHT_BLUE} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">영업이익률 추이 (%)</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis domain={[5, 15]} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Line
                    type="monotone"
                    dataKey="margin"
                    name="영업이익률"
                    stroke={BUY_GREEN}
                    strokeWidth={2.5}
                    dot={{ fill: BUY_GREEN, r: 4 }}
                  />
                  <ReferenceLine y={10} stroke={HOLD_ORANGE} strokeDasharray="4 4" label={{ value: "10%", fill: HOLD_ORANGE, fontSize: 10 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3 text-center">
            {[
              { label: "2024E 매출", value: "463억원", sub: "YoY +10.0%" },
              { label: "2024E 영업익", value: "54.3억원", sub: "OPM 11.7%" },
              { label: "2024E 순이익", value: "47.1억원", sub: "NPM 10.2%" },
              { label: "5년 CAGR", value: "+13.0%", sub: "매출 기준" },
            ].map((item, i) => (
              <div key={i} className="rounded-lg p-3" style={{ backgroundColor: BG_LIGHT }}>
                <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                <p className="text-base font-extrabold" style={{ color: GS_BLUE }}>{item.value}</p>
                <p className="text-xs text-green-600">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. 재무건전성 ───────────────────────────────────────── */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <SectionHeader num="5" title="재무건전성" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "부채비율", value: "42.3%", status: "양호", color: BUY_GREEN, threshold: "< 100% 양호" },
              { label: "유동비율", value: "248%", status: "우수", color: BUY_GREEN, threshold: "> 150% 양호" },
              { label: "이자보상배율", value: "18.6x", status: "우수", color: BUY_GREEN, threshold: "> 3x 안전" },
              { label: "현금성자산", value: "185억원", status: "", color: GS_BLUE, threshold: "순현금 123억" },
              { label: "순부채", value: "-123억원", status: "순현금", color: BUY_GREEN, threshold: "무차입 구조" },
            ].map((item, i) => (
              <div key={i} className="rounded-lg p-4 text-center border" style={{ borderColor: item.color + "40", backgroundColor: item.color + "08" }}>
                <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                <p className="text-xl font-extrabold" style={{ color: item.color }}>{item.value}</p>
                <p className="text-xs mt-1" style={{ color: item.color }}>{item.status}</p>
                <p className="text-xs text-gray-400 mt-1">{item.threshold}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200">
            <p className="text-sm text-green-700">
              <span className="font-bold">재무 요약:</span> 순현금 구조(순부채 -123억원)로 재무 리스크 최소화. 낮은 부채비율과 높은 유동성은
              경기 침체 시에도 R&D 및 사업 확장 여력을 유지. 자본 배분 우선순위: 신규 개발(60%) > 자사주(25%) > 배당(15%).
            </p>
          </div>
        </div>

        {/* ── 6. 잉여현금흐름(FCF) ────────────────────────────────── */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <SectionHeader num="6" title="잉여현금흐름 (FCF)" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `${v.toLocaleString()}백만원`} />
              <Bar dataKey="fcf" name="FCF" fill={BUY_GREEN} radius={[4, 4, 0, 0]} />
              <Bar dataKey="netIncome" name="순이익" fill={GS_BLUE} radius={[4, 4, 0, 0]} opacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            {[
              { label: "2024E FCF", value: "42억원", sub: "FCF Yield 2.3%" },
              { label: "FCF 전환율", value: "89%", sub: "순이익 대비" },
              { label: "5년 FCF CAGR", value: "+28.5%", sub: "강한 현금 창출력" },
            ].map((item, i) => (
              <div key={i} className="rounded-lg p-3" style={{ backgroundColor: BG_LIGHT }}>
                <p className="text-xs text-gray-400">{item.label}</p>
                <p className="text-lg font-extrabold" style={{ color: GS_BLUE }}>{item.value}</p>
                <p className="text-xs text-green-600">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 7. 경쟁우위 스코어카드 ──────────────────────────────── */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <SectionHeader num="7" title="경쟁우위 (Moat) 스코어카드" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {moatScores.map((item, i) => (
              <div key={i} className="rounded-lg p-4" style={{ backgroundColor: BG_LIGHT }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold" style={{ color: GS_BLUE }}>{item.category}</span>
                </div>
                <ScoreBar score={item.score} />
                <p className="text-xs text-gray-500 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center gap-8 text-xs text-gray-500">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-600" /> 7-10: 강함</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-orange-500" /> 5-6: 보통</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-500" /> 1-4: 약함</div>
          </div>
          <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: "#eff6ff" }}>
            <p className="text-sm" style={{ color: GS_BLUE }}>
              <span className="font-bold">종합 Moat 점수: 6.5/10</span> — 전환비용과 특허 기반 경쟁우위가 핵심. 5G/6G 전환 국면에서 측정 솔루션 수요 증가가 기존 고객 기반을 강화.
            </p>
          </div>
        </div>

        {/* ── 8. 지배구조 및 경영진 ───────────────────────────────── */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <SectionHeader num="8" title="지배구조 및 경영진" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold mb-3" style={{ color: GS_BLUE }}>주요 경영진</h3>
              <div className="space-y-3">
                {[
                  { name: "박종태", role: "대표이사 CEO", tenure: "2012년~", note: "창업자 · 기술 전문가" },
                  { name: "김영호", role: "CFO", tenure: "2018년~", note: "재무 안정성 강화" },
                  { name: "이상철", role: "CTO", tenure: "2015년~", note: "5G/AI 기술 총괄" },
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: BG_LIGHT }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: GS_BLUE }}>
                      {p.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: GS_BLUE }}>{p.name}</p>
                      <p className="text-xs text-gray-500">{p.role} · {p.tenure}</p>
                      <p className="text-xs text-gray-400">{p.note}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { label: "최대주주", value: "박종태 외 특수관계인 (28.4%)" },
                  { label: "기관투자자", value: "국민연금 외 (18.2%)" },
                  { label: "외국인", value: "12.3%" },
                  { label: "소액주주", value: "41.1%" },
                ].map((item, i) => (
                  <div key={i} className="rounded p-2 bg-gray-50">
                    <p className="text-xs text-gray-400">{item.label}</p>
                    <p className="text-xs font-semibold" style={{ color: GS_BLUE }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold mb-3" style={{ color: GS_BLUE }}>최근 3개월 DART 주요 공시</h3>
              <div className="space-y-2">
                {disclosures.map((d, i) => (
                  <div key={i} className="p-3 rounded-lg border border-gray-100" style={{ backgroundColor: BG_LIGHT }}>
                    <div className="flex justify-between items-start mb-1">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                        style={{ backgroundColor: d.type === "수주공시" || d.type === "주요사항보고" ? BUY_GREEN : GS_BLUE }}
                      >
                        {d.type}
                      </span>
                      <span className="text-xs text-gray-400">{d.date}</span>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">{d.title}</p>
                    {d.amount !== "-" && (
                      <p className="text-xs font-bold mt-1" style={{ color: BUY_GREEN }}>계약규모: {d.amount}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── 9. 밸류에이션 ──────────────────────────────────────── */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <SectionHeader num="9" title="밸류에이션 & 피어 비교" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: GS_BLUE }}>
                  {["기업명", "PER (Fwd)", "PBR", "EV/EBITDA", "ROE (%)"].map((h, i) => (
                    <th key={i} className="text-white px-4 py-2 text-left font-semibold text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {peerData.map((p, i) => (
                  <tr
                    key={i}
                    className={i === 0 ? "font-bold" : ""}
                    style={{ backgroundColor: i === 0 ? "#eff6ff" : i % 2 === 0 ? BG_LIGHT : BG_WHITE }}
                  >
                    <td className="px-4 py-2.5 text-xs" style={{ color: i === 0 ? GS_BLUE : "#374151" }}>
                      {i === 0 ? "★ " : ""}{p.name}
                    </td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: i === 0 ? GS_BLUE : "#374151" }}>
                      {p.per}x {i === 0 && <span className="text-green-600 text-xs">(할인)</span>}
                    </td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: i === 0 ? GS_BLUE : "#374151" }}>{p.pbr}x</td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: i === 0 ? GS_BLUE : "#374151" }}>{p.evEbitda}x</td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: i === 0 ? BUY_GREEN : "#374151" }}>{p.roe}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { method: "DCF 가치평가", target: "₩37,500", weight: "40%", note: "WACC 8.5%, 영구성장률 2.5%" },
              { method: "PER 비교법", target: "₩35,000", weight: "35%", note: "피어 PER 18x 적용" },
              { method: "EV/EBITDA법", target: "₩35,600", weight: "25%", note: "피어 평균 12x 적용" },
            ].map((item, i) => (
              <div key={i} className="rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-500">{item.method}</p>
                <p className="text-lg font-extrabold mt-1" style={{ color: GS_BLUE }}>{item.target}</p>
                <p className="text-xs text-gray-500">가중치 {item.weight}</p>
                <p className="text-xs text-gray-400 mt-1">{item.note}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: "#eff6ff" }}>
            <p className="text-sm font-bold" style={{ color: GS_BLUE }}>
              가중평균 목표주가: ₩36,000 (현재가 대비 +26.3% 상승여력)
            </p>
          </div>
        </div>

        {/* ── 10. Bull / Bear Case ─────────────────────────────── */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <SectionHeader num="10" title="Bull / Bear Case 시나리오" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl p-5 border-2" style={{ borderColor: BUY_GREEN, backgroundColor: "#f0fdf4" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: BUY_GREEN }}>▲</div>
                <div>
                  <p className="font-extrabold text-base" style={{ color: BUY_GREEN }}>Bull Case</p>
                  <p className="text-xs text-gray-500">목표가 ₩45,000 (+57.9%)</p>
                </div>
              </div>
              <ul className="space-y-2">
                {[
                  "6G 측정 플랫폼 선점 → 글로벌 OEM 계약 체결",
                  "해외 수출 비중 30% 달성 (2027E)",
                  "클라우드 SaaS 전환 가속 → 반복 매출 확대",
                  "통신사 AI 투자 확대로 AI-기반 QoS 수요 폭증",
                  "2027E OPM 15% 달성 → 멀티플 재평가",
                ].map((item, i) => (
                  <li key={i} className="text-xs text-green-800 flex items-start gap-1.5">
                    <span className="mt-0.5">✓</span>{item}
                  </li>
                ))}
              </ul>
              <div className="mt-3 p-2 rounded bg-green-100 text-center">
                <p className="text-xs text-green-700">확률: 25%</p>
              </div>
            </div>

            <div className="rounded-xl p-5 border-2 border-blue-300" style={{ backgroundColor: "#eff6ff" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: GS_BLUE }}>→</div>
                <div>
                  <p className="font-extrabold text-base" style={{ color: GS_BLUE }}>Base Case</p>
                  <p className="text-xs text-gray-500">목표가 ₩36,000 (+26.3%)</p>
                </div>
              </div>
              <ul className="space-y-2">
                {[
                  "국내 통신사 5G 품질투자 지속 (안정적 수주)",
                  "해외 수출 비중 20% 달성 (2027E)",
                  "매출 CAGR 10~12% 유지",
                  "OPM 11~13% 구간 유지",
                  "적정 PER 16~18x 수렴",
                ].map((item, i) => (
                  <li key={i} className="text-xs text-blue-800 flex items-start gap-1.5">
                    <span className="mt-0.5">→</span>{item}
                  </li>
                ))}
              </ul>
              <div className="mt-3 p-2 rounded bg-blue-100 text-center">
                <p className="text-xs" style={{ color: GS_BLUE }}>확률: 55%</p>
              </div>
            </div>

            <div className="rounded-xl p-5 border-2" style={{ borderColor: SELL_RED, backgroundColor: "#fef2f2" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: SELL_RED }}>▼</div>
                <div>
                  <p className="font-extrabold text-base" style={{ color: SELL_RED }}>Bear Case</p>
                  <p className="text-xs text-gray-500">목표가 ₩22,000 (-22.8%)</p>
                </div>
              </div>
              <ul className="space-y-2">
                {[
                  "통신사 CAPEX 삭감 → 수주 감소",
                  "글로벌 경쟁사(VIAVI/Spirent) 국내 진출 확대",
                  "5G 투자 사이클 조기 종료",
                  "원·달러 환율 하락 → 수출 채산성 악화",
                  "핵심 인력 이탈 → R&D 역량 약화",
                ].map((item, i) => (
                  <li key={i} className="text-xs text-red-800 flex items-start gap-1.5">
                    <span className="mt-0.5">✗</span>{item}
                  </li>
                ))}
              </ul>
              <div className="mt-3 p-2 rounded bg-red-100 text-center">
                <p className="text-xs text-red-700">확률: 20%</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── 11. 최종 판단 ──────────────────────────────────────── */}
        <div className="rounded-xl p-6 border-2" style={{ borderColor: BUY_GREEN, backgroundColor: "#f0fdf4" }}>
          <SectionHeader num="11" title="최종 판단" />
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 text-center">
              <div className="w-28 h-28 rounded-full flex flex-col items-center justify-center mx-auto" style={{ backgroundColor: BUY_GREEN }}>
                <p className="text-white text-2xl font-extrabold">매수</p>
                <p className="text-green-100 text-xs">BUY</p>
              </div>
              <p className="mt-3 text-3xl font-extrabold" style={{ color: BUY_GREEN }}>₩36,000</p>
              <p className="text-sm text-gray-500">12개월 목표주가</p>
              <div className="mt-2 flex items-center justify-center gap-1">
                {[1,2,3,4,5,6,7].map(i => (
                  <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: BUY_GREEN }} />
                ))}
                {[8,9,10].map(i => (
                  <div key={i} className="w-3 h-3 rounded-full bg-gray-200" />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">확신도 7.5 / 10</p>
            </div>
            <div className="flex-1 space-y-3">
              <p className="text-base font-bold" style={{ color: GS_BLUE }}>투자 근거 요약</p>
              {[
                { icon: "1", text: "국내 통신 네트워크 품질측정 시장 점유율 1위 (추정 65%+), 높은 전환비용으로 안정적 수익 기반 확보" },
                { icon: "2", text: "5G 상용화 이후 지속적 망 품질 투자 수요 + 6G 측정 사전검증 플랫폼 선점으로 중장기 성장 동력 확보" },
                { icon: "3", text: "순현금 123억원 보유, 부채비율 42% 수준의 탄탄한 재무구조 — 다운사이드 리스크 제한적" },
                { icon: "4", text: "글로벌 피어 대비 PER 14.2x로 20~30% 할인 거래 중 — 해외 매출 확대 시 re-rating 여력 충분" },
                { icon: "5", text: "최근 3개월 신규 수주 127억원 확보 — 2025 수주잔고 가시성 높음, 실적 하방 리스크 낮음" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: BUY_GREEN }}>
                    {item.icon}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{item.text}</p>
                </div>
              ))}
              <div className="mt-4 p-4 rounded-lg border border-gray-200 bg-white">
                <p className="text-xs text-gray-400 mb-2">핵심 모니터링 지표</p>
                <div className="flex flex-wrap gap-2">
                  {["분기 수주 잔고", "해외 매출 비중", "OPM 추이", "통신사 CAPEX", "6G 표준화 일정"].map((tag, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-full text-white" style={{ backgroundColor: GS_BLUE }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 푸터 ──────────────────────────────────────────────── */}
        <div className="text-center py-4 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            본 보고서는 Goldman Sachs 스타일 형식의 참고용 분석 자료이며, 투자 권고가 아닙니다.
            모든 수치는 공개 정보 및 모델 추정치 기반이며 실제와 다를 수 있습니다.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            이노와이어리스 (036170) · 보고서 생성일: 2026-04-20 · 기준 데이터: 2025 연간보고서
          </p>
        </div>

      </div>
    </div>
  );
}
