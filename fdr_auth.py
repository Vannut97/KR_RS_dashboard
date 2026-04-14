import FinanceDataReader as fdr
import pandas as pd

def get_filtered_universe():
    print("Step 1: KRX 종목 리스트 수집 중...")
    
    # 1. KRX 전체 종목 리스팅
    df_krx = fdr.StockListing('KRX')
    
    # 컬럼명 유연성 확보
    marcap_col = 'Marcap' if 'Marcap' in df_krx.columns else 'MarCap'
    if marcap_col not in df_krx.columns and '시가총액' in df_krx.columns:
        marcap_col = '시가총액'
        
    # 2. 시장 및 보통주 필터링
    # 종목코드 6자리 (기본적인 보통주/우선주 형태)
    df = df_krx[df_krx['Code'].str.len() == 6].copy()
    # KOSPI, KOSDAQ 시장만 추출
    df = df[df['Market'].isin(['KOSPI', 'KOSDAQ'])]
    
    # [추가됨] 종목명 끝이 '우', '우B' 등으로 끝나는 우선주 및 스팩(SPAC) 제외
    df = df[~df['Name'].str.contains(r'우[A-Z]?$|우\(전환\)$|스팩', regex=True)]
    
    # 3. 가격 및 시가총액 조건 필터링
    df = df[df['Close'] >= 1000] # 동전주 제외
    df = df[df[marcap_col] >= 50_000_000_000] # 시가총액 500억 이상
    
    # 4. 불필요한 컬럼 제거 및 이름 정리 (가장 마지막에 수행)
    df = df[['Code', 'Name', 'Market', 'Close', marcap_col]]
    df.columns = ['ticker', 'name', 'market', 'close', 'market_cap']
    
    print(f"필터링 완료: 총 {len(df)}개 종목 추출됨.")
    return df

if __name__ == "__main__":
    universe = get_filtered_universe()
    print("\n[샘플 데이터 5건]")
    print(universe.head())
    
    print("\n[시장별 종목 수]")
    print(universe['market'].value_counts())