const pool =
  require("../db/db");

const {
  calculateEMA,
} = require("../indicators/ema");

/*
==================================================
GET TREND FROM CANDLE SET
==================================================
*/

function calculateTrend(
  closes
) {

  if (
    !closes ||
    closes.length < 20
  ) {
    return "UNKNOWN";
  }

  const ema =
    calculateEMA(closes);

  const currentPrice =
    closes[
      closes.length - 1
    ];

  const distance =
    ((currentPrice - ema) / ema) * 100;

  if (distance > 0.35) {
    return "BULLISH";
  }

  if (distance < -0.35) {
    return "BEARISH";
  }

  return "SIDEWAYS";
}

/*
==================================================
AGGREGATE CANDLES
==================================================
*/

function aggregateCandles(
  candles,
  groupSize
) {

  const grouped = [];

  for (
    let i = 0;
    i < candles.length;
    i += groupSize
  ) {
};
