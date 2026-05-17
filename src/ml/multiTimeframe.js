const {
  getCandles,
} = require("../market/binance");

const {
  detectTrend,
} = require("../indicators/trend");

async function getMultiTimeframeAnalysis(symbol) {

  // ==========================================
  // 15m
  // ==========================================

  const candles15m =
    await getCandles(
      symbol,
      "15m",
      100
    );

  const closes15m =
    candles15m.map(
      c => Number(c.close)
    );

  const trend15m =
    detectTrend(closes15m);

  // ==========================================
  // 1h
  // ==========================================

  const candles1h =
    await getCandles(
      symbol,
      "1h",
      100
    );

  const closes1h =
    candles1h.map(
      c => Number(c.close)
    );

  const trend1h =
    detectTrend(closes1h);

  // ==========================================
  // 4h
  // ==========================================

  const candles4h =
    await getCandles(
      symbol,
      "4h",
      100
    );

  const closes4h =
    candles4h.map(
      c => Number(c.close)
    );

  const trend4h =
    detectTrend(closes4h);

  // ==========================================
  // CONSENSUS
  // ==========================================

  let bullish = 0;

  let bearish = 0;

  [
    trend15m,
    trend1h,
    trend4h,
  ].forEach(trend => {

    if (
      trend === "BULLISH"
    ) {

      bullish++;
    }

    if (
      trend === "BEARISH"
    ) {

      bearish++;
    }
  });

  let overallTrend =
    "SIDEWAYS";

  if (bullish >= 2) {

    overallTrend =
      "BULLISH";
  }

  if (bearish >= 2) {

    overallTrend =
      "BEARISH";
  }

  return {

    trend15m,

    trend1h,

    trend4h,

    overallTrend,
  };
}

module.exports = {
  getMultiTimeframeAnalysis,
};
