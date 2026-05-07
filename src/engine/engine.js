const {
  getDogeCandles,
  getBtcCandles,
} = require("../market/binance");

const { formatCandles } = require("../market/formatter");

const { calculateEMA } = require("../indicators/ema");

const { calculateRSI } = require("../indicators/rsi");

const {
  evaluateDogeStrategy,
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

async function runEngine() {
  try {
    console.log("Engine cycle started");

    // =========================
    // DOGE DATA
    // =========================

    const rawDogeCandles =
      await getDogeCandles();

    const dogeCandles =
      formatCandles(rawDogeCandles);

    const dogeCloses =
      dogeCandles.map((c) => c.close);

    const latestPrice =
      dogeCloses[dogeCloses.length - 1];

    const ema20 = calculateEMA(
      dogeCloses.slice(-20),
      20
    );

    const ema50 = calculateEMA(
      dogeCloses.slice(-50),
      50
    );

    const rsi = calculateRSI(
      dogeCloses.slice(-15)
    );

    // =========================
    // BTC DATA
    // =========================

    const rawBtcCandles =
      await getBtcCandles();

    const btcCandles =
      formatCandles(rawBtcCandles);

    const btcCloses =
      btcCandles.map((c) => c.close);

    const btcEma20 = calculateEMA(
      btcCloses.slice(-20),
      20
    );

    const btcEma50 = calculateEMA(
      btcCloses.slice(-50),
      50
    );

    // =========================
    // BTC TREND FILTER
    // =========================

    const btcBullish =
      btcEma20 > btcEma50;

    if (!btcBullish) {
      console.log(
        "BTC bearish - blocking trades"
      );
    }

    // =========================
    // STRATEGY EVALUATION
    // =========================

    const strategyResult =
      evaluateDogeStrategy({
        ema20,
        ema50,
        rsi,
        latestPrice,
      });

    // =========================
    // SAVE DECISION
    // =========================

    await saveDecision({
      symbol: "DOGEUSDT",

      latestPrice,

      ema20,

      ema50,

      rsi,

      btcBullish,

      decision:
        strategyResult.decision,

      confidence:
        strategyResult.confidence,

      reasons:
        strategyResult.reasons,
    });

    // =========================
    // ACTIVE TRADE
    // =========================

    let activeTrade =
      getActiveTrade();

    // =========================
    // MONITOR EXISTING TRADE
    // =========================

    if (activeTrade) {
      await monitorTrade(
        latestPrice
      );

      console.log(
        "Monitoring active trade"
      );
    }

    // =========================
    // COOLDOWN STATUS
    // =========================

    if (isCooldownActive()) {
      console.log(
        `Cooldown active: ${getCooldownRemaining()} seconds remaining`
      );
    }

    // =========================
    // OPEN NEW TRADE
    // =========================

    if (
      !activeTrade &&
      !isCooldownActive() &&
      btcBullish &&
      strategyResult.decision ===
        "BUY"
    ) {
      createPaperTrade(
        latestPrice
      );

      console.log(
        "New trade opened"
      );
    }

    // =========================
    // ENGINE STATUS OUTPUT
    // =========================

    console.log({
      latestPrice,

      btcBullish,

      strategy:
        strategyResult,

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
