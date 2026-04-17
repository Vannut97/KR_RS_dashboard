import os
import streamlit as st
import streamlit.components.v1 as components
import sqlite3
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import FinanceDataReader as fdr
from db_sqlite import (
    get_all_report_tickers, get_all_reports,
    add_to_watchlist, remove_from_watchlist, get_watchlist,
)

# ==========================================
# 페이지 설정
# ==========================================
st.set_page_config(
    page_title="KR RS Rating Screener",
    page_icon="📊",
    layout="wide",
)
st.title("📊 KR RS Rating Screener")

DB_PATH = "quant_dashboard.db"

# ==========================================
# 데이터 로드 함수
# ==========================================
@st.cache_data(ttl=600)
def load_rs_data():
    conn = sqlite3.connect(DB_PATH)
    df = pd.read_sql("SELECT * FROM rs_ratings ORDER BY rs_rating DESC", conn)
    conn.close()
    return df


@st.cache_data(ttl=600)
def load_fundamentals():
    conn = sqlite3.connect(DB_PATH)
    tables = pd.read_sql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='fundamentals'", conn
    )
    if tables.empty:
        conn.close()
        return pd.DataFrame()
    df = pd.read_sql("""
        SELECT f.* FROM fundamentals f
        INNER JOIN (
            SELECT ticker, MAX(date) AS max_date FROM fundamentals GROUP BY ticker
        ) latest ON f.ticker = latest.ticker AND f.date = latest.max_date
    """, conn)
    conn.close()
    return df


@st.cache_data(ttl=3600)
def load_universe():
    """KRX 종목 정보 로드. Sector/Industry 컬럼이 있으면 함께 반환."""
    df_krx = fdr.StockListing("KRX")
    keep   = ["Code", "Name", "Market"]
    rename = {"Code": "ticker", "Name": "name", "Market": "market"}
    for col in ["Sector", "Industry"]:
        if col in df_krx.columns:
            keep.append(col)
            rename[col] = col.lower()
    return df_krx[keep].rename(columns=rename).copy()


@st.cache_data(ttl=300)
def load_report_index():
    try:
        return get_all_report_tickers(DB_PATH), get_all_reports(DB_PATH)
    except Exception:
        return set(), []


@st.cache_data(ttl=300)
def load_rs_history(ticker):
    """특정 종목의 전체 RS Rating 히스토리 반환."""
    conn = sqlite3.connect(DB_PATH)
    df = pd.read_sql(
        "SELECT date, rs_rating FROM rs_ratings WHERE ticker = ? ORDER BY date",
        conn, params=[ticker],
    )
    conn.close()
    return df


@st.cache_data(ttl=600)
def load_rs_surge(min_delta=10):
    """1주일(~5 거래일) 전 대비 RS Rating 10pt 이상 급등 종목 반환."""
    conn = sqlite3.connect(DB_PATH)
    dates = pd.read_sql(
        "SELECT DISTINCT date FROM rs_ratings ORDER BY date DESC LIMIT 10", conn
    )["date"].tolist()
    if len(dates) < 6:
        conn.close()
        return pd.DataFrame(), "", ""
    latest   = dates[0]
    week_ago = dates[5]   # ~5 거래일 전
    df = pd.read_sql(f"""
        SELECT r1.ticker,
               r1.rs_rating  AS rs_now,
               r2.rs_rating  AS rs_prev,
               (r1.rs_rating - r2.rs_rating) AS rs_delta,
               r1.latest_close, r1.ret_1w
        FROM rs_ratings r1
        JOIN rs_ratings r2 ON r1.ticker = r2.ticker
        WHERE r1.date = '{latest}' AND r2.date = '{week_ago}'
          AND (r1.rs_rating - r2.rs_rating) >= {min_delta}
        ORDER BY rs_delta DESC
    """, conn)
    conn.close()
    return df, latest, week_ago


# ==========================================
# 데이터 준비
# ==========================================
df_rs       = load_rs_data()
df_fund     = load_fundamentals()
df_universe = load_universe()
report_tickers, all_reports = load_report_index()
df_surge, surge_latest, surge_week_ago = load_rs_surge()

df = df_rs.merge(df_universe, on="ticker", how="left")

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
has_sector       = "sector" in df.columns

df["has_report"] = df["ticker"].apply(lambda x: "📄" if x in report_tickers else "")

# 종목코드 → "코드 — 종목명" 맵
ticker_name_map = {
    row["ticker"]: f"{row['ticker']}  —  {row.get('name', '')}"
    for _, row in df_universe.iterrows()
}

# ==========================================
# 탭 구성
# ==========================================
tab_screener, tab_market, tab_watchlist, tab_reports = st.tabs([
    "📋 스크리너", "📊 시장 분석", "⭐ 워치리스트", "📄 보고서"
])


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
            eps_yoy_min     = st.number_input("EPS YoY 최소 (%)",    value=-9999,   step=5)
            revenue_yoy_min = st.number_input("매출 YoY 최소 (%)",   value=-9999,   step=5)
            roe_min_f       = st.number_input("ROE 최소 (%)",         value=-9999.0, step=1.0)
            op_margin_min   = st.number_input("영업이익률 최소 (%)", value=-9999.0, step=1.0)

    st.sidebar.markdown("---")
    with st.sidebar.expander("📈 신고가 근접 필터"):
        near_high_pct = st.slider(
            "52주 고가 대비 하락폭 허용 (%)",
            min_value=-50, max_value=0, value=-100, step=1,
            help="예: -5 → 52주 고가의 95% 이상인 종목만 표시 / -100 → 필터 비활성",
        )

    st.sidebar.markdown("---")
    price_min    = st.sidebar.number_input("💰 최소 종가", value=0, step=1000)
    price_max    = st.sidebar.number_input("💰 최대 종가 (0=무제한)", value=0, step=10000)
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
    # ── 52주 고가 추정 (ret_xM 역산으로 기준가 계산 → 최댓값) ──
    for p, r in [("_p1m","ret_1m"),("_p3m","ret_3m"),("_p6m","ret_6m"),("_p12m","ret_12m")]:
        filtered[p] = filtered["latest_close"] / (1 + filtered[r].fillna(0) / 100)
    filtered["_high52w"] = filtered[["latest_close","_p1m","_p3m","_p6m","_p12m"]].max(axis=1)
    filtered["high52w_gap"] = ((filtered["latest_close"] / filtered["_high52w"]) - 1) * 100

    if near_high_pct > -100:
        filtered = filtered[filtered["high52w_gap"] >= near_high_pct]

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
        "latest_close", "high52w_gap", "market_cap", "avg_vol_10d",
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
    c1, c2, c3, c4, c5 = st.columns(5)
    c1.metric("📅 기준일",    selected_date)
    c2.metric("📋 필터 결과", f"{len(df_display)}개")
    c3.metric("🏛️ 시장",      selected_market)
    c4.metric("전체 종목",    f"{len(df[df['date'] == selected_date])}개")
    c5.metric("📄 보고서 보유",
              f"{(df_display['has_report'] != '').sum()}개"
              if "has_report" in df_display.columns else "0개")

    st.markdown("---")

    # ── 신규 보고서 알림 ──
    if all_reports:
        latest_report_date    = all_reports[0]["report_date"]
        latest_report_tickers = [r["ticker"] for r in all_reports
                                  if r["report_date"] == latest_report_date]
        if latest_report_tickers:
            st.info(
                f"📄 **{latest_report_date}** 신규 보고서: "
                f"**{', '.join(latest_report_tickers)}** — 보고서 탭에서 확인",
                icon="🆕",
            )

    # ── 1W RS 급등 종목 알림 ──
    if not df_surge.empty:
        with st.expander(
            f"🚀 **1주일 RS 급등 종목** ({surge_week_ago} → {surge_latest}) "
            f"— {len(df_surge)}개 (10pt↑)", expanded=True
        ):
            surge_display = df_surge.merge(
                df_universe[["ticker","name","market"]], on="ticker", how="left"
            )[["ticker","name","market","rs_prev","rs_now","rs_delta","ret_1w","latest_close"]]
            surge_display.columns = [
                "코드","종목명","시장","RS(전주)","RS(현재)","RS변화","1W수익률(%)","현재가"
            ]
            st.dataframe(
                surge_display.style.background_gradient(
                    subset=["RS변화"], cmap="Greens"
                ).format({"RS변화": "+{:.0f}", "1W수익률(%)": "{:.1f}%", "현재가": "{:,.0f}"}),
                use_container_width=True, hide_index=True,
            )

    # ── RS × 펀더멘탈 산점도 ──
    st.subheader("🔭 RS Rating × EPS YoY 산점도")
    if has_fundamentals:
        df_bubble = (
            df[df["date"] == selected_date]
            .dropna(subset=["rs_rating", "eps_yoy"])
            .nlargest(200, "rs_rating")
            .copy()
        )
        df_bubble["_bubble"] = (
            df_bubble["market_cap"].fillna(100).clip(lower=10) ** 0.5
        )
        for col in ["eps_yoy", "revenue_yoy", "roe", "roa", "net_margin", "op_margin"]:
            if col in df_bubble.columns:
                df_bubble[col] = df_bubble[col].round(1)

        hover_cols = {c: True for c in [
            "ticker", "revenue_yoy", "roe", "roa",
            "net_margin", "op_margin", "latest_close", "market_cap",
        ] if c in df_bubble.columns}
        hover_cols["_bubble"] = False

        fig_sc = px.scatter(
            df_bubble,
            x="rs_rating", y="eps_yoy",
            size="_bubble", size_max=55,
            color="market",
            color_discrete_map={"KOSPI": "#003A70", "KOSDAQ": "#16a34a"},
            hover_name="name", hover_data=hover_cols,
            labels={
                "rs_rating": "RS Rating", "eps_yoy": "EPS YoY (%)",
                "revenue_yoy": "매출 YoY (%)", "roe": "ROE (%)",
                "roa": "ROA (%)", "net_margin": "순이익률 (%)",
                "op_margin": "영업이익률 (%)", "latest_close": "현재가 (₩)",
                "market_cap": "시가총액 (억)", "market": "시장", "ticker": "종목코드",
            },
            title=f"RS Rating × EPS YoY — RS 상위 200종목 ({selected_date})",
        )
        # ── 축 범위: RS=85 / EPS=10% 가 항상 정중앙 교차점 ──
        X_CENTER, Y_CENTER = 85, 10

        # X축: 데이터와 중심(85) 간 최대 거리를 좌우 대칭으로 적용
        x_vals = df_bubble["rs_rating"].dropna()
        x_dist = max(abs(x_vals.max() - X_CENTER), abs(x_vals.min() - X_CENTER), 8)
        x_pad  = x_dist * 0.08
        x_min  = max(0,   X_CENTER - x_dist - x_pad)
        x_max  = min(100, X_CENTER + x_dist + x_pad)

        # Y축: outlier 클리핑(-200~500) 후 중심(10)에서 상하 대칭
        y_vals  = df_bubble["eps_yoy"].dropna().clip(-200, 500)
        y_dist  = max(abs(y_vals.max() - Y_CENTER), abs(y_vals.min() - Y_CENTER), 30)
        y_pad   = y_dist * 0.08
        y_min   = Y_CENTER - y_dist - y_pad
        y_max   = Y_CENTER + y_dist + y_pad

        fig_sc.add_vline(x=90, line_dash="dash", line_color="#dc2626",
            line_width=1.2, opacity=0.6, annotation_text="RS 90",
            annotation_position="top right", annotation_font_color="#dc2626")
        fig_sc.add_hline(y=20, line_dash="dash", line_color="#ea580c",
            line_width=1.2, opacity=0.6, annotation_text="EPS YoY 20%",
            annotation_position="right", annotation_font_color="#ea580c")
        # 매수 후보군 라벨: 우측 상단 사분면 고정 (축 범위 기준)
        fig_sc.add_annotation(
            x=x_min + (x_max - x_min) * 0.92,
            y=y_min + (y_max - y_min) * 0.92,
            text="⭐ 매수 후보군", showarrow=False,
            font=dict(size=12, color="#dc2626"),
            bgcolor="rgba(255,255,255,0.85)", bordercolor="#dc2626", borderwidth=1,
        )
        fig_sc.update_layout(
            height=680, plot_bgcolor="#f8fafc", paper_bgcolor="white",
            legend=dict(orientation="h", y=-0.08), margin=dict(t=50, b=50, l=60, r=40),
            xaxis=dict(title="RS Rating", range=[x_min, x_max], gridcolor="#e5e7eb"),
            yaxis=dict(title="EPS YoY (%)", range=[y_min, y_max], gridcolor="#e5e7eb"),
        )
        # 정사각형 유지: 중앙 3/5 컬럼에 height=680 배치
        _, col_sc, _ = st.columns([1, 3, 1])
        with col_sc:
            st.plotly_chart(fig_sc, use_container_width=True)
        st.caption(
            "💡 버블 크기 = 시가총액 | 🔵 KOSPI  🟢 KOSDAQ | "
            "오른쪽 위 사분면(RS≥90 & EPS YoY≥20%)이 핵심 후보군"
        )
    else:
        st.info("펀더멘탈 데이터 수집 완료 후 산점도가 활성화됩니다.")

    st.markdown("---")

    # ── 데이터 테이블 ──
    st.subheader(f"📋 스크리너 결과 ({len(df_display)}개)")
    column_config = {
        "ticker":          st.column_config.TextColumn("종목코드",       width="small"),
        "has_report":      st.column_config.TextColumn("보고서",         width="small"),
        "name":            st.column_config.TextColumn("종목명",         width="medium"),
        "market":          st.column_config.TextColumn("시장",           width="small"),
        "latest_close":    st.column_config.NumberColumn("종가",         format="%d"),
        "market_cap":      st.column_config.NumberColumn("시가총액(억)", format="%,.0f"),
        "avg_vol_10d":     st.column_config.NumberColumn("10일평균거래량", format="%,.0f"),
        "rs_rating":       st.column_config.NumberColumn("⭐ RS Rating", width="small"),
        "composite_score": st.column_config.NumberColumn("복합점수"),
        "rs_1d":  st.column_config.NumberColumn("RS 1D",  width="small"),
        "rs_1w":  st.column_config.NumberColumn("RS 1W",  width="small"),
        "rs_1m":  st.column_config.NumberColumn("RS 1M",  width="small"),
        "rs_3m":  st.column_config.NumberColumn("RS 3M",  width="small"),
        "rs_6m":  st.column_config.NumberColumn("RS 6M",  width="small"),
        "rs_12m": st.column_config.NumberColumn("RS 12M", width="small"),
    }
    if has_fundamentals:
        column_config.update({
            "eps_yoy":           st.column_config.NumberColumn("EPS YoY%",        format="%.1f"),
            "revenue_yoy":       st.column_config.NumberColumn("매출 YoY%",       format="%.1f"),
            "op_profit_yoy":     st.column_config.NumberColumn("영업이익 YoY%",   format="%.1f"),
            "op_margin":         st.column_config.NumberColumn("영업이익률%",     format="%.1f"),
            "net_margin":        st.column_config.NumberColumn("순이익률%",       format="%.1f"),
            "op_margin_chg":     st.column_config.NumberColumn("영업이익률 chg",  format="%.1f"),
            "net_margin_chg":    st.column_config.NumberColumn("순이익률 chg",    format="%.1f"),
            "roe":               st.column_config.NumberColumn("ROE%",             format="%.1f"),
            "roa":               st.column_config.NumberColumn("ROA%",             format="%.1f"),
            "debt_ratio":        st.column_config.NumberColumn("부채비율%",       format="%.1f"),
            "annual_eps_yoy":    st.column_config.NumberColumn("연간EPS YoY%",    format="%.1f"),
            "annual_revenue_yoy":st.column_config.NumberColumn("연간매출 YoY%",  format="%.1f"),
            "annual_eps_2yr":    st.column_config.NumberColumn("EPS 2yr%",        format="%.1f"),
            "annual_revenue_2yr":st.column_config.NumberColumn("매출 2yr%",       format="%.1f"),
            "annual_op_margin":  st.column_config.NumberColumn("연간영업이익률%", format="%.1f"),
            "annual_net_margin": st.column_config.NumberColumn("연간순이익률%",   format="%.1f"),
            "latest_quarter":    st.column_config.TextColumn("기준분기",          width="small"),
        })

    st.dataframe(
        df_display, use_container_width=True, height=500,
        column_config=column_config,
    )

    # ── 드릴다운 패널 (종목 상세 분석) ──
    st.markdown("---")
    with st.expander("🔍 종목 상세 분석", expanded=False):
        ticker_options = df_display["ticker"].tolist() if not df_display.empty else []

        if ticker_options:
            def fmt_ticker(t):
                if not t:
                    return "선택하세요"
                rows = df_display[df_display["ticker"] == t]["name"]
                n = rows.values[0] if not rows.empty and pd.notna(rows.values[0]) else ""
                return f"{t}  —  {n}"

            sel_ticker = st.selectbox(
                "종목 선택 (스크리너 필터 결과 기준)",
                options=[""] + ticker_options,
                format_func=fmt_ticker,
                key="drilldown_sel",
            )

            if sel_ticker:
                df_hist = load_rs_history(sel_ticker)
                col_chart, col_fund = st.columns([3, 2])

                # RS 추이 차트
                with col_chart:
                    st.markdown(f"**📈 RS Rating 추이 — {fmt_ticker(sel_ticker)}**")
                    if len(df_hist) >= 2:
                        fig_h = go.Figure()
                        fig_h.add_trace(go.Scatter(
                            x=df_hist["date"], y=df_hist["rs_rating"],
                            mode="lines+markers",
                            line=dict(color="#003A70", width=2.5),
                            marker=dict(size=7),
                            fill="tozeroy", fillcolor="rgba(0,58,112,0.07)",
                            hovertemplate="날짜: %{x}<br>RS Rating: %{y}<extra></extra>",
                        ))
                        fig_h.add_hline(y=90, line_dash="dash", line_color="#dc2626",
                            opacity=0.5, annotation_text="RS 90",
                            annotation_font_color="#dc2626", annotation_position="right")
                        fig_h.add_hline(y=80, line_dash="dot", line_color="#ea580c",
                            opacity=0.3, annotation_text="RS 80",
                            annotation_font_color="#ea580c", annotation_position="right")
                        fig_h.update_layout(
                            height=280, plot_bgcolor="#f8fafc", paper_bgcolor="white",
                            margin=dict(t=20, b=40),
                            xaxis=dict(gridcolor="#e5e7eb"),
                            yaxis=dict(range=[0, 100], gridcolor="#e5e7eb"),
                        )
                        st.plotly_chart(fig_h, use_container_width=True)
                        rs_vals = df_hist["rs_rating"].dropna()
                        if len(rs_vals) >= 5:
                            delta = rs_vals.iloc[-1] - rs_vals.iloc[-5]
                            trend = "📈 가속 중" if delta > 0 else "📉 둔화 중"
                            st.caption(f"최근 5거래일 변화: {delta:+.0f}pt  {trend}")
                    else:
                        st.info("RS 추이는 데이터가 2거래일 이상 쌓인 후 표시됩니다.")

                # 펀더멘탈 스코어카드
                with col_fund:
                    st.markdown("**📊 펀더멘탈 스코어카드**")
                    sel_rows = df_display[df_display["ticker"] == sel_ticker]
                    fund_row = sel_rows.iloc[0] if not sel_rows.empty else None

                    if fund_row is not None and has_fundamentals:
                        metrics = [
                            ("EPS YoY",    fund_row.get("eps_yoy"),     20),
                            ("매출 YoY",   fund_row.get("revenue_yoy"), 20),
                            ("ROE",         fund_row.get("roe"),         10),
                            ("영업이익률", fund_row.get("op_margin"),   10),
                            ("순이익률",   fund_row.get("net_margin"),   5),
                            ("부채비율",   fund_row.get("debt_ratio"),  None),
                        ]
                        mc1, mc2 = st.columns(2)
                        for i, (label, val, thr) in enumerate(metrics):
                            v_str = f"{val:.1f}%" if pd.notna(val) else "N/A"
                            d_col = "normal" if (thr is None or not pd.notna(val) or val >= thr) else "inverse"
                            (mc1 if i % 2 == 0 else mc2).metric(
                                label, v_str,
                                delta=f"기준 {thr}%" if thr else None,
                                delta_color=d_col,
                            )
                        q = fund_row.get("latest_quarter")
                        if pd.notna(q):
                            st.caption(f"기준분기: {q}")
                    else:
                        st.info("펀더멘탈 데이터 수집 후 표시됩니다.")

                # 워치리스트 & 보고서 액션
                st.markdown("")
                act1, act2 = st.columns(2)
                with act1:
                    wl_now     = get_watchlist(DB_PATH)
                    wl_tickers = [w["ticker"] for w in wl_now]
                    if sel_ticker in wl_tickers:
                        if st.button("⭐ 워치리스트 제거", key="dd_wl_rm"):
                            remove_from_watchlist(sel_ticker, DB_PATH)
                            st.success(f"{sel_ticker} 제거됨")
                            st.rerun()
                    else:
                        if st.button("☆ 워치리스트 추가", key="dd_wl_add"):
                            add_to_watchlist(sel_ticker, db_name=DB_PATH)
                            st.success(f"{sel_ticker} 추가됨")
                            st.rerun()
                with act2:
                    t_reports = [r for r in all_reports if r["ticker"] == sel_ticker]
                    if t_reports:
                        r0 = t_reports[0]
                        st.markdown(f"📄 최신 보고서: **{r0['report_date']}** ({r0['quarter']})")
                    else:
                        st.caption("📄 보고서 없음 (17:50 자동 생성 대상이면 오늘 생성됩니다)")
        else:
            st.info("스크리너 결과에서 종목을 먼저 필터링하세요.")

    # ── CSV 다운로드 ──
    st.markdown("---")
    if not df_display.empty:
        csv = df_display.to_csv(index=False, encoding="utf-8-sig")
        st.download_button("📥 CSV 다운로드", csv,
                           f"rs_screener_{selected_date}.csv", "text/csv")


# ==========================================
# TAB 2 — 시장 분석
# ==========================================
with tab_market:
    st.subheader("📊 시장 분석")

    # ── 섹터 히트맵 ──
    st.markdown("### 🗺️ 섹터별 RS Rating 현황")

    df_today = df[df["date"] == selected_date].copy()

    if has_sector and df_today["sector"].notna().any():
        df_sec = (
            df_today[df_today["sector"].notna() & (df_today["sector"] != "")]
            .groupby("sector", as_index=False)
            .agg(
                avg_rs     = ("rs_rating", "mean"),
                count      = ("ticker",    "count"),
                rs80_count = ("rs_rating", lambda x: (x >= 80).sum()),
                rs90_count = ("rs_rating", lambda x: (x >= 90).sum()),
            )
        )
        df_sec["avg_rs"] = df_sec["avg_rs"].round(1)
        df_sec = df_sec.sort_values("avg_rs", ascending=False)

        col_tree, col_bar = st.columns([3, 2])

        with col_tree:
            fig_tree = px.treemap(
                df_sec,
                path=["sector"],
                values="count",
                color="avg_rs",
                color_continuous_scale="RdYlGn",
                color_continuous_midpoint=50,
                custom_data=["avg_rs", "count", "rs80_count", "rs90_count"],
                title=f"섹터별 RS Rating 히트맵 ({selected_date})",
            )
            fig_tree.update_traces(
                hovertemplate=(
                    "<b>%{label}</b><br>"
                    "평균 RS: %{customdata[0]:.1f}<br>"
                    "종목 수: %{customdata[1]}개<br>"
                    "RS≥80: %{customdata[2]}개<br>"
                    "RS≥90: %{customdata[3]}개<extra></extra>"
                )
            )
            fig_tree.update_layout(height=460, margin=dict(t=40, b=10))
            st.plotly_chart(fig_tree, use_container_width=True)

        with col_bar:
            fig_bar = px.bar(
                df_sec.head(15),
                x="avg_rs", y="sector", orientation="h",
                color="avg_rs",
                color_continuous_scale="RdYlGn",
                color_continuous_midpoint=50,
                text="avg_rs",
                labels={"avg_rs": "평균 RS Rating", "sector": "섹터"},
                title="섹터 평균 RS Rating (상위 15)",
            )
            fig_bar.update_traces(texttemplate="%{text:.1f}", textposition="outside")
            fig_bar.update_layout(
                height=460, showlegend=False,
                plot_bgcolor="#f8fafc", paper_bgcolor="white",
                yaxis=dict(autorange="reversed"),
                xaxis=dict(range=[0, 100], gridcolor="#e5e7eb"),
                margin=dict(t=40, b=10, r=60),
            )
            st.plotly_chart(fig_bar, use_container_width=True)

        # 섹터 상세 테이블
        with st.expander("📋 섹터 상세 데이터"):
            st.dataframe(
                df_sec.rename(columns={
                    "sector": "섹터", "avg_rs": "평균RS",
                    "count": "종목수", "rs80_count": "RS≥80", "rs90_count": "RS≥90",
                }),
                use_container_width=True, hide_index=True,
            )
    else:
        st.info("섹터 데이터가 없거나 FDR StockListing의 Sector 컬럼을 확인할 수 없습니다.")

    # ── RS 시계열 조회 ──
    st.markdown("---")
    st.markdown("### 📈 종목별 RS Rating 추이")

    hist_ticker = st.selectbox(
        "종목 선택 (전체 유니버스)",
        options=[""] + sorted(df["ticker"].unique().tolist()),
        format_func=lambda x: "선택하세요" if not x else ticker_name_map.get(x, x),
        key="market_hist_sel",
    )

    if hist_ticker:
        df_h = load_rs_history(hist_ticker)
        label = ticker_name_map.get(hist_ticker, hist_ticker)

        if not df_h.empty:
            fig_ts = go.Figure()
            fig_ts.add_trace(go.Scatter(
                x=df_h["date"], y=df_h["rs_rating"],
                mode="lines+markers",
                line=dict(color="#003A70", width=2.5),
                marker=dict(size=7, color="#003A70"),
                fill="tozeroy", fillcolor="rgba(0,58,112,0.07)",
                name="RS Rating",
                hovertemplate="날짜: %{x}<br>RS Rating: %{y}<extra></extra>",
            ))
            fig_ts.add_hline(y=90, line_dash="dash", line_color="#dc2626",
                opacity=0.5, annotation_text="RS 90",
                annotation_font_color="#dc2626", annotation_position="right")
            fig_ts.add_hline(y=80, line_dash="dot", line_color="#ea580c",
                opacity=0.3, annotation_text="RS 80",
                annotation_font_color="#ea580c", annotation_position="right")
            fig_ts.update_layout(
                title=f"{label}  RS Rating 추이",
                height=420, plot_bgcolor="#f8fafc", paper_bgcolor="white",
                xaxis=dict(title="날짜", gridcolor="#e5e7eb"),
                yaxis=dict(title="RS Rating", range=[0, 100], gridcolor="#e5e7eb"),
                margin=dict(t=50, b=50),
            )
            st.plotly_chart(fig_ts, use_container_width=True)

            rs_vals = df_h["rs_rating"].dropna()
            sc1, sc2, sc3, sc4 = st.columns(4)
            sc1.metric("현재 RS",  f"{rs_vals.iloc[-1]:.0f}" if len(rs_vals) else "N/A")
            sc2.metric("최고 RS",  f"{rs_vals.max():.0f}"    if len(rs_vals) else "N/A")
            sc3.metric("최저 RS",  f"{rs_vals.min():.0f}"    if len(rs_vals) else "N/A")
            sc4.metric("평균 RS",  f"{rs_vals.mean():.1f}"   if len(rs_vals) else "N/A")
        else:
            st.info(f"{hist_ticker} 의 RS 데이터가 없습니다.")


# ==========================================
# TAB 3 — 워치리스트
# ==========================================
with tab_watchlist:
    st.subheader("⭐ 워치리스트")

    wl_list = get_watchlist(DB_PATH)

    if not wl_list:
        st.info(
            "워치리스트가 비어 있습니다.  \n"
            "스크리너 탭 하단의 **종목 상세 분석** 패널에서 추가하거나, "
            "아래 추가 섹션을 이용하세요."
        )
    else:
        wl_tickers = [w["ticker"] for w in wl_list]
        dates_sorted = sorted(df["date"].unique())
        latest_rs_date = dates_sorted[-1] if dates_sorted else None
        prev_date      = dates_sorted[-2] if len(dates_sorted) >= 2 else None

        df_today_all = df[df["date"] == latest_rs_date] if latest_rs_date else pd.DataFrame()
        df_prev_all  = df[df["date"] == prev_date][["ticker", "rs_rating"]].rename(
            columns={"rs_rating": "rs_prev"}
        ) if prev_date else pd.DataFrame(columns=["ticker", "rs_prev"])

        rows = []
        for w in wl_list:
            t = w["ticker"]
            today_r = df_today_all[df_today_all["ticker"] == t]
            prev_r  = df_prev_all[df_prev_all["ticker"] == t]

            rs_now  = float(today_r["rs_rating"].values[0]) if not today_r.empty else None
            rs_prev = float(prev_r["rs_prev"].values[0])    if not prev_r.empty  else None
            rs_chg  = round(rs_now - rs_prev, 0) if rs_now is not None and rs_prev is not None else None

            rows.append({
                "종목코드":      t,
                "종목명":        today_r["name"].values[0]         if not today_r.empty and "name" in today_r else "",
                "시장":          today_r["market"].values[0]       if not today_r.empty and "market" in today_r else "",
                "RS Rating":     rs_now,
                "RS 변화 (1일)": rs_chg,
                "현재가 (₩)":   int(today_r["latest_close"].values[0]) if not today_r.empty else None,
                "시가총액 (억)": round(float(today_r["market_cap"].values[0]), 0) if not today_r.empty and pd.notna(today_r["market_cap"].values[0]) else None,
                "추가일":        w["added_date"],
            })

        df_wl = pd.DataFrame(rows)
        st.dataframe(
            df_wl,
            use_container_width=True,
            column_config={
                "종목코드":      st.column_config.TextColumn(width="small"),
                "종목명":        st.column_config.TextColumn(width="medium"),
                "시장":          st.column_config.TextColumn(width="small"),
                "RS Rating":     st.column_config.NumberColumn(format="%d"),
                "RS 변화 (1일)": st.column_config.NumberColumn(format="%+.0f"),
                "현재가 (₩)":   st.column_config.NumberColumn(format="%d"),
                "시가총액 (억)": st.column_config.NumberColumn(format="%,.0f"),
                "추가일":        st.column_config.TextColumn(width="small"),
            },
            hide_index=True,
        )

        st.markdown("**종목 제거**")
        rm_col1, rm_col2 = st.columns([3, 1])
        with rm_col1:
            rm_ticker = st.selectbox(
                "제거할 종목", options=[""] + wl_tickers,
                format_func=lambda x: "선택" if not x else ticker_name_map.get(x, x),
                key="wl_rm_sel",
            )
        with rm_col2:
            st.markdown("<br>", unsafe_allow_html=True)
            if rm_ticker and st.button("🗑️ 제거", key="wl_rm_btn"):
                remove_from_watchlist(rm_ticker, DB_PATH)
                st.success(f"{rm_ticker} 제거됨")
                st.rerun()

    st.markdown("---")
    st.markdown("**종목 추가**")
    add_col1, add_col2 = st.columns([3, 1])
    with add_col1:
        add_ticker = st.selectbox(
            "추가할 종목 (전체 유니버스)",
            options=[""] + sorted(df["ticker"].unique().tolist()),
            format_func=lambda x: "선택하세요" if not x else ticker_name_map.get(x, x),
            key="wl_add_sel",
        )
    with add_col2:
        st.markdown("<br>", unsafe_allow_html=True)
        if add_ticker and st.button("⭐ 추가", key="wl_add_btn"):
            add_to_watchlist(add_ticker, db_name=DB_PATH)
            st.success(f"{add_ticker} 추가됨")
            st.rerun()


# ==========================================
# TAB 4 — 보고서
# ==========================================
with tab_reports:
    st.subheader("📄 종목 분석 보고서")

    if not all_reports:
        st.info("아직 생성된 보고서가 없습니다. 매일 17:50 KST에 자동으로 생성됩니다.")
    else:
        report_dates = sorted({r["report_date"] for r in all_reports}, reverse=True)
        sel_rep_date = st.selectbox("📅 보고서 날짜", report_dates, key="report_date_sel")

        day_reports = [r for r in all_reports if r["report_date"] == sel_rep_date]
        st.markdown(f"**{sel_rep_date}** 생성 보고서 — {len(day_reports)}개 종목")

        ticker_cols = st.columns(min(len(day_reports), 5))
        selected_report = st.session_state.get("selected_report_path")

        for i, report in enumerate(day_reports):
            with ticker_cols[i % 5]:
                if st.button(
                    f"📄 {report['ticker']}\n{report['quarter']}",
                    key=f"btn_{report['ticker']}_{sel_rep_date}",
                ):
                    st.session_state["selected_report_path"] = report["report_path"]
                    selected_report = report["report_path"]

        st.markdown("---")
        if selected_report and os.path.exists(selected_report):
            ticker_name = os.path.splitext(os.path.basename(selected_report))[0]
            st.markdown(f"#### {ticker_name_map.get(ticker_name, ticker_name)} 보고서")

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
