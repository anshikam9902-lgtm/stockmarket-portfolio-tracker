# Stock Portfolio App

Backend REST API for recording stock transactions and tracking holdings, cost basis and profit/loss.
Stack: Node.js (>=20), Express 5, MongoDB (Mongoose), JWT auth, Zod validation.

## Run locally

```bash
cd backend
npm install
cp .env.example .env     # then fill in MONGO_URI and JWT_SECRET
npm run dev              # or: npm start
npm test
```

Generate a JWT secret (min 32 chars):
`node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

**Never commit `.env`.** It is git-ignored; use `.env.example` as the template.

## API

All `/api/transactions` and `/api/portfolio` routes need `Authorization: Bearer <token>`.

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | `{ fullName, email, password (8-72 bytes), risk_preference? LOW\|MODERATE\|HIGH }` |
| POST | `/api/auth/login` | `{ email, password }` -> `{ ..., token }` |
| GET | `/api/auth/me` | Current user |
| GET | `/api/transactions` | Paginated list. Query: `page`, `limit` (max 200), `ticker`, `type` |
| POST | `/api/transactions` | `{ tickerSymbol, transactionType: BUY\|SELL, quantity, executionPrice, tradeDate? }` |
| PATCH | `/api/transactions/:id` | Edit any of the fields above |
| DELETE | `/api/transactions/:id` | Delete |
| GET | `/api/portfolio` | Holdings, average cost, realised P/L. Optional `?prices=AAPL:190.5,MSFT:410` adds market value and unrealised P/L |
| GET | `/health` | Liveness + DB status |

Rules enforced by the API:
- A SELL (or an edit/delete) that would leave a ticker with a negative position at any point in time is rejected with `422`.
- `quantity` may be fractional; `quantity` and `executionPrice` must be > 0; `tradeDate` can be back-dated but not in the future.
- Cost basis uses the weighted **average cost** method. Fees and taxes are not modelled.

## Configuration

See `.env.example`. Notable settings: `CORS_ORIGIN` (allowed browser origins), `TRUST_PROXY` (set to `1` behind a reverse proxy so rate limiting sees real client IPs), `JWT_EXPIRES_IN`, `BCRYPT_ROUNDS`.
# SYNAPSE // QUANT TERMINAL (v4.8.2-PROD)
### High-Frequency Algorithmic Stock Market Portfolio Tracker

A high-performance stock market portfolio tracker and quantitative execution HUD designed strictly according to the **Cyber Terminal Neon** specification.

---

## ⚡ Quick Start

### Option 1: Direct Browser Launch (Zero dependencies required)
Simply double-click **`index.html`** or drag it into any modern web browser (Google Chrome, Edge, Brave, Safari, Firefox).

### Option 2: Local HTTP Server (Python)
Run the included python development server:
```bash
python server.py
```
This automatically serves the terminal at `http://localhost:8080` with cache-free live reloading.

---

## 🖥️ System Architecture & Features

### 1. High-Frequency Real-Time Market Simulation
- **Live Tick Engine**: Stochastic Brownian motion with micro-shocks updating prices in real-time across stocks, ETFs, and crypto pairs.
- **Microsecond Price Flashes**: Dynamic green (`#00F5A0`) and red (`#FF3366`) flash pulses on price ticks across the Watchlist, Holdings, Order Book, and Top Ticker Tape.
- **Simulation Speed Controls**: `PAUSE`, `1X (Real-time)`, `5X`, `10X (Stress test)`.
- **Top Ticker Marquee**: Live scrolling tape featuring global indices (SPX, NDX, DJI, VIX, US10Y, DXY) and major equity benchmarks.

### 2. Multi-Timeframe Interactive Chart Engine
- **Japanese Candlestick (OHLC)**: Sharp volume-backed price discovery bars.
- **Neon Area Mode**: High-intensity luminescent cyan line with vertical gradient telemetry.
- **Neural Forecast Cones & Fan Overlays**: Forward-projected Bayesian uncertainty cones with stepped opacity bands (`rgba(0, 210, 255, 0.16)` to `0.06`), mean vector trajectory, and 30-day projected alpha.
- **Target Strike Vectors**: Dotted 1px neon trails terminating in sharp crosshair nodes marking target profit and stop-loss boundaries.
- **Technical Indicators**: 20 SMA (Cyan) & 50 EMA (Violet) with interactive crosshair HUD tooltips.

### 3. Quantitative Risk & Cockpit Telemetry
- **Net Portfolio Equity & Buying Power**: Real-time asset valuation with cash allocation percentages.
- **Unrealized vs Realized P&L**: Live gain/loss calculations, return on cost basis, and closed-trade audit records.
- **Quant Risk Metrics**: Beta vs SPY benchmark, Sharpe Ratio, Sortino Ratio, and Daily Value-at-Risk (VaR 95%).
- **Neural Model Regime**: Real-time AI inference status (`BULLISH EXPANSION`, `CORRECTION ABSORPTION`) with confidence ratings.

### 4. Direct Market Access (DMA) Execution Pad & Order Book
- **Level-2 Depth Ladder**: 10-level real-time bid/ask order book with proportional depth shading and dynamic spread calculations.
- **Fast Execution Pad**: Instant `BUY (LONG)` and `SELL (SHORT)` with quick-fill percentage allocations (`25%`, `50%`, `75%`, `MAX CASH`).
- **Comprehensive Order Modal**: Full order router with custom share quantities and automated cost calculations.

### 5. Sentinel Price Alerts
- Set upper resistance (`>=`) or lower stop (`<=`) price triggers for any tracked instrument.
- Audio-visual alert warning system with Web Audio synthesized alarms when thresholds are breached.

### 6. Portfolio Presets & Data Portability
- **Built-in Presets**:
  - `AI & Semiconductor Alpha` (NVDA, PLTR, MSFT, AMD, AAPL, COIN, BTC)
  - `Balanced Macro Shield` (SPY, QQQ, AAPL, AMZN)
  - `High-Beta Quant Momentum` (COIN, TSLA, BTC/USD, ETH/USD, PLTR)
  - `Clean Slate` ($50,000 cash for manual construction)
- **Local Persistence**: Automatic saving to browser `localStorage`.
- **Export & Import**: Download complete JSON portfolio backups or chronological CSV audit logs.

### 7. Cyberpunk Web Audio Synthesizer
- Built-in Web Audio API synthesizer generating real-time telemetry clicks, order execution whooshes, and sentinel breach alarms (no audio files needed).
- Toggle switch (`SFX: ON / OFF`) in the top navigation bar.

---

## 🎨 Adherence to Cyber Terminal Neon Design System

- **Zero Roundedness**: Strict `0px` border-radius enforced across all buttons, panels, tables, chips, inputs, and modals.
- **Machined Angular Aesthetics**: 90-degree perimeters and 45-degree tactical chamfers.
- **Photonic Color Palette**:
  - Void Canvas: `#090D14`
  - Substrate Panels: `#0D131F`
  - Elevated Cards: `#141C2E`
  - Algorithmic Core: Electric Violet (`#A855F7`)
  - Neural Forecast: Electric Cyan (`#00D2FF`)
  - Alpha Bullish: Neon Emerald (`#00F5A0`)
  - Bearish Risk: Neon Crimson (`#FF3366`)
  - Volatility Sentinel: Neon Magenta (`#EC4899`)
- **Typography**: `Space Grotesk` for geometric modernism headers; `Space Mono` for all tabular financial quotations and telemetry.
