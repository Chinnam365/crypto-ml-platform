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
  calculateMACD,
} = require("../indicators/macd");

const {
  calculateVolatility,
} = require("./volatilityEngine");

const {
  calculateSignalQuality,
} = require("../ml/signalQualityEngine");

const {
  generateTradeDecision,
} = require("../ml/tradeDecisionEngine");

const {
  saveTradeMemory,
} = require("../ml/saveTradeMemory");

const {
  calculatePositionSize,
} = require("../risk/positionSizing");

const {
  calculateTradeRisk,
} = require("../risk/tradeRiskEngine");

const {
  evaluatePortfolioRisk,
} = require("../risk/portfolioRiskManager");

const {
  getMultiTimeframeTrend,
} = require("../ml/multiTimeframeTrend");

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
/*
==================================================
MACD
==================================================
*/

const macdData =
  calculateMACD(
    closes
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

const macd = 0;

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
const multiTf =
  await getMultiTimeframeTrend(
    symbol
  );
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

    alignmentScore:
      multiTf.alignmentScore,

    overallTrend:
      multiTf.overallTrend,
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

    alignmentScore:
      multiTf.alignmentScore,

    overallTrend:
      multiTf.overallTrend,
  });

    const positionSizing =
  calculatePositionSize({

    confidence:
      signalQuality.confidence,

    volatilityRegime:
      volatilityData?.volatilityRegime,

    signalQuality:
      signalQuality.quality,
  });
    const tradeRisk =
  calculateTradeRisk({

    currentPrice,

    volatility:
      volatilityData?.volatility,

    decision:
      tradeDecision.action,
  });

    const portfolioRisk =
  await evaluatePortfolioRisk();
    
    if (

  tradeDecision.action !==
  "HOLD"

  &&

  portfolioRisk.allowNewTrades
) {

  saveTradeMemory({

  symbol,

  decision:
    tradeDecision.action,

  confidence:
    signalQuality.confidence,

  signalQuality:
    signalQuality.quality,

  trend,
trend15m:
  multiTf?.trend15m,

trend1h:
  multiTf?.trend1h,

trend4h:
  multiTf?.trend4h,

alignmentScore:

  trend === multiTf?.trend15m &&
  trend === multiTf?.trend1h
    ? 100
    : 50,
    
  regime,

  volatilityRegime:
    volatilityData?.volatilityRegime,

  rsi,

  emaDistance,

  entryPrice:
    currentPrice,

  // =========================
  // NEW ML FEATURES
  // =========================

  macd:
    macd || 0,

  volatility:
    volatilityData?.volatility || 0,

  tradeQuality:
    signalQuality.confidence || 0,

  overallTrend:
    trend,

  buyScore:
    tradeDecision.action === "BUY"
      ? signalQuality.confidence
      : 0,

  sellScore:
    tradeDecision.action === "SELL"
      ? signalQuality.confidence
      : 0,
});
}
    
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

recommendedPositionSize:
  positionSizing.recommendedPositionSize,

stopLoss:
  tradeRisk.stopLoss,

takeProfit:
  tradeRisk.takeProfit,

riskRewardRatio:
  tradeRisk.riskRewardRatio,

portfolioRisk:
  portfolioRisk.portfolioRisk,

activeTrades:
  portfolioRisk.activeTrades,

allowNewTrades:
  portfolioRisk.allowNewTrades,

candleCount:
  candles.length,

  macd:
  macdData.macd,

signalLine:
  macdData.signalLine,

histogram:
  macdData.histogram,

momentumState:
  macdData.momentumState,

momentumStrength:
  macdData.momentumStrength,
  
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
