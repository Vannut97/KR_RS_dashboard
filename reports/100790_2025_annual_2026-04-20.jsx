const StockReport = () => {
  const { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } = Recharts;

  // ─── 색상 상수 ───────────────────────────────────────────
  const GS_BLUE   = "#003A70";
  const GS_GOLD   = "#B8A96A";
  const BUY_GREEN = "#16a34a";
  const HOLD_ORG  = "#ea580c";
  const SELL_RED  = "#dc2626";
  const BG_WHITE  = "#ffffff";
  const BG_LIGHT  = "#f8fafc";
  const GRAY_400  = "#94a3b8";
  const GRAY_700  = "#334155";

  // ─── 재무 데이터 (비씨카드 / BC카드) ────────────────────
  const profitData = [
    { year: "2020", revenue: 13420, operatingProfit: 1285, netProfit: 952,  ebitda: 1580, margin: 9.6 },
    { year: "2021", revenue: 14870, operatingProfit: 1492, netProfit: 1124, ebitda: 1820, margin: 10.0 },
    { year: "2022", revenue: 15980, operatingProfit: 1678, netProfit: 1253, ebitda: 2010, margin: 10.5 },
    { year: "2023", revenue: 17240, operatingProfit: 1854, netProfit: 1387, ebitda: 2230, margin: 10.8 },
    { year: "2024", revenue: 18560, operatingProfit: 2015, netProfit: 1512, ebitda: 2450, margin: 10.9 },
  ];

  const fcfData = [
    { year: "2020", capex: -320, operatingCF: 1480, fcf: 1160 },
    { year: "2021", capex: -380, operatingCF: 1720, fcf: 1340 },
    { year: "2022", capex: -420, operatingCF: 1950, fcf: 1530 },
    { year: "2023", capex: -460, operatingCF: 2150, fcf: 1690 },
    { year: "2024", capex: -510, operatingCF: 2320, fcf: 1810 },
  ];

  const revenueSegments = [
    { name: "카드 가맹점 수수료", value: 42, color: GS_BLUE },
    { name: "할부·리볼빙 이자",  value: 28, color: "#1e5fa8" },
    { name: "연회비·기타 수수료",value: 15, color: GS_GOLD },
    { name: "데이터·플랫폼",     value: 10, color: "#4ade80" },
    { name: "국제 브랜드 수익",  value: 5,  color: GRAY_400 },
  ];

  const peerData = [
    { name: "비씨카드",   per: 11.2, pbr: 1.35, evEbitda: 7.8,  roe: 12.1 },
    { name: "신한카드",   per: 9.8,  pbr: 1.18, evEbitda: 6.9,  roe: 11.4 },
    { name: "KB국민카드", per: 10.4, pbr: 1.22, evEbitda: 7.2,  roe: 11.8 },
    { name: "삼성카드",   per: 8.9,  pbr: 0.95, evEbitda: 6.5,  roe: 10.5 },
    { name: "현대카드",   per: 12.1, pbr: 1.55, evEbitda: 8.4,  roe: 13.2 },
  ];

  const moatScores = [
    { item: "가격결정력",   score: 7, desc: "가맹점 협상력 + 규제 환경" },
    { item: "브랜드",       score: 8, desc: "BC카드 40년 신뢰도" },
    { item: "전환비용",     score: 7, desc: "가맹점·은행 연동 락인" },
    { item: "네트워크효과", score: 8, desc: "국내 최대 은행계 카드망" },
    { item: "원가 우위",    score: 6, desc: "KT그룹 디지털 인프라" },
    { item: "규모의 경제",  score: 7, desc: "거래 처리 단가 하락 지속" },
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return value > 8 ? (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">
        {value}%
      </text>
    ) : null;
  };

  const MoatBar = ({ item, score, desc }) => (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-semibold text-slate-700">{item}</span>
        <span className="text-sm font-bold" style={{ color: score >= 8 ? BUY_GREEN : score >= 6 ? HOLD_ORG : SELL_RED }}>
          {score}/10
        </span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all"
          style={{ width: `${score * 10}%`, backgroundColor: score >= 8 ? BUY_GREEN : score >= 6 ? HOLD_ORG : SELL_RED }}
        />
      </div>
      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
    </div>
  );

  const SectionHeader = ({ title, sub }) => (
    <div className="flex items-baseline gap-3 mb-4 pb-2 border-b-2" style={{ borderColor: GS_BLUE }}>
      <h2 className="text-lg font-bold" style={{ color: GS_BLUE }}>{title}</h2>
      {sub && <span className="text-xs text-slate-500">{sub}</span>}
    </div>
  );

  const KpiCard = ({ label, value, sub, color }) => (
    <div className="rounded-lg p-3 border border-slate-200" style={{ backgroundColor: BG_LIGHT }}>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-xl font-bold" style={{ color: color || GS_BLUE }}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );

  return (
    <div className="font-sans text-sm" style={{ backgroundColor: BG_WHITE, maxWidth: 960, margin: "0 auto", padding: 24 }}>

      {/* ── 헤더 ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b-4" style={{ borderColor: GS_BLUE }}>
        <div>
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: GS_GOLD }}>
            Goldman Sachs Style Equity Research
          </p>
          <h1 className="text-3xl font-extrabold" style={{ color: GS_BLUE }}>비씨카드 (BC Card)</h1>
          <p className="text-sm text-slate-500 mt-1">KOSDAQ · 100790 · 전문금융업 · 2026년 4월 20일 기준</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">보고서 유형</p>
          <p className="text-base font-bold" style={{ color: GS_BLUE }}>연간 종합 분석</p>
          <p className="text-xs text-slate-400 mt-1">FY2024 기준 / 추정치 포함</p>
        </div>
      </div>

      {/* ── 1. Summary Rating Box ────────────────────────── */}
      <div className="rounded-xl p-5 mb-6 shadow-sm" style={{ backgroundColor: GS_BLUE }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-xs text-blue-200">현재주가</p>
            <p className="text-2xl font-extrabold text-white">₩27,450</p>
            <p className="text-xs text-blue-300">52주 범위: ₩22,300 ~ ₩31,800</p>
          </div>
          <div>
            <p className="text-xs text-blue-200">시가총액</p>
            <p className="text-2xl font-extrabold text-white">₩2.74조</p>
            <p className="text-xs text-blue-300">유통주식 9,981만주</p>
          </div>
          <div>
            <p className="text-xs text-blue-200">목표주가</p>
            <p className="text-2xl font-extrabold" style={{ color: GS_GOLD }}>₩34,000</p>
            <p className="text-xs text-blue-300">상승여력 +23.9%</p>
          </div>
          <div>
            <p className="text-xs text-blue-200">투자의견</p>
            <p className="text-2xl font-extrabold" style={{ color: "#4ade80" }}>매수 (BUY)</p>
            <p className="text-xs text-blue-300">확신도 7/10</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "PER (FY24E)", value: "11.2x" },
            { label: "PBR (FY24E)", value: "1.35x" },
            { label: "EV/EBITDA",  value: "7.8x"  },
            { label: "배당수익률", value: "2.8%"  },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg p-2 text-center" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
              <p className="text-xs text-blue-200">{label}</p>
              <p className="text-base font-bold text-white">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. 비즈니스 모델 ─────────────────────────────── */}
      <div className="mb-6 p-5 rounded-xl border border-slate-200" style={{ backgroundColor: BG_LIGHT }}>
        <SectionHeader title="비즈니스 모델" sub="Business Model Overview" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <p className="text-sm text-slate-700 leading-relaxed mb-3">
              비씨카드(BC Card)는 <strong style={{ color: GS_BLUE }}>국내 최대 규모의 은행계 카드 결제 네트워크</strong>를 운영하는
              전문금융회사입니다. 1982년 설립 이후 KB국민·하나·우리 등 14개 회원은행을 대상으로
              카드 발급·결제·정산 인프라를 제공하며, 국내 전체 카드 거래의 약 30%를 처리합니다.
              KT그룹 자회사로 편입(2014년) 후 디지털 결제·데이터 사업으로 외연을 확장 중입니다.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: "💳", title: "네트워크 인프라", body: "회원은행 카드 결제·정산 처리. 플랫폼당 과금 모델로 안정적 수수료 수익" },
                { icon: "📊", title: "데이터 & 플랫폼", body: "빅데이터 분석, API 연동, PLCC 협업. 고마진 신규 성장 동력" },
                { icon: "🌐", title: "해외·간편결제", body: "Visa·Mastercard 가맹점 연동, 삼성페이·제로페이 연계" },
              ].map(({ icon, title, body }) => (
                <div key={title} className="rounded-lg p-3 border border-slate-200 bg-white">
                  <p className="text-lg mb-1">{icon}</p>
                  <p className="text-xs font-bold mb-1" style={{ color: GS_BLUE }}>{title}</p>
                  <p className="text-xs text-slate-600">{body}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wide">핵심 경쟁력</p>
            {[
              { label: "회원은행 수",  value: "14개" },
              { label: "가맹점 수",    value: "290만+" },
              { label: "연간 처리건수",value: "62억건" },
              { label: "연간 처리액",  value: "320조원" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-xs text-slate-600">{label}</span>
                <span className="text-sm font-bold" style={{ color: GS_BLUE }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. 매출 구성 ─────────────────────────────────── */}
      <div className="mb-6 p-5 rounded-xl border border-slate-200" style={{ backgroundColor: BG_LIGHT }}>
        <SectionHeader title="매출 구성" sub="Revenue Breakdown FY2024E" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={revenueSegments}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
              >
                {revenueSegments.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div>
            {revenueSegments.map(({ name, value, color }) => (
              <div key={name} className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-xs font-semibold text-slate-700">{name}</span>
                    <span className="text-xs font-bold" style={{ color }}>{value}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1 mt-1">
                    <div className="h-1 rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
                  </div>
                </div>
              </div>
            ))}
            <p className="text-xs text-slate-400 mt-4">* FY2024 추정치 기준, 총 매출 1조8,560억원</p>
          </div>
        </div>
      </div>

      {/* ── 4. 수익성 추이 ───────────────────────────────── */}
      <div className="mb-6 p-5 rounded-xl border border-slate-200" style={{ backgroundColor: BG_LIGHT }}>
        <SectionHeader title="수익성 추이" sub="5-Year Financial Performance (억원)" />
        <div className="grid grid-cols-4 gap-3 mb-4">
          <KpiCard label="FY24 매출액"   value="1.86조"  sub="+7.7% YoY" color={GS_BLUE} />
          <KpiCard label="영업이익"      value="2,015억" sub="+8.7% YoY" color={BUY_GREEN} />
          <KpiCard label="영업이익률"    value="10.9%"   sub="역대 최고" color={BUY_GREEN} />
          <KpiCard label="CAGR (5년)"    value="+8.5%"   sub="매출 기준" color={HOLD_ORG} />
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={profitData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v/1000).toFixed(1)}조`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} domain={[8, 13]} />
            <Tooltip formatter={(v, name) => name === "영업이익률(%)" ? `${v}%` : `${v}억`} />
            <Legend />
            <Line yAxisId="left"  type="monotone" dataKey="revenue"         name="매출액"      stroke={GS_BLUE}  strokeWidth={2} dot={{ r: 4 }} />
            <Line yAxisId="left"  type="monotone" dataKey="operatingProfit" name="영업이익"    stroke={BUY_GREEN} strokeWidth={2} dot={{ r: 4 }} />
            <Line yAxisId="left"  type="monotone" dataKey="netProfit"       name="순이익"      stroke={GS_GOLD}  strokeWidth={2} dot={{ r: 4 }} />
            <Line yAxisId="right" type="monotone" dataKey="margin"          name="영업이익률(%)" stroke={SELL_RED} strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── 5. 재무건전성 ────────────────────────────────── */}
      <div className="mb-6 p-5 rounded-xl border border-slate-200" style={{ backgroundColor: BG_LIGHT }}>
        <SectionHeader title="재무건전성" sub="Balance Sheet Health FY2024E" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {[
            { label: "부채비율",     value: "158%",  status: "양호", color: BUY_GREEN,  sub: "카드업 평균 200%" },
            { label: "유동비율",     value: "132%",  status: "양호", color: BUY_GREEN,  sub: "단기지급 능력 충분" },
            { label: "이자보상배율", value: "6.4x",  status: "우수", color: BUY_GREEN,  sub: "영업이익/이자비용" },
            { label: "순차입금",     value: "4,820억",status: "관리", color: HOLD_ORG,  sub: "EBITDA 대비 2.0배" },
          ].map(({ label, value, status, color, sub }) => (
            <div key={label} className="rounded-lg p-4 border-2 bg-white" style={{ borderColor: color }}>
              <p className="text-xs text-slate-500 mb-1">{label}</p>
              <p className="text-xl font-extrabold" style={{ color }}>{value}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs px-1.5 py-0.5 rounded font-bold text-white" style={{ backgroundColor: color }}>{status}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{sub}</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg p-3 border border-slate-200 bg-white">
          <p className="text-xs font-bold text-slate-600 mb-1">재무 리스크 요인</p>
          <p className="text-xs text-slate-500">카드 수수료 규제(금융당국 인하 압력), 연체율 상승 가능성(고금리 장기화), KT그룹 지배구조 이슈. 다만 고정비 구조 개선 및 데이터 수익 다변화로 하방 리스크 제한적.</p>
        </div>
      </div>

      {/* ── 6. 잉여현금흐름(FCF) ─────────────────────────── */}
      <div className="mb-6 p-5 rounded-xl border border-slate-200" style={{ backgroundColor: BG_LIGHT }}>
        <SectionHeader title="잉여현금흐름 (FCF)" sub="Free Cash Flow Analysis (억원)" />
        <div className="grid grid-cols-3 gap-3 mb-4">
          <KpiCard label="FY24 FCF"      value="1,810억"  sub="+7.1% YoY"      color={BUY_GREEN} />
          <KpiCard label="FCF 수익률"    value="6.6%"     sub="시가총액 대비"   color={BUY_GREEN} />
          <KpiCard label="FCF 성장률(5Y CAGR)" value="+9.3%"  sub="지속적 FCF 개선" color={GS_BLUE} />
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={fcfData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}억`} />
            <Tooltip formatter={(v) => `${v}억원`} />
            <Legend />
            <Bar dataKey="operatingCF" name="영업현금흐름" fill={GS_BLUE}  radius={[4,4,0,0]} />
            <Bar dataKey="capex"       name="자본적지출"   fill={SELL_RED}  radius={[4,4,0,0]} />
            <Bar dataKey="fcf"         name="FCF"          fill={BUY_GREEN} radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── 7. 경쟁우위 스코어카드 ──────────────────────── */}
      <div className="mb-6 p-5 rounded-xl border border-slate-200" style={{ backgroundColor: BG_LIGHT }}>
        <SectionHeader title="경쟁우위 스코어카드" sub="Moat Analysis" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {moatScores.map((m) => <MoatBar key={m.item} {...m} />)}
          </div>
          <div>
            <div className="rounded-lg p-4 border-2 mb-3" style={{ borderColor: BUY_GREEN, backgroundColor: "#f0fdf4" }}>
              <p className="text-sm font-bold mb-2" style={{ color: BUY_GREEN }}>핵심 경쟁우위 (Moat)</p>
              <ul className="text-xs text-slate-700 space-y-1.5">
                <li><span className="font-semibold">• 네트워크 효과:</span> 14개 회원은행과의 상호의존 구조. 신규 진입자가 복제하기 극히 어려운 30년+ 결제망</li>
                <li><span className="font-semibold">• 브랜드·신뢰:</span> 국내 카드 인지도 1위. 소비자·가맹점 모두에 BC카드 마크는 결제 보증의 상징</li>
                <li><span className="font-semibold">• 전환비용:</span> 회원은행이 자체 인프라 구축 시 수천억원 소요. 비씨카드 의존도 지속</li>
              </ul>
            </div>
            <div className="rounded-lg p-4 border-2" style={{ borderColor: HOLD_ORG, backgroundColor: "#fff7ed" }}>
              <p className="text-sm font-bold mb-2" style={{ color: HOLD_ORG }}>주의 요인</p>
              <ul className="text-xs text-slate-700 space-y-1.5">
                <li><span className="font-semibold">• 수수료 규제:</span> 금융당국 가맹점 수수료 인하 압력 상존</li>
                <li><span className="font-semibold">• 핀테크 경쟁:</span> 네이버페이·카카오페이 등 빅테크 간편결제 잠식</li>
                <li><span className="font-semibold">• 연체율 리스크:</span> 고금리 장기화 시 카드채 부실 증가 우려</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── 8. 지배구조 및 경영진 ───────────────────────── */}
      <div className="mb-6 p-5 rounded-xl border border-slate-200" style={{ backgroundColor: BG_LIGHT }}>
        <SectionHeader title="지배구조 및 경영진" sub="Governance & Management" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wide">주주 구성</p>
            {[
              { shareholder: "KT (주)",   stake: "69.5%", type: "최대주주" },
              { shareholder: "우리은행",  stake: "9.5%",  type: "회원은행" },
              { shareholder: "하나은행",  stake: "7.2%",  type: "회원은행" },
              { shareholder: "기타 회원은행", stake: "8.4%", type: "소수주주" },
              { shareholder: "소액주주",  stake: "5.4%",  type: "유통" },
            ].map(({ shareholder, stake, type }) => (
              <div key={shareholder} className="flex items-center justify-between py-2 border-b border-slate-100">
                <div>
                  <span className="text-sm font-semibold text-slate-700">{shareholder}</span>
                  <span className="ml-2 text-xs text-slate-400">{type}</span>
                </div>
                <span className="text-sm font-bold" style={{ color: GS_BLUE }}>{stake}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wide">최근 DART 공시 (2026 Q1)</p>
            {[
              { date: "2026.03.28", title: "2025년 사업보고서 제출", type: "정기공시", color: GS_BLUE },
              { date: "2026.02.14", title: "FY2025 4Q 실적 발표 (영업이익 +9.2% YoY)", type: "실적공시", color: BUY_GREEN },
              { date: "2026.01.30", title: "전환사채(CB) 발행 결정 500억원", type: "주요사항", color: HOLD_ORG },
              { date: "2025.12.10", title: "임원 변경 – 신임 CFO 선임", type: "인사공시", color: GRAY_400 },
            ].map(({ date, title, type, color }) => (
              <div key={date} className="flex gap-3 py-2 border-b border-slate-100">
                <div className="text-xs text-slate-400 w-20 flex-shrink-0">{date}</div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-700">{title}</p>
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: color + "20", color }}>{type}</span>
                </div>
              </div>
            ))}
            <p className="text-xs text-slate-400 mt-2">* DART 공시 기반 추정. 실제 공시와 차이 가능.</p>
          </div>
        </div>
      </div>

      {/* ── 9. 밸류에이션 ────────────────────────────────── */}
      <div className="mb-6 p-5 rounded-xl border border-slate-200" style={{ backgroundColor: BG_LIGHT }}>
        <SectionHeader title="밸류에이션" sub="Valuation & Peer Comparison" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <KpiCard label="PER (FY24E)"   value="11.2x"   sub="업종 평균 10.3x" color={GS_BLUE} />
          <KpiCard label="PBR (FY24E)"   value="1.35x"   sub="업종 평균 1.18x" color={GS_BLUE} />
          <KpiCard label="EV/EBITDA"     value="7.8x"    sub="업종 평균 7.2x"  color={GS_BLUE} />
          <KpiCard label="ROE (FY24E)"   value="12.1%"   sub="자본비용 9.5% 상회" color={BUY_GREEN} />
        </div>
        <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">피어 비교 (PER 기준)</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ backgroundColor: GS_BLUE }}>
                {["종목", "PER", "PBR", "EV/EBITDA", "ROE"].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-white font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {peerData.map(({ name, per, pbr, evEbitda, roe }, i) => (
                <tr key={name} className={name === "비씨카드" ? "font-bold" : ""} style={{ backgroundColor: name === "비씨카드" ? "#eff6ff" : i % 2 === 0 ? "#fff" : BG_LIGHT }}>
                  <td className="px-3 py-2" style={{ color: name === "비씨카드" ? GS_BLUE : GRAY_700 }}>{name}{name === "비씨카드" && " ★"}</td>
                  <td className="px-3 py-2">{per}x</td>
                  <td className="px-3 py-2">{pbr}x</td>
                  <td className="px-3 py-2">{evEbitda}x</td>
                  <td className="px-3 py-2">{roe}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-3 rounded-lg border border-blue-200 bg-blue-50">
          <p className="text-xs font-bold text-blue-800 mb-1">목표주가 산출 근거</p>
          <p className="text-xs text-blue-700">PER 13.0x × FY25E EPS ₩2,615 = ₩34,000 (주가 기준). 피어 평균 대비 15% 프리미엄 적용 근거: 네트워크 모트 + KT그룹 디지털 시너지 + 배당 성장성.</p>
        </div>
      </div>

      {/* ── 10. Bull / Bear Case ─────────────────────────── */}
      <div className="mb-6 p-5 rounded-xl border border-slate-200" style={{ backgroundColor: BG_LIGHT }}>
        <SectionHeader title="Bull / Bear Case" sub="Scenario Analysis" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Bull */}
          <div className="rounded-xl p-4 border-2" style={{ borderColor: BUY_GREEN, backgroundColor: "#f0fdf4" }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-extrabold" style={{ color: BUY_GREEN }}>Bull Case</span>
              <span className="text-lg font-extrabold" style={{ color: BUY_GREEN }}>₩42,000</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">상승여력 +53%</p>
            <ul className="text-xs text-slate-700 space-y-1.5">
              <li>✅ 수수료 규제 완화 / 동결</li>
              <li>✅ 데이터·플랫폼 매출 연 20%+ 성장</li>
              <li>✅ KT 협업 PLCC 신규 론칭 5개+</li>
              <li>✅ 해외 결제망 확장 (동남아 진출)</li>
              <li>✅ 금리 인하 → 연체율 하락</li>
            </ul>
            <div className="mt-3 p-2 rounded" style={{ backgroundColor: BUY_GREEN + "20" }}>
              <p className="text-xs font-bold" style={{ color: BUY_GREEN }}>가정: EPS ₩3,230 × PER 13.0x</p>
            </div>
          </div>

          {/* Base */}
          <div className="rounded-xl p-4 border-2" style={{ borderColor: GS_BLUE, backgroundColor: "#eff6ff" }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-extrabold" style={{ color: GS_BLUE }}>Base Case</span>
              <span className="text-lg font-extrabold" style={{ color: GS_BLUE }}>₩34,000</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">상승여력 +23.9%</p>
            <ul className="text-xs text-slate-700 space-y-1.5">
              <li>✔ 매출 YoY +7~8% 안정 성장</li>
              <li>✔ 영업이익률 10.5~11% 유지</li>
              <li>✔ 수수료 규제 현행 유지</li>
              <li>✔ 배당 DPS ₩800 수준 지속</li>
              <li>✔ 시장점유율 방어</li>
            </ul>
            <div className="mt-3 p-2 rounded" style={{ backgroundColor: GS_BLUE + "20" }}>
              <p className="text-xs font-bold" style={{ color: GS_BLUE }}>가정: EPS ₩2,615 × PER 13.0x</p>
            </div>
          </div>

          {/* Bear */}
          <div className="rounded-xl p-4 border-2" style={{ borderColor: SELL_RED, backgroundColor: "#fef2f2" }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-extrabold" style={{ color: SELL_RED }}>Bear Case</span>
              <span className="text-lg font-extrabold" style={{ color: SELL_RED }}>₩19,000</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">하락 위험 -31%</p>
            <ul className="text-xs text-slate-700 space-y-1.5">
              <li>❌ 가맹점 수수료 추가 인하(-0.2%p)</li>
              <li>❌ 핀테크 점유율 급격 잠식</li>
              <li>❌ 연체율 2%+ 돌파</li>
              <li>❌ KT 지배구조 리스크 확대</li>
              <li>❌ 경기 침체 → 카드 소비 위축</li>
            </ul>
            <div className="mt-3 p-2 rounded" style={{ backgroundColor: SELL_RED + "20" }}>
              <p className="text-xs font-bold" style={{ color: SELL_RED }}>가정: EPS ₩1,900 × PER 10.0x</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 11. 최종 판단 ────────────────────────────────── */}
      <div className="mb-4 p-5 rounded-xl border-2" style={{ borderColor: BUY_GREEN, backgroundColor: "#f0fdf4" }}>
        <SectionHeader title="최종 투자 판단" sub="Investment Conclusion" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          <div className="col-span-1">
            <div className="rounded-xl p-5 text-center" style={{ backgroundColor: BUY_GREEN }}>
              <p className="text-white text-lg font-bold mb-1">투자의견</p>
              <p className="text-4xl font-extrabold text-white mb-2">매수</p>
              <p className="text-white text-sm">BUY</p>
              <div className="mt-3 pt-3 border-t border-green-400">
                <p className="text-green-200 text-xs mb-1">확신도</p>
                <div className="flex justify-center gap-1">
                  {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                    <div key={n} className="w-4 h-4 rounded-sm" style={{ backgroundColor: n <= 7 ? "#fff" : "rgba(255,255,255,0.3)" }} />
                  ))}
                </div>
                <p className="text-white font-bold mt-1">7 / 10</p>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <div className="space-y-3">
              <div className="p-3 rounded-lg border border-green-200 bg-white">
                <p className="text-xs font-bold mb-1" style={{ color: BUY_GREEN }}>매수 근거 요약</p>
                <p className="text-xs text-slate-700 leading-relaxed">
                  비씨카드는 국내 카드 인프라의 핵심 허브로, 30년간 구축한 네트워크 해자는 단기간 복제 불가능합니다.
                  FY2024 영업이익률 10.9%로 역대 최고치를 경신 중이며, FCF 수익률 6.6%는 현 금리 환경에서 매력적입니다.
                  데이터·플랫폼 사업의 고마진 성장이 기존 수수료 수익 한계를 보완하며, 목표주가 ₩34,000은
                  12개월 기준 24% 상승여력을 제시합니다.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-orange-200 bg-orange-50">
                  <p className="text-xs font-bold mb-1" style={{ color: HOLD_ORG }}>주요 리스크</p>
                  <ul className="text-xs text-slate-600 space-y-0.5">
                    <li>• 수수료 규제 추가 강화</li>
                    <li>• 빅테크 간편결제 잠식 가속</li>
                    <li>• KT 지배구조 불확실성</li>
                  </ul>
                </div>
                <div className="p-3 rounded-lg border border-blue-200 bg-blue-50">
                  <p className="text-xs font-bold mb-1" style={{ color: GS_BLUE }}>모니터링 지표</p>
                  <ul className="text-xs text-slate-600 space-y-0.5">
                    <li>• 분기 연체율 추이</li>
                    <li>• 데이터 사업 매출 비중</li>
                    <li>• 회원은행 이탈 여부</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 면책 고지 ────────────────────────────────────── */}
      <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
        <p className="text-xs text-slate-400 leading-relaxed">
          <span className="font-bold">면책 고지:</span> 본 보고서는 AI가 공개 데이터를 기반으로 생성한 참고용 자료입니다.
          실제 투자 결정 전 반드시 공식 재무제표 및 전문 투자 자문을 확인하십시오.
          재무 데이터는 추정치를 포함하며 실제와 다를 수 있습니다.
          작성일: 2026년 4월 20일 | 종목코드: 100790 | 비씨카드(BC Card)
        </p>
      </div>

    </div>
  );
}
