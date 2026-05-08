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

// =====================================
// ENGINE LOOP
// =====================================

async function runEngine() {

  try {

    console.log(
      "Engine cycle started"
    );

    // =================================
    // RUN ML STRATEGY
    // =================================

    const strategyResult =
      await runDogeStrategy();

    console.log(
      "ML Strategy Result:",
      strategyResult
    );

    // =================================
    // ACTIVE TRADE
    // =================================

    let activeTrade =
      getActiveTrade();

    // =================================
    // MONITOR EXISTING TRADE
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
      strategyResult.decision ===
        "BUY"
    ) {

      createPaperTrade(
        strategyResult.latestPrice
      );

      console.log(
        "New ML trade opened"
      );
    }

    // =================================
    // SAVE DECISION
    // =================================

    await saveDecision({

      symbol:
        strategyResult.symbol,

      latestPrice:
        strategyResult.latestPrice,

      rsi:
        strategyResult.rsi,

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
        strategyResult.probability,

      decision:
        strategyResult.decision,

      reasons: [

        `ML Probability: ${strategyResult.probability}`,

        `Score: ${strategyResult.score}`,
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

      rsi:
        strategyResult.rsi,

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
        strategyResult.probability,

      decision:
        strategyResult.decision,

      activeTrade:
        getActiveTrade(),
    });

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
