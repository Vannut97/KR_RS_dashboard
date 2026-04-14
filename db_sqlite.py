import sqlite3
import pandas as pd
from datetime import datetime

def save_to_sqlite(df_rs, db_name="quant_dashboard.db"):
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

    today_str = datetime.now().strftime('%Y-%m-%d')
    print(f"\n[{today_str}] 🚀 SQLite 데이터 저장 시작...")

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

    # 3. 데이터 변환
    for _, row in df_rs.iterrows():
        records.append((
            today_str,
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

    # 4. 데이터 삽입
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
        print(f"✅ 총 {len(records)}건의 데이터가 '{db_name}'에 성공적으로 저장되었습니다!")

    except Exception as e:
        print(f"❌ 데이터 저장 중 에러 발생: {e}")
        conn.rollback()

    finally:
        conn.close()

if __name__ == "__main__":
    from rs_calculator import calculate_rs_ratings
    from kis_fetcher import run_batch_collection

    df_prices = run_batch_collection()
    if df_prices is not None and not df_prices.empty:
        df_rs = calculate_rs_ratings(df_prices)
        save_to_sqlite(df_rs)
