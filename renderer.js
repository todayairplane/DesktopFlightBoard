const flightListEl = document.getElementById('flight-list');
const template = document.getElementById('flight-row-template');
const airportSelectEl = document.getElementById('airport-select');
const filterSelectEl = document.getElementById('filter-select');
const updateTimeEl = document.getElementById('update-time');

const airportCountries = {
  HND: 'JP',
  ITM: 'JP',
  FUK: 'JP',
  NRT: 'JP',
  JFK: 'US',
  ZRH: 'CH'
};

const cityTranslations = {
  Sapporo: '札幌',
  Chitose: '札幌',
  Asahikawa: '旭川',
  Hakodate: '函館',
  Kushiro: '釧路',
  Obihiro: '帯広',
  Memanbetsu: '女満別',
  Nakashibetsu: '中標津',
  Wakkanai: '稚内',
  Monbetsu: '紋別',
  Aomori: '青森',
  Misawa: '三沢',
  Akita: '秋田',
  Sendai: '仙台',
  Yamagata: '山形',
  Fukushima: '福島',
  Shonai: '庄内',
  Sakata: '庄内',
  'Odate-Noshiro': '大館能代',
  Tokyo: '東京',
  Narita: '東京',
  Hachijojima: '八丈島',
  Niigata: '新潟',
  Toyama: '富山',
  Komatsu: '小松',
  Shizuoka: '静岡',
  Ibaraki: '茨城',
  Nagoya: '名古屋',
  Osaka: '大阪',
  Kobe: '神戸',
  Okayama: '岡山',
  Hiroshima: '広島',
  Iwakuni: '岩国',
  Ube: '山口宇部',
  Yamaguchi: '山口',
  Tottori: '鳥取',
  Yonago: '米子',
  Izumo: '出雲',
  Tokushima: '徳島',
  Takamatsu: '高松',
  Matsuyama: '松山',
  Kochi: '高知',
  Nankoku: '高知',
  Fukuoka: '福岡',
  Kitakyushu: '北九州',
  Saga: '佐賀',
  Nagasaki: '長崎',
  Kumamoto: '熊本',
  Oita: '大分',
  Miyazaki: '宮崎',
  Kagoshima: '鹿児島',
  Okinawa: '那覇',
  Naha: '那覇',
  Ishigaki: '石垣',
  Miyako: '宮古',
  'Miyako-jima': '宮古',
  Shimojishima: '下地島',
  Kumejima: '久米島',
  Yonaguni: '与那国',
  Amami: '奄美',
  'Amami Oshima': '奄美大島',
  Tokunoshima: '徳之島',
  'Nanki Shirahama': '南紀白浜',
  Seoul: 'ソウル',
  Busan: '釜山',
  Jeju: '済州',
  Cheongju: '清州',
  Daegu: '大邱',
  Beijing: '北京',
  Shanghai: '上海',
  Guangzhou: '広州',
  Shenzhen: '深圳',
  Dalian: '大連',
  Qingdao: '青島',
  Tianjin: '天津',
  Xiamen: 'アモイ',
  Fuzhou: '福州',
  'Hong Kong': '香港',
  Macau: 'マカオ',
  Taipei: '台北',
  Kaohsiung: '高雄',
  Manila: 'マニラ',
  Cebu: 'セブ',
  'Angeles City': 'クラーク',
  Bangkok: 'バンコク',
  Singapore: 'シンガポール',
  'Kuala Lumpur': 'クアラルンプール',
  Hanoi: 'ハノイ',
  'Ho Chi Minh City': 'ホーチミン',
  'Da Nang': 'ダナン',
  Jakarta: 'ジャカルタ',
  Denpasar: 'デンパサール',
  Delhi: 'デリー',
  'New Delhi': 'ニューデリー',
  Mumbai: 'ムンバイ',
  Colombo: 'コロンボ',
  Ulaanbaatar: 'ウランバートル',
  Honolulu: 'ホノルル',
  Guam: 'グアム',
  'New York': 'ニューヨーク',
  'Los Angeles': 'ロサンゼルス',
  'San Francisco': 'サンフランシスコ',
  Seattle: 'シアトル',
  Chicago: 'シカゴ',
  Boston: 'ボストン',
  Washington: 'ワシントンD.C.',
  'Washington, D.C.': 'ワシントンD.C.',
  Dallas: 'ダラス',
  'Dallas-Fort Worth': 'ダラス',
  Houston: 'ヒューストン',
  Atlanta: 'アトランタ',
  Detroit: 'デトロイト',
  Miami: 'マイアミ',
  Denver: 'デンバー',
  Orlando: 'オーランド',
  'Las Vegas': 'ラスベガス',
  Portland: 'ポートランド',
  Anchorage: 'アンカレジ',
  Vancouver: 'バンクーバー',
  Toronto: 'トロント',
  Montreal: 'モントリオール',
  'Mexico City': 'メキシコシティ',
  Cancun: 'カンクン',
  London: 'ロンドン',
  Paris: 'パリ',
  Frankfurt: 'フランクフルト',
  Munich: 'ミュンヘン',
  Berlin: 'ベルリン',
  Amsterdam: 'アムステルダム',
  Zurich: 'チューリッヒ',
  Geneva: 'ジュネーブ',
  Rome: 'ローマ',
  Milan: 'ミラノ',
  Madrid: 'マドリード',
  Barcelona: 'バルセロナ',
  Helsinki: 'ヘルシンキ',
  Vienna: 'ウィーン',
  Copenhagen: 'コペンハーゲン',
  Stockholm: 'ストックホルム',
  Oslo: 'オスロ',
  Istanbul: 'イスタンブール',
  Athens: 'アテネ',
  Lisbon: 'リスボン',
  Prague: 'プラハ',
  Budapest: 'ブダペスト',
  Warsaw: 'ワルシャワ',
  Brussels: 'ブリュッセル',
  Dublin: 'ダブリン',
  Manchester: 'マンチェスター',
  Venice: 'ベネチア',
  Naples: 'ナポリ',
  Nice: 'ニース',
  Dubai: 'ドバイ',
  Doha: 'ドーハ',
  'Abu Dhabi': 'アブダビ',
  'Tel Aviv': 'テルアビブ',
  Cairo: 'カイロ',
  Johannesburg: 'ヨハネスブルグ',
  'Cape Town': 'ケープタウン',
  Nairobi: 'ナイロビ',
  Sydney: 'シドニー',
  Melbourne: 'メルボルン',
  Brisbane: 'ブリスベン',
  Perth: 'パース',
  Cairns: 'ケアンズ',
  'Gold Coast': 'ゴールドコースト',
  Auckland: 'オークランド',
  Noumea: 'ヌメア'
};

let currentFlights = [];
let requestSerial = 0;

function unixSecondsToDate(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  const numeric = Number(value);

  if (Number.isFinite(numeric)) {
    return new Date(numeric * 1000);
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

function formatTime(value) {
  const date = value instanceof Date ? value : unixSecondsToDate(value);

  if (!date || Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Tokyo'
  });
}

function setLoading() {
  flightListEl.innerHTML =
    '<div class="flight-row" style="justify-content:center;color:#888;">' +
    'Loading flights...' +
    '</div>';
}

function setError(message) {
  flightListEl.innerHTML =
    '<div class="flight-row" style="justify-content:center;color:#ff7777;">' +
    message +
    '</div>';
}

function getJapaneseCity(englishName) {
  if (!englishName) {
    return '';
  }

  return cityTranslations[englishName] || englishName;
}

function getLogoUrl(airlineCode) {
  if (!airlineCode) {
    return '';
  }

  return 'https://images.kiwi.com/airlines/64/' + airlineCode + '.png';
}

function setLogo(imageElement, airlineCode) {
  if (!imageElement || !airlineCode) {
    if (imageElement) {
      imageElement.style.display = 'none';
    }
    return;
  }

  imageElement.style.display = '';
  imageElement.src = getLogoUrl(airlineCode);

  imageElement.onerror = function () {
    this.style.display = 'none';
  };
}

function extractAirlineCode(flightNumber) {
  if (!flightNumber) {
    return '';
  }

  const match = String(flightNumber).toUpperCase().match(/^([A-Z0-9]{2})/);

  return match ? match[1] : '';
}

function normalizeFlight(flight) {
  return {
    ...flight,
    scheduleDate: unixSecondsToDate(flight.scheduleTime),
    estimatedDate: unixSecondsToDate(flight.estimatedTime)
  };
}

function renderFlights(flights) {
  flightListEl.innerHTML = '';

  if (!Array.isArray(flights) || flights.length === 0) {
    flightListEl.innerHTML =
      '<div class="flight-row" style="justify-content:center;color:#888;">' +
      'No flights available' +
      '</div>';

    return;
  }

  const currentAirportCode = airportSelectEl.value;
  const currentCountry = airportCountries[currentAirportCode];
  const filterMode = filterSelectEl.value;

  const filteredFlights = flights.filter(function (flight) {
    if (filterMode === 'all') {
      return true;
    }

    if (!flight.destinationCountry || !currentCountry) {
      return true;
    }

    const isDomestic =
      flight.destinationCountry === currentCountry;

    if (filterMode === 'domestic') {
      return isDomestic;
    }

    if (filterMode === 'international') {
      return !isDomestic;
    }

    return true;
  });

  if (filteredFlights.length === 0) {
    flightListEl.innerHTML =
      '<div class="flight-row" style="justify-content:center;color:#888;">' +
      'No matching flights' +
      '</div>';

    return;
  }

  filteredFlights.forEach(function (flight) {
    const fragment =
      template.content.cloneNode(true);

    const rowEl =
      fragment.querySelector('.flight-row');

    if (flight.estimatedDate) {
      rowEl.classList.add('has-changed');
    }

    const scheduleEl =
      fragment.querySelector('.schedule-time');

    scheduleEl.textContent =
      formatTime(flight.scheduleDate);

    const estimatedEl =
      fragment.querySelector('.estimated-time');

    estimatedEl.textContent =
      flight.estimatedDate
        ? formatTime(flight.estimatedDate)
        : '';

    const englishCity =
      flight.destination || '';

    const japaneseCity =
      getJapaneseCity(englishCity);

    const iata =
      flight.destinationSub || '';

    const destinationMain =
      fragment.querySelector('.dest-main');

    destinationMain.textContent =
      iata
        ? japaneseCity + ' (' + iata + ')'
        : japaneseCity;

    const destinationSub =
      fragment.querySelector('.dest-sub');

    destinationSub.textContent =
      englishCity && englishCity !== japaneseCity
        ? englishCity
        : '';

    const mainFlightEl =
      fragment.querySelector('.main-flight');

    const mainLogoEl =
      mainFlightEl.querySelector('.airline-logo');

    const mainNumberEl =
      mainFlightEl.querySelector('.flight-number');

    const mainAirlineCode =
      flight.airline && flight.airline.code
        ? String(flight.airline.code).toUpperCase()
        : extractAirlineCode(flight.flightNumber);

    setLogo(
      mainLogoEl,
      mainAirlineCode
    );

    mainNumberEl.textContent =
      flight.flightNumber || '';

    const codeshareFlightEl =
      fragment.querySelector('.codeshare-flight');

    if (flight.codeshareNumber) {
      codeshareFlightEl.style.display =
        'flex';

      const codeshareLogoEl =
        codeshareFlightEl.querySelector('.airline-logo');

      const codeshareNumberEl =
        codeshareFlightEl.querySelector('.flight-number');

      const codeshareCode =
        extractAirlineCode(
          flight.codeshareNumber
        );

      setLogo(
        codeshareLogoEl,
        codeshareCode
      );

      codeshareNumberEl.textContent =
        flight.codeshareNumber;

    } else {
      codeshareFlightEl.style.display =
        'none';
    }

    const terminalEl =
      fragment.querySelector('.terminal-text');

    terminalEl.textContent =
      flight.terminal || '';

    const gateEl =
      fragment.querySelector('.gate-text');

    gateEl.textContent =
      flight.gate || '';

    flightListEl.appendChild(
      fragment
    );
  });

  if (updateTimeEl) {
    updateTimeEl.textContent =
      new Date().toLocaleTimeString(
        'ja-JP',
        {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'Asia/Tokyo'
        }
      );
  }
}

async function fetchDepartures(airportCode) {
  const response =
    await fetch(
      '/api/departures?airport=' +
      encodeURIComponent(airportCode),
      {
        method: 'GET',
        cache: 'no-store',
        headers: {
          Accept: 'application/json'
        }
      }
    );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
      'Flight data fetch failed'
    );
  }

  if (!Array.isArray(data.flights)) {
    return [];
  }

  return data.flights
    .map(normalizeFlight)
    .filter(function (flight) {
      return (
        flight.scheduleDate &&
        !Number.isNaN(
          flight.scheduleDate.getTime()
        )
      );
    })
    .sort(function (a, b) {
      return (
        a.scheduleDate -
        b.scheduleDate
      );
    });
}

async function updateBoard(
  showLoading = false
) {
  const serial =
    ++requestSerial;

  const airportCode =
    airportSelectEl.value;

  if (showLoading) {
    setLoading();
  }

  try {
    const flights =
      await fetchDepartures(
        airportCode
      );

    if (
      serial !==
      requestSerial
    ) {
      return;
    }

    currentFlights =
      flights;

    renderFlights(
      currentFlights
    );

  } catch (error) {
    console.error(
      'Failed to fetch flight data:',
      error
    );

    if (
      serial !==
      requestSerial
    ) {
      return;
    }

    setError(
      'Flight data could not be loaded'
    );
  }
}

airportSelectEl.addEventListener(
  'change',
  async function () {
    try {
      localStorage.setItem(
        'flightBoardAirport',
        airportSelectEl.value
      );
    } catch (error) {
      console.warn(
        'Could not save airport selection'
      );
    }

    currentFlights = [];

    await updateBoard(true);
  }
);

filterSelectEl.addEventListener(
  'change',
  function () {
    try {
      localStorage.setItem(
        'flightBoardFilter',
        filterSelectEl.value
      );
    } catch (error) {
      console.warn(
        'Could not save filter selection'
      );
    }

    renderFlights(
      currentFlights
    );
  }
);

async function init() {
  try {
    const savedAirport =
      localStorage.getItem(
        'flightBoardAirport'
      );

    if (
      savedAirport &&
      airportCountries[savedAirport]
    ) {
      airportSelectEl.value =
        savedAirport;
    }

    const savedFilter =
      localStorage.getItem(
        'flightBoardFilter'
      );

    if (
      savedFilter === 'all' ||
      savedFilter === 'domestic' ||
      savedFilter === 'international'
    ) {
      filterSelectEl.value =
        savedFilter;
    }

  } catch (error) {
    console.warn(
      'Could not restore saved settings'
    );
  }

  await updateBoard(true);

  setInterval(
    function () {
      updateBoard(false);
    },
    600000
  );
}

init();
