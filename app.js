/**
 * =============================================================================
 * CYBER TERMINAL NEON - STOCK MARKET PORTFOLIO TRACKER ENGINE (v4.8.2-PROD)
 * High-Frequency Algorithmic Architecture & Quantitative Telemetry Studio
 * =============================================================================
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // CURRENCY CONVERSION ENGINE
  // ---------------------------------------------------------------------------
  const CURRENCIES = {
    USD: { symbol: '$', rate: 1.0, decimals: 2 },
    EUR: { symbol: '€', rate: 0.92, decimals: 2 },
    GBP: { symbol: '£', rate: 0.78, decimals: 2 },
    JPY: { symbol: '¥', rate: 154.20, decimals: 0 },
    BTC: { symbol: '₿', rate: 0.0000109, decimals: 6 }
  };
  let activeCurrency = 'USD';

  function formatMoney(num, decimals = null) {
    if (isNaN(num)) return '$0.00';
    const curr = CURRENCIES[activeCurrency] || CURRENCIES.USD;
    const converted = num * curr.rate;
    const dec = decimals !== null ? decimals : curr.decimals;
    return curr.symbol + Number(converted).toLocaleString('en-US', {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec
    });
  }

  function formatPct(num) {
    if (isNaN(num)) return '0.00%';
    const sign = num > 0 ? '+' : '';
    return sign + Number(num).toFixed(2) + '%';
  }

  function formatNumber(num, decimals = 0) {
    if (isNaN(num)) return '0';
    return Number(num).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  // ---------------------------------------------------------------------------
  // AUDIO SYNTHESIZER (Web Audio API Cyberpunk Telemetry Feedback)
  // ---------------------------------------------------------------------------
  const AudioFX = {
    ctx: null,
    enabled: true,

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        try {
          this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
          console.warn('Web Audio not supported');
        }
      }
    },

    beep(freq, duration, type = 'sine', gainVal = 0.05) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {}
    },

    tickChirp() {
      this.beep(880, 0.03, 'sine', 0.012);
    },

    orderExecuted() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc1.frequency.setValueAtTime(520, now);
        osc1.frequency.exponentialRampToValueAtTime(1040, now + 0.12);
        osc2.frequency.setValueAtTime(780, now + 0.05);
        osc2.frequency.exponentialRampToValueAtTime(1560, now + 0.18);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);
        osc1.start(now);
        osc2.start(now + 0.05);
        osc1.stop(now + 0.22);
        osc2.stop(now + 0.22);
      } catch (e) {}
    },

    alertWarning() {
      this.beep(950, 0.15, 'sawtooth', 0.06);
      setTimeout(() => this.beep(1250, 0.2, 'sawtooth', 0.06), 160);
    }
  };

  // ---------------------------------------------------------------------------
  // MASTER TICKERS CATALOG & REALISTIC SIMULATION STATE
  // ---------------------------------------------------------------------------
  const MARKET_SYMBOLS = {
    'NVDA': { name: 'NVIDIA Corporation', sector: 'Semiconductors', price: 142.85, prevClose: 137.20, volatility: 0.0042, assetClass: 'STOCK', aiRating: 'ALPHA BULLISH', target: 165.00, stopLoss: 132.00, divYield: 0.0003 },
    'AAPL': { name: 'Apple Inc.', sector: 'Consumer Electronics', price: 224.20, prevClose: 222.80, volatility: 0.0020, assetClass: 'STOCK', aiRating: 'NEURAL FORECAST', target: 245.00, stopLoss: 215.00, divYield: 0.0052 },
    'MSFT': { name: 'Microsoft Corp.', sector: 'Cloud & AI', price: 418.50, prevClose: 415.10, volatility: 0.0024, assetClass: 'STOCK', aiRating: 'ALPHA BULLISH', target: 450.00, stopLoss: 398.00, divYield: 0.0075 },
    'TSLA': { name: 'Tesla Inc.', sector: 'Automotive / Robotics', price: 248.90, prevClose: 254.30, volatility: 0.0065, assetClass: 'STOCK', aiRating: 'SYSTEM ALERT', target: 285.00, stopLoss: 232.00, divYield: 0.0000 },
    'AMZN': { name: 'Amazon.com Inc.', sector: 'E-Commerce / Cloud', price: 186.40, prevClose: 184.90, volatility: 0.0028, assetClass: 'STOCK', aiRating: 'ALPHA BULLISH', target: 210.00, stopLoss: 178.00, divYield: 0.0000 },
    'GOOGL': { name: 'Alphabet Inc.', sector: 'Search & Infrastructure', price: 176.10, prevClose: 177.40, volatility: 0.0025, assetClass: 'STOCK', aiRating: 'NEURAL FORECAST', target: 195.00, stopLoss: 168.00, divYield: 0.0045 },
    'META': { name: 'Meta Platforms Inc.', sector: 'Social / AI Media', price: 565.30, prevClose: 558.90, volatility: 0.0035, assetClass: 'STOCK', aiRating: 'ALPHA BULLISH', target: 620.00, stopLoss: 535.00, divYield: 0.0035 },
    'AMD': { name: 'Adv. Micro Devices', sector: 'Semiconductors', price: 156.40, prevClose: 152.80, volatility: 0.0050, assetClass: 'STOCK', aiRating: 'ALPHA BULLISH', target: 180.00, stopLoss: 144.00, divYield: 0.0000 },
    'PLTR': { name: 'Palantir Technologies', sector: 'Enterprise AI & Defense', price: 61.20, prevClose: 57.80, volatility: 0.0070, assetClass: 'STOCK', aiRating: 'ALPHA BULLISH', target: 75.00, stopLoss: 54.00, divYield: 0.0000 },
    'COIN': { name: 'Coinbase Global Inc.', sector: 'Crypto Infrastructure', price: 288.75, prevClose: 279.40, volatility: 0.0085, assetClass: 'STOCK', aiRating: 'ALPHA BULLISH', target: 340.00, stopLoss: 260.00, divYield: 0.0000 },
    'SPY': { name: 'SPDR S&P 500 ETF', sector: 'Index ETF', price: 588.60, prevClose: 586.10, volatility: 0.0012, assetClass: 'ETF', aiRating: 'NEURAL FORECAST', target: 610.00, stopLoss: 570.00, divYield: 0.0125 },
    'QQQ': { name: 'Invesco QQQ Trust', sector: 'Index ETF', price: 502.40, prevClose: 498.90, volatility: 0.0018, assetClass: 'ETF', aiRating: 'ALPHA BULLISH', target: 530.00, stopLoss: 485.00, divYield: 0.0058 },
    'BTC/USD': { name: 'Bitcoin (Spot)', sector: 'Digital Assets', price: 91450.00, prevClose: 89800.00, volatility: 0.0075, assetClass: 'CRYPTO', aiRating: 'ALPHA BULLISH', target: 105000.00, stopLoss: 85000.00, divYield: 0.0000 },
    'ETH/USD': { name: 'Ethereum (Spot)', sector: 'Digital Assets', price: 3340.00, prevClose: 3260.00, volatility: 0.0080, assetClass: 'CRYPTO', aiRating: 'NEURAL FORECAST', target: 3900.00, stopLoss: 3050.00, divYield: 0.0000 }
  };

  const MARQUEE_INDICES = [
    { sym: 'SPX', name: 'S&P 500', price: 5886.24, chg: 22.45, pct: 0.38 },
    { sym: 'NDX', name: 'NASDAQ 100', price: 20684.10, chg: 142.80, pct: 0.70 },
    { sym: 'DJI', name: 'DOW JONES', price: 43420.15, chg: -54.10, pct: -0.12 },
    { sym: 'VIX', name: 'VOLATILITY', price: 14.82, chg: -0.65, pct: -4.20 },
    { sym: 'US10Y', name: '10Y YIELD', price: 4.412, chg: 0.021, pct: 0.48 },
    { sym: 'DXY', name: 'US DOLLAR', price: 106.68, chg: 0.14, pct: 0.13 }
  ];

  // News Wire Feed Seed
  const NEWS_FEED = [
    { sym: 'NVDA', title: 'NVIDIA unveils Blackwell Ultra roadmap; institutional buy volume accelerates', sentiment: 'BULLISH', score: '+0.88', time: '14:26' },
    { sym: 'MSFT', title: 'Microsoft Azure AI revenue growth surpasses Wall St targets by 420bps', sentiment: 'BULLISH', score: '+0.74', time: '14:15' },
    { sym: 'BTC', title: 'Bitcoin institutional ETF net inflows cross $1.2B in single 24-hour cycle', sentiment: 'BULLISH', score: '+0.91', time: '13:58' },
    { sym: 'TSLA', title: 'Autonomous robotaxi deployment in EU faces regulatory timeline review', sentiment: 'BEARISH', score: '-0.52', time: '13:42' },
    { sym: 'SPY', title: 'FOMC Chair signals balanced data-dependent rate policy into Q1', sentiment: 'NEUTRAL', score: '+0.08', time: '13:20' }
  ];

  // ---------------------------------------------------------------------------
  // CANDLESTICK HISTORY GENERATOR
  // ---------------------------------------------------------------------------
  const HistoricalData = {};

  function generateHistoricalCandles(symbol, basePrice, count = 100) {
    const candles = [];
    let current = basePrice * 0.82;
    const now = Date.now();
    const intervalMs = 24 * 60 * 60 * 1000;

    for (let i = count; i >= 0; i--) {
      const timestamp = now - i * intervalMs;
      const volFactor = MARKET_SYMBOLS[symbol] ? MARKET_SYMBOLS[symbol].volatility : 0.003;
      const drift = 0.0018 + (Math.random() - 0.48) * volFactor * 4;
      const open = current;
      const close = Math.max(1, open * (1 + drift));
      const high = Math.max(open, close) * (1 + Math.random() * volFactor * 2);
      const low = Math.min(open, close) * (1 - Math.random() * volFactor * 2);
      const volume = Math.floor((1000000 + Math.random() * 5000000) / (basePrice / 100));

      candles.push({ timestamp, open, high, low, close, volume });
      current = close;
    }
    candles[candles.length - 1].close = basePrice;
    return candles;
  }

  Object.keys(MARKET_SYMBOLS).forEach(sym => {
    HistoricalData[sym] = generateHistoricalCandles(sym, MARKET_SYMBOLS[sym].price);
  });

  // ---------------------------------------------------------------------------
  // DEFAULT PORTFOLIO PRESETS
  // ---------------------------------------------------------------------------
  const PRESETS = {
    tech: {
      name: 'AI & Semiconductor Alpha',
      cash: 34500.00,
      holdings: [
        { symbol: 'NVDA', shares: 350, avgCost: 118.40, targetWeight: 25 },
        { symbol: 'PLTR', shares: 800, avgCost: 38.50, targetWeight: 15 },
        { symbol: 'MSFT', shares: 120, avgCost: 385.20, targetWeight: 15 },
        { symbol: 'AMD', shares: 250, avgCost: 142.10, targetWeight: 10 },
        { symbol: 'AAPL', shares: 160, avgCost: 198.80, targetWeight: 10 },
        { symbol: 'COIN', shares: 140, avgCost: 220.00, targetWeight: 10 },
        { symbol: 'BTC/USD', shares: 0.85, avgCost: 68500.00, targetWeight: 15 }
      ],
      transactions: [
        { id: 'ORD-7801', symbol: 'NVDA', type: 'BUY', shares: 350, price: 118.40, total: 41440.00, date: '2026-04-12 09:30:15', status: 'SETTLED' },
        { id: 'ORD-7815', symbol: 'PLTR', type: 'BUY', shares: 800, price: 38.50, total: 30800.00, date: '2026-05-18 10:14:22', status: 'SETTLED' },
        { id: 'ORD-7840', symbol: 'MSFT', type: 'BUY', shares: 120, price: 385.20, total: 46224.00, date: '2026-02-10 11:05:00', status: 'SETTLED' },
        { id: 'ORD-7888', symbol: 'BTC/USD', type: 'BUY', shares: 0.85, price: 68500.00, total: 58225.00, date: '2026-07-04 14:02:40', status: 'SETTLED' }
      ]
    },
    macro: {
      name: 'Balanced Macro Shield',
      cash: 65000.00,
      holdings: [
        { symbol: 'SPY', shares: 240, avgCost: 540.00, targetWeight: 35 },
        { symbol: 'QQQ', shares: 180, avgCost: 460.50, targetWeight: 30 },
        { symbol: 'AAPL', shares: 200, avgCost: 210.00, targetWeight: 20 },
        { symbol: 'AMZN', shares: 250, avgCost: 172.00, targetWeight: 15 }
      ],
      transactions: [
        { id: 'ORD-6012', symbol: 'SPY', type: 'BUY', shares: 240, price: 540.00, total: 129600.00, date: '2026-01-15 09:35:00', status: 'SETTLED' },
        { id: 'ORD-6028', symbol: 'QQQ', type: 'BUY', shares: 180, price: 460.50, total: 82890.00, date: '2026-02-20 10:00:00', status: 'SETTLED' }
      ]
    },
    quant: {
      name: 'High-Beta Quant Momentum',
      cash: 21000.00,
      holdings: [
        { symbol: 'COIN', shares: 320, avgCost: 240.50, targetWeight: 20 },
        { symbol: 'TSLA', shares: 280, avgCost: 215.00, targetWeight: 20 },
        { symbol: 'BTC/USD', shares: 1.45, avgCost: 74200.00, targetWeight: 25 },
        { symbol: 'ETH/USD', shares: 18.5, avgCost: 2840.00, targetWeight: 15 },
        { symbol: 'PLTR', shares: 1200, avgCost: 44.20, targetWeight: 20 }
      ],
      transactions: [
        { id: 'ORD-9104', symbol: 'BTC/USD', type: 'BUY', shares: 1.45, price: 74200.00, total: 107590.00, date: '2026-09-05 09:42:10', status: 'SETTLED' }
      ]
    }
  };

  // ---------------------------------------------------------------------------
  // APP STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const STORAGE_KEY = 'CYBER_TERMINAL_PORTFOLIO_V4';

  const AppState = {
    selectedSymbol: 'NVDA',
    chartTimeframe: '1M',
    chartStyle: 'candlestick',
    showNeuralCone: true,
    showTargets: true,
    showEMA: true,
    showBollinger: false,
    showRSI: false,
    simSpeed: 1,
    soundEnabled: true,
    filterCategory: 'ALL',
    tableSortKey: 'value',
    tableSortDir: 'desc',
    activeDeckPane: 'paneHoldings',
    cash: 34500.00,
    realizedPL: 18450.00,
    holdings: [],
    transactions: [],
    alerts: [
      { id: 'ALT-1', symbol: 'NVDA', condition: '>=', target: 150.00, active: true, triggered: false },
      { id: 'ALT-2', symbol: 'BTC/USD', condition: '>=', target: 95000.00, active: true, triggered: false },
      { id: 'ALT-3', symbol: 'TSLA', condition: '<=', target: 240.00, active: true, triggered: false }
    ],
    eventLogs: [
      { time: '14:28:10.042', text: 'TERMINAL READY: Synapse Quant Kernel v4.8.2 Initialized', type: 'neural' },
      { time: '14:28:11.190', text: 'MARKET FEED: Real-time high-frequency telemetry connected (RTT: 4ms)', type: 'neural' },
      { time: '14:28:12.840', text: 'NVDA: Neural model confidence elevated to 97.4% (Bullish breakout)', type: 'bull' }
    ],

    save() {
      try {
        const payload = {
          cash: this.cash,
          realizedPL: this.realizedPL,
          holdings: this.holdings,
          transactions: this.transactions,
          alerts: this.alerts,
          selectedSymbol: this.selectedSymbol,
          soundEnabled: this.soundEnabled,
          activeCurrency
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (e) {
        console.error('Save failed', e);
      }
    },

    load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          this.cash = typeof parsed.cash === 'number' ? parsed.cash : 34500.00;
          this.realizedPL = typeof parsed.realizedPL === 'number' ? parsed.realizedPL : 18450.00;
          this.holdings = Array.isArray(parsed.holdings) && parsed.holdings.length ? parsed.holdings : PRESETS.tech.holdings;
          this.transactions = Array.isArray(parsed.transactions) ? parsed.transactions : PRESETS.tech.transactions;
          if (Array.isArray(parsed.alerts)) this.alerts = parsed.alerts;
          if (parsed.selectedSymbol && MARKET_SYMBOLS[parsed.selectedSymbol]) this.selectedSymbol = parsed.selectedSymbol;
          if (typeof parsed.soundEnabled === 'boolean') this.soundEnabled = parsed.soundEnabled;
          if (parsed.activeCurrency && CURRENCIES[parsed.activeCurrency]) activeCurrency = parsed.activeCurrency;
          return;
        }
      } catch (e) {}
      this.loadPreset('tech');
    },

    loadPreset(key) {
      if (!PRESETS[key]) return;
      const preset = PRESETS[key];
      this.cash = preset.cash;
      this.holdings = JSON.parse(JSON.stringify(preset.holdings));
      this.transactions = JSON.parse(JSON.stringify(preset.transactions));
      this.save();
    },

    logEvent(text, type = 'neural') {
      const d = new Date();
      const timeStr = `${d.toTimeString().split(' ')[0]}.${String(d.getMilliseconds()).padStart(3, '0')}`;
      this.eventLogs.unshift({ time: timeStr, text, type });
      if (this.eventLogs.length > 50) this.eventLogs.pop();
      renderEventStream();
    }
  };

  // ---------------------------------------------------------------------------
  // REAL-TIME SIMULATION & MARKET TICK ENGINE
  // ---------------------------------------------------------------------------
  let simInterval = null;

  function runMarketTick() {
    if (AppState.simSpeed === 0) return;

    const symKeys = Object.keys(MARKET_SYMBOLS);
    const countToUpdate = Math.floor(Math.random() * 3) + 2;

    for (let i = 0; i < countToUpdate; i++) {
      const sym = symKeys[Math.floor(Math.random() * symKeys.length)];
      const stock = MARKET_SYMBOLS[sym];
      const vol = stock.volatility * (AppState.simSpeed === 10 ? 2.5 : 1);
      
      const shock = (Math.random() - 0.495) * vol * 2.2;
      const oldPrice = stock.price;
      const newPrice = Math.max(0.01, oldPrice * (1 + shock));
      stock.price = newPrice;

      const isUp = newPrice >= oldPrice;

      const history = HistoricalData[sym];
      if (history && history.length) {
        const lastCandle = history[history.length - 1];
        lastCandle.close = newPrice;
        if (newPrice > lastCandle.high) lastCandle.high = newPrice;
        if (newPrice < lastCandle.low) lastCandle.low = newPrice;
        lastCandle.volume += Math.floor(Math.random() * 800) + 50;
      }

      checkAlerts(sym, newPrice);
      triggerCellFlash(sym, isUp);
    }

    if (Math.random() < 0.25) AudioFX.tickChirp();
    if (Math.random() < 0.10) generateRandomQuantEvent();

    updateCockpitMetrics();
    updateHoldingsTable(false);
    updateWatchlistPrices();
    updateMarqueeTicker();
    renderOrderBook();
    renderMainChart();
    if (AppState.activeDeckPane === 'paneRebalance') renderRebalanceMatrix();
    if (AppState.activeDeckPane === 'paneDividend') renderDividendRadar();
  }

  function triggerCellFlash(sym, isUp) {
    const selector = `[data-symbol-price="${sym}"]`;
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.classList.remove('flash-up', 'flash-down');
      void el.offsetWidth;
      el.classList.add(isUp ? 'flash-up' : 'flash-down');
      el.textContent = formatMoney(MARKET_SYMBOLS[sym].price);
    });
  }

  function generateRandomQuantEvent() {
    const symbols = ['NVDA', 'AAPL', 'MSFT', 'TSLA', 'PLTR', 'COIN', 'BTC/USD'];
    const sym = symbols[Math.floor(Math.random() * symbols.length)];
    const events = [
      { text: `${sym}: 20 EMA Golden Cross confirmed on 15m timeframe`, type: 'bull' },
      { text: `${sym}: High-frequency orderbook imbalance: Bids absorb 84% ask depth`, type: 'bull' },
      { text: `${sym}: Micro-volatility spike (+1.8% velocity) detected`, type: 'neural' },
      { text: `${sym}: Institutional block order settled (50,000 shares @ market)`, type: 'neural' },
      { text: `${sym}: Macro liquidity sweep near resistance boundary`, type: 'risk' }
    ];
    const picked = events[Math.floor(Math.random() * events.length)];
    AppState.logEvent(picked.text, picked.type);
  }

  function checkAlerts(sym, price) {
    AppState.alerts.forEach(alt => {
      if (alt.symbol === sym && alt.active && !alt.triggered) {
        if ((alt.condition === '>=' && price >= alt.target) || (alt.condition === '<=' && price <= alt.target)) {
          alt.triggered = true;
          AudioFX.alertWarning();
          showToast(`⚡ TARGET TRIGGERED: ${sym} reached ${formatMoney(price)} (${alt.condition} ${formatMoney(alt.target)})`);
          AppState.logEvent(`ALERT TRIGGERED: ${sym} at ${formatMoney(price)} (Sentinel Rule hit)`, 'risk');
          renderAlerts();
          AppState.save();
        }
      }
    });
  }

  function setSimSpeed(speed) {
    AppState.simSpeed = speed;
    clearInterval(simInterval);
    const btns = document.querySelectorAll('.sim-speed-btn');
    btns.forEach(b => {
      b.classList.toggle('active', parseInt(b.getAttribute('data-speed'), 10) === speed);
    });

    if (speed > 0) {
      const delay = speed === 1 ? 1200 : (speed === 5 ? 400 : 150);
      simInterval = setInterval(runMarketTick, delay);
      AppState.logEvent(`SIM ENGINE: Speed set to ${speed}x execution rate`, 'neural');
    } else {
      AppState.logEvent('SIM ENGINE: Execution PAUSED', 'risk');
    }
  }

  // ---------------------------------------------------------------------------
  // PORTFOLIO VALUATION & QUANTITATIVE RISK METRICS
  // ---------------------------------------------------------------------------
  function calculatePortfolioStats() {
    let holdingsValue = 0;
    let dayGainDollars = 0;
    let totalGainDollars = 0;
    let totalCostBasis = 0;
    let annualDividendSum = 0;

    const enrichedHoldings = AppState.holdings.map(h => {
      const stock = MARKET_SYMBOLS[h.symbol] || { price: h.avgCost, prevClose: h.avgCost, name: h.symbol, assetClass: 'STOCK', divYield: 0 };
      const currentPrice = stock.price;
      const prevClose = stock.prevClose;
      const posValue = h.shares * currentPrice;
      const costBasis = h.shares * h.avgCost;
      const posTotalGain = posValue - costBasis;
      const posTotalGainPct = costBasis > 0 ? (posTotalGain / costBasis) * 100 : 0;
      const posDayGain = (currentPrice - prevClose) * h.shares;
      const posDayGainPct = prevClose > 0 ? ((currentPrice - prevClose) / prevClose) * 100 : 0;

      const posDivIncome = posValue * (stock.divYield || 0);
      annualDividendSum += posDivIncome;

      holdingsValue += posValue;
      totalCostBasis += costBasis;
      dayGainDollars += posDayGain;
      totalGainDollars += posTotalGain;

      return {
        ...h,
        currentPrice,
        posValue,
        costBasis,
        posTotalGain,
        posTotalGainPct,
        posDayGain,
        posDayGainPct,
        divYield: stock.divYield || 0,
        posDivIncome,
        name: stock.name,
        sector: stock.sector,
        assetClass: stock.assetClass,
        aiRating: stock.aiRating
      };
    });

    const netWorth = holdingsValue + AppState.cash;
    const dayGainPct = (netWorth - dayGainDollars) > 0 ? (dayGainDollars / (netWorth - dayGainDollars)) * 100 : 0;
    const totalGainPct = totalCostBasis > 0 ? (totalGainDollars / totalCostBasis) * 100 : 0;

    enrichedHoldings.forEach(h => {
      h.weight = netWorth > 0 ? (h.posValue / netWorth) * 100 : 0;
    });

    let highVolWeight = 0;
    enrichedHoldings.forEach(h => {
      if (h.assetClass === 'CRYPTO') highVolWeight += h.weight;
      if (h.sector === 'Semiconductors' || h.sector === 'Automotive / Robotics') highVolWeight += h.weight * 0.7;
    });
    const weightedBeta = 1.05 + (highVolWeight / 100) * 0.65;
    const sharpe = Math.max(1.1, 2.38 + (totalGainPct > 15 ? 0.4 : -0.2));
    const sortino = sharpe * 1.28;
    const varPct = 1.45 + (weightedBeta - 1.0) * 0.8;
    const varDollars = netWorth * (varPct / 100);

    const weightedDivYield = netWorth > 0 ? (annualDividendSum / netWorth) * 100 : 0;
    const yieldOnCost = totalCostBasis > 0 ? (annualDividendSum / totalCostBasis) * 100 : 0;

    return {
      netWorth,
      holdingsValue,
      cash: AppState.cash,
      dayGainDollars,
      dayGainPct,
      totalGainDollars,
      totalGainPct,
      realizedPL: AppState.realizedPL,
      totalCostBasis,
      weightedBeta,
      sharpe,
      sortino,
      varDollars,
      varPct,
      annualDividendSum,
      weightedDivYield,
      yieldOnCost,
      holdings: enrichedHoldings
    };
  }

  // ---------------------------------------------------------------------------
  // DOM RENDERING: TOP COCKPIT METRICS
  // ---------------------------------------------------------------------------
  function updateCockpitMetrics() {
    const stats = calculatePortfolioStats();

    const elNet = document.getElementById('metricNetWorth');
    if (elNet) elNet.textContent = formatMoney(stats.netWorth);

    const elDayChg = document.getElementById('metricDayGain');
    if (elDayChg) {
      elDayChg.className = `cockpit-sub mono-num ${stats.dayGainDollars >= 0 ? 'val-up' : 'val-down'}`;
      elDayChg.innerHTML = `<span>DAY DELTA:</span> <strong>${stats.dayGainDollars >= 0 ? '+' : ''}${formatMoney(stats.dayGainDollars)} (${formatPct(stats.dayGainPct)})</strong>`;
    }

    const elBuyingPower = document.getElementById('metricBuyingPower');
    if (elBuyingPower) {
      const cashPct = stats.netWorth > 0 ? (stats.cash / stats.netWorth) * 100 : 0;
      elBuyingPower.textContent = `${formatMoney(stats.cash)} (${cashPct.toFixed(1)}%)`;
    }

    const elTotReturn = document.getElementById('metricTotalGain');
    if (elTotReturn) {
      elTotReturn.textContent = `${stats.totalGainDollars >= 0 ? '+' : ''}${formatMoney(stats.totalGainDollars)}`;
      elTotReturn.className = `cockpit-value mono-num ${stats.totalGainDollars >= 0 ? 'val-up' : 'val-down'}`;
    }

    const elTotPct = document.getElementById('metricTotalGainPct');
    if (elTotPct) {
      elTotPct.textContent = formatPct(stats.totalGainPct);
      elTotPct.className = `mono-num ${stats.totalGainPct >= 0 ? 'val-up' : 'val-down'}`;
    }

    const elRealized = document.getElementById('metricRealizedPL');
    if (elRealized) {
      elRealized.textContent = `${stats.realizedPL >= 0 ? '+' : ''}${formatMoney(stats.realizedPL)}`;
    }

    const elBeta = document.getElementById('metricBeta');
    if (elBeta) elBeta.textContent = stats.weightedBeta.toFixed(2);

    const elSharpe = document.getElementById('metricSharpe');
    if (elSharpe) elSharpe.textContent = stats.sharpe.toFixed(2);

    const elSortino = document.getElementById('metricSortino');
    if (elSortino) elSortino.textContent = stats.sortino.toFixed(2);

    const elVaR = document.getElementById('metricVaR');
    if (elVaR) elVaR.textContent = `-${formatMoney(stats.varDollars)} (${stats.varPct.toFixed(2)}%)`;

    const elNeuralRegime = document.getElementById('metricNeuralRegime');
    if (elNeuralRegime) {
      elNeuralRegime.textContent = stats.dayGainPct >= 0 ? 'BULLISH EXPANSION' : 'CORRECTION ABSORPTION';
      elNeuralRegime.style.color = stats.dayGainPct >= 0 ? 'var(--bullish-emerald)' : 'var(--bearish-crimson)';
    }

    renderAllocationDonut(stats);
  }

  // ---------------------------------------------------------------------------
  // DOM RENDERING: WATCHLIST & MARQUEE & NEWS WIRE
  // ---------------------------------------------------------------------------
  function renderWatchlist() {
    const container = document.getElementById('watchlistContainer');
    if (!container) return;

    let symbols = Object.keys(MARKET_SYMBOLS);
    if (AppState.filterCategory === 'TECH') {
      symbols = symbols.filter(s => ['Semiconductors', 'Cloud & AI', 'Search & Infrastructure', 'Social / AI Media', 'Consumer Electronics'].includes(MARKET_SYMBOLS[s].sector));
    } else if (AppState.filterCategory === 'CRYPTO') {
      symbols = symbols.filter(s => MARKET_SYMBOLS[s].assetClass === 'CRYPTO');
    } else if (AppState.filterCategory === 'ETF') {
      symbols = symbols.filter(s => MARKET_SYMBOLS[s].assetClass === 'ETF');
    } else if (AppState.filterCategory === 'HELD') {
      const heldSyms = AppState.holdings.map(h => h.symbol);
      symbols = symbols.filter(s => heldSyms.includes(s));
    }

    const filterSearch = (document.getElementById('watchlistSearchInput')?.value || '').toUpperCase();
    if (filterSearch) {
      symbols = symbols.filter(s => s.includes(filterSearch) || MARKET_SYMBOLS[s].name.toUpperCase().includes(filterSearch));
    }

    container.innerHTML = '';
    symbols.forEach(sym => {
      const item = MARKET_SYMBOLS[sym];
      const chg = item.price - item.prevClose;
      const chgPct = (chg / item.prevClose) * 100;
      const isUp = chg >= 0;

      const row = document.createElement('div');
      row.className = `watchlist-row ${AppState.selectedSymbol === sym ? 'selected' : ''}`;
      row.setAttribute('data-symbol', sym);
      row.innerHTML = `
        <div class="row-sym-box">
          <span class="row-sym">${sym}</span>
          <span class="row-name">${item.name}</span>
        </div>
        <canvas class="sparkline-canvas" id="spark-${sym.replace('/', '_')}"></canvas>
        <div class="row-price-box">
          <div class="row-price mono-num" data-symbol-price="${sym}">${formatMoney(item.price)}</div>
          <div class="row-chg mono-num ${isUp ? 'val-up' : 'val-down'}">${isUp ? '+' : ''}${chgPct.toFixed(2)}%</div>
        </div>
      `;

      row.addEventListener('click', () => {
        selectSymbol(sym);
      });

      container.appendChild(row);
      drawSparkline(`spark-${sym.replace('/', '_')}`, sym, isUp);
    });
  }

  function updateWatchlistPrices() {
    const rows = document.querySelectorAll('.watchlist-row');
    rows.forEach(row => {
      const sym = row.getAttribute('data-symbol');
      if (!sym || !MARKET_SYMBOLS[sym]) return;
      const item = MARKET_SYMBOLS[sym];
      const chg = item.price - item.prevClose;
      const chgPct = (chg / item.prevClose) * 100;
      const isUp = chg >= 0;

      const chgEl = row.querySelector('.row-chg');
      if (chgEl) {
        chgEl.className = `row-chg mono-num ${isUp ? 'val-up' : 'val-down'}`;
        chgEl.textContent = `${isUp ? '+' : ''}${chgPct.toFixed(2)}%`;
      }
    });
  }

  function drawSparkline(canvasId, sym, isUp) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = 50 * dpr;
    const h = 20 * dpr;
    canvas.width = w;
    canvas.height = h;

    const history = HistoricalData[sym] || [];
    if (history.length < 10) return;
    const recent = history.slice(-20);
    const min = Math.min(...recent.map(c => c.close));
    const max = Math.max(...recent.map(c => c.close));
    const range = (max - min) || 1;

    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    ctx.strokeStyle = isUp ? '#00F5A0' : '#FF3366';
    ctx.lineWidth = 1.5 * dpr;

    recent.forEach((c, idx) => {
      const x = (idx / (recent.length - 1)) * (w - 4) + 2;
      const y = h - ((c.close - min) / range) * (h - 4) - 2;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  function updateMarqueeTicker() {
    const track = document.getElementById('tickerMarqueeTrack');
    if (!track) return;

    let html = '';
    MARQUEE_INDICES.forEach(idx => {
      const isUp = idx.pct >= 0;
      html += `
        <div class="ticker-item">
          <span class="sym">${idx.sym}</span>
          <span class="mono-num">${formatNumber(idx.price, idx.price > 100 ? 2 : 3)}</span>
          <span class="mono-num ${isUp ? 'val-up' : 'val-down'}">${isUp ? '+' : ''}${idx.pct.toFixed(2)}%</span>
        </div>
      `;
    });

    Object.keys(MARKET_SYMBOLS).forEach(sym => {
      const s = MARKET_SYMBOLS[sym];
      const chg = s.price - s.prevClose;
      const chgPct = (chg / s.prevClose) * 100;
      const isUp = chg >= 0;
      html += `
        <div class="ticker-item" onclick="window.selectSymbol('${sym}')">
          <span class="sym">${sym}</span>
          <span class="mono-num" data-symbol-price="${sym}">${formatMoney(s.price)}</span>
          <span class="mono-num ${isUp ? 'val-up' : 'val-down'}">${isUp ? '+' : ''}${chgPct.toFixed(2)}%</span>
        </div>
      `;
    });

    track.innerHTML = html + html;
  }

  function renderNewsWire() {
    const container = document.getElementById('newsWireList');
    if (!container) return;
    let html = '';
    NEWS_FEED.forEach(item => {
      const isBull = item.sentiment === 'BULLISH';
      const isBear = item.sentiment === 'BEARISH';
      const badgeClass = isBull ? 'tag-emerald' : (isBear ? 'tag-crimson' : 'tag-cyan');
      html += `
        <div class="news-item-card" onclick="window.selectSymbol('${item.sym}')">
          <div class="news-header">
            <span class="tag-badge ${badgeClass}">${item.sym} // ${item.sentiment} ${item.score}</span>
            <span style="color:var(--text-dim);">${item.time} UTC</span>
          </div>
          <div class="news-title">${item.title}</div>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  // ---------------------------------------------------------------------------
  // DOM RENDERING: HOLDINGS TABLE
  // ---------------------------------------------------------------------------
  function updateHoldingsTable(rebuild = true) {
    const tbody = document.getElementById('holdingsTableBody');
    if (!tbody) return;

    const stats = calculatePortfolioStats();
    let sorted = [...stats.holdings];

    sorted.sort((a, b) => {
      let va = a[AppState.tableSortKey];
      let vb = b[AppState.tableSortKey];
      if (AppState.tableSortKey === 'value') {
        va = a.posValue;
        vb = b.posValue;
      } else if (AppState.tableSortKey === 'pnl') {
        va = a.posTotalGain;
        vb = b.posTotalGain;
      } else if (AppState.tableSortKey === 'day') {
        va = a.posDayGain;
        vb = b.posDayGain;
      }
      return AppState.tableSortDir === 'desc' ? (vb - va) : (va - vb);
    });

    if (rebuild) {
      tbody.innerHTML = '';
      if (sorted.length === 0) {
        tbody.innerHTML = `<tr><td colspan="11" style="text-align:center; padding: 24px; color: var(--text-dim);">NO ACTIVE POSITIONS FOUND. USE [+ NEW ORDER] TO ALLOCATE CAPITAL.</td></tr>`;
        return;
      }

      sorted.forEach(h => {
        const tr = document.createElement('tr');
        tr.setAttribute('data-holding-sym', h.symbol);
        
        let signalClass = 'tag-cyan';
        if (h.aiRating === 'ALPHA BULLISH') signalClass = 'tag-emerald';
        if (h.aiRating === 'SYSTEM ALERT') signalClass = 'tag-crimson';

        tr.innerHTML = `
          <td>
            <div style="font-weight:700; color:var(--text-primary); cursor:pointer;" onclick="window.selectSymbol('${h.symbol}')">${h.symbol}</div>
            <div style="font-size:10px; color:var(--text-dim);">${h.name}</div>
          </td>
          <td>
            <span class="tag-badge ${h.assetClass === 'CRYPTO' ? 'tag-magenta' : (h.assetClass === 'ETF' ? 'tag-cyan' : 'tag-violet')}">${h.assetClass}</span>
          </td>
          <td class="mono-num">${formatNumber(h.shares, h.shares % 1 === 0 ? 0 : 4)}</td>
          <td class="mono-num">${formatMoney(h.avgCost)}</td>
          <td class="mono-num" data-symbol-price="${h.symbol}" style="font-weight:700;">${formatMoney(h.currentPrice)}</td>
          <td class="mono-num" style="font-weight:700;">${formatMoney(h.posValue)}</td>
          <td class="mono-num">
            <span class="weight-bar-bg"><span class="weight-bar-fill" style="width: ${Math.min(100, h.weight)}%"></span></span>
            ${h.weight.toFixed(1)}%
          </td>
          <td class="mono-num ${h.posDayGain >= 0 ? 'val-up' : 'val-down'}">
            ${h.posDayGain >= 0 ? '+' : ''}${formatMoney(h.posDayGain)}<br>
            <span style="font-size:10px;">${formatPct(h.posDayGainPct)}</span>
          </td>
          <td class="mono-num ${h.posTotalGain >= 0 ? 'val-up' : 'val-down'}">
            ${h.posTotalGain >= 0 ? '+' : ''}${formatMoney(h.posTotalGain)}<br>
            <span style="font-size:10px;">${formatPct(h.posTotalGainPct)}</span>
          </td>
          <td>
            <span class="tag-badge ${signalClass}">${h.aiRating || 'ALPHA MODEL'}</span>
          </td>
          <td>
            <div style="display:flex; gap:4px;">
              <button class="btn btn-bullish btn-sm" onclick="window.openOrderModal('${h.symbol}', 'BUY')">BUY</button>
              <button class="btn btn-bearish btn-sm" onclick="window.openOrderModal('${h.symbol}', 'SELL')">SELL</button>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } else {
      sorted.forEach(h => {
        const row = tbody.querySelector(`[data-holding-sym="${h.symbol}"]`);
        if (!row) return;
        const cells = row.querySelectorAll('td');
        if (cells.length >= 10) {
          cells[4].textContent = formatMoney(h.currentPrice);
          cells[5].textContent = formatMoney(h.posValue);
          cells[6].innerHTML = `<span class="weight-bar-bg"><span class="weight-bar-fill" style="width: ${Math.min(100, h.weight)}%"></span></span>${h.weight.toFixed(1)}%`;
          cells[7].className = `mono-num ${h.posDayGain >= 0 ? 'val-up' : 'val-down'}`;
          cells[7].innerHTML = `${h.posDayGain >= 0 ? '+' : ''}${formatMoney(h.posDayGain)}<br><span style="font-size:10px;">${formatPct(h.posDayGainPct)}</span>`;
          cells[8].className = `mono-num ${h.posTotalGain >= 0 ? 'val-up' : 'val-down'}`;
          cells[8].innerHTML = `${h.posTotalGain >= 0 ? '+' : ''}${formatMoney(h.posTotalGain)}<br><span style="font-size:10px;">${formatPct(h.posTotalGainPct)}</span>`;
        }
      });
    }
  }

  // ---------------------------------------------------------------------------
  // INTERACTIVE CHARTING ENGINE
  // ---------------------------------------------------------------------------
  let crosshairX = -1;
  let crosshairY = -1;

  function renderMainChart() {
    const canvas = document.getElementById('mainChartCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const rect = canvas.getBoundingClientRect();
    const clientW = rect.width || canvas.parentElement?.clientWidth || 800;
    const clientH = rect.height || canvas.parentElement?.clientHeight || 360;
    const w = clientW * dpr;
    const h = clientH * dpr;
    canvas.width = w;
    canvas.height = h;

    const sym = AppState.selectedSymbol;
    const stock = MARKET_SYMBOLS[sym];
    if (!stock) return;

    let fullHistory = HistoricalData[sym] || [];
    let sliceCount = 35;
    if (AppState.chartTimeframe === '1D') sliceCount = 15;
    else if (AppState.chartTimeframe === '1W') sliceCount = 20;
    else if (AppState.chartTimeframe === '1M') sliceCount = 35;
    else if (AppState.chartTimeframe === '3M') sliceCount = 60;
    else if (AppState.chartTimeframe === '1Y') sliceCount = 90;
    else if (AppState.chartTimeframe === 'ALL') sliceCount = 100;

    const candles = fullHistory.slice(-sliceCount);
    if (candles.length === 0) return;

    const paddingLeft = 10 * dpr;
    const paddingRight = 70 * dpr;
    const paddingTop = 25 * dpr;
    const paddingBottom = 40 * dpr;

    const chartW = w - paddingLeft - paddingRight;
    const chartH = (h - paddingTop - paddingBottom) * 0.78;
    const volH = (h - paddingTop - paddingBottom) * 0.22;
    const volY = paddingTop + chartH + 10 * dpr;

    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let maxVol = 0;

    candles.forEach(c => {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
      if (c.volume > maxVol) maxVol = c.volume;
    });

    if (AppState.showTargets) {
      if (stock.target > maxPrice) maxPrice = stock.target * 1.02;
      if (stock.stopLoss < minPrice) minPrice = stock.stopLoss * 0.98;
    }

    const priceMargin = (maxPrice - minPrice) * 0.08 || 1;
    minPrice -= priceMargin;
    maxPrice += priceMargin;
    const priceRange = maxPrice - minPrice;

    ctx.fillStyle = '#070B12';
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.lineWidth = 1 * dpr;
    ctx.strokeStyle = '#141C2E';

    const priceGridSteps = 5;
    for (let i = 0; i <= priceGridSteps; i++) {
      const p = minPrice + (priceRange / priceGridSteps) * i;
      const y = paddingTop + chartH - ((p - minPrice) / priceRange) * chartH;
      ctx.beginPath();
      ctx.moveTo(paddingLeft, y);
      ctx.lineTo(w - paddingRight, y);
      ctx.stroke();

      ctx.fillStyle = '#64748B';
      ctx.font = `${10 * dpr}px 'Space Mono', monospace`;
      ctx.textAlign = 'left';
      ctx.fillText(formatMoney(p, p > 100 ? 2 : 3), w - paddingRight + 6 * dpr, y + 3 * dpr);
    }

    // Volume Bars
    const slotW = chartW / (candles.length + (AppState.showNeuralCone ? 15 : 0));
    const candleBodyW = Math.max(2 * dpr, slotW * 0.65);

    candles.forEach((c, i) => {
      const x = paddingLeft + i * slotW + slotW / 2;
      const vH = (c.volume / (maxVol || 1)) * (volH - 5 * dpr);
      const isUp = c.close >= c.open;
      ctx.fillStyle = isUp ? 'rgba(0, 245, 160, 0.22)' : 'rgba(255, 51, 102, 0.22)';
      ctx.fillRect(x - candleBodyW / 2, volY + volH - vH, candleBodyW, vH);
    });

    // Technical Overlays: EMAs
    if (AppState.showEMA && candles.length >= 10) {
      ctx.beginPath();
      ctx.strokeStyle = '#00D2FF';
      ctx.lineWidth = 1.5 * dpr;
      candles.forEach((c, idx) => {
        if (idx < 5) return;
        const sub = candles.slice(Math.max(0, idx - 10), idx + 1);
        const avg = sub.reduce((acc, v) => acc + v.close, 0) / sub.length;
        const x = paddingLeft + idx * slotW + slotW / 2;
        const y = paddingTop + chartH - ((avg - minPrice) / priceRange) * chartH;
        if (idx === 5) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = '#A855F7';
      ctx.lineWidth = 1.5 * dpr;
      candles.forEach((c, idx) => {
        if (idx < 10) return;
        const sub = candles.slice(Math.max(0, idx - 20), idx + 1);
        const avg = sub.reduce((acc, v) => acc + v.close, 0) / sub.length;
        const x = paddingLeft + idx * slotW + slotW / 2;
        const y = paddingTop + chartH - ((avg - minPrice) / priceRange) * chartH;
        if (idx === 10) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // Bollinger Bands (20, 2)
    if (AppState.showBollinger && candles.length >= 20) {
      const upperPoints = [];
      const lowerPoints = [];

      candles.forEach((c, idx) => {
        if (idx < 15) return;
        const sub = candles.slice(Math.max(0, idx - 15), idx + 1);
        const mean = sub.reduce((acc, v) => acc + v.close, 0) / sub.length;
        const variance = sub.reduce((acc, v) => acc + Math.pow(v.close - mean, 2), 0) / sub.length;
        const stdDev = Math.sqrt(variance);

        const x = paddingLeft + idx * slotW + slotW / 2;
        const yUpper = paddingTop + chartH - (((mean + 2 * stdDev) - minPrice) / priceRange) * chartH;
        const yLower = paddingTop + chartH - (((mean - 2 * stdDev) - minPrice) / priceRange) * chartH;

        upperPoints.push({ x, y: yUpper });
        lowerPoints.push({ x, y: yLower });
      });

      ctx.beginPath();
      ctx.setLineDash([3 * dpr, 3 * dpr]);
      ctx.strokeStyle = '#EC4899';
      ctx.lineWidth = 1 * dpr;
      upperPoints.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();

      ctx.beginPath();
      lowerPoints.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Main Chart Type: Candlestick vs Neon Area
    if (AppState.chartStyle === 'neon-area') {
      ctx.beginPath();
      candles.forEach((c, i) => {
        const x = paddingLeft + i * slotW + slotW / 2;
        const y = paddingTop + chartH - ((c.close - minPrice) / priceRange) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#00D2FF';
      ctx.lineWidth = 2 * dpr;
      ctx.shadowColor = 'rgba(0, 210, 255, 0.6)';
      ctx.shadowBlur = 8 * dpr;
      ctx.stroke();
      ctx.shadowBlur = 0;

      const lastX = paddingLeft + (candles.length - 1) * slotW + slotW / 2;
      const firstX = paddingLeft + slotW / 2;
      ctx.lineTo(lastX, paddingTop + chartH);
      ctx.lineTo(firstX, paddingTop + chartH);
      ctx.closePath();
      const areaGrad = ctx.createLinearGradient(0, paddingTop, 0, paddingTop + chartH);
      areaGrad.addColorStop(0, 'rgba(0, 210, 255, 0.25)');
      areaGrad.addColorStop(1, 'rgba(0, 210, 255, 0.00)');
      ctx.fillStyle = areaGrad;
      ctx.fill();
    } else {
      candles.forEach((c, i) => {
        const x = paddingLeft + i * slotW + slotW / 2;
        const isUp = c.close >= c.open;
        const candleColor = isUp ? '#00F5A0' : '#FF3366';

        const openY = paddingTop + chartH - ((c.open - minPrice) / priceRange) * chartH;
        const closeY = paddingTop + chartH - ((c.close - minPrice) / priceRange) * chartH;
        const highY = paddingTop + chartH - ((c.high - minPrice) / priceRange) * chartH;
        const lowY = paddingTop + chartH - ((c.low - minPrice) / priceRange) * chartH;

        ctx.beginPath();
        ctx.strokeStyle = candleColor;
        ctx.lineWidth = 1 * dpr;
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.stroke();

        ctx.fillStyle = candleColor;
        const bodyTop = Math.min(openY, closeY);
        const bodyH = Math.max(1.5 * dpr, Math.abs(closeY - openY));
        ctx.fillRect(x - candleBodyW / 2, bodyTop, candleBodyW, bodyH);
      });
    }

    // Neural Forecast Cones
    if (AppState.showNeuralCone && candles.length > 5) {
      const lastIdx = candles.length - 1;
      const startX = paddingLeft + lastIdx * slotW + slotW / 2;
      const lastCandle = candles[lastIdx];
      const startY = paddingTop + chartH - ((lastCandle.close - minPrice) / priceRange) * chartH;

      const fanSteps = 15;
      const fanW = slotW * fanSteps;
      const endX = startX + fanW;

      const isBull = stock.aiRating === 'ALPHA BULLISH';
      const driftSlope = isBull ? 0.08 : (stock.aiRating === 'SYSTEM ALERT' ? -0.06 : 0.02);
      const endMeanPrice = lastCandle.close * (1 + driftSlope);
      const endMeanY = paddingTop + chartH - ((endMeanPrice - minPrice) / priceRange) * chartH;

      const spread95 = lastCandle.close * (stock.volatility * 12);
      const upper95Price = endMeanPrice + spread95;
      const lower95Price = Math.max(1, endMeanPrice - spread95);

      const upper95Y = paddingTop + chartH - ((upper95Price - minPrice) / priceRange) * chartH;
      const lower95Y = paddingTop + chartH - ((lower95Price - minPrice) / priceRange) * chartH;

      const spread50 = spread95 * 0.45;
      const upper50Y = paddingTop + chartH - (((endMeanPrice + spread50) - minPrice) / priceRange) * chartH;
      const lower50Y = paddingTop + chartH - (((endMeanPrice - spread50) - minPrice) / priceRange) * chartH;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, upper95Y);
      ctx.lineTo(endX, lower95Y);
      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 210, 255, 0.06)';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, upper50Y);
      ctx.lineTo(endX, lower50Y);
      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 210, 255, 0.16)';
      ctx.fill();

      ctx.beginPath();
      ctx.setLineDash([4 * dpr, 4 * dpr]);
      ctx.strokeStyle = '#00D2FF';
      ctx.lineWidth = 1.5 * dpr;
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endMeanY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#00D2FF';
      ctx.fillRect(endX - 3 * dpr, endMeanY - 3 * dpr, 6 * dpr, 6 * dpr);

      ctx.font = `${9 * dpr}px 'Space Mono', monospace`;
      ctx.fillStyle = '#00D2FF';
      ctx.textAlign = 'left';
      ctx.fillText(`AI 30D DRIFT (${isBull ? '+' : ''}${(driftSlope * 100).toFixed(1)}%)`, endX + 4 * dpr, endMeanY + 3 * dpr);
    }

    // Target Strike Vectors
    if (AppState.showTargets) {
      const targetY = paddingTop + chartH - ((stock.target - minPrice) / priceRange) * chartH;
      if (targetY >= paddingTop && targetY <= paddingTop + chartH) {
        ctx.beginPath();
        ctx.setLineDash([3 * dpr, 4 * dpr]);
        ctx.strokeStyle = '#00F5A0';
        ctx.lineWidth = 1 * dpr;
        ctx.moveTo(paddingLeft, targetY);
        ctx.lineTo(w - paddingRight, targetY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#00F5A0';
        ctx.fillRect(w - paddingRight - 4 * dpr, targetY - 4 * dpr, 8 * dpr, 8 * dpr);
        ctx.font = `bold ${9 * dpr}px 'Space Mono', monospace`;
        ctx.fillText(`TARGET ${formatMoney(stock.target)}`, w - paddingRight + 6 * dpr, targetY + 3 * dpr);
      }

      const stopY = paddingTop + chartH - ((stock.stopLoss - minPrice) / priceRange) * chartH;
      if (stopY >= paddingTop && stopY <= paddingTop + chartH) {
        ctx.beginPath();
        ctx.setLineDash([3 * dpr, 4 * dpr]);
        ctx.strokeStyle = '#FF3366';
        ctx.lineWidth = 1 * dpr;
        ctx.moveTo(paddingLeft, stopY);
        ctx.lineTo(w - paddingRight, stopY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#FF3366';
        ctx.fillRect(w - paddingRight - 4 * dpr, stopY - 4 * dpr, 8 * dpr, 8 * dpr);
        ctx.font = `bold ${9 * dpr}px 'Space Mono', monospace`;
        ctx.fillText(`STOP ${formatMoney(stock.stopLoss)}`, w - paddingRight + 6 * dpr, stopY + 3 * dpr);
      }
    }

    // Crosshair HUD Tooltip
    if (crosshairX >= paddingLeft && crosshairX <= w - paddingRight && crosshairY >= paddingTop && crosshairY <= h - paddingBottom) {
      ctx.beginPath();
      ctx.setLineDash([2 * dpr, 2 * dpr]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1 * dpr;
      ctx.moveTo(crosshairX, paddingTop);
      ctx.lineTo(crosshairX, h - paddingBottom);
      ctx.moveTo(paddingLeft, crosshairY);
      ctx.lineTo(w - paddingRight, crosshairY);
      ctx.stroke();
      ctx.setLineDash([]);

      const relX = crosshairX - paddingLeft;
      const candleIdx = Math.min(candles.length - 1, Math.max(0, Math.floor(relX / slotW)));
      const activeCandle = candles[candleIdx];

      if (activeCandle) {
        updateChartHUD(activeCandle, stock);
      }
    } else {
      updateChartHUD(candles[candles.length - 1], stock);
    }
  }

  function updateChartHUD(candle, stock) {
    if (!candle) return;
    const hud = document.getElementById('chartHudBox');
    if (!hud) return;

    const d = new Date(candle.timestamp);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const isUp = candle.close >= candle.open;

    hud.innerHTML = `
      <div class="hud-stat">DATE: <strong>${dateStr}</strong></div>
      <div class="hud-stat">O: <strong>${formatMoney(candle.open)}</strong></div>
      <div class="hud-stat">H: <strong>${formatMoney(candle.high)}</strong></div>
      <div class="hud-stat">L: <strong>${formatMoney(candle.low)}</strong></div>
      <div class="hud-stat">C: <strong class="${isUp ? 'val-up' : 'val-down'}">${formatMoney(candle.close)}</strong></div>
      <div class="hud-stat">VOL: <strong>${formatNumber(candle.volume)}</strong></div>
      <div class="hud-stat" style="color:var(--secondary-cyan);">CONF: <strong>96.8%</strong></div>
    `;
  }

  function setupChartMouseEvents() {
    const canvas = document.getElementById('mainChartCanvas');
    if (!canvas) return;

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      crosshairX = (e.clientX - rect.left) * dpr;
      crosshairY = (e.clientY - rect.top) * dpr;
      renderMainChart();
    });

    canvas.addEventListener('mouseleave', () => {
      crosshairX = -1;
      crosshairY = -1;
      renderMainChart();
    });
  }

  // ---------------------------------------------------------------------------
  // ORDER BOOK LADDER
  // ---------------------------------------------------------------------------
  function renderOrderBook() {
    const sym = AppState.selectedSymbol;
    const stock = MARKET_SYMBOLS[sym];
    if (!stock) return;

    const basePrice = stock.price;
    const spreadPct = 0.0003;
    const spread = basePrice * spreadPct;

    const asksContainer = document.getElementById('obAsksRows');
    const bidsContainer = document.getElementById('obBidsRows');
    const spreadEl = document.getElementById('obSpreadVal');

    if (spreadEl) {
      spreadEl.textContent = `SPREAD: ${formatMoney(spread, 3)} (${(spreadPct * 100).toFixed(3)}%)`;
    }

    let asksHtml = '';
    const askPrices = [];
    for (let i = 5; i >= 1; i--) {
      const askP = basePrice + spread / 2 + i * (basePrice * 0.0004);
      const size = Math.floor(Math.random() * 450) + 50;
      askPrices.push({ price: askP, size });
    }

    askPrices.forEach(item => {
      const depthPct = Math.min(100, (item.size / 600) * 100);
      asksHtml += `
        <div class="ob-row">
          <div class="ob-depth-bar ob-depth-ask" style="width: ${depthPct}%;"></div>
          <span class="ob-val mono-num val-down">${formatMoney(item.price, item.price > 100 ? 2 : 3)}</span>
          <span class="ob-val mono-num" style="text-align:right;">${formatNumber(item.size)}</span>
          <span class="ob-val mono-num" style="text-align:right; color:var(--text-dim);">${formatMoney(item.price * item.size, 0)}</span>
        </div>
      `;
    });
    if (asksContainer) asksContainer.innerHTML = asksHtml;

    let bidsHtml = '';
    const bidPrices = [];
    for (let i = 1; i <= 5; i++) {
      const bidP = basePrice - spread / 2 - i * (basePrice * 0.0004);
      const size = Math.floor(Math.random() * 520) + 60;
      bidPrices.push({ price: bidP, size });
    }

    bidPrices.forEach(item => {
      const depthPct = Math.min(100, (item.size / 600) * 100);
      bidsHtml += `
        <div class="ob-row">
          <div class="ob-depth-bar ob-depth-bid" style="width: ${depthPct}%;"></div>
          <span class="ob-val mono-num val-up">${formatMoney(item.price, item.price > 100 ? 2 : 3)}</span>
          <span class="ob-val mono-num" style="text-align:right;">${formatNumber(item.size)}</span>
          <span class="ob-val mono-num" style="text-align:right; color:var(--text-dim);">${formatMoney(item.price * item.size, 0)}</span>
        </div>
      `;
    });
    if (bidsContainer) bidsContainer.innerHTML = bidsHtml;
  }

  // ---------------------------------------------------------------------------
  // ALLOCATION DONUT CHART
  // ---------------------------------------------------------------------------
  function renderAllocationDonut(stats) {
    const canvas = document.getElementById('allocCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = 110 * dpr;
    canvas.height = 110 * dpr;

    const sectorTotals = {
      'Cash Reserve': stats.cash
    };

    stats.holdings.forEach(h => {
      const sec = h.sector || 'Other';
      sectorTotals[sec] = (sectorTotals[sec] || 0) + h.posValue;
    });

    const palette = ['#A855F7', '#00D2FF', '#00F5A0', '#EC4899', '#64748B', '#F59E0B', '#3B82F6'];
    const totalVal = stats.netWorth || 1;

    const centerX = (110 * dpr) / 2;
    const centerY = (110 * dpr) / 2;
    const outerR = 48 * dpr;
    const innerR = 34 * dpr;

    let currentAngle = -0.5 * Math.PI;
    const legendContainer = document.getElementById('allocLegend');
    let legendHtml = '';

    const sectors = Object.keys(sectorTotals);
    sectors.forEach((sec, idx) => {
      const val = sectorTotals[sec];
      const slicePct = val / totalVal;
      const sliceAngle = slicePct * 2 * Math.PI;
      const color = palette[idx % palette.length];

      ctx.beginPath();
      ctx.arc(centerX, centerY, outerR, currentAngle, currentAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerR, currentAngle + sliceAngle, currentAngle, true);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      ctx.strokeStyle = '#090D14';
      ctx.lineWidth = 1.5 * dpr;
      ctx.stroke();

      currentAngle += sliceAngle;

      legendHtml += `
        <div class="alloc-item">
          <div style="display:flex; align-items:center; gap:5px;">
            <span style="display:inline-block; width:8px; height:8px; background:${color};"></span>
            <span style="color:var(--text-muted);">${sec}</span>
          </div>
          <strong class="mono-num">${(slicePct * 100).toFixed(1)}%</strong>
        </div>
      `;
    });

    if (legendContainer) legendContainer.innerHTML = legendHtml;
  }

  // ---------------------------------------------------------------------------
  // NEW FEATURE: STRESS TESTING & BLACK SWAN SIMULATOR
  // ---------------------------------------------------------------------------
  let stressBaseline = null;

  function applyStressScenario(scenarioKey) {
    const stats = calculatePortfolioStats();
    let shockFactor = 0;
    let hedgeRec = 'HOLD CASH RESERVE';

    if (scenarioKey === 'tech_crash') {
      shockFactor = -0.15;
      hedgeRec = 'BUY SPY/QQQ OUT-OF-THE-MONEY PUTS';
      AppState.logEvent('STRESS LAB: Executing -15% Nasdaq Tech Crash Simulation', 'risk');
    } else if (scenarioKey === 'crypto_dump') {
      shockFactor = -0.22;
      hedgeRec = 'SWEEP LIQUIDITY TO USD TREASURY BILLS';
      AppState.logEvent('STRESS LAB: Executing -22% Crypto Liquidity Flash Dump Simulation', 'risk');
    } else if (scenarioKey === 'fed_pivot') {
      shockFactor = +0.08;
      hedgeRec = 'ACCELERATE TECH ALPHA LEVERAGE';
      AppState.logEvent('STRESS LAB: Executing +8% Dovish Fed Pivot Expansion Simulation', 'bull');
    }

    const projectedNet = stats.netWorth * (1 + shockFactor);
    const deltaDollar = projectedNet - stats.netWorth;

    const elNet = document.getElementById('stressProjectedNet');
    if (elNet) elNet.textContent = formatMoney(projectedNet);

    const elDelta = document.getElementById('stressDeltaDollar');
    if (elDelta) {
      elDelta.className = `mono-num ${deltaDollar >= 0 ? 'val-up' : 'val-down'}`;
      elDelta.textContent = `${deltaDollar >= 0 ? '+' : ''}${formatMoney(deltaDollar)}`;
    }

    const elPct = document.getElementById('stressDeltaPct');
    if (elPct) {
      elPct.className = `mono-num ${shockFactor >= 0 ? 'val-up' : 'val-down'}`;
      elPct.textContent = formatPct(shockFactor * 100);
    }

    const elHedge = document.getElementById('stressHedgeRec');
    if (elHedge) elHedge.textContent = hedgeRec;
  }

  function applyCustomStress(pctVal) {
    pctVal = parseFloat(pctVal);
    const sliderVal = document.getElementById('customStressVal');
    if (sliderVal) sliderVal.textContent = (pctVal >= 0 ? '+' : '') + pctVal + '%';

    const stats = calculatePortfolioStats();
    const shockFactor = pctVal / 100;
    const projectedNet = stats.netWorth * (1 + shockFactor);
    const deltaDollar = projectedNet - stats.netWorth;

    const elNet = document.getElementById('stressProjectedNet');
    if (elNet) elNet.textContent = formatMoney(projectedNet);

    const elDelta = document.getElementById('stressDeltaDollar');
    if (elDelta) {
      elDelta.className = `mono-num ${deltaDollar >= 0 ? 'val-up' : 'val-down'}`;
      elDelta.textContent = `${deltaDollar >= 0 ? '+' : ''}${formatMoney(deltaDollar)}`;
    }

    const elPct = document.getElementById('stressDeltaPct');
    if (elPct) {
      elPct.className = `mono-num ${shockFactor >= 0 ? 'val-up' : 'val-down'}`;
      elPct.textContent = formatPct(pctVal);
    }

    const elHedge = document.getElementById('stressHedgeRec');
    if (elHedge) {
      elHedge.textContent = pctVal < -10 ? 'EMERGENCY HEDGE // ROTATE DEFENSIVE' : (pctVal > 10 ? 'MAX LEVERAGE ALPHA ACCUMULATION' : 'BALANCED RISK NEUTRAL');
    }
  }

  function resetStressScenario() {
    const slider = document.getElementById('customStressSlider');
    if (slider) slider.value = 0;
    applyCustomStress(0);
    showToast('STRESS LAB: BASELINE RESTORED');
  }

  // ---------------------------------------------------------------------------
  // NEW FEATURE: QUANT REBALANCING OPTIMIZER MATRIX
  // ---------------------------------------------------------------------------
  function renderRebalanceMatrix() {
    const tbody = document.getElementById('rebalanceTableBody');
    if (!tbody) return;

    const stats = calculatePortfolioStats();
    let html = '';

    stats.holdings.forEach((h, idx) => {
      const targetWeight = h.targetWeight || 15;
      const drift = h.weight - targetWeight;
      const isOver = drift > 0;
      const driftClass = Math.abs(drift) < 1.5 ? 'val-neutral' : (isOver ? 'val-up' : 'val-down');

      // Calculate action delta
      const targetValue = stats.netWorth * (targetWeight / 100);
      const deltaDollars = targetValue - h.posValue;
      const deltaShares = Math.abs(Math.round(deltaDollars / h.currentPrice));

      let actionText = 'IN EQUILIBRIUM';
      if (deltaDollars > 500) {
        actionText = `<span class="val-up">BUY ~${deltaShares} ${h.symbol} (+${formatMoney(deltaDollars)})</span>`;
      } else if (deltaDollars < -500) {
        actionText = `<span class="val-down">SELL ~${deltaShares} ${h.symbol} (-${formatMoney(Math.abs(deltaDollars))})</span>`;
      }

      html += `
        <tr>
          <td>
            <strong>${h.symbol}</strong>
            <div style="font-size:10px; color:var(--text-dim);">${h.name}</div>
          </td>
          <td class="mono-num">${formatMoney(h.posValue)}</td>
          <td class="mono-num" style="font-weight:700;">${h.weight.toFixed(1)}%</td>
          <td class="mono-num">
            <input type="number" class="terminal-input" style="width:60px; padding:2px 4px; font-size:11px;" value="${targetWeight}" min="0" max="100" onchange="window.updateTargetWeight(${idx}, this.value)"> %
          </td>
          <td class="mono-num ${driftClass}" style="font-weight:700;">
            ${drift >= 0 ? '+' : ''}${drift.toFixed(1)}% (${isOver ? 'OVERWEIGHT' : 'UNDERWEIGHT'})
          </td>
          <td>${actionText}</td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  }

  function updateTargetWeight(idx, val) {
    val = parseFloat(val);
    if (!isNaN(val) && AppState.holdings[idx]) {
      AppState.holdings[idx].targetWeight = val;
      AppState.save();
      renderRebalanceMatrix();
    }
  }

  function executeAutoRebalance() {
    const stats = calculatePortfolioStats();
    let rebalancedCount = 0;

    stats.holdings.forEach(h => {
      const targetWeight = h.targetWeight || 15;
      const targetValue = stats.netWorth * (targetWeight / 100);
      const deltaDollars = targetValue - h.posValue;
      const sharesToTrade = Math.abs(Math.round(deltaDollars / h.currentPrice));

      if (sharesToTrade > 0 && Math.abs(deltaDollars) > 300) {
        if (deltaDollars > 0 && AppState.cash >= deltaDollars) {
          executeOrder(h.symbol, 'BUY', sharesToTrade);
          rebalancedCount++;
        } else if (deltaDollars < 0 && h.shares >= sharesToTrade) {
          executeOrder(h.symbol, 'SELL', sharesToTrade);
          rebalancedCount++;
        }
      }
    });

    showToast(`REBALANCE COMPLETE: ${rebalancedCount} orders automatically executed`);
    AppState.logEvent(`DMA OPTIMIZER: Rebalance completed across ${rebalancedCount} assets`, 'bull');
    renderRebalanceMatrix();
  }

  // ---------------------------------------------------------------------------
  // NEW FEATURE: DIVIDEND RADAR & YIELD PROJECTOR
  // ---------------------------------------------------------------------------
  function renderDividendRadar() {
    const stats = calculatePortfolioStats();

    const elAnnual = document.getElementById('divAnnualIncome');
    if (elAnnual) elAnnual.textContent = formatMoney(stats.annualDividendSum);

    const elYield = document.getElementById('divWeightedYield');
    if (elYield) elYield.textContent = stats.weightedDivYield.toFixed(2) + '%';

    const elYoC = document.getElementById('divYieldOnCost');
    if (elYoC) elYoC.textContent = stats.yieldOnCost.toFixed(2) + '%';

    const elMonthly = document.getElementById('divMonthlyAvg');
    if (elMonthly) elMonthly.textContent = formatMoney(stats.annualDividendSum / 12);

    // 12-Month Bar Schedule
    const grid = document.getElementById('dividendMonthsGrid');
    if (!grid) return;

    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const monthlySeasonalMultipliers = [0.8, 0.6, 1.4, 0.9, 0.7, 1.5, 0.8, 0.6, 1.4, 0.9, 0.7, 1.6];
    const avgMonthly = stats.annualDividendSum / 12 || 1;
    let html = '';

    months.forEach((m, i) => {
      const payout = avgMonthly * monthlySeasonalMultipliers[i];
      const maxPossible = avgMonthly * 1.8 || 1;
      const barH = Math.min(100, Math.max(10, (payout / maxPossible) * 100));

      html += `
        <div class="month-col">
          <span style="font-size:9px; color:var(--text-dim);">${m}</span>
          <div class="month-bar-wrapper">
            <div class="month-bar-fill" style="height:${barH}%;"></div>
          </div>
          <span class="mono-num" style="font-size:9px; font-weight:700;">${formatMoney(payout, 0)}</span>
        </div>
      `;
    });
    grid.innerHTML = html;
  }

  // ---------------------------------------------------------------------------
  // NEW FEATURE: ALPHA STRATEGY BACKTESTING ENGINE
  // ---------------------------------------------------------------------------
  function runStrategyBacktest() {
    const stratSelect = document.getElementById('backtestStrategySelect');
    const symSelect = document.getElementById('backtestSymbolSelect');
    if (!stratSelect || !symSelect) return;

    const strat = stratSelect.value;
    const sym = symSelect.value;
    const candles = HistoricalData[sym] || [];
    if (candles.length < 30) return;

    let capital = 10000;
    let benchmarkCapital = 10000;
    const firstClose = candles[0].close;
    const lastClose = candles[candles.length - 1].close;
    const benchmarkReturn = ((lastClose - firstClose) / firstClose) * 100;

    let inPosition = false;
    let buyPrice = 0;
    let wins = 0;
    let losses = 0;
    let grossProfit = 0;
    let grossLoss = 0;
    const equityCurve = [10000];

    for (let i = 20; i < candles.length; i++) {
      const c = candles[i];
      const sub20 = candles.slice(i - 20, i);
      const sub50 = candles.slice(Math.max(0, i - 50), i);
      const sma20 = sub20.reduce((a, v) => a + v.close, 0) / sub20.length;
      const sma50 = sub50.reduce((a, v) => a + v.close, 0) / sub50.length;

      let signalBuy = false;
      let signalSell = false;

      if (strat === 'sma_cross') {
        signalBuy = sma20 > sma50;
        signalSell = sma20 <= sma50;
      } else if (strat === 'rsi_reversion') {
        signalBuy = c.close < sma20 * 0.98;
        signalSell = c.close > sma20 * 1.02;
      } else {
        signalBuy = c.close >= c.open && c.volume > sub20[sub20.length - 1].volume;
        signalSell = c.close < c.open * 0.985;
      }

      if (!inPosition && signalBuy) {
        inPosition = true;
        buyPrice = c.close;
      } else if (inPosition && signalSell) {
        inPosition = false;
        const tradeReturn = (c.close - buyPrice) / buyPrice;
        const pnl = capital * tradeReturn;
        capital += pnl;
        if (pnl > 0) {
          wins++;
          grossProfit += pnl;
        } else {
          losses++;
          grossLoss += Math.abs(pnl);
        }
      }
      equityCurve.push(capital);
    }

    const stratReturn = ((capital - 10000) / 10000) * 100;
    const totalTrades = wins + losses || 1;
    const winRate = (wins / totalTrades) * 100;
    const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : '3.42';

    const elStrat = document.getElementById('btStratReturn');
    if (elStrat) {
      elStrat.textContent = formatPct(stratReturn);
      elStrat.className = `mono-num ${stratReturn >= 0 ? 'val-up' : 'val-down'}`;
    }

    const elBench = document.getElementById('btBenchmarkReturn');
    if (elBench) {
      elBench.textContent = formatPct(benchmarkReturn);
      elBench.className = `mono-num ${benchmarkReturn >= 0 ? 'val-up' : 'val-down'}`;
    }

    const elWin = document.getElementById('btWinRate');
    if (elWin) elWin.textContent = winRate.toFixed(1) + '%';

    const elPF = document.getElementById('btProfitFactor');
    if (elPF) elPF.textContent = profitFactor;

    renderBacktestCanvas(equityCurve, candles);
    AppState.logEvent(`ALPHA LAB: Strategy backtest complete for ${sym} (${formatPct(stratReturn)})`, 'bull');
  }

  function renderBacktestCanvas(equityCurve, candles) {
    const canvas = document.getElementById('backtestCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const w = (canvas.parentElement?.clientWidth || 700) * dpr;
    const h = 220 * dpr;
    canvas.width = w;
    canvas.height = h;

    ctx.fillStyle = '#070B12';
    ctx.fillRect(0, 0, w, h);

    if (equityCurve.length < 5) return;

    const min = Math.min(...equityCurve, 10000) * 0.95;
    const max = Math.max(...equityCurve, 10000) * 1.05;
    const range = (max - min) || 1;

    // Draw grid
    ctx.strokeStyle = '#141C2E';
    ctx.lineWidth = 1 * dpr;
    for (let i = 0; i < 4; i++) {
      const y = (h / 4) * i + 10;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Strategy line (Cyan)
    ctx.beginPath();
    ctx.strokeStyle = '#00D2FF';
    ctx.lineWidth = 2 * dpr;
    equityCurve.forEach((val, idx) => {
      const x = (idx / (equityCurve.length - 1)) * (w - 20) + 10;
      const y = h - ((val - min) / range) * (h - 30) - 15;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Baseline marker ($10,000)
    const baseLineY = h - ((10000 - min) / range) * (h - 30) - 15;
    ctx.beginPath();
    ctx.setLineDash([3 * dpr, 3 * dpr]);
    ctx.strokeStyle = '#64748B';
    ctx.moveTo(10, baseLineY);
    ctx.lineTo(w - 10, baseLineY);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // ---------------------------------------------------------------------------
  // ORDER EXECUTION ENGINE
  // ---------------------------------------------------------------------------
  function executeOrder(symbol, type, shares) {
    const stock = MARKET_SYMBOLS[symbol];
    if (!stock) return { success: false, msg: 'Unknown Instrument' };

    shares = parseFloat(shares);
    if (isNaN(shares) || shares <= 0) return { success: false, msg: 'Invalid share quantity' };

    const executionPrice = stock.price;
    const totalCost = shares * executionPrice;

    if (type === 'BUY') {
      if (totalCost > AppState.cash) {
        return { success: false, msg: `Insufficient Buying Power. Required: ${formatMoney(totalCost)}, Available: ${formatMoney(AppState.cash)}` };
      }

      AppState.cash -= totalCost;
      const existing = AppState.holdings.find(h => h.symbol === symbol);
      if (existing) {
        const totalOldCost = existing.shares * existing.avgCost;
        const totalNewCost = totalOldCost + totalCost;
        existing.shares += shares;
        existing.avgCost = totalNewCost / existing.shares;
      } else {
        AppState.holdings.push({
          symbol,
          shares,
          avgCost: executionPrice,
          targetWeight: 15
        });
      }

      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      AppState.transactions.unshift({
        id: orderId,
        symbol,
        type: 'BUY',
        shares,
        price: executionPrice,
        total: totalCost,
        date: new Date().toLocaleString(),
        status: 'FILLED'
      });

      AppState.logEvent(`EXECUTED: BUY ${shares} ${symbol} @ ${formatMoney(executionPrice)} [Total: ${formatMoney(totalCost)}]`, 'bull');
      AudioFX.orderExecuted();
      showToast(`SUCCESS: BOUGHT ${shares} ${symbol} @ ${formatMoney(executionPrice)}`);

    } else if (type === 'SELL') {
      const existing = AppState.holdings.find(h => h.symbol === symbol);
      if (!existing || existing.shares < shares) {
        return { success: false, msg: `Insufficient shares to sell. Owned: ${existing ? existing.shares : 0}` };
      }

      AppState.cash += totalCost;
      const costBasisOfSold = shares * existing.avgCost;
      const realizedGain = totalCost - costBasisOfSold;
      AppState.realizedPL += realizedGain;

      existing.shares -= shares;
      if (existing.shares <= 0.00001) {
        AppState.holdings = AppState.holdings.filter(h => h.symbol !== symbol);
      }

      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      AppState.transactions.unshift({
        id: orderId,
        symbol,
        type: 'SELL',
        shares,
        price: executionPrice,
        total: totalCost,
        date: new Date().toLocaleString(),
        status: 'FILLED'
      });

      AppState.logEvent(`EXECUTED: SELL ${shares} ${symbol} @ ${formatMoney(executionPrice)} [Realized P&L: ${realizedGain >= 0 ? '+' : ''}${formatMoney(realizedGain)}]`, realizedGain >= 0 ? 'bull' : 'risk');
      AudioFX.orderExecuted();
      showToast(`SUCCESS: SOLD ${shares} ${symbol} @ ${formatMoney(executionPrice)}`);
    }

    AppState.save();
    updateCockpitMetrics();
    updateHoldingsTable(true);
    renderWatchlist();
    if (AppState.activeDeckPane === 'paneRebalance') renderRebalanceMatrix();
    if (AppState.activeDeckPane === 'paneDividend') renderDividendRadar();
    return { success: true };
  }

  // ---------------------------------------------------------------------------
  // CASH OPERATIONS
  // ---------------------------------------------------------------------------
  function handleCashOp(type, amount) {
    amount = parseFloat(amount);
    if (isNaN(amount) || amount <= 0) return { success: false, msg: 'Invalid amount' };

    if (type === 'DEPOSIT') {
      AppState.cash += amount;
      AppState.transactions.unshift({
        id: `CSH-${Math.floor(1000 + Math.random() * 9000)}`,
        symbol: 'USD',
        type: 'DEPOSIT',
        shares: 1,
        price: amount,
        total: amount,
        date: new Date().toLocaleString(),
        status: 'SETTLED'
      });
      AppState.logEvent(`CASH DEPOSIT: +${formatMoney(amount)} added to Buying Power`, 'bull');
      AudioFX.orderExecuted();
      showToast(`CASH DEPOSITED: +${formatMoney(amount)}`);
    } else {
      if (amount > AppState.cash) {
        return { success: false, msg: `Withdrawal exceeds available cash balance of ${formatMoney(AppState.cash)}` };
      }
      AppState.cash -= amount;
      AppState.transactions.unshift({
        id: `CSH-${Math.floor(1000 + Math.random() * 9000)}`,
        symbol: 'USD',
        type: 'WITHDRAW',
        shares: 1,
        price: amount,
        total: amount,
        date: new Date().toLocaleString(),
        status: 'SETTLED'
      });
      AppState.logEvent(`CASH WITHDRAWAL: -${formatMoney(amount)} withdrawn`, 'risk');
      showToast(`CASH WITHDRAWN: -${formatMoney(amount)}`);
    }

    AppState.save();
    updateCockpitMetrics();
    return { success: true };
  }

  // ---------------------------------------------------------------------------
  // PRICE ALERTS & SENTINEL
  // ---------------------------------------------------------------------------
  function addAlert(symbol, condition, target) {
    target = parseFloat(target);
    if (isNaN(target) || target <= 0) return false;
    AppState.alerts.push({
      id: `ALT-${Math.floor(100 + Math.random() * 900)}`,
      symbol,
      condition,
      target,
      active: true,
      triggered: false
    });
    AppState.save();
    renderAlerts();
    AppState.logEvent(`SENTINEL ALERT ARMED: ${symbol} ${condition} ${formatMoney(target)}`, 'neural');
    showToast(`ALERT ARMED: ${symbol} ${condition} ${formatMoney(target)}`);
    return true;
  }

  function renderAlerts() {
    const container = document.getElementById('alertsListContainer');
    if (!container) return;

    if (AppState.alerts.length === 0) {
      container.innerHTML = `<div style="padding:10px; color:var(--text-dim); text-align:center;">NO SENTINEL ALERTS ARMED</div>`;
      return;
    }

    let html = '';
    AppState.alerts.forEach((alt, idx) => {
      html += `
        <div class="alert-item ${alt.triggered ? 'triggered' : ''}">
          <div>
            <strong style="color:var(--text-primary);">${alt.symbol}</strong>
            <span class="mono-num" style="color:var(--secondary-cyan); margin-left:4px;">${alt.condition} ${formatMoney(alt.target)}</span>
            <div style="font-size:9px; color:${alt.triggered ? 'var(--volatility-magenta)' : 'var(--text-dim)'};">
              ${alt.triggered ? '● TRIGGER HIT (1m ago)' : '● MONITORING 100Hz'}
            </div>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="window.deleteAlert(${idx})" style="padding:2px 6px;">✕</button>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  // ---------------------------------------------------------------------------
  // ALGORITHMIC EVENT STREAM RENDERING
  // ---------------------------------------------------------------------------
  function renderEventStream() {
    const list = document.getElementById('eventStreamList');
    if (!list) return;

    let html = '';
    AppState.eventLogs.slice(0, 15).forEach(evt => {
      html += `
        <div class="stream-item ${evt.type}">
          <span class="stream-time">[${evt.time}]</span>
          <span>${evt.text}</span>
        </div>
      `;
    });
    list.innerHTML = html;
  }

  // ---------------------------------------------------------------------------
  // TRANSACTIONS HISTORY AUDIT LOG MODAL
  // ---------------------------------------------------------------------------
  function renderAuditLedger() {
    const tbody = document.getElementById('auditTableBody');
    if (!tbody) return;

    if (AppState.transactions.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:16px;">NO HISTORICAL ORDERS RECORDED</td></tr>`;
      return;
    }

    let html = '';
    AppState.transactions.forEach(tx => {
      const isBuy = tx.type === 'BUY' || tx.type === 'DEPOSIT';
      html += `
        <tr>
          <td class="mono-num" style="color:var(--text-dim);">${tx.id}</td>
          <td><strong style="color:var(--text-primary);">${tx.symbol}</strong></td>
          <td><span class="tag-badge ${isBuy ? 'tag-emerald' : 'tag-crimson'}">${tx.type}</span></td>
          <td class="mono-num">${formatNumber(tx.shares, 4)}</td>
          <td class="mono-num">${formatMoney(tx.price)}</td>
          <td class="mono-num" style="font-weight:700;">${formatMoney(tx.total)}</td>
          <td style="color:var(--text-dim); font-size:10px;">${tx.date}</td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  }

  // ---------------------------------------------------------------------------
  // EXPORT & IMPORT DATA
  // ---------------------------------------------------------------------------
  function exportPortfolioJSON() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(AppState, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `synapse_portfolio_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchor.click();
    showToast('PORTFOLIO JSON EXPORTED');
  }

  function exportTransactionsCSV() {
    if (AppState.transactions.length === 0) {
      showToast('NO TRANSACTIONS TO EXPORT');
      return;
    }
    const headers = ['Order ID', 'Symbol', 'Type', 'Shares', 'Price', 'Total', 'Timestamp', 'Status'];
    const rows = AppState.transactions.map(t => [
      t.id, t.symbol, t.type, t.shares, t.price, t.total, `"${t.date}"`, t.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `transactions_audit_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    showToast('AUDIT CSV EXPORTED');
  }

  function importPortfolioJSON(fileContent) {
    try {
      const parsed = JSON.parse(fileContent);
      if (typeof parsed.cash === 'number' && Array.isArray(parsed.holdings)) {
        AppState.cash = parsed.cash;
        AppState.holdings = parsed.holdings;
        if (Array.isArray(parsed.transactions)) AppState.transactions = parsed.transactions;
        if (typeof parsed.realizedPL === 'number') AppState.realizedPL = parsed.realizedPL;
        AppState.save();
        updateCockpitMetrics();
        updateHoldingsTable(true);
        renderWatchlist();
        showToast('PORTFOLIO RESTORED SUCCESSFULLY');
        return true;
      }
    } catch (e) {
      showToast('ERROR: INVALID JSON STRUCTURE');
    }
    return false;
  }

  // ---------------------------------------------------------------------------
  // TOAST NOTIFICATIONS
  // ---------------------------------------------------------------------------
  function showToast(msg) {
    let toast = document.getElementById('terminalToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'terminalToast';
      toast.className = 'terminal-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span style="color:var(--secondary-cyan);">[TELEMETRY]</span> <span>${msg}</span>`;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  }

  // ---------------------------------------------------------------------------
  // SELECTION & NAVIGATION ACTIONS
  // ---------------------------------------------------------------------------
  function selectSymbol(sym) {
    if (!MARKET_SYMBOLS[sym]) return;
    AppState.selectedSymbol = sym;

    const rows = document.querySelectorAll('.watchlist-row');
    rows.forEach(r => {
      r.classList.toggle('selected', r.getAttribute('data-symbol') === sym);
    });

    const stock = MARKET_SYMBOLS[sym];
    const chg = stock.price - stock.prevClose;
    const chgPct = (chg / stock.prevClose) * 100;
    const isUp = chg >= 0;

    const symEl = document.getElementById('chartActiveSymbol');
    if (symEl) symEl.textContent = `${sym} // ${stock.name}`;

    const priceEl = document.getElementById('chartActivePrice');
    if (priceEl) {
      priceEl.textContent = formatMoney(stock.price);
      priceEl.setAttribute('data-symbol-price', sym);
    }

    const chgEl = document.getElementById('chartActiveChg');
    if (chgEl) {
      chgEl.className = `chart-chg mono-num ${isUp ? 'val-up' : 'val-down'}`;
      chgEl.textContent = `${isUp ? '+' : ''}${formatMoney(chg)} (${formatPct(chgPct)})`;
    }

    const orderSymInput = document.getElementById('fastOrderSymbol');
    if (orderSymInput) orderSymInput.value = sym;

    const alertSymSelect = document.getElementById('alertSymbolSelect');
    if (alertSymSelect) alertSymSelect.value = sym;

    const alertTargetInput = document.getElementById('alertTargetPriceInput');
    if (alertTargetInput && (!alertTargetInput.value || alertTargetInput.value === '0')) {
      alertTargetInput.value = (stock.price * 1.05).toFixed(2);
    }

    renderOrderBook();
    renderMainChart();
  }

  // ---------------------------------------------------------------------------
  // INITIALIZATION & EVENT LISTENERS
  // ---------------------------------------------------------------------------
  function initDOMBindings() {
    AppState.load();

    // Currency Switcher
    const currSelect = document.getElementById('currencySelector');
    if (currSelect) {
      currSelect.value = activeCurrency;
      currSelect.addEventListener('change', (e) => {
        activeCurrency = e.target.value;
        AppState.save();
        updateCockpitMetrics();
        updateHoldingsTable(true);
        updateWatchlistPrices();
        renderOrderBook();
        renderMainChart();
        showToast(`BASE CURRENCY SWITCHED: ${activeCurrency}`);
      });
    }

    // Center Deck Tab Switching
    const deckTabs = document.querySelectorAll('.deck-tab-btn');
    deckTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        deckTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const targetPane = tab.getAttribute('data-pane');
        AppState.activeDeckPane = targetPane;

        document.querySelectorAll('.deck-content-pane').forEach(p => p.classList.remove('active'));
        const paneEl = document.getElementById(targetPane);
        if (paneEl) paneEl.classList.add('active');

        if (targetPane === 'paneRebalance') renderRebalanceMatrix();
        else if (targetPane === 'paneDividend') renderDividendRadar();
        else if (targetPane === 'paneBacktest') runStrategyBacktest();
        else if (targetPane === 'paneStress') applyCustomStress(0);
      });
    });

    // Sound toggle
    const sfxBtn = document.getElementById('btnToggleSFX');
    if (sfxBtn) {
      sfxBtn.addEventListener('click', () => {
        AudioFX.enabled = !AudioFX.enabled;
        AppState.soundEnabled = AudioFX.enabled;
        sfxBtn.textContent = `SFX: ${AudioFX.enabled ? 'ON' : 'OFF'}`;
        sfxBtn.classList.toggle('active', AudioFX.enabled);
        if (AudioFX.enabled) AudioFX.beep(600, 0.1);
      });
    }

    // Timeframe selector buttons
    const tfBtns = document.querySelectorAll('.tf-btn');
    tfBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tfBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        AppState.chartTimeframe = btn.getAttribute('data-tf');
        renderMainChart();
      });
    });

    // Chart style toggles
    const styleBtns = document.querySelectorAll('.chart-style-btn');
    styleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        styleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        AppState.chartStyle = btn.getAttribute('data-style');
        renderMainChart();
      });
    });

    // Neural Cone Toggle
    const toggleCone = document.getElementById('toggleNeuralCone');
    if (toggleCone) {
      toggleCone.addEventListener('click', () => {
        AppState.showNeuralCone = !AppState.showNeuralCone;
        toggleCone.classList.toggle('active', AppState.showNeuralCone);
        renderMainChart();
      });
    }

    // Target Vectors Toggle
    const toggleTargets = document.getElementById('toggleTargets');
    if (toggleTargets) {
      toggleTargets.addEventListener('click', () => {
        AppState.showTargets = !AppState.showTargets;
        toggleTargets.classList.toggle('active', AppState.showTargets);
        renderMainChart();
      });
    }

    // EMA Toggle
    const toggleEMA = document.getElementById('toggleEMA');
    if (toggleEMA) {
      toggleEMA.addEventListener('click', () => {
        AppState.showEMA = !AppState.showEMA;
        toggleEMA.classList.toggle('active', AppState.showEMA);
        renderMainChart();
      });
    }

    // Bollinger Toggle
    const toggleBollinger = document.getElementById('toggleBollinger');
    const legendBoll = document.getElementById('legendBollinger');
    if (toggleBollinger) {
      toggleBollinger.addEventListener('click', () => {
        AppState.showBollinger = !AppState.showBollinger;
        toggleBollinger.classList.toggle('active', AppState.showBollinger);
        if (legendBoll) legendBoll.style.display = AppState.showBollinger ? 'flex' : 'none';
        renderMainChart();
      });
    }

    // Simulation Speed buttons
    const simBtns = document.querySelectorAll('.sim-speed-btn');
    simBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const spd = parseInt(btn.getAttribute('data-speed'), 10);
        setSimSpeed(spd);
      });
    });

    // Watchlist Filter tabs
    const wlTabs = document.querySelectorAll('.watchlist-tab');
    wlTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        wlTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        AppState.filterCategory = tab.getAttribute('data-cat');
        renderWatchlist();
      });
    });

    // Watchlist search
    const wlSearch = document.getElementById('watchlistSearchInput');
    if (wlSearch) {
      wlSearch.addEventListener('input', () => {
        renderWatchlist();
      });
    }

    // Fast Execution Order Pad
    const btnFastBuy = document.getElementById('btnFastBuy');
    if (btnFastBuy) {
      btnFastBuy.addEventListener('click', () => {
        const shares = parseFloat(document.getElementById('fastOrderShares')?.value || 0);
        const sym = AppState.selectedSymbol;
        const res = executeOrder(sym, 'BUY', shares);
        if (!res.success) alert(res.msg);
      });
    }

    const btnFastSell = document.getElementById('btnFastSell');
    if (btnFastSell) {
      btnFastSell.addEventListener('click', () => {
        const shares = parseFloat(document.getElementById('fastOrderShares')?.value || 0);
        const sym = AppState.selectedSymbol;
        const res = executeOrder(sym, 'SELL', shares);
        if (!res.success) alert(res.msg);
      });
    }

    // Quick % cash buttons in order pad
    const pctBtns = document.querySelectorAll('.pct-btn');
    pctBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const pct = parseFloat(btn.getAttribute('data-pct')) / 100;
        const sym = AppState.selectedSymbol;
        const stock = MARKET_SYMBOLS[sym];
        if (!stock) return;
        const budget = AppState.cash * pct;
        const calcShares = Math.floor(budget / stock.price);
        const sharesInput = document.getElementById('fastOrderShares');
        if (sharesInput) {
          sharesInput.value = Math.max(1, calcShares);
          updateFastOrderEst();
        }
      });
    });

    const fastSharesInput = document.getElementById('fastOrderShares');
    if (fastSharesInput) {
      fastSharesInput.addEventListener('input', updateFastOrderEst);
    }

    function updateFastOrderEst() {
      const shares = parseFloat(fastSharesInput?.value || 0);
      const stock = MARKET_SYMBOLS[AppState.selectedSymbol];
      if (!stock) return;
      const total = shares * stock.price;
      const estEl = document.getElementById('fastOrderTotalEst');
      if (estEl) estEl.textContent = formatMoney(total);
    }

    // Add Price Alert Form
    const btnAddAlert = document.getElementById('btnAddAlert');
    if (btnAddAlert) {
      btnAddAlert.addEventListener('click', () => {
        const sym = document.getElementById('alertSymbolSelect')?.value || AppState.selectedSymbol;
        const cond = document.getElementById('alertConditionSelect')?.value || '>=';
        const target = document.getElementById('alertTargetPriceInput')?.value || 0;
        addAlert(sym, cond, target);
      });
    }

    // Keyboard Shortcuts Listener
    window.addEventListener('keydown', (e) => {
      // Don't trigger if user is actively typing in an input
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      if (e.key === 'b' || e.key === 'B') {
        openOrderModal(AppState.selectedSymbol, 'BUY');
      } else if (e.key === 's' || e.key === 'S') {
        openOrderModal(AppState.selectedSymbol, 'SELL');
      } else if (e.code === 'Space') {
        e.preventDefault();
        setSimSpeed(AppState.simSpeed === 0 ? 1 : 0);
      } else if (e.key === '/') {
        e.preventDefault();
        document.getElementById('watchlistSearchInput')?.focus();
      } else if (e.key === '?') {
        openModal('hotkeysModal');
      } else if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));
      }
    });

    setupModalHandlers();

    setInterval(updateClockHUD, 1000);
    updateClockHUD();

    selectSymbol(AppState.selectedSymbol);
    updateCockpitMetrics();
    updateHoldingsTable(true);
    renderWatchlist();
    renderAlerts();
    renderNewsWire();
    renderEventStream();
    setupChartMouseEvents();

    window.addEventListener('resize', () => {
      renderMainChart();
      const stats = calculatePortfolioStats();
      renderAllocationDonut(stats);
      if (AppState.activeDeckPane === 'paneBacktest') renderBacktestCanvas([], []);
    });

    setSimSpeed(1);
  }

  function updateClockHUD() {
    const el = document.getElementById('liveMarketClock');
    if (!el) return;
    const now = new Date();
    el.textContent = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]} UTC`;
  }

  // ---------------------------------------------------------------------------
  // MODAL CONTROLS & WIRING
  // ---------------------------------------------------------------------------
  function setupModalHandlers() {
    const btnNewOrder = document.getElementById('btnOpenNewOrderModal');
    if (btnNewOrder) {
      btnNewOrder.addEventListener('click', () => {
        openOrderModal(AppState.selectedSymbol, 'BUY');
      });
    }

    const btnSubmitOrder = document.getElementById('btnSubmitModalOrder');
    if (btnSubmitOrder) {
      btnSubmitOrder.addEventListener('click', () => {
        const sym = document.getElementById('modalOrderSymbol')?.value;
        const type = document.getElementById('modalOrderType')?.value;
        const shares = document.getElementById('modalOrderShares')?.value;
        const res = executeOrder(sym, type, shares);
        if (res.success) {
          closeModal('orderModal');
        } else {
          alert(res.msg);
        }
      });
    }

    const btnOpenCash = document.getElementById('btnOpenCashModal');
    if (btnOpenCash) {
      btnOpenCash.addEventListener('click', () => {
        const balEl = document.getElementById('modalCashAvail');
        if (balEl) balEl.textContent = formatMoney(AppState.cash);
        openModal('cashModal');
      });
    }

    const btnSubmitCash = document.getElementById('btnSubmitCashOp');
    if (btnSubmitCash) {
      btnSubmitCash.addEventListener('click', () => {
        const type = document.getElementById('cashOpType')?.value;
        const amount = document.getElementById('cashOpAmount')?.value;
        const res = handleCashOp(type, amount);
        if (res.success) {
          closeModal('cashModal');
        } else {
          alert(res.msg);
        }
      });
    }

    const btnAudit = document.getElementById('btnOpenAuditModal');
    if (btnAudit) {
      btnAudit.addEventListener('click', () => {
        renderAuditLedger();
        openModal('auditModal');
      });
    }

    const btnPresets = document.getElementById('btnOpenPresetsModal');
    if (btnPresets) {
      btnPresets.addEventListener('click', () => {
        openModal('presetsModal');
      });
    }

    const btnExportImport = document.getElementById('btnOpenExportModal');
    if (btnExportImport) {
      btnExportImport.addEventListener('click', () => {
        openModal('exportModal');
      });
    }

    const btnHotkeys = document.getElementById('btnOpenHotkeysModal');
    if (btnHotkeys) {
      btnHotkeys.addEventListener('click', () => {
        openModal('hotkeysModal');
      });
    }

    document.querySelectorAll('.modal-close-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-modal-id');
        if (modalId) closeModal(modalId);
      });
    });

    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('open');
        }
      });
    });
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('open');
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('open');
  }

  // ---------------------------------------------------------------------------
  // GLOBAL WINDOW EXPORTS
  // ---------------------------------------------------------------------------
  window.selectSymbol = selectSymbol;
  window.sortHoldings = function (key) {
    if (AppState.tableSortKey === key) {
      AppState.tableSortDir = AppState.tableSortDir === 'desc' ? 'asc' : 'desc';
    } else {
      AppState.tableSortKey = key;
      AppState.tableSortDir = 'desc';
    }
    const btns = document.querySelectorAll('.table-tab-btn');
    btns.forEach(btn => {
      const oc = btn.getAttribute('onclick') || '';
      btn.classList.toggle('active', oc.includes(`'${key}'`));
    });
    updateHoldingsTable(true);
  };
  window.deleteAlert = function (idx) {
    AppState.alerts.splice(idx, 1);
    AppState.save();
    renderAlerts();
  };
  window.openOrderModal = function (sym, type = 'BUY') {
    const symSelect = document.getElementById('modalOrderSymbol');
    if (symSelect) symSelect.value = sym;
    const typeSelect = document.getElementById('modalOrderType');
    if (typeSelect) typeSelect.value = type;
    const sharesInput = document.getElementById('modalOrderShares');
    if (sharesInput) sharesInput.value = '10';
    openModal('orderModal');
  };
  window.loadPreset = function (key) {
    AppState.loadPreset(key);
    updateCockpitMetrics();
    updateHoldingsTable(true);
    renderWatchlist();
    closeModal('presetsModal');
    showToast(`LOADED PRESET: ${PRESETS[key]?.name}`);
  };
  window.resetPortfolio = function () {
    if (confirm('RESET ALL DATA? This will wipe your positions and reset to initial factory state.')) {
      localStorage.removeItem(STORAGE_KEY);
      AppState.cash = 50000.00;
      AppState.realizedPL = 0;
      AppState.holdings = [];
      AppState.transactions = [];
      AppState.save();
      updateCockpitMetrics();
      updateHoldingsTable(true);
      renderWatchlist();
      closeModal('presetsModal');
      showToast('TERMINAL RESET TO CLEAN SLATE ($50k Cash)');
    }
  };
  window.exportPortfolioJSON = exportPortfolioJSON;
  window.exportTransactionsCSV = exportTransactionsCSV;
  window.handleImportJSON = function (event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      importPortfolioJSON(e.target.result);
      closeModal('exportModal');
    };
    reader.readAsText(file);
  };

  // Quant Studio Exports
  window.applyStressScenario = applyStressScenario;
  window.applyCustomStress = applyCustomStress;
  window.resetStressScenario = resetStressScenario;
  window.updateTargetWeight = updateTargetWeight;
  window.executeAutoRebalance = executeAutoRebalance;
  window.runStrategyBacktest = runStrategyBacktest;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDOMBindings);
  } else {
    initDOMBindings();
  }

})();
