"""
일별 주식 분석 대상 종목 스크리너.

필터링 조건 충족 종목 중 분기 중복을 제외하고,
RS Rating 순으로 최대 MAX_REPORTS개를 선택해 JSON으로 반환한다.
"""

import sqlite3
import json
import pandas as pd

# ==========================================
# 필터링 조건
# ==========================================
RS_RATING_MIN    = 90
EPS_YOY_MIN      = 20.0
REVENUE_YOY_MIN  = 20.0
ROE_MIN          = 10.0
MAX_REPORTS      = 5

DB_NAME = "quant_dashboard.db"


def get_filtered_candidates(db_name=DB_NAME):
    """RS + 펀더멘탈 조건 충족 종목을 RS Rating 순으로 반환."""
    conn = sqlite3.connect(db_name)

    latest_date = pd.read_sql(
        "SELECT MAX(date) as d FROM rs_ratings", conn
    )['d'].iloc[0]

    query = f"""
    SELECT
        r.ticker,
        r.rs_rating,
        r.latest_close,
        r.market_cap,
        r.ret_1m,
        r.ret_3m,
        r.ret_6m,
        r.ret_12m,
        f.eps_yoy,
        f.revenue_yoy,
        f.roe,
        f.op_margin,
        f.net_margin,
        f.debt_ratio,
        f.annual_eps_yoy,
        f.annual_revenue_yoy,
        f.latest_quarter
    FROM rs_ratings r
    LEFT JOIN (
        SELECT ticker, MAX(date) AS max_date
        FROM fundamentals
        GROUP BY ticker
    ) fm ON r.ticker = fm.ticker
    LEFT JOIN fundamentals f
        ON f.ticker = fm.ticker AND f.date = fm.max_date
    WHERE r.date = '{latest_date}'
      AND r.rs_rating     >= {RS_RATING_MIN}
      AND f.eps_yoy       >= {EPS_YOY_MIN}
      AND f.revenue_yoy   >= {REVENUE_YOY_MIN}
      AND f.roe           >= {ROE_MIN}
    ORDER BY r.rs_rating DESC
    """
    df = pd.read_sql(query, conn)
    conn.close()
    return df, latest_date


def get_existing_report_quarters(db_name=DB_NAME):
    """이미 생성된 보고서의 {ticker: {quarter, ...}} 반환."""
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    cursor.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='report_index'"
    )
    if not cursor.fetchone():
        conn.close()
        return {}

    cursor.execute("SELECT ticker, quarter FROM report_index")
    result = {}
    for ticker, quarter in cursor.fetchall():
        result.setdefault(ticker, set()).add(quarter)
    conn.close()
    return result


def select_targets(db_name=DB_NAME):
    """분기 중복 제외 후 오늘 분석할 최대 MAX_REPORTS개 종목 선택."""
    df, latest_date = get_filtered_candidates(db_name)

    if df.empty:
        print("⚠️  필터링 조건 충족 종목 없음 (펀더멘탈 데이터 미수집 포함).")
        return [], latest_date

    existing = get_existing_report_quarters(db_name)
    targets  = []
    skipped  = []

    for _, row in df.iterrows():
        ticker  = str(row['ticker'])
        quarter = str(row.get('latest_quarter') or '')

        # 같은 분기 보고서가 이미 있으면 스킵
        if ticker in existing and quarter in existing[ticker]:
            skipped.append(f"{ticker}({quarter})")
            continue

        targets.append({k: (None if pd.isna(v) else v) for k, v in row.items()})
        if len(targets) >= MAX_REPORTS:
            break

    if skipped:
        print(f"⏭️  분기 중복 스킵: {', '.join(skipped)}")

    print(f"\n✅  오늘 분석 대상 {len(targets)}개: "
          f"{[t['ticker'] for t in targets]}")

    return targets, latest_date


if __name__ == "__main__":
    targets, latest_date = select_targets()
    print(json.dumps(
        {"latest_date": latest_date, "targets": targets},
        ensure_ascii=False, indent=2, default=str
    ))
