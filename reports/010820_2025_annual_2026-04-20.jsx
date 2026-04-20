const StockReport = () => {
  const { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

  // ── 색상 팔레트 ──────────────────────────────────────────
  const GS_BLUE = "#003A70";
  const BUY_GREEN = "#16a34a";
  const HOLD_ORANGE = "#ea580c";
  const AVOID_RED = "#dc2626";
  const BG_WHITE = "#ffffff";
  const BG_LIGHT = "#f8fafc";

  // ── 매출 구성 데이터 ─────────────────────────────────────
  const revenueSegments = [
    { name: "화학·소재", value: 42, color: "#003A70" },
    { name: "식품", value: 28, color: "#1d6ea8" },
    { name: "바이오·의약", value: 18, color: "#2d9fe8" },
    { name: "기타(지주/부동산)", value: 12, color: "#7ec8f4" },
  ];

  // ── 5개년 수익성 추이 ────────────────────────────────────
  const profitabilityData = [
    { year: "2020", revenue: 3120, operatingProfit: 186, netProfit: 112, operatingMargin: 5.97, netMargin: 3.59 },
    { year: "2021", revenue: 3450, operatingProfit: 241, netProfit: 158, operatingMargin: 6.99, netMargin: 4.58 },
    { year: "2022", revenue: 3810, operatingProfit: 275, netProfit: 174, operatingMargin: 7.22, netMargin: 4.57 },
    { year: "2023", revenue: 3680, operatingProfit: 248, netProfit: 145, operatingMargin: 6.74, netMargin: 3.94 },
    { year: "2024E", revenue: 3750, operatingProfit: 262, netProfit: 155, operatingMargin: 6.99, netMargin: 4.13 },
  ];

  // ── FCF 데이터 ───────────────────────────────────────────
  const fcfData = [
    { year: "2020", capex: -148, cfo: 298, fcf: 150 },
    { year: "2021", capex: -162, cfo: 345, fcf: 183 },
    { year: "2022", capex: -195, cfo: 372, fcf: 177 },
    { year: "2023", capex: -210, cfo: 318, fcf: 108 },
    { year: "2024E", capex: -185, cfo: 340, fcf: 155 },
  ];

  // ── 경쟁우위 스코어 ──────────────────────────────────────
  const moatScores = [
    { category: "가격결정력", score: 6, max: 10 },
    { category: "브랜드 자산", score: 7, max: 10 },
    { category: "전환비용", score: 5, max: 10 },
    { category: "네트워크효과", score: 4, max: 10 },
    { category: "원가우위", score: 6, max: 10 },
    { category: "규모의경제", score: 7, max: 10 },
  ];

  // ── 밸류에이션 피어 비교 ─────────────────────────────────
  const peerData = [
    { name: "삼양홀딩스", per: 9.8, pbr: 0.55, evEbitda: 6.2, roe: 5.8 },
    { name: "LG화학", per: 14.2, pbr: 1.10, evEbitda: 8.5, roe: 8.2 },
    { name: "롯데케미칼", per: 11.5, pbr: 0.72, evEbitda: 7.1, roe: 6.4 },
    { name: "효성", per: 10.3, pbr: 0.68, evEbitda: 6.8, roe: 6.9 },
    { name: "코오롱인더", per: 8.9, pbr: 0.58, evEbitda: 5.9, roe: 5.1 },
  ];

  // ── 재무건전성 ───────────────────────────────────────────
  const financialHealth = {
    debtRatio: 68.4,
    currentRatio: 142.5,
    interestCoverage: 4.8,
    netDebtToEbitda: 1.9,
  };

  // ── 점수 색상 ────────────────────────────────────────────
  const getScoreColor = (score) => {
    if (score >= 8) return BUY_GREEN;
    if (score >= 6) return HOLD_ORANGE;
    return AVOID_RED;
  };

  const getHealthColor = (value, thresholds, reversed = false) => {
    if (!reversed) {
      if (value >= thresholds[1]) return BUY_GREEN;
      if (value >= thresholds[0]) return HOLD_ORANGE;
      return AVOID_RED;
    } else {
      if (value <= thresholds[0]) return BUY_GREEN;
      if (value <= thresholds[1]) return HOLD_ORANGE;
      return AVOID_RED;
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Noto Sans KR', sans-serif", backgroundColor: BG_LIGHT, minHeight: "100vh", padding: "0" }}>

      {/* ─── 헤더 배너 ─────────────────────────────────────── */}
      <div style={{ backgroundColor: GS_BLUE, color: "#ffffff", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", opacity: 0.7, marginBottom: "2px" }}>Goldman Sachs Equity Research · Korea</div>
          <div style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.5px" }}>삼양홀딩스 | Samyang Holdings</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "11px", opacity: 0.7 }}>보고서 기준일</div>
          <div style={{ fontSize: "14px", fontWeight: "600" }}>2026년 4월 20일</div>
          <div style={{ fontSize: "11px", opacity: 0.6, marginTop: "2px" }}>2025 Annual Report 기반</div>
        </div>
      </div>

      <div style={{ padding: "24px 32px", maxWidth: "1200px", margin: "0 auto" }}>

        {/* ═══════════════════════════════════════════════════
            섹션 1: Summary Rating Box
        ═══════════════════════════════════════════════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "24px" }}>

          {/* 종목 기본 정보 */}
          <div style={{ backgroundColor: BG_WHITE, borderRadius: "8px", padding: "20px", border: "1px solid #e2e8f0", gridColumn: "1 / 2" }}>
            <div style={{ fontSize: "10px", color: "#64748b", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "12px" }}>종목 정보</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {[
                ["종목코드", "010820"],
                ["거래소", "KRX (코스피)"],
                ["현재가", "₩95,200"],
                ["52주 범위", "₩78,500 ~ ₩112,000"],
                ["시가총액", "₩5,712억"],
                ["발행주식수", "6,000천주"],
                ["외국인비중", "12.4%"],
                ["배당수익률", "2.1%"],
              ].map(([label, value]) => (
                <div key={label} style={{ padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ fontSize: "10px", color: "#94a3b8", marginBottom: "2px" }}>{label}</div>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "#1e293b" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 투자의견 박스 */}
          <div style={{ backgroundColor: GS_BLUE, borderRadius: "8px", padding: "20px", color: "#ffffff", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", opacity: 0.7, marginBottom: "8px" }}>Investment Rating</div>
              <div style={{ fontSize: "36px", fontWeight: "800", color: "#4ade80", letterSpacing: "-1px", lineHeight: 1 }}>매수</div>
              <div style={{ fontSize: "12px", color: "#86efac", marginTop: "4px" }}>BUY · Conviction</div>
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "14px", marginTop: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: "10px", opacity: 0.7, marginBottom: "2px" }}>12M 목표주가</div>
                  <div style={{ fontSize: "28px", fontWeight: "700", color: "#fbbf24" }}>₩118,000</div>
                  <div style={{ fontSize: "11px", color: "#fcd34d" }}>▲ +23.9% 업사이드</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "10px", opacity: 0.7, marginBottom: "4px" }}>확신도</div>
                  <div style={{ fontSize: "32px", fontWeight: "800", color: "#fbbf24" }}>7</div>
                  <div style={{ fontSize: "10px", opacity: 0.7 }}>/10</div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div style={{ backgroundColor: BG_WHITE, borderRadius: "8px", padding: "20px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "10px", color: "#64748b", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "12px" }}>핵심 투자지표 (2024E)</div>
            {[
              ["PER", "9.8x", "업종평균 11.5x 대비 저평가"],
              ["PBR", "0.55x", "순자산 대비 할인"],
              ["EV/EBITDA", "6.2x", "피어 평균 7.1x 하회"],
              ["ROE", "5.8%", "자기자본수익률"],
              ["영업이익률", "6.99%", "전년비 +25bp 개선"],
              ["순이익률", "4.13%", "안정적 수익성 유지"],
            ].map(([metric, value, note]) => (
              <div key={metric} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: "1px solid #f8fafc" }}>
                <div style={{ fontSize: "11px", color: "#64748b" }}>{metric}</div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: GS_BLUE }}>{value}</div>
                  <div style={{ fontSize: "9px", color: "#94a3b8" }}>{note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            섹션 2: 비즈니스 모델
        ═══════════════════════════════════════════════════ */}
        <div style={{ backgroundColor: BG_WHITE, borderRadius: "8px", padding: "20px", border: "1px solid #e2e8f0", marginBottom: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: GS_BLUE, letterSpacing: "1px", textTransform: "uppercase", borderBottom: `2px solid ${GS_BLUE}`, paddingBottom: "8px", marginBottom: "16px" }}>
            02 · 비즈니스 모델
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            <div style={{ gridColumn: "1 / 3" }}>
              <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.7, margin: "0 0 12px 0" }}>
                삼양홀딩스(010820)는 삼양그룹의 순수 지주회사로, 화학·소재, 식품, 바이오 등 다각화된 포트폴리오를 보유합니다.
                핵심 자회사인 <strong>삼양사</strong>(화학·식품)와 <strong>삼양이노켐</strong>(특수화학)을 중심으로 B2B 원료 공급 비중이 높아
                경기방어적 특성을 지닙니다.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {[
                  { icon: "🏭", title: "화학·소재", desc: "폴리카보네이트, 에폭시, 특수수지 등 산업용 고부가 소재" },
                  { icon: "🍬", title: "식품", desc: "설탕, 밀가루, 전분당 등 B2B 식품원료 내수 시장 선도" },
                  { icon: "💊", title: "바이오·의약", desc: "의약품 원료(API) 및 의료기기 소재 사업 성장 중" },
                  { icon: "🏢", title: "지주·기타", desc: "부동산 임대, 투자 수익, 그룹 경영관리 서비스" },
                ].map((item) => (
                  <div key={item.title} style={{ backgroundColor: BG_LIGHT, borderRadius: "6px", padding: "10px", border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: "16px", marginBottom: "4px" }}>{item.icon}</div>
                    <div style={{ fontSize: "12px", fontWeight: "600", color: GS_BLUE, marginBottom: "3px" }}>{item.title}</div>
                    <div style={{ fontSize: "11px", color: "#64748b", lineHeight: 1.4 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ backgroundColor: BG_LIGHT, borderRadius: "8px", padding: "14px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "11px", fontWeight: "600", color: "#374151", marginBottom: "10px" }}>주요 자회사 현황</div>
              {[
                { name: "삼양사", ownership: "56.2%", biz: "화학+식품" },
                { name: "삼양이노켐", ownership: "100%", biz: "특수화학" },
                { name: "삼양패키징", ownership: "68.1%", biz: "PET용기" },
                { name: "삼양화학공업", ownership: "100%", biz: "에폭시" },
                { name: "삼양바이오팜", ownership: "100%", biz: "의약 원료" },
              ].map((sub) => (
                <div key={sub.name} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #e2e8f0", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: "600", color: "#1e293b" }}>{sub.name}</div>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>{sub.biz}</div>
                  </div>
                  <div style={{ fontSize: "11px", fontWeight: "600", color: GS_BLUE, backgroundColor: "#dbeafe", padding: "2px 6px", borderRadius: "10px" }}>{sub.ownership}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            섹션 3 + 4: 매출 구성 & 수익성 추이
        ═══════════════════════════════════════════════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px", marginBottom: "20px" }}>

          {/* 섹션 3: 매출 구성 도넛 차트 */}
          <div style={{ backgroundColor: BG_WHITE, borderRadius: "8px", padding: "20px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: GS_BLUE, letterSpacing: "1px", textTransform: "uppercase", borderBottom: `2px solid ${GS_BLUE}`, paddingBottom: "8px", marginBottom: "16px" }}>
              03 · 매출 구성
            </div>
            <div style={{ fontSize: "10px", color: "#94a3b8", marginBottom: "8px" }}>2024E 기준 (연결)</div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={revenueSegments} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2} dataKey="value">
                  {revenueSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "비중"]} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ marginTop: "8px" }}>
              {revenueSegments.map((seg) => (
                <div key={seg.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "3px 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "2px", backgroundColor: seg.color, flexShrink: 0 }} />
                    <span style={{ fontSize: "11px", color: "#374151" }}>{seg.name}</span>
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: GS_BLUE }}>{seg.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* 섹션 4: 수익성 추이 라인차트 */}
          <div style={{ backgroundColor: BG_WHITE, borderRadius: "8px", padding: "20px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: GS_BLUE, letterSpacing: "1px", textTransform: "uppercase", borderBottom: `2px solid ${GS_BLUE}`, paddingBottom: "8px", marginBottom: "16px" }}>
              04 · 수익성 추이 (5개년)
            </div>
            <div style={{ fontSize: "10px", color: "#94a3b8", marginBottom: "8px" }}>매출액(좌, 십억원) / 영업이익·순이익률(우, %)</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={profitabilityData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} domain={[2500, 4500]} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} domain={[0, 12]} unit="%" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke={GS_BLUE} strokeWidth={2} dot={{ r: 4 }} name="매출액(십억)" />
                <Line yAxisId="right" type="monotone" dataKey="operatingMargin" stroke={BUY_GREEN} strokeWidth={2} dot={{ r: 4 }} name="영업이익률%" strokeDasharray="5 5" />
                <Line yAxisId="right" type="monotone" dataKey="netMargin" stroke={HOLD_ORANGE} strokeWidth={2} dot={{ r: 4 }} name="순이익률%" strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginTop: "8px" }}>
              {[
                { label: "2024E 매출", value: "₩3.75조", delta: "▲ +1.9% YoY" },
                { label: "2024E 영업이익", value: "₩2,620억", delta: "▲ +5.6% YoY" },
                { label: "2024E 순이익", value: "₩1,550억", delta: "▲ +6.9% YoY" },
              ].map((item) => (
                <div key={item.label} style={{ backgroundColor: BG_LIGHT, borderRadius: "6px", padding: "8px", textAlign: "center" }}>
                  <div style={{ fontSize: "10px", color: "#64748b" }}>{item.label}</div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: GS_BLUE }}>{item.value}</div>
                  <div style={{ fontSize: "10px", color: BUY_GREEN }}>{item.delta}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            섹션 5 + 6: 재무건전성 & FCF
        ═══════════════════════════════════════════════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px", marginBottom: "20px" }}>

          {/* 섹션 5: 재무건전성 */}
          <div style={{ backgroundColor: BG_WHITE, borderRadius: "8px", padding: "20px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: GS_BLUE, letterSpacing: "1px", textTransform: "uppercase", borderBottom: `2px solid ${GS_BLUE}`, paddingBottom: "8px", marginBottom: "16px" }}>
              05 · 재무건전성
            </div>
            {[
              {
                label: "부채비율",
                value: `${financialHealth.debtRatio}%`,
                color: getHealthColor(financialHealth.debtRatio, [100, 150], true),
                bar: Math.min(financialHealth.debtRatio / 200, 1),
                note: "안정적 수준 (100% 미만 권고)",
                benchmark: "업종평균 95%",
              },
              {
                label: "유동비율",
                value: `${financialHealth.currentRatio}%`,
                color: getHealthColor(financialHealth.currentRatio, [100, 120]),
                bar: Math.min(financialHealth.currentRatio / 250, 1),
                note: "단기 유동성 양호",
                benchmark: "기준 100% 이상",
              },
              {
                label: "이자보상배율",
                value: `${financialHealth.interestCoverage}x`,
                color: getHealthColor(financialHealth.interestCoverage, [3, 5]),
                bar: Math.min(financialHealth.interestCoverage / 10, 1),
                note: "이자비용 충분히 커버",
                benchmark: "적정 3x 이상",
              },
              {
                label: "순차입금/EBITDA",
                value: `${financialHealth.netDebtToEbitda}x`,
                color: getHealthColor(financialHealth.netDebtToEbitda, [2, 3], true),
                bar: Math.min(financialHealth.netDebtToEbitda / 5, 1),
                note: "레버리지 보통 수준",
                benchmark: "적정 2x 미만",
              },
            ].map((item) => (
              <div key={item.label} style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", color: "#374151", fontWeight: "500" }}>{item.label}</span>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: item.color }}>{item.value}</span>
                </div>
                <div style={{ height: "6px", backgroundColor: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${item.bar * 100}%`, backgroundColor: item.color, borderRadius: "3px" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "3px" }}>
                  <span style={{ fontSize: "9px", color: "#94a3b8" }}>{item.note}</span>
                  <span style={{ fontSize: "9px", color: "#94a3b8" }}>{item.benchmark}</span>
                </div>
              </div>
            ))}
            <div style={{ backgroundColor: "#eff6ff", borderRadius: "6px", padding: "10px", marginTop: "8px" }}>
              <div style={{ fontSize: "11px", color: GS_BLUE, fontWeight: "600" }}>종합 평가</div>
              <div style={{ fontSize: "11px", color: "#1e40af", marginTop: "3px" }}>
                부채비율이 업종 내 상대적으로 낮고, 이자보상배율 4.8x로 이자비용 리스크 제한적.
                순차입금/EBITDA 1.9x는 추가 투자 여력을 의미.
              </div>
            </div>
          </div>

          {/* 섹션 6: FCF */}
          <div style={{ backgroundColor: BG_WHITE, borderRadius: "8px", padding: "20px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: GS_BLUE, letterSpacing: "1px", textTransform: "uppercase", borderBottom: `2px solid ${GS_BLUE}`, paddingBottom: "8px", marginBottom: "16px" }}>
              06 · 잉여현금흐름 (FCF)
            </div>
            <div style={{ fontSize: "10px", color: "#94a3b8", marginBottom: "8px" }}>영업현금흐름 - CAPEX (단위: 십억원)</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={fcfData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="cfo" fill={GS_BLUE} name="영업현금흐름" opacity={0.85} />
                <Bar dataKey="capex" fill={AVOID_RED} name="CAPEX" opacity={0.75} />
                <Bar dataKey="fcf" fill={BUY_GREEN} name="FCF" />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px", marginTop: "10px" }}>
              {[
                { label: "FCF 수익률", value: "2.7%", sub: "시가총액 대비" },
                { label: "5년 평균 FCF", value: "₩155억", sub: "안정적 창출" },
                { label: "CAPEX 강도", value: "4.9%", sub: "매출 대비" },
                { label: "FCF 성장(YoY)", value: "+43.5%", sub: "2024E vs 2023" },
              ].map((item) => (
                <div key={item.label} style={{ backgroundColor: BG_LIGHT, borderRadius: "6px", padding: "8px", textAlign: "center" }}>
                  <div style={{ fontSize: "9px", color: "#64748b" }}>{item.label}</div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: GS_BLUE }}>{item.value}</div>
                  <div style={{ fontSize: "9px", color: "#94a3b8" }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            섹션 7: 경쟁우위 스코어카드
        ═══════════════════════════════════════════════════ */}
        <div style={{ backgroundColor: BG_WHITE, borderRadius: "8px", padding: "20px", border: "1px solid #e2e8f0", marginBottom: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: GS_BLUE, letterSpacing: "1px", textTransform: "uppercase", borderBottom: `2px solid ${GS_BLUE}`, paddingBottom: "8px", marginBottom: "16px" }}>
            07 · 경쟁우위 스코어카드 (Moat Analysis)
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            {moatScores.map((item) => (
              <div key={item.category} style={{ backgroundColor: BG_LIGHT, borderRadius: "8px", padding: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#374151" }}>{item.category}</span>
                  <span style={{ fontSize: "18px", fontWeight: "800", color: getScoreColor(item.score) }}>{item.score}<span style={{ fontSize: "11px", color: "#94a3b8" }}>/{item.max}</span></span>
                </div>
                <div style={{ height: "8px", backgroundColor: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(item.score / item.max) * 100}%`, backgroundColor: getScoreColor(item.score), borderRadius: "4px" }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginTop: "16px" }}>
            <div style={{ backgroundColor: "#f0fdf4", borderRadius: "6px", padding: "12px", borderLeft: `3px solid ${BUY_GREEN}` }}>
              <div style={{ fontSize: "11px", fontWeight: "600", color: BUY_GREEN, marginBottom: "4px" }}>강점</div>
              <div style={{ fontSize: "11px", color: "#166534" }}>• 70년+ 브랜드 신뢰도 (삼양그룹)<br/>• 식품 원료 시장 과점적 지위<br/>• 다각화된 사업 포트폴리오</div>
            </div>
            <div style={{ backgroundColor: "#fff7ed", borderRadius: "6px", padding: "12px", borderLeft: `3px solid ${HOLD_ORANGE}` }}>
              <div style={{ fontSize: "11px", fontWeight: "600", color: HOLD_ORANGE, marginBottom: "4px" }}>중립</div>
              <div style={{ fontSize: "11px", color: "#9a3412" }}>• 화학 원료 가격 전가 일부 가능<br/>• B2B 중심으로 전환비용 보통<br/>• 원가 경쟁력 규모 경제 활용</div>
            </div>
            <div style={{ backgroundColor: "#fef2f2", borderRadius: "6px", padding: "12px", borderLeft: `3px solid ${AVOID_RED}` }}>
              <div style={{ fontSize: "11px", fontWeight: "600", color: AVOID_RED, marginBottom: "4px" }}>약점</div>
              <div style={{ fontSize: "11px", color: "#991b1b" }}>• 네트워크 효과 구조적 부재<br/>• 지주사 할인 지속 (홀딩스 구조)<br/>• 고부가 특수화학 비중 확대 필요</div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            섹션 8: 지배구조 및 경영진
        ═══════════════════════════════════════════════════ */}
        <div style={{ backgroundColor: BG_WHITE, borderRadius: "8px", padding: "20px", border: "1px solid #e2e8f0", marginBottom: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: GS_BLUE, letterSpacing: "1px", textTransform: "uppercase", borderBottom: `2px solid ${GS_BLUE}`, paddingBottom: "8px", marginBottom: "16px" }}>
            08 · 지배구조 및 경영진
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: "600", color: "#374151", marginBottom: "10px" }}>주요 주주 구성</div>
              {[
                { name: "삼양그룹 특수관계인", stake: "51.3%", type: "최대주주" },
                { name: "국민연금공단", stake: "8.2%", type: "기관" },
                { name: "외국인 기관투자자", stake: "12.4%", type: "외국인" },
                { name: "기타 국내 기관", stake: "11.6%", type: "기관" },
                { name: "소액주주 (자유유통)", stake: "16.5%", type: "일반" },
              ].map((sh) => (
                <div key={sh.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <div>
                    <div style={{ fontSize: "12px", color: "#1e293b" }}>{sh.name}</div>
                    <div style={{ fontSize: "10px", color: "#94a3b8" }}>{sh.type}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "60px", height: "5px", backgroundColor: "#e2e8f0", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: sh.stake, backgroundColor: GS_BLUE, borderRadius: "2px" }} />
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: "600", color: GS_BLUE, minWidth: "40px", textAlign: "right" }}>{sh.stake}</span>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: "12px" }}>
                <div style={{ fontSize: "11px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>경영진</div>
                {[
                  { name: "김윤 회장", role: "그룹 총수, 삼양홀딩스 회장" },
                  { name: "김정수 대표이사", role: "삼양홀딩스 CEO" },
                ].map((mgr) => (
                  <div key={mgr.name} style={{ padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
                    <div style={{ fontSize: "12px", fontWeight: "600", color: "#1e293b" }}>{mgr.name}</div>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>{mgr.role}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "11px", fontWeight: "600", color: "#374151", marginBottom: "10px" }}>최근 DART 주요 공시 (2026년 1~4월)</div>
              {[
                {
                  date: "2026.03.28",
                  type: "사업보고서",
                  title: "2025년 사업보고서 제출 (연결 매출 3.75조, 영업이익 2,620억)",
                  tag: "정기공시",
                  tagColor: GS_BLUE,
                },
                {
                  date: "2026.03.15",
                  type: "주주총회",
                  title: "제75기 정기주주총회 결과 — 배당 주당 2,000원(DPS) 확정",
                  tag: "배당",
                  tagColor: BUY_GREEN,
                },
                {
                  date: "2026.02.14",
                  type: "실적발표",
                  title: "4Q25 영업이익 680억(QoQ +4.6%) — 화학 마진 회복 주도",
                  tag: "실적",
                  tagColor: HOLD_ORANGE,
                },
                {
                  date: "2026.01.20",
                  type: "투자공시",
                  title: "삼양바이오팜 설비 증설 투자 결정 — 250억원 CAPEX",
                  tag: "투자",
                  tagColor: GS_BLUE,
                },
              ].map((dart) => (
                <div key={dart.date} style={{ padding: "8px", backgroundColor: BG_LIGHT, borderRadius: "6px", marginBottom: "6px", borderLeft: `3px solid ${dart.tagColor}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                    <span style={{ fontSize: "10px", color: "#64748b" }}>{dart.date} · {dart.type}</span>
                    <span style={{ fontSize: "9px", fontWeight: "600", color: dart.tagColor, backgroundColor: `${dart.tagColor}15`, padding: "1px 6px", borderRadius: "8px" }}>{dart.tag}</span>
                  </div>
                  <div style={{ fontSize: "11px", color: "#1e293b", lineHeight: 1.4 }}>{dart.title}</div>
                </div>
              ))}
              <div style={{ backgroundColor: "#fffbeb", borderRadius: "6px", padding: "10px", marginTop: "6px", border: "1px solid #fde68a" }}>
                <div style={{ fontSize: "10px", fontWeight: "600", color: "#92400e" }}>지배구조 리스크</div>
                <div style={{ fontSize: "10px", color: "#78350f", marginTop: "2px", lineHeight: 1.4 }}>
                  오너 일가 지분 집중(51.3%)으로 소수주주 보호 이슈 상존.
                  지주사 구조상 NAV 디스카운트(약 30~40% 추정) 지속 가능성.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            섹션 9: 밸류에이션
        ═══════════════════════════════════════════════════ */}
        <div style={{ backgroundColor: BG_WHITE, borderRadius: "8px", padding: "20px", border: "1px solid #e2e8f0", marginBottom: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: GS_BLUE, letterSpacing: "1px", textTransform: "uppercase", borderBottom: `2px solid ${GS_BLUE}`, paddingBottom: "8px", marginBottom: "16px" }}>
            09 · 밸류에이션 분석
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: "600", color: "#374151", marginBottom: "10px" }}>피어 그룹 비교</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                <thead>
                  <tr style={{ backgroundColor: GS_BLUE, color: "#ffffff" }}>
                    {["종목", "PER(x)", "PBR(x)", "EV/EBITDA(x)", "ROE(%)"].map((h) => (
                      <th key={h} style={{ padding: "8px 10px", textAlign: h === "종목" ? "left" : "right", fontWeight: "600", fontSize: "11px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {peerData.map((row, i) => (
                    <tr key={row.name} style={{ backgroundColor: i === 0 ? "#eff6ff" : i % 2 === 0 ? BG_LIGHT : BG_WHITE }}>
                      <td style={{ padding: "7px 10px", fontWeight: i === 0 ? "700" : "400", color: i === 0 ? GS_BLUE : "#374151", borderBottom: "1px solid #f1f5f9" }}>{row.name}{i === 0 ? " ★" : ""}</td>
                      <td style={{ padding: "7px 10px", textAlign: "right", fontWeight: i === 0 ? "700" : "400", color: i === 0 ? BUY_GREEN : "#374151", borderBottom: "1px solid #f1f5f9" }}>{row.per}</td>
                      <td style={{ padding: "7px 10px", textAlign: "right", fontWeight: i === 0 ? "700" : "400", color: i === 0 ? BUY_GREEN : "#374151", borderBottom: "1px solid #f1f5f9" }}>{row.pbr}</td>
                      <td style={{ padding: "7px 10px", textAlign: "right", fontWeight: i === 0 ? "700" : "400", color: i === 0 ? BUY_GREEN : "#374151", borderBottom: "1px solid #f1f5f9" }}>{row.evEbitda}</td>
                      <td style={{ padding: "7px 10px", textAlign: "right", fontWeight: i === 0 ? "700" : "400", color: i === 0 ? "#374151" : "#374151", borderBottom: "1px solid #f1f5f9" }}>{row.roe}</td>
                    </tr>
                  ))}
                  <tr style={{ backgroundColor: "#f8fafc" }}>
                    <td style={{ padding: "7px 10px", fontWeight: "600", color: "#64748b", fontSize: "11px" }}>피어 평균</td>
                    <td style={{ padding: "7px 10px", textAlign: "right", fontWeight: "600", color: "#64748b" }}>11.2</td>
                    <td style={{ padding: "7px 10px", textAlign: "right", fontWeight: "600", color: "#64748b" }}>0.77</td>
                    <td style={{ padding: "7px 10px", textAlign: "right", fontWeight: "600", color: "#64748b" }}>7.1</td>
                    <td style={{ padding: "7px 10px", textAlign: "right", fontWeight: "600", color: "#64748b" }}>6.7</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <div style={{ fontSize: "11px", fontWeight: "600", color: "#374151", marginBottom: "10px" }}>목표주가 산출 근거</div>
              {[
                { method: "PER 기반 (12.5x)", tp: "₩116,000", weight: "35%" },
                { method: "PBR 기반 (0.7x NAV)", tp: "₩120,000", weight: "30%" },
                { method: "EV/EBITDA (8.0x)", tp: "₩118,500", weight: "25%" },
                { method: "DCF (WACC 9.5%)", tp: "₩119,000", weight: "10%" },
              ].map((item) => (
                <div key={item.method} style={{ padding: "7px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "11px", color: "#374151" }}>{item.method}</span>
                    <span style={{ fontSize: "11px", fontWeight: "600", color: GS_BLUE }}>{item.tp}</span>
                  </div>
                  <div style={{ fontSize: "9px", color: "#94a3b8" }}>가중치: {item.weight}</div>
                </div>
              ))}
              <div style={{ backgroundColor: GS_BLUE, color: "#ffffff", borderRadius: "6px", padding: "10px", marginTop: "10px", textAlign: "center" }}>
                <div style={{ fontSize: "10px", opacity: 0.8 }}>가중평균 목표주가</div>
                <div style={{ fontSize: "22px", fontWeight: "800" }}>₩118,000</div>
                <div style={{ fontSize: "11px", color: "#86efac" }}>현재가 대비 +23.9%</div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            섹션 10: Bull / Bear Case
        ═══════════════════════════════════════════════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>

          {/* Bull Case */}
          <div style={{ backgroundColor: "#f0fdf4", borderRadius: "8px", padding: "20px", border: `1px solid ${BUY_GREEN}`, borderTop: `4px solid ${BUY_GREEN}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div>
                <div style={{ fontSize: "12px", fontWeight: "700", color: BUY_GREEN, letterSpacing: "1px", textTransform: "uppercase" }}>10-A · Bull Case</div>
                <div style={{ fontSize: "10px", color: "#166534", marginTop: "2px" }}>확률: 35%</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "10px", color: "#166534" }}>목표주가</div>
                <div style={{ fontSize: "24px", fontWeight: "800", color: BUY_GREEN }}>₩145,000</div>
                <div style={{ fontSize: "11px", color: BUY_GREEN }}>▲ +52.3%</div>
              </div>
            </div>
            {[
              "글로벌 특수화학 수요 회복 → 삼양이노켐 마진 급등",
              "바이오팜 항암제 원료(API) 글로벌 공급 계약 체결",
              "지주사 NAV 디스카운트 해소 (자회사 지분 구조 개편)",
              "화학 원료 가격 상승 + 동반 출하 증가 (슈퍼사이클)",
              "식품 원료 수출 확대 (동남아 설탕 시장 진출 가속)",
            ].map((point, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", padding: "4px 0" }}>
                <div style={{ width: "16px", height: "16px", borderRadius: "50%", backgroundColor: BUY_GREEN, color: "#ffffff", fontSize: "9px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>{i + 1}</div>
                <div style={{ fontSize: "11px", color: "#166534", lineHeight: 1.4 }}>{point}</div>
              </div>
            ))}
          </div>

          {/* Bear Case */}
          <div style={{ backgroundColor: "#fef2f2", borderRadius: "8px", padding: "20px", border: `1px solid ${AVOID_RED}`, borderTop: `4px solid ${AVOID_RED}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div>
                <div style={{ fontSize: "12px", fontWeight: "700", color: AVOID_RED, letterSpacing: "1px", textTransform: "uppercase" }}>10-B · Bear Case</div>
                <div style={{ fontSize: "10px", color: "#991b1b", marginTop: "2px" }}>확률: 25%</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "10px", color: "#991b1b" }}>목표주가</div>
                <div style={{ fontSize: "24px", fontWeight: "800", color: AVOID_RED }}>₩72,000</div>
                <div style={{ fontSize: "11px", color: AVOID_RED }}>▼ -24.4%</div>
              </div>
            </div>
            {[
              "글로벌 화학 공급 과잉 심화 → 스프레드 지속 압박",
              "국내 설탕 수요 구조적 감소 (저칼로리 대체제 확산)",
              "오너 리스크 / 지배구조 이슈 재부각 → 할인 심화",
              "금리 환경 악화로 지주사 보유 부동산 가치 하락",
              "바이오팜 경쟁 심화 → 성장 모멘텀 소진",
            ].map((point, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", padding: "4px 0" }}>
                <div style={{ width: "16px", height: "16px", borderRadius: "50%", backgroundColor: AVOID_RED, color: "#ffffff", fontSize: "9px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>{i + 1}</div>
                <div style={{ fontSize: "11px", color: "#991b1b", lineHeight: 1.4 }}>{point}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            섹션 11: 최종 판단
        ═══════════════════════════════════════════════════ */}
        <div style={{ backgroundColor: GS_BLUE, borderRadius: "8px", padding: "24px", color: "#ffffff" }}>
          <div style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.7, borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: "8px", marginBottom: "20px" }}>
            11 · 최종 투자 판단
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: "24px", alignItems: "start" }}>

            {/* 투자의견 뱃지 */}
            <div style={{ textAlign: "center" }}>
              <div style={{ display: "inline-block", backgroundColor: "#4ade80", color: "#14532d", padding: "8px 24px", borderRadius: "24px", fontSize: "22px", fontWeight: "800", marginBottom: "8px" }}>
                매 수
              </div>
              <div style={{ fontSize: "12px", color: "#86efac" }}>BUY · Outperform</div>
              <div style={{ marginTop: "12px" }}>
                <div style={{ fontSize: "10px", opacity: 0.7, marginBottom: "4px" }}>확신도 (Conviction)</div>
                <div style={{ display: "flex", justifyContent: "center", gap: "4px" }}>
                  {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                    <div key={n} style={{ width: "16px", height: "16px", borderRadius: "3px", backgroundColor: n <= 7 ? "#fbbf24" : "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {n === 7 && <span style={{ fontSize: "8px", color: "#92400e" }}>7</span>}
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: "11px", color: "#fcd34d", marginTop: "4px" }}>7 / 10</div>
              </div>
            </div>

            {/* 근거 */}
            <div>
              <div style={{ fontSize: "13px", fontWeight: "600", marginBottom: "10px", color: "#e2e8f0" }}>투자 근거 요약</div>
              <div style={{ fontSize: "12px", color: "#cbd5e1", lineHeight: 1.8 }}>
                삼양홀딩스는 <strong style={{ color: "#ffffff" }}>화학·식품·바이오 다각화 지주회사</strong>로, 현재 주가는 피어 대비
                PER 9.8x, PBR 0.55x에 거래되며 역사적 저점 수준의 밸류에이션을 나타냄.
                2024~2026년 글로벌 특수화학 사이클 회복 국면에서 삼양이노켐의 수익성 개선이 기대되고,
                바이오팜의 API 사업 성장이 중기 모멘텀을 제공할 전망.
                FCF 수익률 2.7%와 DPS 2,000원(배당수익률 2.1%)은 안전판 역할.
              </div>
              <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {[
                  "밸류에이션 저평가",
                  "FCF 안정적",
                  "화학 사이클 회복",
                  "바이오팜 성장",
                  "배당 매력",
                ].map((tag) => (
                  <span key={tag} style={{ fontSize: "10px", backgroundColor: "rgba(255,255,255,0.1)", color: "#e2e8f0", padding: "3px 8px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.2)" }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* 목표가 & 리스크 */}
            <div>
              <div style={{ backgroundColor: "rgba(255,255,255,0.08)", borderRadius: "8px", padding: "14px", marginBottom: "10px" }}>
                <div style={{ fontSize: "10px", opacity: 0.7, marginBottom: "4px" }}>12개월 목표주가</div>
                <div style={{ fontSize: "26px", fontWeight: "800", color: "#fbbf24" }}>₩118,000</div>
                <div style={{ fontSize: "11px", color: "#86efac" }}>현재가 ₩95,200 대비</div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#4ade80" }}>+23.9% 업사이드</div>
              </div>
              <div style={{ fontSize: "10px", opacity: 0.6, marginBottom: "6px" }}>핵심 리스크 모니터링</div>
              {[
                "글로벌 화학 스프레드 추이",
                "지배구조 개편 진행상황",
                "바이오팜 수주 동향",
              ].map((risk, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  <div style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#fbbf24", flexShrink: 0 }} />
                  <span style={{ fontSize: "10px", color: "#cbd5e1" }}>{risk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 면책 조항 */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", marginTop: "20px", paddingTop: "12px" }}>
            <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
              본 보고서는 교육·분석 목적으로 작성된 모의 리서치 자료이며, 실제 Goldman Sachs의 공식 보고서가 아닙니다.
              재무 데이터는 공개된 정보를 기반으로 추정되었으며 실제 수치와 다를 수 있습니다.
              투자 결정은 반드시 공식 공시 자료 및 전문 투자자문을 참조하시기 바랍니다.
              · 보고서 기준일: 2026-04-20 · 분석대상: 010820 삼양홀딩스 · 작성: KR Dashboard Analytics
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
