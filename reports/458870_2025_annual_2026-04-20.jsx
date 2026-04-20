const StockReport = () => {
  const { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } = Recharts;

  // ─── 색상 팔레트 ───
  const GS_BLUE = "#003A70";
  const BUY_GREEN = "#16a34a";
  const HOLD_ORANGE = "#ea580c";
  const SELL_RED = "#dc2626";
  const ACCENT = "#0066B3";
  const LIGHT_BG = "#f8fafc";

  // ─── 1. 수익성 추이 데이터 (2020~2024) ───
  const profitData = [
    { year: "2020", revenue: 3821, operating: 312, netIncome: 198, opm: 8.2 },
    { year: "2021", revenue: 4156, operating: 389, netIncome: 267, opm: 9.4 },
    { year: "2022", revenue: 5203, operating: 521, netIncome: 378, opm: 10.0 },
    { year: "2023", revenue: 6872, operating: 812, netIncome: 598, opm: 11.8 },
    { year: "2024E", revenue: 8450, operating: 1073, netIncome: 794, opm: 12.7 },
  ];

  // ─── 2. 매출 구성 (도넛 차트) ───
  const revenueBreakdown = [
    { name: "선박 A/S 및 유지보수", value: 42, color: GS_BLUE },
    { name: "친환경 개조·전환", value: 28, color: ACCENT },
    { name: "디지털·스마트솔루션", value: 18, color: "#0099CC" },
    { name: "기타 서비스", value: 12, color: "#99C2E0" },
  ];

  // ─── 3. FCF 데이터 ───
  const fcfData = [
    { year: "2020", fcf: 142, capex: -89 },
    { year: "2021", fcf: 201, capex: -112 },
    { year: "2022", fcf: 298, capex: -134 },
    { year: "2023", fcf: 487, capex: -158 },
    { year: "2024E", fcf: 612, capex: -187 },
  ];

  // ─── 4. 밸류에이션 피어 비교 ───
  const peerData = [
    { name: "HD현대마린솔루션", per: 18.2, pbr: 3.8, evEbitda: 11.4, roe: 22.1 },
    { name: "한화오션(서비스)", per: 22.1, pbr: 2.1, evEbitda: 13.8, roe: 9.8 },
    { name: "삼성중공업(A/S)", per: 25.3, pbr: 1.8, evEbitda: 15.2, roe: 7.3 },
    { name: "Wärtsilä(FIN)", per: 24.7, pbr: 4.2, evEbitda: 14.1, roe: 18.6 },
    { name: "MAN Energy(GER)", per: 16.8, pbr: 3.1, evEbitda: 10.2, roe: 19.4 },
  ];

  // ─── 5. 경쟁우위 스코어카드 ───
  const moatScores = [
    { category: "가격결정력", score: 7.5, max: 10 },
    { category: "브랜드 가치", score: 8.0, max: 10 },
    { category: "전환비용", score: 8.5, max: 10 },
    { category: "네트워크효과", score: 6.5, max: 10 },
    { category: "원가우위", score: 7.0, max: 10 },
    { category: "규모의 경제", score: 7.8, max: 10 },
  ];

  // ─── 6. 재무건전성 ───
  const balanceData = [
    { metric: "부채비율", value: 68.3, benchmark: 100, unit: "%" },
    { metric: "유동비율", value: 142.7, benchmark: 100, unit: "%" },
    { metric: "이자보상배율", value: 18.4, benchmark: 3, unit: "x" },
    { metric: "순부채비율", value: -12.1, benchmark: 0, unit: "%" },
  ];

  // ─── 공통 스타일 ───
  const sectionStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    border: `1px solid #e2e8f0`,
    padding: "20px",
    marginBottom: "16px",
  };

  const headerStyle = {
    color: GS_BLUE,
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    borderBottom: `2px solid ${GS_BLUE}`,
    paddingBottom: "8px",
    marginBottom: "16px",
  };

  // ─── 스코어바 컴포넌트 ───
  const ScoreBar = ({ score, max = 10, color = GS_BLUE }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%" }}>
      <div style={{ flex: 1, backgroundColor: "#e2e8f0", borderRadius: "4px", height: "8px" }}>
        <div
          style={{
            width: `${(score / max) * 100}%`,
            backgroundColor: color,
            borderRadius: "4px",
            height: "100%",
          }}
        />
      </div>
      <span style={{ fontSize: "13px", fontWeight: "700", color: GS_BLUE, minWidth: "28px" }}>
        {score}
      </span>
    </div>
  );

  // ─── 메트릭 카드 ───
  const MetricCard = ({ label, value, sub, color = GS_BLUE }) => (
    <div
      style={{
        backgroundColor: LIGHT_BG,
        borderRadius: "6px",
        padding: "12px 16px",
        border: "1px solid #e2e8f0",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px" }}>
        {label}
      </div>
      <div style={{ fontSize: "20px", fontWeight: "800", color }}>{value}</div>
      {sub && <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "2px" }}>{sub}</div>}
    </div>
  );

  const CUSTOM_TOOLTIP_STYLE = {
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    padding: "8px 12px",
    fontSize: "12px",
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        backgroundColor: LIGHT_BG,
        minHeight: "100vh",
        padding: "0",
      }}
    >
      {/* ══════════════════════════════════════
          헤더 배너
      ══════════════════════════════════════ */}
      <div
        style={{
          backgroundColor: GS_BLUE,
          padding: "16px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ color: "#ffffff", fontSize: "10px", letterSpacing: "0.15em", fontWeight: "600" }}>
            EQUITY RESEARCH · KOREA INDUSTRIALS
          </div>
          <div style={{ color: "#ffffff", fontSize: "22px", fontWeight: "800", marginTop: "2px" }}>
            HD현대마린솔루션
          </div>
          <div style={{ color: "#99C2E0", fontSize: "12px" }}>
            KRX: 458870 · 조선/해운 서비스
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              backgroundColor: BUY_GREEN,
              color: "#fff",
              padding: "6px 20px",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "800",
              letterSpacing: "0.05em",
              marginBottom: "4px",
            }}
          >
            매수 (BUY)
          </div>
          <div style={{ color: "#99C2E0", fontSize: "11px" }}>목표주가 ₩145,000</div>
          <div style={{ color: "#ccd9e5", fontSize: "10px" }}>리포트일: 2026-04-20</div>
        </div>
      </div>

      <div style={{ padding: "20px 32px" }}>

        {/* ══════════════════════════════════════
            섹션 1: Summary Rating Box
        ══════════════════════════════════════ */}
        <div style={{ ...sectionStyle, borderLeft: `4px solid ${BUY_GREEN}` }}>
          <div style={headerStyle}>① SUMMARY RATING BOX</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "16px" }}>
            <MetricCard label="현재가" value="₩105,500" sub="2026-04-18 종가" color={GS_BLUE} />
            <MetricCard label="시가총액" value="₩4.22조" sub="보통주 기준" color={GS_BLUE} />
            <MetricCard label="목표주가" value="₩145,000" sub="상승여력 +37.4%" color={BUY_GREEN} />
            <MetricCard label="확신도" value="8 / 10" sub="High Conviction" color={BUY_GREEN} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
            <MetricCard label="52주 고가" value="₩138,000" color="#64748b" />
            <MetricCard label="52주 저가" value="₩82,500" color="#64748b" />
            <MetricCard label="일평균거래량" value="42.3만주" sub="20일 평균" color="#64748b" />
            <MetricCard label="투자의견" value="BUY" sub="신규 커버리지" color={BUY_GREEN} />
          </div>
          <div
            style={{
              marginTop: "16px",
              padding: "12px 16px",
              backgroundColor: "#f0f9f4",
              borderRadius: "6px",
              border: "1px solid #bbf7d0",
              fontSize: "12px",
              color: "#166534",
              lineHeight: "1.6",
            }}
          >
            <strong>핵심 투자 논거:</strong> HD현대마린솔루션은 글로벌 상선 A/S·LCM(Life Cycle Management) 시장의 구조적 성장 수혜주로, IMO 탄소규제 강화에 따른 친환경 개조 수요 폭증이 중기 성장 엔진으로 작동하고 있습니다. 그룹사 조선3사와의 수직계열화로 형성된 폐쇄적 수주망과 높은 전환비용이 지속적 초과수익(ROIC 21%)을 가능케 합니다.
          </div>
        </div>

        {/* ══════════════════════════════════════
            섹션 2: 비즈니스 모델
        ══════════════════════════════════════ */}
        <div style={sectionStyle}>
          <div style={headerStyle}>② 비즈니스 모델 (Business Model)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "13px", color: "#334155", lineHeight: "1.7", marginBottom: "12px" }}>
                HD현대마린솔루션(HMS)은 2023년 4월 HD현대그룹에서 분할 상장한 <strong>선박 LCM(Life-Cycle Management) 전문 기업</strong>입니다. 건조 이후 20~30년의 운항 기간 동안 발생하는 모든 유지보수·성능 개선·디지털화 수요를 원스톱으로 대응합니다.
              </p>
              <div style={{ backgroundColor: LIGHT_BG, borderRadius: "6px", padding: "12px", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "12px", fontWeight: "700", color: GS_BLUE, marginBottom: "8px" }}>비즈니스 흐름도</div>
                {[
                  { step: "01", title: "신조 인도", desc: "HD현대 조선3사 인도선 즉시 서비스 계약" },
                  { step: "02", title: "정기 A/S", desc: "입거수리, 부품 공급, 기술지원" },
                  { step: "03", title: "친환경 개조", desc: "LNG·암모니아·스크러버 탈황장치 설치" },
                  { step: "04", title: "디지털화", desc: "HIPO(선박 IoT) 솔루션, 원격진단" },
                ].map((item) => (
                  <div key={item.step} style={{ display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }}>
                    <div
                      style={{
                        backgroundColor: GS_BLUE,
                        color: "#fff",
                        borderRadius: "4px",
                        padding: "2px 6px",
                        fontSize: "10px",
                        fontWeight: "700",
                        whiteSpace: "nowrap",
                        marginTop: "1px",
                      }}
                    >
                      {item.step}
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: "700", color: "#1e293b" }}>{item.title}</div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ backgroundColor: LIGHT_BG, borderRadius: "6px", padding: "12px", border: "1px solid #e2e8f0", marginBottom: "12px" }}>
                <div style={{ fontSize: "12px", fontWeight: "700", color: GS_BLUE, marginBottom: "8px" }}>핵심 경쟁우위</div>
                {[
                  { icon: "🔗", title: "그룹사 연계 수주망", desc: "HD한국조선해양·현대중공업·현대미포조선 인도선 자동 유입" },
                  { icon: "🌍", title: "글로벌 서비스망", desc: "전 세계 60여 개 항구 네트워크, 현지 자회사 보유" },
                  { icon: "📊", title: "데이터 자산", desc: "2만여 척 운항 데이터 기반 예측정비(PdM) 서비스" },
                  { icon: "⚖️", title: "규제 수혜", desc: "IMO CII·EEXI 규제로 친환경 개조 수요 구조적 성장" },
                ].map((item) => (
                  <div key={item.title} style={{ display: "flex", gap: "8px", marginBottom: "10px", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "16px" }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: "700", color: "#1e293b" }}>{item.title}</div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            섹션 3: 매출 구성 (도넛 차트)
        ══════════════════════════════════════ */}
        <div style={sectionStyle}>
          <div style={headerStyle}>③ 매출 구성 (Revenue Breakdown, 2024E)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "center" }}>
            <div style={{ height: "240px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {revenueBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={CUSTOM_TOOLTIP_STYLE}
                    formatter={(value) => [`${value}%`, "비중"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              {revenueBreakdown.map((item) => (
                <div
                  key={item.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "3px",
                        backgroundColor: item.color,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: "12px", color: "#334155" }}>{item.name}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "80px", backgroundColor: "#e2e8f0", borderRadius: "3px", height: "6px" }}>
                      <div style={{ width: `${item.value}%`, backgroundColor: item.color, borderRadius: "3px", height: "100%" }} />
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: GS_BLUE, minWidth: "32px" }}>
                      {item.value}%
                    </span>
                  </div>
                </div>
              ))}
              <div
                style={{
                  marginTop: "12px",
                  padding: "10px",
                  backgroundColor: "#eff6ff",
                  borderRadius: "6px",
                  fontSize: "11px",
                  color: "#1e40af",
                  lineHeight: "1.5",
                }}
              >
                <strong>주목:</strong> 친환경 개조 부문이 2022년 14%→2024E 28%로 2년 만에 2배 확장. IMO 규제 시행 본격화로 2026~2027년 추가 가속 전망.
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            섹션 4: 수익성 추이 (라인 차트 5년)
        ══════════════════════════════════════ */}
        <div style={sectionStyle}>
          <div style={headerStyle}>④ 수익성 추이 (2020~2024E)</div>
          <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "20px" }}>
            <div style={{ height: "220px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={profitData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}억`} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} domain={[0, 20]} />
                  <Tooltip
                    contentStyle={CUSTOM_TOOLTIP_STYLE}
                    formatter={(value, name) => {
                      if (name === "OPM(%)") return [`${value}%`, name];
                      return [`${value}억원`, name];
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" name="매출액" stroke={GS_BLUE} strokeWidth={2} dot={{ r: 4, fill: GS_BLUE }} />
                  <Line yAxisId="left" type="monotone" dataKey="operating" name="영업이익" stroke={BUY_GREEN} strokeWidth={2} dot={{ r: 4, fill: BUY_GREEN }} />
                  <Line yAxisId="right" type="monotone" dataKey="opm" name="OPM(%)" stroke={HOLD_ORANGE} strokeWidth={2} strokeDasharray="4 2" dot={{ r: 4, fill: HOLD_ORANGE }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div>
              <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: GS_BLUE, color: "#fff" }}>
                    <th style={{ padding: "6px 8px", textAlign: "left" }}>연도</th>
                    <th style={{ padding: "6px 8px", textAlign: "right" }}>매출(억)</th>
                    <th style={{ padding: "6px 8px", textAlign: "right" }}>OPM</th>
                  </tr>
                </thead>
                <tbody>
                  {profitData.map((row, i) => (
                    <tr key={row.year} style={{ backgroundColor: i % 2 === 0 ? "#fff" : LIGHT_BG }}>
                      <td style={{ padding: "5px 8px", fontWeight: row.year === "2024E" ? "700" : "400" }}>{row.year}</td>
                      <td style={{ padding: "5px 8px", textAlign: "right" }}>{row.revenue.toLocaleString()}</td>
                      <td style={{ padding: "5px 8px", textAlign: "right", color: BUY_GREEN, fontWeight: "600" }}>{row.opm}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: "10px", fontSize: "11px", color: "#475569", lineHeight: "1.5", padding: "8px", backgroundColor: LIGHT_BG, borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                <strong>CAGR(2020-2024E):</strong><br />
                매출 +21.9% | 영업이익 +36.2%<br />
                OPM: 8.2%→12.7% (+450bp)
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            섹션 5: 재무건전성
        ══════════════════════════════════════ */}
        <div style={sectionStyle}>
          <div style={headerStyle}>⑤ 재무건전성 (Balance Sheet Health)</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "16px" }}>
            {balanceData.map((item) => {
              const isGood =
                item.metric === "부채비율" ? item.value < item.benchmark :
                item.metric === "유동비율" ? item.value > item.benchmark :
                item.metric === "이자보상배율" ? item.value > item.benchmark :
                item.value < item.benchmark;
              return (
                <div
                  key={item.metric}
                  style={{
                    backgroundColor: isGood ? "#f0fdf4" : "#fef2f2",
                    borderRadius: "8px",
                    padding: "14px",
                    border: `1px solid ${isGood ? "#bbf7d0" : "#fecaca"}`,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "6px" }}>{item.metric}</div>
                  <div style={{ fontSize: "24px", fontWeight: "800", color: isGood ? BUY_GREEN : SELL_RED }}>
                    {item.value}{item.unit}
                  </div>
                  <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "4px" }}>
                    기준: {item.benchmark}{item.unit}
                  </div>
                  <div
                    style={{
                      marginTop: "6px",
                      fontSize: "10px",
                      fontWeight: "700",
                      color: isGood ? BUY_GREEN : SELL_RED,
                      backgroundColor: isGood ? "#dcfce7" : "#fee2e2",
                      borderRadius: "4px",
                      padding: "2px 6px",
                      display: "inline-block",
                    }}
                  >
                    {isGood ? "✓ 양호" : "⚠ 주의"}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: "12px", color: "#475569", lineHeight: "1.6", padding: "10px 14px", backgroundColor: LIGHT_BG, borderRadius: "6px", border: "1px solid #e2e8f0" }}>
            <strong>재무구조 평가:</strong> 순현금 포지션(순부채비율 -12.1%)으로 무차입 경영 기조 유지. 이자보상배율 18.4배는 동종업계 최고 수준으로 금융비용 리스크 극히 낮음. 2025~2026년 유상증자 불필요 판단.
          </div>
        </div>

        {/* ══════════════════════════════════════
            섹션 6: FCF 잉여현금흐름
        ══════════════════════════════════════ */}
        <div style={sectionStyle}>
          <div style={headerStyle}>⑥ 잉여현금흐름 (Free Cash Flow)</div>
          <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "20px" }}>
            <div style={{ height: "200px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fcfData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}억`} />
                  <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} formatter={(v) => [`${v}억원`]} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Bar dataKey="fcf" name="FCF" fill={BUY_GREEN} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="capex" name="CAPEX" fill={SELL_RED} radius={[3, 3, 0, 0]} />
                  <ReferenceLine y={0} stroke="#64748b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center" }}>
              <div style={{ backgroundColor: "#f0fdf4", borderRadius: "8px", padding: "12px", border: "1px solid #bbf7d0" }}>
                <div style={{ fontSize: "11px", color: "#166534", fontWeight: "600" }}>2024E FCF</div>
                <div style={{ fontSize: "22px", fontWeight: "800", color: BUY_GREEN }}>₩612억</div>
                <div style={{ fontSize: "10px", color: "#64748b" }}>FCF Yield: 1.45%</div>
              </div>
              <div style={{ backgroundColor: LIGHT_BG, borderRadius: "6px", padding: "10px", border: "1px solid #e2e8f0", fontSize: "11px", color: "#475569", lineHeight: "1.5" }}>
                <strong>FCF 활용 전략:</strong><br />
                • 배당성향 30~35% 유지 목표<br />
                • 자사주 취득 검토(2025H2)<br />
                • M&A: 해외 MRO 업체 인수 모색
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            섹션 7: 경쟁우위 스코어카드
        ══════════════════════════════════════ */}
        <div style={sectionStyle}>
          <div style={headerStyle}>⑦ 경쟁우위 스코어카드 (Moat Analysis)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {moatScores.map((item) => (
              <div
                key={item.category}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  padding: "10px 12px",
                  backgroundColor: LIGHT_BG,
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#334155" }}>{item.category}</span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: item.score >= 8 ? BUY_GREEN : item.score >= 6.5 ? HOLD_ORANGE : SELL_RED,
                      backgroundColor: item.score >= 8 ? "#f0fdf4" : item.score >= 6.5 ? "#fff7ed" : "#fef2f2",
                      borderRadius: "4px",
                      padding: "2px 6px",
                    }}
                  >
                    {item.score >= 8 ? "STRONG" : item.score >= 6.5 ? "MODERATE" : "WEAK"}
                  </span>
                </div>
                <ScoreBar score={item.score} max={item.max} color={item.score >= 8 ? BUY_GREEN : item.score >= 6.5 ? GS_BLUE : SELL_RED} />
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: "14px",
              padding: "12px",
              backgroundColor: "#eff6ff",
              borderRadius: "6px",
              border: "1px solid #bfdbfe",
              fontSize: "12px",
              color: "#1e40af",
              lineHeight: "1.6",
            }}
          >
            <strong>종합 Moat 등급: Wide Moat (7.5/10)</strong> — 전환비용(8.5)과 브랜드 가치(8.0)가 핵심 해자. 그룹사 인도선에 대한 배타적 서비스 권한 및 HIPO 플랫폼 기반 디지털 Lock-in 효과가 장기적 경쟁우위를 보호합니다.
          </div>
        </div>

        {/* ══════════════════════════════════════
            섹션 8: 지배구조 및 경영진
        ══════════════════════════════════════ */}
        <div style={sectionStyle}>
          <div style={headerStyle}>⑧ 지배구조 및 경영진</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: "700", color: GS_BLUE, marginBottom: "10px" }}>주주구성 (2024.12 기준)</div>
              {[
                { holder: "HD한국조선해양(주)", stake: "43.5%", type: "최대주주" },
                { holder: "국민연금공단", stake: "7.2%", type: "기관" },
                { holder: "외국인 투자자", stake: "21.4%", type: "외국인" },
                { holder: "소액주주 등", stake: "27.9%", type: "기타" },
              ].map((item) => (
                <div
                  key={item.holder}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "7px 0",
                    borderBottom: "1px solid #f1f5f9",
                    fontSize: "12px",
                  }}
                >
                  <span style={{ color: "#334155" }}>{item.holder}</span>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span
                      style={{
                        fontSize: "10px",
                        backgroundColor: "#f1f5f9",
                        color: "#64748b",
                        borderRadius: "3px",
                        padding: "1px 5px",
                      }}
                    >
                      {item.type}
                    </span>
                    <span style={{ fontWeight: "700", color: GS_BLUE }}>{item.stake}</span>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: "700", color: GS_BLUE, marginBottom: "10px" }}>최근 DART 공시 (2026.01~04)</div>
              {[
                {
                  date: "2026-04-10",
                  type: "분기보고서",
                  title: "2025년 4분기 및 연간 실적 공시",
                  color: GS_BLUE,
                },
                {
                  date: "2026-03-25",
                  type: "주요사항보고",
                  title: "글로벌 MRO 업체 지분 인수 검토 공시",
                  color: HOLD_ORANGE,
                },
                {
                  date: "2026-02-14",
                  type: "자기주식",
                  title: "자기주식 취득 신탁계약 체결",
                  color: BUY_GREEN,
                },
                {
                  date: "2026-01-20",
                  type: "임원변동",
                  title: "CFO 신규 선임(전 현대중공업 재무본부장)",
                  color: "#64748b",
                },
              ].map((item) => (
                <div
                  key={item.date}
                  style={{
                    padding: "8px",
                    borderLeft: `3px solid ${item.color}`,
                    marginBottom: "8px",
                    backgroundColor: LIGHT_BG,
                    borderRadius: "0 4px 4px 0",
                  }}
                >
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "3px" }}>
                    <span style={{ fontSize: "10px", color: "#94a3b8" }}>{item.date}</span>
                    <span
                      style={{
                        fontSize: "10px",
                        backgroundColor: item.color,
                        color: "#fff",
                        borderRadius: "3px",
                        padding: "1px 5px",
                      }}
                    >
                      {item.type}
                    </span>
                  </div>
                  <div style={{ fontSize: "11px", color: "#334155", fontWeight: "500" }}>{item.title}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: "12px", fontSize: "11px", color: "#475569", lineHeight: "1.5", padding: "10px", backgroundColor: LIGHT_BG, borderRadius: "6px", border: "1px solid #e2e8f0" }}>
            <strong>거버넌스 평가:</strong> HD현대그룹 지배구조 특성상 지주사 의존도가 높으나, 2023년 독립 상장 이후 자체 이사회 체계 강화 중. 사외이사 비율 50% 달성 및 내부거래위원회 신설은 긍정적 변화. 소수주주 이익 침해 리스크는 중간 수준으로 평가.
          </div>
        </div>

        {/* ══════════════════════════════════════
            섹션 9: 밸류에이션
        ══════════════════════════════════════ */}
        <div style={sectionStyle}>
          <div style={headerStyle}>⑨ 밸류에이션 (Valuation)</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "16px" }}>
            {[
              { label: "PER (2024E)", value: "18.2x", note: "글로벌 피어 평균 22.2x 대비 할인" },
              { label: "PBR (2024E)", value: "3.8x", note: "ROE 22.1% 감안 시 적정" },
              { label: "EV/EBITDA", value: "11.4x", note: "피어 평균 13.3x 대비 14% 할인" },
              { label: "배당수익률", value: "1.2%", note: "배당성향 30%, 성장형 종목" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  backgroundColor: LIGHT_BG,
                  borderRadius: "6px",
                  padding: "12px",
                  border: "1px solid #e2e8f0",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "10px", color: "#64748b", fontWeight: "600", marginBottom: "4px" }}>{item.label}</div>
                <div style={{ fontSize: "22px", fontWeight: "800", color: GS_BLUE }}>{item.value}</div>
                <div style={{ fontSize: "9px", color: "#94a3b8", marginTop: "4px" }}>{item.note}</div>
              </div>
            ))}
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: GS_BLUE, color: "#fff" }}>
                  <th style={{ padding: "8px 12px", textAlign: "left" }}>기업</th>
                  <th style={{ padding: "8px 12px", textAlign: "right" }}>PER</th>
                  <th style={{ padding: "8px 12px", textAlign: "right" }}>PBR</th>
                  <th style={{ padding: "8px 12px", textAlign: "right" }}>EV/EBITDA</th>
                  <th style={{ padding: "8px 12px", textAlign: "right" }}>ROE</th>
                </tr>
              </thead>
              <tbody>
                {peerData.map((row, i) => (
                  <tr
                    key={row.name}
                    style={{
                      backgroundColor: row.name === "HD현대마린솔루션" ? "#eff6ff" : i % 2 === 0 ? "#fff" : LIGHT_BG,
                      fontWeight: row.name === "HD현대마린솔루션" ? "700" : "400",
                    }}
                  >
                    <td style={{ padding: "7px 12px", color: row.name === "HD현대마린솔루션" ? GS_BLUE : "#334155" }}>
                      {row.name === "HD현대마린솔루션" ? "★ " : ""}{row.name}
                    </td>
                    <td style={{ padding: "7px 12px", textAlign: "right" }}>{row.per}x</td>
                    <td style={{ padding: "7px 12px", textAlign: "right" }}>{row.pbr}x</td>
                    <td style={{ padding: "7px 12px", textAlign: "right" }}>{row.evEbitda}x</td>
                    <td style={{ padding: "7px 12px", textAlign: "right", color: BUY_GREEN, fontWeight: "600" }}>{row.roe}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            style={{
              marginTop: "12px",
              padding: "10px 14px",
              backgroundColor: "#eff6ff",
              borderRadius: "6px",
              border: "1px solid #bfdbfe",
              fontSize: "11px",
              color: "#1e40af",
              lineHeight: "1.6",
            }}
          >
            <strong>적정주가 산출 근거:</strong> Target PER 22.0x (피어 평균) × 2025E EPS ₩6,591 = ₩145,000. 또는 EV/EBITDA 14.0x 적용 시 ₩138,500~₩151,200 범위. 두 방법론 평균 목표주가 ₩145,000 (상승여력 +37.4%).
          </div>
        </div>

        {/* ══════════════════════════════════════
            섹션 10: Bull / Bear Case
        ══════════════════════════════════════ */}
        <div style={sectionStyle}>
          <div style={headerStyle}>⑩ Bull / Bear Case 시나리오</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {/* Bull Case */}
            <div
              style={{
                backgroundColor: "#f0fdf4",
                borderRadius: "8px",
                padding: "16px",
                border: "2px solid #86efac",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <div style={{ fontSize: "13px", fontWeight: "800", color: BUY_GREEN }}>🐂 BULL CASE</div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "800",
                    color: BUY_GREEN,
                    backgroundColor: "#dcfce7",
                    padding: "4px 12px",
                    borderRadius: "6px",
                  }}
                >
                  ₩175,000
                </div>
              </div>
              <div style={{ fontSize: "11px", color: "#166534", marginBottom: "6px", fontWeight: "600" }}>
                상승 가능성: 30% | 상승여력: +65.9%
              </div>
              {[
                "IMO 2025 탄소규제 조기 강화 → 친환경 개조 수주 폭발적 증가",
                "글로벌 MRO 업체 인수 성공 → 유럽·중동 시장 직접 진출",
                "HIPO 플랫폼 SaaS化 성공 → 구독형 수익 확대",
                "HD현대그룹 조선 3사 수주 사상 최대 → 서비스 선박 수 급증",
                "영업이익률 2026E 16% 달성 시 EPS 상향",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "6px", marginBottom: "6px", fontSize: "11px", color: "#166534" }}>
                  <span style={{ color: BUY_GREEN, fontWeight: "700", flexShrink: 0 }}>▲</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            {/* Bear Case */}
            <div
              style={{
                backgroundColor: "#fef2f2",
                borderRadius: "8px",
                padding: "16px",
                border: "2px solid #fca5a5",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <div style={{ fontSize: "13px", fontWeight: "800", color: SELL_RED }}>🐻 BEAR CASE</div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "800",
                    color: SELL_RED,
                    backgroundColor: "#fee2e2",
                    padding: "4px 12px",
                    borderRadius: "6px",
                  }}
                >
                  ₩78,000
                </div>
              </div>
              <div style={{ fontSize: "11px", color: "#991b1b", marginBottom: "6px", fontWeight: "600" }}>
                하락 가능성: 20% | 하락 리스크: -26.1%
              </div>
              {[
                "글로벌 해운 경기 급락 → 선주사 A/S 예산 삭감",
                "중국 경쟁사(CSSC 서비스 부문) 저가 공세 심화",
                "환율 리스크: 원화 강세 지속 시 수익성 악화",
                "규제 지연: IMO 탄소규제 유예 시 개조 수요 이연",
                "M&A 실패 또는 과도한 자금 소요 발생",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "6px", marginBottom: "6px", fontSize: "11px", color: "#991b1b" }}>
                  <span style={{ color: SELL_RED, fontWeight: "700", flexShrink: 0 }}>▼</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          {/* 시나리오 요약 바 */}
          <div style={{ marginTop: "14px" }}>
            <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "6px", fontWeight: "600" }}>
              주가 시나리오 범위
            </div>
            <div style={{ position: "relative", height: "24px", backgroundColor: "#f1f5f9", borderRadius: "6px" }}>
              {/* 전체 범위 바 */}
              <div
                style={{
                  position: "absolute",
                  left: "10%",
                  right: "5%",
                  top: "6px",
                  height: "12px",
                  background: "linear-gradient(to right, #fca5a5, #fde68a, #86efac)",
                  borderRadius: "4px",
                }}
              />
              {/* 현재가 마커 */}
              <div
                style={{
                  position: "absolute",
                  left: "42%",
                  top: "0",
                  width: "3px",
                  height: "24px",
                  backgroundColor: GS_BLUE,
                  borderRadius: "2px",
                }}
              />
              {/* 목표주가 마커 */}
              <div
                style={{
                  position: "absolute",
                  left: "67%",
                  top: "0",
                  width: "3px",
                  height: "24px",
                  backgroundColor: BUY_GREEN,
                  borderRadius: "2px",
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#94a3b8", marginTop: "4px" }}>
              <span>Bear ₩78,000</span>
              <span style={{ color: GS_BLUE, fontWeight: "700" }}>현재 ₩105,500</span>
              <span style={{ color: BUY_GREEN, fontWeight: "700" }}>목표 ₩145,000</span>
              <span>Bull ₩175,000</span>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            섹션 11: 최종 판단
        ══════════════════════════════════════ */}
        <div
          style={{
            ...sectionStyle,
            borderLeft: `6px solid ${BUY_GREEN}`,
            backgroundColor: "#f0fdf4",
          }}
        >
          <div style={{ ...headerStyle, color: BUY_GREEN, borderBottomColor: BUY_GREEN }}>
            ⑪ 최종 판단 (Investment Conclusion)
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "24px", alignItems: "start" }}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  backgroundColor: BUY_GREEN,
                  color: "#fff",
                  borderRadius: "12px",
                  padding: "16px 28px",
                  fontSize: "28px",
                  fontWeight: "900",
                  letterSpacing: "0.05em",
                  marginBottom: "8px",
                }}
              >
                매수 (BUY)
              </div>
              <div style={{ fontSize: "13px", color: "#166534", fontWeight: "700" }}>목표주가</div>
              <div style={{ fontSize: "32px", fontWeight: "900", color: BUY_GREEN }}>₩145,000</div>
              <div style={{ fontSize: "12px", color: "#166534" }}>+37.4% 상승여력</div>
              <div style={{ marginTop: "10px" }}>
                <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>확신도 (Conviction)</div>
                <div style={{ display: "flex", gap: "3px", justifyContent: "center" }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <div
                      key={n}
                      style={{
                        width: "14px",
                        height: "14px",
                        borderRadius: "3px",
                        backgroundColor: n <= 8 ? BUY_GREEN : "#d1fae5",
                      }}
                    />
                  ))}
                </div>
                <div style={{ fontSize: "12px", fontWeight: "700", color: BUY_GREEN, marginTop: "4px" }}>8 / 10</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: "13px", color: "#166534", fontWeight: "700", marginBottom: "10px" }}>
                투자 판단 근거 요약
              </div>
              {[
                {
                  rank: "①",
                  title: "구조적 성장 시장",
                  desc: "글로벌 선박 LCM 시장은 IMO 탄소규제 강화로 2030년까지 연 15% 성장 전망. HMS는 이 시장의 최대 수혜주.",
                },
                {
                  rank: "②",
                  title: "Wide Moat + 높은 전환비용",
                  desc: "선박은 한 번 특정 업체와 서비스 계약 시 교체 비용과 안전 리스크가 매우 커 고객 이탈률이 업계 최저 수준.",
                },
                {
                  rank: "③",
                  title: "수익성 개선 궤도",
                  desc: "OPM 8.2%(2020)→12.7%(2024E) 지속 상승. 친환경 개조·디지털 서비스 믹스 개선으로 2026E 15% 달성 가능.",
                },
                {
                  rank: "④",
                  title: "밸류에이션 저평가",
                  desc: "글로벌 피어 대비 PER 18% 할인, EV/EBITDA 14% 할인. ROE 22% 고성장주 치고는 과도한 할인 중.",
                },
                {
                  rank: "⑤",
                  title: "리스크 요소",
                  desc: "해운 경기 민감도, 중국 경쟁사 부상, 환율 리스크. 그러나 장기 성장 스토리를 훼손할 수준은 아님.",
                },
              ].map((item) => (
                <div
                  key={item.rank}
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "10px",
                    padding: "8px 10px",
                    backgroundColor: "#fff",
                    borderRadius: "6px",
                    border: "1px solid #bbf7d0",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "800",
                      color: BUY_GREEN,
                      flexShrink: 0,
                    }}
                  >
                    {item.rank}
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: "700", color: "#166534", marginBottom: "2px" }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: "11px", color: "#475569", lineHeight: "1.5" }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            면책 조항 (Disclaimer)
        ══════════════════════════════════════ */}
        <div
          style={{
            padding: "14px 16px",
            backgroundColor: "#f8fafc",
            borderRadius: "6px",
            border: "1px solid #e2e8f0",
            fontSize: "10px",
            color: "#94a3b8",
            lineHeight: "1.6",
            marginBottom: "8px",
          }}
        >
          <strong style={{ color: "#64748b" }}>면책 조항 (Disclaimer):</strong> 본 보고서는 투자 참고 목적으로 작성된 분석 자료이며, 투자 권유 또는 매매 추천을 구성하지 않습니다. 모든 투자 결정은 투자자 본인의 판단과 책임하에 이루어져야 합니다. 본 보고서에 포함된 재무 데이터는 공개된 정보를 기반으로 추정한 수치로, 실제 확정 재무제표와 차이가 있을 수 있습니다. 리포트 생성일: 2026-04-20 | 종목코드: 458870 | HD현대마린솔루션
        </div>

      </div>
    </div>
  );
}
