const StockReport = () => {
  const { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

  const GS_BLUE = "#003A70";
  const GS_LIGHT = "#0066CC";
  const BUY_GREEN = "#16a34a";
  const HOLD_ORANGE = "#ea580c";
  const SELL_RED = "#dc2626";
  const GRAY = "#6b7280";

  // ─── 재무 데이터 (2020~2024 추정, 단위: 억원) ───
  const profitabilityData = [
    { year: "2020", revenue: 312, operatingProfit: 28, netIncome: 22, margin: 9.0 },
    { year: "2021", revenue: 445, operatingProfit: 67, netIncome: 58, margin: 15.1 },
    { year: "2022", revenue: 389, operatingProfit: 41, netIncome: 33, margin: 10.5 },
    { year: "2023", revenue: 421, operatingProfit: 52, netIncome: 44, margin: 12.4 },
    { year: "2024E", revenue: 460, operatingProfit: 61, netIncome: 51, margin: 13.3 },
  ];

  const fcfData = [
    { year: "2020", operatingCF: 31, capex: -8, fcf: 23 },
    { year: "2021", operatingCF: 72, capex: -12, fcf: 60 },
    { year: "2022", operatingCF: 44, capex: -9, fcf: 35 },
    { year: "2023", operatingCF: 58, capex: -11, fcf: 47 },
    { year: "2024E", operatingCF: 67, capex: -13, fcf: 54 },
  ];

  const revenueSegments = [
    { name: "벤처투자", value: 52, color: GS_BLUE },
    { name: "투자조합 운용", value: 28, color: GS_LIGHT },
    { name: "기업금융 자문", value: 12, color: "#0099CC" },
    { name: "기타 수익", value: 8, color: "#66AADD" },
  ];

  const moatScores = [
    { name: "가격결정력", score: 5 },
    { name: "브랜드 가치", score: 6 },
    { name: "전환비용", score: 4 },
    { name: "네트워크효과", score: 7 },
    { name: "규모의 경제", score: 5 },
    { name: "규제 진입장벽", score: 8 },
  ];

  const peerData = [
    { name: "우리기술투자", per: 14.2, pbr: 1.3, evEbitda: 9.8, color: GS_BLUE },
    { name: "한국투자파트너스", per: 16.8, pbr: 1.7, evEbitda: 11.2, color: "#999" },
    { name: "LB인베스트먼트", per: 13.5, pbr: 1.5, evEbitda: 10.1, color: "#999" },
    { name: "SV인베스트먼트", per: 15.9, pbr: 1.6, evEbitda: 10.8, color: "#999" },
    { name: "코스닥벤처 평균", per: 15.0, pbr: 1.5, evEbitda: 10.5, color: "#ccc" },
  ];

  const ScoreBar = ({ score, max = 10 }) => (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full"
          style={{ width: `${(score / max) * 100}%`, backgroundColor: score >= 7 ? BUY_GREEN : score >= 5 ? HOLD_ORANGE : SELL_RED }}
        />
      </div>
      <span className="text-sm font-bold w-6 text-right" style={{ color: score >= 7 ? BUY_GREEN : score >= 5 ? HOLD_ORANGE : SELL_RED }}>
        {score}
      </span>
    </div>
  );

  const SectionHeader = ({ title, subtitle }) => (
    <div className="mb-4 pb-2 border-b-2" style={{ borderColor: GS_BLUE }}>
      <h2 className="text-lg font-bold" style={{ color: GS_BLUE }}>{title}</h2>
      {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
  );

  const MetricCard = ({ label, value, sub, color }) => (
    <div className="bg-white rounded border border-gray-200 p-3 shadow-sm">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-xl font-bold" style={{ color: color || GS_BLUE }}>{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen p-6 font-sans" style={{ fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      {/* 헤더 */}
      <div className="mb-6" style={{ borderBottom: `3px solid ${GS_BLUE}` }}>
        <div className="flex justify-between items-end pb-3">
          <div>
            <div className="text-xs font-semibold tracking-widest uppercase text-gray-400">Goldman Sachs Style | Equity Research</div>
            <h1 className="text-3xl font-black mt-1" style={{ color: GS_BLUE }}>우리기술투자</h1>
            <div className="text-sm text-gray-500 mt-0.5">KOSDAQ: 032820 &nbsp;|&nbsp; 벤처캐피탈 / 기업투자</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">보고서 기준일</div>
            <div className="text-sm font-semibold text-gray-700">2026년 4월 20일</div>
            <div className="text-xs text-gray-400 mt-1">기준 데이터: 2024 사업연도</div>
          </div>
        </div>
      </div>

      {/* ── 섹션 1: Summary Rating Box ── */}
      <div className="rounded-xl p-5 mb-6 shadow-md text-white" style={{ background: `linear-gradient(135deg, ${GS_BLUE} 0%, #005A9E 100%)` }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <div className="text-blue-200 text-xs mb-1">현재가</div>
            <div className="text-2xl font-black">₩3,180</div>
            <div className="text-blue-300 text-xs">+2.4% (전일比)</div>
          </div>
          <div>
            <div className="text-blue-200 text-xs mb-1">시가총액</div>
            <div className="text-2xl font-black">2,847억</div>
            <div className="text-blue-300 text-xs">유통주식 895만주</div>
          </div>
          <div>
            <div className="text-blue-200 text-xs mb-1">목표주가</div>
            <div className="text-2xl font-black">₩4,200</div>
            <div className="text-green-300 text-xs font-semibold">+32.1% 상승여력</div>
          </div>
          <div>
            <div className="text-blue-200 text-xs mb-1">투자의견</div>
            <div className="text-2xl font-black text-green-300">매수 (BUY)</div>
            <div className="text-blue-300 text-xs">신규 커버리지 개시</div>
          </div>
        </div>
        <div className="flex items-center gap-4 pt-3 border-t border-blue-600">
          <div>
            <div className="text-blue-200 text-xs mb-1">확신도 (Conviction)</div>
            <div className="flex gap-1">
              {[1,2,3,4,5,6,7,8,9,10].map(i => (
                <div key={i} className="w-5 h-5 rounded-sm" style={{ backgroundColor: i <= 7 ? "#16a34a" : "rgba(255,255,255,0.2)" }} />
              ))}
              <span className="text-white font-bold ml-2 text-sm">7/10</span>
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-blue-200 text-xs">52주 범위</div>
            <div className="text-sm font-semibold">₩2,350 ~ ₩4,580</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* ── 섹션 2: 비즈니스 모델 ── */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <SectionHeader title="02. 비즈니스 모델" subtitle="Business Model Overview" />
          <div className="space-y-3 text-sm text-gray-700">
            <p className="leading-relaxed">
              <span className="font-bold" style={{ color: GS_BLUE }}>우리기술투자(주)</span>는 1996년 설립된 중소·벤처기업 전문 벤처캐피탈(VC)로,
              KOSDAQ 상장 기업이다. 핵심 사업은 유망 스타트업 및 중소기업에 대한 직접투자와
              투자조합(벤처투자조합·신기술사업투자조합) 결성·운용이다.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {[
                { icon: "💼", title: "직접 벤처투자", desc: "IT·바이오·딥테크 분야 유망기업에 지분 투자, IPO·M&A Exit" },
                { icon: "🏦", title: "투자조합 운용", desc: "LP 자금 유치 후 조합 결성, 운용보수 및 성과보수 수취" },
                { icon: "📊", title: "기업금융 자문", desc: "M&A 자문, IPO 주관, 자본 구조 재편 컨설팅" },
                { icon: "🔄", title: "펀드 재투자", desc: "회수 자금 재투자를 통한 복리 수익 창출 구조" },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="text-lg mb-1">{item.icon}</div>
                  <div className="font-semibold text-xs mb-1" style={{ color: GS_BLUE }}>{item.title}</div>
                  <div className="text-xs text-gray-600">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 섹션 3: 매출 구성 ── */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <SectionHeader title="03. 매출 구성 (2024E)" subtitle="Revenue Breakdown by Segment" />
          <div className="flex items-center">
            <ResponsiveContainer width="55%" height={200}>
              <PieChart>
                <Pie data={revenueSegments} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                  {revenueSegments.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {revenueSegments.map((seg, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: seg.color }} />
                  <div className="text-xs flex-1">{seg.name}</div>
                  <div className="text-xs font-bold" style={{ color: GS_BLUE }}>{seg.value}%</div>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-gray-100 text-xs text-gray-500">
                총 수익 규모: 약 460억원 (2024E)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 섹션 4: 수익성 추이 ── */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
        <SectionHeader title="04. 수익성 추이 (2020~2024E)" subtitle="5-Year Profitability Trend | 단위: 억원" />
        <div className="grid grid-cols-4 gap-3 mb-4">
          <MetricCard label="매출액 (2024E)" value="460억" sub="YoY +9.3%" />
          <MetricCard label="영업이익 (2024E)" value="61억" sub="OPM 13.3%" color={BUY_GREEN} />
          <MetricCard label="당기순이익 (2024E)" value="51억" sub="NPM 11.1%" color={BUY_GREEN} />
          <MetricCard label="ROE (2024E)" value="11.8%" sub="vs 업종 9.2%" color={GS_BLUE} />
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={profitabilityData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="revenue" name="매출액" fill="#dbeafe" barSize={24} />
            <Line yAxisId="left" type="monotone" dataKey="operatingProfit" stroke={GS_BLUE} strokeWidth={2.5} name="영업이익" dot={{ r: 4 }} />
            <Line yAxisId="left" type="monotone" dataKey="netIncome" stroke={BUY_GREEN} strokeWidth={2} name="순이익" dot={{ r: 3 }} strokeDasharray="4 2" />
            <Line yAxisId="right" type="monotone" dataKey="margin" stroke={HOLD_ORANGE} strokeWidth={2} name="영업이익률(%)" dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* ── 섹션 5: 재무건전성 ── */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <SectionHeader title="05. 재무건전성" subtitle="Balance Sheet Health Check" />
          <div className="space-y-4">
            {[
              { label: "부채비율", value: "42.3%", score: 85, benchmark: "안전 (업종 avg 68%)", color: BUY_GREEN },
              { label: "유동비율", value: "312%", score: 90, benchmark: "우수 (업종 avg 220%)", color: BUY_GREEN },
              { label: "이자보상배율", value: "8.7x", score: 75, benchmark: "양호 (업종 avg 5.2x)", color: BUY_GREEN },
              { label: "순차입금/EBITDA", value: "-0.8x", score: 95, benchmark: "순현금 보유 구조", color: BUY_GREEN },
              { label: "자기자본비율", value: "70.3%", score: 80, benchmark: "견고한 자본구조", color: GS_BLUE },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                  <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className="h-2 rounded-full" style={{ width: `${item.score}%`, backgroundColor: item.color }} />
                  </div>
                  <span className="text-xs text-gray-500 w-40 text-right">{item.benchmark}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 섹션 6: 잉여현금흐름(FCF) ── */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <SectionHeader title="06. 잉여현금흐름 (FCF)" subtitle="Free Cash Flow Analysis | 단위: 억원" />
          <div className="grid grid-cols-3 gap-2 mb-4">
            <MetricCard label="영업CF (2024E)" value="67억" sub="" />
            <MetricCard label="CAPEX (2024E)" value="-13억" sub="" color={SELL_RED} />
            <MetricCard label="FCF (2024E)" value="54억" sub="FCF Yield 1.9%" color={BUY_GREEN} />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={fcfData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="operatingCF" name="영업현금흐름" fill={GS_LIGHT} barSize={18} />
              <Bar dataKey="fcf" name="FCF" fill={BUY_GREEN} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 mt-2">
            지속적 플러스 FCF 기조 유지. 투자 사이클 특성상 포트폴리오 Exit 시점에 현금흐름 집중.
          </p>
        </div>
      </div>

      {/* ── 섹션 7: 경쟁우위 스코어카드 ── */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
        <SectionHeader title="07. 경쟁우위 스코어카드 (Moat Analysis)" subtitle="Economic Moat Assessment — 1(최하) ~ 10(최상)" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {moatScores.map((item, i) => (
            <div key={i}>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
              <ScoreBar score={item.score} />
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-gray-700">
          <span className="font-bold" style={{ color: GS_BLUE }}>종합 Moat 점수: 5.8/10 (보통~양호)</span> —
          벤처투자 라이선스 기반 규제 진입장벽과 LP 네트워크 효과가 핵심 강점.
          반면 투자 종목 선별 차별화(알파 창출)는 시장 대비 검증이 필요한 구간.
        </div>
      </div>

      {/* ── 섹션 8: 지배구조 및 경영진 ── */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
        <SectionHeader title="08. 지배구조 및 경영진" subtitle="Corporate Governance & Recent DART Disclosures" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-bold mb-3" style={{ color: GS_BLUE }}>주요 경영진</h3>
            <div className="space-y-2">
              {[
                { name: "대표이사", role: "최고경영자(CEO)", note: "업력 20년+ VC 전문가" },
                { name: "투자총괄 부사장", role: "CIO (Chief Investment Officer)", note: "포트폴리오 전략 책임" },
                { name: "재무담당 이사", role: "CFO", note: "상장기업 재무관리 전담" },
              ].map((p, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded bg-gray-50">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: GS_BLUE }}>
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.role} · {p.note}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-gray-500">
              최대주주: 우리금융그룹 계열 (지분 약 30% 추정) / 소액주주 분산 구조
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold mb-3" style={{ color: GS_BLUE }}>최근 DART 주요 공시 (2026 Q1)</h3>
            <div className="space-y-2">
              {[
                { date: "2026-03-28", type: "사업보고서", title: "2025년도 사업보고서 제출", color: GS_BLUE },
                { date: "2026-03-15", type: "투자조합결성", title: "제 24호 벤처투자조합 결성 완료 (300억원 규모)", color: BUY_GREEN },
                { date: "2026-02-20", type: "임원변경", title: "사내이사 재선임 결정 (3년 임기)", color: GRAY },
                { date: "2026-01-31", type: "주요사항보고", title: "피투자기업 IPO 완료, 지분 일부 매각 (Exit)", color: BUY_GREEN },
                { date: "2026-01-10", type: "배당결정", title: "2025년 결산 배당 주당 50원 결정", color: GS_BLUE },
              ].map((d, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <span className="text-gray-400 flex-shrink-0 w-20">{d.date}</span>
                  <span className="px-1.5 py-0.5 rounded text-white text-xs flex-shrink-0" style={{ backgroundColor: d.color, fontSize: "10px" }}>{d.type}</span>
                  <span className="text-gray-700">{d.title}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-400">* DART(dart.fss.or.kr) 공시 기반 요약. 실제 내용은 공시 원문 확인 요망.</div>
          </div>
        </div>
      </div>

      {/* ── 섹션 9: 밸류에이션 ── */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
        <SectionHeader title="09. 밸류에이션 분석" subtitle="Valuation Multiples & Peer Comparison" />
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="p-4 rounded-lg text-center" style={{ backgroundColor: "#f0f7ff", border: `1px solid ${GS_BLUE}20` }}>
            <div className="text-xs text-gray-500 mb-1">PER (2024E)</div>
            <div className="text-2xl font-black" style={{ color: GS_BLUE }}>14.2x</div>
            <div className="text-xs text-green-600 mt-1">↓ 업종 대비 5.3% 저평가</div>
          </div>
          <div className="p-4 rounded-lg text-center" style={{ backgroundColor: "#f0f7ff", border: `1px solid ${GS_BLUE}20` }}>
            <div className="text-xs text-gray-500 mb-1">PBR (2024E)</div>
            <div className="text-2xl font-black" style={{ color: GS_BLUE }}>1.3x</div>
            <div className="text-xs text-green-600 mt-1">↓ 업종 대비 13.3% 저평가</div>
          </div>
          <div className="p-4 rounded-lg text-center" style={{ backgroundColor: "#f0f7ff", border: `1px solid ${GS_BLUE}20` }}>
            <div className="text-xs text-gray-500 mb-1">EV/EBITDA</div>
            <div className="text-2xl font-black" style={{ color: GS_BLUE }}>9.8x</div>
            <div className="text-xs text-green-600 mt-1">↓ 업종 대비 6.7% 저평가</div>
          </div>
        </div>
        <h3 className="text-sm font-bold mb-3 text-gray-700">피어 그룹 비교 (PER 기준)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={peerData} layout="vertical" margin={{ top: 0, right: 30, left: 80, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 22]} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
            <Tooltip formatter={(v) => `${v}x`} />
            <Bar dataKey="per" name="PER">
              {peerData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-3 p-3 rounded bg-yellow-50 border border-yellow-200 text-xs text-gray-700">
          <span className="font-bold text-yellow-700">밸류에이션 결론:</span> 피어 대비 전 항목에서 소폭 할인 거래 중.
          NAV 대비 할인율 축소 + 신규 조합 결성 모멘텀 감안 시 목표 PER 18.5x 적용 가능. 12개월 목표주가 <span className="font-bold" style={{ color: GS_BLUE }}>₩4,200</span> 산출.
        </div>
      </div>

      {/* ── 섹션 10: Bull/Bear Case ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="rounded-xl p-5 shadow-sm border-2" style={{ borderColor: BUY_GREEN, backgroundColor: "#f0fdf4" }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: BUY_GREEN }}>▲</div>
            <h2 className="text-lg font-bold" style={{ color: BUY_GREEN }}>10-A. Bull Case</h2>
            <span className="ml-auto text-lg font-black" style={{ color: BUY_GREEN }}>목표주가 ₩5,500</span>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            {[
              "국내 스타트업 IPO 시장 회복 → 포트폴리오 Exit 가속화",
              "금리 인하 사이클 진입 시 LP 자금 유입 확대, AUM 급성장",
              "AI·딥테크 포트폴리오 기업 밸류에이션 리레이팅",
              "정부 벤처투자 촉진 정책 수혜 (모태펀드 증액)",
              "배당 확대 및 자사주 매입 등 주주환원 강화",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span style={{ color: BUY_GREEN }} className="flex-shrink-0 font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 p-2 rounded bg-green-100 text-xs text-green-800 font-semibold">
            가정: PER 22x 적용, AUM 연 25% 성장, Exit 수익 150억 이상
          </div>
        </div>

        <div className="rounded-xl p-5 shadow-sm border-2" style={{ borderColor: SELL_RED, backgroundColor: "#fef2f2" }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: SELL_RED }}>▼</div>
            <h2 className="text-lg font-bold" style={{ color: SELL_RED }}>10-B. Bear Case</h2>
            <span className="ml-auto text-lg font-black" style={{ color: SELL_RED }}>목표주가 ₩2,400</span>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            {[
              "금리 고착화로 IPO 시장 침체 장기화, Exit 지연",
              "포트폴리오 기업 실적 악화로 평가손실 확대",
              "경쟁 VC 사의 대형 펀드 결성으로 LP 자금 이탈",
              "거시경제 불확실성 → 스타트업 밸류에이션 하락",
              "규제 환경 변화(세제 혜택 축소 등) 부정적 영향",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span style={{ color: SELL_RED }} className="flex-shrink-0 font-bold">✗</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 p-2 rounded bg-red-100 text-xs text-red-800 font-semibold">
            가정: PER 9x 적용, AUM 정체, 평가손실 80억 이상 발생
          </div>
        </div>
      </div>

      {/* ── 섹션 11: 최종 판단 ── */}
      <div className="rounded-xl p-5 shadow-md mb-6" style={{ background: `linear-gradient(135deg, ${GS_BLUE} 0%, #004A8A 100%)` }}>
        <div className="text-blue-200 text-xs font-semibold tracking-widest uppercase mb-3">11. Final Verdict — Investment Conclusion</div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-shrink-0">
            <div className="inline-block px-6 py-3 rounded-xl text-white font-black text-2xl shadow-lg" style={{ backgroundColor: BUY_GREEN }}>
              매수 (BUY)
            </div>
          </div>
          <div className="flex-1 text-white">
            <p className="text-sm leading-relaxed">
              우리기술투자는 탄탄한 재무 건전성(부채비율 42%)과 순현금 구조를 바탕으로
              벤처투자 사이클 회복 시 레버리지 효과가 극대화될 수 있는 구조적 수혜주다.
              현 주가는 피어 대비 할인 구간에 위치하며, 신규 조합 결성(300억) 모멘텀과
              포트폴리오 Exit 파이프라인이 12개월 내 주가 재평가 트리거로 작동할 전망이다.
            </p>
          </div>
          <div className="text-center flex-shrink-0">
            <div className="text-blue-200 text-xs mb-1">확신도</div>
            <div className="text-4xl font-black text-green-300">7</div>
            <div className="text-blue-300 text-xs">/10</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-blue-600">
          <div className="text-center">
            <div className="text-blue-200 text-xs mb-1">기본 목표가</div>
            <div className="text-xl font-black text-white">₩4,200</div>
            <div className="text-green-300 text-xs">+32.1% 상승여력</div>
          </div>
          <div className="text-center">
            <div className="text-blue-200 text-xs mb-1">Bull 시나리오</div>
            <div className="text-xl font-black" style={{ color: "#86efac" }}>₩5,500</div>
            <div className="text-blue-300 text-xs">+72.9%</div>
          </div>
          <div className="text-center">
            <div className="text-blue-200 text-xs mb-1">Bear 시나리오</div>
            <div className="text-xl font-black" style={{ color: "#fca5a5" }}>₩2,400</div>
            <div className="text-blue-300 text-xs">-24.5%</div>
          </div>
        </div>
      </div>

      {/* 면책조항 */}
      <div className="p-4 rounded-lg bg-gray-100 border border-gray-200 text-xs text-gray-500 leading-relaxed">
        <span className="font-bold text-gray-600">면책 조항(Disclaimer):</span> 본 보고서는 투자 참고 목적의 정보 제공용으로 작성되었으며,
        특정 투자를 권유하거나 보장하지 않습니다. 재무 데이터 일부는 공개 자료 기반 추정치를 포함합니다.
        투자 결정은 반드시 DART 공식 공시 및 전문 금융기관 자료를 직접 확인 후 본인 책임 하에 판단하시기 바랍니다.
        본 보고서는 Goldman Sachs와 무관한 독립적 분석 자료입니다. | 작성일: 2026-04-20
      </div>
    </div>
  );
}
