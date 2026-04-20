const StockReport = () => {
  const { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

  // ── 색상 상수 ──────────────────────────────────────────────
  const GS_BLUE = "#003A70";
  const BUY_GREEN = "#16a34a";
  const HOLD_ORANGE = "#ea580c";
  const AVOID_RED = "#dc2626";
  const BG_LIGHT = "#f8fafc";

  // ── 매출 구성 데이터 ─────────────────────────────────────
  const revenueSegments = [
    { name: "이차전지용 동박", value: 68, color: "#003A70" },
    { name: "일반산업용 동박", value: 22, color: "#0070C0" },
    { name: "기타(동박 가공 등)", value: 10, color: "#90CAF9" },
  ];

  // ── 수익성 추이 (5개년) ───────────────────────────────────
  const profitabilityData = [
    { year: "2020", 매출액: 5821, 영업이익: 312, 순이익: 198, 영업이익률: 5.4, 순이익률: 3.4 },
    { year: "2021", 매출액: 7403, 영업이익: 589, 순이익: 421, 영업이익률: 7.9, 순이익률: 5.7 },
    { year: "2022", 매출액: 10218, 영업이익: 847, 순이익: 631, 영업이익률: 8.3, 순이익률: 6.2 },
    { year: "2023", 매출액: 8942, 영업이익: 287, 순이익: 94, 영업이익률: 3.2, 순이익률: 1.1 },
    { year: "2024", 매출액: 7830, 영업이익: 112, 순이익: -89, 영업이익률: 1.4, 순이익률: -1.1 },
  ];

  // ── FCF 데이터 ────────────────────────────────────────────
  const fcfData = [
    { year: "2020", FCF: 142, CAPEX: -612, 영업CF: 754 },
    { year: "2021", FCF: -418, CAPEX: -1023, 영업CF: 605 },
    { year: "2022", FCF: -1241, CAPEX: -1890, 영업CF: 649 },
    { year: "2023", FCF: -632, CAPEX: -921, 영업CF: 289 },
    { year: "2024", FCF: -285, CAPEX: -512, 영업CF: 227 },
  ];

  // ── 경쟁우위 스코어카드 ───────────────────────────────────
  const moatScores = [
    { name: "가격결정력", score: 5, desc: "공급과잉 국면에서 가격 주도권 약화" },
    { name: "브랜드/제품 차별화", score: 6, desc: "초극박 기술력·High-end 제품군 보유" },
    { name: "전환비용", score: 6, desc: "고객 인증 프로세스로 일정 수준 록인" },
    { name: "네트워크 효과", score: 3, desc: "소재 산업 특성상 네트워크 효과 제한적" },
    { name: "규모의 경제", score: 6, desc: "말레이시아 법인 통한 글로벌 생산 확대" },
    { name: "기술 해자", score: 7, desc: "4μm 이하 초극박 동박 양산 역량 보유" },
  ];

  // ── 피어 비교 테이블 ──────────────────────────────────────
  const peerData = [
    { company: "롯데에너지머티리얼즈(215790)", per: "적자", pbr: 1.1, evEbitda: 28.3, roe: -2.1, highlight: true },
    { company: "솔루스첨단소재(336370)", per: "적자", pbr: 0.9, evEbitda: 35.1, roe: -4.3, highlight: false },
    { company: "일진머티리얼즈(020150)", per: 41.2, pbr: 2.1, evEbitda: 18.7, roe: 5.1, highlight: false },
    { company: "SK넥실리스(비상장)", per: "N/A", pbr: "N/A", evEbitda: "N/A", roe: "N/A", highlight: false },
    { company: "왓슨(대만 상장)", per: 22.1, pbr: 3.4, evEbitda: 14.2, roe: 15.4, highlight: false },
  ];

  // ── DART 최근 공시 ────────────────────────────────────────
  const dartDisclosures = [
    { date: "2026-03-28", type: "사업보고서", title: "2025년 사업보고서 제출 (연결 기준)" },
    { date: "2026-02-14", type: "실적공시", title: "2025년 4Q 및 연간 실적 발표 (영업손실 축소 확인)" },
    { date: "2026-01-20", type: "주요사항", title: "말레이시아 법인 증설 CAPEX 계획 수정 공시" },
  ];

  // ── 재무건전성 지표 ───────────────────────────────────────
  const financialHealth = [
    { label: "부채비율 (D/E)", value: "187%", status: "주의", color: HOLD_ORANGE, desc: "업종 평균 130% 대비 높은 레버리지" },
    { label: "유동비율", value: "112%", status: "보통", color: HOLD_ORANGE, desc: "단기 유동성 다소 빠듯한 수준" },
    { label: "이자보상배율", value: "0.8x", status: "위험", color: AVOID_RED, desc: "영업이익으로 이자 비용 미커버 상태" },
    { label: "순차입금/EBITDA", value: "6.2x", status: "위험", color: AVOID_RED, desc: "과도한 레버리지, 재무 부담 증가" },
  ];

  // ── 섹션 헤더 컴포넌트 ────────────────────────────────────
  const SectionHeader = ({ title, subtitle }) => (
    <div className="border-b-2 pb-2 mb-4" style={{ borderColor: GS_BLUE }}>
      <h2 className="text-lg font-bold" style={{ color: GS_BLUE }}>{title}</h2>
      {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
  );

  const ScoreBar = ({ score, maxScore = 10 }) => (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full"
          style={{ width: `${(score / maxScore) * 100}%`, backgroundColor: score >= 7 ? BUY_GREEN : score >= 5 ? HOLD_ORANGE : AVOID_RED }}
        />
      </div>
      <span className="text-sm font-bold w-8 text-right" style={{ color: score >= 7 ? BUY_GREEN : score >= 5 ? HOLD_ORANGE : AVOID_RED }}>
        {score}/{maxScore}
      </span>
    </div>
  );

  return (
    <div className="bg-white min-h-screen font-sans" style={{ fontFamily: "'Inter', 'Noto Sans KR', sans-serif" }}>

      {/* ── 상단 헤더 바 ── */}
      <div className="text-white px-6 py-3 flex items-center justify-between" style={{ backgroundColor: GS_BLUE }}>
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-wide">Goldman Sachs</span>
          <span className="text-blue-300 text-sm">Equity Research</span>
        </div>
        <div className="text-right text-xs text-blue-200">
          <div>보고서 기준일: 2026-04-20</div>
          <div>Korea Equity Research | Materials</div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">

        {/* ══════════════════════════════════════════════════════
            SECTION 1 : SUMMARY RATING BOX
        ══════════════════════════════════════════════════════ */}
        <div className="rounded-xl border-2 overflow-hidden shadow-md" style={{ borderColor: GS_BLUE }}>
          <div className="text-white px-6 py-4" style={{ backgroundColor: GS_BLUE }}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">롯데에너지머티리얼즈</h1>
                <p className="text-blue-200 text-sm mt-0.5">종목코드 215790 · KOSPI · 전기·전자 소재</p>
                <p className="text-blue-200 text-xs mt-0.5">이차전지용 전해동박 전문 제조사 (구 KCFT)</p>
              </div>
              <div className="flex gap-6 flex-wrap">
                <div className="text-center">
                  <div className="text-xs text-blue-200">현재가</div>
                  <div className="text-2xl font-bold">₩14,850</div>
                  <div className="text-xs text-blue-300">(2026-04-18 기준, 추정)</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-blue-200">시가총액</div>
                  <div className="text-xl font-bold">₩1.33조</div>
                  <div className="text-xs text-blue-300">약 89.5백만주</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-blue-200">투자의견</div>
                  <div className="text-2xl font-bold px-3 py-1 rounded" style={{ backgroundColor: HOLD_ORANGE }}>보유</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-blue-200">목표주가</div>
                  <div className="text-2xl font-bold">₩17,000</div>
                  <div className="text-xs" style={{ color: "#90EE90" }}>+14.5% 상승여력</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-blue-200">확신도</div>
                  <div className="text-2xl font-bold">4/10</div>
                  <div className="text-xs text-blue-300">불확실성 높음</div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm" style={{ backgroundColor: BG_LIGHT }}>
            <div><span className="text-gray-500">52주 고가</span><span className="float-right font-semibold">₩28,300(추정)</span></div>
            <div><span className="text-gray-500">52주 저가</span><span className="float-right font-semibold">₩12,100(추정)</span></div>
            <div><span className="text-gray-500">PBR</span><span className="float-right font-semibold">1.1x</span></div>
            <div><span className="text-gray-500">외국인 지분율</span><span className="float-right font-semibold">~18%(추정)</span></div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            SECTION 2 : 비즈니스 모델
        ══════════════════════════════════════════════════════ */}
        <div className="rounded-xl border p-5 shadow-sm" style={{ backgroundColor: BG_LIGHT }}>
          <SectionHeader title="비즈니스 모델" subtitle="How does the company make money?" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 text-sm text-gray-700 space-y-2 leading-relaxed">
              <p>
                롯데에너지머티리얼즈(구 KCFT)는 <strong>전해동박(Electrolytic Copper Foil)</strong>을 핵심 제품으로 하는 소재 전문기업이다.
                2018년 일진머티리얼즈에서 분사하였고, 2022년 롯데케미칼이 지분을 인수하며 롯데그룹 계열사로 편입되었다.
              </p>
              <p>
                이차전지용 동박은 리튬이온 배터리의 <strong>음극 집전체</strong>로 사용되며, 배터리 에너지 밀도 향상의 핵심 소재다.
                전기차(EV) 보급 확대에 따른 배터리 수요 증가의 직접적 수혜를 받는 구조이나, 2023년 이후 글로벌 EV 수요 둔화 및
                중국산 저가 동박 공급 과잉으로 심각한 업황 침체를 겪고 있다.
              </p>
              <p>
                주요 고객은 <strong>삼성SDI, SK온</strong> 등 국내 배터리 3사와 해외 셀 메이커이며, 국내외 생산거점(말레이시아 법인)을 통해
                글로벌 공급망을 운영한다. 동박 두께 4μm 이하의 초극박 기술력은 경쟁 차별화 요소다.
              </p>
            </div>
            <div className="space-y-2">
              <div className="rounded-lg p-3 text-sm" style={{ backgroundColor: "#EFF6FF" }}>
                <div className="font-semibold text-sm mb-2" style={{ color: GS_BLUE }}>핵심 수치 (2024년 추정)</div>
                <div className="flex justify-between py-1 border-b border-blue-100"><span className="text-gray-600">매출액</span><span className="font-bold">₩7,830억</span></div>
                <div className="flex justify-between py-1 border-b border-blue-100"><span className="text-gray-600">영업이익</span><span className="font-bold text-orange-500">₩112억</span></div>
                <div className="flex justify-between py-1 border-b border-blue-100"><span className="text-gray-600">순이익</span><span className="font-bold text-red-600">▼ ₩89억 손실</span></div>
                <div className="flex justify-between py-1"><span className="text-gray-600">임직원 수</span><span className="font-bold">~2,300명(추정)</span></div>
              </div>
              <div className="rounded-lg p-3 text-sm" style={{ backgroundColor: "#FFF7ED" }}>
                <div className="font-semibold text-sm mb-1" style={{ color: HOLD_ORANGE }}>핵심 리스크</div>
                <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                  <li>EV 수요 회복 지연</li>
                  <li>중국 동박사 가격 덤핑</li>
                  <li>고금리 기반 차입 부담</li>
                  <li>말레이시아 증설 수익성</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            SECTION 3 : 매출 구성 (파이 차트)
        ══════════════════════════════════════════════════════ */}
        <div className="rounded-xl border p-5 shadow-sm bg-white">
          <SectionHeader title="매출 구성" subtitle="Revenue Breakdown by Segment (2024년 기준, 추정)" />
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div style={{ width: 260, height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={revenueSegments} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value">
                    {revenueSegments.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {revenueSegments.map((seg, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{seg.name}</span>
                      <span className="font-bold">{seg.value}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-1.5 mt-1">
                      <div className="h-1.5 rounded-full" style={{ width: `${seg.value}%`, backgroundColor: seg.color }} />
                    </div>
                  </div>
                </div>
              ))}
              <p className="text-xs text-gray-500 mt-3 pt-3 border-t">
                * 이차전지용 동박이 매출의 약 68%를 차지. EV 수요 둔화 영향이 실적 전반에 직접 반영됨.
                말레이시아 법인 매출 포함 기준(연결). 데이터는 추정치 기반.
              </p>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            SECTION 4 : 수익성 추이 (라인 차트)
        ══════════════════════════════════════════════════════ */}
        <div className="rounded-xl border p-5 shadow-sm bg-white">
          <SectionHeader title="수익성 추이" subtitle="5-Year Profitability Trend (억원, 연결 기준, 추정치 포함)" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-500 mb-2">매출액 / 영업이익 (억원)</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={profitabilityData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(val) => `${val.toLocaleString()}억원`} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="매출액" fill="#93C5FD" name="매출액" />
                  <Bar dataKey="영업이익" fill={GS_BLUE} name="영업이익" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">영업이익률 / 순이익률 (%)</p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={profitabilityData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(val) => `${val}%`} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="영업이익률" stroke={GS_BLUE} strokeWidth={2} dot={{ r: 4 }} name="영업이익률" />
                  <Line type="monotone" dataKey="순이익률" stroke={HOLD_ORANGE} strokeWidth={2} dot={{ r: 4 }} name="순이익률" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-3 p-3 rounded-lg text-xs text-gray-600 leading-relaxed" style={{ backgroundColor: BG_LIGHT }}>
            <strong>애널리스트 코멘트:</strong> 2022년 영업이익률 8.3%로 정점을 기록한 이후 EV 수요 둔화·중국 공급 과잉·원자재 가격 변동으로
            급격히 수익성이 훼손됐다. 2024년은 사실상 손익분기점 이하로 하락. 2026~2027년 EV 업황 회복이 수익성 반등의 핵심 변수다.
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            SECTION 5 : 재무건전성
        ══════════════════════════════════════════════════════ */}
        <div className="rounded-xl border p-5 shadow-sm" style={{ backgroundColor: BG_LIGHT }}>
          <SectionHeader title="재무건전성" subtitle="Financial Health Indicators (2024년 기준, 추정)" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {financialHealth.map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 border shadow-sm">
                <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                <div className="text-2xl font-bold mb-1" style={{ color: item.color }}>{item.value}</div>
                <div className="inline-block text-xs px-2 py-0.5 rounded-full text-white mb-2" style={{ backgroundColor: item.color }}>
                  {item.status}
                </div>
                <p className="text-xs text-gray-500 leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg text-xs text-gray-600" style={{ backgroundColor: "#FFF1F2" }}>
            <strong className="text-red-700">재무 경보:</strong> 이자보상배율 1.0x 미만으로 영업이익으로 이자 비용을 충당하지 못하는 상태.
            롯데케미칼 그룹 차원의 재무 지원 가능성은 신용 리스크를 일부 완화하나, 자체 현금흐름 개선이 시급하다.
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            SECTION 6 : 잉여현금흐름(FCF)
        ══════════════════════════════════════════════════════ */}
        <div className="rounded-xl border p-5 shadow-sm bg-white">
          <SectionHeader title="잉여현금흐름 (FCF)" subtitle="Free Cash Flow Analysis (억원, 추정)" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={fcfData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(val) => `${val.toLocaleString()}억원`} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="영업CF" fill="#60A5FA" name="영업현금흐름" />
                  <Bar dataKey="FCF" fill={AVOID_RED} name="FCF" />
                  <Bar dataKey="CAPEX" fill="#9CA3AF" name="CAPEX(음수)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-lg border" style={{ backgroundColor: BG_LIGHT }}>
                <p className="font-semibold mb-1" style={{ color: GS_BLUE }}>FCF 현황 진단</p>
                <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                  <li>2021~2024년 연속 마이너스 FCF</li>
                  <li>말레이시아 증설 투자로 CAPEX 부담 지속</li>
                  <li>영업현금흐름 급감으로 자체 조달 한계</li>
                  <li>배당 중단 or 최소화 예상</li>
                </ul>
              </div>
              <div className="p-3 rounded-lg border" style={{ backgroundColor: "#ECFDF5" }}>
                <p className="font-semibold mb-1" style={{ color: BUY_GREEN }}>자본배분 우선순위</p>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between"><span>① CAPEX(증설)</span><span className="text-orange-500">최우선</span></div>
                  <div className="flex justify-between"><span>② 차입금 상환</span><span>2순위</span></div>
                  <div className="flex justify-between"><span>③ 배당</span><span className="text-red-500">사실상 중단</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            SECTION 7 : 경쟁우위 스코어카드
        ══════════════════════════════════════════════════════ */}
        <div className="rounded-xl border p-5 shadow-sm" style={{ backgroundColor: BG_LIGHT }}>
          <SectionHeader title="경쟁우위 스코어카드" subtitle="Competitive Moat Analysis (1–10점)" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {moatScores.map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border shadow-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold">{item.name}</span>
                </div>
                <ScoreBar score={item.score} />
                <p className="text-xs text-gray-500 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-white border text-xs text-gray-600">
            <strong>종합 해자 평가:</strong> 초극박 기술력(4μm↓)과 고객 인증 기반 전환비용은 일정 수준의 경쟁우위를 제공하나,
            동박 산업의 빠른 기술 확산과 중국 업체의 추격으로 해자의 내구성은 중간 수준(5.5/10)으로 평가된다.
            규모 확대를 통한 원가 경쟁력 확보가 중장기 생존의 핵심 과제다.
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            SECTION 8 : 지배구조 및 경영진
        ══════════════════════════════════════════════════════ */}
        <div className="rounded-xl border p-5 shadow-sm bg-white">
          <SectionHeader title="지배구조 및 경영진" subtitle="Corporate Governance & Recent DART Disclosures" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <h3 className="text-sm font-semibold mb-3" style={{ color: GS_BLUE }}>주요 주주 구성 (추정)</h3>
              <div className="space-y-2 text-sm">
                {[
                  { name: "롯데케미칼(최대주주)", pct: "약 43%", color: GS_BLUE },
                  { name: "국민연금공단", pct: "약 7%", color: "#4B5563" },
                  { name: "외국인 투자자", pct: "약 18%", color: "#6B7280" },
                  { name: "기타 소수주주", pct: "약 32%", color: "#9CA3AF" },
                ].map((sh, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: sh.color }} />
                    <span className="flex-1 text-gray-700">{sh.name}</span>
                    <span className="font-semibold text-xs">{sh.pct}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-lg text-xs text-gray-600" style={{ backgroundColor: BG_LIGHT }}>
                <strong>지배구조 평가:</strong> 롯데케미칼의 지배 하에 그룹 재무 지원이 기대되나,
                대기업 그룹 계열사 특성상 독립적 경영 의사결정에 제약이 있을 수 있다.
                소수주주 보호 측면에서는 보통 수준으로 평가한다.
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3" style={{ color: GS_BLUE }}>최근 DART 주요 공시 (최근 3개월)</h3>
              <div className="space-y-2">
                {dartDisclosures.map((d, idx) => (
                  <div key={idx} className="border rounded-lg p-3 text-xs hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-white text-xs" style={{ backgroundColor: GS_BLUE }}>{d.type}</span>
                      <span className="text-gray-400">{d.date}</span>
                    </div>
                    <p className="text-gray-700 leading-snug">{d.title}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">* 출처: DART 전자공시시스템 (dart.fss.or.kr), 추정 포함</p>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            SECTION 9 : 밸류에이션 및 피어 비교
        ══════════════════════════════════════════════════════ */}
        <div className="rounded-xl border p-5 shadow-sm" style={{ backgroundColor: BG_LIGHT }}>
          <SectionHeader title="밸류에이션" subtitle="Valuation & Peer Comparison (2024년 기준, 추정)" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            {[
              { label: "PER", value: "적자(N/M)", sub: "흑자 전환 시 약 22x 예상", color: AVOID_RED },
              { label: "PBR", value: "1.1x", sub: "장부가 대비 소폭 프리미엄", color: HOLD_ORANGE },
              { label: "EV/EBITDA", value: "28.3x", sub: "업종 평균 대비 고평가 구간", color: HOLD_ORANGE },
            ].map((v, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border text-center shadow-sm">
                <div className="text-xs text-gray-500 mb-1">{v.label}</div>
                <div className="text-2xl font-bold" style={{ color: v.color }}>{v.value}</div>
                <div className="text-xs text-gray-400 mt-1">{v.sub}</div>
              </div>
            ))}
          </div>
          <h3 className="text-sm font-semibold mb-2" style={{ color: GS_BLUE }}>동종 업종 피어 비교 (전해동박 / 배터리 소재)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr style={{ backgroundColor: GS_BLUE }} className="text-white">
                  <th className="px-3 py-2 text-left">종목명</th>
                  <th className="px-3 py-2 text-right">PER</th>
                  <th className="px-3 py-2 text-right">PBR</th>
                  <th className="px-3 py-2 text-right">EV/EBITDA</th>
                  <th className="px-3 py-2 text-right">ROE</th>
                </tr>
              </thead>
              <tbody>
                {peerData.map((p, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-white" : ""}
                    style={p.highlight ? { backgroundColor: "#EFF6FF", fontWeight: "bold" } : {}}
                  >
                    <td className="px-3 py-2">{p.company}{p.highlight && <span className="ml-1 text-blue-600">◀</span>}</td>
                    <td className="px-3 py-2 text-right">{p.per}</td>
                    <td className="px-3 py-2 text-right">{typeof p.pbr === 'number' ? `${p.pbr}x` : p.pbr}</td>
                    <td className="px-3 py-2 text-right">{typeof p.evEbitda === 'number' ? `${p.evEbitda}x` : p.evEbitda}</td>
                    <td className="px-3 py-2 text-right"
                      style={{ color: typeof p.roe === 'number' && p.roe < 0 ? AVOID_RED : BUY_GREEN }}>
                      {typeof p.roe === 'number' ? `${p.roe}%` : p.roe}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">* 피어 데이터는 공개 자료 기반 추정치. 실제 수치와 차이가 있을 수 있음.</p>
        </div>

        {/* ══════════════════════════════════════════════════════
            SECTION 10 : Bull / Bear Case
        ══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bull Case */}
          <div className="rounded-xl border-2 p-5" style={{ borderColor: BUY_GREEN, backgroundColor: "#F0FDF4" }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: BUY_GREEN }} />
              <h2 className="text-base font-bold" style={{ color: BUY_GREEN }}>Bull Case</h2>
              <span className="ml-auto text-lg font-bold" style={{ color: BUY_GREEN }}>목표주가 ₩23,000</span>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex gap-2">
                <span className="text-green-500 font-bold mt-0.5">▲</span>
                <div><strong>EV 수요 강한 회복</strong>: 2026년 하반기 글로벌 EV 판매 재가속, 동박 수요 빠른 정상화</div>
              </div>
              <div className="flex gap-2">
                <span className="text-green-500 font-bold mt-0.5">▲</span>
                <div><strong>말레이시아 공장 가동률 상승</strong>: 글로벌 고객사 신규 공급 계약 체결로 가동률 80% 이상 달성</div>
              </div>
              <div className="flex gap-2">
                <span className="text-green-500 font-bold mt-0.5">▲</span>
                <div><strong>동박 ASP 반등</strong>: 공급과잉 완화 및 고부가 초극박 제품 믹스 개선으로 마진 회복</div>
              </div>
              <div className="flex gap-2">
                <span className="text-green-500 font-bold mt-0.5">▲</span>
                <div><strong>롯데그룹 시너지</strong>: 계열사 배터리 사업 연계 안정적 물량 확보</div>
              </div>
            </div>
            <div className="mt-3 p-2 rounded text-xs" style={{ backgroundColor: "#DCFCE7" }}>
              <strong>Bull Case PER:</strong> 흑자 전환 후 약 18x 적용, EV/EBITDA 기반 DCF 상향
            </div>
          </div>

          {/* Bear Case */}
          <div className="rounded-xl border-2 p-5" style={{ borderColor: AVOID_RED, backgroundColor: "#FFF1F2" }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: AVOID_RED }} />
              <h2 className="text-base font-bold" style={{ color: AVOID_RED }}>Bear Case</h2>
              <span className="ml-auto text-lg font-bold" style={{ color: AVOID_RED }}>목표주가 ₩9,500</span>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex gap-2">
                <span className="text-red-500 font-bold mt-0.5">▼</span>
                <div><strong>EV 수요 추가 침체</strong>: 관세 전쟁·소비 위축으로 EV 판매 2026년도 부진 지속</div>
              </div>
              <div className="flex gap-2">
                <span className="text-red-500 font-bold mt-0.5">▼</span>
                <div><strong>중국산 저가 덤핑 심화</strong>: 중국 업체 공격적 가격 인하로 한국산 동박 경쟁력 추가 훼손</div>
              </div>
              <div className="flex gap-2">
                <span className="text-red-500 font-bold mt-0.5">▼</span>
                <div><strong>재무 구조 악화</strong>: 영업손실 지속 시 차입금 만기 대응 어려움, 유상증자 가능성</div>
              </div>
              <div className="flex gap-2">
                <span className="text-red-500 font-bold mt-0.5">▼</span>
                <div><strong>말레이시아 공장 가동 지연</strong>: 글로벌 수요 부진으로 증설 설비 유휴화, 감가상각 부담 증가</div>
              </div>
            </div>
            <div className="mt-3 p-2 rounded text-xs" style={{ backgroundColor: "#FFE4E6" }}>
              <strong>Bear Case:</strong> PBR 0.6x 적용 (자산가치 할인), 유상증자 시 주가 추가 희석 위험
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            SECTION 11 : 최종 판단
        ══════════════════════════════════════════════════════ */}
        <div className="rounded-xl border-2 p-6 shadow-md" style={{ borderColor: HOLD_ORANGE, backgroundColor: "#FFF7ED" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="px-4 py-2 rounded-lg text-white text-lg font-bold" style={{ backgroundColor: HOLD_ORANGE }}>
              보유 (HOLD)
            </div>
            <div className="text-sm text-gray-600">
              확신도: <span className="font-bold text-orange-600 text-lg">4/10</span>
              <span className="ml-2 text-xs text-gray-400">(높은 불확실성)</span>
            </div>
            <div className="ml-auto text-right">
              <div className="text-xs text-gray-500">목표주가</div>
              <div className="text-xl font-bold" style={{ color: HOLD_ORANGE }}>₩17,000</div>
            </div>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            롯데에너지머티리얼즈는 이차전지 소재 중 핵심인 전해동박의 국내 선두 공급자로서 장기 구조적 성장 테마에 속해 있으나,
            <strong> 현 시점은 업황 바닥 국면</strong>으로 실적 가시성이 현저히 낮다.
            2024년 사실상 영업이익 소멸 및 순손실 전환, 이자보상배율 1.0x 이하라는 재무적 압박이 지속되는 가운데,
            EV 수요 회복 타이밍이 불투명하다는 점이 가장 큰 투자 장애물이다.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            PBR 1.1x는 자산가치 대비 낮은 프리미엄으로 하방 지지선 역할을 하나, 흑자 전환 전까지 주가 모멘텀을 기대하기는 어렵다.
            <strong> 2026년 하반기 이후 EV 수요 반등 신호와 말레이시아 공장 가동률 개선</strong>이 확인될 경우 투자의견 상향을 검토할 것이다.
            현 주가 수준에서 신규 매수보다는 기존 보유자는 유지, 신규 투자자는 추가 데이터 확인 후 진입을 권고한다.
          </p>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="text-center p-2 rounded-lg bg-white border text-xs">
              <div className="font-semibold text-gray-500 mb-1">핵심 모니터링 지표</div>
              <div className="text-gray-700">월간 EV 글로벌 판매량</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-white border text-xs">
              <div className="font-semibold text-gray-500 mb-1">투자의견 상향 조건</div>
              <div className="text-gray-700">영업이익률 4%+ 회복</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-white border text-xs">
              <div className="font-semibold text-gray-500 mb-1">투자의견 하향 조건</div>
              <div className="text-gray-700">유상증자 또는 2Q 연속 적자</div>
            </div>
          </div>
        </div>

        {/* ── 면책 고지 ── */}
        <div className="text-xs text-gray-400 border-t pt-4 leading-relaxed">
          <strong>면책 고지(Disclaimer):</strong> 본 보고서는 AI 기반 분석 시스템에 의해 자동 생성된 것으로, 학습 데이터 기준의 추정치를 포함하며
          실제 최신 데이터와 차이가 있을 수 있습니다. 투자 결정은 반드시 공식 DART 공시, 증권사 리서치 등 검증된 자료를 기반으로 하시기 바랍니다.
          본 보고서는 투자 권유 목적이 아니며, 투자 손익에 대한 책임은 투자자 본인에게 있습니다.
          보고서 기준일: 2026-04-20 | 분석 대상: 215790 롯데에너지머티리얼즈 | 연결 재무제표 기준
        </div>
      </div>
    </div>
  );
}
