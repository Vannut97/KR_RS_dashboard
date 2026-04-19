import os
import numpy as np
import streamlit as st
import streamlit.components.v1 as components
import sqlite3
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from db_sqlite import (
    get_all_report_tickers, get_all_reports,
)
from datetime import date as _date

# ==========================================
# 페이지 설정
# ==========================================
st.set_page_config(
    page_title="KR RS Rating Screener",
    page_icon="📊",
    layout="wide",
)

# ── 레이아웃 최소 여백 CSS ──
st.markdown("""
<style>
/* 메인 컨테이너 패딩 최소화 */
.main .block-container {
    padding-top: 0.3rem !important;
    padding-bottom: 0rem !important;
    padding-left: 1rem !important;
    padding-right: 1rem !important;
}
/* 푸터·헤더 완전 제거 */
footer { display: none !important; }
header[data-testid="stHeader"] { display: none !important; }
/* 스크롤바 숨김 */
::-webkit-scrollbar { width: 0px; height: 0px; }
html { scrollbar-width: none; -ms-overflow-style: none; }
/* 탭 바 패딩 축소 */
[data-testid="stTabs"] { margin-top: 0 !important; }
[data-testid="stTabBar"] { padding-top: 0 !important; padding-bottom: 0 !important; }
/* 탭 패널 상단 여백 제거 */
[data-testid="stTabContent"] { padding-top: 0.2rem !important; }
/* h4 타이틀 마진 최소화 */
h4 { margin-top: 0.2rem !important; margin-bottom: 0.2rem !important; line-height: 1.2 !important; }
/* subheader 마진 최소화 */
h3 { margin-top: 0.2rem !important; margin-bottom: 0.2rem !important; }
/* expander 마진 */
[data-testid="stExpander"] { margin-top: 0.2rem !important; margin-bottom: 0 !important; }
/* caption 마진 */
[data-testid="stCaptionContainer"] { margin-top: 0 !important; padding-top: 0 !important; }
/* info/alert 박스 마진 */
[data-testid="stAlert"] { margin-top: 0.2rem !important; margin-bottom: 0.2rem !important; padding: 0.3rem 0.6rem !important; }
/* metric 간격 */
[data-testid="stMetric"] { padding: 0.2rem 0 !important; }
/* column gap */
[data-testid="stHorizontalBlock"] { gap: 0.5rem !important; }
</style>
""", unsafe_allow_html=True)

st.markdown("##### 📊 KR RS Rating Screener")

DB_PATH = "quant_dashboard.db"

# ==========================================
# Supabase 워치리스트 클라이언트
# ==========================================
def _init_supabase():
    """Supabase 클라이언트 초기화.
    Streamlit Cloud → st.secrets, 로컬 → .env 순으로 탐색."""
    try:
        from supabase import create_client
        # Streamlit Cloud secrets 우선
        try:
            url = st.secrets["supabase"]["url"]
            key = st.secrets["supabase"]["key"]
        except Exception:
            # 로컬 .env 폴백
            from dotenv import load_dotenv
            load_dotenv()
            url = os.environ.get("SUPABASE_URL", "")
            key = os.environ.get("SUPABASE_KEY", "")
        if url and key:
            return create_client(url, key)
    except Exception:
        pass
    return None

_sb = _init_supabase()


def wl_add(ticker: str, note: str = ""):
    """워치리스트 추가 (이미 있으면 무시)."""
    today = str(_date.today())
    if _sb:
        _sb.table("watchlist").upsert(
            {"ticker": ticker, "added_date": today, "note": note},
            on_conflict="ticker",          # 이미 있으면 덮어쓰지 않음
            ignore_duplicates=True,
        ).execute()
    else:
        st.error("Supabase 연결 실패: SUPABASE_URL / SUPABASE_KEY 확인 필요")


def wl_remove(ticker: str):
    """워치리스트 제거."""
    if _sb:
        _sb.table("watchlist").delete().eq("ticker", ticker).execute()
    else:
        st.error("Supabase 연결 실패")


def wl_get() -> list[dict]:
    """워치리스트 전체 반환 [{ticker, added_date, note}, ...]."""
    if _sb:
        try:
            res = _sb.table("watchlist").select("ticker, added_date, note") \
                      .order("added_date", desc=True).execute()
            return res.data or []
        except Exception:
            return []
    return []

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
    """DB rs_ratings 테이블에서 종목 정보(ticker, name, market)를 로드한다.
    name/market 컬럼이 없는 구버전 DB는 ticker만 반환한다."""
    conn = sqlite3.connect(DB_PATH)
    existing_cols = [
        row[1] for row in
        conn.execute("PRAGMA table_info(rs_ratings)").fetchall()
    ]
    cols = ["ticker"]
    if "name"   in existing_cols: cols.append("name")
    if "market" in existing_cols: cols.append("market")
    df = pd.read_sql(
        f"SELECT {', '.join(cols)} FROM rs_ratings "
        f"WHERE date = (SELECT MAX(date) FROM rs_ratings)", conn
    )
    conn.close()
    if "name"   not in df.columns: df["name"]   = df["ticker"]
    if "market" not in df.columns: df["market"] = ""
    return df


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
        "annual_revenue_act", "annual_revenue_prev_act", "annual_revenue_2yr_act",
        "annual_eps_act", "annual_eps_prev_act", "annual_eps_2yr_act",
        "annual_year_curr", "annual_year_prev", "annual_year_2yr",
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

    # ── 요약 지표 → 사이드바 하단 ──
    st.sidebar.markdown("---")
    st.sidebar.markdown("**📊 현재 필터 결과**")
    st.sidebar.metric("📅 기준일",     selected_date)
    st.sidebar.metric("📋 필터 결과",  f"{len(df_display)}개")
    st.sidebar.metric("전체 종목",     f"{len(df[df['date'] == selected_date])}개")
    st.sidebar.metric("📄 보고서 보유",
                      f"{(df_display['has_report'] != '').sum()}개"
                      if "has_report" in df_display.columns else "0개")

    # ── 신규 보고서 알림 → 사이드바 ──
    if all_reports:
        latest_report_date    = all_reports[0]["report_date"]
        latest_report_tickers = [r["ticker"] for r in all_reports
                                  if r["report_date"] == latest_report_date]
        if latest_report_tickers:
            st.sidebar.markdown("---")
            st.sidebar.info(
                f"📄 **{latest_report_date}** 신규 보고서\n\n"
                f"{', '.join(latest_report_tickers)}",
                icon="🆕",
            )

    # ── 1W RS 급등 종목 알림 → 사이드바 ──
    if not df_surge.empty:
        st.sidebar.markdown("---")
        with st.sidebar.expander(
            f"🚀 RS 급등 {len(df_surge)}개 (10pt↑)", expanded=False
        ):
            surge_display = df_surge.merge(
                df_universe[["ticker","name","market"]], on="ticker", how="left"
            )[["ticker","name","rs_delta","ret_1w"]]
            surge_display.columns = ["코드","종목명","RS변화","1W수익률(%)"]
            st.dataframe(
                surge_display.style.background_gradient(
                    subset=["RS변화"], cmap="Greens"
                ).format({"RS변화": "+{:.0f}", "1W수익률(%)": "{:.1f}%"}),
                use_container_width=True, hide_index=True,
            )

    # ── RS × 펀더멘탈 산점도 (라벨 제거 → 차트 타이틀로 통합) ──
    if has_fundamentals:
        df_bubble = (
            df[df["date"] == selected_date]
            .dropna(subset=["rs_rating", "eps_yoy"])
            .nlargest(200, "rs_rating")
            .copy()
        )
        # ── 버블 크기: 시가총액 로그 정규화 [3, 50] ──
        mc = df_bubble["market_cap"].fillna(df_bubble["market_cap"].median()).clip(lower=1)
        log_mc = np.log10(mc)
        lo, hi = log_mc.min(), log_mc.max()
        df_bubble["_bubble"] = ((log_mc - lo) / (hi - lo) * 47 + 3) if hi > lo else 25

        # ── X축 지터: RS Rating 정수값 과밀 해소 (±0.4 랜덤 오프셋) ──
        rng = np.random.default_rng(seed=42)   # seed 고정 → 새로고침마다 흔들리지 않음
        df_bubble["_rs_jitter"] = (
            df_bubble["rs_rating"] + rng.uniform(-0.4, 0.4, len(df_bubble))
        )

        # ── 호버 컬러코딩 헬퍼 ──
        def fmt_metric(val, g_min, r_max, suffix="%"):
            """g_min 이상 → 녹색, r_max 이하 → 적색, 그 외 → 기본색"""
            if pd.isna(val):
                return "N/A"
            s = f"{val:.1f}{suffix}"
            if val >= g_min:
                return f'<span style="color:#22c55e"><b>{s}</b></span>'
            elif val <= r_max:
                return f'<span style="color:#ef4444"><b>{s}</b></span>'
            return s

        df_bubble["_hc_eps"] = df_bubble["eps_yoy"].apply(lambda v: fmt_metric(v, 20,  0))
        df_bubble["_hc_rev"] = df_bubble["revenue_yoy"].apply(lambda v: fmt_metric(v, 20, 0))
        df_bubble["_hc_roe"] = df_bubble["roe"].apply(lambda v: fmt_metric(v, 10,  0))
        df_bubble["_hc_roa"] = (df_bubble["roa"].apply(lambda v: fmt_metric(v,  0,  0))
                                if "roa" in df_bubble.columns else "N/A")
        df_bubble["_hc_nm"]  = (df_bubble["net_margin"].apply(lambda v: fmt_metric(v, 10, 0))
                                if "net_margin" in df_bubble.columns else "N/A")
        df_bubble["_hc_om"]  = (df_bubble["op_margin"].apply(lambda v: fmt_metric(v, 10, 0))
                                if "op_margin" in df_bubble.columns else "N/A")
        df_bubble["_hc_close"]  = df_bubble["latest_close"].apply(
            lambda v: f"₩{v:,.0f}" if pd.notna(v) else "N/A")
        df_bubble["_hc_mktcap"] = df_bubble["market_cap"].apply(
            lambda v: f"{v:,.0f}억" if pd.notna(v) else "N/A")

        # rs_rating 실제값도 호버에 표시 (지터 적용 전 원본)
        df_bubble["_hc_rs"] = df_bubble["rs_rating"].apply(
            lambda v: f"{int(v)}" if pd.notna(v) else "N/A")

        custom_cols = ["ticker","_hc_close","_hc_mktcap","_hc_rs",
                       "_hc_eps","_hc_rev","_hc_roe","_hc_roa","_hc_nm","_hc_om"]
        hovertemplate = (
            "<b>%{hovertext}</b>  "
            "<span style='color:gray;font-size:11px'>%{customdata[0]}</span><br>"
            "현재가: %{customdata[1]}  |  시총: %{customdata[2]}<br>"
            "RS Rating: <b>%{customdata[3]}</b><br>"
            "<br>"
            "EPS YoY: %{customdata[4]}<br>"
            "매출 YoY: %{customdata[5]}<br>"
            "ROE: %{customdata[6]}  |  ROA: %{customdata[7]}<br>"
            "순이익률: %{customdata[8]}  |  영업이익률: %{customdata[9]}<br>"
            "<extra></extra>"
        )

        fig_sc = px.scatter(
            df_bubble,
            x="_rs_jitter", y="eps_yoy",   # 지터 적용 X축
            size="_bubble", size_max=30,
            color="market",
            color_discrete_map={"KOSPI": "#003A70", "KOSDAQ": "#16a34a"},
            hover_name="name",
            custom_data=custom_cols,
            title=f"RS Rating × EPS YoY — RS 상위 200종목 ({selected_date})",
        )
        fig_sc.update_traces(
            cliponaxis=False,
            hovertemplate=hovertemplate,
            opacity=0.75,           # 겹치는 버블 투과 표시
        )

        # ── 축 범위 ──
        Y_CENTER = 10
        x_vals = df_bubble["rs_rating"].dropna()
        y_vals = df_bubble["eps_yoy"].dropna().clip(-200, 500)

        # X축: 데이터 극단값 기반 (최솟값 ~ 100), 버블 여백 추가
        x_pad = max((100 - float(x_vals.min())) * 0.05, 1)
        x_min = float(x_vals.min()) - x_pad
        x_max = 100 + x_pad

        # Y축: EPS=10% 정중앙 고정, 데이터 극단값 기준 대칭
        y_dist = max(float(y_vals.max()) - Y_CENTER, Y_CENTER - float(y_vals.min()), 30)
        y_pad  = max(y_dist * 0.10, 15)
        y_min  = Y_CENTER - y_dist - y_pad
        y_max  = Y_CENTER + y_dist + y_pad

        fig_sc.add_vline(x=90, line_dash="dash", line_color="#dc2626",
            line_width=1.5, opacity=0.8,
            annotation_text="RS 90",
            annotation_position="top right",
            annotation_font=dict(size=14, color="#dc2626", family="Arial Black, sans-serif"))
        fig_sc.add_hline(y=20, line_dash="dash", line_color="#ea580c",
            line_width=1.5, opacity=0.8,
            annotation_text="EPS YoY 20%",
            annotation_position="top left",
            annotation_font=dict(size=14, color="#ea580c", family="Arial Black, sans-serif"))
        fig_sc.add_annotation(
            x=x_min + (x_max - x_min) * 0.92,
            y=y_min + (y_max - y_min) * 0.92,
            text="⭐ 매수 후보군", showarrow=False,
            font=dict(size=14, color="#dc2626", family="Arial Black, sans-serif"),
            bgcolor="rgba(255,255,255,0.9)", bordercolor="#dc2626", borderwidth=1.5,
        )

        # ── 산점도: JS로 뷰포트 높이 측정 후 Plotly 높이 동적 적용 ──
        # 비차단(non-blocking) iframe → parent window Plotly.relayout 호출
        components.html("""
<script>
(function() {
    var OFFSET = 130; // 차트 외 요소 합계(타이틀+탭+expander×2+여유)
    var MIN_H  = 300;

    function applyHeight() {
        try {
            var p   = window.parent;
            var vh  = p.innerHeight;
            var h   = Math.max(MIN_H, vh - OFFSET);

            // key="scatter_chart" → id에 "scatter_chart" 포함된 div 찾기
            var divs = p.document.querySelectorAll('[data-testid="stPlotlyChart"] .js-plotly-plot');
            if (!divs.length) { setTimeout(applyHeight, 200); return; }

            divs.forEach(function(d) {
                // Plotly 전역이 없으면 div 인라인 스타일만 조정
                try { p.Plotly.relayout(d, {height: h}); }
                catch(e) { d.style.height = h + 'px'; }
            });

            // 창 크기 바뀔 때 재적용
            p.removeEventListener('resize', applyHeight);
            p.addEventListener('resize', applyHeight);
        } catch(e) { setTimeout(applyHeight, 300); }
    }

    // Streamlit 렌더링 완료 대기
    setTimeout(applyHeight, 600);
})();
</script>
""", height=0)

        # Python 기본값 (JS 로드 전 초기 렌더): 뷰포트 모름 → 안전값 600
        _axis_font  = dict(size=14, color="#111111", family="Arial Black, sans-serif")
        _tick_font  = dict(size=13, color="#111111", family="Arial, sans-serif")
        _title_font = dict(size=15, color="#111111", family="Arial Black, sans-serif")

        fig_sc.update_layout(
            height=600,
            plot_bgcolor="#f8fafc", paper_bgcolor="white",
            font=dict(size=13, color="#111111"),
            legend=dict(
                orientation="h", y=-0.04,
                font=dict(size=13, color="#111111"),
            ),
            margin=dict(t=30, b=45, l=65, r=45),
            xaxis=dict(
                title=dict(text="RS Rating (±0.4 jitter)", font=_title_font),
                tickfont=_tick_font,
                range=[x_min, x_max], gridcolor="#e5e7eb",
                linecolor="#555555", linewidth=1.5,
            ),
            yaxis=dict(
                title=dict(text="EPS YoY (%)", font=_title_font),
                tickfont=_tick_font,
                range=[y_min, y_max], gridcolor="#e5e7eb",
                linecolor="#555555", linewidth=1.5,
            ),
        )

        # 기준선 annotation 폰트도 강화
        fig_sc.update_annotations(
            font=dict(size=13, color="#111111"),
        )

        # ── 산점도 + 우측 상세 패널 ──
        col_sc, col_detail = st.columns([3, 1])

        with col_sc:
            sc_event = st.plotly_chart(
                fig_sc, use_container_width=True,
                on_select="rerun", key="scatter_chart",
            )

        # ── 버블 클릭 처리: 상세 패널 표시만 (워치리스트는 패널 버튼으로) ──
        pts = getattr(getattr(sc_event, "selection", None), "points", [])
        if pts:
            cd = pts[0].get("customdata", [])
            clicked_ticker = cd[0] if cd else None
            if clicked_ticker:
                st.session_state["detail_ticker"] = clicked_ticker

        # ── 우측 상세 패널: 3개년 실적(값) + YoY% 2×2 병렬 차트 ──
        with col_detail:
            detail_ticker = st.session_state.get("detail_ticker")
            if detail_ticker and has_fundamentals:
                fund_row = df_fund[df_fund["ticker"] == detail_ticker]
                if not fund_row.empty:
                    r    = fund_row.iloc[0]
                    name = ticker_name_map.get(detail_ticker, detail_ticker)

                    # ── 워치리스트 토글 버튼 ──
                    in_watchlist = detail_ticker in [w["ticker"] for w in wl_get()]
                    if in_watchlist:
                        if st.button("✅ 워치리스트에 있음  ·  제거",
                                     key="wl_toggle", use_container_width=True):
                            wl_remove(detail_ticker)
                            st.toast(f"제거됨: {ticker_name_map.get(detail_ticker, detail_ticker)}", icon="🗑️")
                            st.rerun()
                    else:
                        if st.button("⭐ 워치리스트에 추가",
                                     key="wl_toggle", use_container_width=True):
                            wl_add(detail_ticker)
                            st.toast(f"⭐ {ticker_name_map.get(detail_ticker, detail_ticker)} 추가됨!", icon="⭐")
                            st.rerun()

                    # ── 연도 레이블 ──
                    yr0 = int(r["annual_year_2yr"]) if pd.notna(r.get("annual_year_2yr")) else "3년전"
                    yr1 = int(r["annual_year_prev"]) if pd.notna(r.get("annual_year_prev")) else "2년전"
                    yr2 = int(r["annual_year_curr"]) if pd.notna(r.get("annual_year_curr")) else "작년"
                    yoy_labels = [str(yr0), str(yr1), str(yr2)]
                    act_labels = [str(yr0), str(yr1), str(yr2)]

                    # ── EPS 실제값 (원) ──
                    eps_act = [
                        r.get("annual_eps_2yr_act")  if pd.notna(r.get("annual_eps_2yr_act"))  else None,
                        r.get("annual_eps_prev_act") if pd.notna(r.get("annual_eps_prev_act")) else None,
                        r.get("annual_eps_act")      if pd.notna(r.get("annual_eps_act"))      else None,
                    ]
                    # ── EPS YoY (%) ──
                    eps_yoy = [
                        r.get("annual_eps_2yr") if pd.notna(r.get("annual_eps_2yr")) else None,
                        r.get("annual_eps_yoy") if pd.notna(r.get("annual_eps_yoy")) else None,
                        r.get("eps_yoy")        if pd.notna(r.get("eps_yoy"))        else None,
                    ]
                    # ── 매출 실제값 (억원) ──
                    rev_act = [
                        (r.get("annual_revenue_2yr_act")  / 1e8) if pd.notna(r.get("annual_revenue_2yr_act"))  else None,
                        (r.get("annual_revenue_prev_act") / 1e8) if pd.notna(r.get("annual_revenue_prev_act")) else None,
                        (r.get("annual_revenue_act")      / 1e8) if pd.notna(r.get("annual_revenue_act"))      else None,
                    ]
                    # ── 매출 YoY (%) ──
                    rev_yoy = [
                        r.get("annual_revenue_2yr") if pd.notna(r.get("annual_revenue_2yr")) else None,
                        r.get("annual_revenue_yoy") if pd.notna(r.get("annual_revenue_yoy")) else None,
                        r.get("revenue_yoy")        if pd.notna(r.get("revenue_yoy"))        else None,
                    ]

                    def bar_colors(vals, pos_col="#3b82f6", neg_col="#ef4444"):
                        return [pos_col if (v is not None and v >= 0) else neg_col for v in vals]

                    from plotly.subplots import make_subplots
                    fig_bar = make_subplots(
                        rows=2, cols=2,
                        subplot_titles=[
                            "EPS 실적 (원)", "EPS YoY (%)",
                            "매출 실적 (억원)", "매출 YoY (%)",
                        ],
                        vertical_spacing=0.16,
                        horizontal_spacing=0.12,
                    )

                    # [1,1] EPS 실적
                    fig_bar.add_trace(go.Bar(
                        x=act_labels, y=eps_act,
                        marker_color=bar_colors(eps_act, "#3b82f6", "#ef4444"),
                        text=[f"{v:,.0f}원" if v is not None else "N/A" for v in eps_act],
                        textposition="outside",
                        textfont=dict(size=10, color="#111111"),
                        showlegend=False,
                    ), row=1, col=1)

                    # [1,2] EPS YoY
                    fig_bar.add_trace(go.Bar(
                        x=yoy_labels, y=eps_yoy,
                        marker_color=bar_colors(eps_yoy),
                        text=[f"{v:.1f}%" if v is not None else "N/A" for v in eps_yoy],
                        textposition="outside",
                        textfont=dict(size=10, color="#111111"),
                        showlegend=False,
                    ), row=1, col=2)

                    # [2,1] 매출 실적
                    fig_bar.add_trace(go.Bar(
                        x=act_labels, y=rev_act,
                        marker_color=bar_colors(rev_act, "#10b981", "#ef4444"),
                        text=[f"{v:,.0f}억" if v is not None else "N/A" for v in rev_act],
                        textposition="outside",
                        textfont=dict(size=10, color="#111111"),
                        showlegend=False,
                    ), row=2, col=1)

                    # [2,2] 매출 YoY
                    fig_bar.add_trace(go.Bar(
                        x=yoy_labels, y=rev_yoy,
                        marker_color=bar_colors(rev_yoy, "#10b981", "#ef4444"),
                        text=[f"{v:.1f}%" if v is not None else "N/A" for v in rev_yoy],
                        textposition="outside",
                        textfont=dict(size=10, color="#111111"),
                        showlegend=False,
                    ), row=2, col=2)

                    # 각 subplot y축 제로라인
                    for axis in ["yaxis", "yaxis2", "yaxis3", "yaxis4"]:
                        fig_bar.update_layout(**{axis: dict(
                            zeroline=True, zerolinecolor="#555555", zerolinewidth=1.2,
                            gridcolor="#e5e7eb",
                            tickfont=dict(size=10, color="#111111"),
                        )})

                    fig_bar.update_layout(
                        title=dict(
                            text=f"<b>{name}</b>",
                            font=dict(size=13, color="#111111"), x=0.5,
                        ),
                        height=620,
                        paper_bgcolor="white", plot_bgcolor="#f8fafc",
                        margin=dict(t=60, b=30, l=30, r=10),
                        font=dict(size=11, color="#111111"),
                    )
                    # subplot 제목 폰트
                    for ann in fig_bar.layout.annotations:
                        ann.font.size  = 11
                        ann.font.color = "#374151"

                    st.plotly_chart(fig_bar, use_container_width=True, key="bar_detail")
                else:
                    st.markdown(
                        "<div style='height:620px;display:flex;align-items:center;"
                        "justify-content:center;color:#9ca3af;font-size:13px;"
                        "border:1px dashed #374151;border-radius:8px'>"
                        "펀더멘탈 데이터 없음</div>",
                        unsafe_allow_html=True,
                    )
            else:
                st.markdown(
                    "<div style='height:620px;display:flex;align-items:center;"
                    "justify-content:center;color:#9ca3af;font-size:13px;"
                    "border:1px dashed #374151;border-radius:8px;text-align:center;"
                    "padding:20px'>"
                    "📊<br><br>버블을 클릭하면<br>EPS · 매출<br>3개년 실적 & YoY%가<br>표시됩니다</div>",
                    unsafe_allow_html=True,
                )

    else:
        st.info("펀더멘탈 데이터 수집 완료 후 산점도가 활성화됩니다.")

    # ── 스크리너 결과 테이블 (expander, 기본 접힘) ──
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

    with st.expander(f"📋 스크리너 결과 ({len(df_display)}개)", expanded=False):
        st.dataframe(
            df_display, use_container_width=True, height=400,
            column_config=column_config,
        )

    # ── 드릴다운 패널 (종목 상세 분석) ──
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
                    wl_now     = wl_get()
                    wl_tickers = [w["ticker"] for w in wl_now]
                    if sel_ticker in wl_tickers:
                        if st.button("⭐ 워치리스트 제거", key="dd_wl_rm"):
                            wl_remove(sel_ticker)
                            st.success(f"{sel_ticker} 제거됨")
                            st.rerun()
                    else:
                        if st.button("☆ 워치리스트 추가", key="dd_wl_add"):
                            wl_add(sel_ticker)
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

    wl_list = wl_get()

    if not wl_list:
        st.info("워치리스트가 비어 있습니다.  \n산점도 버블 클릭으로 종목을 추가하세요.")
    else:
        wl_tickers   = [w["ticker"] for w in wl_list]
        dates_sorted = sorted(df["date"].unique())
        latest_date  = dates_sorted[-1] if dates_sorted else None
        recent_dates = dates_sorted[-10:] if len(dates_sorted) >= 10 else dates_sorted

        # ── 버튼 행: 모두 선택 / 종목 삭제 ──
        selected_tickers = [t for t in wl_tickers if st.session_state.get(f"wl_chk_{t}", False)]
        btn_c1, btn_c2, _ = st.columns([1.3, 1.8, 7])
        with btn_c1:
            if st.button("☑️ 모두 선택", use_container_width=True):
                for t in wl_tickers:
                    st.session_state[f"wl_chk_{t}"] = True
                st.rerun()
        with btn_c2:
            n_sel    = len(selected_tickers)
            del_label = f"🗑️ 종목 삭제 ({n_sel})" if n_sel else "🗑️ 종목 삭제"
            if st.button(del_label, type="primary",
                         disabled=(n_sel == 0), use_container_width=True):
                for t in selected_tickers:
                    wl_remove(t)
                    st.session_state.pop(f"wl_chk_{t}", None)
                st.rerun()

        # ── RS 데이터 수집 ──
        conn_rs     = sqlite3.connect(DB_PATH)
        tickers_sql = ",".join([f"'{t}'" for t in wl_tickers])
        dates_sql   = ",".join([f"'{d}'" for d in recent_dates])
        df_rs_hist  = pd.read_sql(f"""
            SELECT ticker, date, rs_rating FROM rs_ratings
            WHERE ticker IN ({tickers_sql}) AND date IN ({dates_sql})
        """, conn_rs)

        def rs_at_added(ticker, added_date):
            r = pd.read_sql(f"""
                SELECT rs_rating FROM rs_ratings
                WHERE ticker='{ticker}' AND date >= '{added_date}'
                ORDER BY date ASC LIMIT 1
            """, conn_rs)
            if r.empty:
                r = pd.read_sql(f"""
                    SELECT rs_rating FROM rs_ratings
                    WHERE ticker='{ticker}' AND date <= '{added_date}'
                    ORDER BY date DESC LIMIT 1
                """, conn_rs)
            return float(r["rs_rating"].iloc[0]) if not r.empty else None

        # ── HTML 셀 헬퍼 ──
        def rs_cell(val):
            if val is None or (isinstance(val, float) and pd.isna(val)):
                return "<td style='background:#374151;color:#9ca3af;text-align:center;padding:4px 6px'>—</td>"
            v = int(val)
            if v >= 95:   bg, fg = "#16a34a", "white"
            elif v >= 90: bg, fg = "#ca8a04", "white"
            elif v >= 80: bg, fg = "#f3f4f6", "#1f2937"
            else:         bg, fg = "#dc2626", "white"
            return f"<td style='background:{bg};color:{fg};text-align:center;padding:4px 6px;font-weight:bold'>{v}</td>"

        def delta_cell(delta):
            if delta is None or (isinstance(delta, float) and pd.isna(delta)):
                return "<td style='text-align:center;padding:4px 6px'>—</td>"
            sign  = "+" if delta >= 0 else ""
            color = "#16a34a" if delta > 0 else ("#dc2626" if delta < 0 else "#6b7280")
            return f"<td style='color:{color};text-align:center;padding:4px 6px;font-weight:bold'>{sign}{int(delta)}</td>"

        # ── 체크박스 컬럼 + 테이블 컬럼 ──
        ROW_H   = 34   # px — HTML tr 높이와 맞춤
        THEAD_H = 36   # px — thead 높이

        col_chk, col_tbl = st.columns([0.35, 9.65])

        # 체크박스 열
        with col_chk:
            # thead 높이만큼 공백
            st.markdown(
                f"<div style='height:{THEAD_H + 8}px'></div>",
                unsafe_allow_html=True,
            )
            df_today = df[df["date"] == latest_date] if latest_date else pd.DataFrame()
            for w in wl_list:
                t = w["ticker"]
                st.checkbox(
                    "", key=f"wl_chk_{t}",
                    value=st.session_state.get(f"wl_chk_{t}", False),
                )
                # 체크박스와 tr 높이 보정
                st.markdown(
                    f"<div style='height:{ROW_H - 28}px'></div>",
                    unsafe_allow_html=True,
                )

        # 테이블 열
        with col_tbl:
            date_headers = "".join(
                f"<th style='text-align:center;padding:4px 8px;font-size:11px'>{d[5:]}</th>"
                for d in recent_dates
            )
            header = (
                "<tr style='background:#1e3a5f;color:white'>"
                "<th style='padding:6px 10px;min-width:90px'>종목명</th>"
                "<th style='padding:6px 8px;min-width:70px'>추가일</th>"
                "<th style='padding:6px 8px;text-align:center'>현재RS</th>"
                "<th style='padding:6px 8px;text-align:center'>등록후변화</th>"
                + date_headers + "</tr>"
            )

            rows_html = []
            for w in wl_list:
                t         = w["ticker"]
                added     = w["added_date"]
                name      = ticker_name_map.get(t, t).split("—")[-1].strip() \
                            if "—" in ticker_name_map.get(t, t) else t
                today_row = df_today[df_today["ticker"] == t]
                rs_now    = float(today_row["rs_rating"].values[0]) if not today_row.empty else None
                rs_reg    = rs_at_added(t, added)
                delta     = round(rs_now - rs_reg, 0) if rs_now is not None and rs_reg is not None else None
                rs_disp   = f"<b>{int(rs_now)}</b>" if rs_now is not None else "—"

                daily_cells = ""
                for d in recent_dates:
                    row_d = df_rs_hist[(df_rs_hist["ticker"] == t) & (df_rs_hist["date"] == d)]
                    val   = float(row_d["rs_rating"].values[0]) if not row_d.empty else None
                    daily_cells += rs_cell(val)

                rows_html.append(
                    f"<tr style='border-bottom:1px solid #374151;height:{ROW_H}px'>"
                    f"<td style='padding:5px 10px;font-weight:500'>{name}</td>"
                    f"<td style='padding:5px 8px;color:#9ca3af;font-size:12px'>{added}</td>"
                    f"<td style='text-align:center;padding:5px 8px'>{rs_disp}</td>"
                    + delta_cell(delta) + daily_cells + "</tr>"
                )

            conn_rs.close()

            legend = (
                "<div style='margin-top:8px;font-size:12px;color:#9ca3af'>"
                "<span style='background:#16a34a;color:white;padding:2px 8px;border-radius:3px;margin-right:6px'>RS≥95</span>"
                "<span style='background:#ca8a04;color:white;padding:2px 8px;border-radius:3px;margin-right:6px'>90~94</span>"
                "<span style='background:#f3f4f6;color:#1f2937;padding:2px 8px;border-radius:3px;margin-right:6px'>80~89</span>"
                "<span style='background:#dc2626;color:white;padding:2px 8px;border-radius:3px'>RS&lt;80</span>"
                "</div>"
            )
            st.markdown(
                "<div style='overflow-x:auto'>"
                "<table style='border-collapse:collapse;width:100%;font-size:13px'>"
                f"<thead>{header}</thead>"
                f"<tbody>{''.join(rows_html)}</tbody>"
                "</table></div>" + legend,
                unsafe_allow_html=True,
            )


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
