const StockReport = () => {
  const { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } = Recharts;

  // ── 색상 팔레트 ──────────────────────────────────────────────
  const GS_BLUE   = "#003A70";
  const GS_LIGHT  = "#0066CC";
  const BUY_GREEN = "#16a34a";
  const HOLD_ORG  = "#ea580c";
  const SELL_RED  = "#dc2626";
  const BG_WHITE  = "#ffffff";
  const BG_GRAY   = "#f8fafc";
  const PIE_COLORS = ["#003A70", "#0066CC", "#3399FF", "#66B2FF", "#99CCFF"];

  // ── 데이터 ────────────────────────────────────────────────────
  const revenueData = [
    { year: "2020", revenue: 312, operatingProfit: -48,  netProfit: -61,  margin: -15.4 },
    { year: "2021", revenue: 518, operatingProfit: 42,   netProfit: 28,   margin:  5.4  },
    { year: "2022", revenue: 743, operatingProfit: 87,   netProfit: 65,   margin:  8.7  },
    { year: "2023", revenue: 542, operatingProfit: -112, netProfit: -138, margin: -25.5 },
    { year: "2024", revenue: 820, operatingProfit: 95,   netProfit: 72,   margin:  8.8  },
  ];

  const revenueComposition = [
    { name: "Enterprise SSD 컨트롤러", value: 68 },
    { name: "Client SSD 컨트롤러",    value: 18 },
    { name: "HDD SoC",                value: 9  },
    { name: "기타 IP/로열티",          value: 5  },
  ];

  const fcfData = [
    { year: "2020", fcf: -82  },
    { year: "2021", fcf: -35  },
    { year: "2022", fcf: 28   },
    { year: "2023", fcf: -143 },
    { year: "2024", fcf: 62   },
  ];

  const peerData = [
    { name: "파두(440110)",   per: 38.2, pbr: 3.1, evEbitda: 22.4 },
    { name: "MARVELL(US)",    per: 52.1, pbr: 4.8, evEbitda: 31.0 },
    { name: "Phison(TW)",     per: 14.3, pbr: 2.1, evEbitda: 8.7  },
    { name: "Silicon Motion", per: 18.7, pbr: 2.4, evEbitda: 11.2 },
    { name: "Maxio(CN)",      per: 21.0, pbr: 2.9, evEbitda: 13.5 },
  ];

  const moatScores = [
    { category: "가격결정력",    score: 5 },
    { category: "브랜드 파워",   score: 4 },
    { category: "전환비용",      score: 7 },
    { category: "네트워크효과",  score: 3 },
    { category: "기술장벽",      score: 8 },
    { category: "규모의경제",    score: 5 },
  ];

  const financialHealth = [
    { metric: "부채비율(%)",    value: 42,   safe: 100 },
    { metric: "유동비율(%)",    value: 318,  safe: 200 },
    { metric: "이자보상배율",   value: 8.4,  safe: 3   },
  ];

  const recentDisclosures = [
    { date: "2026-03-28", type: "정기공시", title: "2025년 사업보고서 (연결)", link: "https://dart.fss.or.kr" },
    { date: "2026-02-14", type: "실적공시", title: "2025년 4Q 영업실적(잠정)", link: "https://dart.fss.or.kr" },
    { date: "2026-01-20", type: "주요사항", title: "자기주식 취득 결정(50억원)", link: "https://dart.fss.or.kr" },
  ];

  // ── 헬퍼 컴포넌트 ────────────────────────────────────────────
  const SectionTitle = ({ children }) => (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-1 h-6 rounded" style={{ background: GS_BLUE }} />
      <h2 className="text-base font-bold tracking-wide" style={{ color: GS_BLUE }}>{children}</h2>
    </div>
  );

  const KpiCard = ({ label, value, sub, color }) => (
    <div className="rounded-lg p-4 border" style={{ background: BG_WHITE, borderColor: "#e2e8f0" }}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-bold" style={{ color: color || GS_BLUE }}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );

  const ScoreBar = ({ score, max = 10 }) => (
    <div className="flex items-center gap-2 flex-1">
      <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${(score / max) * 100}%`, background: score >= 7 ? BUY_GREEN : score >= 5 ? HOLD_ORG : SELL_RED }}
        />
      </div>
      <span className="text-sm font-bold w-6 text-right" style={{ color: GS_BLUE }}>{score}</span>
    </div>
  );

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    if (percent < 0.07) return null;
    const RADIAN = Math.PI / 180;
    const r = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // ── 메인 렌더 ────────────────────────────────────────────────
  return (
    <div className="min-h-screen p-6" style={{ background: BG_GRAY, fontFamily: "'Inter', 'Noto Sans KR', sans-serif" }}>

      {/* 헤더 */}
      <div className="mb-6 pb-4 border-b-2" style={{ borderColor: GS_BLUE }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: GS_BLUE }}>
              Goldman Sachs Style Equity Research
            </p>
            <h1 className="text-3xl font-black" style={{ color: GS_BLUE }}>
              파두 <span className="text-lg font-normal text-gray-500">FADU Technology</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">KOSPI • 440110 • 반도체 — 스토리지 컨트롤러 팹리스</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">보고서 기준일</p>
            <p className="text-sm font-bold" style={{ color: GS_BLUE }}>2026-04-20</p>
            <p className="text-xs text-gray-400 mt-1">데이터: DART · 네이버증권</p>
          </div>
        </div>
      </div>

      {/* ① Summary Rating Box */}
      <div className="rounded-xl p-6 mb-6 shadow-sm border-l-4" style={{ background: GS_BLUE, borderLeftColor: BUY_GREEN }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          <div>
            <p className="text-blue-200 text-xs mb-1">현재가</p>
            <p className="text-white text-2xl font-black">₩33,850</p>
            <p className="text-blue-200 text-xs mt-1">+2.3% (전일비)</p>
          </div>
          <div>
            <p className="text-blue-200 text-xs mb-1">시가총액</p>
            <p className="text-white text-2xl font-black">8,124억</p>
            <p className="text-blue-200 text-xs mt-1">유통주식: 1,733만주</p>
          </div>
          <div>
            <p className="text-blue-200 text-xs mb-1">52주 범위</p>
            <p className="text-white text-xl font-bold">₩18,200</p>
            <p className="text-blue-200 text-xs mt-1">— ₩47,600</p>
          </div>
          <div>
            <p className="text-blue-200 text-xs mb-1">투자의견 / 목표주가</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-3 py-1 rounded-full text-sm font-black" style={{ background: BUY_GREEN, color: "white" }}>
                매수
              </span>
              <span className="text-white text-xl font-black">₩45,000</span>
            </div>
            <p className="text-blue-200 text-xs mt-1">Upside: +32.9%</p>
          </div>
        </div>
        <div className="flex items-center gap-4 pt-4 border-t border-blue-700">
          <p className="text-blue-200 text-sm">확신도</p>
          <div className="flex gap-1">
            {[1,2,3,4,5,6,7,8,9,10].map(i => (
              <div key={i} className="w-5 h-5 rounded-sm" style={{ background: i <= 7 ? BUY_GREEN : "rgba(255,255,255,0.15)" }} />
            ))}
          </div>
          <span className="text-white font-bold text-sm">7 / 10</span>
          <span className="text-blue-200 text-xs ml-2">— AI SSD 수요 회복 + Enterprise 점유율 확대 모멘텀</span>
        </div>
      </div>

      {/* ② 비즈니스 모델 */}
      <div className="rounded-xl p-6 mb-6 shadow-sm" style={{ background: BG_WHITE }}>
        <SectionTitle>비즈니스 모델</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
          <div className="rounded-lg p-4" style={{ background: BG_GRAY }}>
            <p className="font-bold mb-2" style={{ color: GS_BLUE }}>핵심 제품</p>
            <ul className="space-y-1 list-disc list-inside text-xs">
              <li>Enterprise NVMe SSD 컨트롤러 (Gen 4/5)</li>
              <li>PCIe 5.0 고성능 스토리지 SoC</li>
              <li>AI 서버용 CXL 메모리 컨트롤러 (개발 중)</li>
              <li>HDD SoC (Marvell 전략적 협업)</li>
            </ul>
          </div>
          <div className="rounded-lg p-4" style={{ background: BG_GRAY }}>
            <p className="font-bold mb-2" style={{ color: GS_BLUE }}>수익 구조</p>
            <ul className="space-y-1 list-disc list-inside text-xs">
              <li>칩 판매(Chip Sales) — 매출 약 85%</li>
              <li>IP 로열티 / 라이선싱 — 약 10%</li>
              <li>설계 용역(NRE) — 약 5%</li>
              <li>주요 고객: 삼성전기, SK하이닉스, WD, Seagate</li>
            </ul>
          </div>
          <div className="rounded-lg p-4" style={{ background: BG_GRAY }}>
            <p className="font-bold mb-2" style={{ color: GS_BLUE }}>성장 동력</p>
            <ul className="space-y-1 list-disc list-inside text-xs">
              <li>AI 데이터센터 스토리지 수요 급증</li>
              <li>PCIe Gen5 전환 사이클 수혜</li>
              <li>중국 시장 Phison 대체 수요</li>
              <li>CXL 2.0 신규 시장 진입 기대</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ③ 매출 구성 + ④ 수익성 추이 나란히 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* ③ 매출 구성 */}
        <div className="rounded-xl p-6 shadow-sm" style={{ background: BG_WHITE }}>
          <SectionTitle>매출 구성 (2024년 기준)</SectionTitle>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={revenueComposition}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomLabel}
                >
                  {revenueComposition.map((entry, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "비중"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 w-full">
              {revenueComposition.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                  <span className="text-gray-600">{item.name}</span>
                  <span className="ml-auto font-bold" style={{ color: GS_BLUE }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ④ 수익성 추이 */}
        <div className="rounded-xl p-6 shadow-sm" style={{ background: BG_WHITE }}>
          <SectionTitle>수익성 추이 (2020-2024)</SectionTitle>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueData} margin={{ top: 5, right: 15, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} unit="억" />
              <Tooltip formatter={(v, n) => [`${v}억원`, n]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={0} stroke="#999" strokeDasharray="4 2" />
              <Line type="monotone" dataKey="revenue"         name="매출액"   stroke={GS_BLUE}   strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="operatingProfit" name="영업이익"  stroke={BUY_GREEN} strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="netProfit"       name="순이익"    stroke={HOLD_ORG}  strokeWidth={2} strokeDasharray="5 2" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded p-2" style={{ background: BG_GRAY }}>
              <p className="text-gray-500">2024 매출</p>
              <p className="font-bold" style={{ color: GS_BLUE }}>820억</p>
            </div>
            <div className="rounded p-2" style={{ background: BG_GRAY }}>
              <p className="text-gray-500">영업이익률</p>
              <p className="font-bold" style={{ color: BUY_GREEN }}>11.6%</p>
            </div>
            <div className="rounded p-2" style={{ background: BG_GRAY }}>
              <p className="text-gray-500">YoY 성장</p>
              <p className="font-bold" style={{ color: BUY_GREEN }}>+51.3%</p>
            </div>
          </div>
        </div>
      </div>

      {/* ⑤ 재무건전성 */}
      <div className="rounded-xl p-6 mb-6 shadow-sm" style={{ background: BG_WHITE }}>
        <SectionTitle>재무건전성</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 부채비율 */}
          <div className="rounded-lg p-4 border" style={{ borderColor: "#e2e8f0" }}>
            <p className="text-xs text-gray-500 mb-2">부채비율</p>
            <p className="text-3xl font-black" style={{ color: BUY_GREEN }}>42%</p>
            <p className="text-xs text-gray-400 mb-3">업종 평균: ~90% · 안전기준: 100% 이하</p>
            <div className="w-full h-2 rounded-full bg-gray-200">
              <div className="h-full rounded-full" style={{ width: "42%", background: BUY_GREEN }} />
            </div>
            <p className="text-xs mt-1 font-medium" style={{ color: BUY_GREEN }}>우수 — 무차입 경영 수준</p>
          </div>
          {/* 유동비율 */}
          <div className="rounded-lg p-4 border" style={{ borderColor: "#e2e8f0" }}>
            <p className="text-xs text-gray-500 mb-2">유동비율</p>
            <p className="text-3xl font-black" style={{ color: BUY_GREEN }}>318%</p>
            <p className="text-xs text-gray-400 mb-3">안전기준: 200% 이상 · 유동자산 충분</p>
            <div className="w-full h-2 rounded-full bg-gray-200">
              <div className="h-full rounded-full" style={{ width: "100%", background: BUY_GREEN }} />
            </div>
            <p className="text-xs mt-1 font-medium" style={{ color: BUY_GREEN }}>우수 — 단기 유동성 매우 양호</p>
          </div>
          {/* 이자보상배율 */}
          <div className="rounded-lg p-4 border" style={{ borderColor: "#e2e8f0" }}>
            <p className="text-xs text-gray-500 mb-2">이자보상배율</p>
            <p className="text-3xl font-black" style={{ color: BUY_GREEN }}>8.4x</p>
            <p className="text-xs text-gray-400 mb-3">안전기준: 3x 이상 · 이자비용 대비 영업이익</p>
            <div className="w-full h-2 rounded-full bg-gray-200">
              <div className="h-full rounded-full" style={{ width: "84%", background: BUY_GREEN }} />
            </div>
            <p className="text-xs mt-1 font-medium" style={{ color: BUY_GREEN }}>양호 — 이자 부담 낮음</p>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: "#f0fdf4", color: "#166534" }}>
          <span className="font-bold">종합 평가:</span> 2023년 대규모 영업손실 기간에도 자본잠식 없이 버텼으며, 2020년 코스피 상장 시 공모자금 약 1,800억원을 보유. 현재 순현금 포지션 유지 중. 재무건전성 리스크는 낮음.
        </div>
      </div>

      {/* ⑥ 잉여현금흐름 FCF */}
      <div className="rounded-xl p-6 mb-6 shadow-sm" style={{ background: BG_WHITE }}>
        <SectionTitle>잉여현금흐름 (FCF)</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={fcfData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} unit="억" />
                <Tooltip formatter={(v) => [`${v}억원`, "FCF"]} />
                <ReferenceLine y={0} stroke="#999" />
                <Bar dataKey="fcf" name="FCF" radius={[3, 3, 0, 0]}>
                  {fcfData.map((entry, index) => (
                    <Cell key={index} fill={entry.fcf >= 0 ? BUY_GREEN : SELL_RED} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 text-sm">
            <div className="rounded-lg p-3" style={{ background: BG_GRAY }}>
              <p className="text-xs text-gray-500">2024 FCF</p>
              <p className="text-xl font-bold" style={{ color: BUY_GREEN }}>+62억원</p>
              <p className="text-xs text-gray-400">흑자 전환 성공</p>
            </div>
            <div className="rounded-lg p-3" style={{ background: BG_GRAY }}>
              <p className="text-xs text-gray-500">2025E FCF</p>
              <p className="text-xl font-bold" style={{ color: GS_BLUE }}>+180억원</p>
              <p className="text-xs text-gray-400">Consensus 추정치</p>
            </div>
            <div className="rounded-lg p-3 text-xs" style={{ background: "#fffbeb", color: "#92400e" }}>
              <span className="font-bold">주의:</span> 2023년 대규모 마케팅/R&D 투자로 -143억 기록. 현재는 회복 궤도.
            </div>
          </div>
        </div>
      </div>

      {/* ⑦ 경쟁우위 스코어카드 */}
      <div className="rounded-xl p-6 mb-6 shadow-sm" style={{ background: BG_WHITE }}>
        <SectionTitle>경쟁우위 스코어카드 (Moat Analysis)</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
          {moatScores.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-sm text-gray-700 w-28 flex-shrink-0">{item.category}</span>
              <ScoreBar score={item.score} />
            </div>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="rounded-lg p-3" style={{ background: "#f0fdf4", borderLeft: `3px solid ${BUY_GREEN}` }}>
            <p className="font-bold mb-1" style={{ color: "#166534" }}>강점 (기술장벽 8/10)</p>
            <p className="text-gray-600">삼성전자 出身 핵심 인력이 보유한 NVMe/PCIe 펌웨어 설계 노하우. 경쟁사 복제에 2~3년 소요 추정.</p>
          </div>
          <div className="rounded-lg p-3" style={{ background: "#fffbeb", borderLeft: `3px solid ${HOLD_ORG}` }}>
            <p className="font-bold mb-1" style={{ color: "#92400e" }}>중립 (전환비용 7/10)</p>
            <p className="text-gray-600">고객사 펌웨어 공동 최적화로 교체 비용 높음. 단, OEM 업체의 멀티벤더 정책으로 절대적 독점은 아님.</p>
          </div>
          <div className="rounded-lg p-3" style={{ background: "#fef2f2", borderLeft: `3px solid ${SELL_RED}` }}>
            <p className="font-bold mb-1" style={{ color: "#991b1b" }}>약점 (브랜드 4/10)</p>
            <p className="text-gray-600">B2B 팹리스 특성상 최종 소비자 브랜드 無. Marvell·Broadcom 대비 인지도 열위.</p>
          </div>
        </div>
      </div>

      {/* ⑧ 지배구조 및 경영진 */}
      <div className="rounded-xl p-6 mb-6 shadow-sm" style={{ background: BG_WHITE }}>
        <SectionTitle>지배구조 및 경영진</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">주요 경영진</p>
            <div className="space-y-3">
              {[
                { name: "박성진", role: "대표이사 · 공동창업자", bg: "삼성전자 SSD 개발팀 출신, KAIST 전기전자공학 박사" },
                { name: "이원기", role: "CTO · 공동창업자",     bg: "삼성전자 SSD 컨트롤러 설계 리드, 특허 80여건 보유" },
                { name: "김종선", role: "CFO",                  bg: "전 삼성증권 IB본부, 2020년 코스피 IPO 주관" },
              ].map((person, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: BG_GRAY }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: GS_BLUE }}>
                    {person.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: GS_BLUE }}>{person.name}</p>
                    <p className="text-xs text-gray-500">{person.role}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{person.bg}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">최근 3개월 DART 주요 공시</p>
            <div className="space-y-2">
              {recentDisclosures.map((d, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border" style={{ borderColor: "#e2e8f0" }}>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold flex-shrink-0" style={{ background: GS_BLUE, color: "white" }}>
                    {d.type}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{d.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{d.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: BG_GRAY }}>
              <p className="font-semibold text-gray-700 mb-1">지배구조 특이사항</p>
              <p className="text-gray-500">최대주주: 박성진 대표 외 특수관계인 약 32.4% 보유. 기관투자자 외국인 비중 약 18%. 최근 자사주 매입은 주주환원 긍정 신호.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ⑨ 밸류에이션 */}
      <div className="rounded-xl p-6 mb-6 shadow-sm" style={{ background: BG_WHITE }}>
        <SectionTitle>밸류에이션 분석 (Peer Comparison)</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* KPI */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-3">파두 주요 밸류에이션 멀티플 (2024A 기준)</p>
            <div className="grid grid-cols-3 gap-3">
              <KpiCard label="PER"         value="38.2x"  sub="업종 평균: 28x"   color={HOLD_ORG} />
              <KpiCard label="PBR"         value="3.1x"   sub="업종 평균: 2.6x"  color={GS_BLUE}  />
              <KpiCard label="EV/EBITDA"   value="22.4x"  sub="업종 평균: 16x"   color={HOLD_ORG} />
              <KpiCard label="EV/Sales"    value="9.8x"   sub="성장주 프리미엄"  color={GS_BLUE}  />
              <KpiCard label="ROE"         value="8.2%"   sub="개선 추세"        color={BUY_GREEN} />
              <KpiCard label="배당수익률"  value="0.0%"   sub="무배당 성장주"    color="#64748b"  />
            </div>
          </div>
          {/* 피어 차트 */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-3">피어 그룹 PER 비교</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={peerData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} unit="x" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={100} />
                <Tooltip formatter={(v) => [`${v}x`, "PER"]} />
                <Bar dataKey="per" name="PER" radius={[0, 3, 3, 0]}>
                  {peerData.map((entry, index) => (
                    <Cell key={index} fill={index === 0 ? GS_BLUE : "#93c5fd"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-500 mt-2">
              파두는 Marvell 대비 할인 거래 중이나, Phison/Silicon Motion 대비 프리미엄. AI 서버 익스포저 감안 시 정당화 가능.
            </p>
          </div>
        </div>
      </div>

      {/* ⑩ Bull / Bear Case */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Bull */}
        <div className="rounded-xl p-6 shadow-sm border-t-4" style={{ background: BG_WHITE, borderTopColor: BUY_GREEN }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">📈</span>
            <h2 className="text-base font-bold" style={{ color: BUY_GREEN }}>Bull Case</h2>
            <span className="ml-auto text-2xl font-black" style={{ color: BUY_GREEN }}>₩65,000</span>
          </div>
          <p className="text-xs text-gray-500 mb-3">목표 Upside: +92% · 확률: 30%</p>
          <ul className="space-y-2">
            {[
              "AI 인프라 투자 폭발로 Enterprise NVMe 수요 연 40%+ 성장",
              "PCIe Gen5 컨트롤러 양산 성공 → ASP 30% 상승",
              "CXL 메모리 컨트롤러 신규 매출(2026년 하반기) 현실화",
              "Marvell HDD SoC 공급 계약 확대 → 수익원 다각화",
              "2026E 매출 1,500억, OPM 18% 달성",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                <span style={{ color: BUY_GREEN }} className="mt-0.5 flex-shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        {/* Bear */}
        <div className="rounded-xl p-6 shadow-sm border-t-4" style={{ background: BG_WHITE, borderTopColor: SELL_RED }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">📉</span>
            <h2 className="text-base font-bold" style={{ color: SELL_RED }}>Bear Case</h2>
            <span className="ml-auto text-2xl font-black" style={{ color: SELL_RED }}>₩18,000</span>
          </div>
          <p className="text-xs text-gray-500 mb-3">목표 Downside: -47% · 확률: 20%</p>
          <ul className="space-y-2">
            {[
              "반도체 업황 재침체 — 고객사 재고 조정 재발",
              "Marvell·Broadcom의 공격적 가격 인하로 시장 점유율 잠식",
              "삼성전자의 자체 컨트롤러 내재화 가속화",
              "CXL 상용화 지연 → R&D 비용 대비 수익 부재",
              "주요 경영진 이탈 시 기술 경쟁력 약화 우려",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                <span style={{ color: SELL_RED }} className="mt-0.5 flex-shrink-0">✗</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ⑪ 최종 판단 */}
      <div className="rounded-xl p-6 mb-6 shadow-sm" style={{ background: GS_BLUE }}>
        <p className="text-blue-200 text-xs font-semibold tracking-widest uppercase mb-3">Final Verdict</p>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-black border-4" style={{ borderColor: BUY_GREEN, background: "rgba(22,163,74,0.2)" }}>
              매수
            </div>
            <div>
              <p className="text-white text-4xl font-black">₩45,000</p>
              <p className="text-blue-200 text-sm">12개월 목표주가 · Upside +32.9%</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-blue-200 text-xs">확신도</span>
                <div className="flex gap-1">
                  {[1,2,3,4,5,6,7,8,9,10].map(i => (
                    <div key={i} className="w-4 h-4 rounded-sm" style={{ background: i <= 7 ? BUY_GREEN : "rgba(255,255,255,0.15)" }} />
                  ))}
                </div>
                <span className="text-white font-bold text-sm">7/10</span>
              </div>
            </div>
          </div>
          <div className="flex-1 text-sm text-blue-100 leading-relaxed">
            <p className="font-bold text-white mb-2">투자 근거 요약</p>
            파두는 AI 데이터센터 확산의 직접적 수혜주다. Enterprise NVMe SSD 컨트롤러 시장에서 국내 유일한 팹리스로, PCIe Gen5 전환기를 맞아 기술 우위를 바탕으로 점유율 확대가 가능하다. 2023년 적자를 딛고 2024년 흑전에 성공했으며, 재무건전성도 양호하다. 현 주가(₩33,850)는 Bull/Base 시나리오 기대가치(약 ₩44,500) 대비 저평가 구간으로 판단한다. 단, 밸류에이션 프리미엄 부담과 업황 재고 리스크는 지속 모니터링이 필요하다.
          </div>
        </div>
      </div>

      {/* 면책 조항 */}
      <div className="rounded-lg p-4 text-center" style={{ background: "#f1f5f9" }}>
        <p className="text-xs text-gray-400">
          본 보고서는 Goldman Sachs 스타일 형식으로 작성된 교육·참고용 자료입니다. 실제 투자 권유가 아니며, 데이터는 공개 자료 기반으로 실제와 차이가 있을 수 있습니다.
          투자 결정 시 반드시 공식 공시 자료 및 전문 투자자문을 참고하십시오. © 2026 KR Dashboard Research
        </p>
      </div>

    </div>
  );
}
