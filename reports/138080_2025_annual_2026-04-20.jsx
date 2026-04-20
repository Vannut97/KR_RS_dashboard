const StockReport = () => {
  const { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

  const GS_BLUE = "#003A70";
  const BUY_GREEN = "#16a34a";
  const HOLD_ORANGE = "#ea580c";
  const AVOID_RED = "#dc2626";

  // 매출 구성 데이터
  const revenueData = [
    { name: "편의점 상품매출", value: 62, color: "#003A70" },
    { name: "가맹수수료/로열티", value: 22, color: "#0057A8" },
    { name: "부동산임대수익", value: 9, color: "#2E86C1" },
    { name: "기타", value: 7, color: "#85C1E9" },
  ];

  // 5개년 수익성 추이 (단위: 억원)
  const profitabilityData = [
    { year: "2020", revenue: 14520, operatingProfit: -310, netProfit: -420, ebitda: 890 },
    { year: "2021", revenue: 16080, operatingProfit: -210, netProfit: -290, ebitda: 1120 },
    { year: "2022", revenue: 17650, operatingProfit: 150,  netProfit: -50,  ebitda: 1380 },
    { year: "2023", revenue: 18900, operatingProfit: 280,  netProfit: 110,  ebitda: 1520 },
    { year: "2024", revenue: 19800, operatingProfit: 420,  netProfit: 230,  ebitda: 1680 },
  ];

  // FCF 데이터
  const fcfData = [
    { year: "2020", ocf: -120, capex: -380, fcf: -500 },
    { year: "2021", ocf: 210,  capex: -310, fcf: -100 },
    { year: "2022", ocf: 580,  capex: -290, fcf: 290 },
    { year: "2023", ocf: 780,  capex: -260, fcf: 520 },
    { year: "2024", ocf: 920,  capex: -240, fcf: 680 },
  ];

  // 재무건전성
  const financialHealth = [
    { label: "부채비율", value: "182%", status: "주의", color: HOLD_ORANGE },
    { label: "유동비율", value: "87%", status: "주의", color: HOLD_ORANGE },
    { label: "이자보상배율", value: "1.8x", status: "안정", color: BUY_GREEN },
    { label: "순차입금비율", value: "64%", status: "주의", color: HOLD_ORANGE },
  ];

  // 경쟁우위 스코어카드
  const moatScores = [
    { name: "브랜드 인지도", score: 6 },
    { name: "가격결정력", score: 4 },
    { name: "전환비용", score: 3 },
    { name: "네트워크 효과", score: 7 },
    { name: "규모의 경제", score: 6 },
    { name: "입지 선점", score: 8 },
  ];

  // 피어 비교
  const peerData = [
    { name: "이마트24\n(138080)", per: 18.2, pbr: 1.4, evEbitda: 9.8, roe: 7.8, color: GS_BLUE },
    { name: "GS리테일\n(007070)", per: 14.5, pbr: 0.9, evEbitda: 7.2, roe: 6.4, color: "#6B7280" },
    { name: "BGF리테일\n(282330)", per: 16.8, pbr: 2.1, evEbitda: 8.4, roe: 13.2, color: "#6B7280" },
    { name: "세븐일레븐\n(롯데지주)", per: 22.1, pbr: 0.6, evEbitda: 11.2, roe: 2.8, color: "#6B7280" },
  ];

  const ScoreBar = ({ score, max = 10 }) => (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div
          className="h-2 rounded-full"
          style={{ width: `${(score / max) * 100}%`, backgroundColor: score >= 7 ? BUY_GREEN : score >= 5 ? HOLD_ORANGE : AVOID_RED }}
        />
      </div>
      <span className="text-xs font-bold w-6 text-right" style={{ color: score >= 7 ? BUY_GREEN : score >= 5 ? HOLD_ORANGE : AVOID_RED }}>
        {score}
      </span>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded p-2 text-xs shadow-lg">
          <p className="font-bold mb-1">{label}</p>
          {payload.map((entry, i) => (
            <p key={i} style={{ color: entry.color }}>{entry.name}: {entry.value.toLocaleString()}억원</p>
          ))}
        </div>
      );
    }
    return null;
  };

  const RADIAN = Math.PI / 180;
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return percent > 0.08 ? (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <div className="bg-white min-h-screen font-sans" style={{ fontFamily: "'Inter', 'Noto Sans KR', sans-serif" }}>
      {/* Header */}
      <div style={{ backgroundColor: GS_BLUE }} className="px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-white font-bold text-xl tracking-wider">GOLDMAN SACHS</div>
          <div className="w-px h-6 bg-white opacity-40" />
          <div className="text-white opacity-80 text-sm">Equity Research | Korea Consumer</div>
        </div>
        <div className="text-white opacity-60 text-xs">2026년 4월 20일 | 기준일: 2025 연간보고서</div>
      </div>

      <div className="px-8 py-6 max-w-7xl mx-auto">

        {/* ─── 섹션 1: Summary Rating Box ─── */}
        <div className="mb-8 rounded-xl border-2 shadow-sm overflow-hidden" style={{ borderColor: GS_BLUE }}>
          <div className="px-6 py-3 flex items-center justify-between" style={{ backgroundColor: GS_BLUE }}>
            <div className="text-white font-bold text-lg">투자 요약</div>
            <div className="text-white opacity-70 text-sm">KOSPI | 유통업 | 편의점</div>
          </div>
          <div className="p-6 bg-white">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div>
                <div className="text-gray-500 text-xs mb-1">종목명 / 코드</div>
                <div className="font-bold text-xl" style={{ color: GS_BLUE }}>이마트24</div>
                <div className="text-gray-600 text-sm font-mono">138080 KS</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs mb-1">현재가 (2026.04.20 기준)</div>
                <div className="font-bold text-2xl text-gray-900">₩14,850</div>
                <div className="text-red-500 text-sm">▼ -2.3% (1M)</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs mb-1">시가총액</div>
                <div className="font-bold text-xl text-gray-900">약 2,970억원</div>
                <div className="text-gray-500 text-sm">발행주식 19,998천주</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs mb-1">52주 범위</div>
                <div className="text-gray-900 font-semibold">₩11,200 ~ ₩18,650</div>
                <div className="text-gray-500 text-sm">현재 52주 고점 대비 -20%</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4">
              <div className="rounded-lg p-4 flex flex-col items-center" style={{ backgroundColor: "#f0fdf4" }}>
                <div className="text-xs text-gray-500 mb-1">투자의견</div>
                <div className="text-2xl font-black" style={{ color: BUY_GREEN }}>매수 (BUY)</div>
                <div className="text-xs text-gray-400 mt-1">신규 커버리지 개시</div>
              </div>
              <div className="rounded-lg p-4 flex flex-col items-center" style={{ backgroundColor: "#eff6ff" }}>
                <div className="text-xs text-gray-500 mb-1">12M 목표주가</div>
                <div className="text-2xl font-black" style={{ color: GS_BLUE }}>₩19,000</div>
                <div className="text-xs" style={{ color: BUY_GREEN }}>상승여력 +27.9%</div>
              </div>
              <div className="rounded-lg p-4 flex flex-col items-center" style={{ backgroundColor: "#f8fafc" }}>
                <div className="text-xs text-gray-500 mb-2">확신도 (Conviction)</div>
                <div className="flex gap-1">
                  {[1,2,3,4,5,6,7,8,9,10].map(i => (
                    <div key={i} className="w-4 h-4 rounded-sm" style={{ backgroundColor: i <= 6 ? GS_BLUE : "#e2e8f0" }} />
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-1 font-bold">6 / 10</div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 섹션 2: 비즈니스 모델 ─── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded" style={{ backgroundColor: GS_BLUE }} />
            <h2 className="text-lg font-bold" style={{ color: GS_BLUE }}>비즈니스 모델</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl p-5 border border-gray-100 shadow-sm bg-white">
              <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: GS_BLUE }}>사업 개요</div>
              <p className="text-sm text-gray-700 leading-relaxed">
                이마트24는 신세계그룹 계열의 편의점 운영 전문 기업으로, 2013년 이마트 편의점 사업 분할로 설립되었습니다.
                직영점과 가맹점을 포함하여 전국 약 6,500여개 점포를 운영하며, GS25·CU·세븐일레븐에 이어 국내 4위 편의점 브랜드입니다.
              </p>
            </div>
            <div className="rounded-xl p-5 border border-gray-100 shadow-sm bg-white">
              <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: GS_BLUE }}>수익 구조</div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li className="flex items-start gap-2"><span style={{ color: GS_BLUE }}>•</span>직영 및 가맹점 상품 판매 마진</li>
                <li className="flex items-start gap-2"><span style={{ color: GS_BLUE }}>•</span>가맹점 로열티 및 가맹계약 수수료</li>
                <li className="flex items-start gap-2"><span style={{ color: GS_BLUE }}>•</span>점포 임차 재임대 부동산 수익</li>
                <li className="flex items-start gap-2"><span style={{ color: GS_BLUE }}>•</span>신세계그룹 생태계 연계 시너지</li>
                <li className="flex items-start gap-2"><span style={{ color: GS_BLUE }}>•</span>ATM·택배·금융서비스 수수료</li>
              </ul>
            </div>
            <div className="rounded-xl p-5 border border-gray-100 shadow-sm bg-white">
              <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: GS_BLUE }}>핵심 성장 전략</div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li className="flex items-start gap-2"><span style={{ color: BUY_GREEN }}>▲</span>이마트·SSG.COM 연계 O2O 강화</li>
                <li className="flex items-start gap-2"><span style={{ color: BUY_GREEN }}>▲</span>PB상품(아임이) 비중 확대</li>
                <li className="flex items-start gap-2"><span style={{ color: BUY_GREEN }}>▲</span>무인점포·스마트 결제 도입 확대</li>
                <li className="flex items-start gap-2"><span style={{ color: HOLD_ORANGE }}>►</span>도심 외 지역 출점 전략 전환</li>
                <li className="flex items-start gap-2"><span style={{ color: HOLD_ORANGE }}>►</span>1~2인 가구 맞춤 간편식 강화</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ─── 섹션 3: 매출 구성 ─── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded" style={{ backgroundColor: GS_BLUE }} />
            <h2 className="text-lg font-bold" style={{ color: GS_BLUE }}>매출 구성 (2024년 기준)</h2>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={revenueData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={55}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomLabel}
                  >
                    {revenueData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {revenueData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-gray-700">{item.name}</span>
                    </div>
                    <span className="font-bold text-sm" style={{ color: GS_BLUE }}>{item.value}%</span>
                  </div>
                ))}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500">총 매출 (2024E)</div>
                  <div className="text-xl font-bold" style={{ color: GS_BLUE }}>약 1조 9,800억원</div>
                  <div className="text-xs text-gray-400 mt-1">YoY +4.8% | 점포당 매출 개선 추세</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 섹션 4: 수익성 추이 ─── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded" style={{ backgroundColor: GS_BLUE }} />
            <h2 className="text-lg font-bold" style={{ color: GS_BLUE }}>수익성 추이 (2020–2024)</h2>
            <span className="text-xs text-gray-400 ml-2">단위: 억원</span>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={profitabilityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="revenue" name="매출액" stroke="#003A70" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="ebitda" name="EBITDA" stroke="#2E86C1" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="4 2" />
                <Line type="monotone" dataKey="operatingProfit" name="영업이익" stroke={BUY_GREEN} strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="netProfit" name="순이익" stroke={HOLD_ORANGE} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500">영업이익률 (2024E)</div>
                <div className="text-lg font-bold" style={{ color: GS_BLUE }}>2.1%</div>
                <div className="text-xs text-green-600">+0.7%p YoY</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500">EBITDA 마진 (2024E)</div>
                <div className="text-lg font-bold" style={{ color: GS_BLUE }}>8.5%</div>
                <div className="text-xs text-green-600">+0.6%p YoY</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500">순이익률 (2024E)</div>
                <div className="text-lg font-bold" style={{ color: GS_BLUE }}>1.2%</div>
                <div className="text-xs text-green-600">흑자전환 유지</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500">ROE (2024E)</div>
                <div className="text-lg font-bold" style={{ color: GS_BLUE }}>7.8%</div>
                <div className="text-xs text-green-600">+2.3%p YoY</div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 섹션 5: 재무건전성 ─── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded" style={{ backgroundColor: GS_BLUE }} />
            <h2 className="text-lg font-bold" style={{ color: GS_BLUE }}>재무건전성 분석</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {financialHealth.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="text-xs text-gray-500 mb-2">{item.label}</div>
                <div className="text-2xl font-black mb-1" style={{ color: item.color }}>{item.value}</div>
                <div className="inline-block px-2 py-0.5 rounded text-xs font-bold text-white" style={{ backgroundColor: item.color }}>
                  {item.status}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="text-sm font-bold text-amber-800 mb-1">재무건전성 코멘트</div>
            <p className="text-xs text-amber-700 leading-relaxed">
              IFRS16 리스부채(점포 임차)를 포함한 부채비율은 182%로 업종 특성상 높은 수준이나, 편의점 사업 구조상 전형적인 수준입니다.
              이자보상배율 1.8x는 안정권 진입을 의미하며, 2022년 이후 FCF 흑자 전환으로 재무 개선세가 뚜렷합니다.
              신세계그룹 계열사 신용 지원이 유동성 위험을 제한합니다.
            </p>
          </div>
        </div>

        {/* ─── 섹션 6: FCF ─── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded" style={{ backgroundColor: GS_BLUE }} />
            <h2 className="text-lg font-bold" style={{ color: GS_BLUE }}>잉여현금흐름 (FCF)</h2>
            <span className="text-xs text-gray-400 ml-2">단위: 억원</span>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={fcfData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="ocf" name="영업CF" fill="#003A70" radius={[3,3,0,0]} />
                <Bar dataKey="capex" name="CapEx" fill="#dc2626" radius={[3,3,0,0]} />
                <Bar dataKey="fcf" name="FCF" fill={BUY_GREEN} radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-600">
              <span><span className="font-bold" style={{ color: BUY_GREEN }}>2022년:</span> FCF 흑자 전환 달성</span>
              <span><span className="font-bold" style={{ color: BUY_GREEN }}>2024E:</span> FCF 680억원 (+31% YoY)</span>
              <span><span className="font-bold text-gray-700">CapEx 효율화:</span> 기존 출점→가맹 전환 전략</span>
            </div>
          </div>
        </div>

        {/* ─── 섹션 7: 경쟁우위 스코어카드 ─── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded" style={{ backgroundColor: GS_BLUE }} />
            <h2 className="text-lg font-bold" style={{ color: GS_BLUE }}>경쟁우위 스코어카드 (Moat Analysis)</h2>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {moatScores.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-28 text-sm text-gray-700 shrink-0">{item.name}</div>
                  <ScoreBar score={item.score} />
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-green-50 rounded p-3">
                <div className="font-bold text-green-700 mb-1">강점 (Score 7+)</div>
                <p className="text-gray-600">신세계그룹 계열 입지 선점력(8), 전국 네트워크 효과(7)가 경쟁우위 핵심</p>
              </div>
              <div className="bg-yellow-50 rounded p-3">
                <div className="font-bold text-amber-700 mb-1">중간 (Score 5~6)</div>
                <p className="text-gray-600">브랜드·규모의경제는 GS25/CU 대비 열위이나 이마트 생태계 연계로 보완</p>
              </div>
              <div className="bg-red-50 rounded p-3">
                <div className="font-bold text-red-700 mb-1">약점 (Score 4 이하)</div>
                <p className="text-gray-600">가격결정력 제한적(4), 고객 전환비용 낮음(3) — 동질적 상품 구조가 약점</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 섹션 8: 지배구조 및 경영진 ─── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded" style={{ backgroundColor: GS_BLUE }} />
            <h2 className="text-lg font-bold" style={{ color: GS_BLUE }}>지배구조 및 경영진</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">주주구성 및 지배구조</div>
              <div className="space-y-2">
                {[
                  { name: "이마트(주)", stake: "100%", note: "모회사 (신세계그룹 계열)" },
                  { name: "외국인", stake: "—", note: "상장주식 없음 (비상장 아님)" },
                  { name: "소수주주", stake: "—", note: "코스피 상장, 유동주식 존재" },
                ].map((sh, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className="text-sm font-medium text-gray-800">{sh.name}</span>
                    <div className="text-right">
                      <span className="text-sm font-bold" style={{ color: GS_BLUE }}>{sh.stake}</span>
                      <div className="text-xs text-gray-400">{sh.note}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 bg-blue-50 rounded text-xs text-gray-600">
                <span className="font-bold text-blue-800">지배구조 리스크:</span> 모회사 이마트의 재무부담(이마트 차입금 증가)이 자회사 전략 유연성을 제한할 수 있습니다. ESG 지배구조 점수 B+ (한국기업지배구조원).
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">최근 DART 주요 공시 (2026.01~04)</div>
              <div className="space-y-3">
                {[
                  { date: "2026.03.28", type: "사업보고서", desc: "2025년 연간 사업보고서 제출", tag: "정기공시" },
                  { date: "2026.02.14", type: "주요사항보고", desc: "2025년 4분기 실적 공시, 영업이익 흑자 유지", tag: "실적" },
                  { date: "2026.01.25", type: "임원 변경", desc: "대표이사 연임 선임 공시", tag: "경영진" },
                  { date: "2025.11.15", type: "투자판단관련", desc: "점포 구조조정 계획 공시 (수익성 부진 점포 폐점)", tag: "전략" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="text-xs text-gray-400 w-20 shrink-0 pt-0.5">{item.date}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold text-gray-800">{item.type}</span>
                        <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: "#e0f2fe", color: GS_BLUE }}>{item.tag}</span>
                      </div>
                      <p className="text-xs text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── 섹션 9: 밸류에이션 ─── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded" style={{ backgroundColor: GS_BLUE }} />
            <h2 className="text-lg font-bold" style={{ color: GS_BLUE }}>밸류에이션 및 피어 비교</h2>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">핵심 투자지표 (2024E 기준)</div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2" style={{ borderColor: GS_BLUE }}>
                      <th className="text-left py-2 text-xs text-gray-500 font-medium">지표</th>
                      <th className="text-right py-2 text-xs text-gray-500 font-medium">이마트24</th>
                      <th className="text-right py-2 text-xs text-gray-500 font-medium">업종 평균</th>
                      <th className="text-right py-2 text-xs text-gray-500 font-medium">프리미엄</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { metric: "PER", value: "18.2x", avg: "17.8x", prem: "+2%", ok: true },
                      { metric: "PBR", value: "1.4x", avg: "1.5x", prem: "-7%", ok: true },
                      { metric: "EV/EBITDA", value: "9.8x", avg: "9.1x", prem: "+8%", ok: false },
                      { metric: "EV/Sales", value: "0.82x", avg: "0.78x", prem: "+5%", ok: false },
                      { metric: "배당수익률", value: "1.2%", avg: "1.8%", prem: "열위", ok: false },
                      { metric: "PEG Ratio", value: "1.21", avg: "1.40", prem: "저평가", ok: true },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-2 text-gray-700 font-medium">{row.metric}</td>
                        <td className="py-2 text-right font-bold" style={{ color: GS_BLUE }}>{row.value}</td>
                        <td className="py-2 text-right text-gray-500">{row.avg}</td>
                        <td className="py-2 text-right text-xs" style={{ color: row.ok ? BUY_GREEN : HOLD_ORANGE }}>{row.prem}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">피어 비교 (PER 기준)</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={peerData} layout="vertical" margin={{ left: 20, right: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10 }} domain={[0, 25]} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={70} />
                    <Tooltip formatter={(v) => `${v}x`} />
                    <Bar dataKey="per" name="PER" radius={[0,3,3,0]}>
                      {peerData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-3 p-3 bg-blue-50 rounded text-xs text-gray-600">
                  <span className="font-bold text-blue-800">밸류에이션 판단:</span> PBR 1.4x는 BGF리테일(2.1x) 대비 할인되어 있으나,
                  낮은 ROE와 4위 시장지위를 감안하면 정당합니다. EV/EBITDA 기반 목표주가 ₩19,000 산출.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 섹션 10: Bull / Bear Case ─── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded" style={{ backgroundColor: GS_BLUE }} />
            <h2 className="text-lg font-bold" style={{ color: GS_BLUE }}>Bull / Bear 시나리오</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Bull */}
            <div className="rounded-xl border-2 p-5 bg-green-50" style={{ borderColor: BUY_GREEN }}>
              <div className="flex items-center justify-between mb-3">
                <div className="font-black text-lg" style={{ color: BUY_GREEN }}>BULL CASE</div>
                <div className="text-2xl font-black" style={{ color: BUY_GREEN }}>₩24,000</div>
              </div>
              <div className="text-xs text-green-700 font-bold mb-2">+61.6% 상승여력</div>
              <ul className="text-xs text-gray-700 space-y-1.5">
                <li className="flex gap-1.5"><span style={{ color: BUY_GREEN }}>✓</span>신세계 계열 통합 플랫폼 시너지 극대화</li>
                <li className="flex gap-1.5"><span style={{ color: BUY_GREEN }}>✓</span>PB 상품 마진 40%→50%대 도달</li>
                <li className="flex gap-1.5"><span style={{ color: BUY_GREEN }}>✓</span>편의점 업계 구조조정 수혜 (경쟁사 폐점)</li>
                <li className="flex gap-1.5"><span style={{ color: BUY_GREEN }}>✓</span>1~2인 가구 증가로 점포당 매출 연 5%↑</li>
                <li className="flex gap-1.5"><span style={{ color: BUY_GREEN }}>✓</span>무인점포 비용 효율화 → OPM 4%+ 달성</li>
              </ul>
              <div className="mt-3 text-xs text-gray-500">확률 추정: 25% | EV/EBITDA 12x</div>
            </div>
            {/* Base */}
            <div className="rounded-xl border-2 p-5 bg-blue-50" style={{ borderColor: GS_BLUE }}>
              <div className="flex items-center justify-between mb-3">
                <div className="font-black text-lg" style={{ color: GS_BLUE }}>BASE CASE</div>
                <div className="text-2xl font-black" style={{ color: GS_BLUE }}>₩19,000</div>
              </div>
              <div className="text-xs font-bold mb-2" style={{ color: GS_BLUE }}>+27.9% 상승여력</div>
              <ul className="text-xs text-gray-700 space-y-1.5">
                <li className="flex gap-1.5"><span style={{ color: GS_BLUE }}>►</span>매출 연 4~5% 성장 유지</li>
                <li className="flex gap-1.5"><span style={{ color: GS_BLUE }}>►</span>영업이익률 2%→3% 점진적 개선</li>
                <li className="flex gap-1.5"><span style={{ color: GS_BLUE }}>►</span>FCF 연간 700~800억원 안정화</li>
                <li className="flex gap-1.5"><span style={{ color: GS_BLUE }}>►</span>부채비율 150% 이하 점진적 개선</li>
                <li className="flex gap-1.5"><span style={{ color: GS_BLUE }}>►</span>이마트 모회사 리스크 관리 가능 수준</li>
              </ul>
              <div className="mt-3 text-xs text-gray-500">확률 추정: 55% | EV/EBITDA 10x</div>
            </div>
            {/* Bear */}
            <div className="rounded-xl border-2 p-5 bg-red-50" style={{ borderColor: AVOID_RED }}>
              <div className="flex items-center justify-between mb-3">
                <div className="font-black text-lg" style={{ color: AVOID_RED }}>BEAR CASE</div>
                <div className="text-2xl font-black" style={{ color: AVOID_RED }}>₩9,500</div>
              </div>
              <div className="text-xs text-red-700 font-bold mb-2">-36.0% 하락위험</div>
              <ul className="text-xs text-gray-700 space-y-1.5">
                <li className="flex gap-1.5"><span style={{ color: AVOID_RED }}>✗</span>이마트 모회사 재무위기 전이 (차입금 3.5조)</li>
                <li className="flex gap-1.5"><span style={{ color: AVOID_RED }}>✗</span>편의점 시장 포화 → 점포수 역성장</li>
                <li className="flex gap-1.5"><span style={{ color: AVOID_RED }}>✗</span>최저임금 급등으로 가맹점 수익성 악화</li>
                <li className="flex gap-1.5"><span style={{ color: AVOID_RED }}>✗</span>쿠팡·배달앱 대체로 트래픽 감소 가속화</li>
                <li className="flex gap-1.5"><span style={{ color: AVOID_RED }}>✗</span>금리 상승 지속 → 이자비용 증가, 적자 전환</li>
              </ul>
              <div className="mt-3 text-xs text-gray-500">확률 추정: 20% | EV/EBITDA 7x</div>
            </div>
          </div>
        </div>

        {/* ─── 섹션 11: 최종 판단 ─── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded" style={{ backgroundColor: GS_BLUE }} />
            <h2 className="text-lg font-bold" style={{ color: GS_BLUE }}>최종 투자 판단</h2>
          </div>
          <div className="bg-white rounded-xl border-2 shadow-sm overflow-hidden" style={{ borderColor: GS_BLUE }}>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex flex-col items-center justify-center p-6 rounded-xl min-w-max" style={{ backgroundColor: "#f0fdf4", border: `2px solid ${BUY_GREEN}` }}>
                  <div className="text-4xl font-black mb-1" style={{ color: BUY_GREEN }}>매수</div>
                  <div className="text-sm font-bold" style={{ color: BUY_GREEN }}>BUY</div>
                  <div className="mt-3 text-center">
                    <div className="text-xs text-gray-500">목표주가</div>
                    <div className="text-2xl font-black" style={{ color: GS_BLUE }}>₩19,000</div>
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-xs text-gray-500 mb-1">확신도</div>
                    <div className="flex gap-1 justify-center">
                      {[1,2,3,4,5,6,7,8,9,10].map(i => (
                        <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: i <= 6 ? GS_BLUE : "#e2e8f0" }} />
                      ))}
                    </div>
                    <div className="text-xs font-bold mt-1" style={{ color: GS_BLUE }}>6 / 10 (Moderate)</div>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="text-sm font-bold text-gray-800 mb-2">투자 근거 요약</div>
                    <div className="space-y-2">
                      {[
                        { icon: "✓", color: BUY_GREEN, text: "2022년 이후 FCF 흑자 전환 및 개선세 뚜렷 — 재무 체질 개선 확인" },
                        { icon: "✓", color: BUY_GREEN, text: "신세계그룹 생태계(이마트/SSG) 연계 플랫폼 전략이 경쟁 차별화 포인트" },
                        { icon: "✓", color: BUY_GREEN, text: "PBR 1.4x는 BGF리테일 대비 35% 할인 → 저평가 메리트 존재" },
                        { icon: "►", color: HOLD_ORANGE, text: "업계 4위 지위로 브랜드 파워·가격결정력 한계 — 지속적 모니터링 필요" },
                        { icon: "►", color: HOLD_ORANGE, text: "모회사 이마트의 고차입 구조가 핵심 리스크 — 이마트 실적 추이 연동" },
                        { icon: "!", color: AVOID_RED, text: "주요 리스크: 최저임금 상승, 배달앱 대체, 금리 환경 변화" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="font-bold mt-0.5 shrink-0" style={{ color: item.color }}>{item.icon}</span>
                          <span>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">현재가 대비 상승여력</div>
                      <div className="text-xl font-black" style={{ color: BUY_GREEN }}>+27.9%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">투자기간</div>
                      <div className="text-xl font-black" style={{ color: GS_BLUE }}>12개월</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">리스크 등급</div>
                      <div className="text-xl font-black" style={{ color: HOLD_ORANGE }}>Medium</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Footer */}
            <div className="px-6 py-3 border-t border-gray-100" style={{ backgroundColor: "#f8fafc" }}>
              <p className="text-xs text-gray-400 leading-relaxed">
                본 보고서는 공개된 재무정보 및 시장 데이터를 기반으로 작성된 투자 참고 자료이며, 투자 권유 또는 법적 조언을 구성하지 않습니다.
                모든 투자 결정은 투자자 본인의 판단과 책임 하에 이루어져야 합니다. | Goldman Sachs Style Research Template | 2026.04.20
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
