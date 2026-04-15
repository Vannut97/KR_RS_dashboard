import streamlit as st
import sqlite3
import pandas as pd
import FinanceDataReader as fdr

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
    # fundamentals 테이블 존재 여부 확인
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


# 데이터 로드
df_rs = load_rs_data()
df_fund = load_fundamentals()
df_universe = load_universe()

# 종목명 & 시장 정보 병합
df = df_rs.merge(df_universe, on="ticker", how="left")

# 펀더멘탈 병합 — 종목별 최신 1건만 사용하므로 ticker 키로 조인
# (load_fundamentals()가 이미 ticker당 최신 date 1건만 로드함)
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

# ==========================================
# 사이드바 필터
# ==========================================
st.sidebar.header("🔍 필터 설정")

# 날짜 선택
available_dates = sorted(df["date"].unique(), reverse=True)
selected_date = st.sidebar.selectbox("📅 기준일", available_dates)

# 시장 필터
market_options = ["전체", "KOSPI", "KOSDAQ"]
selected_market = st.sidebar.selectbox("🏛️ 시장", market_options)

# RS Rating 범위
st.sidebar.markdown("---")
st.sidebar.subheader("RS Rating 범위")
rs_min, rs_max = st.sidebar.slider(
    "IBD RS Rating",
    min_value=1, max_value=99, value=(1, 99),
)

# 개별 RS 필터 (접이식)
with st.sidebar.expander("📐 개별 기간 RS 필터"):
    rs_1m_min = st.slider("RS 1M 최소", 1, 99, 1)
    rs_3m_min = st.slider("RS 3M 최소", 1, 99, 1)
    rs_6m_min = st.slider("RS 6M 최소", 1, 99, 1)
    rs_12m_min = st.slider("RS 12M 최소", 1, 99, 1)

# 펀더멘탈 필터 (접이식)
if has_fundamentals:
    with st.sidebar.expander("📈 펀더멘탈 필터"):
        eps_yoy_min = st.number_input("EPS YoY 최소 (%)", value=-9999, step=5)
        revenue_yoy_min = st.number_input("매출 YoY 최소 (%)", value=-9999, step=5)
        roe_min = st.number_input("ROE 최소 (%)", value=-9999.0, step=1.0)
        op_margin_min = st.number_input("영업이익률 최소 (%)", value=-9999.0, step=1.0)

# 종가 범위
st.sidebar.markdown("---")
price_min = st.sidebar.number_input("💰 최소 종가", value=0, step=1000)
price_max = st.sidebar.number_input("💰 최대 종가 (0=무제한)", value=0, step=10000)

# 종목 검색
st.sidebar.markdown("---")
search_query = st.sidebar.text_input("🔎 종목명/코드 검색")

# ==========================================
# 필터 적용
# ==========================================
filtered = df[df["date"] == selected_date].copy()

if selected_market != "전체":
    filtered = filtered[filtered["market"] == selected_market]

filtered = filtered[
    (filtered["rs_rating"] >= rs_min) & (filtered["rs_rating"] <= rs_max)
]

# 개별 RS 필터
filtered = filtered[
    (filtered["rs_1m"].fillna(0) >= rs_1m_min)
    & (filtered["rs_3m"].fillna(0) >= rs_3m_min)
    & (filtered["rs_6m"].fillna(0) >= rs_6m_min)
    & (filtered["rs_12m"].fillna(0) >= rs_12m_min)
]

# 펀더멘탈 필터
if has_fundamentals:
    if eps_yoy_min > -9999:
        filtered = filtered[
            filtered["eps_yoy"].fillna(-99999) >= eps_yoy_min
        ]
    if revenue_yoy_min > -9999:
        filtered = filtered[
            filtered["revenue_yoy"].fillna(-99999) >= revenue_yoy_min
        ]
    if roe_min > -9999:
        filtered = filtered[
            filtered["roe"].fillna(-99999) >= roe_min
        ]
    if op_margin_min > -9999:
        filtered = filtered[
            filtered["op_margin"].fillna(-99999) >= op_margin_min
        ]

# 종가 필터
filtered = filtered[filtered["latest_close"] >= price_min]
if price_max > 0:
    filtered = filtered[filtered["latest_close"] <= price_max]

# 종목 검색
if search_query:
    mask = (
        filtered["ticker"].str.contains(search_query, case=False, na=False)
        | filtered["name"].str.contains(search_query, case=False, na=False)
    )
    filtered = filtered[mask]

# ==========================================
# 표시용 컬럼 정리
# ==========================================
display_cols = [
    "ticker", "name", "market", "latest_close", "market_cap", "avg_vol_10d",
    "rs_rating", "composite_score",
    "rs_1d", "rs_1w", "rs_1m", "rs_3m", "rs_6m", "rs_12m",
    "ret_1d", "ret_1w", "ret_1m", "ret_3m", "ret_6m", "ret_12m",
]

# 펀더멘탈 컬럼 추가
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
df_display = filtered[display_cols].reset_index(drop=True)

# ==========================================
# 메인 화면
# ==========================================

# 요약 지표
col1, col2, col3, col4 = st.columns(4)
col1.metric("📅 기준일", selected_date)
col2.metric("📋 필터 결과", f"{len(df_display)}개")
col3.metric("🏛️ 시장", selected_market)

total_for_date = len(df[df["date"] == selected_date])
col4.metric("전체 종목", f"{total_for_date}개")

st.markdown("---")

# 데이터 테이블
st.subheader(f"📋 스크리너 결과 ({len(df_display)}개)")

column_config = {
    "ticker": st.column_config.TextColumn("종목코드", width="small"),
    "name": st.column_config.TextColumn("종목명", width="medium"),
    "market": st.column_config.TextColumn("시장", width="small"),
    "latest_close": st.column_config.NumberColumn("종가", format="%d"),
    "market_cap": st.column_config.NumberColumn("시가총액(억)", format="%,.0f"),
    "avg_vol_10d": st.column_config.NumberColumn("10일평균거래량", format="%,.0f"),
    "rs_rating": st.column_config.NumberColumn("⭐ RS Rating", width="small"),
    "composite_score": st.column_config.NumberColumn("복합점수"),
    "rs_1d": st.column_config.NumberColumn("RS 1D", width="small"),
    "rs_1w": st.column_config.NumberColumn("RS 1W", width="small"),
    "rs_1m": st.column_config.NumberColumn("RS 1M", width="small"),
    "rs_3m": st.column_config.NumberColumn("RS 3M", width="small"),
    "rs_6m": st.column_config.NumberColumn("RS 6M", width="small"),
    "rs_12m": st.column_config.NumberColumn("RS 12M", width="small"),
}

# 펀더멘탈 컬럼 설정
if has_fundamentals:
    column_config.update({
        "eps_yoy": st.column_config.NumberColumn("EPS YoY%", format="%.1f"),
        "revenue_yoy": st.column_config.NumberColumn("매출 YoY%", format="%.1f"),
        "op_profit_yoy": st.column_config.NumberColumn("영업이익 YoY%", format="%.1f"),
        "op_margin": st.column_config.NumberColumn("영업이익률%", format="%.1f"),
        "net_margin": st.column_config.NumberColumn("순이익률%", format="%.1f"),
        "op_margin_chg": st.column_config.NumberColumn("영업이익률 chg", format="%.1f"),
        "net_margin_chg": st.column_config.NumberColumn("순이익률 chg", format="%.1f"),
        "roe": st.column_config.NumberColumn("ROE%", format="%.1f"),
        "roa": st.column_config.NumberColumn("ROA%", format="%.1f"),
        "debt_ratio": st.column_config.NumberColumn("부채비율%", format="%.1f"),
        "annual_eps_yoy": st.column_config.NumberColumn("연간EPS YoY%", format="%.1f"),
        "annual_revenue_yoy": st.column_config.NumberColumn("연간매출 YoY%", format="%.1f"),
        "annual_eps_2yr": st.column_config.NumberColumn("EPS 2yr%", format="%.1f"),
        "annual_revenue_2yr": st.column_config.NumberColumn("매출 2yr%", format="%.1f"),
        "annual_op_margin": st.column_config.NumberColumn("연간영업이익률%", format="%.1f"),
        "annual_net_margin": st.column_config.NumberColumn("연간순이익률%", format="%.1f"),
        "latest_quarter": st.column_config.TextColumn("기준분기", width="small"),
    })

st.dataframe(
    df_display,
    use_container_width=True,
    height=500,
    column_config=column_config,
)

# ==========================================
# 차트
# ==========================================
st.markdown("---")
chart_col1, chart_col2 = st.columns(2)

with chart_col1:
    st.subheader("📊 RS Rating 분포")
    if not df_display.empty:
        hist_data = df_display["rs_rating"].dropna()
        st.bar_chart(hist_data.value_counts().sort_index())

with chart_col2:
    st.subheader("📈 RS Rating 구간별 종목 수")
    if not df_display.empty:
        bins = [0, 20, 40, 60, 80, 99]
        labels = ["1-20", "21-40", "41-60", "61-80", "81-99"]
        df_display["rs_group"] = pd.cut(
            df_display["rs_rating"], bins=bins, labels=labels
        )
        group_counts = df_display["rs_group"].value_counts().sort_index()
        st.bar_chart(group_counts)

# ==========================================
# CSV 다운로드
# ==========================================
st.markdown("---")
if not df_display.empty:
    csv = df_display.to_csv(index=False, encoding="utf-8-sig")
    st.download_button(
        label="📥 CSV 다운로드",
        data=csv,
        file_name=f"rs_screener_{selected_date}.csv",
        mime="text/csv",
    )
