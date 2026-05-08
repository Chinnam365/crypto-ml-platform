const {
  getDoge5mCandles,
  getDoge15mCandles,
  getDoge1hCandles,
  getBtc15mCandles,
} = require("../market/binance");
const {
  calculateATR,
} = require("../indicators/atr");

const {
  formatCandles,
} = require("../market/formatter");

const {
  calculateEMA,
} = require("../indicators/ema");

const {
  calculateRSI,
} = require("../indicators/rsi");

const {
  calculateVolatility,
} = require("../indicators/volatility");

const {
  predictTrade,
} = require("../ml/predictTrade");

// =====================================
// DOGE STRATEGY
// =====================================

async function runDogeStrategy() {

  console.log(
    "Running ML Doge strategy..."
  );

  // ===================================
  // LOAD MARKET DATA
  // ===================================

  const raw5m =
    await getDoge5mCandles(200);

  const raw15m =
    await getDoge15mCandles(100);

  const raw1h =
    await getDoge1hCandles(100);

  const rawBtc =
    await getBtc15mCandles(100);

  const candles5m =
    formatCandles(raw5m);

  const candles15m =
    formatCandles(raw15m);

  const candles1h =
    formatCandles(raw1h);

  const btcCandles =
    formatCandles(rawBtc);

  // ===================================
  // CLOSES
  // ===================================

  const closes5m =
    candles5m.map(
      (c) => c.close
    );

  const closes15m =
    candles15m.map(
      (c) => c.close
    );

  const closes1h =
    candles1h.map(
      (c) => c.close
    );

  const btcCloses =
    btcCandles.map(
      (c) => c.close
    );

  // ===================================
  // PRICE
  // ===================================

  const latestPrice =
    closes5m[
      closes5m.length - 1
    ];

  // ===================================
  // EMA
  // ===================================

  const ema5m20 =
    calculateEMA(
      closes5m.slice(-20),
      20
    );

  const ema5m50 =
    calculateEMA(
      closes5m.slice(-50),
      50
    );

  const ema15m20 =
    calculateEMA(
      closes15m.slice(-20),
      20
    );

  const ema15m50 =
    calculateEMA(
      closes15m.slice(-50),
      50
    );

  const ema1h20 =
    calculateEMA(
      closes1h.slice(-20),
      20
    );

  const ema1h50 =
    calculateEMA(
      closes1h.slice(-50),
      50
    );

  const btcEma20 =
    calculateEMA(
      btcCloses.slice(-20),
      20
    );

  const btcEma50 =
    calculateEMA(
      btcCloses.slice(-50),
      50
    );

  // ===================================
  // RSI
  // ===================================

  const rsi =
    calculateRSI(
      closes5m.slice(-15)
    );

  // ===================================
  // VOLATILITY
  // ===================================

  const volatility =
    calculateVolatility(
      candles5m,
      10
    );

  // ===================================
// ATR
// ===================================

const atr =
  calculateATR(
    candles5m,
    14
  );

// ===================================
// LAST CANDLE
// ===================================

const lastCandle =
  candles5m[
    candles5m.length - 1
  ];

const candleBody = Math.abs(

  lastCandle.close -
  lastCandle.open
);

const upperWick =

  lastCandle.high -

  Math.max(
    lastCandle.open,
    lastCandle.close
  );

const lowerWick =

  Math.min(
    lastCandle.open,
    lastCandle.close
  ) -

  lastCandle.low;

// ===================================
// EMA SLOPES
// ===================================

const previousEma5m20 =
  calculateEMA(
    closes5m.slice(-21, -1),
    20
  );

const emaSlope =

  ema5m20 -
  previousEma5m20;

// ===================================
// RSI SLOPE
// ===================================

const previousRsi =
  calculateRSI(
    closes5m.slice(-16, -1)
  );

const rsiSlope =
  rsi - previousRsi;

// ===================================
// DISTANCE FROM EMA
// ===================================

const distanceFromEma =

  latestPrice -
  ema5m20;
  
  // ===================================
  // CONDITIONS
  // ===================================

  const bullish5m =
    ema5m20 > ema5m50;

  const bullish15m =
    ema15m20 > ema15m50;

  const bullish1h =
    ema1h20 > ema1h50;

  const btcBullish =
    btcEma20 > btcEma50;

  // ===================================
  // SCORE
  // ===================================

  let score = 0;

  if (bullish5m) score += 2;

  if (bullish15m) score += 2;

  if (bullish1h) score += 2;

  if (btcBullish) score += 2;

  if (
    rsi >= 50 &&
    rsi <= 65
  ) {
    score += 2;
  }

  // ===================================
  // ML FEATURES
  // ===================================

  const features = {

    rsi,

    volatility,

    score,

    atr,

candleBody,

upperWick,

lowerWick,

emaSlope,

rsiSlope,

distanceFromEma,
    
    bullish5m:
      bullish5m ? 1 : 0,

    bullish15m:
      bullish15m ? 1 : 0,

    bullish1h:
      bullish1h ? 1 : 0,

    btcBullish:
      btcBullish ? 1 : 0,

    ema5mSpread:
      ema5m20 - ema5m50,

    ema15mSpread:
      ema15m20 - ema15m50,

    ema1hSpread:
      ema1h20 - ema1h50,
  };

  // ===================================
  // ML PREDICTION
  // ===================================

  const prediction =
    predictTrade(
      features
    );

  // ===================================
  // DECISION
  // ===================================

  const decision =
    prediction.decision;

  // ===================================
  // RETURN
  // ===================================

return {
  symbol: "DOGEUSDT",

  latestPrice,

  rsi,

  volatility,

  score,

  bullish5m,

  bullish15m,

  bullish1h,

  btcBullish,

  ...prediction,
};
}

module.exports = {
  runDogeStrategy,
};
