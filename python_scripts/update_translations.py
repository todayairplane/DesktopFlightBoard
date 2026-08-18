import json
import re

all_cities = ["Abidjan", "Abu Dhabi", "Akita", "Amami", "Amsterdam", "Anchorage", "Angeles City", "Asahikawa", "Athens", "Atlanta", "Auckland", "Bangkok", "Barcelona", "Beijing", "Belgrade", "Berlin", "Bern", "Bilbao", "Birmingham", "Bogota", "Bologna", "Bordeaux", "Boston", "Brindisi", "Brussels", "Budapest", "Buenos Aires", "Buffalo", "Busan", "Cagliari", "Cebu", "Cheongju", "Chicago", "Cleveland", "Colombo", "Copenhagen", "Daegu", "Dalian", "Dallas", "Delhi", "Denpasar", "Detroit", "Doha", "Dresden", "Dubai", "Dublin", "Dusseldorf", "Florence", "Frankfurt", "Fukuoka", "Funchal", "Fuzhou", "Geneva", "Georgetown", "Gothenburg", "Gran Canaria", "Graz", "Guam", "Guangzhou", "Guatemala City", "Guayaquil", "Hachijojima", "Hakodate", "Hamburg", "Helsinki", "Heraklion", "Hiroshima", "Hong Kong", "Hurghada", "Ibiza", "Indianapolis", "Ishigaki", "Istanbul", "Ithaca", "Iwakuni", "Jacksonville", "Jakarta", "Kagoshima", "Kaohsiung", "Kefalonia", "Kilimanjaro", "Kingston", "Kitakyushu", "Kos", "Kuala Lumpur", "Kumamoto", "Kumejima", "Kushiro", "Lamezia Terme", "Las Vegas", "Lima", "Lisbon", "Ljubljana", "London", "Los Angeles", "Louisville", "Luxembourg", "Madrid", "Malaga", "Manchester", "Manila", "Matsuyama", "Medellin", "Memanbetsu", "Memphis", "Milan", "Misawa", "Miyako", "Miyazaki", "Monbetsu", "Monterrey", "Mumbai", "Munich", "Nagasaki", "Nagoya", "Nakashibetsu", "Nanki Shirahama", "Nankoku", "Naples", "New York", "Nice", "Obihiro", "Ohrid", "Oita", "Okayama", "Okinawa", "Osaka", "Oslo", "Palermo", "Palma de Mallorca", "Panama City", "Paris", "Pisa", "Pittsburgh", "Portland", "Porto", "Prague", "Pristina", "Providence", "Quito", "Raleigh-Durham", "Reykjavik", "Rhodes", "Rio de Janeiro", "Rochester", "Rome", "Sakata", "San Francisco", "San Juan", "San Salvador", "Santiago de los Caballeros", "Santo Domingo", "Sao Paulo", "Sapporo", "Seoul", "Shanghai", "Shannon", "Shenzhen", "Shimojishima", "Singapore", "Sofia", "Split", "Stockholm", "Stuttgart", "Syracuse", "Taipei", "Takamatsu", "Tashkent", "Tel Aviv", "Tenerife", "Thessaloniki", "Tianjin", "Tirana", "Tokushima", "Tokyo", "Tromso", "Ube", "Ulaanbaatar", "Valencia", "Venice", "Vienna", "Wakkanai", "Warsaw", "Washington", "Windsor Locks", "Xiamen", "Yonago", "Zurich"]

translations = {
    # Added Japanese
    "Nanki Shirahama": "南紀白浜", "Nankoku": "南国(高知)", "Sakata": "酒田(庄内)", "Misawa": "三沢", 
    "Abidjan": "アビジャン", "Angeles City": "アンヘレス(クラーク)", "Belgrade": "ベオグラード", 
    "Bern": "ベルン", "Bilbao": "ビルバオ", "Birmingham": "バーミンガム", "Bologna": "ボローニャ", 
    "Bordeaux": "ボルドー", "Brindisi": "ブリンディジ", "Brussels": "ブリュッセル", "Buffalo": "バッファロー", 
    "Cagliari": "カリアリ", "Cheongju": "清州", "Cleveland": "クリーブランド", "Daegu": "大邱", 
    "Delhi": "デリー", "Dresden": "ドレスデン", "Dublin": "ダブリン", "Dusseldorf": "デュッセルドルフ", 
    "Florence": "フィレンツェ", "Funchal": "フンシャル", "Fuzhou": "福州", "Georgetown": "ジョージタウン", 
    "Gothenburg": "ヨーテボリ", "Gran Canaria": "グラン・カナリア", "Graz": "グラーツ", "Guam": "グアム", 
    "Hamburg": "ハンブルク", "Heraklion": "イラクリオン", "Hurghada": "フルガダ", "Ibiza": "イビサ", 
    "Ithaca": "イサカ", "Jacksonville": "ジャクソンビル", "Kefalonia": "ケファロニア", "Kilimanjaro": "キリマンジャロ", 
    "Kingston": "キングストン", "Kos": "コス", "Lamezia Terme": "ラメツィア・テルメ", "Ljubljana": "リュブリャナ", 
    "Louisville": "ルイビル", "Luxembourg": "ルクセンブルク", "Malaga": "マラガ", "Manchester": "マンチェスター", 
    "Memphis": "メンフィス", "Naples": "ナポリ", "Nice": "ニース", "Ohrid": "オフリド", "Palermo": "パレルモ", 
    "Palma de Mallorca": "パルマ・デ・マヨルカ", "Pisa": "ピサ", "Pittsburgh": "ピッツバーグ", "Portland": "ポートランド", 
    "Porto": "ポルト", "Pristina": "プリシュティナ", "Providence": "プロビデンス", "Raleigh-Durham": "ローリー・ダーラム", 
    "Reykjavik": "レイキャビク", "Rhodes": "ロードス", "Rochester": "ロチェスター", "San Juan": "サンフアン", 
    "Santiago de los Caballeros": "サンティアゴ・デ・ロス・カバリェロス", "Santo Domingo": "サントドミンゴ", 
    "Shannon": "シャノン", "Shenzhen": "深圳", "Sofia": "ソフィア", "Split": "スプリト", "Stuttgart": "シュトゥットガルト", 
    "Syracuse": "シラキュース", "Tashkent": "タシュケント", "Tenerife": "テネリフェ", "Thessaloniki": "テッサロニキ", 
    "Tianjin": "天津", "Tirana": "ティラナ", "Tromso": "トロムソ", "Ulaanbaatar": "ウランバートル", 
    "Valencia": "バレンシア", "Venice": "ベネチア", "Windsor Locks": "ウィンザーロックス", "Xiamen": "アモイ"
}

with open('/Users/yuki/Documents/ObsidianRepo/DesktopFlightBoard/renderer.js', 'r') as f:
    js_content = f.read()

# Parse existing translations roughly
existing_keys = []
for m in re.finditer(r'"([^"]+)":\s*"([^"]+)"', js_content):
    existing_keys.append(m.group(1))

missing = []
for c in all_cities:
    if c not in existing_keys and c not in translations:
        missing.append(c)

print(f"Still missing: {missing}")

new_entries = []
for k, v in translations.items():
    if k not in existing_keys:
        new_entries.append(f'  "{k}": "{v}",')

new_entries_str = "\n".join(new_entries)
if new_entries_str:
    # Insert right before the closing brace of cityTranslations
    # Find the end of cityTranslations dictionary
    
    # Simple replace
    js_content = js_content.replace('\n};', f',\n\n  // Auto-added missing translations\n{new_entries_str}\n}};', 1)

    with open('/Users/yuki/Documents/ObsidianRepo/DesktopFlightBoard/renderer.js', 'w') as f:
        f.write(js_content)
    print("Updated renderer.js")
else:
    print("Nothing to add.")
