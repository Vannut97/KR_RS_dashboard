"""OpenDART 펀더멘탈 데이터 수집 모듈

종목당 2~3회 API 호출:
  1. 최신 분기 보고서 (YoY 비교 내장)
  2. 연간 보고서 (2년 추세, ROE/ROA 산출용)
"""

import os
import io
import time
import zipfile
import requests
import pandas as pd
import xml.etree.ElementTree as ET
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
DART_API_KEY = os.environ.get("DART_API_KEY")

BASE_URL = "https://opendart.fss.or.kr/api"

REPRT_CODES = {
    "Q1": "11013",
    "H1": "11012",
    "Q3": "11014",
    "annual": "11011",
}


# ==========================================
# 1. DART 기업코드 매핑
# ==========================================
def download_corp_code_map():
    """ticker(종목코드) → DART corp_code 매핑 다운로드."""
    print("📥 DART 기업코드 매핑 다운로드 중...")
    res = requests.get(
        f"{BASE_URL}/corpCode.xml",
        params={"crtfc_key": DART_API_KEY},
        timeout=30,
    )
    res.raise_for_status()

    with zipfile.ZipFile(io.BytesIO(res.content)) as z:
        xml_data = z.read("CORPCODE.xml")

    root = ET.fromstring(xml_data)
    mapping = {}
    for corp in root.findall("list"):
        stock_code = corp.findtext("stock_code", "").strip()
        corp_code = corp.findtext("corp_code", "").strip()
        if stock_code:
            mapping[stock_code] = corp_code

    print(f"✅ {len(mapping)}개 상장사 코드 매핑 완료\n")
    return mapping


# ==========================================
# 2. API 호출 & 파싱
# ==========================================
def fetch_report(corp_code, year, reprt_code):
    """단일회사 주요계정 1건 조회."""
    params = {
        "crtfc_key": DART_API_KEY,
        "corp_code": corp_code,
        "bsns_year": str(year),
        "reprt_code": reprt_code,
    }
    try:
        res = requests.get(
            f"{BASE_URL}/fnlttSinglAcnt.json", params=params, timeout=10
        )
        data = res.json()
        if data.get("status") == "000":
            return data.get("list", [])
    except Exception:
        pass
    return []


def extract_accounts(items):
    """API 응답에서 주요 계정 추출.

    Returns:
        {'thstrm': {계정: 값}, 'frmtrm': {...}, 'bfefrmtrm': {...}}
        thstrm=당기, frmtrm=전기, bfefrmtrm=전전기
    """
    # 연결재무제표(CFS) 우선, 없으면 개별(OFS)
    cfs = [i for i in items if i.get("fs_div") == "CFS"]
    target = cfs if cfs else items

    def parse_amt(s):
        """금액 문자열 → 정수 변환. 소수점 포함 값(EPS 등)도 처리."""
        if not s:
            return None
        s = s.strip().replace(",", "")
        try:
            return int(s)
        except ValueError:
            try:
                return int(round(float(s)))
            except ValueError:
                return None

    # 계정명 매핑 (다양한 표기 대응)
    keywords = {
        "revenue": ["매출액", "수익(매출액)", "영업수익"],
        "op_profit": ["영업이익", "영업이익(손실)"],
        "net_income": ["당기순이익", "당기순이익(손실)"],
        "total_equity": ["자본총계"],
        "total_assets": ["자산총계"],
        "total_debt": ["부채총계"],
    }

    result = {"thstrm": {}, "frmtrm": {}, "bfefrmtrm": {}}

    for item in target:
        acct = item.get("account_nm", "").strip()

        # 주요 계정
        for key, kw_list in keywords.items():
            if key in result["thstrm"]:
                continue
            if any(kw == acct or kw in acct for kw in kw_list):
                result["thstrm"][key] = parse_amt(item.get("thstrm_amount"))
                result["frmtrm"][key] = parse_amt(item.get("frmtrm_amount"))
                result["bfefrmtrm"][key] = parse_amt(item.get("bfefrmtrm_amount"))
                break

        # EPS (주당순이익) — 다양한 DART 계정명 대응
        # 예: 기본주당이익(손실), 기본주당순이익(손실), 희석주당이익(손실), 주당순이익 등
        if "eps" not in result["thstrm"]:
            is_eps = (
                ("기본주당" in acct and ("이익" in acct or "손실" in acct))
                or ("주당순이익" in acct)
                or (acct == "주당이익(손실)")
                or ("주당" in acct and "순이익" in acct)
            )
            if is_eps:
                result["thstrm"]["eps"] = parse_amt(item.get("thstrm_amount"))
                result["frmtrm"]["eps"] = parse_amt(item.get("frmtrm_amount"))
                result["bfefrmtrm"]["eps"] = parse_amt(item.get("bfefrmtrm_amount"))

    return result


# ==========================================
# 3. 계산 헬퍼
# ==========================================
def pct_growth(curr, prev):
    """성장률 % 계산 (None-safe)."""
    if curr is None or prev is None or prev == 0:
        return None
    return round(((curr - prev) / abs(prev)) * 100, 2)


def pct_margin(part, whole):
    """마진율 % 계산 (None-safe)."""
    if part is None or whole is None or whole == 0:
        return None
    return round((part / whole) * 100, 2)


def safe_ratio(a, b):
    """비율 % 계산 (None-safe)."""
    if a is None or b is None or b == 0:
        return None
    return round((a / b) * 100, 2)


# ==========================================
# 4. 분기 탐색 순서 결정
# ==========================================
def get_quarter_search_order(year):
    """현재 월 기준, 조회 가능한 최신 분기 순서 반환.

    공시 기한: 연간=3월말, Q1=5/15, H1=8/14, Q3=11/14
    """
    month = datetime.now().month

    if month >= 11:
        return [("Q3", year), ("H1", year), ("Q1", year), ("annual", year - 1)]
    elif month >= 8:
        return [("H1", year), ("Q1", year), ("annual", year - 1)]
    elif month >= 5:
        return [("Q1", year), ("annual", year - 1), ("Q3", year - 1)]
    elif month >= 4:
        return [("annual", year - 1), ("Q3", year - 1), ("H1", year - 1)]
    else:
        return [("Q3", year - 1), ("H1", year - 1), ("Q1", year - 1)]


# ==========================================
# 5. 종목 1개 펀더멘탈 수집
# ==========================================
def collect_single_fundamental(ticker, corp_code):
    """종목 1개의 펀더멘탈 지표 수집 & 계산."""
    current_year = datetime.now().year
    result = {"ticker": ticker}

    # ── (A) 최신 분기 보고서 ──
    # API 응답의 frmtrm이 전년 동기이므로 YoY 비교가 내장됨
    q_order = get_quarter_search_order(current_year)
    q_data = None

    for q_name, q_year in q_order:
        items = fetch_report(corp_code, q_year, REPRT_CODES[q_name])
        if items:
            q_data = extract_accounts(items)
            result["latest_quarter"] = f"{q_year}_{q_name}"
            break
        time.sleep(0.1)

    if q_data:
        curr = q_data["thstrm"]
        prev = q_data["frmtrm"]  # 전년 동기 (YoY 비교 대상)

        # 실적 원본
        result["revenue"] = curr.get("revenue")
        result["op_profit"] = curr.get("op_profit")
        result["net_income"] = curr.get("net_income")
        result["eps"] = curr.get("eps")

        # YoY 성장률 (%)
        result["revenue_yoy"] = pct_growth(curr.get("revenue"), prev.get("revenue"))
        result["op_profit_yoy"] = pct_growth(curr.get("op_profit"), prev.get("op_profit"))

        # EPS YoY: EPS 파싱 성공 시 우선 사용, 실패 시 당기순이익 YoY로 fallback
        eps_yoy = pct_growth(curr.get("eps"), prev.get("eps"))
        if eps_yoy is None:
            eps_yoy = pct_growth(curr.get("net_income"), prev.get("net_income"))
        result["eps_yoy"] = eps_yoy

        # 마진율 (%)
        result["op_margin"] = pct_margin(curr.get("op_profit"), curr.get("revenue"))
        result["net_margin"] = pct_margin(curr.get("net_income"), curr.get("revenue"))

        # 마진 YoY 변화 (pp)
        prev_op_margin = pct_margin(prev.get("op_profit"), prev.get("revenue"))
        prev_net_margin = pct_margin(prev.get("net_income"), prev.get("revenue"))

        if result["op_margin"] is not None and prev_op_margin is not None:
            result["op_margin_chg"] = round(result["op_margin"] - prev_op_margin, 2)
        if result["net_margin"] is not None and prev_net_margin is not None:
            result["net_margin_chg"] = round(result["net_margin"] - prev_net_margin, 2)

    # ── (B) 연간 보고서 (2년 추세 + ROE/ROA) ──
    # thstrm=작년, frmtrm=2년전, bfefrmtrm=3년전 → 2년 추세 확보
    annual_items = fetch_report(corp_code, current_year - 1, REPRT_CODES["annual"])
    time.sleep(0.1)

    if annual_items:
        a = extract_accounts(annual_items)
        a_curr = a["thstrm"]  # 작년
        a_prev = a["frmtrm"]  # 2년 전
        a_prev2 = a["bfefrmtrm"]  # 3년 전

        # 연간 성장률
        result["annual_revenue_yoy"] = pct_growth(
            a_curr.get("revenue"), a_prev.get("revenue")
        )
        result["annual_eps_yoy"] = pct_growth(
            a_curr.get("eps"), a_prev.get("eps")
        )

        # 2년 전 → 작년 성장률 (추세 비교용)
        result["annual_revenue_2yr"] = pct_growth(
            a_prev.get("revenue"), a_prev2.get("revenue")
        )
        result["annual_eps_2yr"] = pct_growth(
            a_prev.get("eps"), a_prev2.get("eps")
        )

        # 연간 마진율
        result["annual_op_margin"] = pct_margin(
            a_curr.get("op_profit"), a_curr.get("revenue")
        )
        result["annual_net_margin"] = pct_margin(
            a_curr.get("net_income"), a_curr.get("revenue")
        )

        # ROE / ROA / 부채비율 (연간 기준)
        result["roe"] = safe_ratio(
            a_curr.get("net_income"), a_curr.get("total_equity")
        )
        result["roa"] = safe_ratio(
            a_curr.get("net_income"), a_curr.get("total_assets")
        )
        result["debt_ratio"] = safe_ratio(
            a_curr.get("total_debt"), a_curr.get("total_equity")
        )

    return result


# ==========================================
# 6. 전체 유니버스 배치 수집
# ==========================================
def run_fundamental_collection(tickers):
    """전체 유니버스 펀더멘탈 수집."""
    corp_map = download_corp_code_map()
    total = len(tickers)
    results = []
    skipped = 0

    print(f"📊 총 {total}개 종목 펀더멘탈 수집 시작 (약 5~10분 소요)...")

    for idx, ticker in enumerate(tickers):
        if (idx + 1) % 100 == 0:
            print(f"  진행: [{idx + 1}/{total}]")

        corp_code = corp_map.get(ticker)
        if not corp_code:
            skipped += 1
            continue

        data = collect_single_fundamental(ticker, corp_code)
        results.append(data)

    df = pd.DataFrame(results)
    print(f"\n✅ 펀더멘탈 수집 완료: {len(df)}개 종목 (매핑 실패: {skipped}개)")
    return df


if __name__ == "__main__":
    from fdr_auth import get_filtered_universe

    universe = get_filtered_universe()
    tickers = universe["ticker"].tolist()[:10]  # 테스트: 10개만
    df_fund = run_fundamental_collection(tickers)
    print(df_fund.to_string(index=False))
