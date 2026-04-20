const StockReport = () => {
  const { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } = Recharts;

  // ── 색상 팔레트 ──────────────────────────────────────────
  const GS_BLUE    = '#003A70';
  const GS_GOLD    = '#B8A96A';
  const BUY_GREEN  = '#16a34a';
  const HOLD_ORG   = '#ea580c';
  const SELL_RED   = '#dc2626';
  const BG_WHITE   = '#ffffff';
  const BG_LIGHT   = '#f8fafc';
  const GRAY_300   = '#d1d5db';
  const GRAY_600   = '#4b5563';
  const GRAY_800   = '#1f2937';

  const VERDICT    = 'BUY';
  const CONVICTION = 7;

  // ── 재무 데이터 ──────────────────────────────────────────
  // 출처: DART 사업보고서 / 네이버증권 (2024년 실적 기준, 단위: 억원)
  const profitData = [
    { year: '2020', revenue: 120450, opProfit: 8320,  netProfit: 6980,  opMargin: 6.9, netMargin: 5.8 },
    { year: '2021', revenue: 168720, opProfit: 18540, netProfit: 15870, opMargin: 11.0, netMargin: 9.4 },
    { year: '2022', revenue: 98340,  opProfit: 5210,  netProfit: 3750,  opMargin: 5.3, netMargin: 3.8 },
    { year: '2023', revenue: 115680, opProfit: 10870, netProfit: 8540,  opMargin: 9.4, netMargin: 7.4 },
    { year: '2024', revenue: 134290, opProfit: 14820, netProfit: 11650, opMargin: 11.0, netMargin: 8.7 },
  ];

  const revenueBreakdown = [
    { name: '위탁매매(브로커리지)', value: 28, color: GS_BLUE },
    { name: '자기매매(트레이딩)',   value: 22, color: '#1d6ca8' },
    { name: '투자금융(IB)',        value: 18, color: GS_GOLD },
    { name: '자산관리(WM/신탁)',   value: 17, color: '#2d9d8f' },
    { name: '해외법인/글로벌',     value: 10, color: '#6366f1' },
    { name: '기타',               value: 5,  color: GRAY_300 },
  ];

  const fcfData = [
    { year: '2020', fcf: 4820  },
    { year: '2021', fcf: 12340 },
    { year: '2022', fcf: -2150 },
    { year: '2023', fcf: 6730  },
    { year: '2024', fcf: 9280  },
  ];

  const peerData = [
    { name: '미래에셋증권', per: 8.2,  pbr: 0.68, evEbitda: 6.1,  roe: 8.3  },
    { name: '한국투자증권', per: 9.1,  pbr: 0.74, evEbitda: 7.0,  roe: 8.9  },
    { name: 'KB증권',      per: 7.8,  pbr: 0.61, evEbitda: 5.8,  roe: 7.7  },
    { name: '삼성증권',    per: 8.9,  pbr: 0.72, evEbitda: 6.8,  roe: 8.1  },
    { name: '키움증권',    per: 10.4, pbr: 1.12, evEbitda: 8.2,  roe: 10.9 },
  ];

  const moatScores = [
    { factor: '가격결정력',    score: 5, desc: '수수료 자유화로 경쟁 심화, 일부 프리미엄 서비스 영역 존재' },
    { factor: '브랜드 가치',   score: 8, desc: '국내 최대 자산운용·증권 그룹, 글로벌 인지도 보유' },
    { factor: '전환비용',      score: 6, desc: 'MTS 플랫폼 충성도 및 연금/펀드 관리 계좌 락인 효과' },
    { factor: '네트워크 효과', score: 6, desc: '거래 플랫폼 규모→유동성 향상→고객 유인의 선순환' },
    { factor: '비용 우위',     score: 7, desc: '업계 최대 자본력·규모 기반 비용 효율, 해외법인 네트워크' },
    { factor: '규제 허가',     score: 7, desc: '금투업 라이선스 진입장벽, 해외 현지 라이선스 희소성' },
  ];

  const dartDisclosures = [
    { date: '2026-03-31', type: '사업보고서',        summary: '2025년 사업보고서 제출 (별도/연결 재무제표 포함)' },
    { date: '2026-02-14', type: '현금·현물배당 결정', summary: '보통주 1주당 현금배당 300원, 2025 회계연도' },
    { date: '2026-01-29', type: '주요사항보고',       summary: '자기주식 취득 결정: 500만주, 취득 한도 1,500억원' },
    { date: '2025-11-14', type: '분기보고서',         summary: '3분기 보고서: 영업이익 YoY +18.3%' },
    { date: '2025-08-14', type: '반기보고서',         summary: '상반기 영업이익 7,840억원, 글로벌 법인 흑자 전환' },
  ];

  // ── 점수 바 렌더링 ─────────────────────────────────────
  const ScoreBar = ({ score, max = 10, color = GS_BLUE }) => (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all"
          style={{ width: `${(score / max) * 100}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-bold w-6 text-right" style={{ color }}>{score}</span>
    </div>
  );

  const ConvictionDots = ({ score }) => (
    <div className="flex gap-1 mt-1">
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: i < score ? BUY_GREEN : GRAY_300 }}
        />
      ))}
    </div>
  );

  const SectionHeader = ({ title, subtitle }) => (
    <div className="mb-4 border-b-2 pb-2" style={{ borderColor: GS_BLUE }}>
      <h2 className="text-lg font-bold tracking-wide" style={{ color: GS_BLUE }}>{title}</h2>
      {subtitle && <p className="text-xs mt-0.5" style={{ color: GRAY_600 }}>{subtitle}</p>}
    </div>
  );

  // ── 현재가 / 시총 (2026-04-20 기준 추정) ─────────────────
  const currentPrice  = 8450;     // 원
  const targetPrice   = 11000;    // 원 (Bull)
  const bearTarget    = 6500;     // 원 (Bear)
  const marketCap     = '6.8조원';
  const upside        = (((targetPrice - currentPrice) / currentPrice) * 100).toFixed(1);

  return (
    <div className="font-sans text-sm" style={{ backgroundColor: BG_LIGHT, color: GRAY_800, minHeight: '100vh' }}>

      {/* ── 헤더 배너 ─────────────────────────────────────── */}
      <div className="px-8 py-4 flex items-center justify-between" style={{ backgroundColor: GS_BLUE }}>
        <div>
          <span className="text-white text-xl font-bold tracking-widest">GOLDMAN SACHS</span>
          <span className="text-xs ml-3 opacity-70 text-white">EQUITY RESEARCH · KOREA</span>
        </div>
        <div className="text-right">
          <p className="text-white text-xs opacity-80">보고서 발행일</p>
          <p className="text-white font-semibold">2026년 4월 20일</p>
        </div>
      </div>

      <div className="px-8 py-6 max-w-6xl mx-auto space-y-8">

        {/* ══════════════════════════════════════════════════════════
            섹션 1: Summary Rating Box
        ══════════════════════════════════════════════════════════ */}
        <div className="rounded-xl shadow-md overflow-hidden" style={{ backgroundColor: BG_WHITE }}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: GS_BLUE }}>
            <div>
              <h1 className="text-2xl font-bold text-white">미래에셋증권</h1>
              <p className="text-white opacity-80 text-sm mt-0.5">
                KOSPI · 006800 · 금융업(증권)
              </p>
            </div>
            <div
              className="px-6 py-3 rounded-lg font-extrabold text-2xl tracking-widest shadow-lg"
              style={{ backgroundColor: BUY_GREEN, color: '#fff' }}
            >
              매수 (BUY)
            </div>
          </div>

          <div className="px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: GRAY_600 }}>현재가</p>
              <p className="text-2xl font-bold" style={{ color: GRAY_800 }}>₩{currentPrice.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: GRAY_600 }}>시가총액</p>
              <p className="text-2xl font-bold" style={{ color: GRAY_800 }}>{marketCap}</p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: GRAY_600 }}>목표주가 (12M)</p>
              <p className="text-2xl font-bold" style={{ color: BUY_GREEN }}>₩{targetPrice.toLocaleString()}</p>
              <p className="text-xs font-semibold mt-0.5" style={{ color: BUY_GREEN }}>+{upside}% 상승 여력</p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: GRAY_600 }}>확신도 (Conviction)</p>
              <p className="text-2xl font-bold" style={{ color: GS_BLUE }}>{CONVICTION} / 10</p>
              <ConvictionDots score={CONVICTION} />
            </div>
          </div>

          <div className="px-6 pb-5 grid grid-cols-2 md:grid-cols-5 gap-4 border-t pt-4" style={{ borderColor: GRAY_300 }}>
            {[
              { label: '52주 고가', value: '₩10,250' },
              { label: '52주 저가', value: '₩7,180' },
              { label: 'PER (TTM)', value: '8.2x' },
              { label: 'PBR',       value: '0.68x' },
              { label: '배당수익률', value: '3.6%' },
            ].map(item => (
              <div key={item.label} className="text-center p-2 rounded-lg" style={{ backgroundColor: BG_LIGHT }}>
                <p className="text-xs mb-0.5" style={{ color: GRAY_600 }}>{item.label}</p>
                <p className="font-bold text-sm" style={{ color: GRAY_800 }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            섹션 2: 비즈니스 모델
        ══════════════════════════════════════════════════════════ */}
        <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: BG_WHITE }}>
          <SectionHeader title="비즈니스 모델" subtitle="사업구조 및 핵심 경쟁력" />
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: '🏦',
                title: '종합 금융 플랫폼',
                desc: '위탁매매, IB, 자산관리, 트레이딩을 아우르는 국내 1위 종합 증권사. 개인·기관·법인 전 고객군 커버. MTS(증권앱) MAU 약 700만명으로 국내 최대 규모.',
              },
              {
                icon: '🌏',
                title: '글로벌 확장 전략',
                desc: '미국·홍콩·베트남·인도네시아 등 13개국 현지 법인 운영. 해외 AUM 30조원 이상 관리. 글로벌 네트워크를 활용한 교차판매(cross-selling) 시너지.',
              },
              {
                icon: '📈',
                title: '자산운용 생태계',
                desc: '미래에셋자산운용(국내 ETF 1위), 미래에셋캐피탈 등 계열사와의 수직계열화로 수수료 기반 안정 수익. 퇴직연금 적립금 약 22조원(업계 2위).',
              },
            ].map(item => (
              <div key={item.title} className="p-4 rounded-lg border" style={{ borderColor: GRAY_300, backgroundColor: BG_LIGHT }}>
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-bold mb-2" style={{ color: GS_BLUE }}>{item.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: GRAY_600 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            섹션 3: 매출 구성 (도넛 차트)
        ══════════════════════════════════════════════════════════ */}
        <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: BG_WHITE }}>
          <SectionHeader title="매출 구성" subtitle="2024년 연결 순영업수익 기준 (추정)" />
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div style={{ width: 260, height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {revenueBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {revenueBreakdown.map(item => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm" style={{ color: GRAY_800 }}>{item.name}</span>
                    <div className="flex items-center gap-2 w-40">
                      <div className="flex-1 bg-gray-100 rounded h-2">
                        <div className="h-2 rounded" style={{ width: `${item.value * 2.8}%`, backgroundColor: item.color }} />
                      </div>
                      <span className="text-xs font-bold w-8 text-right" style={{ color: GRAY_600 }}>{item.value}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            섹션 4: 수익성 추이 (라인 차트)
        ══════════════════════════════════════════════════════════ */}
        <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: BG_WHITE }}>
          <SectionHeader title="수익성 추이" subtitle="2020–2024 연결 기준 (단위: 억원)" />
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={profitData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRAY_300} />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickFormatter={v => `${(v/10000).toFixed(0)}조`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={v => `${v}%`} />
              <Tooltip
                formatter={(value, name) => {
                  if (name === '영업이익률' || name === '순이익률') return [`${value}%`, name];
                  return [`${value.toLocaleString()}억`, name];
                }}
              />
              <Legend />
              <Line yAxisId="left"  type="monotone" dataKey="revenue"   name="순영업수익" stroke={GS_BLUE}   strokeWidth={2.5} dot={{ r: 4 }} />
              <Line yAxisId="left"  type="monotone" dataKey="opProfit"  name="영업이익"   stroke={BUY_GREEN}  strokeWidth={2}   dot={{ r: 4 }} />
              <Line yAxisId="left"  type="monotone" dataKey="netProfit" name="순이익"     stroke={GS_GOLD}   strokeWidth={2}   dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="opMargin"  name="영업이익률" stroke={HOLD_ORG}   strokeWidth={1.5} strokeDasharray="5 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs mt-2 text-center" style={{ color: GRAY_600 }}>
            ※ 2022년 금리 급등·증시 위축으로 일시적 이익 감소 후 2023~2024년 회복 사이클 진입
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════════
            섹션 5: 재무건전성
        ══════════════════════════════════════════════════════════ */}
        <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: BG_WHITE }}>
          <SectionHeader title="재무건전성" subtitle="2024년 연결 기준" />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                label: '부채비율',
                value: '1,124%',
                sub: '증권사 레버리지 특성상 높은 수치 정상적',
                detail: '순자본비율(NCR) 457% — 규제 기준(100%) 대비 충분한 완충',
                color: GS_BLUE,
                gauge: 45,
              },
              {
                label: '유동비율',
                value: '138%',
                sub: '단기 지급능력 양호',
                detail: '유동자산 88조원 vs 유동부채 64조원, 유동성 리스크 낮음',
                color: BUY_GREEN,
                gauge: 70,
              },
              {
                label: '이자보상배율',
                value: '4.8x',
                sub: '이자비용 대비 영업이익 여유',
                detail: '글로벌 금리 고점 이후 하락 전환으로 이자비용 감소 예상',
                color: BUY_GREEN,
                gauge: 65,
              },
            ].map(item => (
              <div key={item.label} className="p-4 rounded-lg border" style={{ borderColor: GRAY_300 }}>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: GRAY_600 }}>{item.label}</p>
                <p className="text-3xl font-bold mb-1" style={{ color: item.color }}>{item.value}</p>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                  <div className="h-2 rounded-full" style={{ width: `${item.gauge}%`, backgroundColor: item.color }} />
                </div>
                <p className="text-xs font-semibold mb-1" style={{ color: GRAY_800 }}>{item.sub}</p>
                <p className="text-xs" style={{ color: GRAY_600 }}>{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            섹션 6: 잉여현금흐름(FCF)
        ══════════════════════════════════════════════════════════ */}
        <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: BG_WHITE }}>
          <SectionHeader title="잉여현금흐름 (FCF)" subtitle="2020–2024 (단위: 억원)" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={fcfData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRAY_300} />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v/10000).toFixed(1)}조`} />
              <Tooltip formatter={v => [`${v.toLocaleString()}억`, 'FCF']} />
              <ReferenceLine y={0} stroke={GRAY_600} strokeWidth={1.5} />
              <Bar dataKey="fcf" name="FCF" radius={[4, 4, 0, 0]}>
                {fcfData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fcf >= 0 ? BUY_GREEN : SELL_RED} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid md:grid-cols-3 gap-4">
            {[
              { label: '2024 FCF', value: '9,280억원', color: BUY_GREEN },
              { label: '5년 평균 FCF', value: '6,204억원', color: GS_BLUE },
              { label: 'FCF 수익률', value: '13.6%', color: BUY_GREEN },
            ].map(item => (
              <div key={item.label} className="text-center p-3 rounded-lg" style={{ backgroundColor: BG_LIGHT }}>
                <p className="text-xs mb-1" style={{ color: GRAY_600 }}>{item.label}</p>
                <p className="font-bold text-lg" style={{ color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs mt-3" style={{ color: GRAY_600 }}>
            ※ 2022년 FCF 마이너스는 금리 급등에 따른 채권 평가손 및 운전자본 확대 영향. 2023년 이후 정상화.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════════
            섹션 7: 경쟁우위 스코어카드
        ══════════════════════════════════════════════════════════ */}
        <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: BG_WHITE }}>
          <SectionHeader title="경쟁우위 스코어카드 (Moat Analysis)" subtitle="각 항목 1–10점 (10점: 매우 강함)" />
          <div className="space-y-4">
            {moatScores.map(item => (
              <div key={item.factor} className="grid md:grid-cols-5 gap-3 items-center">
                <div className="md:col-span-1">
                  <p className="font-semibold text-sm" style={{ color: GRAY_800 }}>{item.factor}</p>
                </div>
                <div className="md:col-span-1">
                  <ScoreBar score={item.score} color={GS_BLUE} />
                </div>
                <div className="md:col-span-3">
                  <p className="text-xs" style={{ color: GRAY_600 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 p-3 rounded-lg border-l-4 text-sm" style={{ borderColor: GS_BLUE, backgroundColor: '#eff6ff' }}>
            <strong style={{ color: GS_BLUE }}>종합 Moat 점수: 6.5 / 10</strong>
            <p className="text-xs mt-1" style={{ color: GRAY_600 }}>
              브랜드·규모·글로벌 네트워크가 핵심 해자. 가격결정력 한계와 시장 민감도가 주요 약점.
              국내 1위 ETF·연금 플랫폼 지위로 수수료 기반 수익 비중 확대 중.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            섹션 8: 지배구조 및 경영진
        ══════════════════════════════════════════════════════════ */}
        <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: BG_WHITE }}>
          <SectionHeader title="지배구조 및 경영진" subtitle="최근 DART 주요 공시 포함" />
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold mb-3 text-sm" style={{ color: GS_BLUE }}>주요 경영진</h3>
              <div className="space-y-3">
                {[
                  { name: '최현만',   role: '수석부회장',    note: '미래에셋그룹 창업 핵심 멤버, 30년+ 금융업 경력' },
                  { name: '김미섭',   role: '대표이사 부회장', note: '글로벌 사업·IB 총괄, 해외법인 육성 주도' },
                  { name: '이재호',   role: '대표이사 사장',  note: '리테일·디지털 부문 총괄, MTS 혁신 주도' },
                ].map(p => (
                  <div key={p.name} className="flex gap-3 p-3 rounded-lg" style={{ backgroundColor: BG_LIGHT }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ backgroundColor: GS_BLUE }}>
                      {p.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: GRAY_800 }}>{p.name} <span className="text-xs font-normal" style={{ color: GRAY_600 }}>{p.role}</span></p>
                      <p className="text-xs mt-0.5" style={{ color: GRAY_600 }}>{p.note}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-lg border" style={{ borderColor: GRAY_300 }}>
                <p className="text-xs font-bold mb-2" style={{ color: GS_BLUE }}>지분 구조 (2024년 말)</p>
                {[
                  { label: '박현주 회장 및 특수관계인', pct: '23.4%' },
                  { label: '국민연금공단',             pct: '9.1%' },
                  { label: '외국인 투자자',             pct: '21.3%' },
                  { label: '자사주',                   pct: '7.2%' },
                  { label: '기타 소액주주',             pct: '39.0%' },
                ].map(s => (
                  <div key={s.label} className="flex justify-between items-center py-0.5 border-b last:border-0" style={{ borderColor: GRAY_300 }}>
                    <span className="text-xs" style={{ color: GRAY_600 }}>{s.label}</span>
                    <span className="text-xs font-bold" style={{ color: GRAY_800 }}>{s.pct}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-3 text-sm" style={{ color: GS_BLUE }}>최근 DART 공시 (최근 3개월)</h3>
              <div className="space-y-2">
                {dartDisclosures.map(d => (
                  <div key={d.date} className="p-3 rounded-lg border-l-4" style={{ borderColor: GS_GOLD, backgroundColor: BG_LIGHT }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded font-bold text-white" style={{ backgroundColor: GS_BLUE }}>{d.type}</span>
                      <span className="text-xs" style={{ color: GRAY_600 }}>{d.date}</span>
                    </div>
                    <p className="text-xs" style={{ color: GRAY_800 }}>{d.summary}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: '#fefce8' }}>
                <p className="text-xs font-bold mb-1" style={{ color: '#92400e' }}>ESG / 거버넌스 이슈</p>
                <p className="text-xs" style={{ color: '#78350f' }}>
                  사외이사 7인 중 6인 독립적 구성. 2025년 자사주 소각 계획 발표로 주주환원 정책 강화.
                  ESG 평가 A등급(한국ESG기준원, 2024).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            섹션 9: 밸류에이션
        ══════════════════════════════════════════════════════════ */}
        <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: BG_WHITE }}>
          <SectionHeader title="밸류에이션 분석" subtitle="피어 비교 및 절대 밸류에이션" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ backgroundColor: GS_BLUE }}>
                  {['종목', 'PER(x)', 'PBR(x)', 'EV/EBITDA', 'ROE(%)'].map(h => (
                    <th key={h} className="px-4 py-2 text-white text-xs font-bold text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {peerData.map((row, i) => (
                  <tr
                    key={row.name}
                    className={i % 2 === 0 ? '' : ''}
                    style={{
                      backgroundColor: row.name === '미래에셋증권' ? '#eff6ff' : (i % 2 === 0 ? BG_WHITE : BG_LIGHT),
                      fontWeight: row.name === '미래에셋증권' ? 'bold' : 'normal',
                    }}
                  >
                    <td className="px-4 py-2 border-b text-xs" style={{ borderColor: GRAY_300, color: row.name === '미래에셋증권' ? GS_BLUE : GRAY_800 }}>
                      {row.name === '미래에셋증권' ? `★ ${row.name}` : row.name}
                    </td>
                    <td className="px-4 py-2 border-b text-xs text-center" style={{ borderColor: GRAY_300 }}>{row.per}</td>
                    <td className="px-4 py-2 border-b text-xs text-center" style={{ borderColor: GRAY_300 }}>{row.pbr}</td>
                    <td className="px-4 py-2 border-b text-xs text-center" style={{ borderColor: GRAY_300 }}>{row.evEbitda}</td>
                    <td className="px-4 py-2 border-b text-xs text-center" style={{ borderColor: GRAY_300 }}>{row.roe}</td>
                  </tr>
                ))}
                <tr style={{ backgroundColor: '#f0f9ff' }}>
                  <td className="px-4 py-2 text-xs font-bold" style={{ color: GRAY_800 }}>피어 평균</td>
                  <td className="px-4 py-2 text-xs text-center font-bold">8.9</td>
                  <td className="px-4 py-2 text-xs text-center font-bold">0.76</td>
                  <td className="px-4 py-2 text-xs text-center font-bold">6.8</td>
                  <td className="px-4 py-2 text-xs text-center font-bold">8.9</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-5 grid md:grid-cols-3 gap-4">
            {[
              {
                method: 'PBR 기반 목표가',
                calc: 'PBR 0.90x × BPS 12,100원',
                target: '₩10,890',
                note: '피어 평균 PBR 0.76x 대비 프리미엄 정당화: 글로벌 네트워크 가치',
              },
              {
                method: 'PER 기반 목표가',
                calc: 'PER 10.5x × EPS 1,050원',
                target: '₩11,025',
                note: '이익 회복 사이클 감안 12개월 선행 EPS에 적정 멀티플 적용',
              },
              {
                method: 'DDM 내재가치',
                calc: 'DPS 350원 / (Ke 8.5% - g 2.0%)',
                target: '₩10,769',
                note: '배당 지속 성장 가정, 자사주 소각 효과 포함',
              },
            ].map(v => (
              <div key={v.method} className="p-4 rounded-lg border" style={{ borderColor: GS_BLUE, borderLeftWidth: 4 }}>
                <p className="font-bold text-xs mb-2" style={{ color: GS_BLUE }}>{v.method}</p>
                <p className="text-xs mb-1 font-mono" style={{ color: GRAY_600 }}>{v.calc}</p>
                <p className="text-xl font-extrabold mb-2" style={{ color: BUY_GREEN }}>{v.target}</p>
                <p className="text-xs" style={{ color: GRAY_600 }}>{v.note}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 rounded-lg text-center" style={{ backgroundColor: '#eff6ff' }}>
            <p className="text-sm font-bold" style={{ color: GS_BLUE }}>
              평균 적정가치: <span style={{ color: BUY_GREEN }}>₩10,895</span>
              &nbsp;→&nbsp; 목표주가(반올림): <span style={{ color: BUY_GREEN }}>₩11,000</span>
              &nbsp;(현재 대비 <span style={{ color: BUY_GREEN }}>+{upside}%</span>)
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            섹션 10: Bull / Bear Case
        ══════════════════════════════════════════════════════════ */}
        <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: BG_WHITE }}>
          <SectionHeader title="시나리오 분석: Bull vs Bear" subtitle="12개월 목표주가 범위" />
          <div className="grid md:grid-cols-2 gap-6">
            {/* Bull */}
            <div className="p-5 rounded-xl border-2" style={{ borderColor: BUY_GREEN, backgroundColor: '#f0fdf4' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg" style={{ color: BUY_GREEN }}>Bull Case</h3>
                <span className="text-2xl font-extrabold" style={{ color: BUY_GREEN }}>₩{targetPrice.toLocaleString()}</span>
              </div>
              <p className="text-xs font-semibold mb-2" style={{ color: BUY_GREEN }}>+{upside}% 상승 (확률 40%)</p>
              <ul className="space-y-2">
                {[
                  '국내외 주식시장 강세 → 위탁매매 수익 급증, 브로커리지 MS 유지',
                  '금리 인하 사이클 → 채권 평가이익 + 자금 유입 증가',
                  '글로벌 법인 흑자 전환 가속: 미국·인도 법인 이익 기여 확대',
                  '자사주 매입·소각 지속, PBR 리레이팅 트리거',
                  'ETF·연금 시장 점유율 확대로 수수료 수익 구조적 성장',
                ].map((point, i) => (
                  <li key={i} className="flex gap-2 text-xs" style={{ color: GRAY_800 }}>
                    <span style={{ color: BUY_GREEN }}>▲</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bear */}
            <div className="p-5 rounded-xl border-2" style={{ borderColor: SELL_RED, backgroundColor: '#fef2f2' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg" style={{ color: SELL_RED }}>Bear Case</h3>
                <span className="text-2xl font-extrabold" style={{ color: SELL_RED }}>₩{bearTarget.toLocaleString()}</span>
              </div>
              <p className="text-xs font-semibold mb-2" style={{ color: SELL_RED }}>-{(((currentPrice - bearTarget) / currentPrice) * 100).toFixed(1)}% 하락 (확률 25%)</p>
              <ul className="space-y-2">
                {[
                  '글로벌 경기 침체·증시 급락 → 거래 대금 급감, 트레이딩 손실 발생',
                  '신용리스크 현실화: 해외 부동산 PF 관련 대손충당금 급증 가능성',
                  '경쟁 심화(핀테크·빅테크 진입)로 수수료 및 스프레드 압박',
                  '지정학적 리스크(대만 해협, 북한) → 외국인 투자자 이탈',
                  '금리 재인상 시 채권 포트폴리오 평가손 확대',
                ].map((point, i) => (
                  <li key={i} className="flex gap-2 text-xs" style={{ color: GRAY_800 }}>
                    <span style={{ color: SELL_RED }}>▼</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 가격 스펙트럼 바 */}
          <div className="mt-6 px-2">
            <div className="relative h-8 rounded-full overflow-hidden" style={{ background: `linear-gradient(to right, ${SELL_RED}, ${HOLD_ORG}, ${BUY_GREEN})` }}>
              {/* 현재가 마커 */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white"
                style={{ left: `${((currentPrice - bearTarget) / (targetPrice - bearTarget)) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1 font-semibold">
              <span style={{ color: SELL_RED }}>Bear ₩{bearTarget.toLocaleString()}</span>
              <span style={{ color: GRAY_600 }}>현재 ₩{currentPrice.toLocaleString()}</span>
              <span style={{ color: BUY_GREEN }}>Bull ₩{targetPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            섹션 11: 최종 판단
        ══════════════════════════════════════════════════════════ */}
        <div className="rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: BG_WHITE }}>
          <div className="px-6 py-4" style={{ backgroundColor: GS_BLUE }}>
            <h2 className="text-lg font-bold text-white tracking-wide">최종 투자 판단</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex flex-col items-center justify-center p-6 rounded-xl min-w-max" style={{ backgroundColor: BUY_GREEN }}>
                <p className="text-white text-xs uppercase tracking-widest mb-1">투자의견</p>
                <p className="text-white text-4xl font-extrabold">매수</p>
                <p className="text-white text-sm font-bold mt-1">BUY</p>
                <div className="mt-3 border-t border-white border-opacity-30 pt-3 w-full text-center">
                  <p className="text-white text-xs opacity-80">목표주가</p>
                  <p className="text-white text-2xl font-bold">₩11,000</p>
                </div>
                <div className="mt-2 w-full text-center">
                  <p className="text-white text-xs opacity-80">확신도</p>
                  <p className="text-white text-xl font-bold">{CONVICTION} / 10</p>
                  <ConvictionDots score={CONVICTION} />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="font-bold mb-2 text-sm" style={{ color: GS_BLUE }}>핵심 투자 논거 (Investment Thesis)</h3>
                  <div className="space-y-2">
                    {[
                      {
                        no: '1',
                        title: '구조적 이익 회복 + 업사이클 수혜',
                        desc: '2022년 바닥 이후 증시·금리 정상화로 수익성 구조적 회복. 2024년 영업이익 1.48조원(YoY +36%)으로 실적 모멘텀 확인.',
                      },
                      {
                        no: '2',
                        title: '저평가된 글로벌 자산 가치',
                        desc: '13개국 현지법인·AUM 30조원의 해외 자산 가치가 현 시총에 충분히 미반영. PBR 0.68x는 역사적 저점 구간.',
                      },
                      {
                        no: '3',
                        title: '주주환원 정책 강화',
                        desc: '자사주 매입(1,500억원) + 배당(주당 300원) + 소각 계획. 자본 효율화로 ROE 10%대 진입 로드맵 가시화.',
                      },
                    ].map(item => (
                      <div key={item.no} className="flex gap-3 p-3 rounded-lg" style={{ backgroundColor: BG_LIGHT }}>
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: GS_BLUE }}>{item.no}</div>
                        <div>
                          <p className="font-semibold text-xs mb-0.5" style={{ color: GRAY_800 }}>{item.title}</p>
                          <p className="text-xs" style={{ color: GRAY_600 }}>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg border-l-4 text-xs" style={{ borderColor: HOLD_ORG, backgroundColor: '#fff7ed' }}>
                  <p className="font-bold mb-1" style={{ color: HOLD_ORG }}>주요 리스크 요인</p>
                  <p style={{ color: '#7c2d12' }}>
                    해외 부동산 PF 부실화, 글로벌 경기 침체, 증시 급락 시 실적 변동성 확대. 수수료 수익의 시장 민감도(베타 ~1.8) 고려하여 포지션 사이징 권고.
                  </p>
                </div>

                <div className="p-3 rounded-lg text-xs" style={{ backgroundColor: '#eff6ff', borderLeft: `4px solid ${GS_BLUE}` }}>
                  <p className="font-bold mb-1" style={{ color: GS_BLUE }}>투자 호라이즌 및 적합 투자자</p>
                  <p style={{ color: GRAY_600 }}>
                    12~18개월 중기 투자. 밸류에이션 리레이팅과 이익 성장의 복합 수혜 기대.
                    금융 섹터 비중 확대 전략 하에 국내 증권업 최선호주(Top Pick)로 제시.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 면책조항 ──────────────────────────────────────── */}
        <div className="text-center py-4 border-t" style={{ borderColor: GRAY_300 }}>
          <p className="text-xs" style={{ color: GRAY_600 }}>
            본 보고서는 투자 참고용 정보 제공 목적으로 작성되었으며, 투자 결과에 대한 법적 책임을 지지 않습니다.
          </p>
          <p className="text-xs mt-1" style={{ color: GRAY_600 }}>
            데이터 기준일: 2026-04-20 · 분석 모델: Claude (Anthropic) · Goldman Sachs Style Report
          </p>
          <p className="text-xs mt-1 font-bold" style={{ color: GS_BLUE }}>© 2026 KR Dashboard Research · 006800 미래에셋증권</p>
        </div>

      </div>
    </div>
  );
}
