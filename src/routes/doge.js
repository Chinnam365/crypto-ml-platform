const express = require("express");

const router = express.Router();

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

router.get("/", async (req, res) => {
  try {
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

    let tradeUpdate = null;

    // Monitor existing trade
    if (activeTrade) {
      tradeUpdate = monitorTrade(latestPrice);

      activeTrade = getActiveTrade();
    }

    // Open new trade only if no active trade
    if (
      !activeTrade &&
      strategyResult.decision === "BUY"
    ) {
      tradeUpdate = createPaperTrade(latestPrice);

      activeTrade = getActiveTrade();
    }

    res.json({
      symbol: "DOGEUSDT",

      latestPrice,

      indicators: {
        ema20,
        ema50,
        rsi,
      },

      strategy: strategyResult,

      activeTrade,

      tradeUpdate,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
