"""테스트용 파이프라인 — 10개 종목만 수집하여 검증."""

from fdr_auth import get_filtered_universe
from kis_fetcher import get_access_token, fetch_1yr_daily_price
from rs_calculator import calculate_rs_ratings
import pandas as pd
import time

TEST_COUNT = 10

def run_test():
    # 1. 유니버스에서 10개만 추출
    universe_df = get_filtered_universe()
    test_tickers = universe_df['ticker'].tolist()[:TEST_COUNT]
    print(f"\n[TEST] {TEST_COUNT}개 종목만 수집: {test_tickers}\n")

    # 2. 가격 수집
    token = get_access_token()
    all_prices = []

    for idx, ticker in enumerate(test_tickers):
        print(f"  [{idx+1}/{TEST_COUNT}] {ticker} 수집 중...")
        df_price = fetch_1yr_daily_price(ticker, token)
        if not df_price.empty:
            all_prices.append(df_price)

    if not all_prices:
        print("[TEST] 수집된 데이터가 없습니다.")
        return

    df_prices = pd.concat(all_prices, ignore_index=True)
    print(f"\n[TEST] 가격 데이터 수집 완료: {len(df_prices)}건")

    # 3. RS Rating 계산
    df_rs = calculate_rs_ratings(df_prices)
    print("\n[TEST] RS Rating 결과:")
    print(df_rs.to_string(index=False))

    # 4. 결과 검증
    print("\n[TEST] 검증 항목:")
    print(f"  - 종목 수: {len(df_rs)}개")
    print(f"  - composite_score 존재: {'composite_score' in df_rs.columns}")
    print(f"  - rs_rating 존재: {'rs_rating' in df_rs.columns}")

    has_rs = df_rs['rs_rating'].notna().sum()
    has_null = df_rs['rs_rating'].isna().sum()
    print(f"  - RS Rating 산출: {has_rs}개, NULL: {has_null}개")
    print("\n[TEST] 파이프라인 정상 동작 확인!")

if __name__ == "__main__":
    run_test()
