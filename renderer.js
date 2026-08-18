const HanedaApiProvider = require('./providers/HanedaApiProvider');

// Initialize the data provider
const provider = new HanedaApiProvider();

// DOM Elements
const flightListEl = document.getElementById('flight-list');
const template = document.getElementById('flight-row-template');
const airportSelectEl = document.getElementById('airport-select');

// City translation dictionary
const cityTranslations = {
  // Japan (Domestic)
  "Sapporo": "札幌",
  "Asahikawa": "旭川",
  "Hakodate": "函館",
  "Aomori": "青森",
  "Akita": "秋田",
  "Sendai": "仙台",
  "Tokyo": "東京",
  "Nagoya": "名古屋",
  "Osaka": "大阪",
  "Kobe": "神戸",
  "Fukuoka": "福岡",
  "Kitakyushu": "北九州",
  "Nagasaki": "長崎",
  "Kumamoto": "熊本",
  "Oita": "大分",
  "Miyazaki": "宮崎",
  "Kagoshima": "鹿児島",
  "Okinawa": "那覇",
  "Naha": "那覇",
  "Ishigaki": "石垣",
  "Miyako": "宮古",
  "Takamatsu": "高松",
  "Matsuyama": "松山",
  "Kochi": "高知",
  "Hiroshima": "広島",
  "Okayama": "岡山",
  "Yamaguchi": "山口",
  "Ube": "宇部",
  "Iwakuni": "岩国",
  "Izumo": "出雲",
  "Matsue": "松江",
  "Tottori": "鳥取",
  "Yonago": "米子",
  "Tokushima": "徳島",
  "Takamatsu": "高松",
  "Matsuyama": "松山",
  "Komatsu": "小松",
  "Toyama": "富山",
  "Niigata": "新潟",
  "Shizuoka": "静岡",
  "Ibaraki": "茨城",
  "Fukushima": "福島",
  "Shonai": "庄内",
  "Odate-Noshiro": "大館能代",
  "Kushiro": "釧路",
  "Obihiro": "帯広",
  "Memanbetsu": "女満別",
  "Nakashibetsu": "中標津",
  "Wakkanai": "稚内",
  "Monbetsu": "紋別",
  "Hachijojima": "八丈島",
  "Amami": "奄美",
  "Amami Oshima": "奄美大島",
  "Tokunoshima": "徳之島",
  "Kumejima": "久米島",
  "Shimojishima": "下地島",
  "Yonaguni": "与那国",

  // Asia
  "Beijing": "北京",
  "Shanghai": "上海",
  "Hong Kong": "香港",
  "Taipei": "台北",
  "Seoul": "ソウル",
  "Busan": "釜山",
  "Jeju": "済州",
  "Manila": "マニラ",
  "Cebu": "セブ",
  "Singapore": "シンガポール",
  "Bangkok": "バンコク",
  "Ho Chi Minh City": "ホーチミン",
  "Hanoi": "ハノイ",
  "Da Nang": "ダナン",
  "Kuala Lumpur": "クアラルンプール",
  "Jakarta": "ジャカルタ",
  "Denpasar": "バリ島 (デンパサール)",
  "New Delhi": "ニューデリー",
  "Mumbai": "ムンバイ",
  "Colombo": "コロンボ",
  "Guangzhou": "広州",
  "Dalian": "大連",
  "Qingdao": "青島",
  "Macau": "マカオ",
  "Kaohsiung": "高雄",
  
  // North America
  "New York": "ニューヨーク",
  "Los Angeles": "ロサンゼルス",
  "San Francisco": "サンフランシスコ",
  "Chicago": "シカゴ",
  "Seattle": "シアトル",
  "Washington": "ワシントンD.C.",
  "Washington, D.C.": "ワシントンD.C.",
  "Honolulu": "ホノルル",
  "Vancouver": "バンクーバー",
  "Toronto": "トロント",
  "Montreal": "モントリオール",
  "Dallas-Fort Worth": "ダラス",
  "Dallas": "ダラス",
  "Houston": "ヒューストン",
  "Atlanta": "アトランタ",
  "Detroit": "デトロイト",
  "Boston": "ボストン",
  "Miami": "マイアミ",
  "Las Vegas": "ラスベガス",
  "Orlando": "オーランド",
  "Denver": "デンバー",
  "Indianapolis": "インディアナポリス",
  "Anchorage": "アンカレジ",
  "Monterrey": "モンテレイ",
  "Mexico City": "メキシコシティ",
  "Cancun": "カンクン",
  
  // Central & South America
  "Panama City": "パナマシティ",
  "San Salvador": "サンサルバドル",
  "Guatemala City": "グアテマラシティ",
  "Bogota": "ボゴタ",
  "Medellin": "メデジン",
  "Quito": "キト",
  "Guayaquil": "グアヤキル",
  "Lima": "リマ",
  "Sao Paulo": "サンパウロ",
  "Rio de Janeiro": "リオデジャネイロ",
  "Buenos Aires": "ブエノスアイレス",
  "Santiago": "サンティアゴ",
  
  // Europe
  "London": "ロンドン",
  "Paris": "パリ",
  "Frankfurt": "フランクフルト",
  "Munich": "ミュンヘン",
  "Berlin": "ベルリン",
  "Amsterdam": "アムステルダム",
  "Zurich": "チューリッヒ",
  "Geneva": "ジュネーブ",
  "Rome": "ローマ",
  "Milan": "ミラノ",
  "Madrid": "マドリード",
  "Barcelona": "バルセロナ",
  "Helsinki": "ヘルシンキ",
  "Vienna": "ウィーン",
  "Copenhagen": "コペンハーゲン",
  "Stockholm": "ストックホルム",
  "Oslo": "オスロ",
  "Istanbul": "イスタンブール",
  "Athens": "アテネ",
  "Lisbon": "リスボン",
  "Prague": "プラハ",
  "Budapest": "ブダペスト",
  "Warsaw": "ワルシャワ",
  
  // Oceania
  "Sydney": "シドニー",
  "Melbourne": "メルボルン",
  "Brisbane": "ブリスベン",
  "Perth": "パース",
  "Auckland": "オークランド",
  "Cairns": "ケアンズ",
  "Gold Coast": "ゴールドコースト",
  "Noumea": "ヌメア",
  
  // Middle East & Africa
  "Dubai": "ドバイ",
  "Doha": "ドーハ",
  "Abu Dhabi": "アブダビ",
  "Tel Aviv": "テルアビブ",
  "Cairo": "カイロ",
  "Johannesburg": "ヨハネスブルグ",
  "Cape Town": "ケープタウン",
  "Nairobi": "ナイロビ",

  // Auto-added missing translations
  "Nanki Shirahama": "南紀白浜",
  "Nankoku": "南国(高知)",
  "Sakata": "酒田(庄内)",
  "Misawa": "三沢",
  "Abidjan": "アビジャン",
  "Angeles City": "アンヘレス(クラーク)",
  "Belgrade": "ベオグラード",
  "Bern": "ベルン",
  "Bilbao": "ビルバオ",
  "Birmingham": "バーミンガム",
  "Bologna": "ボローニャ",
  "Bordeaux": "ボルドー",
  "Brindisi": "ブリンディジ",
  "Brussels": "ブリュッセル",
  "Buffalo": "バッファロー",
  "Cagliari": "カリアリ",
  "Cheongju": "清州",
  "Cleveland": "クリーブランド",
  "Daegu": "大邱",
  "Delhi": "デリー",
  "Dresden": "ドレスデン",
  "Dublin": "ダブリン",
  "Dusseldorf": "デュッセルドルフ",
  "Florence": "フィレンツェ",
  "Funchal": "フンシャル",
  "Fuzhou": "福州",
  "Georgetown": "ジョージタウン",
  "Gothenburg": "ヨーテボリ",
  "Gran Canaria": "グラン・カナリア",
  "Graz": "グラーツ",
  "Guam": "グアム",
  "Hamburg": "ハンブルク",
  "Heraklion": "イラクリオン",
  "Hurghada": "フルガダ",
  "Ibiza": "イビサ",
  "Ithaca": "イサカ",
  "Jacksonville": "ジャクソンビル",
  "Kefalonia": "ケファロニア",
  "Kilimanjaro": "キリマンジャロ",
  "Kingston": "キングストン",
  "Kos": "コス",
  "Lamezia Terme": "ラメツィア・テルメ",
  "Ljubljana": "リュブリャナ",
  "Louisville": "ルイビル",
  "Luxembourg": "ルクセンブルク",
  "Malaga": "マラガ",
  "Manchester": "マンチェスター",
  "Memphis": "メンフィス",
  "Naples": "ナポリ",
  "Nice": "ニース",
  "Ohrid": "オフリド",
  "Palermo": "パレルモ",
  "Palma de Mallorca": "パルマ・デ・マヨルカ",
  "Pisa": "ピサ",
  "Pittsburgh": "ピッツバーグ",
  "Portland": "ポートランド",
  "Porto": "ポルト",
  "Pristina": "プリシュティナ",
  "Providence": "プロビデンス",
  "Raleigh-Durham": "ローリー・ダーラム",
  "Reykjavik": "レイキャビク",
  "Rhodes": "ロードス",
  "Rochester": "ロチェスター",
  "San Juan": "サンフアン",
  "Santiago de los Caballeros": "サンティアゴ・デ・ロス・カバリェロス",
  "Santo Domingo": "サントドミンゴ",
  "Shannon": "シャノン",
  "Shenzhen": "深圳",
  "Sofia": "ソフィア",
  "Split": "スプリト",
  "Stuttgart": "シュトゥットガルト",
  "Syracuse": "シラキュース",
  "Tashkent": "タシュケント",
  "Tenerife": "テネリフェ",
  "Thessaloniki": "テッサロニキ",
  "Tianjin": "天津",
  "Tirana": "ティラナ",
  "Tromso": "トロムソ",
  "Ulaanbaatar": "ウランバートル",
  "Valencia": "バレンシア",
  "Venice": "ベネチア",
  "Windsor Locks": "ウィンザーロックス",
  "Xiamen": "アモイ",
};

/**
 * Format Date object to HH:mm string
 */
function formatTime(date) {
  if (!date) return '';
  return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false });
}

/**
 * Render flights to the DOM
 */
function renderFlights(flights) {
  // Clear current list
  flightListEl.innerHTML = '';

  flights.forEach(flight => {
    // Clone template
    const clone = template.content.cloneNode(true);
    const rowEl = clone.querySelector('.flight-row');

    // Add yellow dot indicator class if changed
    if (flight.estimatedTime) {
      rowEl.classList.add('has-changed');
    }

    // Schedule Time
    clone.querySelector('.schedule-time').textContent = formatTime(flight.scheduleTime);
    
    // Estimated Time
    const estTimeEl = clone.querySelector('.estimated-time');
    if (flight.estimatedTime) {
      estTimeEl.textContent = formatTime(flight.estimatedTime);
    }

    // Destination (Translate and add IATA code)
    const enCity = flight.destination;
    const jaCity = cityTranslations[enCity] || enCity;
    const iataCode = flight.destinationSub;
    
    clone.querySelector('.dest-main').textContent = `${jaCity} (${iataCode})`;
    clone.querySelector('.dest-sub').textContent = enCity !== jaCity ? enCity : '';

    // Main Airline & Flight
    const mainFlightEl = clone.querySelector('.main-flight');
    const mainLogoEl = mainFlightEl.querySelector('.airline-logo');
    if (flight.airline.code) {
      mainLogoEl.src = `https://images.kiwi.com/airlines/64/${flight.airline.code}.png`;
      // Error fallback if logo is missing
      mainLogoEl.onerror = () => { mainLogoEl.style.display = 'none'; };
    } else {
      mainLogoEl.style.display = 'none';
    }

    mainFlightEl.querySelector('.flight-number').textContent = flight.flightNumber || '';

    // Codeshare Airline & Flight (if any)
    if (flight.codeshareAirline) {
      const codeshareFlightEl = clone.querySelector('.codeshare-flight');
      codeshareFlightEl.style.display = 'flex';
      
      const codeshareLogoEl = codeshareFlightEl.querySelector('.airline-logo');
      if (flight.codeshareAirline.code) {
        codeshareLogoEl.src = `https://images.kiwi.com/airlines/64/${flight.codeshareAirline.code}.png`;
        codeshareLogoEl.onerror = () => { codeshareLogoEl.style.display = 'none'; };
      } else {
        codeshareLogoEl.style.display = 'none';
      }

      codeshareFlightEl.querySelector('.flight-number').textContent = flight.codeshareNumber || '';
    }

    // Terminal
    clone.querySelector('.terminal-text').textContent = flight.terminal;

    // Gate
    clone.querySelector('.gate-text').textContent = flight.gate;

    // Append to list
    flightListEl.appendChild(clone);
  });
}

/**
 * Main update loop
 */
async function updateBoard() {
  try {
    const flights = await provider.fetchDepartures();
    renderFlights(flights);
  } catch (error) {
    console.error('Failed to fetch flight data:', error);
  }
}

// Handle airport selection change
airportSelectEl.addEventListener('change', (e) => {
  const selectedAirport = e.target.value;
  provider.setAirport(selectedAirport);
  
  // Clear the board immediately for feedback
  flightListEl.innerHTML = '<div style="padding: 20px;">Loading...</div>';
  
  // Fetch new data
  updateBoard();
});

// Initialization
async function init() {
  // Sync the initial value of select with provider
  provider.setAirport(airportSelectEl.value);
  await provider.init();
  updateBoard();
  
  // Update board every 1 minute since FR24 data doesn't change every second
  setInterval(updateBoard, 60000);
}

init();
