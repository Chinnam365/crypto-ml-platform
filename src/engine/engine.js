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
    // TRAIN AI MODEL
    // =================================

    const aiModel =
      await trainModel();

    const aiProbability =
      aiModel.probability;

    console.log(
      "AI Probability:",
      aiProbability
    );

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
    // INDICATORS
    // =================================

    const closes =
      strategyResult.closes;

    const macd =
      calculateMACD(closes);

    const trend =
      detectTrend(closes);

    const rsi =
      strategyResult.rsi;

    let filteredDecision =
      "HOLD";

    // =================================
    // SMART FILTERING
    // =================================

    if (

      strategyResult.decision ===
        "BUY" &&

      rsi < 30 &&

      macd > 0 &&

      trend === "BULLISH" &&

      aiProbability > 55
    ) {

      filteredDecision =
        "BUY";
    }

    else if (

      strategyResult.decision ===
        "SELL" &&

      rsi > 70 &&

      macd < 0 &&

      trend === "BEARISH"
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
        strategyResult.latestPrice
      );

      console.log(
        "Monitoring active trade"
      );
    }

    // =================================
    // COOLDOWN
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
        strategyResult.latestPrice
      );

      console.log(
        "New AI-filtered trade opened"
      );
    }

    // =================================
    // SAVE FEATURES
    // =================================

    await saveFeatures({

      symbol:
        strategyResult.symbol,

      price:
        strategyResult.latestPrice,

      rsi,

      macd,

      trend,

      volatility:
        strategyResult.volatility,

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

      latestPrice:
        strategyResult.latestPrice,

      rsi,

      macd,

      trend,

      volatility:
        strategyResult.volatility,

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

        `Score: ${strategyResult.score}`,

        `MACD: ${macd}`,

        `Trend: ${trend}`,
      ],
    });

    // =================================
    // STATUS OUTPUT
    // =================================

    console.log({

      symbol:
        strategyResult.symbol,

      latestPrice:
        strategyResult.latestPrice,

      rsi,

      macd,

      trend,

      volatility:
        strategyResult.volatility,

      score:
        strategyResult.score,

      probability:
        aiProbability,

      decision:
        filteredDecision,

      activeTrade:
        getActiveTrade(),
    });

    console.log(

      `RSI ${rsi?.toFixed(2)} | MACD ${macd?.toFixed(4)} | Trend ${trend} | AI ${aiProbability.toFixed(2)}% | Decision ${filteredDecision}`
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
