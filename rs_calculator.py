import pandas as pd
import numpy as np
from kis_fetcher import run_batch_collection
from fdr_auth import get_filtered_universe

# ==========================================
# IBD 방식 가중치 (윌리엄 오닐 스타일)
# ==========================================
IBD_WEIGHTS = {
    '1M': 0.4,
    '3M': 0.2,
    '6M': 0.2,
    '12M': 0.2,
}

def calculate_rs_ratings(df_prices):
    print("\n📈 IBD 방식 RS Rating 계산 시작...")

    # 데이터 정렬 (종목별, 날짜 과거->현재 순)
    df = df_prices.sort_values(['ticker', 'date']).reset_index(drop=True)

    results = []

    # 영업일 기준 Look-back 기간 설정
    windows = {
        '1D': 1,
        '1W': 5,
        '1M': 20,
        '3M': 60,
        '6M': 120,
        '12M': 250,
    }

    for ticker, group in df.groupby('ticker'):
        group = group.reset_index(drop=True)
        current_close = group.iloc[-1]['close']

        # 10일 평균 거래량 계산
        last_10     = group.tail(10)
        avg_vol_10d = int(last_10['volume'].mean()) if len(last_10) > 0 else None

        stock_data = {
            'ticker':       ticker,
            'latest_close': current_close,
            'avg_vol_10d':  avg_vol_10d,
        }

        # 기간별 수익률 산출 — 데이터 부족 시 None(NULL)
        for period, days in windows.items():
            if len(group) > days:
                past_close = group.iloc[-(days + 1)]['close']
                stock_data[f'ret_{period}'] = (current_close - past_close) / past_close
            else:
                stock_data[f'ret_{period}'] = None

        results.append(stock_data)

    res_df = pd.DataFrame(results)

    if res_df.empty:
        print("계산 가능한 데이터가 부족합니다.")
        return res_df

    # 시가총액 병합 (fdr_auth 유니버스에서 가져옴, 억원 단위)
    universe_df = get_filtered_universe()
    cap_map = universe_df.set_index('ticker')['market_cap']
    res_df['market_cap'] = res_df['ticker'].map(cap_map)
    res_df['market_cap'] = (res_df['market_cap'] / 1e8).round(0)  # 원 → 억원

    # ------------------------------------------
    # 1. 기간별 개별 RS Rating (1~99점)
    #    → 해당 기간 데이터가 있는 종목만 모집단에 포함
    # ------------------------------------------
    for period in windows.keys():
        col_ret = f'ret_{period}'
        col_rs = f'RS_{period}'
        mask = res_df[col_ret].notna()
        res_df[col_rs] = np.nan
        if mask.sum() > 0:
            res_df.loc[mask, col_rs] = (
                res_df.loc[mask, col_ret].rank(pct=True) * 98 + 1
            ).round().astype(int)

    # ------------------------------------------
    # 2. IBD 복합점수 & RS Rating
    #    → 4개 기간(1M,3M,6M,12M) 모두 있는 종목만 모집단
    # ------------------------------------------
    ibd_periods = ['ret_1M', 'ret_3M', 'ret_6M', 'ret_12M']
    ibd_mask = res_df[ibd_periods].notna().all(axis=1)

    res_df['composite_score'] = np.nan
    res_df['rs_rating'] = np.nan

    if ibd_mask.sum() > 0:
        res_df.loc[ibd_mask, 'composite_score'] = (
            res_df.loc[ibd_mask, 'ret_12M'] * IBD_WEIGHTS['12M']
            + res_df.loc[ibd_mask, 'ret_6M'] * IBD_WEIGHTS['6M']
            + res_df.loc[ibd_mask, 'ret_3M'] * IBD_WEIGHTS['3M']
            + res_df.loc[ibd_mask, 'ret_1M'] * IBD_WEIGHTS['1M']
        )
        res_df.loc[ibd_mask, 'rs_rating'] = (
            res_df.loc[ibd_mask, 'composite_score'].rank(pct=True) * 98 + 1
        ).round().astype(int)

    # 정렬: IBD RS Rating 높은 순 (NULL은 하단)
    res_df = res_df.sort_values('rs_rating', ascending=False).reset_index(drop=True)

    # 수익률 컬럼을 %로 변환하여 가독성 향상
    for period in windows.keys():
        col = f'ret_{period}'
        res_df[col] = res_df[col].apply(
            lambda x: f'{x * 100:.2f}%' if pd.notna(x) else x
        )

    # composite_score도 % 변환
    res_df['composite_score'] = res_df['composite_score'].apply(
        lambda x: f'{x * 100:.2f}%' if pd.notna(x) else x
    )

    total = len(res_df)
    ibd_count = ibd_mask.sum()
    ipo_count = total - ibd_count
    print(f"✅ IBD RS Rating 계산 완료!")
    print(f"   - 전체 종목: {total}개")
    print(f"   - RS Rating 산출: {ibd_count}개")
    print(f"   - 신규상장(일부 기간 NULL): {ipo_count}개\n")

    return res_df

if __name__ == "__main__":
    df_prices = run_batch_collection()
    if df_prices is not None and not df_prices.empty:
        final_rs_table = calculate_rs_ratings(df_prices)
        print(final_rs_table.head(10).to_string(index=False))
