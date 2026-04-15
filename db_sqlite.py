import sqlite3
import os
import pandas as pd
from datetime import datetime

def save_to_sqlite(df_rs, trading_date, db_name="quant_dashboard.db"):
    """RS Rating 데이터를 SQLite에 저장한다.

    Args:
        df_rs: RS Rating DataFrame
        trading_date: 실제 거래일 문자열 (YYYY-MM-DD)
        db_name: DB 파일 경로
    """
    # 1. SQLite DB 연결
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    # 2. 테이블 생성
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS rs_ratings (
        date TEXT,
        ticker TEXT,
        latest_close INTEGER,
        market_cap REAL,
        avg_vol_10d INTEGER,
        ret_1d REAL,
        ret_1w REAL,
        ret_1m REAL,
        ret_3m REAL,
        ret_6m REAL,
        ret_12m REAL,
        rs_1d INTEGER,
        rs_1w INTEGER,
        rs_1m INTEGER,
        rs_3m INTEGER,
        rs_6m INTEGER,
        rs_12m INTEGER,
        composite_score REAL,
        rs_rating INTEGER,
        PRIMARY KEY (date, ticker)
    )
    ''')

    # 기존 테이블에 새 컬럼이 없으면 추가 (마이그레이션)
    existing_cols = [row[1] for row in cursor.execute('PRAGMA table_info(rs_ratings)').fetchall()]
    for col_name, col_type in [
        ('composite_score', 'REAL'), ('rs_rating', 'INTEGER'),
        ('market_cap', 'REAL'), ('avg_vol_10d', 'INTEGER'),
    ]:
        if col_name not in existing_cols:
            cursor.execute(f'ALTER TABLE rs_ratings ADD COLUMN {col_name} {col_type}')

    # 3. 중복 저장 방지: 해당 거래일 데이터가 이미 존재하면 스킵
    existing_count = cursor.execute(
        'SELECT COUNT(*) FROM rs_ratings WHERE date = ?', (trading_date,)
    ).fetchone()[0]

    if existing_count > 0:
        print(f"\n⏭️ [{trading_date}] 데이터가 이미 존재합니다 ({existing_count}건). 저장을 건너뜁니다.")
        conn.close()
        return

    print(f"\n[{trading_date}] 🚀 SQLite 데이터 저장 시작...")

    records = []

    # 헬퍼 함수
    def parse_float(val):
        if pd.isna(val) or val is None or str(val) == 'nan%':
            return None
        return float(str(val).replace('%', ''))

    def parse_int(val):
        if pd.isna(val) or val is None:
            return None
        return int(val)

    # 4. 데이터 변환
    for _, row in df_rs.iterrows():
        records.append((
            trading_date,
            row['ticker'],
            int(row['latest_close']),
            parse_float(row.get('market_cap')),
            parse_int(row.get('avg_vol_10d')),
            parse_float(row['ret_1D']), parse_float(row['ret_1W']),
            parse_float(row['ret_1M']), parse_float(row['ret_3M']),
            parse_float(row['ret_6M']), parse_float(row['ret_12M']),
            parse_int(row['RS_1D']), parse_int(row['RS_1W']),
            parse_int(row['RS_1M']), parse_int(row['RS_3M']),
            parse_int(row['RS_6M']), parse_int(row['RS_12M']),
            parse_float(row['composite_score']),
            parse_int(row['rs_rating']),
        ))

    # 5. 데이터 삽입
    try:
        cursor.executemany('''
        INSERT OR REPLACE INTO rs_ratings
        (date, ticker, latest_close, market_cap, avg_vol_10d,
         ret_1d, ret_1w, ret_1m, ret_3m, ret_6m, ret_12m,
         rs_1d, rs_1w, rs_1m, rs_3m, rs_6m, rs_12m,
         composite_score, rs_rating)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', records)

        conn.commit()
        print(f"✅ 총 {len(records)}건의 RS 데이터가 '{db_name}'에 저장되었습니다!")

    except Exception as e:
        print(f"❌ RS 데이터 저장 중 에러 발생: {e}")
        conn.rollback()

    finally:
        conn.close()


# ==========================================
# 펀더멘탈 데이터 저장
# ==========================================
def save_fundamentals(df_fund, trading_date, db_name="quant_dashboard.db"):
    """펀더멘탈 데이터를 SQLite에 저장한다."""
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS fundamentals (
        date TEXT,
        ticker TEXT,
        latest_quarter TEXT,
        revenue BIGINT,
        op_profit BIGINT,
        net_income BIGINT,
        eps INTEGER,
        revenue_yoy REAL,
        eps_yoy REAL,
        op_profit_yoy REAL,
        op_margin REAL,
        net_margin REAL,
        op_margin_chg REAL,
        net_margin_chg REAL,
        roe REAL,
        roa REAL,
        debt_ratio REAL,
        annual_revenue_yoy REAL,
        annual_eps_yoy REAL,
        annual_revenue_2yr REAL,
        annual_eps_2yr REAL,
        annual_op_margin REAL,
        annual_net_margin REAL,
        PRIMARY KEY (date, ticker)
    )
    ''')

    print(f"\n[{trading_date}] 🚀 펀더멘탈 데이터 저장 시작...")

    records = []

    def safe_val(val):
        if val is None or (isinstance(val, float) and pd.isna(val)):
            return None
        return val

    for _, row in df_fund.iterrows():
        records.append((
            trading_date,
            row.get('ticker'),
            safe_val(row.get('latest_quarter')),
            safe_val(row.get('revenue')),
            safe_val(row.get('op_profit')),
            safe_val(row.get('net_income')),
            safe_val(row.get('eps')),
            safe_val(row.get('revenue_yoy')),
            safe_val(row.get('eps_yoy')),
            safe_val(row.get('op_profit_yoy')),
            safe_val(row.get('op_margin')),
            safe_val(row.get('net_margin')),
            safe_val(row.get('op_margin_chg')),
            safe_val(row.get('net_margin_chg')),
            safe_val(row.get('roe')),
            safe_val(row.get('roa')),
            safe_val(row.get('debt_ratio')),
            safe_val(row.get('annual_revenue_yoy')),
            safe_val(row.get('annual_eps_yoy')),
            safe_val(row.get('annual_revenue_2yr')),
            safe_val(row.get('annual_eps_2yr')),
            safe_val(row.get('annual_op_margin')),
            safe_val(row.get('annual_net_margin')),
        ))

    try:
        cursor.executemany('''
        INSERT OR REPLACE INTO fundamentals
        (date, ticker, latest_quarter,
         revenue, op_profit, net_income, eps,
         revenue_yoy, eps_yoy, op_profit_yoy,
         op_margin, net_margin, op_margin_chg, net_margin_chg,
         roe, roa, debt_ratio,
         annual_revenue_yoy, annual_eps_yoy,
         annual_revenue_2yr, annual_eps_2yr,
         annual_op_margin, annual_net_margin)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', records)

        conn.commit()
        print(f"✅ 총 {len(records)}건의 펀더멘탈 데이터가 '{db_name}'에 저장되었습니다!")

    except Exception as e:
        print(f"❌ 펀더멘탈 저장 중 에러 발생: {e}")
        conn.rollback()

    finally:
        conn.close()


# ==========================================
# 유틸리티
# ==========================================
def get_latest_trading_date(df_prices):
    """수집된 가격 데이터에서 실제 최신 거래일을 추출한다."""
    latest = df_prices['date'].max()
    return f"{latest[:4]}-{latest[4:6]}-{latest[6:8]}"


def is_already_collected(trading_date, db_name="quant_dashboard.db"):
    """해당 거래일 데이터가 이미 DB에 존재하는지 확인한다."""
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    cursor.execute(
        'SELECT COUNT(*) FROM rs_ratings WHERE date = ?', (trading_date,)
    )
    count = cursor.fetchone()[0]
    conn.close()
    return count > 0


# ==========================================
# 메인 파이프라인
# ==========================================
if __name__ == "__main__":
    from rs_calculator import calculate_rs_ratings
    from kis_fetcher import get_access_token, fetch_1yr_daily_price, run_batch_collection
    from fdr_auth import get_filtered_universe

    # ── 1단계: 종목 1개로 거래일 사전 체크 ──
    print("🔍 거래일 사전 체크 중 (종목 1개 샘플 수집)...")
    universe_df = get_filtered_universe()
    sample_ticker = universe_df['ticker'].iloc[0]
    token = get_access_token()
    sample_df = fetch_1yr_daily_price(sample_ticker, token)

    if sample_df.empty:
        print("❌ 샘플 수집 실패. 파이프라인을 종료합니다.")
        exit(1)

    trading_date = get_latest_trading_date(sample_df)
    print(f"📅 최신 거래일: {trading_date}")

    if is_already_collected(trading_date):
        print(f"⏭️ [{trading_date}] 데이터가 이미 존재합니다. 공휴일 또는 중복 실행으로 판단하여 종료합니다.")
        exit(0)

    # ── 2단계: RS 파이프라인 ──
    print(f"✅ [{trading_date}] 신규 거래일 확인. 전체 수집을 시작합니다.\n")
    df_prices = run_batch_collection()
    if df_prices is not None and not df_prices.empty:
        df_rs = calculate_rs_ratings(df_prices)
        save_to_sqlite(df_rs, trading_date)

    # ── 3단계: 펀더멘탈 파이프라인 (DART_API_KEY가 있을 때만) ──
    if os.environ.get("DART_API_KEY"):
        from dart_fetcher import run_fundamental_collection
        tickers = universe_df['ticker'].tolist()
        df_fund = run_fundamental_collection(tickers)
        if df_fund is not None and not df_fund.empty:
            save_fundamentals(df_fund, trading_date)
    else:
        print("\n⚠️ DART_API_KEY가 없어 펀더멘탈 수집을 건너뜁니다.")
