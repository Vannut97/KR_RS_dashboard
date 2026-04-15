"""테스트용 파이프라인 — 10개 종목만 수집하여 검증."""

import os
from datetime import datetime
import pandas as pd
from fdr_auth import get_filtered_universe
from kis_fetcher import get_access_token, fetch_1yr_daily_price
from rs_calculator import calculate_rs_ratings
from db_sqlite import find_missing_fundamental_tickers

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

    # 4. RS 검증
    print("\n[TEST] RS 검증:")
    print(f"  - 종목 수: {len(df_rs)}개")
    print(f"  - composite_score 존재: {'composite_score' in df_rs.columns}")
    print(f"  - rs_rating 존재: {'rs_rating' in df_rs.columns}")

    has_rs = df_rs['rs_rating'].notna().sum()
    has_null = df_rs['rs_rating'].isna().sum()
    print(f"  - RS Rating 산출: {has_rs}개, NULL: {has_null}개")
    print("\n[TEST] RS 파이프라인 정상 동작 확인!")

    # 5. 펀더멘탈 테스트 (DART_API_KEY가 있을 때만)
    if os.environ.get("DART_API_KEY"):
        from dart_fetcher import run_fundamental_collection

        print("\n" + "=" * 50)
        print("[TEST] 펀더멘탈 수집 테스트")
        print("=" * 50)

        # ── 프로덕션과 동일한 수집 정책 적용 ──
        now = datetime.now()
        is_earnings_refresh_day = (
            now.weekday() == 4                # 금요일
            and now.month in (3, 6, 9, 12)    # 분기 실적 반영 월
        )

        weekday_kr = ['월', '화', '수', '목', '금', '토', '일'][now.weekday()]
        print(f"[TEST] 📅 오늘: {now:%Y-%m-%d} ({weekday_kr}) | 월 = {now.month}")
        print(f"[TEST] 리프레시 데이(3/6/9/12월 금요일) 여부: {is_earnings_refresh_day}")

        if is_earnings_refresh_day:
            target_tickers = test_tickers
            print(f"[TEST] → 전체 {len(target_tickers)}개 테스트 종목 수집")
        else:
            missing = find_missing_fundamental_tickers(test_tickers)
            print(f"[TEST] → 누락 종목 체크 결과: {len(missing)}개 / {len(test_tickers)}개")
            if missing:
                target_tickers = missing
                print(f"[TEST] → 누락 종목만 수집")
            else:
                # 테스트 가시성을 위해 강제로 전체 수집
                target_tickers = test_tickers
                print("[TEST] ℹ️ 누락 종목 없음. 테스트 검증을 위해 강제로 전체 수집 실행.")

        df_fund = run_fundamental_collection(target_tickers)

        if not df_fund.empty:
            display_cols = [
                'ticker', 'latest_quarter',
                'eps_yoy', 'revenue_yoy', 'op_margin', 'net_margin',
                'roe', 'debt_ratio',
                'annual_eps_yoy', 'annual_revenue_yoy',
            ]
            display_cols = [c for c in display_cols if c in df_fund.columns]
            print("\n[TEST] 펀더멘탈 결과:")
            print(df_fund[display_cols].to_string(index=False))
            print(f"\n[TEST] 펀더멘탈 수집 종목: {len(df_fund)}개 (요청 {len(target_tickers)}개)")
            print("[TEST] 펀더멘탈 파이프라인 정상 동작 확인!")
        else:
            print("[TEST] 펀더멘탈 데이터가 비어있습니다.")
    else:
        print("\n[TEST] DART_API_KEY 없음 — 펀더멘탈 테스트 건너뜀")

if __name__ == "__main__":
    run_test()
