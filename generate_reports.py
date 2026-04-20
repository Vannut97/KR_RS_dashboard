"""
워치리스트 종목 JSX 보고서 생성 스크립트

claude -p CLI를 subprocess로 호출 (Claude Code 구독 요금제 활용).
"""

import os
import subprocess
import sqlite3
import time
import requests
from datetime import date
from dotenv import load_dotenv

load_dotenv()

DB_NAME        = "quant_dashboard.db"
REPORTS_DIR    = "reports"
SYSTEM_PROMPT  = open("reports/analyzer_prompt.txt", encoding="utf-8").read()


# ==========================================
# 워치리스트 조회 (Supabase REST API)
# ==========================================
def get_watchlist_tickers():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    if not url or not key:
        print("[ERROR] SUPABASE_URL / SUPABASE_KEY 없음")
        return []
    res = requests.get(
        f"{url}/rest/v1/watchlist?select=ticker&order=added_date.desc",
        headers={"apikey": key, "Authorization": f"Bearer {key}"},
        timeout=10,
    )
    return [row["ticker"] for row in res.json()]


# ==========================================
# 이미 생성된 보고서 확인
# ==========================================
def get_existing_reports():
    """report_index 테이블에서 기존 보고서 {ticker: {quarter, ...}} 반환."""
    conn = sqlite3.connect(DB_NAME)
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


# ==========================================
# 최신 분기 정보 조회
# ==========================================
def get_latest_quarter(ticker):
    """DB fundamentals에서 해당 종목의 latest_quarter 반환."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute(
        "SELECT latest_quarter FROM fundamentals WHERE ticker=? "
        "ORDER BY date DESC LIMIT 1",
        (ticker,),
    )
    row = cursor.fetchone()
    conn.close()
    return row[0] if row else "unknown"


# ==========================================
# claude -p CLI 호출로 JSX 생성
# ==========================================
def find_claude():
    """claude 실행 파일 경로 반환 (Windows .cmd 포함)."""
    import shutil
    # Windows npm 전역 설치 경로 우선
    for name in ("claude.cmd", "claude"):
        path = shutil.which(name)
        if path:
            return path
    raise FileNotFoundError("claude CLI를 찾을 수 없습니다. `npm install -g @anthropic-ai/claude-code` 확인 필요")


def generate_jsx(ticker):
    """claude -p CLI를 호출해 JSX 보고서 반환."""
    claude_exe = find_claude()
    cmd = [
        claude_exe,
        "-p", ticker,
        "--system-prompt", SYSTEM_PROMPT,
        "--dangerously-skip-permissions",   # 웹 검색 등 tool 권한 자동 승인
    ]

    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        encoding="utf-8",
        timeout=300,
    )
    if result.returncode != 0:
        raise RuntimeError(f"claude CLI 오류: {result.stderr[:200]}")
    jsx = result.stdout.strip()

    # 마크다운 코드블록이 붙어 나올 경우 제거
    if jsx.startswith("```"):
        lines = jsx.splitlines()
        jsx = "\n".join(
            line for line in lines
            if not line.strip().startswith("```")
        ).strip()

    return jsx


# ==========================================
# 보고서 저장 (파일 + DB 인덱스)
# ==========================================
def save_report(ticker, quarter, jsx):
    today = str(date.today())
    fname = f"{ticker}_{quarter}_{today}.jsx"
    fpath = os.path.join(REPORTS_DIR, fname)

    os.makedirs(REPORTS_DIR, exist_ok=True)
    with open(fpath, "w", encoding="utf-8") as f:
        f.write(jsx)

    # DB report_index 업데이트
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS report_index (
            ticker      TEXT,
            quarter     TEXT,
            report_date TEXT,
            report_path TEXT,
            PRIMARY KEY (ticker, quarter)
        )
    """)
    cursor.execute(
        "INSERT OR REPLACE INTO report_index "
        "(ticker, quarter, report_date, report_path) VALUES (?, ?, ?, ?)",
        (ticker, quarter, today, fpath),
    )
    conn.commit()
    conn.close()
    return fpath


# ==========================================
# 메인
# ==========================================
def main(force=False):
    """
    force=False: 이미 이번 분기 보고서가 있는 종목은 스킵
    force=True : 무조건 전체 재생성
    """
    tickers = get_watchlist_tickers()
    if not tickers:
        print("[ERROR] 워치리스트가 비어 있습니다.")
        return

    existing = get_existing_reports()
    total    = len(tickers)

    print(f"\n[START] 워치리스트 {total}개 종목 보고서 생성 시작")
    print(f"force={force}\n")

    success, skipped, failed = [], [], []

    for i, ticker in enumerate(tickers, 1):
        quarter = get_latest_quarter(ticker)
        prefix  = f"[{i}/{total}] {ticker} ({quarter})"

        # 스킵 판단
        if not force and ticker in existing and quarter in existing[ticker]:
            print(f"{prefix} - 이미 보고서 있음, 스킵")
            skipped.append(ticker)
            continue

        print(f"{prefix} - 생성 중...", end=" ", flush=True)
        try:
            jsx   = generate_jsx(ticker)
            fpath = save_report(ticker, quarter, jsx)
            print(f"OK -> {fpath}")
            success.append(ticker)
        except Exception as e:
            print(f"FAIL: {e}")
            failed.append(ticker)

        # 연속 호출 간격 (rate-limit 방지)
        if i < total:
            time.sleep(3)

    print(f"\n=== 완료 ===")
    print(f"  성공: {len(success)}  {success}")
    print(f"  스킵: {len(skipped)}  {skipped}")
    print(f"  실패: {len(failed)}  {failed}")


if __name__ == "__main__":
    import sys
    force = "--force" in sys.argv
    main(force=force)
