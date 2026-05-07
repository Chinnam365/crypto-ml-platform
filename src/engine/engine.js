const { getDogeCandles } = require("../market/binance");

const { formatCandles } = require("../market/formatter");

const { calculateEMA } = require("../indicators/ema");

const { calculateRSI } = require("../indicators/rsi");

const { evaluateDogeStrategy } = require("../strategies/dogeStrategy");

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

async function runEngine() {
  try {
    console.log("Engine cycle started");

    const rawCandles = await getDogeCandles();

    const candles = formatCandles(rawCandles);

    const closes = candles.map((c) => c.close);

    const latestPrice = closes[closes.length - 1];

    const ema20 = calculateEMA(closes.slice(-20), 20);

    const ema50 = calculateEMA(closes.slice(-50), 50);

    const rsi = calculateRSI(closes.slice(-15));

    const strategyResult = evaluateDogeStrategy({
      ema20,
      ema50,
      rsi,
      latestPrice,
    });

    let activeTrade = getActiveTrade();

    // MONITOR EXISTING TRADE
    if (activeTrade) {
      await monitorTrade(latestPrice);

      console.log("Monitoring active trade");
    }

    // COOLDOWN STATUS
    if (isCooldownActive()) {
      console.log(
        `Cooldown active: ${getCooldownRemaining()} seconds remaining`
      );
    }

    // OPEN NEW TRADE
    if (
      !activeTrade &&
      !isCooldownActive() &&
      strategyResult.decision === "BUY"
    ) {
      createPaperTrade(latestPrice);

      console.log("New trade opened");
    }

    console.log({
      latestPrice,
      strategy: strategyResult,
      activeTrade: getActiveTrade(),
    });

    console.log("Engine cycle completed");
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
