const {
  runDogeStrategy,
} = require("../strategies/dogeStrategy");

const {
  getActiveTrade,
} = require("../execution/tradeState");

const {
  createPaperTrade,
  monitorTrade,
} = require("../execution/paperTrader");

const {
  isCooldownActive,
  getCooldownRemaining,
} = require("../risk/cooldown");

const {
  saveDecision,
} = require("../logging/decisionLogger");

const {
  calculateMACD,
} = require("../indicators/macd");

const {
  detectTrend,
} = require("../indicators/trend");

const {
  saveFeatures,
} = require("../ml/saveFeatures");

const {
  trainModel,
} = require("../ml/trainer");

const {
  detectMarketRegime,
} = require("../market/regime");

// =====================================
// ENGINE LOOP
// =====================================

async function runEngine() {

  try {

    console.log(
      "Engine cycle started"
    );

    // =================================
    // RUN STRATEGY
    // =================================

    const strategyResult =
      await runDogeStrategy();

    // =================================
    // VALIDATION
    // =================================

    if (
      !strategyResult ||
      !strategyResult.closes ||
      strategyResult.closes.length < 50
    ) {

      console.log(
        "Not enough candle data"
      );

      return;
    }

    // =================================
    // TRAIN AI MODEL
    // =================================

    const aiModel =
      await trainModel();

    const aiProbability =
      aiModel.probability;

    // =================================
    // MARKET DATA
    // =================================

    const closes =
      strategyResult.closes;

    const latestPrice =
      strategyResult.latestPrice;

    const rsi =
      strategyResult.rsi;

    const volatility =
      strategyResult.volatility;

    // =================================
    // INDICATORS
    // =================================

    const macd =
      calculateMACD(closes);

    const trend =
      detectTrend(closes);

    const regime =
      detectMarketRegime(closes);

    // =================================
    // DECISION FILTERING
    // =================================

    let filteredDecision =
      "HOLD";

    // =================================
    // BUY CONDITIONS
    // =================================

    if (

      strategyResult.decision ===
        "BUY" &&

      rsi < 30 &&

      macd > 0 &&

      trend === "BULLISH" &&

      aiProbability > 55 &&

      regime ===
        "TRENDING_BULLISH"
    ) {

      filteredDecision =
        "BUY";
    }

    // =================================
    // SELL CONDITIONS
    // =================================

    else if (

      strategyResult.decision ===
        "SELL" &&

      rsi > 70 &&

      macd < 0 &&

      trend === "BEARISH" &&

      regime ===
        "TRENDING_BEARISH"
    ) {

      filteredDecision =
        "SELL";
    }

    // =================================
    // ACTIVE TRADE
    // =================================

    let activeTrade =
      getActiveTrade();

    // =================================
    // MONITOR ACTIVE TRADE
    // =================================

    if (activeTrade) {

      await monitorTrade(
        latestPrice
      );

      console.log(
        "Monitoring active trade"
      );
    }

    // =================================
    // COOLDOWN STATUS
    // =================================

    if (isCooldownActive()) {

      console.log(

        `Cooldown active: ${getCooldownRemaining()} seconds remaining`
      );
    }

    // =================================
    // OPEN NEW TRADE
    // =================================

    if (

      !activeTrade &&

      !isCooldownActive() &&

      filteredDecision ===
        "BUY"
    ) {

      createPaperTrade(
        latestPrice
      );

      console.log(
        "New AI trade opened"
      );
    }

    // =================================
    // SAVE FEATURES
    // =================================

    const featureId =
  await saveFeatures({

    symbol:
      strategyResult.symbol,

    price:
      latestPrice,

    rsi,

    macd,

    trend,

    volatility,

    probability:
      aiProbability,

    score:
      strategyResult.score,

    decision:
      filteredDecision,
  });

    // =================================
    // SAVE DECISION
    // =================================

    await saveDecision({

      symbol:
        strategyResult.symbol,

      latestPrice,

      rsi,

      macd,

      trend,

      volatility,

      regime,

      score:
        strategyResult.score,

      bullish5m:
        strategyResult.bullish5m,

      bullish15m:
        strategyResult.bullish15m,

      bullish1h:
        strategyResult.bullish1h,

      btcBullish:
        strategyResult.btcBullish,

      probability:
        aiProbability,

      decision:
        filteredDecision,

      reasons: [

        `AI Probability: ${aiProbability}`,

        `MACD: ${macd}`,

        `Trend: ${trend}`,

        `Regime: ${regime}`,
      ],
    });

    // =================================
    // STATUS OUTPUT
    // =================================

    console.log({

      symbol:
        strategyResult.symbol,

      latestPrice,

      rsi,

      macd,

      trend,

      regime,

      volatility,

      probability:
        aiProbability,

      decision:
        filteredDecision,
    });

    console.log(

      `RSI ${rsi?.toFixed(2)} | MACD ${macd?.toFixed(4)} | Trend ${trend} | Regime ${regime} | AI ${aiProbability.toFixed(2)}% | Decision ${filteredDecision}`
    );

    console.log(
      "Engine cycle completed"
    );

  } catch (error) {

    console.error(
      "Engine cycle failed:",
      error.message
    );
  }
}

module.exports = {
  runEngine,
};
