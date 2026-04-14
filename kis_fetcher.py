import os
import time
import requests
import pandas as pd
from datetime import datetime, timedelta
from dotenv import load_dotenv  # 환경변수 로드
from fdr_auth import get_filtered_universe

# ==========================================
# 1. 환경 설정 및 API Key 세팅 (.env 로드)
# ==========================================
# .env 파일에 있는 변수들을 OS 환경변수로 불러옵니다.
load_dotenv() 

APP_KEY = os.environ.get("KIS_APP_KEY")
APP_SECRET = os.environ.get("KIS_APP_SECRET")

# 키 누락 방지용 안전 장치
if not APP_KEY or not APP_SECRET:
    raise ValueError("❌ KIS API 키가 없습니다. .env 파일을 확인해 주세요.")

BASE_URL = "https://openapi.koreainvestment.com:9443"

# ==========================================
# 2. 접근 토큰 (Access Token) 발급
# ==========================================
def get_access_token():
    print("🔑 KIS API Access Token 발급 요청 중...")
    url = f"{BASE_URL}/oauth2/tokenP"
    headers = {"content-type": "application/json"}
    body = {
        "grant_type": "client_credentials",
        "appkey": APP_KEY,
        "appsecret": APP_SECRET
    }
    
    res = requests.post(url, headers=headers, json=body)
    res.raise_for_status()
    
    token = res.json()["access_token"]
    print("✅ 토큰 발급 완료.\n")
    return token

# ==========================================
# 3. 1년(12M) 시계열 가격 데이터 수집 (Pagination & Retry 적용)
# ==========================================
def fetch_1yr_daily_price(ticker, access_token):
    url = f"{BASE_URL}/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice"
    headers = {
        "content-type": "application/json; charset=utf-8",
        "authorization": f"Bearer {access_token}",
        "appkey": APP_KEY,
        "appsecret": APP_SECRET,
        "tr_id": "FHKST03010100",
        "custtype": "P"
    }
    
    all_dfs = []
    current_end_dt = datetime.now()
    
    for _ in range(3):
        start_dt = current_end_dt - timedelta(days=130)
        params = {
            "FID_COND_MRKT_DIV_CODE": "J",
            "FID_INPUT_ISCD": ticker,
            "FID_INPUT_DATE_1": start_dt.strftime("%Y%m%d"),
            "FID_INPUT_DATE_2": current_end_dt.strftime("%Y%m%d"),
            "FID_PERIOD_DIV_CODE": "D",
            "FID_ORG_ADJ_PRC": "0" 
        }

        # 🚨 [핵심] 네트워크 에러 방어를 위한 자동 재시도 로직
        success = False
        max_retries = 3
        
        for attempt in range(max_retries):
            try:
                # timeout=10을 주어 서버가 무응답일 때 무한 대기하는 현상 방지
                res = requests.get(url, headers=headers, params=params, timeout=10)
                
                if res.status_code == 200 and res.json()['rt_cd'] == '0':
                    df = pd.DataFrame(res.json()['output2'])
                    if not df.empty:
                        df = df[['stck_bsop_date', 'stck_clpr', 'acml_vol']].copy()
                        all_dfs.append(df)
                        
                        oldest_date_str = df['stck_bsop_date'].min()
                        current_end_dt = datetime.strptime(oldest_date_str, "%Y%m%d") - timedelta(days=1)
                
                # 에러 없이 코드가 여기까지 도달했다면 성공으로 간주하고 재시도 루프 탈출
                success = True
                break 
                
            except requests.exceptions.RequestException as e:
                # ConnectionError, Timeout 등이 발생하면 이 블록이 실행됨
                print(f"\n⚠️ 통신 지연 발생 [{ticker}] - {attempt+1}차 재시도 중... (2초 대기)")
                time.sleep(2) # 2초간 쿨타임 후 다시 시도
                
        if not success:
            print(f"\n❌ [{ticker}] 3회 재시도 실패로 건너뜁니다.")
        
        # 정상적인 경우 초당 API 호출 제한 방어용 딜레이
        time.sleep(0.08) 
        
    if all_dfs:
        final_df = pd.concat(all_dfs, ignore_index=True)
        final_df.columns = ['date', 'close', 'volume']
        final_df['close'] = pd.to_numeric(final_df['close'])
        final_df['volume'] = pd.to_numeric(final_df['volume'])
        final_df['ticker'] = ticker
        
        final_df = final_df.drop_duplicates('date').sort_values('date').reset_index(drop=True)
        return final_df
    
    return pd.DataFrame()

# ==========================================
# 4. 전체 유니버스 배치 수집
# ==========================================
def run_batch_collection():
    universe_df = get_filtered_universe()
    tickers = universe_df['ticker'].tolist()
    token = get_access_token()
    all_prices = []
    
    # 🚨 전체 종목 수집으로 변경 (tickers[:5] 제한 해제)
    # 테스트를 계속 원하시면 아래를 test_tickers = tickers[:5] 로 유지하세요.
    target_tickers = tickers 
    total_count = len(target_tickers)
    
    print(f"📊 총 {total_count}개 종목 1년 치 가격 데이터 수집 시작 (약 10~15분 소요 예상)...")
    
    for idx, ticker in enumerate(target_tickers):
        if (idx + 1) % 50 == 0:
            print(f"진행 상황: [{idx+1}/{total_count}] 완료...")
            
        df_price = fetch_1yr_daily_price(ticker, token)
        if not df_price.empty:
            all_prices.append(df_price)

    if all_prices:
        final_df = pd.concat(all_prices, ignore_index=True)
        print("\n✅ 전체 수집 완료!")
        return final_df
    else:
        return None

if __name__ == "__main__":
    run_batch_collection()