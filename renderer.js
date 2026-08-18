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
  "Izumo": "出雲",
  "Komatsu": "小松",
  "Toyama": "富山",
  "Niigata": "新潟",

  // Asia
  "Beijing": "北京",
  "Shanghai": "上海",
  "Hong Kong": "香港",
  "Taipei": "台北",
  "Seoul": "ソウル",
  "Busan": "釜山",
  "Manila": "マニラ",
  "Singapore": "シンガポール",
  "Bangkok": "バンコク",
  "Ho Chi Minh City": "ホーチミン",
  "Hanoi": "ハノイ",
  "Kuala Lumpur": "クアラルンプール",
  "Jakarta": "ジャカルタ",
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
  "Dallas-Fort Worth": "ダラス",
  "Dallas": "ダラス",
  "Houston": "ヒューストン",
  "Atlanta": "アトランタ",
  "Detroit": "デトロイト",
  
  // Europe
  "London": "ロンドン",
  "Paris": "パリ",
  "Frankfurt": "フランクフルト",
  "Munich": "ミュンヘン",
  "Amsterdam": "アムステルダム",
  "Zurich": "チューリッヒ",
  "Rome": "ローマ",
  "Milan": "ミラノ",
  "Madrid": "マドリード",
  "Helsinki": "ヘルシンキ",
  "Vienna": "ウィーン",
  "Copenhagen": "コペンハーゲン",
  "Istanbul": "イスタンブール",
  
  // Oceania
  "Sydney": "シドニー",
  "Melbourne": "メルボルン",
  "Brisbane": "ブリスベン",
  "Auckland": "オークランド",
  "Cairns": "ケアンズ",
  "Gold Coast": "ゴールドコースト",
  
  // Middle East & Africa
  "Dubai": "ドバイ",
  "Doha": "ドーハ",
  "Abu Dhabi": "アブダビ",
  "Tel Aviv": "テルアビブ",
  "Cairo": "カイロ"
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
