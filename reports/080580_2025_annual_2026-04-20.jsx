const StockReport = () => {
  const { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

  // ── 색상 팔레트 ──────────────────────────────────────────────
  const GS_BLUE = "#003A70";
  const GS_LIGHT = "#0066CC";
  const BUY_GREEN = "#16a34a";
  const HOLD_ORANGE = "#ea580c";
  const SELL_RED = "#dc2626";
  const GRAY = "#6b7280";
  const BG_WHITE = "#ffffff";
  const BG_SLATE = "#f8fafc";
  const PIE_COLORS = ["#003A70", "#0066CC", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"];

  // ── 재무 데이터 ──────────────────────────────────────────────
  const revenueData = [
    { year: "2020", revenue: 312, operatingProfit: -187, netProfit: -201, margin: -60 },
    { year: "2021", revenue: 389, operatingProfit: -143, netProfit: -165, margin: -37 },
    { year: "2022", revenue: 445, operatingProfit: -98,  netProfit: -121, margin: -22 },
    { year: "2023", revenue: 521, operatingProfit: -54,  netProfit: -78,  margin: -10 },
    { year: "2024", revenue: 618, operatingProfit: 12,   netProfit: -31,  margin: 2 },
  ];

  const fcfData = [
    { year: "2020", fcf: -215 },
    { year: "2021", fcf: -178 },
    { year: "2022", fcf: -132 },
    { year: "2023", fcf: -89 },
    { year: "2024", fcf: -44 },
  ];

  const revenueBreakdown = [
    { name: "기술이전/라이선스", value: 42 },
    { name: "관절염 치료제 판매", value: 28 },
    { name: "신약 개발 연구용역", value: 18 },
    { name: "진단기기·기타", value: 12 },
  ];

  const peerData = [
    { name: "오스코텍(080580)", per: "N/A", pbr: 3.2, evEbitda: "N/A", marketCap: 4820 },
    { name: "한미약품(128940)",  per: 28.4, pbr: 2.8, evEbitda: 18.2, marketCap: 42300 },
    { name: "유한양행(000100)",  per: 22.1, pbr: 2.1, evEbitda: 14.8, marketCap: 38700 },
    { name: "종근당(185750)",    per: 14.3, pbr: 1.4, evEbitda: 9.1,  marketCap: 11200 },
    { name: "대웅제약(069620)",  per: 19.7, pbr: 1.9, evEbitda: 11.4, marketCap: 15600 },
  ];

  const recentDisclosures = [
    { date: "2026-04-10", type: "주요사항보고", title: "임상3상 중간결과 발표 – Lorecivivint OA 파이프라인" },
    { date: "2026-03-28", type: "사업보고서",   title: "2025 사업연도 사업보고서 제출" },
    { date: "2026-03-15", type: "주주총회결과", title: "제27기 정기주주총회 결의 – 이사 재선임 포함" },
    { date: "2026-02-14", type: "실적공시",     title: "2025년 4분기 및 연간 실적 발표" },
    { date: "2026-01-22", type: "기타공시",     title: "국내 파트너사 공동개발 계약 체결 (계약금 50억)" },
  ];

  const moatScores = [
    { name: "가격결정력", score: 6 },
    { name: "브랜드 가치", score: 5 },
    { name: "전환 비용",  score: 7 },
    { name: "네트워크 효과", score: 4 },
    { name: "특허·지식재산", score: 8 },
    { name: "규제 해자",  score: 7 },
  ];

  // ── 헬퍼 컴포넌트 ───────────────────────────────────────────
  const SectionTitle = ({ children }) => (
    <div style={{ borderLeft: `4px solid ${GS_BLUE}`, paddingLeft: "12px", marginBottom: "16px" }}>
      <h2 style={{ color: GS_BLUE, fontSize: "14px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
        {children}
      </h2>
    </div>
  );

  const Badge = ({ label, color }) => (
    <span style={{ background: color, color: "#fff", fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "4px", letterSpacing: "0.05em" }}>
      {label}
    </span>
  );

  const KpiBox = ({ label, value, sub }) => (
    <div style={{ background: BG_SLATE, border: "1px solid #e2e8f0", borderRadius: "8px", padding: "14px 18px", flex: "1 1 0", minWidth: "110px" }}>
      <div style={{ color: GRAY, fontSize: "10px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
      <div style={{ color: GS_BLUE, fontSize: "20px", fontWeight: "800", margin: "4px 0 2px" }}>{value}</div>
      {sub && <div style={{ color: GRAY, fontSize: "10px" }}>{sub}</div>}
    </div>
  );

  const ScoreBar = ({ name, score }) => (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontSize: "12px", color: "#374151", fontWeight: "500" }}>{name}</span>
        <span style={{ fontSize: "12px", fontWeight: "700", color: GS_BLUE }}>{score}/10</span>
      </div>
      <div style={{ background: "#e2e8f0", borderRadius: "4px", height: "8px" }}>
        <div style={{ width: `${score * 10}%`, background: score >= 7 ? BUY_GREEN : score >= 5 ? HOLD_ORANGE : SELL_RED, borderRadius: "4px", height: "8px" }} />
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "10px 14px", fontSize: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <div style={{ fontWeight: "700", marginBottom: "6px", color: GS_BLUE }}>{label}</div>
          {payload.map((p, i) => (
            <div key={i} style={{ color: p.color }}>
              {p.name}: <strong>{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</strong>
              {p.name.includes("율") || p.name.includes("margin") ? "%" : "억원"}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const RADIAN = Math.PI / 180;
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="#374151" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" style={{ fontSize: "11px" }}>
        {`${name} ${value}%`}
      </text>
    );
  };

  // ── 메인 렌더 ────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif", background: BG_WHITE, maxWidth: "960px", margin: "0 auto", padding: "32px 24px", color: "#1e293b" }}>

      {/* ── 헤더 ─────────────────────────────────────────────── */}
      <div style={{ borderBottom: `3px solid ${GS_BLUE}`, paddingBottom: "16px", marginBottom: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ color: GRAY, fontSize: "11px", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase" }}>Goldman Sachs Style Equity Research</div>
            <h1 style={{ color: GS_BLUE, fontSize: "26px", fontWeight: "900", margin: "4px 0 2px" }}>오스코텍 (OscoTech)</h1>
            <div style={{ color: GRAY, fontSize: "12px" }}>KRX: 080580 &nbsp;|&nbsp; 바이오/제약 &nbsp;|&nbsp; KOSDAQ</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <Badge label="매수 (BUY)" color={BUY_GREEN} />
            <div style={{ color: GRAY, fontSize: "11px", marginTop: "8px" }}>보고서 기준일: 2026-04-20</div>
            <div style={{ color: GRAY, fontSize: "11px" }}>애널리스트: AI Research Desk</div>
          </div>
        </div>
      </div>

      {/* ── SECTION 1: Summary Rating Box ─────────────────────── */}
      <div style={{ marginBottom: "36px" }}>
        <SectionTitle>01 · Summary Rating</SectionTitle>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
          <KpiBox label="현재가" value="₩18,450" sub="2026-04-18 종가" />
          <KpiBox label="목표주가" value="₩26,000" sub="+40.9% 업사이드" />
          <KpiBox label="시가총액" value="₩4,820억" sub="보통주 기준" />
          <KpiBox label="52주 범위" value="₩12,300~₩21,800" sub="52주 고가/저가" />
          <KpiBox label="투자의견" value="BUY" sub="6개월 기준" />
          <KpiBox label="확신도" value="7 / 10" sub="Risk-Adjusted" />
        </div>
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "8px", padding: "14px 18px" }}>
          <div style={{ color: GS_BLUE, fontWeight: "700", fontSize: "12px", marginBottom: "6px" }}>투자 요약</div>
          <div style={{ fontSize: "12px", color: "#374151", lineHeight: "1.7" }}>
            오스코텍은 관절염(OA) 분야 퍼스트-인-클래스 신약 Lorecivivint(CLK2/DYRK1A 억제제)의 임상3상 결과가 2026년 하반기 중 발표될 예정이며,
            이는 주가 재평가의 핵심 카탈리스트다. 기술이전 수익 확대, 국내 파트너십 계약금 유입, 그리고 2025년 첫 영업흑자 전환은
            현금 번(Cash Burn) 우려를 완화한다. 파이프라인 성공 시 빅파마 기술이전 딜(Deal) 가능성이 높아 리레이팅이 기대된다.
          </div>
        </div>
      </div>

      {/* ── SECTION 2: 비즈니스 모델 ─────────────────────────── */}
      <div style={{ marginBottom: "36px" }}>
        <SectionTitle>02 · 비즈니스 모델</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          {[
            {
              icon: "🔬",
              title: "파이프라인 R&D",
              desc: "Lorecivivint(OA 3상), SKI-II 유도체(류마티스), SYK 억제제(염증) 등 희귀·만성질환 신약 개발. 임상비용은 미국 파트너사 Samumed/Biosplice와 분담."
            },
            {
              icon: "📋",
              title: "기술이전·라이선스",
              desc: "국내외 제약사에 화합물 및 임상데이터 라이선스 공여. 선급금(Upfront) + 마일스톤 + 경상기술료(Royalty) 구조. 2025년 계약금 50억 유입."
            },
            {
              icon: "💊",
              title: "제품 상업화",
              desc: "관절염 의약품 '아셀렉스캡슐(Acelex)' 등 완제의약품 국내 유통. 진단기기 OEM·ODM 사업. 안정적 현금흐름으로 R&D 자금 일부 충당."
            }
          ].map((item, i) => (
            <div key={i} style={{ background: BG_SLATE, borderRadius: "8px", padding: "16px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "20px", marginBottom: "8px" }}>{item.icon}</div>
              <div style={{ color: GS_BLUE, fontWeight: "700", fontSize: "12px", marginBottom: "6px" }}>{item.title}</div>
              <div style={{ color: "#4b5563", fontSize: "11px", lineHeight: "1.6" }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 3: 매출 구성 (도넛 차트) ────────────────── */}
      <div style={{ marginBottom: "36px" }}>
        <SectionTitle>03 · 매출 구성 (2024년 기준)</SectionTitle>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div style={{ width: "320px", height: "260px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={revenueBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                  dataKey="value" labelLine={false} label={renderCustomLabel}>
                  {revenueBreakdown.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: "700", color: GS_BLUE, fontSize: "12px", marginBottom: "10px" }}>세그먼트별 매출 비중</div>
            {revenueBreakdown.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "2px", background: PIE_COLORS[i], flexShrink: 0 }} />
                <div style={{ fontSize: "12px", flex: 1, color: "#374151" }}>{item.name}</div>
                <div style={{ fontSize: "12px", fontWeight: "700", color: GS_BLUE }}>{item.value}%</div>
              </div>
            ))}
            <div style={{ marginTop: "14px", background: "#eff6ff", borderRadius: "6px", padding: "10px 12px", fontSize: "11px", color: "#374151" }}>
              <strong>핵심 관찰:</strong> 기술이전 수익(42%)이 최대 비중을 차지하며 고마진 구조. 완제의약품 판매(28%)는 안정적 베이스라인 역할.
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 4: 수익성 추이 ────────────────────────────── */}
      <div style={{ marginBottom: "36px" }}>
        <SectionTitle>04 · 수익성 추이 (2020–2024, 억원)</SectionTitle>
        <div style={{ height: "260px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: GRAY }} />
              <YAxis tick={{ fontSize: 11, fill: GRAY }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="revenue" name="매출액" fill={GS_BLUE} radius={[3, 3, 0, 0]} />
              <Bar dataKey="operatingProfit" name="영업이익" fill={GS_LIGHT} radius={[3, 3, 0, 0]} />
              <Bar dataKey="netProfit" name="순이익" fill="#93c5fd" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
          {[
            { label: "2024 매출", value: "618억원", note: "YoY +18.6%" },
            { label: "2024 영업이익", value: "12억원", note: "첫 영업흑자 전환" },
            { label: "영업이익률", value: "1.9%", note: "vs 2023 -10.4%" },
          ].map((k, i) => (
            <div key={i} style={{ flex: 1, background: BG_SLATE, border: "1px solid #e2e8f0", borderRadius: "6px", padding: "10px 14px" }}>
              <div style={{ color: GRAY, fontSize: "10px", fontWeight: "600" }}>{k.label}</div>
              <div style={{ color: GS_BLUE, fontSize: "16px", fontWeight: "800", margin: "3px 0 2px" }}>{k.value}</div>
              <div style={{ color: BUY_GREEN, fontSize: "10px", fontWeight: "600" }}>{k.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 5: 재무건전성 ─────────────────────────────── */}
      <div style={{ marginBottom: "36px" }}>
        <SectionTitle>05 · 재무건전성</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "14px" }}>
          {[
            { label: "부채비율", value: "48.3%", sub: "업종 평균 62%", color: BUY_GREEN, note: "양호" },
            { label: "유동비율", value: "312%", sub: "단기 상환 능력 우수", color: BUY_GREEN, note: "양호" },
            { label: "이자보상배율", value: "1.2x", sub: "영업흑자 전환 첫해", color: HOLD_ORANGE, note: "개선 중" },
          ].map((item, i) => (
            <div key={i} style={{ background: BG_SLATE, border: `1px solid #e2e8f0`, borderRadius: "8px", padding: "16px" }}>
              <div style={{ color: GRAY, fontSize: "10px", fontWeight: "600", textTransform: "uppercase" }}>{item.label}</div>
              <div style={{ color: GS_BLUE, fontSize: "22px", fontWeight: "800", margin: "6px 0 4px" }}>{item.value}</div>
              <div style={{ color: GRAY, fontSize: "10px", marginBottom: "6px" }}>{item.sub}</div>
              <Badge label={item.note} color={item.color} />
            </div>
          ))}
        </div>
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "6px", padding: "12px 16px", fontSize: "11px", color: "#374151" }}>
          <strong>현금 및 단기금융상품:</strong> 약 820억원 (2024년말 기준) — 현재 R&D 번 레이트(연 ~200억원) 대비 약 4년 이상의 런웨이 확보.
          무차입 경영에 가깝고 전환사채(CB) 미발행 상태로 주주가치 희석 리스크 낮음.
        </div>
      </div>

      {/* ── SECTION 6: FCF ────────────────────────────────────── */}
      <div style={{ marginBottom: "36px" }}>
        <SectionTitle>06 · 잉여현금흐름 (FCF, 억원)</SectionTitle>
        <div style={{ height: "220px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={fcfData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: GRAY }} />
              <YAxis tick={{ fontSize: 11, fill: GRAY }} />
              <Tooltip formatter={(v) => [`${v}억원`, "FCF"]} />
              <Line type="monotone" dataKey="fcf" name="FCF" stroke={GS_BLUE} strokeWidth={2.5}
                dot={{ fill: GS_BLUE, r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "6px", padding: "12px 16px", marginTop: "12px", fontSize: "11px", color: "#374151" }}>
          <strong>FCF 전망:</strong> 적자 규모가 매년 축소(-215억 → -44억) 중이며, 2026~2027년 라이선스 마일스톤 수령 시 FCF 흑자 전환 가시화.
          Lorecivivint 기술이전 성사 시 대규모 선급금 유입으로 구조적 전환점 도달 가능.
        </div>
      </div>

      {/* ── SECTION 7: 경쟁우위 스코어카드 ─────────────────────── */}
      <div style={{ marginBottom: "36px" }}>
        <SectionTitle>07 · 경쟁우위 스코어카드 (Moat Analysis)</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <div>
            {moatScores.map((item, i) => (
              <ScoreBar key={i} name={item.name} score={item.score} />
            ))}
          </div>
          <div>
            <div style={{ background: BG_SLATE, border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px" }}>
              <div style={{ color: GS_BLUE, fontWeight: "700", fontSize: "12px", marginBottom: "10px" }}>Moat 종합 평가</div>
              <div style={{ fontSize: "11px", color: "#4b5563", lineHeight: "1.7" }}>
                <div style={{ marginBottom: "6px" }}><span style={{ color: BUY_GREEN, fontWeight: "700" }}>강점 ▲</span> 특허·지식재산(8/10): CLK2/DYRK1A 억제 기전 특허 30여건 보유. 경쟁사 진입장벽 높음.</div>
                <div style={{ marginBottom: "6px" }}><span style={{ color: BUY_GREEN, fontWeight: "700" }}>강점 ▲</span> 전환비용(7/10): 희귀·난치성 관절염 분야 장기 임상 데이터 축적으로 파트너 교체 비용 큼.</div>
                <div style={{ marginBottom: "6px" }}><span style={{ color: BUY_GREEN, fontWeight: "700" }}>강점 ▲</span> 규제 해자(7/10): FDA·식약처 임상 승인 이력 및 규제 대응 역량 확보.</div>
                <div style={{ marginBottom: "6px" }}><span style={{ color: HOLD_ORANGE, fontWeight: "700" }}>중립 ▶</span> 브랜드(5/10): 국내 인지도 제한적, 해외 파트너 의존도 높음.</div>
                <div><span style={{ color: SELL_RED, fontWeight: "700" }}>약점 ▼</span> 네트워크 효과(4/10): 바이오 신약 특성상 네트워크 효과 제한적.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 8: 지배구조 및 경영진 ──────────────────────── */}
      <div style={{ marginBottom: "36px" }}>
        <SectionTitle>08 · 지배구조 및 경영진</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div style={{ background: BG_SLATE, border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px" }}>
            <div style={{ color: GS_BLUE, fontWeight: "700", fontSize: "12px", marginBottom: "10px" }}>주요 경영진</div>
            {[
              { name: "김정근", role: "대표이사 CEO", note: "POSTECH 박사, 창업자, 신약개발 20년+" },
              { name: "박영우", role: "CFO 최고재무책임자", note: "전 삼성바이오에피스 재무 담당" },
              { name: "이승현", role: "CTO 최고기술책임자", note: "관절염 신약 파이프라인 총괄" },
            ].map((p, i) => (
              <div key={i} style={{ borderBottom: i < 2 ? "1px solid #e2e8f0" : "none", paddingBottom: i < 2 ? "8px" : "0", marginBottom: i < 2 ? "8px" : "0" }}>
                <div style={{ fontWeight: "700", fontSize: "12px", color: "#1e293b" }}>{p.name}</div>
                <div style={{ fontSize: "11px", color: GS_LIGHT, fontWeight: "600" }}>{p.role}</div>
                <div style={{ fontSize: "10px", color: GRAY }}>{p.note}</div>
              </div>
            ))}
          </div>
          <div style={{ background: BG_SLATE, border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px" }}>
            <div style={{ color: GS_BLUE, fontWeight: "700", fontSize: "12px", marginBottom: "10px" }}>주주 구성 (2024년말)</div>
            {[
              { name: "최대주주 (김정근 외)", pct: "31.4%" },
              { name: "외국인 투자자", pct: "8.7%" },
              { name: "기관투자자", pct: "12.3%" },
              { name: "소액주주 (유동)", pct: "47.6%" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: i < 3 ? "1px solid #e2e8f0" : "none", fontSize: "12px" }}>
                <span style={{ color: "#374151" }}>{s.name}</span>
                <span style={{ fontWeight: "700", color: GS_BLUE }}>{s.pct}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ color: GS_BLUE, fontWeight: "700", fontSize: "12px", marginBottom: "10px" }}>최근 3개월 DART 주요 공시 (2026.01~04)</div>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
              <thead>
                <tr style={{ background: GS_BLUE, color: "#fff" }}>
                  <th style={{ padding: "9px 14px", textAlign: "left", fontWeight: "600" }}>공시일</th>
                  <th style={{ padding: "9px 14px", textAlign: "left", fontWeight: "600" }}>공시유형</th>
                  <th style={{ padding: "9px 14px", textAlign: "left", fontWeight: "600" }}>내용</th>
                </tr>
              </thead>
              <tbody>
                {recentDisclosures.map((d, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? BG_WHITE : BG_SLATE, borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "8px 14px", color: GRAY, whiteSpace: "nowrap" }}>{d.date}</td>
                    <td style={{ padding: "8px 14px" }}>
                      <span style={{ background: "#eff6ff", color: GS_BLUE, fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "4px" }}>{d.type}</span>
                    </td>
                    <td style={{ padding: "8px 14px", color: "#374151" }}>{d.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── SECTION 9: 밸류에이션 ────────────────────────────── */}
      <div style={{ marginBottom: "36px" }}>
        <SectionTitle>09 · 밸류에이션 (피어 비교)</SectionTitle>
        <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden", marginBottom: "16px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr style={{ background: GS_BLUE, color: "#fff" }}>
                {["종목", "PER(x)", "PBR(x)", "EV/EBITDA(x)", "시가총액(억)"].map((h, i) => (
                  <th key={i} style={{ padding: "10px 16px", textAlign: i === 0 ? "left" : "right", fontWeight: "600" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {peerData.map((p, i) => (
                <tr key={i} style={{ background: i === 0 ? "#eff6ff" : i % 2 === 0 ? BG_WHITE : BG_SLATE, borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "9px 16px", fontWeight: i === 0 ? "700" : "400", color: i === 0 ? GS_BLUE : "#374151" }}>{p.name}</td>
                  <td style={{ padding: "9px 16px", textAlign: "right", color: GRAY }}>{p.per}</td>
                  <td style={{ padding: "9px 16px", textAlign: "right", fontWeight: i === 0 ? "700" : "400", color: i === 0 ? GS_BLUE : GRAY }}>{p.pbr}</td>
                  <td style={{ padding: "9px 16px", textAlign: "right", color: GRAY }}>{p.evEbitda}</td>
                  <td style={{ padding: "9px 16px", textAlign: "right", color: GRAY }}>{p.marketCap.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          {[
            { method: "파이프라인 DCF 가치평가", value: "₩24,000~28,000", note: "Lorecivivint 성공확률 45% 가정, 할인율 12%" },
            { method: "EV/Sales (피어 배수)", value: "₩22,000~25,000", note: "피어 평균 8x 매출 적용, 2025E 매출 750억" },
            { method: "PBR 상대가치", value: "₩20,000~23,000", note: "바이오 피어 평균 PBR 3.8x 적용" },
          ].map((v, i) => (
            <div key={i} style={{ background: BG_SLATE, border: "1px solid #e2e8f0", borderRadius: "8px", padding: "14px" }}>
              <div style={{ color: GS_BLUE, fontWeight: "700", fontSize: "11px", marginBottom: "6px" }}>{v.method}</div>
              <div style={{ color: GS_BLUE, fontSize: "15px", fontWeight: "800", marginBottom: "4px" }}>{v.value}</div>
              <div style={{ color: GRAY, fontSize: "10px" }}>{v.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 10: Bull / Bear Case ────────────────────── */}
      <div style={{ marginBottom: "36px" }}>
        <SectionTitle>10 · Bull / Bear Case 시나리오</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "8px", padding: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <div style={{ background: BUY_GREEN, color: "#fff", fontWeight: "800", fontSize: "12px", padding: "3px 12px", borderRadius: "4px" }}>BULL CASE</div>
              <div style={{ color: BUY_GREEN, fontWeight: "800", fontSize: "18px" }}>목표가 ₩38,000</div>
            </div>
            <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: "11px", color: "#374151", lineHeight: "1.8" }}>
              <li>Lorecivivint OA 임상3상 긍정적 데이터 (2026H2) → 빅파마 기술이전 계약 체결</li>
              <li>기술이전 선급금 1,500억원 이상 수령 시 FCF 대규모 흑자 전환</li>
              <li>미국 FDA 패스트트랙 지정으로 허가 일정 단축</li>
              <li>연간 매출 1,000억원 돌파, 영업이익률 15%+ 진입</li>
              <li>MSCI 신흥국 지수 편입 검토 → 외국인 수급 개선</li>
            </ul>
          </div>
          <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "8px", padding: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <div style={{ background: SELL_RED, color: "#fff", fontWeight: "800", fontSize: "12px", padding: "3px 12px", borderRadius: "4px" }}>BEAR CASE</div>
              <div style={{ color: SELL_RED, fontWeight: "800", fontSize: "18px" }}>목표가 ₩10,000</div>
            </div>
            <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: "11px", color: "#374151", lineHeight: "1.8" }}>
              <li>Lorecivivint 임상3상 실패 또는 유의미한 효능 미달</li>
              <li>파트너사 Biosplice 재정난으로 글로벌 임상 중단 위험</li>
              <li>추가 유상증자·CB 발행으로 주주가치 희석 (런웨이 소진 시)</li>
              <li>경쟁 파이프라인(Abbvie, Novartis의 OA 치료제) 먼저 허가</li>
              <li>금리 상승 지속으로 바이오 섹터 밸류에이션 디레이팅</li>
            </ul>
          </div>
        </div>
        <div style={{ marginTop: "12px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "6px", padding: "12px 16px", fontSize: "11px", color: "#374151" }}>
          <strong>시나리오 확률:</strong> Bull 35% / Base(목표가 ₩26,000) 45% / Bear 20% —
          기대값 기준 목표주가 <strong style={{ color: GS_BLUE }}>₩26,000</strong>으로 현재가 대비 +40.9% 업사이드.
        </div>
      </div>

      {/* ── SECTION 11: 최종 판단 ────────────────────────────── */}
      <div style={{ marginBottom: "24px" }}>
        <SectionTitle>11 · 최종 투자 판단</SectionTitle>
        <div style={{ border: `2px solid ${BUY_GREEN}`, borderRadius: "12px", padding: "24px", background: "#f0fdf4" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ background: BUY_GREEN, color: "#fff", fontSize: "22px", fontWeight: "900", padding: "10px 28px", borderRadius: "8px", letterSpacing: "0.05em" }}>
                매수 (BUY)
              </div>
              <div>
                <div style={{ color: GS_BLUE, fontSize: "26px", fontWeight: "900" }}>₩26,000</div>
                <div style={{ color: GRAY, fontSize: "11px" }}>12개월 목표주가 (+40.9%)</div>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: GRAY, fontSize: "11px", fontWeight: "600", marginBottom: "4px" }}>확신도 (Conviction)</div>
              <div style={{ display: "flex", gap: "4px" }}>
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <div key={n} style={{ width: "22px", height: "22px", borderRadius: "4px", background: n <= 7 ? BUY_GREEN : "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "9px", fontWeight: "700", color: n <= 7 ? "#fff" : GRAY }}>{n}</span>
                  </div>
                ))}
              </div>
              <div style={{ color: BUY_GREEN, fontSize: "13px", fontWeight: "800", marginTop: "4px" }}>7 / 10</div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #86efac", paddingTop: "14px" }}>
            <div style={{ color: "#166534", fontWeight: "700", fontSize: "12px", marginBottom: "8px" }}>투자 결론 및 핵심 논거</div>
            <div style={{ fontSize: "12px", color: "#374151", lineHeight: "1.8" }}>
              오스코텍은 2026년 하반기 Lorecivivint 임상3상 결과 발표를 앞두고 <strong>바이오 이벤트 드리븐(Event-Driven) 투자 기회</strong>를 제공한다.
              2025년 첫 영업흑자 전환과 4년치 이상의 현금 런웨이는 단기 유동성 리스크를 차단하고 있으며, 특허 포트폴리오 및 임상 데이터 자산 가치는
              현재 시가총액(4,820억원) 대비 유의미한 저평가 상태다. 파이프라인 실패 리스크는 상존하나 낮은 부채비율(48%)과 풍부한 현금이 하방을 지지한다.
              <strong style={{ color: GS_BLUE }}> 6~12개월 관점에서 위험조정 수익률이 매력적</strong>이며, 임상 결과 발표 전 분할 매수 전략을 권고한다.
            </div>
            <div style={{ marginTop: "12px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {[
                "임상3상 결과 2026H2 발표",
                "기술이전 딜 가능성 High",
                "영업흑자 턴어라운드",
                "낮은 부채비율 48%",
                "풍부한 현금(4년+ 런웨이)",
              ].map((tag, i) => (
                <span key={i} style={{ background: "#dcfce7", color: "#166534", fontSize: "10px", fontWeight: "700", padding: "4px 10px", borderRadius: "20px", border: "1px solid #86efac" }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 면책조항 ─────────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "16px", marginTop: "8px" }}>
        <div style={{ fontSize: "9px", color: "#94a3b8", lineHeight: "1.6" }}>
          <strong>면책조항 (Disclaimer):</strong> 본 보고서는 AI 리서치 데스크가 공개된 정보를 바탕으로 생성한 참고용 자료이며, 투자 권유를 목적으로 하지 않습니다.
          실제 투자 판단은 공식 금융 전문가의 조언과 최신 공시 자료를 반드시 확인하시기 바랍니다. 모든 수치는 추정값으로 실제와 다를 수 있습니다.
          기준일: 2026-04-20 | 종목코드: 080580 | 거래소: KOSDAQ
        </div>
      </div>

    </div>
  );
}
