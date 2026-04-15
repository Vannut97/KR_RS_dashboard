import os
import streamlit as st
import streamlit.components.v1 as components
import sqlite3
import pandas as pd
import plotly.express as px
import FinanceDataReader as fdr
from db_sqlite import get_all_report_tickers, get_all_reports

# ==========================================
# 페이지 설정
# ==========================================
st.set_page_config(
    page_title="KR RS Rating Screener",
    page_icon="📊",
    layout="wide",
)

st.title("📊 KR RS Rating Screener")

# ==========================================
# 데이터 로드
# ==========================================
DB_PATH = "quant_dashboard.db"


@st.cache_data(ttl=600)
def load_rs_data():
    """SQLite에서 RS 데이터 로드."""
    conn = sqlite3.connect(DB_PATH)
    df = pd.read_sql("SELECT * FROM rs_ratings ORDER BY rs_rating DESC", conn)
    conn.close()
    return df


@st.cache_data(ttl=600)
def load_fundamentals():
    """SQLite에서 '종목당 최신' 펀더멘탈 데이터 로드.

    펀더멘탈은 3/6/9/12월 금요일에만 전체 리프레시되고, 그 외에는 신규 종목만
    수집되므로 일자별 스냅샷이 희소하다. 대시보드에서는 종목별로 가장 최근에
    수집된 펀더멘탈 1건만 사용해 RS 테이블과 ticker 기준으로 조인한다.
    """
    conn = sqlite3.connect(DB_PATH)
    tables = pd.read_sql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='fundamentals'",
        conn,
    )
    if tables.empty:
        conn.close()
        return pd.DataFrame()

    df = pd.read_sql(
        """
        SELECT f.*
        FROM fundamentals f
        INNER JOIN (
            SELECT ticker, MAX(date) AS max_date
            FROM fundamentals
            GROUP BY ticker
        ) latest
          ON f.ticker = latest.ticker
         AND f.date = latest.max_date
        """,
        conn,
    )
    conn.close()
    return df


@st.cache_data(ttl=3600)
def load_universe():
    """KRX 종목명 & 시장 정보 로드."""
    df_krx = fdr.StockListing("KRX")
    df_krx = df_krx[["Code", "Name", "Market"]].copy()
    df_krx.columns = ["ticker", "name", "market"]
    return df_krx


@st.cache_data(ttl=300)
def load_report_index():
    """보고서 인덱스 로드 (report_tickers set, reports list)."""
    try:
        report_tickers = get_all_report_tickers(DB_PATH)
        reports        = get_all_reports(DB_PATH)
    except Exception:
        report_tickers = set()
        reports        = []
    return report_tickers, reports


# ==========================================
# 데이터 준비
# ==========================================
df_rs       = load_rs_data()
df_fund     = load_fundamentals()
df_universe = load_universe()
report_tickers, all_reports = load_report_index()

# 종목명 & 시장 정보 병합
df = df_rs.merge(df_universe, on="ticker", how="left")

# 펀더멘탈 병합 — 종목별 최신 1건, ticker 키
if not df_fund.empty:
    fund_cols = [
        "ticker", "latest_quarter",
        "revenue_yoy", "eps_yoy", "op_profit_yoy",
        "op_margin", "net_margin", "op_margin_chg", "net_margin_chg",
        "roe", "roa", "debt_ratio",
        "annual_revenue_yoy", "annual_eps_yoy",
        "annual_revenue_2yr", "annual_eps_2yr",
        "annual_op_margin", "annual_net_margin",
    ]
    fund_cols = [c for c in fund_cols if c in df_fund.columns]
    df = df.merge(df_fund[fund_cols], on="ticker", how="left")

has_fundamentals = not df_fund.empty and "eps_yoy" in df.columns

# 보고서 보유 여부 컬럼 추가
df["has_report"] = df["ticker"].apply(lambda x: "📄" if x in report_tickers else "")

# ==========================================
# 탭 구성
# ==========================================
tab_screener, tab_reports = st.tabs(["📋 스크리너", "📄 보고서"])

# ==========================================
# TAB 1 — 스크리너
# ==========================================
with tab_screener:

    # ── 사이드바 필터 ──
    st.sidebar.header("🔍 필터 설정")

    available_dates = sorted(df["date"].unique(), reverse=True)
    selected_date   = st.sidebar.selectbox("📅 기준일", available_dates)

    market_options  = ["전체", "KOSPI", "KOSDAQ"]
    selected_market = st.sidebar.selectbox("🏛️ 시장", market_options)

    st.sidebar.markdown("---")
    st.sidebar.subheader("RS Rating 범위")
    rs_min, rs_max = st.sidebar.slider("IBD RS Rating", 1, 99, (1, 99))

    with st.sidebar.expander("📐 개별 기간 RS 필터"):
        rs_1m_min  = st.slider("RS 1M 최소",  1, 99, 1)
        rs_3m_min  = st.slider("RS 3M 최소",  1, 99, 1)
        rs_6m_min  = st.slider("RS 6M 최소",  1, 99, 1)
        rs_12m_min = st.slider("RS 12M 최소", 1, 99, 1)

    if has_fundamentals:
        with st.sidebar.expander("📈 펀더멘탈 필터"):
            eps_yoy_min     = st.number_input("EPS YoY 최소 (%)",    value=-9999,  step=5)
            revenue_yoy_min = st.number_input("매출 YoY 최소 (%)",   value=-9999,  step=5)
            roe_min_f       = st.number_input("ROE 최소 (%)",         value=-9999.0, step=1.0)
            op_margin_min   = st.number_input("영업이익률 최소 (%)", value=-9999.0, step=1.0)

    st.sidebar.markdown("---")
    price_min = st.sidebar.number_input("💰 최소 종가", value=0, step=1000)
    price_max = st.sidebar.number_input("💰 최대 종가 (0=무제한)", value=0, step=10000)

    st.sidebar.markdown("---")
    search_query = st.sidebar.text_input("🔎 종목명/코드 검색")

    # ── 필터 적용 ──
    filtered = df[df["date"] == selected_date].copy()

    if selected_market != "전체":
        filtered = filtered[filtered["market"] == selected_market]

    filtered = filtered[
        (filtered["rs_rating"] >= rs_min) & (filtered["rs_rating"] <= rs_max)
    ]
    filtered = filtered[
        (filtered["rs_1m"].fillna(0)  >= rs_1m_min)
        & (filtered["rs_3m"].fillna(0)  >= rs_3m_min)
        & (filtered["rs_6m"].fillna(0)  >= rs_6m_min)
        & (filtered["rs_12m"].fillna(0) >= rs_12m_min)
    ]

    if has_fundamentals:
        if eps_yoy_min > -9999:
            filtered = filtered[filtered["eps_yoy"].fillna(-99999) >= eps_yoy_min]
        if revenue_yoy_min > -9999:
            filtered = filtered[filtered["revenue_yoy"].fillna(-99999) >= revenue_yoy_min]
        if roe_min_f > -9999:
            filtered = filtered[filtered["roe"].fillna(-99999) >= roe_min_f]
        if op_margin_min > -9999:
            filtered = filtered[filtered["op_margin"].fillna(-99999) >= op_margin_min]

    filtered = filtered[filtered["latest_close"] >= price_min]
    if price_max > 0:
        filtered = filtered[filtered["latest_close"] <= price_max]

    if search_query:
        mask = (
            filtered["ticker"].str.contains(search_query, case=False, na=False)
            | filtered["name"].str.contains(search_query, case=False, na=False)
        )
        filtered = filtered[mask]

    # ── 표시 컬럼 ──
    display_cols = [
        "ticker", "has_report", "name", "market",
        "latest_close", "market_cap", "avg_vol_10d",
        "rs_rating", "composite_score",
        "rs_1d", "rs_1w", "rs_1m", "rs_3m", "rs_6m", "rs_12m",
        "ret_1d", "ret_1w", "ret_1m", "ret_3m", "ret_6m", "ret_12m",
    ]

    if has_fundamentals:
        display_cols += [
            "eps_yoy", "revenue_yoy", "op_profit_yoy",
            "op_margin", "net_margin", "op_margin_chg", "net_margin_chg",
            "roe", "roa", "debt_ratio",
            "annual_eps_yoy", "annual_revenue_yoy",
            "annual_eps_2yr", "annual_revenue_2yr",
            "annual_op_margin", "annual_net_margin",
            "latest_quarter",
        ]

    display_cols = [c for c in display_cols if c in filtered.columns]
    df_display   = filtered[display_cols].reset_index(drop=True)

    # ── 요약 지표 ──
    col1, col2, col3, col4, col5 = st.columns(5)
    col1.metric("📅 기준일",   selected_date)
    col2.metric("📋 필터 결과", f"{len(df_display)}개")
    col3.metric("🏛️ 시장",     selected_market)
    col4.metric("전체 종목",   f"{len(df[df['date'] == selected_date])}개")
    col5.metric("📄 보고서 보유", f"{df_display['has_report'].astype(bool).sum()}개"
                if "has_report" in df_display.columns else "0개")

    st.markdown("---")

    # ── 새 보고서 알림 팝업 ──
    if all_reports:
        latest_report_date = all_reports[0]["report_date"]
        latest_report_tickers = [
            r["ticker"] for r in all_reports if r["report_date"] == latest_report_date
        ]
        if latest_report_tickers:
            st.info(
                f"📄 **{latest_report_date}** 신규 보고서 생성: "
                f"**{', '.join(latest_report_tickers)}** "
                f"— 보고서 탭에서 확인하세요.",
                icon="🆕",
            )

    # ── RS × 펀더멘탈 산점도 ──
    st.markdown("---")
    st.subheader("🔭 RS Rating × EPS YoY 산점도")

    if has_fundamentals:
        # 기준일 전체 데이터에서 RS 상위 200종목 (펀더멘탈 있는 종목만)
        df_bubble = (
            df[df["date"] == selected_date]
            .dropna(subset=["rs_rating", "eps_yoy"])
            .nlargest(200, "rs_rating")
            .copy()
        )

        # 버블 크기: 시가총액 sqrt 스케일 (대형주가 지나치게 커지지 않도록)
        df_bubble["_bubble"] = (
            df_bubble["market_cap"].fillna(100).clip(lower=10) ** 0.5
        )

        # 호버 표기용 컬럼 포맷
        for col in ["eps_yoy", "revenue_yoy", "roe", "roa", "net_margin", "op_margin"]:
            if col in df_bubble.columns:
                df_bubble[col] = df_bubble[col].round(1)
        if "latest_close" in df_bubble.columns:
            df_bubble["latest_close"] = df_bubble["latest_close"].astype(int)

        hover_cols = {c: True for c in [
            "ticker", "revenue_yoy", "roe", "roa",
            "net_margin", "op_margin", "latest_close", "market_cap",
        ] if c in df_bubble.columns}
        hover_cols["_bubble"] = False  # 버블 크기 컬럼 숨김

        fig = px.scatter(
            df_bubble,
            x="rs_rating",
            y="eps_yoy",
            size="_bubble",
            size_max=55,
            color="market",
            color_discrete_map={"KOSPI": "#003A70", "KOSDAQ": "#16a34a"},
            hover_name="name",
            hover_data=hover_cols,
            labels={
                "rs_rating":    "RS Rating",
                "eps_yoy":      "EPS YoY (%)",
                "revenue_yoy":  "매출 YoY (%)",
                "roe":          "ROE (%)",
                "roa":          "ROA (%)",
                "net_margin":   "순이익률 (%)",
                "op_margin":    "영업이익률 (%)",
                "latest_close": "현재가 (₩)",
                "market_cap":   "시가총액 (억)",
                "market":       "시장",
                "ticker":       "종목코드",
            },
            title=f"RS Rating × EPS YoY — RS 상위 200종목 ({selected_date})",
        )

        # 기준선: RS=90 (수직), EPS YoY=20% (수평)
        fig.add_vline(
            x=90, line_dash="dash", line_color="#dc2626", line_width=1.2, opacity=0.6,
            annotation_text="RS 90", annotation_position="top right",
            annotation_font_color="#dc2626",
        )
        fig.add_hline(
            y=20, line_dash="dash", line_color="#ea580c", line_width=1.2, opacity=0.6,
            annotation_text="EPS YoY 20%", annotation_position="right",
            annotation_font_color="#ea580c",
        )

        # 오른쪽 위 사분면 라벨
        y_max = df_bubble["eps_yoy"].quantile(0.95)
        fig.add_annotation(
            x=97, y=y_max,
            text="⭐ 매수 후보군",
            showarrow=False,
            font=dict(size=12, color="#dc2626"),
            bgcolor="rgba(255,255,255,0.85)",
            bordercolor="#dc2626",
            borderwidth=1,
        )

        fig.update_layout(
            height=560,
            plot_bgcolor="#f8fafc",
            paper_bgcolor="white",
            legend=dict(orientation="h", y=-0.12),
            margin=dict(t=50, b=60),
            xaxis=dict(title="RS Rating", range=[0, 100], gridcolor="#e5e7eb"),
            yaxis=dict(title="EPS YoY (%)", gridcolor="#e5e7eb"),
        )

        st.plotly_chart(fig, use_container_width=True)
        st.caption(
            "💡 버블 크기 = 시가총액  |  "
            "🔵 KOSPI  🟢 KOSDAQ  |  "
            "오른쪽 위 사분면(RS≥90 & EPS YoY≥20%)이 핵심 후보군"
        )
    else:
        st.info("펀더멘탈 데이터 수집 완료 후 산점도가 활성화됩니다.")

    st.markdown("---")

    # ── 데이터 테이블 ──
    st.subheader(f"📋 스크리너 결과 ({len(df_display)}개)")

    column_config = {
        "ticker":         st.column_config.TextColumn("종목코드", width="small"),
        "has_report":     st.column_config.TextColumn("보고서",   width="small"),
        "name":           st.column_config.TextColumn("종목명",   width="medium"),
        "market":         st.column_config.TextColumn("시장",     width="small"),
        "latest_close":   st.column_config.NumberColumn("종가",            format="%d"),
        "market_cap":     st.column_config.NumberColumn("시가총액(억)",    format="%,.0f"),
        "avg_vol_10d":    st.column_config.NumberColumn("10일평균거래량",  format="%,.0f"),
        "rs_rating":      st.column_config.NumberColumn("⭐ RS Rating",    width="small"),
        "composite_score":st.column_config.NumberColumn("복합점수"),
        "rs_1d":  st.column_config.NumberColumn("RS 1D",  width="small"),
        "rs_1w":  st.column_config.NumberColumn("RS 1W",  width="small"),
        "rs_1m":  st.column_config.NumberColumn("RS 1M",  width="small"),
        "rs_3m":  st.column_config.NumberColumn("RS 3M",  width="small"),
        "rs_6m":  st.column_config.NumberColumn("RS 6M",  width="small"),
        "rs_12m": st.column_config.NumberColumn("RS 12M", width="small"),
    }

    if has_fundamentals:
        column_config.update({
            "eps_yoy":          st.column_config.NumberColumn("EPS YoY%",       format="%.1f"),
            "revenue_yoy":      st.column_config.NumberColumn("매출 YoY%",      format="%.1f"),
            "op_profit_yoy":    st.column_config.NumberColumn("영업이익 YoY%",  format="%.1f"),
            "op_margin":        st.column_config.NumberColumn("영업이익률%",    format="%.1f"),
            "net_margin":       st.column_config.NumberColumn("순이익률%",      format="%.1f"),
            "op_margin_chg":    st.column_config.NumberColumn("영업이익률 chg", format="%.1f"),
            "net_margin_chg":   st.column_config.NumberColumn("순이익률 chg",   format="%.1f"),
            "roe":              st.column_config.NumberColumn("ROE%",            format="%.1f"),
            "roa":              st.column_config.NumberColumn("ROA%",            format="%.1f"),
            "debt_ratio":       st.column_config.NumberColumn("부채비율%",      format="%.1f"),
            "annual_eps_yoy":   st.column_config.NumberColumn("연간EPS YoY%",   format="%.1f"),
            "annual_revenue_yoy":st.column_config.NumberColumn("연간매출 YoY%", format="%.1f"),
            "annual_eps_2yr":   st.column_config.NumberColumn("EPS 2yr%",       format="%.1f"),
            "annual_revenue_2yr":st.column_config.NumberColumn("매출 2yr%",     format="%.1f"),
            "annual_op_margin": st.column_config.NumberColumn("연간영업이익률%",format="%.1f"),
            "annual_net_margin":st.column_config.NumberColumn("연간순이익률%",  format="%.1f"),
            "latest_quarter":   st.column_config.TextColumn("기준분기",         width="small"),
        })

    st.dataframe(
        df_display,
        use_container_width=True,
        height=500,
        column_config=column_config,
    )

    # ── 차트 ──
    st.markdown("---")
    chart_col1, chart_col2 = st.columns(2)

    with chart_col1:
        st.subheader("📊 RS Rating 분포")
        if not df_display.empty:
            st.bar_chart(df_display["rs_rating"].dropna().value_counts().sort_index())

    with chart_col2:
        st.subheader("📈 RS Rating 구간별 종목 수")
        if not df_display.empty:
            bins   = [0, 20, 40, 60, 80, 99]
            labels = ["1-20", "21-40", "41-60", "61-80", "81-99"]
            df_display["rs_group"] = pd.cut(df_display["rs_rating"], bins=bins, labels=labels)
            st.bar_chart(df_display["rs_group"].value_counts().sort_index())

    # ── CSV 다운로드 ──
    st.markdown("---")
    if not df_display.empty:
        csv = df_display.to_csv(index=False, encoding="utf-8-sig")
        st.download_button(
            label="📥 CSV 다운로드",
            data=csv,
            file_name=f"rs_screener_{selected_date}.csv",
            mime="text/csv",
        )


# ==========================================
# TAB 2 — 보고서
# ==========================================
with tab_reports:
    st.subheader("📄 종목 분석 보고서")

    if not all_reports:
        st.info("아직 생성된 보고서가 없습니다. 매일 17:50 KST에 자동으로 생성됩니다.")
    else:
        # 날짜 목록
        report_dates = sorted(
            {r["report_date"] for r in all_reports}, reverse=True
        )
        sel_date = st.selectbox("📅 보고서 날짜", report_dates, key="report_date_sel")

        # 선택 날짜의 보고서 목록
        day_reports = [r for r in all_reports if r["report_date"] == sel_date]

        # 종목 선택 버튼
        st.markdown(f"**{sel_date}** 생성 보고서 — {len(day_reports)}개 종목")
        ticker_cols = st.columns(min(len(day_reports), 5))
        selected_report = st.session_state.get("selected_report_path")

        for i, report in enumerate(day_reports):
            with ticker_cols[i % 5]:
                label = f"📄 {report['ticker']}\n{report['quarter']}"
                if st.button(label, key=f"btn_{report['ticker']}_{sel_date}"):
                    st.session_state["selected_report_path"] = report["report_path"]
                    selected_report = report["report_path"]

        # JSX 보고서 렌더링
        st.markdown("---")
        if selected_report and os.path.exists(selected_report):
            ticker_name = os.path.splitext(os.path.basename(selected_report))[0]
            st.markdown(f"#### {ticker_name} 보고서")

            with open(selected_report, "r", encoding="utf-8") as f:
                jsx_content = f.read()

            html = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://unpkg.com/recharts/umd/Recharts.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <style>body {{ margin: 0; padding: 0; }}</style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const {{
      LineChart, BarChart, PieChart, AreaChart, ComposedChart, RadarChart,
      Line, Bar, Pie, Area, Radar, PolarGrid, PolarAngleAxis,
      XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
      Cell, ReferenceLine
    }} = Recharts;

    {jsx_content}

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<StockReport />);
  </script>
</body>
</html>"""
            components.html(html, height=6000, scrolling=True)

        elif selected_report:
            st.warning(f"보고서 파일을 찾을 수 없습니다: `{selected_report}`")
        else:
            st.info("위에서 종목 버튼을 클릭하면 보고서가 표시됩니다.")
