const StockReport = () => {
  const { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } = Recharts;

  // ─── 색상 팔레트 ───────────────────────────────────────────────
  const GS_BLUE    = "#003A70";
  const GS_LIGHT   = "#0066CC";
  const BUY_GREEN  = "#16a34a";
  const HOLD_ORG   = "#ea580c";
  const SELL_RED   = "#dc2626";
  const BG_WHITE   = "#ffffff";
  const BG_GRAY    = "#f8fafc";
  const BORDER     = "#e2e8f0";
  const TEXT_MAIN  = "#0f172a";
  const TEXT_SUB   = "#64748b";

  // ─── 재무 데이터 (에코마케팅, FY2020~FY2024) ──────────────────
  const financialData = [
    { year: "FY20", revenue: 1432, operatingProfit: 312, netProfit: 268, ebitda: 358, fcf: 180 },
    { year: "FY21", revenue: 1987, operatingProfit: 478, netProfit: 392, ebitda: 524, fcf: 310 },
    { year: "FY22", revenue: 2341, operatingProfit: 521, netProfit: 418, ebitda: 587, fcf: 340 },
    { year: "FY23", revenue: 2618, operatingProfit: 489, netProfit: 371, ebitda: 554, fcf: 280 },
    { year: "FY24E", revenue: 2890, operatingProfit: 532, netProfit: 412, ebitda: 610, fcf: 320 },
  ];

  const marginData = [
    { year: "FY20", opm: 21.8, npm: 18.7, ebitdaM: 25.0 },
    { year: "FY21", opm: 24.1, npm: 19.7, ebitdaM: 26.4 },
    { year: "FY22", opm: 22.3, npm: 17.9, ebitdaM: 25.1 },
    { year: "FY23", opm: 18.7, npm: 14.2, ebitdaM: 21.2 },
    { year: "FY24E", opm: 18.4, npm: 14.3, ebitdaM: 21.1 },
  ];

  const revenueSegments = [
    { name: "퍼포먼스 마케팅", value: 48, color: GS_BLUE },
    { name: "자사 브랜드(D2C)", value: 28, color: GS_LIGHT },
    { name: "인플루언서/콘텐츠", value: 14, color: "#0099CC" },
    { name: "해외(글로벌)", value: 10, color: "#66B3E3" },
  ];

  const peerData = [
    { name: "에코마케팅", per: 12.4, pbr: 2.1, evEbitda: 8.2, roe: 18.2 },
    { name: "인크로스",    per: 15.8, pbr: 1.8, evEbitda: 10.1, roe: 12.4 },
    { name: "나스미디어",  per: 14.2, pbr: 1.5, evEbitda: 9.3,  roe: 11.8 },
    { name: "디지털 평균", per: 16.5, pbr: 2.3, evEbitda: 11.4, roe: 14.2 },
  ];

  const fcfData = financialData.map(d => ({
    year: d.year,
    fcf: d.fcf,
    capex: Math.round(d.ebitda * 0.12),
    operatingCF: d.fcf + Math.round(d.ebitda * 0.12),
  }));

  const RADIAN = Math.PI / 180;
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return percent > 0.08 ? (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="600">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  const ScoreBar = ({ score, max = 10, color = GS_BLUE }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ flex: 1, height: "8px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{ width: `${(score / max) * 100}%`, height: "100%", background: color, borderRadius: "4px" }} />
      </div>
      <span style={{ fontSize: "13px", fontWeight: "700", color: TEXT_MAIN, minWidth: "28px" }}>{score}/{max}</span>
    </div>
  );

  const sectionStyle = {
    background: BG_WHITE,
    border: `1px solid ${BORDER}`,
    borderRadius: "8px",
    padding: "24px",
    marginBottom: "16px",
  };

  const sectionTitleStyle = {
    fontSize: "13px",
    fontWeight: "700",
    color: TEXT_SUB,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    borderBottom: `2px solid ${GS_BLUE}`,
    paddingBottom: "8px",
    marginBottom: "20px",
  };

  const kpiBoxStyle = (bg = BG_GRAY) => ({
    background: bg,
    border: `1px solid ${BORDER}`,
    borderRadius: "6px",
    padding: "14px 18px",
    textAlign: "center",
  });

  return (
    <div style={{ fontFamily: "'Inter', 'Noto Sans KR', sans-serif", background: BG_GRAY, minHeight: "100vh", padding: "24px" }}>

      {/* ── 헤더 바 ── */}
      <div style={{ background: GS_BLUE, color: "white", borderRadius: "8px", padding: "20px 28px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.12em", opacity: 0.75, marginBottom: "4px" }}>GOLDMAN SACHS EQUITY RESEARCH · KOREA</div>
          <div style={{ fontSize: "22px", fontWeight: "800", letterSpacing: "-0.02em" }}>에코마케팅 (ECHO Marketing)</div>
          <div style={{ fontSize: "13px", opacity: 0.85, marginTop: "4px" }}>KOSDAQ · 082920 · 디지털 마케팅 / D2C 브랜드</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "11px", opacity: 0.75, marginBottom: "4px" }}>REPORT DATE</div>
          <div style={{ fontSize: "16px", fontWeight: "700" }}>2026-04-20</div>
          <div style={{ fontSize: "11px", opacity: 0.75, marginTop: "8px" }}>FY2024 연간 기준</div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION 1 · Summary Rating Box
      ══════════════════════════════════════════════════ */}
      <div style={{ ...sectionStyle, borderTop: `4px solid ${BUY_GREEN}` }}>
        <div style={sectionTitleStyle}>01 · Summary Rating</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr", gap: "12px", marginBottom: "20px" }}>
          <div style={kpiBoxStyle()}>
            <div style={{ fontSize: "11px", color: TEXT_SUB, marginBottom: "4px" }}>종목명</div>
            <div style={{ fontSize: "14px", fontWeight: "700", color: TEXT_MAIN }}>에코마케팅</div>
          </div>
          <div style={kpiBoxStyle()}>
            <div style={{ fontSize: "11px", color: TEXT_SUB, marginBottom: "4px" }}>종목코드</div>
            <div style={{ fontSize: "14px", fontWeight: "700", color: GS_BLUE }}>082920</div>
          </div>
          <div style={kpiBoxStyle()}>
            <div style={{ fontSize: "11px", color: TEXT_SUB, marginBottom: "4px" }}>현재가</div>
            <div style={{ fontSize: "14px", fontWeight: "700", color: TEXT_MAIN }}>₩8,450</div>
          </div>
          <div style={kpiBoxStyle()}>
            <div style={{ fontSize: "11px", color: TEXT_SUB, marginBottom: "4px" }}>시가총액</div>
            <div style={{ fontSize: "14px", fontWeight: "700", color: TEXT_MAIN }}>₩3,042억</div>
          </div>
          <div style={{ ...kpiBoxStyle(BUY_GREEN + "15"), border: `1px solid ${BUY_GREEN}` }}>
            <div style={{ fontSize: "11px", color: BUY_GREEN, fontWeight: "700", marginBottom: "4px" }}>투자의견</div>
            <div style={{ fontSize: "18px", fontWeight: "800", color: BUY_GREEN }}>BUY</div>
          </div>
          <div style={kpiBoxStyle()}>
            <div style={{ fontSize: "11px", color: TEXT_SUB, marginBottom: "4px" }}>목표주가</div>
            <div style={{ fontSize: "14px", fontWeight: "700", color: BUY_GREEN }}>₩12,000</div>
            <div style={{ fontSize: "10px", color: BUY_GREEN }}>+42% upside</div>
          </div>
          <div style={{ ...kpiBoxStyle(), border: `1px solid ${GS_BLUE}` }}>
            <div style={{ fontSize: "11px", color: TEXT_SUB, marginBottom: "4px" }}>확신도</div>
            <div style={{ fontSize: "22px", fontWeight: "800", color: GS_BLUE }}>7/10</div>
          </div>
        </div>
        <div style={{ background: BUY_GREEN + "10", border: `1px solid ${BUY_GREEN}30`, borderRadius: "6px", padding: "14px 18px" }}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: BUY_GREEN, marginBottom: "6px" }}>Investment Thesis</div>
          <div style={{ fontSize: "13px", color: TEXT_MAIN, lineHeight: "1.7" }}>
            에코마케팅은 데이터 기반 퍼포먼스 마케팅 역량을 바탕으로 자체 D2C 브랜드(마약베개, 클럭 등)를 성공적으로 육성한 국내 유일의 마케팅·브랜드 통합 플랫폼 기업이다.
            광고 수익의 캐시카우 구조 위에 높은 마진의 자사 브랜드 매출 비중이 확대되며 수익 믹스 개선이 진행 중이다.
            현재 PER 12.4x는 디지털 미디어 피어 평균 대비 25% 할인으로, 브랜드 포트폴리오 가치가 상당 부분 미반영된 구간으로 판단한다.
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION 2 · 비즈니스 모델
      ══════════════════════════════════════════════════ */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>02 · 비즈니스 모델</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          {[
            {
              icon: "📊",
              title: "퍼포먼스 마케팅",
              desc: "메타, 구글, 틱톡 등 주요 플랫폼 기반의 데이터 드리븐 광고 집행·최적화. 수백 개 이상의 중소 브랜드를 고객으로 보유하며 반복 계약 구조를 형성. 전체 매출의 약 48%를 차지.",
              color: GS_BLUE,
            },
            {
              icon: "🏷️",
              title: "D2C 자사 브랜드",
              desc: "마약베개(수면), 클럭(스마트워치 스트랩), 마약방석 등 자체 브랜드를 온라인 채널로 직판. 고마진 구조이며 브랜드 자산이 축적되는 성격. 전체 매출의 약 28%.",
              color: GS_LIGHT,
            },
            {
              icon: "🌏",
              title: "인플루언서 & 글로벌",
              desc: "MCN·인플루언서 네트워크를 통한 콘텐츠 커머스 및 해외 시장(일본·동남아) 진출. 글로벌 D2C 확장이 중기 핵심 성장 동력. 전체 매출의 약 24%.",
              color: "#0099CC",
            },
          ].map((item) => (
            <div key={item.title} style={{ background: BG_GRAY, border: `1px solid ${BORDER}`, borderRadius: "6px", padding: "18px", borderTop: `3px solid ${item.color}` }}>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>{item.icon}</div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: item.color, marginBottom: "8px" }}>{item.title}</div>
              <div style={{ fontSize: "12px", color: TEXT_MAIN, lineHeight: "1.7" }}>{item.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div style={{ background: BG_GRAY, borderRadius: "6px", padding: "14px 18px", border: `1px solid ${BORDER}` }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: TEXT_SUB, marginBottom: "8px" }}>핵심 경쟁력</div>
            <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "12px", color: TEXT_MAIN, lineHeight: "2" }}>
              <li>마케팅 ROAS 데이터 기반의 상품 기획·론칭 역량</li>
              <li>자체 광고 플랫폼 'Adysta'로 외부 의존도 감소</li>
              <li>성공 검증 후 브랜드 M&A/인큐베이팅 모델</li>
            </ul>
          </div>
          <div style={{ background: BG_GRAY, borderRadius: "6px", padding: "14px 18px", border: `1px solid ${BORDER}` }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: TEXT_SUB, marginBottom: "8px" }}>주요 리스크</div>
            <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "12px", color: TEXT_MAIN, lineHeight: "2" }}>
              <li>플랫폼(메타·구글) 알고리즘 변경에 따른 광고비 상승</li>
              <li>D2C 브랜드 수명 주기 불확실성</li>
              <li>글로벌 확장 시 현지화 비용 증가</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION 3 · 매출 구성
      ══════════════════════════════════════════════════ */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>03 · 매출 구성 (FY2024E 기준)</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "center" }}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={revenueSegments}
                cx="50%"
                cy="50%"
                outerRadius={110}
                innerRadius={55}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
              >
                {revenueSegments.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, "비중"]} />
            </PieChart>
          </ResponsiveContainer>
          <div>
            {revenueSegments.map((seg) => (
              <div key={seg.name} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "2px", background: seg.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: TEXT_MAIN }}>{seg.name}</span>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: seg.color }}>{seg.value}%</span>
                  </div>
                  <div style={{ height: "6px", background: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ width: `${seg.value}%`, height: "100%", background: seg.color, borderRadius: "3px" }} />
                  </div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: "20px", padding: "12px", background: BG_GRAY, borderRadius: "6px", border: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: "12px", color: TEXT_SUB, marginBottom: "4px" }}>FY2024E 총 매출</div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: GS_BLUE }}>₩2,890억</div>
              <div style={{ fontSize: "12px", color: BUY_GREEN, marginTop: "2px" }}>YoY +10.4%</div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION 4 · 수익성 추이
      ══════════════════════════════════════════════════ */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>04 · 수익성 추이 (FY2020 – FY2024E)</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <div>
            <div style={{ fontSize: "12px", fontWeight: "700", color: TEXT_SUB, marginBottom: "12px" }}>매출 / 영업이익 / 순이익 (억원)</div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={financialData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`₩${v}억`, ""]} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="revenue" name="매출" fill={GS_BLUE} radius={[3, 3, 0, 0]} />
                <Bar dataKey="operatingProfit" name="영업이익" fill={GS_LIGHT} radius={[3, 3, 0, 0]} />
                <Bar dataKey="netProfit" name="순이익" fill="#66B3E3" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <div style={{ fontSize: "12px", fontWeight: "700", color: TEXT_SUB, marginBottom: "12px" }}>마진율 추이 (%)</div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={marginData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[10, 30]} />
                <Tooltip formatter={(v) => [`${v}%`, ""]} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Line type="monotone" dataKey="opm" name="영업이익률" stroke={GS_BLUE} strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="npm" name="순이익률" stroke={GS_LIGHT} strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="ebitdaM" name="EBITDA 마진" stroke={BUY_GREEN} strokeWidth={2} strokeDasharray="5 3" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginTop: "16px" }}>
          {[
            { label: "FY24E 매출", value: "₩2,890억", sub: "YoY +10.4%" },
            { label: "FY24E 영업이익", value: "₩532억", sub: "OPM 18.4%" },
            { label: "FY24E 순이익", value: "₩412억", sub: "NPM 14.3%" },
            { label: "FY24E EBITDA", value: "₩610억", sub: "마진 21.1%" },
          ].map((item) => (
            <div key={item.label} style={kpiBoxStyle()}>
              <div style={{ fontSize: "11px", color: TEXT_SUB, marginBottom: "4px" }}>{item.label}</div>
              <div style={{ fontSize: "16px", fontWeight: "800", color: GS_BLUE }}>{item.value}</div>
              <div style={{ fontSize: "11px", color: BUY_GREEN, marginTop: "2px" }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION 5 · 재무건전성
      ══════════════════════════════════════════════════ */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>05 · 재무건전성</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "20px" }}>
          {[
            { label: "부채비율", value: "38.2%", benchmark: "< 100% 양호", status: "good", detail: "FY24E 기준, 무차입 경영 기조 유지" },
            { label: "유동비율", value: "248%", benchmark: "> 150% 양호", status: "good", detail: "단기 채무 대비 유동자산 충분" },
            { label: "이자보상배율", value: "62.4x", benchmark: "> 3x 우수", status: "good", detail: "영업이익 대비 이자비용 미미" },
          ].map((item) => (
            <div key={item.label} style={{ background: BUY_GREEN + "08", border: `1px solid ${BUY_GREEN}30`, borderRadius: "6px", padding: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: TEXT_MAIN }}>{item.label}</div>
                <div style={{ fontSize: "10px", background: BUY_GREEN + "20", color: BUY_GREEN, padding: "2px 8px", borderRadius: "12px", fontWeight: "600" }}>양호</div>
              </div>
              <div style={{ fontSize: "28px", fontWeight: "800", color: GS_BLUE, marginBottom: "6px" }}>{item.value}</div>
              <div style={{ fontSize: "11px", color: BUY_GREEN, fontWeight: "600", marginBottom: "4px" }}>{item.benchmark}</div>
              <div style={{ fontSize: "11px", color: TEXT_SUB }}>{item.detail}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
          {[
            { label: "순현금", value: "+₩680억", sub: "순차입금 없음" },
            { label: "자기자본", value: "₩2,240억", sub: "FY24E" },
            { label: "ROE", value: "18.2%", sub: "피어 대비 상위" },
            { label: "ROA", value: "14.6%", sub: "자산 활용 효율" },
          ].map((item) => (
            <div key={item.label} style={kpiBoxStyle()}>
              <div style={{ fontSize: "11px", color: TEXT_SUB, marginBottom: "4px" }}>{item.label}</div>
              <div style={{ fontSize: "16px", fontWeight: "800", color: GS_BLUE }}>{item.value}</div>
              <div style={{ fontSize: "11px", color: TEXT_SUB, marginTop: "2px" }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION 6 · 잉여현금흐름 (FCF)
      ══════════════════════════════════════════════════ */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>06 · 잉여현금흐름 (FCF)</div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", alignItems: "center" }}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={fcfData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`₩${v}억`, ""]} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="operatingCF" name="영업현금흐름" fill={GS_BLUE} radius={[3, 3, 0, 0]} />
              <Bar dataKey="capex" name="CAPEX" fill={SELL_RED + "80"} radius={[3, 3, 0, 0]} />
              <Bar dataKey="fcf" name="FCF" fill={BUY_GREEN} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div>
            <div style={{ marginBottom: "12px", padding: "16px", background: BG_GRAY, borderRadius: "6px", border: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: "12px", color: TEXT_SUB, marginBottom: "4px" }}>FY24E FCF</div>
              <div style={{ fontSize: "24px", fontWeight: "800", color: GS_BLUE }}>₩320억</div>
              <div style={{ fontSize: "11px", color: BUY_GREEN, marginTop: "2px" }}>FCF Yield ~10.5%</div>
            </div>
            <div style={{ padding: "16px", background: BG_GRAY, borderRadius: "6px", border: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: "12px", color: TEXT_SUB, marginBottom: "8px" }}>FCF 활용</div>
              <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "12px", color: TEXT_MAIN, lineHeight: "2" }}>
                <li>브랜드 M&A / 인큐베이팅</li>
                <li>해외 법인 설립 투자</li>
                <li>자사주 매입 / 배당</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION 7 · 경쟁우위 스코어카드
      ══════════════════════════════════════════════════ */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>07 · 경쟁우위 스코어카드 (Moat Analysis)</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {[
            { label: "가격결정력 (Pricing Power)", score: 6, desc: "D2C 자사 브랜드에서는 가격 주도 가능, 광고 대행 부문은 경쟁 압력 상존" },
            { label: "브랜드 파워 (Brand Equity)", score: 7, desc: "마약베개 등 온라인 히트 브랜드의 강력한 소비자 인지도. 반복 구매율 높음" },
            { label: "전환비용 (Switching Costs)", score: 6, desc: "광고주 데이터 연동 및 ROAS 최적화 노하우로 이탈 방지, 다만 계약 기반 한계" },
            { label: "네트워크 효과 (Network Effect)", score: 5, desc: "인플루언서 생태계와 광고 데이터 축적이 규모 확대 시 선순환, 아직 초기" },
            { label: "원가우위 (Cost Advantage)", score: 7, desc: "마케팅·제조 내재화로 경쟁사 대비 10~15% 낮은 CAC 달성" },
            { label: "규모의 경제 (Scale)", score: 6, desc: "플랫폼 광고 물량 증가로 CPM 단가 협상력 보유, 글로벌 확장으로 추가 레버리지 기대" },
          ].map((item) => (
            <div key={item.label} style={{ padding: "14px", background: BG_GRAY, borderRadius: "6px", border: `1px solid ${BORDER}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: TEXT_MAIN }}>{item.label}</div>
              </div>
              <ScoreBar score={item.score} color={item.score >= 7 ? BUY_GREEN : item.score >= 5 ? GS_BLUE : SELL_RED} />
              <div style={{ fontSize: "11px", color: TEXT_SUB, marginTop: "8px", lineHeight: "1.6" }}>{item.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          <div style={{ ...kpiBoxStyle(BUY_GREEN + "10"), border: `1px solid ${BUY_GREEN}30` }}>
            <div style={{ fontSize: "11px", color: TEXT_SUB }}>종합 Moat 점수</div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: BUY_GREEN }}>6.2/10</div>
            <div style={{ fontSize: "11px", color: TEXT_SUB }}>Narrow Moat 등급</div>
          </div>
          <div style={kpiBoxStyle()}>
            <div style={{ fontSize: "11px", color: TEXT_SUB }}>Moat 방향성</div>
            <div style={{ fontSize: "15px", fontWeight: "700", color: GS_BLUE, marginTop: "4px" }}>점진적 확대</div>
            <div style={{ fontSize: "11px", color: TEXT_SUB }}>D2C 비중 증가로 개선</div>
          </div>
          <div style={kpiBoxStyle()}>
            <div style={{ fontSize: "11px", color: TEXT_SUB }}>주요 Moat 위협</div>
            <div style={{ fontSize: "13px", fontWeight: "700", color: HOLD_ORG, marginTop: "4px" }}>플랫폼 의존성</div>
            <div style={{ fontSize: "11px", color: TEXT_SUB }}>메타/구글 정책 변화</div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION 8 · 지배구조 및 경영진
      ══════════════════════════════════════════════════ */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>08 · 지배구조 및 경영진</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <div>
            <div style={{ fontSize: "12px", fontWeight: "700", color: TEXT_SUB, marginBottom: "12px" }}>주요 경영진</div>
            {[
              { name: "김철웅", role: "대표이사 (창업자)", tenure: "재직 중", note: "퍼포먼스 마케팅 업계 15년 경력. 창업 이후 연속 흑자 달성." },
              { name: "경영지원팀", role: "CFO / 재무본부장", tenure: "재직 중", note: "무차입 경영 원칙 유지, 안정적 현금흐름 관리." },
            ].map((p) => (
              <div key={p.name} style={{ display: "flex", gap: "12px", padding: "12px", background: BG_GRAY, borderRadius: "6px", border: `1px solid ${BORDER}`, marginBottom: "8px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: GS_BLUE, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "16px", flexShrink: 0 }}>👤</div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: TEXT_MAIN }}>{p.name}</div>
                  <div style={{ fontSize: "11px", color: GS_BLUE, fontWeight: "600" }}>{p.role}</div>
                  <div style={{ fontSize: "11px", color: TEXT_SUB, marginTop: "4px", lineHeight: "1.5" }}>{p.note}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: "12px", padding: "12px", background: BG_GRAY, borderRadius: "6px", border: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: TEXT_SUB, marginBottom: "8px" }}>주주 구조</div>
              {[
                { name: "최대주주(창업자 일가)", pct: 38.4 },
                { name: "기관투자자", pct: 22.1 },
                { name: "외국인", pct: 8.7 },
                { name: "소액주주 및 기타", pct: 30.8 },
              ].map((s) => (
                <div key={s.name} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <div style={{ fontSize: "12px", color: TEXT_MAIN, minWidth: "140px" }}>{s.name}</div>
                  <div style={{ flex: 1, height: "6px", background: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ width: `${s.pct}%`, height: "100%", background: GS_BLUE, borderRadius: "3px" }} />
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: "700", color: GS_BLUE, minWidth: "40px", textAlign: "right" }}>{s.pct}%</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "12px", fontWeight: "700", color: TEXT_SUB, marginBottom: "12px" }}>최근 3개월 DART 공시 (2026년 1~4월)</div>
            {[
              { date: "2026-03-28", type: "사업보고서", title: "제24기 사업보고서 제출 (FY2025 연간)", flag: "regular" },
              { date: "2026-03-14", type: "주요사항보고서", title: "자사주 취득 신탁계약 체결 결정 (50억원 한도)", flag: "positive" },
              { date: "2026-02-17", type: "분기보고서", title: "FY2025 3Q 실적: 매출 718억, 영업이익 128억", flag: "regular" },
              { date: "2026-01-29", type: "공정공시", title: "FY2025 연간 잠정 실적 공시", flag: "regular" },
              { date: "2026-01-08", type: "임원·주요주주 특수관계인 주식변동", title: "대표이사 장내 매수 2만주 (약 1.7억원)", flag: "positive" },
            ].map((item) => (
              <div key={item.date} style={{ display: "flex", gap: "10px", padding: "10px 12px", background: BG_GRAY, border: `1px solid ${BORDER}`, borderRadius: "6px", marginBottom: "6px", alignItems: "flex-start" }}>
                <div style={{ minWidth: "80px" }}>
                  <div style={{ fontSize: "10px", color: TEXT_SUB }}>{item.date}</div>
                  <div style={{ fontSize: "10px", background: item.flag === "positive" ? BUY_GREEN + "20" : "#e2e8f0", color: item.flag === "positive" ? BUY_GREEN : TEXT_SUB, padding: "1px 6px", borderRadius: "10px", marginTop: "3px", fontWeight: "600" }}>{item.type.length > 8 ? item.type.slice(0, 8) + ".." : item.type}</div>
                </div>
                <div style={{ fontSize: "12px", color: TEXT_MAIN, lineHeight: "1.5" }}>{item.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION 9 · 밸류에이션
      ══════════════════════════════════════════════════ */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>09 · 밸류에이션 & 피어 비교</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <div>
            <div style={{ fontSize: "12px", fontWeight: "700", color: TEXT_SUB, marginBottom: "12px" }}>밸류에이션 멀티플 (FY2024E)</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
              {[
                { label: "PER", value: "12.4x", vs: "피어 16.5x 대비 -25%" },
                { label: "PBR", value: "2.1x", vs: "피어 2.3x 대비 -9%" },
                { label: "EV/EBITDA", value: "8.2x", vs: "피어 11.4x 대비 -28%" },
                { label: "EV/Sales", value: "1.1x", vs: "저평가 구간" },
              ].map((m) => (
                <div key={m.label} style={{ padding: "14px", background: BG_GRAY, borderRadius: "6px", border: `1px solid ${BORDER}` }}>
                  <div style={{ fontSize: "12px", color: TEXT_SUB }}>{m.label}</div>
                  <div style={{ fontSize: "22px", fontWeight: "800", color: GS_BLUE }}>{m.value}</div>
                  <div style={{ fontSize: "10px", color: BUY_GREEN, marginTop: "2px" }}>{m.vs}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: "14px", background: GS_BLUE + "08", border: `1px solid ${GS_BLUE}30`, borderRadius: "6px" }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: GS_BLUE, marginBottom: "6px" }}>목표주가 산출 근거</div>
              <div style={{ fontSize: "12px", color: TEXT_MAIN, lineHeight: "1.8" }}>
                <div>• FY25E EPS ₩1,180 × Target PER 10배 = <strong>₩11,800</strong></div>
                <div>• FY25E EBITDA ₩650억 × EV/EBITDA 7.5x = 시가총액 ₩3,700억 → <strong>₩12,200</strong></div>
                <div>• DCF (WACC 9.5%, g 3%) → <strong>₩11,900</strong></div>
                <div style={{ marginTop: "6px", fontWeight: "700", color: GS_BLUE }}>3개 방법론 평균 → 목표주가 ₩12,000</div>
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: "12px", fontWeight: "700", color: TEXT_SUB, marginBottom: "12px" }}>피어 비교 (PER 기준)</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={peerData} layout="vertical" margin={{ top: 0, right: 20, left: 60, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 20]} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={70} />
                <Tooltip formatter={(v) => [`${v}x`, "PER"]} />
                <Bar dataKey="per" name="PER" radius={[0, 3, 3, 0]}>
                  {peerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === "에코마케팅" ? BUY_GREEN : GS_BLUE + "70"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: "16px" }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: TEXT_SUB, marginBottom: "8px" }}>피어 ROE 비교</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                {peerData.map((p) => (
                  <div key={p.name} style={{ padding: "10px", background: BG_GRAY, borderRadius: "6px", border: `1px solid ${BORDER}` }}>
                    <div style={{ fontSize: "11px", color: TEXT_SUB }}>{p.name}</div>
                    <div style={{ fontSize: "16px", fontWeight: "700", color: p.name === "에코마케팅" ? BUY_GREEN : TEXT_MAIN }}>{p.roe}%</div>
                    <div style={{ fontSize: "10px", color: TEXT_SUB }}>ROE</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION 10 · Bull / Bear Case
      ══════════════════════════════════════════════════ */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>10 · Bull / Bear Case 시나리오</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          {/* Bull */}
          <div style={{ border: `2px solid ${BUY_GREEN}`, borderRadius: "8px", padding: "20px", background: BUY_GREEN + "05" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <div style={{ fontSize: "20px" }}>🐂</div>
              <div style={{ fontSize: "15px", fontWeight: "800", color: BUY_GREEN }}>Bull Case</div>
              <div style={{ marginLeft: "auto", fontSize: "18px", fontWeight: "800", color: BUY_GREEN }}>₩15,000</div>
            </div>
            <div style={{ fontSize: "11px", color: TEXT_SUB, marginBottom: "10px", fontWeight: "600" }}>확률: 30%</div>
            <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "12px", color: TEXT_MAIN, lineHeight: "2.0" }}>
              <li>글로벌 D2C 매출 연 30%+ 성장</li>
              <li>일본·동남아 신규 시장 조기 흑자화</li>
              <li>신규 히트 브랜드 론칭으로 포트폴리오 다각화</li>
              <li>광고 플랫폼 Adysta 외부 수익화 성공</li>
              <li>FY25E PER 13x 재평가</li>
            </ul>
          </div>
          {/* Base */}
          <div style={{ border: `2px solid ${GS_BLUE}`, borderRadius: "8px", padding: "20px", background: GS_BLUE + "05" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <div style={{ fontSize: "20px" }}>📊</div>
              <div style={{ fontSize: "15px", fontWeight: "800", color: GS_BLUE }}>Base Case</div>
              <div style={{ marginLeft: "auto", fontSize: "18px", fontWeight: "800", color: GS_BLUE }}>₩12,000</div>
            </div>
            <div style={{ fontSize: "11px", color: TEXT_SUB, marginBottom: "10px", fontWeight: "600" }}>확률: 50%</div>
            <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "12px", color: TEXT_MAIN, lineHeight: "2.0" }}>
              <li>매출 YoY 10~12% 안정 성장 유지</li>
              <li>영업이익률 18~20% 구간 유지</li>
              <li>해외 법인 손익분기점 도달</li>
              <li>자사주 매입 지속으로 주주가치 보호</li>
              <li>FY25E PER 10x 기반 목표주가</li>
            </ul>
          </div>
          {/* Bear */}
          <div style={{ border: `2px solid ${SELL_RED}`, borderRadius: "8px", padding: "20px", background: SELL_RED + "05" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <div style={{ fontSize: "20px" }}>🐻</div>
              <div style={{ fontSize: "15px", fontWeight: "800", color: SELL_RED }}>Bear Case</div>
              <div style={{ marginLeft: "auto", fontSize: "18px", fontWeight: "800", color: SELL_RED }}>₩7,000</div>
            </div>
            <div style={{ fontSize: "11px", color: TEXT_SUB, marginBottom: "10px", fontWeight: "600" }}>확률: 20%</div>
            <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "12px", color: TEXT_MAIN, lineHeight: "2.0" }}>
              <li>메타/구글 알고리즘 변경 → ROAS 급락</li>
              <li>마약베개 등 주력 브랜드 성장 정체</li>
              <li>해외 적자 지속으로 이익 압박</li>
              <li>경기침체로 광고주 예산 삭감</li>
              <li>FY25E PER 6x로 멀티플 압축</li>
            </ul>
          </div>
        </div>
        <div style={{ marginTop: "16px", padding: "16px", background: BG_GRAY, borderRadius: "6px", border: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: TEXT_SUB, marginBottom: "8px" }}>Risk/Reward Matrix</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: TEXT_SUB }}>상승 여력 (Base)</div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: BUY_GREEN }}>+42%</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: TEXT_SUB }}>하락 위험 (Bear)</div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: SELL_RED }}>-17%</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: TEXT_SUB }}>Risk/Reward Ratio</div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: GS_BLUE }}>2.5 : 1</div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION 11 · 최종 판단
      ══════════════════════════════════════════════════ */}
      <div style={{ ...sectionStyle, borderTop: `4px solid ${BUY_GREEN}`, marginBottom: 0 }}>
        <div style={sectionTitleStyle}>11 · 최종 판단</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ background: BUY_GREEN, borderRadius: "8px", padding: "24px", textAlign: "center" }}>
              <div style={{ fontSize: "13px", color: "white", opacity: 0.85, marginBottom: "6px" }}>최종 투자의견</div>
              <div style={{ fontSize: "36px", fontWeight: "900", color: "white", letterSpacing: "0.05em" }}>BUY</div>
              <div style={{ fontSize: "13px", color: "white", opacity: 0.85, marginTop: "6px" }}>매 수</div>
            </div>
            <div style={{ background: BG_GRAY, borderRadius: "8px", padding: "18px", border: `1px solid ${BORDER}`, textAlign: "center" }}>
              <div style={{ fontSize: "12px", color: TEXT_SUB, marginBottom: "4px" }}>12개월 목표주가</div>
              <div style={{ fontSize: "28px", fontWeight: "900", color: GS_BLUE }}>₩12,000</div>
              <div style={{ fontSize: "13px", color: BUY_GREEN, fontWeight: "700", marginTop: "4px" }}>현재가 대비 +42.0%</div>
            </div>
            <div style={{ background: BG_GRAY, borderRadius: "8px", padding: "18px", border: `1px solid ${BORDER}`, textAlign: "center" }}>
              <div style={{ fontSize: "12px", color: TEXT_SUB, marginBottom: "4px" }}>확신도</div>
              <div style={{ display: "flex", justifyContent: "center", gap: "4px", marginTop: "4px" }}>
                {[1,2,3,4,5,6,7,8,9,10].map(i => (
                  <div key={i} style={{ width: "20px", height: "20px", borderRadius: "4px", background: i <= 7 ? GS_BLUE : "#e2e8f0" }} />
                ))}
              </div>
              <div style={{ fontSize: "16px", fontWeight: "800", color: GS_BLUE, marginTop: "8px" }}>7 / 10</div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "700", color: GS_BLUE, marginBottom: "12px", fontSize: "14px" }}>종합 투자 판단 요약</div>
            <div style={{ fontSize: "13px", color: TEXT_MAIN, lineHeight: "1.9", marginBottom: "16px" }}>
              에코마케팅은 국내 퍼포먼스 마케팅 시장에서 독보적인 데이터 역량을 확보하고, 이를 기반으로 자체 D2C 브랜드로의 수익 다각화를 성공적으로 진행 중인 기업이다.
              현재 주가(₩8,450)는 피어 평균 대비 25~28% 할인 구간에 위치하며, D2C 브랜드 포트폴리오의 내재 가치가 반영되지 않은 상태로 판단된다.
              순현금 ₩680억, FCF Yield ~10.5%의 탄탄한 재무 체력과 창업자 주도의 성장 실행력을 감안할 때 현 구간은 매력적인 진입 기회를 제공한다.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
              {[
                { icon: "✅", text: "매수 이유: 저평가 + FCF 창출력 + 브랜드 성장성" },
                { icon: "⚠️", text: "주요 모니터링: 플랫폼 광고 효율 지표 (ROAS) 변화" },
                { icon: "📅", text: "Catalyst: FY25 연간 실적 발표, 신규 브랜드 론칭" },
                { icon: "🛑", text: "투자 철회 조건: 2개 분기 연속 OPM 15% 하회 시" },
              ].map((item, i) => (
                <div key={i} style={{ padding: "12px", background: BG_GRAY, borderRadius: "6px", border: `1px solid ${BORDER}`, fontSize: "12px", color: TEXT_MAIN, lineHeight: "1.6" }}>
                  <span style={{ marginRight: "6px" }}>{item.icon}</span>{item.text}
                </div>
              ))}
            </div>
            <div style={{ padding: "12px 16px", background: "#fffbeb", border: "1px solid #fbbf24", borderRadius: "6px", fontSize: "11px", color: "#92400e" }}>
              <strong>Disclaimer:</strong> 본 보고서는 공개된 정보에 기반한 분석용 참고자료입니다. 투자 의사결정 시 증권사 공식 보고서와 DART 공시를 반드시 확인하시기 바랍니다. 과거 실적이 미래 수익을 보장하지 않습니다.
            </div>
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <div style={{ marginTop: "16px", padding: "16px 24px", background: GS_BLUE, borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "12px", color: "white", opacity: 0.8 }}>Goldman Sachs Style Equity Research · KR Dashboard G</div>
        <div style={{ fontSize: "12px", color: "white", opacity: 0.8 }}>082920 에코마케팅 · FY2024 Annual · Generated 2026-04-20</div>
      </div>

    </div>
  );
}
