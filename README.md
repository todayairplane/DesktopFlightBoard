# Desktop Flight Board

*(日本語の説明は下部にあります / Japanese translation is available below)*

A beautiful, frameless desktop widget built with Electron and Python that displays real-time airport departure information using the FlightRadar24 API (Application Programming Interface).

![Desktop Flight Board Screenshot](screenshot.png)

## Features
- **Premium UI:** Dark theme, frameless, and transparent background. Matches the aesthetics of modern airport information boards.
- **Real-time Data:** Fetches live flight data using `FlightRadarAPI`.
- **Airline Logos:** Automatically displays official airline logos using Kiwi.com CDN (Content Delivery Network).
- **Multi-Airport Support:** Easily switch between Haneda (HND), Narita (NRT), JFK, and Zurich (ZRH) from the settings menu.
- **Multilingual Support:** Translates major cities to Japanese automatically.
- **Scrollable:** Scroll through flights seamlessly when there are many departures.

## Prerequisites
- Node.js
- Python 3

## Installation

1. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

2. **Set up Python environment (Required):**
   This application relies on a Python script to fetch flight data. It assumes a virtual environment (`venv`) exists in the project root.
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```

## Usage

Start the Electron application:
```bash
npm start
```

## How to Customize
- **Add more airports:** You can add more airports to the dropdown menu in `index.html`.
- **Add city translations:** Expand the `cityTranslations` dictionary in `renderer.js` to translate more cities to your local language.
- **Change update frequency:** Modify the `setInterval` in `renderer.js` (default is 60,000ms / 1 minute).

## Note
This project uses the unofficial `FlightRadarAPI` (v1.5.3) for educational purposes. Please respect FlightRadar24's terms of service and do not spam the API with excessively frequent requests.

## Disclaimer
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

# Desktop Flight Board (日本語)

ElectronとPythonで構築された、FlightRadar24 API (Application Programming Interface) を使用して空港のリアルタイム出発情報を表示する、美しくフレームレスなデスクトップウィジェットです。

## 特徴
- **プレミアムなUI:** ダークテーマ、フレームレス、透過背景を採用。現代の空港の電光掲示板の美しさを再現しています。
- **リアルタイムデータ:** `FlightRadarAPI` を使用してライブフライトデータを取得します。
- **航空会社ロゴ:** Kiwi.com CDN (Content Delivery Network) を利用して、公式の航空会社ロゴを自動で表示します。
- **複数空港対応:** 設定メニューから、羽田(HND)、成田(NRT)、JFK、チューリッヒ(ZRH)を簡単に切り替えられます。
- **多言語・日本語対応:** 主要な海外都市および国内都市の行先を自動的に日本語へ変換して表示します。
- **スクロール可能:** 出発便が多い場合でも、シームレスにスクロールして一覧を確認できます。

## 前提条件
- Node.js
- Python 3

## インストール方法

1. **Node.jsの依存関係をインストール:**
   ```bash
   npm install
   ```

2. **Python環境のセットアップ (必須):**
   このアプリはデータ取得にPythonスクリプトを使用します。プロジェクトルートに仮想環境 `venv` を作成してください。
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # Windowsの場合は `venv\Scripts\activate`
   pip install -r requirements.txt
   ```

## 使い方

Electronアプリを起動します:
```bash
npm start
```

## カスタマイズ方法
- **空港の追加:** `index.html` のドロップダウンメニューにオプションを追記することで空港を追加できます。
- **都市名翻訳の追加:** `renderer.js` 内の `cityTranslations` 辞書を拡張することで、より多くの都市を日本語化できます。
- **更新頻度の変更:** `renderer.js` 内の `setInterval` の数値を変更することで更新頻度を調整できます（デフォルトは60,000ms＝1分です）。

## 注意事項
このプロジェクトは教育目的で非公式の `FlightRadarAPI` (v1.5.3) を使用しています。FlightRadar24の利用規約を尊重し、過剰な頻度でのAPIリクエスト（スパム行為）は行わないでください。

## 免責事項
本ソフトウェアは「現状のまま」で、明示であるか暗黙であるかを問わず、何らの保証もなく提供されます。ここでいう保証とは、商品性、特定の目的への適合性、および権利非侵害についての保証も含みますが、それに限定されるものではありません。作者または著作権者は、契約行為、不法行為、またはそれ以外であろうと、ソフトウェアに起因または関連し、あるいはソフトウェアの使用またはその他の扱いによって生じる一切の請求、損害、その他の義務について何らの責任も負わないものとします。

<!--
※免責事項の出典: Open Source Initiative (OSI) - The MIT License
https://opensource.org/licenses/MIT
-->
