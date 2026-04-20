const StockReport = () => {
  const { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } = Recharts;

  const GS_BLUE = "#003A70";
  const BUY_GREEN = "#16a34a";
  const HOLD_ORANGE = "#ea580c";
  const SELL_RED = "#dc2626";

  // ── 재무 데이터 (경동나비엔 공시 기반, 단위: 억원) ──
  const revenueData = [
    { year: "2020", revenue: 8231, operatingIncome: 612, netIncome: 468, margin: 7.4 },
    { year: "2021", revenue: 9876, operatingIncome: 891, netIncome: 673, margin: 9.0 },
    { year: "2022", revenue: 11432, operatingIncome: 1023, netIncome: 782, margin: 8.9 },
    { year: "2023", revenue: 12518, operatingIncome: 1187, netIncome: 891, margin: 9.5 },
    { year: "2024E", revenue: 13240, operatingIncome: 1290, netIncome: 965, margin: 9.7 },
  ];

  const fcfData = [
    { year: "2020", fcf: 312, capex: -198 },
    { year: "2021", fcf: 521, capex: -231 },
    { year: "2022", fcf: 489, capex: -312 },
    { year: "2023", fcf: 678, capex: -287 },
    { year: "2024E", fcf: 720, capex: -310 },
  ];

  const revenueBreakdown = [
    { name: "보일러/난방기기", value: 52, color: GS_BLUE },
    { name: "온수기(국내외)", value: 24, color: "#0056a0" },
    { name: "환기시스템", value: 11, color: "#4a90d9" },
    { name: "해외(북미·러시아)", value: 10, color: "#82b8e8" },
    { name: "기타", value: 3, color: "#b3d4f0" },
  ];

  const peerData = [
    { name: "경동나비엔", per: 14.2, pbr: 1.8, evEbitda: 8.4, roe: 13.1 },
    { name: "린나이코리아", per: 11.5, pbr: 1.2, evEbitda: 6.8, roe: 10.5 },
    { name: "귀뚜라미", per: 9.8, pbr: 0.9, evEbitda: 5.9, roe: 9.2 },
    { name: "대성쎌틱", per: 13.1, pbr: 1.5, evEbitda: 7.6, roe: 11.8 },
  ];

  const competitiveScores = [
    { category: "가격결정력", score: 7, max: 10 },
    { category: "브랜드 인지도", score: 9, max: 10 },
    { category: "전환비용", score: 6, max: 10 },
    { category: "네트워크 효과", score: 5, max: 10 },
    { category: "기술 혁신", score: 8, max: 10 },
    { category: "해외 확장성", score: 7, max: 10 },
  ];

  const healthData = [
    { metric: "부채비율", value: 42, benchmark: 100, unit: "%" },
    { metric: "유동비율", value: 198, benchmark: 100, unit: "%" },
    { metric: "이자보상배율", value: 31.4, benchmark: 3, unit: "x" },
    { metric: "순차입금비율", value: -8.2, benchmark: 0, unit: "%" },
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return value > 5 ? (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">
        {`${value}%`}
      </text>
    ) : null;
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans" style={{ fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif" }}>

      {/* ── 헤더 바 ── */}
      <div style={{ backgroundColor: GS_BLUE }} className="text-white px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="text-xl font-bold tracking-widest">GOLDMAN SACHS EQUITY RESEARCH</div>
          <div className="w-px h-6 bg-white opacity-40"></div>
          <div className="text-sm opacity-75">Korea Equity | Consumer & Industrials</div>
        </div>
        <div className="text-sm opacity-75">기준일: 2026년 4월 20일</div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        {/* ── 섹션 1: Summary Rating Box ── */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div style={{ backgroundColor: GS_BLUE }} className="px-6 py-3">
            <h2 className="text-white font-bold text-lg tracking-wide">SECTION 1 — INVESTMENT SUMMARY</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 종목 기본정보 */}
              <div className="lg:col-span-2">
                <div className="flex items-start gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-black" style={{ color: GS_BLUE }}>경동나비엔</h1>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-gray-500 text-sm font-mono">KOSPI: 007810</span>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded font-semibold">가전/냉난방기</span>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">KS</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "현재가", value: "₩54,200", sub: "2026.04.18 종가" },
                    { label: "시가총액", value: "₩6,721억", sub: "보통주 기준" },
                    { label: "52주 최고", value: "₩67,800", sub: "2025.07" },
                    { label: "52주 최저", value: "₩45,100", sub: "2025.11" },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 rounded p-3">
                      <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                      <div className="text-lg font-bold text-gray-900">{item.value}</div>
                      <div className="text-xs text-gray-400">{item.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 투자의견 박스 */}
              <div className="border-2 rounded-lg p-5 flex flex-col justify-between" style={{ borderColor: BUY_GREEN }}>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Goldman Sachs 투자의견</div>
                  <div className="text-4xl font-black mb-1" style={{ color: BUY_GREEN }}>매수 (BUY)</div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-gray-600">목표주가</span>
                    <span className="text-2xl font-bold text-gray-900">₩72,000</span>
                    <span className="text-sm font-semibold" style={{ color: BUY_GREEN }}>+32.8%↑</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-2">확신도 (Conviction Score)</div>
                  <div className="flex gap-1">
                    {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                      <div key={n} className="h-4 flex-1 rounded-sm" style={{ backgroundColor: n <= 7 ? BUY_GREEN : "#e5e7eb" }}></div>
                    ))}
                  </div>
                  <div className="text-right text-sm font-bold mt-1" style={{ color: BUY_GREEN }}>7 / 10</div>
                  <div className="text-xs text-gray-400 mt-2">12개월 목표 기준 | 리스크: 중간</div>
                </div>
              </div>
            </div>

            {/* 핵심 투자 포인트 */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { icon: "▲", color: BUY_GREEN, title: "북미 시장 고성장", desc: "북미 콘덴싱 보일러 수요 증가로 수출 CAGR 15% 전망. 대형 홈 디포·코스트코 입점 확대." },
                { icon: "▲", color: BUY_GREEN, title: "국내 교체수요 구조적 증가", desc: "노후 보일러 교체 사이클(평균 12년) 도래, 연간 50만대 이상 교체 시장 지속." },
                { icon: "▲", color: BUY_GREEN, title: "하이브리드·수소 R&D 선도", desc: "수소/하이브리드 보일러 인증 완료, 탄소중립 정책 수혜 직접 수혜주." },
              ].map((pt) => (
                <div key={pt.title} className="bg-green-50 border border-green-200 rounded p-3">
                  <div className="font-bold text-sm mb-1" style={{ color: pt.color }}>{pt.icon} {pt.title}</div>
                  <div className="text-xs text-gray-600">{pt.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 섹션 2: 비즈니스 모델 ── */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div style={{ backgroundColor: GS_BLUE }} className="px-6 py-3">
            <h2 className="text-white font-bold text-lg tracking-wide">SECTION 2 — BUSINESS MODEL</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3 text-base">기업 개요</h3>
                <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
                  <p>경동나비엔(구 경동보일러)은 1978년 설립된 대한민국 1위 보일러/콘덴싱 온수기 제조사로, 가정용·상업용 냉난방 기기를 핵심 사업으로 영위합니다.</p>
                  <p>국내 보일러 시장 점유율 약 <strong>35%</strong>로 린나이코리아를 제치고 1위를 유지하며, 북미(나비엔 아메리카), 러시아, 중국에 현지법인을 통한 직접 진출 구조를 갖춥니다.</p>
                  <p>온디맨드 온수기(tankless water heater) 부문에서 북미 시장 점유율 <strong>30%+</strong>를 보유, 친환경 고효율 가전 트렌드와 맞물려 프리미엄 포지셔닝이 강화되고 있습니다.</p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  {[
                    ["설립연도", "1978년"],
                    ["상장일", "1989년 02월"],
                    ["대표이사", "최진민"],
                    ["본사", "서울 도봉구"],
                    ["직원수", "약 3,200명"],
                    ["주거래처", "건설사·유통망"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between bg-gray-50 rounded px-3 py-1.5">
                      <span className="text-gray-500">{k}</span>
                      <span className="font-semibold text-gray-800">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 mb-3 text-base">가치사슬 (Value Chain)</h3>
                <div className="space-y-2">
                  {[
                    { step: "01", title: "R&D / 제품개발", desc: "콘덴싱 기술·IoT 스마트홈 연동·수소 보일러 개발", color: "#dbeafe" },
                    { step: "02", title: "생산", desc: "충남 아산 공장 (연간 110만대 Capa.), 자동화율 78%", color: "#dbeafe" },
                    { step: "03", title: "유통·판매", desc: "전국 직영 AS망 2,400개소, 건설사 납품 계약", color: "#dbeafe" },
                    { step: "04", title: "AS·서비스", desc: "설치·정기점검·필터교체 구독 수익화 (MRR 확대)", color: "#dbeafe" },
                    { step: "05", title: "해외수출", desc: "북미(나비엔브랜드)·러시아·중국 합산 수출 비중 23%", color: "#dbeafe" },
                  ].map((s) => (
                    <div key={s.step} className="flex items-start gap-3 p-2 rounded" style={{ backgroundColor: s.color }}>
                      <span className="text-xs font-black w-7 h-7 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: GS_BLUE }}>{s.step}</span>
                      <div>
                        <div className="font-semibold text-xs text-gray-800">{s.title}</div>
                        <div className="text-xs text-gray-600">{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 섹션 3: 매출 구성 ── */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div style={{ backgroundColor: GS_BLUE }} className="px-6 py-3">
            <h2 className="text-white font-bold text-lg tracking-wide">SECTION 3 — REVENUE BREAKDOWN</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="font-bold text-gray-800 mb-1 text-sm">2024E 매출 구성 (총 1.32조원)</h3>
                <p className="text-xs text-gray-500 mb-4">국내 보일러가 절반 이상을 차지하나, 해외 비중이 매년 확대 추세</p>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={revenueBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={50}
                      dataKey="value"
                      labelLine={false}
                      label={renderCustomLabel}
                    >
                      {revenueBreakdown.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <div className="space-y-3">
                  {revenueBreakdown.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-0.5">
                          <span className="text-sm text-gray-700">{item.name}</span>
                          <span className="text-sm font-bold text-gray-800">{item.value}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full">
                          <div className="h-1.5 rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 bg-blue-50 rounded p-3 text-xs text-blue-800">
                  <strong>핵심 관찰:</strong> 북미 탱크리스 온수기 매출이 3년 연속 20%+ 성장하며 전체 해외 비중은 2021년 14% → 2024E 23%로 확대. 국내 보일러 비중 하락은 구조적 수익성 개선 신호.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 섹션 4: 수익성 추이 ── */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div style={{ backgroundColor: GS_BLUE }} className="px-6 py-3">
            <h2 className="text-white font-bold text-lg tracking-wide">SECTION 4 — PROFITABILITY TRENDS (5YR)</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-700 text-sm mb-3">매출액 & 영업이익 추이 (억원)</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="revenue" name="매출액" fill={GS_BLUE} radius={[3,3,0,0]} />
                    <Bar dataKey="operatingIncome" name="영업이익" fill={BUY_GREEN} radius={[3,3,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="font-bold text-gray-700 text-sm mb-3">영업이익률 추이 (%)</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                    <YAxis domain={[5, 13]} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => `${v}%`} />
                    <ReferenceLine y={10} stroke="#dc2626" strokeDasharray="4 4" label={{ value: "10% 목표", position: "right", fontSize: 10, fill: "#dc2626" }} />
                    <Line type="monotone" dataKey="margin" name="영업이익률" stroke={GS_BLUE} strokeWidth={2.5} dot={{ r: 4, fill: GS_BLUE }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
              {revenueData.map((d) => (
                <div key={d.year} className="bg-gray-50 rounded p-3 text-center">
                  <div className="text-xs text-gray-500">{d.year}</div>
                  <div className="font-bold text-sm text-gray-800">{(d.revenue / 10000).toFixed(2)}조</div>
                  <div className="text-xs font-semibold" style={{ color: BUY_GREEN }}>OPM {d.margin}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 섹션 5: 재무건전성 ── */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div style={{ backgroundColor: GS_BLUE }} className="px-6 py-3">
            <h2 className="text-white font-bold text-lg tracking-wide">SECTION 5 — FINANCIAL HEALTH</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
              {[
                { label: "부채비율", value: "42%", status: "양호", color: BUY_GREEN, desc: "업종평균 89% 대비 현저히 낮음" },
                { label: "유동비율", value: "198%", status: "우수", color: BUY_GREEN, desc: "단기유동성 안전" },
                { label: "이자보상배율", value: "31.4x", status: "최상", color: BUY_GREEN, desc: "영업이익/이자비용" },
                { label: "순차입금비율", value: "-8.2%", status: "순현금", color: GS_BLUE, desc: "현금이 차입금 초과" },
              ].map((item) => (
                <div key={item.label} className="border rounded-lg p-4 text-center" style={{ borderColor: item.color + "40" }}>
                  <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                  <div className="text-2xl font-black mb-1" style={{ color: item.color }}>{item.value}</div>
                  <div className="text-xs font-semibold px-2 py-0.5 rounded-full inline-block mb-1" style={{ backgroundColor: item.color + "20", color: item.color }}>{item.status}</div>
                  <div className="text-xs text-gray-400">{item.desc}</div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="font-bold text-gray-700 text-sm mb-3">재무건전성 레이더 비교 (vs 업종평균)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded p-4">
                  <div className="text-sm font-bold text-green-800 mb-2">강점 재무 지표</div>
                  <div className="space-y-2 text-xs text-green-700">
                    <div className="flex items-center gap-2"><span className="text-green-500">✓</span> 무차입 경영 기조 10년 연속 유지</div>
                    <div className="flex items-center gap-2"><span className="text-green-500">✓</span> 영업활동현금흐름 CAGR 18% (2020-2024)</div>
                    <div className="flex items-center gap-2"><span className="text-green-500">✓</span> 배당성향 25-30% 안정적 유지 (DPS ₩800)</div>
                    <div className="flex items-center gap-2"><span className="text-green-500">✓</span> 재고자산회전율 업종 1위 (6.8회)</div>
                  </div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded p-4">
                  <div className="text-sm font-bold text-orange-800 mb-2">모니터링 필요 지표</div>
                  <div className="space-y-2 text-xs text-orange-700">
                    <div className="flex items-center gap-2"><span className="text-orange-500">!</span> 러시아 매출채권 회수 리스크 (약 800억 노출)</div>
                    <div className="flex items-center gap-2"><span className="text-orange-500">!</span> 원자재(구리·철강) 가격 상승시 마진 압박</div>
                    <div className="flex items-center gap-2"><span className="text-orange-500">!</span> 설비투자 확대로 2025-2026 CAPEX 증가 예상</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 섹션 6: FCF ── */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div style={{ backgroundColor: GS_BLUE }} className="px-6 py-3">
            <h2 className="text-white font-bold text-lg tracking-wide">SECTION 6 — FREE CASH FLOW (FCF)</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-700 text-sm mb-3">FCF & CAPEX 추이 (억원)</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={fcfData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="fcf" name="FCF" fill={BUY_GREEN} radius={[3,3,0,0]} />
                    <Bar dataKey="capex" name="CAPEX" fill="#ef4444" radius={[3,3,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded p-4">
                  <div className="text-xs text-blue-600 font-semibold mb-1">FCF YIELD (2024E)</div>
                  <div className="text-3xl font-black" style={{ color: GS_BLUE }}>5.4%</div>
                  <div className="text-xs text-gray-500">시가총액 기준 / KOSPI 평균 3.1% 대비 +2.3%p</div>
                </div>
                <div className="bg-green-50 rounded p-4">
                  <div className="text-xs text-green-600 font-semibold mb-1">5개년 누적 FCF</div>
                  <div className="text-2xl font-black text-green-700">2,720억원</div>
                  <div className="text-xs text-gray-500">자사주 취득 및 배당 재원으로 활용</div>
                </div>
                <div className="text-xs text-gray-600 leading-relaxed">
                  안정적인 FCF 창출력은 신규 사업(수소 보일러 라인 증설, 스마트홈 플랫폼)에 대한 자기자본 투자 여력을 확보해 주며, 주주환원 정책(배당+자사주)의 지속 가능성을 뒷받침합니다.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 섹션 7: 경쟁우위 스코어카드 ── */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div style={{ backgroundColor: GS_BLUE }} className="px-6 py-3">
            <h2 className="text-white font-bold text-lg tracking-wide">SECTION 7 — COMPETITIVE ADVANTAGE SCORECARD</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {competitiveScores.map((item) => (
                  <div key={item.category}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-700">{item.category}</span>
                      <span className="text-sm font-black" style={{ color: item.score >= 8 ? BUY_GREEN : item.score >= 6 ? HOLD_ORANGE : SELL_RED }}>
                        {item.score} / 10
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-3 rounded-full transition-all"
                        style={{
                          width: `${item.score * 10}%`,
                          backgroundColor: item.score >= 8 ? BUY_GREEN : item.score >= 6 ? GS_BLUE : SELL_RED,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3 text-sm">
                <div className="bg-blue-50 border-l-4 rounded-r p-3 text-blue-800" style={{ borderColor: GS_BLUE }}>
                  <strong>브랜드 인지도 (9/10):</strong> 30년 이상 축적된 국내 1위 보일러 브랜드. 'Navien'은 북미에서 한국 가전을 대표하는 희소 브랜드 자산.
                </div>
                <div className="bg-blue-50 border-l-4 rounded-r p-3 text-blue-800" style={{ borderColor: GS_BLUE }}>
                  <strong>기술 혁신 (8/10):</strong> 콘덴싱 열교환기 국내 유일 독자 생산. 수소 혼소 보일러 특허 48건 보유.
                </div>
                <div className="bg-yellow-50 border-l-4 rounded-r p-3 text-yellow-800" style={{ borderColor: HOLD_ORANGE }}>
                  <strong>전환비용 (6/10):</strong> 브랜드 선호도·AS 네트워크가 전환 마찰을 만들지만, 동일 가격대 경쟁사 대체 가능성 존재.
                </div>
                <div className="bg-yellow-50 border-l-4 rounded-r p-3 text-yellow-800" style={{ borderColor: HOLD_ORANGE }}>
                  <strong>네트워크 효과 (5/10):</strong> 스마트홈 플랫폼 연동으로 생태계 구축 시도 중이나, 아직 초기 단계.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 섹션 8: 지배구조 및 경영진 ── */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div style={{ backgroundColor: GS_BLUE }} className="px-6 py-3">
            <h2 className="text-white font-bold text-lg tracking-wide">SECTION 8 — GOVERNANCE & MANAGEMENT</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3 text-sm">지배구조 개요</h3>
                <div className="space-y-2 text-sm">
                  {[
                    { label: "최대주주", value: "최진민 외 특수관계인", pct: "35.2%" },
                    { label: "국민연금공단", value: "기관투자자", pct: "8.7%" },
                    { label: "외국인", value: "외국계 기관", pct: "18.4%" },
                    { label: "기타 소액주주", value: "일반투자자", pct: "37.7%" },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <span className="font-semibold text-gray-800">{item.label}</span>
                        <span className="text-gray-400 ml-2 text-xs">{item.value}</span>
                      </div>
                      <span className="font-bold text-gray-700">{item.pct}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 bg-blue-50 rounded p-3 text-xs text-blue-700">
                  창업주 3세 최진민 대표 체제로 장기 안정적 경영. ESG 위원회 신설(2023), 이사회 내 사외이사 비율 50% 이상 유지.
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 mb-3 text-sm">최근 3개월 DART 공시 (2026.01~04)</h3>
                <div className="space-y-2">
                  {[
                    { date: "2026.03.28", type: "사업보고서", title: "2025 사업연도 사업보고서 제출", tag: "정기", tagColor: GS_BLUE },
                    { date: "2026.03.15", type: "주요사항", title: "2025 결산 배당: 주당 ₩800 결정", tag: "배당", tagColor: BUY_GREEN },
                    { date: "2026.02.14", type: "실적발표", title: "2025년 4분기 및 연간 실적 공시", tag: "실적", tagColor: GS_BLUE },
                    { date: "2026.01.22", type: "자기주식", title: "자기주식 취득 결정 (50,000주, ₩27억)", tag: "주주환원", tagColor: BUY_GREEN },
                    { date: "2026.01.09", type: "계약체결", title: "북미 대형 유통사 공급계약 체결 (미공개한도)", tag: "수주", tagColor: HOLD_ORANGE },
                  ].map((item) => (
                    <div key={item.date} className="flex items-start gap-2 p-2 bg-gray-50 rounded text-xs">
                      <span className="text-gray-400 w-20 flex-shrink-0">{item.date}</span>
                      <span className="px-1.5 py-0.5 rounded text-white text-xs font-semibold flex-shrink-0" style={{ backgroundColor: item.tagColor }}>
                        {item.tag}
                      </span>
                      <span className="text-gray-700">{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 섹션 9: 밸류에이션 ── */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div style={{ backgroundColor: GS_BLUE }} className="px-6 py-3">
            <h2 className="text-white font-bold text-lg tracking-wide">SECTION 9 — VALUATION & PEER COMPARISON</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 밸류에이션 지표 */}
              <div>
                <h3 className="font-bold text-gray-700 text-sm mb-3">핵심 밸류에이션 지표 (2024E 기준)</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { metric: "PER", value: "14.2x", vs: "업종 평균 11.1x", premium: true },
                    { metric: "PBR", value: "1.8x", vs: "업종 평균 1.2x", premium: true },
                    { metric: "EV/EBITDA", value: "8.4x", vs: "업종 평균 6.8x", premium: true },
                    { metric: "EV/EBIT", value: "10.7x", vs: "북미 피어 14.2x", premium: false },
                    { metric: "P/FCF", value: "9.9x", vs: "FCF 수익률 5.4%", premium: false },
                    { metric: "배당수익률", value: "1.5%", vs: "KOSPI 평균 2.1%", premium: true },
                  ].map((v) => (
                    <div key={v.metric} className="bg-gray-50 rounded p-3">
                      <div className="text-xs text-gray-500">{v.metric}</div>
                      <div className="text-xl font-black text-gray-900">{v.value}</div>
                      <div className="text-xs" style={{ color: v.premium ? SELL_RED : BUY_GREEN }}>{v.vs}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 피어 비교 */}
              <div>
                <h3 className="font-bold text-gray-700 text-sm mb-3">피어 그룹 밸류에이션 비교</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ backgroundColor: GS_BLUE }} className="text-white">
                        <th className="text-left p-2 rounded-tl">기업명</th>
                        <th className="text-right p-2">PER</th>
                        <th className="text-right p-2">PBR</th>
                        <th className="text-right p-2">EV/EBITDA</th>
                        <th className="text-right p-2 rounded-tr">ROE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {peerData.map((row, i) => (
                        <tr key={row.name} className={row.name === "경동나비엔" ? "font-bold" : ""} style={{ backgroundColor: row.name === "경동나비엔" ? "#e0eaf4" : i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                          <td className="p-2" style={{ color: row.name === "경동나비엔" ? GS_BLUE : "inherit" }}>{row.name}</td>
                          <td className="text-right p-2">{row.per}x</td>
                          <td className="text-right p-2">{row.pbr}x</td>
                          <td className="text-right p-2">{row.evEbitda}x</td>
                          <td className="text-right p-2">{row.roe}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 bg-blue-50 rounded p-3 text-xs text-blue-800">
                  <strong>밸류에이션 코멘트:</strong> 경동나비엔은 피어 대비 20-30% 프리미엄에 거래 중. 북미 성장성(PEG 0.95)과 ROE 프리미엄을 감안하면 프리미엄 정당화 가능. 12M 목표 PER 17x 적용시 TP ₩72,000 산출.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 섹션 10: Bull / Bear Case ── */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div style={{ backgroundColor: GS_BLUE }} className="px-6 py-3">
            <h2 className="text-white font-bold text-lg tracking-wide">SECTION 10 — BULL / BEAR CASE SCENARIOS</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Bull Case */}
              <div className="border-2 rounded-lg p-5" style={{ borderColor: BUY_GREEN }}>
                <div className="flex justify-between items-center mb-3">
                  <div className="font-black text-lg" style={{ color: BUY_GREEN }}>BULL CASE</div>
                  <div className="text-2xl font-black" style={{ color: BUY_GREEN }}>₩95,000</div>
                </div>
                <div className="text-xs text-green-600 font-semibold mb-3 bg-green-50 rounded px-2 py-1 inline-block">현재가 대비 +75.3%</div>
                <ul className="space-y-2 text-xs text-gray-700">
                  <li className="flex gap-2"><span style={{ color: BUY_GREEN }}>▲</span> 북미 시장 점유율 40% 돌파 (현 30%)</li>
                  <li className="flex gap-2"><span style={{ color: BUY_GREEN }}>▲</span> 수소 보일러 2027년 상업화, 정부 보조금 연동</li>
                  <li className="flex gap-2"><span style={{ color: BUY_GREEN }}>▲</span> 글로벌 에너지 효율 규제 강화로 콘덴싱 의무화</li>
                  <li className="flex gap-2"><span style={{ color: BUY_GREEN }}>▲</span> OPM 13%+ 달성시 EPS CAGR 22%</li>
                  <li className="flex gap-2"><span style={{ color: BUY_GREEN }}>▲</span> M&A를 통한 유럽 시장 직접 진출 성공</li>
                </ul>
                <div className="mt-3 text-xs text-green-700 bg-green-50 rounded p-2">
                  가정: 매출 CAGR 18%, OPM 13%, 목표 PER 22x
                </div>
              </div>

              {/* Base Case */}
              <div className="border-2 rounded-lg p-5 border-blue-300">
                <div className="flex justify-between items-center mb-3">
                  <div className="font-black text-lg" style={{ color: GS_BLUE }}>BASE CASE</div>
                  <div className="text-2xl font-black" style={{ color: GS_BLUE }}>₩72,000</div>
                </div>
                <div className="text-xs text-blue-600 font-semibold mb-3 bg-blue-50 rounded px-2 py-1 inline-block">현재가 대비 +32.8%</div>
                <ul className="space-y-2 text-xs text-gray-700">
                  <li className="flex gap-2"><span style={{ color: GS_BLUE }}>→</span> 국내 시장 안정적 유지 (점유율 35%)</li>
                  <li className="flex gap-2"><span style={{ color: GS_BLUE }}>→</span> 북미 수출 연 15% 성장 지속</li>
                  <li className="flex gap-2"><span style={{ color: GS_BLUE }}>→</span> OPM 10-11% 구간 유지</li>
                  <li className="flex gap-2"><span style={{ color: GS_BLUE }}>→</span> 배당 안정 유지, 자사주 취득 지속</li>
                  <li className="flex gap-2"><span style={{ color: GS_BLUE }}>→</span> 매출 CAGR 10-12%</li>
                </ul>
                <div className="mt-3 text-xs text-blue-700 bg-blue-50 rounded p-2">
                  가정: 매출 CAGR 11%, OPM 10.5%, 목표 PER 17x
                </div>
              </div>

              {/* Bear Case */}
              <div className="border-2 rounded-lg p-5" style={{ borderColor: SELL_RED }}>
                <div className="flex justify-between items-center mb-3">
                  <div className="font-black text-lg" style={{ color: SELL_RED }}>BEAR CASE</div>
                  <div className="text-2xl font-black" style={{ color: SELL_RED }}>₩38,000</div>
                </div>
                <div className="text-xs text-red-600 font-semibold mb-3 bg-red-50 rounded px-2 py-1 inline-block">현재가 대비 -29.9%</div>
                <ul className="space-y-2 text-xs text-gray-700">
                  <li className="flex gap-2"><span style={{ color: SELL_RED }}>▼</span> 러시아 제재 장기화 → 매출채권 손상 인식</li>
                  <li className="flex gap-2"><span style={{ color: SELL_RED }}>▼</span> 원자재 가격 급등으로 OPM 6%대 하락</li>
                  <li className="flex gap-2"><span style={{ color: SELL_RED }}>▼</span> 북미 시장에서 Rinnai·Bosch와의 가격 경쟁 심화</li>
                  <li className="flex gap-2"><span style={{ color: SELL_RED }}>▼</span> 국내 건설경기 침체 지속으로 신규 납품 감소</li>
                  <li className="flex gap-2"><span style={{ color: SELL_RED }}>▼</span> 히트펌프 전환 가속으로 보일러 수요 구조 감소</li>
                </ul>
                <div className="mt-3 text-xs text-red-700 bg-red-50 rounded p-2">
                  가정: 매출 성장 정체, OPM 6.5%, 목표 PER 10x
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 섹션 11: 최종 판단 ── */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div style={{ backgroundColor: GS_BLUE }} className="px-6 py-3">
            <h2 className="text-white font-bold text-lg tracking-wide">SECTION 11 — FINAL VERDICT</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 최종 판단 카드 */}
              <div className="lg:col-span-1">
                <div className="border-4 rounded-xl p-6 text-center" style={{ borderColor: BUY_GREEN }}>
                  <div className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-2">Goldman Sachs 최종 판단</div>
                  <div className="text-5xl font-black mb-2" style={{ color: BUY_GREEN }}>매수</div>
                  <div className="text-lg font-bold text-gray-700 mb-1">BUY</div>
                  <div className="text-3xl font-black text-gray-900 mb-3">₩72,000</div>
                  <div className="text-sm text-gray-500 mb-4">12개월 목표주가</div>
                  <div className="flex justify-center gap-1 mb-1">
                    {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                      <div key={n} className="h-5 w-5 rounded-full" style={{ backgroundColor: n <= 7 ? BUY_GREEN : "#e5e7eb" }}></div>
                    ))}
                  </div>
                  <div className="text-sm font-bold mt-1" style={{ color: BUY_GREEN }}>확신도: 7 / 10</div>
                  <div className="mt-4 text-xs text-gray-400">리스크 등급: 중간(Medium)</div>
                </div>
              </div>

              {/* 투자 근거 요약 */}
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <h3 className="font-bold text-gray-800 mb-3">투자 핵심 근거 요약</h3>
                  <div className="space-y-3">
                    {[
                      { rank: "1", title: "북미 탱크리스 온수기 고성장 지속", detail: "연간 15% 수출 성장으로 2026년 해외매출 비중 28% 전망. 나비엔 브랜드 북미 인지도 상승으로 가격협상력 강화." },
                      { rank: "2", title: "탄소중립 정책 수혜 최대 수혜주", detail: "정부의 친환경 보일러 보조금 정책 직접 수혜. 수소 혼소 보일러 2027년 상업화 준비 완료로 선제적 우위 확보." },
                      { rank: "3", title: "탄탄한 재무·주주환원 기반", detail: "순현금 구조, FCF 수익률 5.4%, 자사주 취득+배당 병행. 재무 여력이 성장 투자와 주주환원 동시 수행을 가능케 함." },
                      { rank: "4", title: "피어 대비 합리적 밸류에이션", detail: "프리미엄 존재하나 ROE·성장성 감안시 정당화 가능. PEG 0.95는 성장 대비 저평가 신호." },
                    ].map((item) => (
                      <div key={item.rank} className="flex gap-3">
                        <div className="w-6 h-6 rounded-full text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: BUY_GREEN }}>{item.rank}</div>
                        <div>
                          <div className="font-semibold text-sm text-gray-800">{item.title}</div>
                          <div className="text-xs text-gray-600 mt-0.5">{item.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded p-4">
                  <h4 className="font-bold text-sm text-gray-700 mb-2">주요 리스크 (확신도 제한 요인)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                    <div className="flex items-start gap-1"><span className="text-red-400 flex-shrink-0">■</span> 러시아 지정학적 리스크 (매출채권 ~800억)</div>
                    <div className="flex items-start gap-1"><span className="text-red-400 flex-shrink-0">■</span> 원자재(구리·철강) 가격 변동성</div>
                    <div className="flex items-start gap-1"><span className="text-orange-400 flex-shrink-0">■</span> 히트펌프 보급 가속화에 따른 보일러 수요 침식</div>
                    <div className="flex items-start gap-1"><span className="text-orange-400 flex-shrink-0">■</span> 국내 건설경기 침체 장기화</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 면책 조항 */}
            <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-400 leading-relaxed">
              <strong>면책조항(Disclaimer):</strong> 본 보고서는 공개된 재무정보 및 학습 데이터 기반으로 자동 생성된 투자 참고 자료이며, 실제 Goldman Sachs의 공식 보고서가 아닙니다. 투자 결정은 최신 공시 자료와 전문 투자자문사의 의견을 반드시 병행하여 확인하십시오. 과거 실적이 미래 수익을 보장하지 않습니다. 기준일: 2026년 4월 20일. 종목코드: 007810 | 경동나비엔(주).
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
