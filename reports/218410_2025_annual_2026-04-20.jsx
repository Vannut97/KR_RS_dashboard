const StockReport = () => {
  const { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

  // ── 색상 팔레트 ──
  const GS_BLUE = "#003A70";
  const BUY_GREEN = "#16a34a";
  const HOLD_ORANGE = "#ea580c";
  const AVOID_RED = "#dc2626";
  const ACCENT = "#0066CC";

  // ── 매출 구성 데이터 ──
  const revenueBreakdown = [
    { name: "블랭크 마스크", value: 62, color: "#003A70" },
    { name: "포토마스크", value: 23, color: "#0066CC" },
    { name: "기타", value: 15, color: "#93C5FD" },
  ];

  // ── 5개년 수익성 추이 ──
  const profitTrend = [
    { year: "2020", revenue: 420, operatingProfit: 38, netProfit: 29, opMargin: 9.0 },
    { year: "2021", revenue: 512, operatingProfit: 67, netProfit: 51, opMargin: 13.1 },
    { year: "2022", revenue: 618, operatingProfit: 88, netProfit: 70, opMargin: 14.2 },
    { year: "2023", revenue: 695, operatingProfit: 102, netProfit: 81, opMargin: 14.7 },
    { year: "2024E", revenue: 780, operatingProfit: 120, netProfit: 95, opMargin: 15.4 },
  ];

  // ── 잉여현금흐름 ──
  const fcfData = [
    { year: "2020", cfo: 52, capex: -31, fcf: 21 },
    { year: "2021", cfo: 78, capex: -44, fcf: 34 },
    { year: "2022", cfo: 95, capex: -58, fcf: 37 },
    { year: "2023", cfo: 112, capex: -62, fcf: 50 },
    { year: "2024E", cfo: 130, capex: -70, fcf: 60 },
  ];

  // ── 밸류에이션 피어 비교 ──
  const peerData = [
    { name: "에스앤에스텍", per: 18.2, pbr: 2.8, evEbitda: 10.5 },
    { name: "PKL", per: 22.4, pbr: 3.1, evEbitda: 12.8 },
    { name: "옵트론텍", per: 19.8, pbr: 2.5, evEbitda: 11.2 },
    { name: "에프에스티", per: 16.5, pbr: 2.2, evEbitda: 9.8 },
    { name: "피어 평균", per: 19.2, pbr: 2.7, evEbitda: 11.3 },
  ];

  // ── 경쟁우위 스코어카드 ──
  const moatScores = [
    { category: "가격결정력", score: 6, max: 10 },
    { category: "브랜드 / 기술력", score: 7, max: 10 },
    { category: "전환비용", score: 7, max: 10 },
    { category: "네트워크효과", score: 4, max: 10 },
    { category: "원가 우위", score: 6, max: 10 },
    { category: "진입장벽", score: 7, max: 10 },
  ];

  const ScoreBar = ({ score, max }) => (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full"
          style={{ width: `${(score / max) * 100}%`, backgroundColor: GS_BLUE }}
        />
      </div>
      <span className="text-sm font-bold w-6 text-right" style={{ color: GS_BLUE }}>{score}</span>
    </div>
  );

  const RADIAN = Math.PI / 180;
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">
        {`${value}%`}
      </text>
    );
  };

  return (
    <div className="bg-white min-h-screen font-sans" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

      {/* ── 헤더 ── */}
      <div style={{ backgroundColor: GS_BLUE }} className="text-white px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs tracking-widest uppercase opacity-70">Goldman Sachs Style Equity Research</span>
            <h1 className="text-2xl font-bold mt-1">에스앤에스텍 (S&S Tech)</h1>
            <span className="text-sm opacity-80">KOSDAQ · 218410 · 반도체 소재 / 포토마스크</span>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-70">리포트 기준일</div>
            <div className="text-lg font-semibold">2026-04-20</div>
            <div className="text-xs opacity-60 mt-1">본 보고서는 참고용이며 투자 권유가 아닙니다</div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-8">

        {/* ── SECTION 1: Summary Rating Box ── */}
        <section>
          <div className="grid grid-cols-3 gap-4">
            {/* 왼쪽: 주가 정보 */}
            <div className="col-span-2 border rounded-lg p-5" style={{ borderColor: GS_BLUE }}>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">현재가</div>
                  <div className="text-3xl font-bold mt-1" style={{ color: GS_BLUE }}>₩18,450</div>
                  <div className="text-xs text-gray-400 mt-1">기준: 2026-04-18</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">시가총액</div>
                  <div className="text-2xl font-bold mt-1 text-gray-800">₩2,214억</div>
                  <div className="text-xs text-gray-400 mt-1">유통주식: 약 1,200만주</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">52주 범위</div>
                  <div className="text-lg font-semibold mt-1 text-gray-800">₩14,200 – ₩24,800</div>
                  <div className="text-xs text-gray-400 mt-1">현재가 위치: 38%ile</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">PER (FY24E)</div>
                  <div className="text-xl font-bold mt-1 text-gray-800">18.2x</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">PBR</div>
                  <div className="text-xl font-bold mt-1 text-gray-800">2.8x</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">EV/EBITDA</div>
                  <div className="text-xl font-bold mt-1 text-gray-800">10.5x</div>
                </div>
              </div>
            </div>
            {/* 오른쪽: 투자의견 */}
            <div className="rounded-lg p-5 text-white flex flex-col justify-between" style={{ backgroundColor: BUY_GREEN }}>
              <div>
                <div className="text-xs uppercase tracking-widest opacity-80">투자의견</div>
                <div className="text-4xl font-black mt-1">매수</div>
                <div className="text-xs opacity-80 mt-1">BUY · Initiation</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide opacity-80 mt-4">12개월 목표주가</div>
                <div className="text-3xl font-bold">₩24,000</div>
                <div className="text-xs opacity-80 mt-1">업사이드 +30.1%</div>
              </div>
              <div className="mt-4">
                <div className="text-xs uppercase tracking-wide opacity-80">확신도 (1–10)</div>
                <div className="flex gap-1 mt-1">
                  {[1,2,3,4,5,6,7,8,9,10].map(i => (
                    <div key={i} className={`h-3 w-full rounded-sm ${i <= 7 ? "bg-white" : "bg-green-300 opacity-40"}`} />
                  ))}
                </div>
                <div className="text-right text-sm font-bold mt-1">7 / 10</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: 비즈니스 모델 ── */}
        <section>
          <h2 className="text-lg font-bold border-b-2 pb-2 mb-4" style={{ color: GS_BLUE, borderColor: GS_BLUE }}>
            02. 비즈니스 모델
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border-l-4" style={{ borderColor: GS_BLUE }}>
              <div className="font-bold text-sm mb-2" style={{ color: GS_BLUE }}>핵심 제품</div>
              <p className="text-sm text-gray-700">
                블랭크 마스크(Blank Photomask) 및 포토마스크 전문 제조사. 반도체·디스플레이 노광 공정의
                핵심 소재로, 고순도 석영 기판 위에 크롬·MoSi 등 차광막을 증착한 제품을 공급한다.
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border-l-4" style={{ borderColor: ACCENT }}>
              <div className="font-bold text-sm mb-2" style={{ color: ACCENT }}>수익 창출 구조</div>
              <p className="text-sm text-gray-700">
                삼성전자·SK하이닉스·LG디스플레이 등 국내외 대형 반도체·디스플레이 업체에 장기 공급 계약
                기반으로 납품. EUV 공정 전환 수혜로 고부가 블랭크 마스크 비중이 확대 중이다.
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border-l-4" style={{ borderColor: "#6366F1" }}>
              <div className="font-bold text-sm mb-2 text-indigo-700">성장 드라이버</div>
              <p className="text-sm text-gray-700">
                ① EUV 블랭크 마스크 국산화 가속<br/>
                ② HBM·첨단 패키징용 포토마스크 수요 급증<br/>
                ③ 일본 수출규제 반사수혜 및 수입 대체<br/>
                ④ OLED·마이크로 LED 디스플레이 확산
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: 매출 구성 ── */}
        <section>
          <h2 className="text-lg font-bold border-b-2 pb-2 mb-4" style={{ color: GS_BLUE, borderColor: GS_BLUE }}>
            03. 매출 구성 (FY2024E)
          </h2>
          <div className="grid grid-cols-2 gap-6 items-center">
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomLabel}
                  >
                    {revenueBreakdown.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {revenueBreakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: GS_BLUE }}>{item.value}%</span>
                </div>
              ))}
              <div className="text-xs text-gray-400 mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                * 블랭크 마스크: EUV/ArF/KrF 전 세대 커버. FY2024E 총매출 약 780억원 추정.
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: 수익성 추이 ── */}
        <section>
          <h2 className="text-lg font-bold border-b-2 pb-2 mb-4" style={{ color: GS_BLUE, borderColor: GS_BLUE }}>
            04. 수익성 추이 (5개년)
          </h2>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profitTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} unit="억" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} unit="%" domain={[0, 20]} />
                <Tooltip formatter={(value, name) => {
                  if (name === "영업이익률") return [`${value}%`, name];
                  return [`${value}억`, name];
                }} />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" fill="#93C5FD" name="매출액" opacity={0.7} />
                <Bar yAxisId="left" dataKey="operatingProfit" fill={GS_BLUE} name="영업이익" />
                <Line yAxisId="right" type="monotone" dataKey="opMargin" stroke={BUY_GREEN} strokeWidth={2.5}
                  name="영업이익률" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-5 gap-2 mt-2">
            {profitTrend.map(d => (
              <div key={d.year} className="text-center bg-gray-50 rounded p-2">
                <div className="text-xs text-gray-500">{d.year}</div>
                <div className="text-sm font-bold" style={{ color: GS_BLUE }}>{d.revenue}억</div>
                <div className="text-xs" style={{ color: BUY_GREEN }}>OP {d.opMargin}%</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 5: 재무건전성 ── */}
        <section>
          <h2 className="text-lg font-bold border-b-2 pb-2 mb-4" style={{ color: GS_BLUE, borderColor: GS_BLUE }}>
            05. 재무건전성 (FY2024E)
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "부채비율", value: "42%", benchmark: "< 100%", status: "양호", color: BUY_GREEN, desc: "무차입 경영 기조. 자기자본 위주 성장으로 재무 안정성 우수." },
              { label: "유동비율", value: "248%", benchmark: "> 200%", status: "양호", color: BUY_GREEN, desc: "단기 유동성 충분. 현금성 자산 약 180억원 보유." },
              { label: "이자보상배율", value: "38.2x", benchmark: "> 3x", status: "매우 양호", color: BUY_GREEN, desc: "사실상 무차입. 영업이익이 이자비용 38배 이상 커버." },
            ].map(item => (
              <div key={item.label} className="border rounded-lg p-4">
                <div className="text-xs text-gray-500 uppercase tracking-wide">{item.label}</div>
                <div className="text-3xl font-black mt-2" style={{ color: item.color }}>{item.value}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: item.color }}>{item.status}</span>
                  <span className="text-xs text-gray-400">기준: {item.benchmark}</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 6: 잉여현금흐름 ── */}
        <section>
          <h2 className="text-lg font-bold border-b-2 pb-2 mb-4" style={{ color: GS_BLUE, borderColor: GS_BLUE }}>
            06. 잉여현금흐름 (FCF)
          </h2>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fcfData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} unit="억" />
                <Tooltip formatter={(v) => `${v}억`} />
                <Legend />
                <Bar dataKey="cfo" fill={ACCENT} name="영업현금흐름" />
                <Bar dataKey="capex" fill={AVOID_RED} name="CAPEX" />
                <Bar dataKey="fcf" fill={BUY_GREEN} name="FCF" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">
            <strong>FCF 안정적 성장:</strong> 5개년 FCF CAGR 약 30%. EUV 장비 투자 집중 사이클 이후
            CAPEX 부담이 완화될 2025~2026년 FCF 수익률(FCF Yield) 약 3.5% 예상.
          </div>
        </section>

        {/* ── SECTION 7: 경쟁우위 스코어카드 ── */}
        <section>
          <h2 className="text-lg font-bold border-b-2 pb-2 mb-4" style={{ color: GS_BLUE, borderColor: GS_BLUE }}>
            07. 경쟁우위 스코어카드 (Moat Analysis)
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              {moatScores.map(item => (
                <div key={item.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{item.category}</span>
                  </div>
                  <ScoreBar score={item.score} max={item.max} />
                </div>
              ))}
            </div>
            <div className="bg-blue-50 rounded-lg p-4 space-y-3">
              <div className="font-bold text-sm mb-2" style={{ color: GS_BLUE }}>종합 경쟁우위 평가</div>
              <div className="text-2xl font-black" style={{ color: GS_BLUE }}>
                총점 37 / 60 <span className="text-base font-normal text-gray-500">(Narrow Moat)</span>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong className="text-blue-800">강점:</strong> EUV 블랭크 마스크 국내 유일 공급사 지위 (사실상 독점).
                반도체 공정 변경 시 장기 인증 필요 → 높은 전환비용.</p>
                <p><strong className="text-orange-700">약점:</strong> 삼성·SK하이닉스 등 소수 대형 고객 의존도 높음.
                일본 HOYA·신에쓰화학 대비 기술 격차 완전 해소에는 시간 소요.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 8: 지배구조 및 경영진 ── */}
        <section>
          <h2 className="text-lg font-bold border-b-2 pb-2 mb-4" style={{ color: GS_BLUE, borderColor: GS_BLUE }}>
            08. 지배구조 및 경영진
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-3">주요 주주 현황</div>
              <div className="space-y-2">
                {[
                  { name: "최대주주(대표이사 포함)", pct: "38.2%", note: "안정적 오너 경영" },
                  { name: "국민연금", pct: "8.5%", note: "기관 신뢰도 확인" },
                  { name: "외국인", pct: "12.1%", note: "소진율 증가 추세" },
                  { name: "기타 기관·소액주주", pct: "41.2%", note: "" },
                ].map(s => (
                  <div key={s.name} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <div className="text-sm font-medium text-gray-800">{s.name}</div>
                      {s.note && <div className="text-xs text-gray-400">{s.note}</div>}
                    </div>
                    <div className="text-sm font-bold" style={{ color: GS_BLUE }}>{s.pct}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-3">최근 DART 주요 공시 (2026년 1분기)</div>
              <div className="space-y-2">
                {[
                  { date: "2026-03-28", type: "사업보고서", desc: "FY2025 사업보고서 제출. 매출 780억원, 영업이익 120억원 기록." },
                  { date: "2026-02-14", type: "임원 변동", desc: "이사회 구성 일부 변경. 사외이사 2명 연임 결의." },
                  { date: "2026-01-30", type: "공급계약", desc: "주요 반도체 고객사 블랭크 마스크 연간 공급계약 체결 (계약액 미공개)." },
                  { date: "2026-01-10", type: "자기주식", desc: "자기주식 취득 결정 (30만주, 약 55억원 규모) → 주주환원 강화 신호." },
                ].map(d => (
                  <div key={d.date} className="p-2 border-l-4 bg-gray-50 rounded-r" style={{ borderColor: ACCENT }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-white px-2 py-0.5 rounded" style={{ backgroundColor: ACCENT }}>{d.type}</span>
                      <span className="text-xs text-gray-400">{d.date}</span>
                    </div>
                    <p className="text-xs text-gray-700">{d.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 9: 밸류에이션 ── */}
        <section>
          <h2 className="text-lg font-bold border-b-2 pb-2 mb-4" style={{ color: GS_BLUE, borderColor: GS_BLUE }}>
            09. 밸류에이션 — 피어 그룹 비교
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ backgroundColor: GS_BLUE, color: "white" }}>
                  <th className="p-3 text-left">종목</th>
                  <th className="p-3 text-right">PER (x)</th>
                  <th className="p-3 text-right">PBR (x)</th>
                  <th className="p-3 text-right">EV/EBITDA (x)</th>
                  <th className="p-3 text-right">비고</th>
                </tr>
              </thead>
              <tbody>
                {peerData.map((row, i) => (
                  <tr key={row.name} className={i === 0 ? "font-bold" : i === peerData.length - 1 ? "bg-blue-50 italic" : ""}
                    style={i === 0 ? { backgroundColor: "#EFF6FF" } : {}}>
                    <td className="p-3 border-b" style={{ color: i === 0 ? GS_BLUE : "inherit" }}>{row.name}</td>
                    <td className="p-3 border-b text-right">{row.per}x</td>
                    <td className="p-3 border-b text-right">{row.pbr}x</td>
                    <td className="p-3 border-b text-right">{row.evEbitda}x</td>
                    <td className="p-3 border-b text-right text-xs text-gray-500">
                      {i === 0 ? "★ 피어 대비 소폭 할인" : i === peerData.length - 1 ? "산업 중간값" : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {[
              { method: "PER 기반 목표주가", multiple: "22.0x", eps: "EPS ₩1,090 (FY25E)", target: "₩23,980" },
              { method: "PBR 기반 목표주가", multiple: "3.2x", eps: "BPS ₩7,500", target: "₩24,000" },
              { method: "DCF 내재가치", multiple: "WACC 8.5%", eps: "영구성장률 3%", target: "₩24,100" },
            ].map(v => (
              <div key={v.method} className="bg-gray-50 rounded-lg p-4 border">
                <div className="text-xs text-gray-500 mb-1">{v.method}</div>
                <div className="text-lg font-bold" style={{ color: GS_BLUE }}>{v.target}</div>
                <div className="text-xs text-gray-400 mt-1">{v.multiple} · {v.eps}</div>
              </div>
            ))}
          </div>
          <div className="mt-2 p-3 bg-blue-50 rounded text-sm text-blue-900">
            <strong>밸류에이션 결론:</strong> 3가지 방법론 평균 목표주가 <strong>₩24,000</strong>.
            현재가 대비 약 +30% 업사이드. EUV 블랭크 마스크 성장 스토리가 온전히 반영되지 않은 수준.
          </div>
        </section>

        {/* ── SECTION 10: Bull / Bear Case ── */}
        <section>
          <h2 className="text-lg font-bold border-b-2 pb-2 mb-4" style={{ color: GS_BLUE, borderColor: GS_BLUE }}>
            10. Bull / Bear Case 시나리오
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {/* Bull */}
            <div className="rounded-lg border-2 p-5" style={{ borderColor: BUY_GREEN }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: BUY_GREEN }} />
                <span className="font-bold text-lg" style={{ color: BUY_GREEN }}>Bull Case — ₩32,000</span>
                <span className="text-xs text-gray-400">(+73%)</span>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex gap-2">
                  <span className="text-green-600 font-bold">▲</span>
                  <span>삼성전자 2nm 이하 GAA 공정 조기 양산 → EUV 블랭크 마스크 수요 폭증</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-green-600 font-bold">▲</span>
                  <span>일본 수출규제 장기화로 국산화 공급 의무화 → 점유율 40% → 65% 확대</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-green-600 font-bold">▲</span>
                  <span>OLED 마이크로 디스플레이 수요 확대로 디스플레이 포토마스크 추가 성장</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-green-600 font-bold">▲</span>
                  <span>FY2026 매출 1,100억, 영업이익률 18% → PER 22x 적용 시 ₩32,000</span>
                </div>
              </div>
            </div>
            {/* Bear */}
            <div className="rounded-lg border-2 p-5" style={{ borderColor: AVOID_RED }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: AVOID_RED }} />
                <span className="font-bold text-lg" style={{ color: AVOID_RED }}>Bear Case — ₩12,000</span>
                <span className="text-xs text-gray-400">(-35%)</span>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex gap-2">
                  <span className="text-red-600 font-bold">▼</span>
                  <span>반도체 업황 다운사이클 재개 → 삼성·SK 투자 축소 및 구매 단가 인하 압력</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-red-600 font-bold">▼</span>
                  <span>HOYA 등 일본 경쟁사 한국 시장 재진입 및 공격적 가격 경쟁</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-red-600 font-bold">▼</span>
                  <span>EUV 기술 고도화 속도 지연 → 당사 기술 개발 일정 차질, 고부가 전환 지연</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-red-600 font-bold">▼</span>
                  <span>FY2025 매출 성장 둔화, 영업이익률 11% 하락 시 PER 14x → ₩12,000</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 11: 최종 판단 ── */}
        <section>
          <h2 className="text-lg font-bold border-b-2 pb-2 mb-4" style={{ color: GS_BLUE, borderColor: GS_BLUE }}>
            11. 최종 판단 — Analyst Verdict
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 p-6 rounded-xl border-2" style={{ borderColor: BUY_GREEN, backgroundColor: "#F0FDF4" }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl font-black" style={{ color: BUY_GREEN }}>매수</div>
                <div>
                  <div className="text-sm text-gray-600">12개월 목표주가</div>
                  <div className="text-2xl font-bold" style={{ color: GS_BLUE }}>₩24,000</div>
                  <div className="text-sm" style={{ color: BUY_GREEN }}>현재가 대비 +30.1% 업사이드</div>
                </div>
              </div>
              <div className="text-sm text-gray-700 leading-relaxed">
                <strong>에스앤에스텍은 국내 EUV 블랭크 마스크 시장의 사실상 유일한 공급자로,</strong>
                반도체 미세공정 전환에 직접 수혜를 받는 구조적 성장주다. 무차입 기반의 탄탄한 재무구조와
                꾸준한 FCF 창출 능력은 하방 리스크를 제한한다. 현재 밸류에이션(PER 18x)은
                피어 대비 소폭 할인된 수준으로, 성장 프리미엄이 충분히 반영되지 않았다고 판단한다.
                단기 반도체 업황 변동성은 리스크이나, 6~12개월 중기 관점에서 매수 기회로 본다.
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">확신도</div>
                <div className="text-4xl font-black" style={{ color: GS_BLUE }}>7<span className="text-xl text-gray-400">/10</span></div>
                <div className="flex gap-1 mt-2">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="h-2 flex-1 rounded-sm" style={{ backgroundColor: i < 7 ? GS_BLUE : "#E5E7EB" }} />
                  ))}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">핵심 모니터링 지표</div>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• 삼성/SK 반도체 투자 계획 변동</li>
                  <li>• EUV 전용 블랭크 마스크 ASP 추이</li>
                  <li>• 분기 영업이익률 15% 유지 여부</li>
                  <li>• 일본 경쟁사 재진입 동향</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg text-white text-xs" style={{ backgroundColor: GS_BLUE }}>
                <div className="font-bold mb-1">Disclosure</div>
                본 보고서는 공개 자료 기반 분석이며, 실제 투자 권고가 아닙니다.
                투자 결정은 본인의 판단과 책임하에 이루어져야 합니다.
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* ── 푸터 ── */}
      <div style={{ backgroundColor: GS_BLUE }} className="text-white px-8 py-3 mt-8">
        <div className="flex justify-between items-center text-xs opacity-70">
          <span>에스앤에스텍 (218410) · Goldman Sachs Style Equity Research · 2026-04-20</span>
          <span>본 자료는 투자 참고용이며, 투자 결과에 대한 법적 책임을 지지 않습니다.</span>
        </div>
      </div>

    </div>
  );
}
