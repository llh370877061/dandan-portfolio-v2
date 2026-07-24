#!/usr/bin/env python3
"""
马踏飞燕 · 板块卡片页截图导出工具
将7个板块HTML导出为长图（PNG）和PDF

使用方法：
  1. 安装依赖：pip3 install playwright && playwright install chromium
  2. 运行：python3 export_cards.py

导出文件保存在 ~/Her工作间/马踏飞燕/cards/ 目录下
"""

import os
import subprocess
import sys
from pathlib import Path

CARDS_DIR = Path.home() / "Her工作间" / "马踏飞燕" / "cards"
OUTPUT_DIR = CARDS_DIR / "export"

PAGES = [
    ("1-transport.html", "交通全览"),
    ("2-scenic.html", "景点分布"),
    ("3-compare.html", "热门vs小众"),
    ("4-culture.html", "人文特色"),
    ("5-nature.html", "自然风光"),
    ("6-food.html", "特色美食"),
    ("7-routes.html", "经典线路"),
]

def ensure_deps():
    try:
        from playwright.sync_api import sync_playwright
        return True
    except ImportError:
        print("正在安装 playwright...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "playwright", "-q"])
        subprocess.check_call([sys.executable, "-m", "playwright", "install", "chromium"])
        return True

def export():
    from playwright.sync_api import sync_playwright

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch()

        for filename, title in PAGES:
            filepath = CARDS_DIR / filename
            if not filepath.exists():
                print(f"  ⚠️ 未找到 {filename}，跳过")
                continue

            url = filepath.as_uri()
            page = browser.new_page(viewport={"width": 800, "height": 600})
            page.goto(url, wait_until="networkidle")
            page.wait_for_timeout(1000)  # 等待字体加载

            # 导出PNG长图
            png_path = OUTPUT_DIR / f"{filename.replace('.html', '.png')}"
            page.screenshot(path=str(png_path), full_page=True)
            print(f"  ✅ PNG: {png_path.name}")

            # 导出PDF
            pdf_path = OUTPUT_DIR / f"{filename.replace('.html', '.pdf')}"
            page.pdf(
                path=str(pdf_path),
                format="A4",
                print_background=True,
                margin={"top": "10mm", "bottom": "10mm", "left": "10mm", "right": "10mm"}
            )
            print(f"  ✅ PDF: {pdf_path.name}")

            page.close()

        browser.close()

    print(f"\n🎉 全部导出完成！文件在：{OUTPUT_DIR}")

def open_in_browser():
    """不安装依赖时，用浏览器逐个打开页面供手动截图"""
    print("📦 打开浏览器逐页查看，可手动 Cmd+Shift+4 截图或 Cmd+P 导出PDF：\n")
    for filename, title in PAGES:
        filepath = CARDS_DIR / filename
        if filepath.exists():
            print(f"  📄 {title}: {filepath}")
            subprocess.run(["open", str(filepath)])

if __name__ == "__main__":
    if "--browser" in sys.argv:
        open_in_browser()
    else:
        print("🚀 马踏飞燕 · 板块卡片导出工具\n")
        if ensure_deps():
            export()
