const {
  getDoge5mCandles,
  getDoge15mCandles,
  getDoge1hCandles,
  getBtc15mCandles,
} = require("../market/binance");

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
    console.log(
      "Engine cycle started"
    );

    // =========================
    // DOGE 5M
    // =========================

    const raw5m =
      await getDoge5mCandles();

    const candles5m =
      formatCandles(raw5m);

    const closes5m =
      candles5m.map(
        (c) => c.close
      );

    const latestPrice =
      closes5m[
        closes5m.length - 1
      ];

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

    const rsi5m =
      calculateRSI(
        closes5m.slice(-15)
      );

    // =========================
    // DOGE 15M
    // =========================

    const raw15m =
      await getDoge15mCandles();

    const candles15m =
      formatCandles(raw15m);

    const closes15m =
      candles15m.map(
        (c) => c.close
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

    // =========================
    // DOGE 1H
    // =========================

    const raw1h =
      await getDoge1hCandles();

    const candles1h =
      formatCandles(raw1h);

    const closes1h =
      candles1h.map(
        (c) => c.close
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

    // =========================
    // BTC 15M
    // =========================

    const rawBtc =
      await getBtc15mCandles();

    const btcCandles =
      formatCandles(rawBtc);

    const btcCloses =
      btcCandles.map(
        (c) => c.close
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

    const btcBullish =
      btcEma20 > btcEma50;

    // =========================
    // STRATEGY
    // =========================

    const strategyResult =
      evaluateDogeStrategy({
        ema5m20,
        ema5m50,

        ema15m20,
        ema15m50,

        ema1h20,
        ema1h50,

        rsi5m,

        latestPrice,

        btcBullish,
      });

    // =========================
    // SAVE DECISION
    // =========================

    await saveDecision({
      symbol: "DOGEUSDT",

      latestPrice,

      ema20: ema5m20,

      ema50: ema5m50,

      rsi: rsi5m,

      btcBullish,

      decision:
        strategyResult.decision,

      confidence:
        strategyResult.score,

      reasons:
        strategyResult.reasons,
    });

    // =========================
    // ACTIVE TRADE
    // =========================

    let activeTrade =
      getActiveTrade();

    // =========================
    // MONITOR TRADE
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
    // COOLDOWN
    // =========================

    if (isCooldownActive()) {
      console.log(
        `Cooldown active: ${getCooldownRemaining()} seconds remaining`
      );
    }

    // =========================
    // BTC FILTER
    // =========================

    if (!btcBullish) {
      console.log(
        "BTC bearish - blocking trades"
      );
    }

    // =========================
    // OPEN TRADE
    // =========================

    if (
      !activeTrade &&
      !isCooldownActive() &&
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
    // STATUS OUTPUT
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
