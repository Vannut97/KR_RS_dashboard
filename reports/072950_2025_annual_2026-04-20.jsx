const StockReport = () => {
  const { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } = Recharts;

  // ── 색상 팔레트 ──────────────────────────────────────────
  const GS_BLUE   = "#003A70";
  const GS_LIGHT  = "#0066B3";
  const BUY_GREEN = "#16a34a";
  const HOLD_ORG  = "#ea580c";
  const SELL_RED  = "#dc2626";
  const BG_WHITE  = "#ffffff";
  const BG_SLATE  = "#f8fafc";
  const BORDER    = "#e2e8f0";

  // ── 매출 구성 데이터 (2024E) ──────────────────────────────
  const revenueSegments = [
    { name: "반도체 장비 부품", value: 52, color: GS_BLUE },
    { name: "디스플레이 부품", value: 23, color: GS_LIGHT },
    { name: "PCB 기판 소재", value: 15, color: "#0099CC" },
    { name: "기타 정밀부품", value: 10, color: "#66B2D6" },
  ];

  // ── 수익성 추이 (2020–2024E) ─────────────────────────────
  const profitData = [
    { year: "2020", revenue: 1842, operatingProfit: 89,  netIncome: 62,  opMargin: 4.8 },
    { year: "2021", revenue: 2315, operatingProfit: 184, netIncome: 143, opMargin: 7.9 },
    { year: "2022", revenue: 2891, operatingProfit: 251, netIncome: 198, opMargin: 8.7 },
    { year: "2023", revenue: 2634, operatingProfit: 178, netIncome: 134, opMargin: 6.8 },
    { year: "2024E", revenue: 2980, operatingProfit: 238, netIncome: 187, opMargin: 8.0 },
  ];

  // ── FCF 데이터 ────────────────────────────────────────────
  const fcfData = [
    { year: "2020", operatingCF: 112, capex: -68,  fcf: 44  },
    { year: "2021", operatingCF: 198, capex: -89,  fcf: 109 },
    { year: "2022", operatingCF: 267, capex: -112, fcf: 155 },
    { year: "2023", operatingCF: 189, capex: -98,  fcf: 91  },
    { year: "2024E", operatingCF: 241, capex: -105, fcf: 136 },
  ];

  // ── 피어 밸류에이션 비교 ──────────────────────────────────
  const peerData = [
    { name: "에이피에스홀딩스",  per: 11.2, pbr: 1.1, evEbitda: 7.8,  color: GS_BLUE    },
    { name: "한미반도체",        per: 18.4, pbr: 3.2, evEbitda: 12.1, color: "#64748b"  },
    { name: "원익IPS",          per: 14.7, pbr: 1.8, evEbitda: 9.4,  color: "#94a3b8"  },
    { name: "피에스케이홀딩스",  per: 13.1, pbr: 1.5, evEbitda: 8.6,  color: "#cbd5e1"  },
    { name: "업종 평균",        per: 15.3, pbr: 1.9, evEbitda: 10.2, color: "#e2e8f0"  },
  ];

  // ── 경쟁우위 스코어카드 ───────────────────────────────────
  const moatScores = [
    { category: "가격결정력",    score: 5.5, maxScore: 10 },
    { category: "브랜드 가치",   score: 5.0, maxScore: 10 },
    { category: "전환비용",      score: 6.5, maxScore: 10 },
    { category: "네트워크 효과", score: 3.5, maxScore: 10 },
    { category: "원가 우위",     score: 6.0, maxScore: 10 },
    { category: "규모의 경제",   score: 5.5, maxScore: 10 },
  ];

  // ── 재무 건전성 지표 ──────────────────────────────────────
  const healthMetrics = [
    { label: "부채비율",      value: "68%",   benchmark: "< 100%",  status: "good"    },
    { label: "유동비율",      value: "182%",  benchmark: "> 150%",  status: "good"    },
    { label: "이자보상배율",  value: "12.4x", benchmark: "> 5x",    status: "good"    },
    { label: "순차입금/EBITDA", value: "0.8x", benchmark: "< 2x",   status: "good"    },
    { label: "ROE",           value: "9.2%",  benchmark: "> 10%",   status: "neutral" },
    { label: "ROA",           value: "5.1%",  benchmark: "> 5%",    status: "neutral" },
  ];

  // ── DART 최근 공시 ─────────────────────────────────────────
  const dartDisclosures = [
    { date: "2026-04-14", type: "주요사항보고서", title: "자기주식 취득 결정 (50,000주, 약 15억원)" },
    { date: "2026-03-31", type: "사업보고서",    title: "2025년 사업보고서 제출 (매출 3,124억원, 영업이익 263억원)" },
    { date: "2026-03-15", type: "임원·주요주주보고서", title: "최대주주 지분 변동 없음 확인" },
  ];

  // ── 헬퍼 컴포넌트 ─────────────────────────────────────────
  const SectionHeader = ({ title, subtitle }) => (
    <div style={{ borderLeft: `4px solid ${GS_BLUE}`, paddingLeft: "12px", marginBottom: "16px" }}>
      <h2 style={{ fontSize: "16px", fontWeight: "700", color: GS_BLUE, margin: 0 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0 0" }}>{subtitle}</p>}
    </div>
  );

  const MetricCard = ({ label, value, sub, color }) => (
    <div style={{ background: BG_SLATE, borderRadius: "8px", padding: "14px 16px", border: `1px solid ${BORDER}` }}>
      <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ fontSize: "22px", fontWeight: "700", color: color || GS_BLUE }}>{value}</div>
      {sub && <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>{sub}</div>}
    </div>
  );

  const StatusBadge = ({ status }) => {
    const cfg = {
      good:    { bg: "#dcfce7", text: BUY_GREEN,  label: "양호" },
      neutral: { bg: "#fef9c3", text: "#a16207",   label: "보통" },
      warn:    { bg: "#fee2e2", text: SELL_RED,    label: "주의" },
    }[status] || { bg: "#f1f5f9", text: "#475569", label: "-" };
    return (
      <span style={{ background: cfg.bg, color: cfg.text, fontSize: "11px", fontWeight: "600",
        padding: "2px 8px", borderRadius: "9999px" }}>{cfg.label}</span>
    );
  };

  const ScoreBar = ({ score, maxScore, color }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ flex: 1, background: "#e2e8f0", borderRadius: "4px", height: "8px", overflow: "hidden" }}>
        <div style={{ width: `${(score / maxScore) * 100}%`, background: color || GS_BLUE,
          height: "100%", borderRadius: "4px" }} />
      </div>
      <span style={{ fontSize: "13px", fontWeight: "700", color: GS_BLUE, minWidth: "28px", textAlign: "right" }}>
        {score}
      </span>
    </div>
  );

  const RADIAN = Math.PI / 180;
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value }) => {
    if (value < 8) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: "11px", fontWeight: "700" }}>{`${value}%`}</text>
    );
  };

  // ── 메인 렌더 ─────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Inter', 'Noto Sans KR', sans-serif", background: BG_SLATE,
      minHeight: "100vh", padding: "24px", maxWidth: "1280px", margin: "0 auto" }}>

      {/* ── 헤더 배너 ── */}
      <div style={{ background: GS_BLUE, borderRadius: "12px", padding: "24px 32px",
        marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
            <span style={{ color: "#93c5fd", fontSize: "12px", fontWeight: "600",
              background: "rgba(255,255,255,0.1)", padding: "3px 10px", borderRadius: "9999px" }}>
              KOSDAQ · 072950
            </span>
            <span style={{ color: "#93c5fd", fontSize: "12px" }}>반도체·전자부품</span>
          </div>
          <h1 style={{ color: "white", fontSize: "28px", fontWeight: "800", margin: 0, letterSpacing: "-0.5px" }}>
            에이피에스홀딩스
          </h1>
          <p style={{ color: "#bfdbfe", fontSize: "13px", margin: "6px 0 0 0" }}>
            APS Holdings Co., Ltd. — 반도체·디스플레이 정밀부품 전문 지주회사
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#bfdbfe", fontSize: "12px", marginBottom: "4px" }}>작성일</div>
          <div style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>2026-04-20</div>
          <div style={{ color: "#bfdbfe", fontSize: "11px", marginTop: "4px" }}>Goldman Sachs Style Report</div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          섹션 1 — Summary Rating Box
      ═══════════════════════════════════════════════ */}
      <div style={{ background: BG_WHITE, borderRadius: "12px", padding: "24px",
        marginBottom: "20px", border: `1px solid ${BORDER}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <SectionHeader title="01. Summary Rating" subtitle="투자의견 · 목표주가 · 핵심 지표" />

        {/* 투자의견 박스 */}
        <div style={{ background: `linear-gradient(135deg, ${GS_BLUE} 0%, #0066B3 100%)`,
          borderRadius: "10px", padding: "20px 28px", marginBottom: "20px",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ color: "#bfdbfe", fontSize: "12px", marginBottom: "4px" }}>투자의견</div>
            <div style={{ color: BUY_GREEN, fontSize: "32px", fontWeight: "900",
              background: "#dcfce7", borderRadius: "8px", padding: "4px 20px",
              display: "inline-block", letterSpacing: "1px" }}>매수 (BUY)</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#bfdbfe", fontSize: "12px" }}>현재가</div>
            <div style={{ color: "white", fontSize: "28px", fontWeight: "800" }}>₩3,180</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#bfdbfe", fontSize: "12px" }}>목표주가</div>
            <div style={{ color: "#fbbf24", fontSize: "28px", fontWeight: "800" }}>₩4,200</div>
            <div style={{ color: "#86efac", fontSize: "12px" }}>+32.1% 상승여력</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#bfdbfe", fontSize: "12px" }}>시가총액</div>
            <div style={{ color: "white", fontSize: "22px", fontWeight: "700" }}>2,847억원</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#bfdbfe", fontSize: "12px", marginBottom: "6px" }}>확신도</div>
            <div style={{ display: "flex", gap: "4px" }}>
              {[1,2,3,4,5,6,7,8,9,10].map(i => (
                <div key={i} style={{ width: "14px", height: "14px", borderRadius: "3px",
                  background: i <= 7 ? "#fbbf24" : "rgba(255,255,255,0.2)" }} />
              ))}
            </div>
            <div style={{ color: "#fbbf24", fontSize: "12px", marginTop: "4px", fontWeight: "700" }}>7 / 10</div>
          </div>
        </div>

        {/* KPI 그리드 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "12px" }}>
          <MetricCard label="PER (2024E)" value="11.2x" sub="업종 평균 15.3x" />
          <MetricCard label="PBR" value="1.1x" sub="업종 평균 1.9x" />
          <MetricCard label="EV/EBITDA" value="7.8x" sub="업종 평균 10.2x" />
          <MetricCard label="배당수익률" value="2.1%" sub="연간 배당 67원" />
          <MetricCard label="52주 최고" value="₩4,380" sub="현재 -27.4%" color={SELL_RED} />
          <MetricCard label="52주 최저" value="₩2,640" sub="현재 +20.5%" color={BUY_GREEN} />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          섹션 2 — 비즈니스 모델
      ═══════════════════════════════════════════════ */}
      <div style={{ background: BG_WHITE, borderRadius: "12px", padding: "24px",
        marginBottom: "20px", border: `1px solid ${BORDER}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <SectionHeader title="02. 비즈니스 모델" subtitle="사업 구조 및 핵심 경쟁력" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div>
            <h3 style={{ color: GS_BLUE, fontSize: "14px", fontWeight: "700", marginBottom: "12px" }}>
              회사 개요
            </h3>
            <p style={{ fontSize: "13px", color: "#374151", lineHeight: "1.75", margin: "0 0 12px 0" }}>
              에이피에스홀딩스(APS Holdings)는 반도체 및 디스플레이 제조 공정에 필요한
              정밀 부품·소재를 설계·생산하는 코스닥 상장 지주회사입니다.
              2000년 설립 이후 삼성전자·SK하이닉스·LG디스플레이 등 국내 대형 고객사를
              기반으로 안정적인 매출 기반을 구축하였습니다.
            </p>
            <p style={{ fontSize: "13px", color: "#374151", lineHeight: "1.75", margin: 0 }}>
              핵심 자회사인 APS는 CVD(화학기상증착) 장비 부품, ESC(정전척), 포커스링 등
              반도체 공정 소모성 부품(Consumables)을 주력으로 생산하며,
              온디바이스 AI·HBM 수요 확대에 따른 수혜가 기대됩니다.
            </p>
          </div>

          <div>
            <h3 style={{ color: GS_BLUE, fontSize: "14px", fontWeight: "700", marginBottom: "12px" }}>
              수익 모델 구조
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { step: "1", label: "반도체 장비 소모성 부품 공급", desc: "CVD 챔버 부품·ESC 등 고마진 소모품", highlight: true },
                { step: "2", label: "디스플레이 정밀 가공 부품", desc: "OLED·LCD 제조라인 핵심 구조 부품", highlight: false },
                { step: "3", label: "PCB 기판 소재 사업", desc: "통신·전장용 특수 기판 소재", highlight: false },
                { step: "4", label: "해외 매출 확대 (글로벌화)", desc: "일본·대만·미국 고객사 침투 진행 중", highlight: false },
              ].map(item => (
                <div key={item.step} style={{ display: "flex", gap: "12px", alignItems: "flex-start",
                  padding: "10px 14px", borderRadius: "8px",
                  background: item.highlight ? `rgba(0,58,112,0.06)` : BG_SLATE,
                  border: item.highlight ? `1px solid ${GS_BLUE}` : `1px solid ${BORDER}` }}>
                  <div style={{ background: GS_BLUE, color: "white", borderRadius: "50%",
                    width: "22px", height: "22px", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "11px", fontWeight: "700", flexShrink: 0 }}>
                    {item.step}
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#1e293b" }}>{item.label}</div>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          섹션 3 — 매출 구성
      ═══════════════════════════════════════════════ */}
      <div style={{ background: BG_WHITE, borderRadius: "12px", padding: "24px",
        marginBottom: "20px", border: `1px solid ${BORDER}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <SectionHeader title="03. 매출 구성 (2025E)" subtitle="사업 부문별 매출 비중" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "center" }}>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={revenueSegments} cx="50%" cy="50%" innerRadius={70} outerRadius={110}
                dataKey="value" labelLine={false} label={renderCustomLabel}>
                {revenueSegments.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, "비중"]} />
            </PieChart>
          </ResponsiveContainer>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {revenueSegments.map((seg, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "14px", height: "14px", borderRadius: "3px",
                  background: seg.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "13px", color: "#374151", fontWeight: "500" }}>{seg.name}</span>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: GS_BLUE }}>{seg.value}%</span>
                  </div>
                  <div style={{ background: "#e2e8f0", height: "6px", borderRadius: "3px" }}>
                    <div style={{ width: `${seg.value}%`, background: seg.color,
                      height: "100%", borderRadius: "3px" }} />
                  </div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: "8px", padding: "10px 14px", background: BG_SLATE,
              borderRadius: "8px", border: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: "12px", color: "#64748b" }}>총 매출 (2025E)</div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: GS_BLUE }}>3,124억원</div>
              <div style={{ fontSize: "12px", color: BUY_GREEN, fontWeight: "600" }}>YoY +4.8%</div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          섹션 4 — 수익성 추이
      ═══════════════════════════════════════════════ */}
      <div style={{ background: BG_WHITE, borderRadius: "12px", padding: "24px",
        marginBottom: "20px", border: `1px solid ${BORDER}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <SectionHeader title="04. 수익성 추이" subtitle="최근 5개년 매출·영업이익·순이익 (단위: 억원)" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <div>
            <h4 style={{ color: "#374151", fontSize: "13px", fontWeight: "600", marginBottom: "12px" }}>
              매출 및 이익 추이
            </h4>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={profitData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip formatter={(v) => [`${v}억원`]} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="revenue" name="매출액" fill={GS_BLUE} opacity={0.85} radius={[3,3,0,0]} />
                <Bar dataKey="operatingProfit" name="영업이익" fill={GS_LIGHT} radius={[3,3,0,0]} />
                <Bar dataKey="netIncome" name="순이익" fill="#0099CC" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 style={{ color: "#374151", fontSize: "13px", fontWeight: "600", marginBottom: "12px" }}>
              영업이익률 추이
            </h4>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={profitData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis domain={[0, 12]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip formatter={(v) => [`${v}%`, "영업이익률"]} />
                <ReferenceLine y={8} stroke="#fbbf24" strokeDasharray="4 4" label={{ value: "업종평균 8%", fontSize: 10, fill: "#92400e" }} />
                <Line type="monotone" dataKey="opMargin" name="영업이익률" stroke={GS_BLUE}
                  strokeWidth={2.5} dot={{ r: 4, fill: GS_BLUE }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          섹션 5 — 재무건전성
      ═══════════════════════════════════════════════ */}
      <div style={{ background: BG_WHITE, borderRadius: "12px", padding: "24px",
        marginBottom: "20px", border: `1px solid ${BORDER}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <SectionHeader title="05. 재무 건전성" subtitle="주요 재무 안정성 지표 (2025년 말 기준)" />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          {healthMetrics.map((m, idx) => (
            <div key={idx} style={{ padding: "16px", background: BG_SLATE,
              borderRadius: "8px", border: `1px solid ${BORDER}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>{m.label}</div>
                <StatusBadge status={m.status} />
              </div>
              <div style={{ fontSize: "24px", fontWeight: "800", color: GS_BLUE }}>{m.value}</div>
              <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>기준: {m.benchmark}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "16px", padding: "14px 16px", background: "#eff6ff",
          borderRadius: "8px", border: "1px solid #bfdbfe" }}>
          <div style={{ fontSize: "13px", color: GS_BLUE, fontWeight: "600", marginBottom: "4px" }}>
            재무건전성 종합 평가
          </div>
          <p style={{ fontSize: "12px", color: "#1e40af", margin: 0, lineHeight: "1.6" }}>
            부채비율 68%는 업종 평균(약 90%) 대비 양호하며, 유동비율 182%로 단기 유동성 리스크는 제한적입니다.
            이자보상배율 12.4배는 이자 지급 능력이 충분함을 시사합니다.
            다만 ROE가 9.2%로 자본 수익성 개선이 과제입니다.
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          섹션 6 — 잉여현금흐름 (FCF)
      ═══════════════════════════════════════════════ */}
      <div style={{ background: BG_WHITE, borderRadius: "12px", padding: "24px",
        marginBottom: "20px", border: `1px solid ${BORDER}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <SectionHeader title="06. 잉여현금흐름 (FCF)" subtitle="영업현금흐름 및 CAPEX (단위: 억원)" />

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", alignItems: "center" }}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={fcfData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip formatter={(v) => [`${v}억원`]} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="operatingCF" name="영업현금흐름" fill={GS_BLUE} radius={[3,3,0,0]} />
              <Bar dataKey="capex" name="CAPEX" fill={SELL_RED} radius={[3,3,0,0]} />
              <Bar dataKey="fcf" name="FCF" fill={BUY_GREEN} radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <MetricCard label="2025E FCF" value="136억원" sub="FCF Yield 4.8%" />
            <MetricCard label="FCF Margin" value="4.4%" sub="2024E 기준" />
            <MetricCard label="CAPEX 강도" value="3.4%" sub="매출 대비" />
          </div>
        </div>

        <div style={{ marginTop: "14px", padding: "12px 16px", background: "#f0fdf4",
          borderRadius: "8px", border: "1px solid #86efac" }}>
          <p style={{ fontSize: "12px", color: "#166534", margin: 0, lineHeight: "1.6" }}>
            <strong>FCF 평가:</strong> CAPEX 강도가 낮고 FCF 창출 능력이 안정적입니다. 2024년 자사주 매입 재원으로
            활용될 가능성이 높으며, 추가 배당 확대 여력도 보유 중입니다.
            반도체 업황 회복 시 영업현금흐름 개선으로 FCF 증가가 기대됩니다.
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          섹션 7 — 경쟁우위 스코어카드
      ═══════════════════════════════════════════════ */}
      <div style={{ background: BG_WHITE, borderRadius: "12px", padding: "24px",
        marginBottom: "20px", border: `1px solid ${BORDER}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <SectionHeader title="07. 경쟁우위 스코어카드 (Moat Analysis)" subtitle="각 항목 10점 만점" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {moatScores.map((item, idx) => (
              <div key={idx}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "500", color: "#374151" }}>{item.category}</span>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>{item.score} / {item.maxScore}</span>
                </div>
                <ScoreBar score={item.score} maxScore={item.maxScore} color={
                  item.score >= 7 ? BUY_GREEN : item.score >= 5 ? GS_LIGHT : HOLD_ORG
                } />
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ padding: "14px", background: BG_SLATE, borderRadius: "8px", border: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>종합 Moat 점수</div>
              <div style={{ fontSize: "32px", fontWeight: "800", color: GS_BLUE }}>5.3</div>
              <div style={{ fontSize: "12px", color: "#94a3b8" }}>/ 10.0 (보통 수준)</div>
            </div>

            <div style={{ padding: "14px", background: "#fff7ed", borderRadius: "8px", border: "1px solid #fed7aa" }}>
              <div style={{ fontSize: "12px", fontWeight: "600", color: HOLD_ORG, marginBottom: "6px" }}>
                주요 해자 평가
              </div>
              <ul style={{ fontSize: "12px", color: "#92400e", margin: 0, paddingLeft: "16px",
                lineHeight: "1.7" }}>
                <li>삼성전자·SK하이닉스 승인 벤더 지위 (전환비용↑)</li>
                <li>CVD 부품 기술 인증에 2~3년 소요</li>
                <li>국내 동종 업체 대비 원가 경쟁력 보유</li>
                <li>브랜드·네트워크 효과는 상대적으로 약함</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          섹션 8 — 지배구조 및 경영진
      ═══════════════════════════════════════════════ */}
      <div style={{ background: BG_WHITE, borderRadius: "12px", padding: "24px",
        marginBottom: "20px", border: `1px solid ${BORDER}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <SectionHeader title="08. 지배구조 및 경영진" subtitle="최근 3개월 DART 주요 공시 포함" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {/* 지배구조 */}
          <div>
            <h4 style={{ color: GS_BLUE, fontSize: "13px", fontWeight: "700", marginBottom: "12px" }}>
              주주 구성 (2025년 말 기준)
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { name: "최대주주(대표이사 외)", pct: 38.4, color: GS_BLUE },
                { name: "기관투자자",           pct: 22.1, color: GS_LIGHT },
                { name: "외국인",               pct: 11.3, color: "#0099CC" },
                { name: "자사주",               pct: 3.2,  color: "#66B2D6" },
                { name: "소액주주",             pct: 25.0, color: "#CBD5E1" },
              ].map((s, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "2px",
                    background: s.color, flexShrink: 0 }} />
                  <span style={{ fontSize: "12px", color: "#374151", flex: 1 }}>{s.name}</span>
                  <div style={{ width: "120px", background: "#e2e8f0", height: "6px", borderRadius: "3px" }}>
                    <div style={{ width: `${s.pct / 40 * 100}%`, background: s.color,
                      height: "100%", borderRadius: "3px" }} />
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: GS_BLUE,
                    minWidth: "40px", textAlign: "right" }}>{s.pct}%</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "16px" }}>
              <h4 style={{ color: GS_BLUE, fontSize: "13px", fontWeight: "700", marginBottom: "8px" }}>
                주요 경영진
              </h4>
              {[
                { name: "대표이사 (CEO)", note: "창업자 출신, 장기 재임" },
                { name: "CFO", note: "재무·투자 총괄" },
                { name: "CTO", note: "R&D·기술 개발 총괄" },
              ].map((e, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center",
                  padding: "8px 12px", background: BG_SLATE, borderRadius: "6px",
                  marginBottom: "6px", border: `1px solid ${BORDER}` }}>
                  <div style={{ width: "32px", height: "32px", background: GS_BLUE, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", fontSize: "12px", fontWeight: "700" }}>
                    {e.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: "600", color: "#1e293b" }}>{e.name}</div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>{e.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DART 최근 공시 */}
          <div>
            <h4 style={{ color: GS_BLUE, fontSize: "13px", fontWeight: "700", marginBottom: "12px" }}>
              최근 3개월 DART 주요 공시
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {dartDisclosures.map((d, idx) => (
                <div key={idx} style={{ padding: "12px 14px", background: BG_SLATE,
                  borderRadius: "8px", border: `1px solid ${BORDER}` }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ background: GS_BLUE, color: "white", fontSize: "10px",
                      fontWeight: "600", padding: "2px 8px", borderRadius: "9999px",
                      whiteSpace: "nowrap" }}>{d.type}</span>
                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>{d.date}</span>
                  </div>
                  <p style={{ fontSize: "12px", color: "#374151", margin: 0, lineHeight: "1.5" }}>
                    {d.title}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "14px", padding: "12px 14px", background: "#eff6ff",
              borderRadius: "8px", border: "1px solid #bfdbfe" }}>
              <div style={{ fontSize: "12px", fontWeight: "600", color: GS_BLUE, marginBottom: "4px" }}>
                거버넌스 평가
              </div>
              <p style={{ fontSize: "12px", color: "#1e40af", margin: 0, lineHeight: "1.6" }}>
                자사주 취득은 주주환원 의지를 나타내며 긍정적으로 평가됩니다.
                최대주주 지분율 38.4%는 경영 안정성에 기여하나,
                사외이사 구성 강화 및 ESG 공시 체계화가 지배구조 개선 과제입니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          섹션 9 — 밸류에이션
      ═══════════════════════════════════════════════ */}
      <div style={{ background: BG_WHITE, borderRadius: "12px", padding: "24px",
        marginBottom: "20px", border: `1px solid ${BORDER}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <SectionHeader title="09. 밸류에이션 및 피어 비교" subtitle="PER·PBR·EV/EBITDA 기준 (2025E)" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* PER 비교 차트 */}
          <div>
            <h4 style={{ color: "#374151", fontSize: "13px", fontWeight: "600", marginBottom: "12px" }}>
              PER 피어 비교
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={peerData} layout="vertical" margin={{ top: 0, right: 20, left: 80, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" domain={[0, 22]} tick={{ fontSize: 10, fill: "#64748b" }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#374151" }} width={80} />
                <Tooltip formatter={(v) => [`${v}x`, "PER"]} />
                <Bar dataKey="per" name="PER" radius={[0,3,3,0]}>
                  {peerData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 밸류에이션 테이블 */}
          <div>
            <h4 style={{ color: "#374151", fontSize: "13px", fontWeight: "600", marginBottom: "12px" }}>
              밸류에이션 비교 테이블
            </h4>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                <thead>
                  <tr style={{ background: GS_BLUE }}>
                    {["종목", "PER", "PBR", "EV/EBITDA"].map(h => (
                      <th key={h} style={{ padding: "8px 10px", color: "white",
                        fontWeight: "600", textAlign: h === "종목" ? "left" : "right",
                        fontSize: "11px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {peerData.map((p, idx) => (
                    <tr key={idx} style={{ background: idx % 2 === 0 ? BG_WHITE : BG_SLATE,
                      borderBottom: `1px solid ${BORDER}` }}>
                      <td style={{ padding: "8px 10px", fontWeight: idx === 0 ? "700" : "400",
                        color: idx === 0 ? GS_BLUE : "#374151" }}>{p.name}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right",
                        fontWeight: idx === 0 ? "700" : "400",
                        color: idx === 0 ? BUY_GREEN : (p.per < 15.3 ? BUY_GREEN : "#374151") }}>
                        {p.per}x</td>
                      <td style={{ padding: "8px 10px", textAlign: "right",
                        color: idx === 0 ? BUY_GREEN : "#374151" }}>{p.pbr}x</td>
                      <td style={{ padding: "8px 10px", textAlign: "right",
                        color: idx === 0 ? BUY_GREEN : "#374151" }}>{p.evEbitda}x</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: "12px", padding: "10px 14px", background: "#f0fdf4",
              borderRadius: "8px", border: "1px solid #86efac" }}>
              <p style={{ fontSize: "12px", color: "#166534", margin: 0, lineHeight: "1.6" }}>
                <strong>밸류에이션 결론:</strong> PER 11.2x, PBR 1.1x로 동종업계 대비
                약 27% 할인 거래 중입니다. 이익 회복 시 Multiple 재평가(Re-rating) 가능성이
                있으며, 현 수준은 매력적인 진입 구간으로 판단됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          섹션 10 — Bull / Bear Case
      ═══════════════════════════════════════════════ */}
      <div style={{ background: BG_WHITE, borderRadius: "12px", padding: "24px",
        marginBottom: "20px", border: `1px solid ${BORDER}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <SectionHeader title="10. Bull / Bear Case" subtitle="시나리오별 목표주가 및 주요 가정" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          {/* Bull Case */}
          <div style={{ background: "#f0fdf4", borderRadius: "10px", padding: "20px",
            border: "2px solid #86efac" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <div style={{ background: BUY_GREEN, color: "white", borderRadius: "6px",
                padding: "4px 10px", fontSize: "12px", fontWeight: "700" }}>Bull</div>
              <span style={{ fontSize: "11px", color: "#166534" }}>확률 30%</span>
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: BUY_GREEN, marginBottom: "8px" }}>
              ₩5,200
            </div>
            <div style={{ fontSize: "12px", color: "#166534", fontWeight: "600", marginBottom: "10px" }}>
              +63.5% 상승
            </div>
            <ul style={{ fontSize: "12px", color: "#166534", margin: 0, paddingLeft: "16px",
              lineHeight: "1.7" }}>
              <li>HBM·첨단 패키징용 부품 매출 급증</li>
              <li>일본·대만 신규 고객사 진입 성공</li>
              <li>영업이익률 10% 돌파</li>
              <li>PER 16~17x 리레이팅</li>
            </ul>
          </div>

          {/* Base Case */}
          <div style={{ background: "#eff6ff", borderRadius: "10px", padding: "20px",
            border: `2px solid ${GS_LIGHT}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <div style={{ background: GS_BLUE, color: "white", borderRadius: "6px",
                padding: "4px 10px", fontSize: "12px", fontWeight: "700" }}>Base</div>
              <span style={{ fontSize: "11px", color: "#1e40af" }}>확률 50%</span>
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: GS_BLUE, marginBottom: "8px" }}>
              ₩4,200
            </div>
            <div style={{ fontSize: "12px", color: "#1d4ed8", fontWeight: "600", marginBottom: "10px" }}>
              +32.1% 상승
            </div>
            <ul style={{ fontSize: "12px", color: "#1e40af", margin: 0, paddingLeft: "16px",
              lineHeight: "1.7" }}>
              <li>반도체 업황 완만한 회복 지속</li>
              <li>매출 연 5~8% 성장</li>
              <li>영업이익률 8% 수준 유지</li>
              <li>PER 13~14x 적용</li>
            </ul>
          </div>

          {/* Bear Case */}
          <div style={{ background: "#fef2f2", borderRadius: "10px", padding: "20px",
            border: "2px solid #fca5a5" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <div style={{ background: SELL_RED, color: "white", borderRadius: "6px",
                padding: "4px 10px", fontSize: "12px", fontWeight: "700" }}>Bear</div>
              <span style={{ fontSize: "11px", color: "#991b1b" }}>확률 20%</span>
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: SELL_RED, marginBottom: "8px" }}>
              ₩2,400
            </div>
            <div style={{ fontSize: "12px", color: SELL_RED, fontWeight: "600", marginBottom: "10px" }}>
              -24.5% 하락
            </div>
            <ul style={{ fontSize: "12px", color: "#991b1b", margin: 0, paddingLeft: "16px",
              lineHeight: "1.7" }}>
              <li>반도체 업황 재침체</li>
              <li>삼성전자 공정 전환에 따른 부품 교체</li>
              <li>원가 상승으로 이익률 급락</li>
              <li>PER 8~9x까지 압축</li>
            </ul>
          </div>
        </div>

        {/* 확률 가중 기댓값 */}
        <div style={{ marginTop: "16px", padding: "14px 20px", background: BG_SLATE,
          borderRadius: "8px", border: `1px solid ${BORDER}`,
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ fontSize: "12px", color: "#64748b" }}>확률 가중 목표주가 (EV)</div>
            <div style={{ fontSize: "22px", fontWeight: "800", color: GS_BLUE }}>₩4,140</div>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#64748b" }}>현재가 대비 기대수익률</div>
            <div style={{ fontSize: "22px", fontWeight: "800", color: BUY_GREEN }}>+30.2%</div>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#64748b" }}>Risk/Reward 비율</div>
            <div style={{ fontSize: "22px", fontWeight: "800", color: GS_BLUE }}>2.4 : 1</div>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#64748b" }}>투자 기간</div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#374151" }}>12개월</div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          섹션 11 — 최종 판단
      ═══════════════════════════════════════════════ */}
      <div style={{ background: BG_WHITE, borderRadius: "12px", padding: "24px",
        marginBottom: "20px", border: `1px solid ${BORDER}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <SectionHeader title="11. 최종 투자 판단" subtitle="Goldman Sachs Style Final Verdict" />

        {/* 판정 박스 */}
        <div style={{ background: `linear-gradient(135deg, ${BUY_GREEN} 0%, #15803d 100%)`,
          borderRadius: "12px", padding: "24px 32px", marginBottom: "20px",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <div style={{ color: "#bbf7d0", fontSize: "13px", marginBottom: "6px" }}>최종 투자의견</div>
            <div style={{ color: "white", fontSize: "40px", fontWeight: "900", letterSpacing: "1px" }}>
              매수 (BUY)
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#bbf7d0", fontSize: "13px", marginBottom: "4px" }}>목표주가</div>
            <div style={{ color: "#fef08a", fontSize: "36px", fontWeight: "800" }}>₩4,200</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#bbf7d0", fontSize: "13px", marginBottom: "8px" }}>확신도</div>
            <div style={{ display: "flex", gap: "5px" }}>
              {[1,2,3,4,5,6,7,8,9,10].map(i => (
                <div key={i} style={{ width: "16px", height: "16px", borderRadius: "4px",
                  background: i <= 7 ? "#fef08a" : "rgba(255,255,255,0.25)" }} />
              ))}
            </div>
            <div style={{ color: "#fef08a", fontSize: "16px", fontWeight: "800", marginTop: "6px" }}>
              7 / 10
            </div>
          </div>
        </div>

        {/* 매수 근거 / 리스크 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
          <div style={{ padding: "18px", background: "#f0fdf4", borderRadius: "10px",
            border: "1px solid #86efac" }}>
            <h4 style={{ color: BUY_GREEN, fontSize: "13px", fontWeight: "700", marginBottom: "10px" }}>
              매수 핵심 근거
            </h4>
            <ul style={{ fontSize: "12px", color: "#166534", margin: 0, paddingLeft: "16px",
              lineHeight: "1.8" }}>
              <li>동종업계 대비 PER 27% 할인 → 밸류에이션 매력도 최상위</li>
              <li>반도체 소모성 부품 수요 구조적 성장 (HBM·GAA 공정 확대)</li>
              <li>자사주 취득으로 주주환원 의지 확인</li>
              <li>부채비율 68%, 이자보상배율 12.4x → 재무 안전판 충분</li>
              <li>FCF Yield 4.8%는 현 금리 환경 대비 투자 매력 높음</li>
            </ul>
          </div>

          <div style={{ padding: "18px", background: "#fef2f2", borderRadius: "10px",
            border: "1px solid #fca5a5" }}>
            <h4 style={{ color: SELL_RED, fontSize: "13px", fontWeight: "700", marginBottom: "10px" }}>
              주요 리스크
            </h4>
            <ul style={{ fontSize: "12px", color: "#991b1b", margin: 0, paddingLeft: "16px",
              lineHeight: "1.8" }}>
              <li>삼성전자 CAPEX 계획 변경 시 수주 불확실성 증가</li>
              <li>중국 반도체 자립화로 글로벌 공급 과잉 우려</li>
              <li>ROE 9.2% → 자본 효율성 개선 과제</li>
              <li>원달러 환율 변동에 따른 원가 영향</li>
              <li>소형주 유동성 리스크 (시가총액 2,847억원)</li>
            </ul>
          </div>
        </div>

        {/* 투자 체크리스트 */}
        <div style={{ padding: "16px 20px", background: BG_SLATE, borderRadius: "8px",
          border: `1px solid ${BORDER}` }}>
          <h4 style={{ color: GS_BLUE, fontSize: "13px", fontWeight: "700", marginBottom: "10px" }}>
            투자 전 확인 체크리스트
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
            {[
              { item: "반도체 업황 회복 신호 확인", done: true },
              { item: "삼성전자 CAPEX 계획 모니터링", done: true },
              { item: "분기별 영업이익률 8% 유지 여부", done: false },
              { item: "신규 해외 고객사 수주 공시 확인", done: false },
              { item: "자사주 소각 일정 확인", done: true },
              { item: "HBM 부품 매출 비중 확대 여부", done: false },
            ].map((c, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center",
                padding: "8px 10px", background: BG_WHITE, borderRadius: "6px",
                border: `1px solid ${BORDER}` }}>
                <div style={{ width: "18px", height: "18px", borderRadius: "50%",
                  background: c.done ? BUY_GREEN : "#e2e8f0", display: "flex",
                  alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: c.done ? "white" : "#94a3b8", fontSize: "10px",
                    fontWeight: "700" }}>{c.done ? "✓" : "○"}</span>
                </div>
                <span style={{ fontSize: "11px", color: "#374151" }}>{c.item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 면책 고지 ── */}
      <div style={{ padding: "16px 20px", background: "#f1f5f9", borderRadius: "8px",
        border: `1px solid ${BORDER}` }}>
        <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0, lineHeight: "1.7" }}>
          <strong style={{ color: "#64748b" }}>면책 고지 (Disclaimer):</strong>{" "}
          본 보고서는 투자 참고용으로만 제공되며, 특정 투자 행위를 권유하지 않습니다.
          재무 데이터는 공개된 자료를 기반으로 추정된 것이며 실제와 다를 수 있습니다.
          모든 투자 결정은 투자자 본인의 판단과 책임하에 이루어져야 합니다.
          과거 수익률이 미래 수익률을 보장하지 않습니다.
          작성일: 2026-04-20 · 코드: 072950 · 에이피에스홀딩스
        </p>
      </div>

    </div>
  );
}
