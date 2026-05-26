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

const {
  getReinforcementScore,
} = require("../ml/reinforcementMemory");

/*
==================================================
MAIN FEATURE ENGINE
==================================================
*/

async function generateFeatures(
  symbol = "BTCUSDT"
) {

  try {

    /*
    ==================================================
    LOAD MARKET CANDLES
    ==================================================
    */

    const result =
      await pool.query(

        `
        SELECT *
        FROM market_candles
        WHERE symbol = $1
        ORDER BY candle_time ASC
        LIMIT 240
        `,

        [symbol]
      );

    const candles =
      result.rows;

    if (
      candles.length < 35
    ) {

      return null;
    }

    /*
    ==================================================
    CLOSE PRICES
    ==================================================
    */

    const closes =
      candles.map(

        candle =>
          Number(
            candle.close
          )
      );

    /*
    ==================================================
    INDICATORS
    ==================================================
    */

    const rsi =
      calculateRSI(
        closes
      );

    const ema =
      calculateEMA(
        closes
      );

    const macdData =
      calculateMACD(
        closes
      );

    /*
    ==================================================
    CURRENT PRICE
    ==================================================
    */

    const currentPrice =
      closes[
        closes.length - 1
      ];

    /*
    ==================================================
    EMA DISTANCE
    ==================================================
    */

    const emaDistance =
      (
        (
          currentPrice -
          ema
        ) / ema
      ) * 100;

    /*
    ==================================================
    TREND
    ==================================================
    */

    let trend =
      "SIDEWAYS";

    if (
      currentPrice > ema
    ) {

      trend =
        "BULLISH";
    }

    else if (
      currentPrice < ema
    ) {

      trend =
        "BEARISH";
    }

    /*
    ==================================================
    MULTI TIMEFRAME
    ==================================================
    */

    const multiTf =
      await getMultiTimeframeTrend(
        symbol
      );

    /*
    ==================================================
    VOLATILITY
    ==================================================
    */

    const volatilityData =
      calculateVolatility(
        candles
      );

    /*
    ==================================================
    MARKET REGIME
    ==================================================
    */

    const regime =
      detectMarketRegime({

        rsi,

        emaDistance,

        trend,
      });

    /*
    ==================================================
    SIGNAL QUALITY
    ==================================================
    */

    const signalQuality =
  await calculateSignalQuality({

    rsi,

    trend,

    regime,

    volatilityRegime:
      volatilityData?.volatilityRegime,

    emaDistance,

    alignmentScore:
      multiTf?.alignmentScore,

    overallTrend:
      multiTf?.overallTrend,

    momentumState:
      macdData?.momentumState,

    momentumStrength:
      macdData?.momentumStrength,
  });
/*
==================================================
REINFORCEMENT MEMORY
==================================================
*/

const reinforcementData =
  await getReinforcementScore({

    trend,

    momentumState:
      macdData?.momentumState,

    volatilityRegime:
      volatilityData?.volatilityRegime,

    overallTrend:
      multiTf?.overallTrend,
  });
    /*
    ==================================================
    TRADE DECISION
    ==================================================
    */

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
          multiTf?.alignmentScore,

        overallTrend:
          multiTf?.overallTrend,
      });

    /*
    ==================================================
    POSITION SIZING
    ==================================================
    */
 
    const positionSizing =
      calculatePositionSize({

        explorationTrade:
  tradeDecision.explorationTrade,
        
        confidence:
          signalQuality.confidence,

        volatilityRegime:
          volatilityData?.volatilityRegime,

        signalQuality:
          signalQuality.quality,
      });

    /*
    ==================================================
    TRADE RISK
    ==================================================
    */

    const tradeRisk =
      calculateTradeRisk({

        currentPrice,

        volatility:
          volatilityData?.volatility,

        decision:
          tradeDecision.action,
      });

    /*
    ==================================================
    PORTFOLIO RISK
    ==================================================
    */

    const portfolioRisk =
      await evaluatePortfolioRisk();

    /*
    ==================================================
    SAVE TRADE MEMORY
    ==================================================
    */

    if (

      tradeDecision.action !==
      "HOLD"

      &&

      portfolioRisk.allowNewTrades
    ) {

      await saveTradeMemory({

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
          multiTf?.alignmentScore || 0,

        regime,

        volatilityRegime:
          volatilityData?.volatilityRegime,

        rsi,

        emaDistance,

        entryPrice:
          currentPrice,

        /*
        ==================================================
        ML FEATURES
        ==================================================
        */

        macd:
          macdData?.macd || 0,

        volatility:
          volatilityData?.volatility || 0,

        tradeQuality:
          signalQuality.confidence || 0,

        overallTrend:
          multiTf?.overallTrend || "UNKNOWN",

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

    /*
    ==================================================
    RETURN FEATURES
    ==================================================
    */

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
  Number(
    (
      (
        signalQuality.confidence
        * 0.7
      )
      +
      (
        reinforcementData.reinforcementScore
        * 0.3
      )
    ).toFixed(2)
  ),

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
reinforcementScore:
  reinforcementData.reinforcementScore,

historicalWinRate:
  reinforcementData.winRate,

historicalSampleSize:
  reinforcementData.sampleSize,
      /*
      ==================================================
      MACD FEATURES
      ==================================================
      */

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

      /*
      ==================================================
      MULTI TF
      ==================================================
      */

      trend15m:
        multiTf?.trend15m,

      trend1h:
        multiTf?.trend1h,

      trend4h:
        multiTf?.trend4h,

      alignmentScore:
        multiTf?.alignmentScore,

      overallTrend:
        multiTf?.overallTrend,
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
