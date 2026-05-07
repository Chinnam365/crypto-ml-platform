const express = require("express");
const router = express.Router();

const { getDogeCandles } = require("../market/binance");
const { formatCandles } = require("../market/formatter");

const { calculateEMA } = require("../indicators/ema");
const { calculateRSI } = require("../indicators/rsi");

const { evaluateDogeStrategy } = require("../strategies/dogeStrategy");

router.get("/", async (req, res) => {
  try {
    const rawCandles = await getDogeCandles();

    const candles = formatCandles(rawCandles);

    const closes = candles.map((c) => c.close);

    const ema20 = calculateEMA(closes.slice(-20), 20);
    const ema50 = calculateEMA(closes.slice(-50), 50);

    const rsi = calculateRSI(closes.slice(-15));

    const strategyResult = evaluateDogeStrategy({
      ema20,
      ema50,
      rsi,
      latestPrice: closes[closes.length - 1],
    });

    res.json({
      symbol: "DOGEUSDT",
      interval: "5m",

      indicators: {
        ema20,
        ema50,
        rsi,
      },

      strategy: strategyResult,

      latestCandle: candles[candles.length - 1],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
