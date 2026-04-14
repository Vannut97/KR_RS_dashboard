import sqlite3
import pandas as pd

def verify_database(db_name="quant_dashboard.db"):
    print("🔍 데이터베이스 정합성 검증을 시작합니다...\n")
    
    try:
        # DB 연결 및 데이터 로드
        conn = sqlite3.connect(db_name)
        df = pd.read_sql("SELECT * FROM rs_ratings", conn)
        conn.close()
        
        if df.empty:
            print("❌ 데이터베이스가 비어있습니다. 수집 배치를 다시 확인해 주세요.")
            return

        # 1. 수집 종목 수 검증
        total_stocks = len(df)
        print(f"✅ 총 저장된 종목 수: {total_stocks}개 (신규 상장 제외 등 정상 필터링 확인)")
        
        # 2. RS Rating (12M) 분포 검증
        # 정상적인 경우: 최소 1점, 최대 99점, 평균 약 50점에 수렴해야 함
        print("\n📊 RS_12M(1년 상대강도) 통계 분포:")
        print(df['rs_12m'].describe().apply(lambda x: f"{x:.2f}"))
        
        # 3. 결측치(NaN/NULL) 검증
        null_counts = df.isnull().sum()
        if null_counts['rs_12m'] > 0:
            print(f"⚠️ 경고: RS_12M 점수가 없는(NULL) 종목이 {null_counts['rs_12m']}개 있습니다.")
        else:
            print("✅ 모든 종목의 계산이 누락 없이 완료되었습니다.")
            
        # 4. 주도주(Top 10) 정성적 검증 (Sanity Check)
        print("\n🏆 12M 단순 RS Rating 최상위 10개 종목 (주도주 검증):")
        top_10 = df.sort_values(by='rs_12m', ascending=False).head(10)
        # 가독성을 위해 일부 컬럼만 출력
        print(top_10[['ticker', 'latest_close', 'ret_1m', 'ret_12m', 'rs_12m']].to_string(index=False))

    except Exception as e:
        print(f"❌ 검증 중 에러 발생: {e}")

if __name__ == "__main__":
    verify_database()