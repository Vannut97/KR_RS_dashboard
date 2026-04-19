import sqlite3
import os
import pandas as pd
from datetime import datetime

def save_to_sqlite(df_rs, trading_date, db_name="quant_dashboard.db", universe_df=None):
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
        name TEXT,
        market TEXT,
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
        ('name', 'TEXT'), ('market', 'TEXT'),
    ]:
        if col_name not in existing_cols:
            cursor.execute(f'ALTER TABLE rs_ratings ADD COLUMN {col_name} {col_type}')

    print(f"\n[{trading_date}] 🚀 SQLite 데이터 저장 시작...")

    # universe_df에서 ticker → (name, market) 맵 생성
    name_map   = {}
    market_map = {}
    if universe_df is not None and not universe_df.empty:
        for _, urow in universe_df.iterrows():
            t = str(urow['ticker'])
            name_map[t]   = str(urow.get('name', ''))
            market_map[t] = str(urow.get('market', ''))

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
        t = str(row['ticker'])
        records.append((
            trading_date,
            t,
            name_map.get(t, ''),
            market_map.get(t, ''),
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
        (date, ticker, name, market, latest_close, market_cap, avg_vol_10d,
         ret_1d, ret_1w, ret_1m, ret_3m, ret_6m, ret_12m,
         rs_1d, rs_1w, rs_1m, rs_3m, rs_6m, rs_12m,
         composite_score, rs_rating)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        annual_revenue_act      BIGINT,
        annual_revenue_prev_act BIGINT,
        annual_revenue_2yr_act  BIGINT,
        annual_eps_act          INTEGER,
        annual_eps_prev_act     INTEGER,
        annual_eps_2yr_act      INTEGER,
        annual_year_curr        INTEGER,
        annual_year_prev        INTEGER,
        annual_year_2yr         INTEGER,
        PRIMARY KEY (date, ticker)
    )
    ''')

    # 기존 테이블에 새 컬럼이 없으면 추가 (마이그레이션)
    existing_cols = [row[1] for row in cursor.execute('PRAGMA table_info(fundamentals)').fetchall()]
    for col_name, col_type in [
        ('annual_revenue_act',      'BIGINT'),
        ('annual_revenue_prev_act', 'BIGINT'),
        ('annual_revenue_2yr_act',  'BIGINT'),
        ('annual_eps_act',          'INTEGER'),
        ('annual_eps_prev_act',     'INTEGER'),
        ('annual_eps_2yr_act',      'INTEGER'),
        ('annual_year_curr',        'INTEGER'),
        ('annual_year_prev',        'INTEGER'),
        ('annual_year_2yr',         'INTEGER'),
    ]:
        if col_name not in existing_cols:
            cursor.execute(f'ALTER TABLE fundamentals ADD COLUMN {col_name} {col_type}')

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
            safe_val(row.get('annual_revenue_act')),
            safe_val(row.get('annual_revenue_prev_act')),
            safe_val(row.get('annual_revenue_2yr_act')),
            safe_val(row.get('annual_eps_act')),
            safe_val(row.get('annual_eps_prev_act')),
            safe_val(row.get('annual_eps_2yr_act')),
            safe_val(row.get('annual_year_curr')),
            safe_val(row.get('annual_year_prev')),
            safe_val(row.get('annual_year_2yr')),
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
         annual_op_margin, annual_net_margin,
         annual_revenue_act, annual_revenue_prev_act, annual_revenue_2yr_act,
         annual_eps_act, annual_eps_prev_act, annual_eps_2yr_act,
         annual_year_curr, annual_year_prev, annual_year_2yr)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?, ?)
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


def find_missing_fundamental_tickers(tickers, db_name="quant_dashboard.db"):
    """유니버스 중 fundamentals 테이블에 한 번도 기록된 적 없는 종목을 반환한다.

    Args:
        tickers: 현재 유니버스의 전체 ticker 리스트
        db_name: DB 파일 경로

    Returns:
        누락된 ticker 리스트 (테이블이 없으면 전체 리스트 반환)
    """
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    # 테이블 존재 여부 체크
    cursor.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='fundamentals'"
    )
    if not cursor.fetchone():
        conn.close()
        return list(tickers)  # 최초 실행 = 전부 공란

    cursor.execute("SELECT DISTINCT ticker FROM fundamentals")
    existing = {row[0] for row in cursor.fetchall()}
    conn.close()

    return [t for t in tickers if t not in existing]


# ==========================================
# 보고서 인덱스
# ==========================================
def _ensure_report_index_table(cursor):
    """report_index 테이블 생성 (없을 때만)."""
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS report_index (
        ticker      TEXT,
        quarter     TEXT,
        report_date TEXT,
        report_path TEXT,
        PRIMARY KEY (ticker, quarter)
    )
    ''')


def save_report_index(ticker, quarter, report_date, report_path,
                      db_name="quant_dashboard.db"):
    """보고서 생성 기록을 report_index 테이블에 저장한다."""
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    _ensure_report_index_table(cursor)
    cursor.execute(
        "INSERT OR REPLACE INTO report_index "
        "(ticker, quarter, report_date, report_path) VALUES (?, ?, ?, ?)",
        (ticker, quarter, report_date, report_path)
    )
    conn.commit()
    conn.close()
    print(f"✅ report_index 저장: {ticker} ({quarter})")


def get_all_report_tickers(db_name="quant_dashboard.db"):
    """보고서가 한 번이라도 생성된 ticker set 반환 (dashboard 배지용)."""
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    cursor.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='report_index'"
    )
    if not cursor.fetchone():
        conn.close()
        return set()
    cursor.execute("SELECT DISTINCT ticker FROM report_index")
    result = {row[0] for row in cursor.fetchall()}
    conn.close()
    return result


# ==========================================
# 워치리스트
# ==========================================
def _ensure_watchlist_table(cursor):
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS watchlist (
        ticker     TEXT PRIMARY KEY,
        added_date TEXT,
        note       TEXT
    )
    ''')


def add_to_watchlist(ticker, note="", db_name="quant_dashboard.db"):
    """워치리스트에 종목 추가 (이미 있으면 무시)."""
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    _ensure_watchlist_table(cursor)
    cursor.execute(
        "INSERT OR IGNORE INTO watchlist (ticker, added_date, note) VALUES (?, ?, ?)",
        (ticker, datetime.now().strftime("%Y-%m-%d"), note)
    )
    conn.commit()
    conn.close()


def remove_from_watchlist(ticker, db_name="quant_dashboard.db"):
    """워치리스트에서 종목 제거."""
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM watchlist WHERE ticker = ?", (ticker,))
    conn.commit()
    conn.close()


def get_watchlist(db_name="quant_dashboard.db"):
    """워치리스트 전체 반환 [{ticker, added_date, note}, ...]."""
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    cursor.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='watchlist'"
    )
    if not cursor.fetchone():
        conn.close()
        return []
    cursor.execute(
        "SELECT ticker, added_date, note FROM watchlist ORDER BY added_date DESC"
    )
    result = [{"ticker": r[0], "added_date": r[1], "note": r[2]}
              for r in cursor.fetchall()]
    conn.close()
    return result


def get_all_reports(db_name="quant_dashboard.db"):
    """전체 보고서 목록을 최신순으로 반환.

    Returns:
        list of dict: [{ticker, quarter, report_date, report_path}, ...]
    """
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    cursor.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='report_index'"
    )
    if not cursor.fetchone():
        conn.close()
        return []
    cursor.execute(
        "SELECT ticker, quarter, report_date, report_path "
        "FROM report_index ORDER BY report_date DESC, ticker"
    )
    result = [
        {"ticker": r[0], "quarter": r[1], "report_date": r[2], "report_path": r[3]}
        for r in cursor.fetchall()
    ]
    conn.close()
    return result


# ==========================================
# 메인 파이프라인
# ==========================================
if __name__ == "__main__":
    from rs_calculator import calculate_rs_ratings
    from kis_fetcher import run_batch_collection
    from fdr_auth import get_filtered_universe

    # ── 1단계: RS 파이프라인 (전체 종목 수집) ──
    print("🚀 전체 종목 가격 수집을 시작합니다.\n")
    universe_df = get_filtered_universe()
    df_prices   = run_batch_collection()

    if df_prices is None or df_prices.empty:
        print("❌ 가격 데이터 수집 실패. 파이프라인을 종료합니다.")
        exit(1)

    trading_date = get_latest_trading_date(df_prices)
    print(f"\n📅 최신 거래일: {trading_date}")

    df_rs = calculate_rs_ratings(df_prices)
    save_to_sqlite(df_rs, trading_date, universe_df=universe_df)

    # ── 2단계: 펀더멘탈 파이프라인 (DART_API_KEY가 있을 때만) ──
    #
    # 수집 정책:
    #  (A) 3/6/9/12월의 금요일  → 전체 종목 리프레시 (분기 실적 반영)
    #  (B) 그 외 일자          → 누락 종목(신규 상장 · 초기 실행)만 우선 수집
    #  (C) (B) 결과 누락 종목이 0개면 스킵
    if os.environ.get("DART_API_KEY"):
        from dart_fetcher import run_fundamental_collection

        universe_df = get_filtered_universe()
        all_tickers = universe_df['ticker'].tolist()

        now = datetime.now()
        is_earnings_refresh_day = (
            now.weekday() == 4                # 금요일
            and now.month in (3, 6, 9, 12)    # 분기 실적 반영 월
        )

        if is_earnings_refresh_day:
            target_tickers = all_tickers
            print(f"\n📅 [{now:%Y-%m-%d}] 분기 실적 리프레시 데이 — 전체 {len(target_tickers)}개 종목 펀더멘탈 수집")
        else:
            target_tickers = find_missing_fundamental_tickers(all_tickers)
            if target_tickers:
                print(f"\n🔍 [{now:%Y-%m-%d}] 누락/신규 종목 펀더멘탈 우선 수집: {len(target_tickers)}개")
            else:
                print(f"\n✅ [{now:%Y-%m-%d}] 누락 종목 없음 & 리프레시 데이 아님 — 펀더멘탈 수집 스킵")

        if target_tickers:
            df_fund = run_fundamental_collection(target_tickers)
            if df_fund is not None and not df_fund.empty:
                save_fundamentals(df_fund, trading_date)
    else:
        print("\n⚠️ DART_API_KEY가 없어 펀더멘탈 수집을 건너뜁니다.")
