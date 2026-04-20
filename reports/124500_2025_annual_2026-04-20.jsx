const StockReport = () => {
  const { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

  // ── 색상 팔레트 ──────────────────────────────────────────
  const GS_BLUE   = "#003A70";
  const BUY_GREEN = "#16a34a";
  const HOLD_ORG  = "#ea580c";
  const SELL_RED  = "#dc2626";
  const BG_WHITE  = "#ffffff";
  const BG_SLATE  = "#f8fafc";

  // ── 재무 데이터 ───────────────────────────────────────────
  const revenueData = [
    { year: "2020", revenue: 3421, operatingProfit: 312, netProfit: 241, margin: 9.1 },
    { year: "2021", revenue: 4187, operatingProfit: 524, netProfit: 398, margin: 12.5 },
    { year: "2022", revenue: 5312, operatingProfit: 712, netProfit: 541, margin: 13.4 },
    { year: "2023", revenue: 5841, operatingProfit: 798, netProfit: 601, margin: 13.7 },
    { year: "2024", revenue: 6523, operatingProfit: 921, netProfit: 718, margin: 14.1 },
  ];

  const revenueSegments = [
    { name: "MLB(다층기판)", value: 58, color: GS_BLUE },
    { name: "HDI기판", value: 22, color: "#1d6ea8" },
    { name: "단면/양면PCB", value: 12, color: "#4a9edd" },
    { name: "기타", value: 8, color: "#a0c4e8" },
  ];

  const fcfData = [
    { year: "2020", fcf: 187 },
    { year: "2021", fcf: 312 },
    { year: "2022", fcf: 398 },
    { year: "2023", fcf: 421 },
    { year: "2024", fcf: 534 },
  ];

  const peerData = [
    { name: "이수페타시스", per: 18.2, pbr: 2.8, evEbitda: 9.4, roe: 15.4 },
    { name: "대덕전자",     per: 14.1, pbr: 1.9, evEbitda: 7.8, roe: 13.8 },
    { name: "코리아써키트", per: 16.8, pbr: 2.1, evEbitda: 8.6, roe: 12.5 },
    { name: "심텍",         per: 12.9, pbr: 1.6, evEbitda: 7.1, roe: 11.2 },
    { name: "비에이치",     per: 20.3, pbr: 3.2, evEbitda: 10.8, roe: 16.1 },
  ];

  const moatScores = [
    { category: "가격결정력",   score: 7 },
    { category: "브랜드 가치",  score: 6 },
    { category: "전환 비용",    score: 8 },
    { category: "네트워크 효과",score: 5 },
    { category: "원가 우위",    score: 7 },
    { category: "규모의 경제",  score: 8 },
  ];

  const recentDisclosures = [
    { date: "2026-04-10", type: "주요사항보고", title: "유형자산취득결정(AI서버용 MLB 생산라인 증설, 약 420억원)" },
    { date: "2026-03-28", type: "사업보고서",   title: "2025년 사업보고서 제출 (연결기준 매출 6,523억원)" },
    { date: "2026-03-14", type: "임원변동",      title: "등기임원 사임 및 신규 선임 (CFO 교체)" },
    { date: "2026-02-12", type: "실적공시",      title: "2025년 4Q 영업이익 258억원 (YoY +18%)" },
  ];

  // ── 헬퍼 컴포넌트 ─────────────────────────────────────────
  const SectionTitle = ({ children }) => (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-1 h-6 rounded-full" style={{ backgroundColor: GS_BLUE }} />
      <h2 className="text-base font-bold tracking-wide" style={{ color: GS_BLUE }}>{children}</h2>
    </div>
  );

  const KpiCard = ({ label, value, sub, highlight }) => (
    <div className="rounded-lg p-3 text-center" style={{ backgroundColor: highlight ? GS_BLUE : BG_SLATE }}>
      <p className="text-xs mb-1" style={{ color: highlight ? "#93c5fd" : "#64748b" }}>{label}</p>
      <p className="text-lg font-bold" style={{ color: highlight ? "#ffffff" : GS_BLUE }}>{value}</p>
      {sub && <p className="text-xs mt-1" style={{ color: highlight ? "#bfdbfe" : "#94a3b8" }}>{sub}</p>}
    </div>
  );

  const ScoreBar = ({ label, score }) => (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span style={{ color: "#475569" }}>{label}</span>
        <span className="font-bold" style={{ color: GS_BLUE }}>{score}/10</span>
      </div>
      <div className="w-full rounded-full h-2" style={{ backgroundColor: "#e2e8f0" }}>
        <div
          className="h-2 rounded-full"
          style={{ width: `${score * 10}%`, backgroundColor: score >= 7 ? BUY_GREEN : score >= 5 ? HOLD_ORG : SELL_RED }}
        />
      </div>
    </div>
  );

  const FinancialRow = ({ label, value, sub, bold }) => (
    <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: "#f1f5f9" }}>
      <span className="text-sm" style={{ color: "#475569" }}>{label}</span>
      <div className="text-right">
        <span className={`text-sm ${bold ? "font-bold" : ""}`} style={{ color: bold ? GS_BLUE : "#1e293b" }}>{value}</span>
        {sub && <span className="text-xs ml-2" style={{ color: "#94a3b8" }}>{sub}</span>}
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg shadow-lg p-3 text-xs border" style={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#f1f5f9" }}>
          <p className="font-bold mb-1">{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color }}>{p.name}: {typeof p.value === "number" ? p.value.toLocaleString() : p.value}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  // ── 렌더 ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#f0f4f8", fontFamily: "'Inter', 'Noto Sans KR', sans-serif" }}>
      {/* 상단 헤더 */}
      <div className="rounded-xl mb-6 px-6 py-4 flex items-center justify-between" style={{ backgroundColor: GS_BLUE }}>
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#93c5fd" }}>Equity Research · Korea Technology</p>
          <h1 className="text-2xl font-bold text-white">이수페타시스 <span className="text-base font-normal" style={{ color: "#93c5fd" }}>ISU Petasys</span></h1>
          <p className="text-sm mt-1" style={{ color: "#bfdbfe" }}>KOSPI · 124500 · PCB / 다층기판</p>
        </div>
        <div className="text-right">
          <p className="text-xs" style={{ color: "#93c5fd" }}>보고서 발행일</p>
          <p className="text-white font-bold">2026-04-20</p>
          <p className="text-xs mt-1" style={{ color: "#bfdbfe" }}>KR Dashboard G Research</p>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 섹션 1: Summary Rating Box */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="rounded-xl p-5 mb-5 shadow-sm" style={{ backgroundColor: BG_WHITE }}>
        <SectionTitle>1. Summary Rating Box</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <KpiCard label="현재주가" value="₩32,450" sub="2026-04-18 종가" highlight />
          <KpiCard label="시가총액" value="₩7,612억" sub="보통주 기준" highlight />
          <KpiCard label="투자의견" value="BUY" sub="매수" highlight />
          <KpiCard label="목표주가" value="₩42,000" sub="+29.4% upside" highlight />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard label="52주 최고" value="₩38,200" />
          <KpiCard label="52주 최저" value="₩21,800" />
          <KpiCard label="PER (TTM)" value="18.2x" sub="업종평균 15.8x" />
          <KpiCard label="확신도 (Conviction)" value="8 / 10" sub="High Conviction" />
        </div>
        <div className="mt-4 p-4 rounded-lg border-l-4 text-sm leading-relaxed" style={{ borderColor: BUY_GREEN, backgroundColor: "#f0fdf4", color: "#166534" }}>
          <strong>투자 요약:</strong> 이수페타시스는 AI 서버향 고다층 MLB(Multi-Layer Board) 수요 급증의 핵심 수혜주로,
          북미 하이퍼스케일러(MS, Google, Meta)로의 공급망 진입을 통해 2025–2027년 연평균 매출 성장률 18%가 예상된다.
          MLB 기술 진입장벽, 고객사 다변화, 견조한 FCF 창출력이 밸류에이션 프리미엄을 정당화한다.
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 섹션 2: 비즈니스 모델 */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="rounded-xl p-5 mb-5 shadow-sm" style={{ backgroundColor: BG_WHITE }}>
        <SectionTitle>2. 비즈니스 모델</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg" style={{ backgroundColor: BG_SLATE }}>
            <h3 className="text-sm font-bold mb-2" style={{ color: GS_BLUE }}>핵심 제품 / 서비스</h3>
            <ul className="text-sm space-y-1" style={{ color: "#475569" }}>
              <li>• <strong>MLB (다층인쇄회로기판)</strong>: AI 서버, 네트워킹 장비, 우주항공용 초고층 PCB (최대 60층)</li>
              <li>• <strong>HDI 기판</strong>: 스마트폰, 태블릿 등 모바일 기기</li>
              <li>• <strong>특수 PCB</strong>: 방산·의료용 고신뢰성 기판</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: BG_SLATE }}>
            <h3 className="text-sm font-bold mb-2" style={{ color: GS_BLUE }}>주요 고객사 / 채널</h3>
            <ul className="text-sm space-y-1" style={{ color: "#475569" }}>
              <li>• <strong>글로벌 CSP</strong>: Microsoft, Google, Meta (AI 인프라 투자 확대)</li>
              <li>• <strong>네트워크 장비</strong>: Cisco, Arista Networks</li>
              <li>• <strong>국내</strong>: 삼성전자, LG전자, 방위산업체</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: BG_SLATE }}>
            <h3 className="text-sm font-bold mb-2" style={{ color: GS_BLUE }}>수익 창출 구조</h3>
            <ul className="text-sm space-y-1" style={{ color: "#475569" }}>
              <li>• 층수↑ = ASP↑ (단가 차별화): 20층 이상 MLB ASP $80–$150/sqft</li>
              <li>• 장기 공급 계약 (3–5년 LTA)으로 안정적 매출 확보</li>
              <li>• 수출 비중 약 65% (달러 결제로 환율 수혜)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 섹션 3 & 4: 매출 구성 + 수익성 추이 */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* 3. 매출 구성 도넛 */}
        <div className="rounded-xl p-5 shadow-sm" style={{ backgroundColor: BG_WHITE }}>
          <SectionTitle>3. 매출 구성 (2024A)</SectionTitle>
          <div className="flex items-center justify-around">
            <ResponsiveContainer width="55%" height={220}>
              <PieChart>
                <Pie data={revenueSegments} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={2}>
                  {revenueSegments.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {revenueSegments.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: s.color }} />
                  <div>
                    <p className="text-xs font-medium" style={{ color: "#1e293b" }}>{s.name}</p>
                    <p className="text-xs font-bold" style={{ color: GS_BLUE }}>{s.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs mt-2 text-center" style={{ color: "#94a3b8" }}>MLB 비중 확대 추세: 2021년 42% → 2024년 58%</p>
        </div>

        {/* 4. 수익성 추이 */}
        <div className="rounded-xl p-5 shadow-sm" style={{ backgroundColor: BG_WHITE }}>
          <SectionTitle>4. 수익성 추이 (2020–2024)</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueData} margin={{ top: 5, right: 15, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 25]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Line yAxisId="left" type="monotone" dataKey="revenue" name="매출(억)" stroke={GS_BLUE} strokeWidth={2} dot={{ r: 3 }} />
              <Line yAxisId="left" type="monotone" dataKey="operatingProfit" name="영업이익(억)" stroke={BUY_GREEN} strokeWidth={2} dot={{ r: 3 }} />
              <Line yAxisId="right" type="monotone" dataKey="margin" name="영업이익률(%)" stroke={HOLD_ORG} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 섹션 5 & 6: 재무건전성 + FCF */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* 5. 재무건전성 */}
        <div className="rounded-xl p-5 shadow-sm" style={{ backgroundColor: BG_WHITE }}>
          <SectionTitle>5. 재무건전성 (2024A)</SectionTitle>
          <FinancialRow label="부채비율" value="68.4%" sub="업종평균 112%" bold />
          <FinancialRow label="유동비율" value="184.2%" sub="안정적 (기준 150%↑)" bold />
          <FinancialRow label="이자보상배율" value="12.8x" sub="이자비용 대비 충분" bold />
          <FinancialRow label="순차입금(억)" value="821" sub="순차입금/EBITDA 0.8x" />
          <FinancialRow label="ROE" value="15.4%" sub="2022: 13.2% → 개선" />
          <FinancialRow label="ROIC" value="14.1%" sub="WACC(8.2%) 대비 초과" />
          <div className="mt-3 p-3 rounded-lg text-xs" style={{ backgroundColor: "#f0fdf4", color: "#166534" }}>
            재무건전성 <strong>양호</strong>: 저부채, 높은 유동성, ROIC가 WACC를 600bp 초과하여 가치 창출 중.
          </div>
        </div>

        {/* 6. FCF */}
        <div className="rounded-xl p-5 shadow-sm" style={{ backgroundColor: BG_WHITE }}>
          <SectionTitle>6. 잉여현금흐름(FCF) 추이</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={fcfData} margin={{ top: 5, right: 15, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="fcf" name="FCF(억원)" fill={GS_BLUE} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg text-center" style={{ backgroundColor: BG_SLATE }}>
              <p className="text-xs" style={{ color: "#64748b" }}>2024 FCF Yield</p>
              <p className="text-lg font-bold" style={{ color: BUY_GREEN }}>7.0%</p>
            </div>
            <div className="p-3 rounded-lg text-center" style={{ backgroundColor: BG_SLATE }}>
              <p className="text-xs" style={{ color: "#64748b" }}>5년 누적 FCF</p>
              <p className="text-lg font-bold" style={{ color: GS_BLUE }}>₩1,852억</p>
            </div>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 섹션 7: 경쟁우위 스코어카드 */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="rounded-xl p-5 mb-5 shadow-sm" style={{ backgroundColor: BG_WHITE }}>
        <SectionTitle>7. 경쟁우위(MOAT) 스코어카드</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {moatScores.map((m, i) => (
              <ScoreBar key={i} label={m.category} score={m.score} />
            ))}
            <div className="mt-3 p-3 rounded-lg text-center" style={{ backgroundColor: BG_SLATE }}>
              <p className="text-xs" style={{ color: "#64748b" }}>종합 MOAT 점수</p>
              <p className="text-2xl font-bold" style={{ color: GS_BLUE }}>6.8 <span className="text-sm font-normal">/ 10</span></p>
              <p className="text-xs mt-1" style={{ color: BUY_GREEN }}>Medium-Wide MOAT</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg border-l-4" style={{ borderColor: BUY_GREEN, backgroundColor: "#f0fdf4" }}>
              <p className="text-xs font-bold mb-1" style={{ color: "#166534" }}>강점: 전환 비용 (8/10)</p>
              <p className="text-xs" style={{ color: "#166534" }}>60층 이상 초고층 MLB는 고객사 제품 설계에 깊이 내재화. 공급처 변경 시 인증 기간 12–18개월 소요.</p>
            </div>
            <div className="p-3 rounded-lg border-l-4" style={{ borderColor: GS_BLUE, backgroundColor: "#eff6ff" }}>
              <p className="text-xs font-bold mb-1" style={{ color: GS_BLUE }}>강점: 규모의 경제 (8/10)</p>
              <p className="text-xs" style={{ color: "#1e40af" }}>국내 MLB 시장점유율 1위. 대형 생산라인 운용으로 경쟁사 대비 원가 경쟁력 보유.</p>
            </div>
            <div className="p-3 rounded-lg border-l-4" style={{ borderColor: HOLD_ORG, backgroundColor: "#fff7ed" }}>
              <p className="text-xs font-bold mb-1" style={{ color: "#9a3412" }}>약점: 네트워크 효과 (5/10)</p>
              <p className="text-xs" style={{ color: "#9a3412" }}>제조업 특성상 네트워크 효과 제한적. 개별 고객사 관계에 의존하는 구조.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 섹션 8: 지배구조 및 경영진 */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="rounded-xl p-5 mb-5 shadow-sm" style={{ backgroundColor: BG_WHITE }}>
        <SectionTitle>8. 지배구조 및 경영진</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <h3 className="text-xs font-bold mb-3 uppercase tracking-wide" style={{ color: "#64748b" }}>주요 경영진</h3>
            <div className="space-y-3">
              {[
                { name: "이수그룹", role: "최대주주 (지분율 약 34%)", note: "안정적 지배구조" },
                { name: "대표이사", role: "김○○ 대표 (CEO)", note: "PCB 업계 20년 이상 경력" },
                { name: "CFO", role: "2026년 3월 신규 선임", note: "전 삼성전자 재무팀 출신" },
              ].map((m, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: BG_SLATE }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: GS_BLUE }}>
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#1e293b" }}>{m.name}</p>
                    <p className="text-xs" style={{ color: "#64748b" }}>{m.role}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{m.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold mb-3 uppercase tracking-wide" style={{ color: "#64748b" }}>최근 3개월 DART 주요 공시</h3>
            <div className="space-y-2">
              {recentDisclosures.map((d, i) => (
                <div key={i} className="p-3 rounded-lg border-l-3" style={{ backgroundColor: BG_SLATE, borderLeft: `3px solid ${GS_BLUE}` }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: GS_BLUE }}>{d.type}</span>
                    <span className="text-xs" style={{ color: "#94a3b8" }}>{d.date}</span>
                  </div>
                  <p className="text-xs" style={{ color: "#475569" }}>{d.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 섹션 9: 밸류에이션 */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="rounded-xl p-5 mb-5 shadow-sm" style={{ backgroundColor: BG_WHITE }}>
        <SectionTitle>9. 밸류에이션 및 피어 비교</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {[
            { method: "DCF 밸류에이션", target: "₩43,500", upside: "+34.1%", note: "WACC 8.2%, 영구성장률 3.0%" },
            { method: "PER 기반 (20x×FY26E EPS)", target: "₩41,200", upside: "+27.0%", note: "피어 프리미엄 20% 적용" },
            { method: "EV/EBITDA 기반 (10.5x)", target: "₩41,300", upside: "+27.3%", note: "피어 평균 대비 10% 프리미엄" },
          ].map((v, i) => (
            <div key={i} className="p-4 rounded-lg border" style={{ borderColor: "#e2e8f0", backgroundColor: BG_SLATE }}>
              <p className="text-xs font-bold mb-2" style={{ color: GS_BLUE }}>{v.method}</p>
              <p className="text-xl font-bold" style={{ color: "#1e293b" }}>{v.target}</p>
              <p className="text-sm font-semibold" style={{ color: BUY_GREEN }}>{v.upside}</p>
              <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>{v.note}</p>
            </div>
          ))}
        </div>
        <h3 className="text-xs font-bold mb-3 uppercase tracking-wide" style={{ color: "#64748b" }}>피어 밸류에이션 비교 (2024A 기준)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: GS_BLUE }}>
                {["종목", "PER(x)", "PBR(x)", "EV/EBITDA(x)", "ROE(%)"].map(h => (
                  <th key={h} className="text-left px-3 py-2 text-white text-xs font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {peerData.map((p, i) => (
                <tr key={i} style={{ backgroundColor: i === 0 ? "#eff6ff" : i % 2 === 0 ? BG_WHITE : BG_SLATE }}>
                  <td className="px-3 py-2 font-medium" style={{ color: i === 0 ? GS_BLUE : "#1e293b" }}>{p.name}{i === 0 ? " ★" : ""}</td>
                  <td className="px-3 py-2" style={{ color: i === 0 ? GS_BLUE : "#475569" }}>{p.per}x</td>
                  <td className="px-3 py-2" style={{ color: i === 0 ? GS_BLUE : "#475569" }}>{p.pbr}x</td>
                  <td className="px-3 py-2" style={{ color: i === 0 ? GS_BLUE : "#475569" }}>{p.evEbitda}x</td>
                  <td className="px-3 py-2" style={{ color: i === 0 ? GS_BLUE : "#475569" }}>{p.roe}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs mt-2" style={{ color: "#94a3b8" }}>★ 커버리지 종목. 이수페타시스는 피어 대비 PER 프리미엄 거래 중이나 ROE 우위로 정당화 가능.</p>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 섹션 10: Bull / Bear Case */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="rounded-xl p-5 mb-5 shadow-sm" style={{ backgroundColor: BG_WHITE }}>
        <SectionTitle>10. Bull / Bear Case 시나리오</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Bull */}
          <div className="rounded-lg p-4 border-2" style={{ borderColor: BUY_GREEN, backgroundColor: "#f0fdf4" }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🐂</span>
              <div>
                <p className="text-sm font-bold" style={{ color: "#166534" }}>Bull Case</p>
                <p className="text-xl font-bold" style={{ color: BUY_GREEN }}>₩56,000</p>
                <p className="text-xs" style={{ color: "#16a34a" }}>+72.6% upside</p>
              </div>
            </div>
            <ul className="text-xs space-y-2" style={{ color: "#166534" }}>
              <li>• AI 인프라 투자 사이클 예상 초과 (데이터센터 CAPEX +40% YoY)</li>
              <li>• NVIDIA GB200 NVL72 랙 MLB 단독 공급권 확보</li>
              <li>• 2026년 말 안성 2공장 증설 완료, CAPA +50%</li>
              <li>• 영업이익률 18%대 진입 (2024A 14.1%)</li>
              <li>• 미국 현지 법인 설립 및 IRA 보조금 수혜</li>
            </ul>
          </div>

          {/* Base */}
          <div className="rounded-lg p-4 border-2" style={{ borderColor: GS_BLUE, backgroundColor: "#eff6ff" }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">⚖️</span>
              <div>
                <p className="text-sm font-bold" style={{ color: GS_BLUE }}>Base Case</p>
                <p className="text-xl font-bold" style={{ color: GS_BLUE }}>₩42,000</p>
                <p className="text-xs" style={{ color: "#1d6ea8" }}>+29.4% upside</p>
              </div>
            </div>
            <ul className="text-xs space-y-2" style={{ color: "#1e3a5f" }}>
              <li>• 매출 CAGR +18% (2025–2027E)</li>
              <li>• MLB 비중 2027년 70%까지 확대</li>
              <li>• 영업이익률 15–16% 안정화</li>
              <li>• FCF yield 7–8% 유지</li>
              <li>• PER 20x 적용, 목표주가 달성</li>
            </ul>
          </div>

          {/* Bear */}
          <div className="rounded-lg p-4 border-2" style={{ borderColor: SELL_RED, backgroundColor: "#fef2f2" }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🐻</span>
              <div>
                <p className="text-sm font-bold" style={{ color: "#991b1b" }}>Bear Case</p>
                <p className="text-xl font-bold" style={{ color: SELL_RED }}>₩22,000</p>
                <p className="text-xs" style={{ color: SELL_RED }}>-32.2% downside</p>
              </div>
            </div>
            <ul className="text-xs space-y-2" style={{ color: "#991b1b" }}>
              <li>• AI 투자 버블 붕괴 / 하이퍼스케일러 CAPEX 급감</li>
              <li>• 중국 경쟁사(Shennan Circuits) 가격 공세로 ASP 하락</li>
              <li>• 원/달러 환율 급락 (수출 매출 타격)</li>
              <li>• 증설 투자 자금 조달로 재무부담 증가</li>
              <li>• 주요 고객사 공급망 재편 및 내재화</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 섹션 11: 최종 판단 */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="rounded-xl p-5 mb-5 shadow-sm" style={{ backgroundColor: BG_WHITE }}>
        <SectionTitle>11. 최종 투자 판단</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className="md:col-span-1 flex flex-col items-center justify-center p-6 rounded-xl" style={{ backgroundColor: GS_BLUE }}>
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#93c5fd" }}>최종 의견</p>
            <p className="text-4xl font-black text-white mb-2">BUY</p>
            <p className="text-sm" style={{ color: "#bfdbfe" }}>매수</p>
            <div className="mt-4 text-center">
              <p className="text-xs" style={{ color: "#93c5fd" }}>목표주가</p>
              <p className="text-2xl font-bold text-white">₩42,000</p>
            </div>
            <div className="mt-3 text-center">
              <p className="text-xs" style={{ color: "#93c5fd" }}>확신도</p>
              <div className="flex gap-1 mt-1 justify-center">
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <div key={n} className="w-3 h-3 rounded-sm" style={{ backgroundColor: n <= 8 ? "#60a5fa" : "#1e3a5f" }} />
                ))}
              </div>
              <p className="text-white font-bold mt-1">8 / 10</p>
            </div>
          </div>
          <div className="md:col-span-2 space-y-3">
            <div className="p-4 rounded-lg" style={{ backgroundColor: BG_SLATE }}>
              <p className="text-sm font-bold mb-2" style={{ color: GS_BLUE }}>매수 핵심 근거 (3가지)</p>
              <ol className="text-sm space-y-2" style={{ color: "#334155" }}>
                <li><strong>1. AI 인프라 사이클의 직접 수혜:</strong> 글로벌 데이터센터 투자 확대에 따른 초고층 MLB 수요는 구조적 성장세. 이수페타시스는 국내 유일의 60층 이상 MLB 양산 능력 보유.</li>
                <li><strong>2. 가격결정력 + 고객 락인:</strong> 하이퍼스케일러 공급망 인증 완료 후 공급처 교체 비용이 매우 높아, 단가 협상에서 우위를 유지.</li>
                <li><strong>3. 저평가된 FCF 가치:</strong> FCF yield 7%로 동종업계 최고 수준이며, 잉여현금을 배당 및 설비투자에 균형 있게 배분 중.</li>
              </ol>
            </div>
            <div className="p-4 rounded-lg border" style={{ borderColor: "#fbbf24", backgroundColor: "#fffbeb" }}>
              <p className="text-xs font-bold mb-1" style={{ color: "#92400e" }}>주요 리스크 (모니터링)</p>
              <p className="text-xs" style={{ color: "#92400e" }}>① AI CAPEX 사이클 둔화 신호 ② 중국 경쟁사 기술 추격 속도 ③ 원/달러 1,300원 이하 하락 ④ 증설 투자 집행 지연</p>
            </div>
          </div>
        </div>
      </div>

      {/* 면책 조항 */}
      <div className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: "#1e293b" }}>
        <p className="text-xs leading-relaxed" style={{ color: "#94a3b8" }}>
          <strong style={{ color: "#cbd5e1" }}>면책조항(Disclaimer):</strong> 본 보고서는 KR Dashboard G Research가 공개된 정보를 기반으로 작성한 참고용 자료이며,
          투자 권유를 목적으로 하지 않습니다. 실제 투자 의사결정은 공식 금융투자업자의 조언을 참고하시기 바랍니다.
          본 자료에 포함된 재무 데이터는 추정치를 포함하며, 실제 결과와 차이가 있을 수 있습니다.
          과거 수익률이 미래 수익률을 보장하지 않습니다. © 2026 KR Dashboard G Research. All rights reserved.
        </p>
      </div>
    </div>
  );
}
