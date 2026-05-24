const pool =
  require("../db/db");
const {
  detectMarketRegime,
} = require("./marketRegime");
const {
  calculateRSI,
} = require("../indicators/rsi");

const {
  calculateEMA,
} = require("../indicators/ema");
const {
  calculateVolatility,
} = require("./volatilityEngine");

const {
  calculateSignalQuality,
} = require("../ml/signalQualityEngine");

const {
  generateTradeDecision,
} = require("../ml/tradeDecisionEngine");

async function generateFeatures(
  symbol = "BTCUSDT"
) {

  try {

    // =========================
    // LOAD RECENT CANDLES
    // =========================

    const result =
      await pool.query(

        `
        SELECT *
        FROM market_candles
        WHERE symbol = $1
        ORDER BY candle_time ASC
        LIMIT 50
        `,

        [symbol]
      );

    const candles =
      result.rows;

    if (
      candles.length < 20
    ) {

      return null;
    }

    // =========================
    // EXTRACT CLOSES
    // =========================

    const closes =
      candles.map(

        candle =>
          Number(
            candle.close
          )
      );

    // =========================
    // INDICATORS
    // =========================

    const rsi =
      calculateRSI(
        closes
      );

    const ema =
      calculateEMA(
        closes
      );

    // =========================
    // CURRENT PRICE
    // =========================

    const currentPrice =
      closes[
        closes.length - 1
      ];

    // =========================
    // EMA DISTANCE
    // =========================

    const emaDistance =
      (
        (
          currentPrice -
          ema
        ) / ema
      ) * 100;

    // =========================
    // TREND
    // =========================

    let trend =
      "SIDEWAYS";

    if (
      currentPrice > ema
    ) {

      trend =
        "BULLISH";

    } else if (
      currentPrice < ema
    ) {

      trend =
        "BEARISH";
    }

    // =========================
    // FEATURE OBJECT
    // =========================

    const volatilityData =
  calculateVolatility(
    candles
  );
    
const regime =
  detectMarketRegime({

    rsi,

    emaDistance,

    trend,
  });

    const signalQuality =
  calculateSignalQuality({

    rsi,

    trend,

    regime,

    volatilityRegime:
      volatilityData?.volatilityRegime,

    emaDistance,
  });

    const tradeDecision =
  generateTradeDecision({

    trend,

    rsi,

    confidence:
      signalQuality.confidence,

    signalQuality:
      signalQuality.quality,

    regime,

    volatilityRegime:
      volatilityData?.volatilityRegime,
  });
    
 return {

  symbol,

  currentPrice,

  rsi,

  ema,

  emaDistance,

  trend,

  regime,

  volatility:
    volatilityData?.volatility,

  volatilityRegime:
    volatilityData?.volatilityRegime,

  confidence:
    signalQuality.confidence,

  signalQuality:
    signalQuality.quality,

  decision:
    tradeDecision.action,

  candleCount:
    candles.length,
};

  } catch (err) {

    console.error(

      "Feature Engine Error:",

      err.message
    );

    return null;
  }
}

module.exports = {
  generateFeatures,
};
