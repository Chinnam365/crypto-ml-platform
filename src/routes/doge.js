const express = require("express");
const router = express.Router();

const { getDogeCandles } = require("../market/binance");
const { formatCandles } = require("../market/formatter");

const { calculateEMA } = require("../indicators/ema");
const { calculateRSI } = require("../indicators/rsi");

router.get("/", async (req, res) => {
  try {
    const rawCandles = await getDogeCandles();

    const candles = formatCandles(rawCandles);

    const closes = candles.map((c) => c.close);

    const ema20 = calculateEMA(closes.slice(-20), 20);
    const ema50 = calculateEMA(closes.slice(-50), 50);

    const rsi = calculateRSI(closes.slice(-15));

    res.json({
      symbol: "DOGEUSDT",
      interval: "5m",

      latestPrice: closes[closes.length - 1],

      indicators: {
        ema20,
        ema50,
        rsi,
      },

      latestCandle: candles[candles.length - 1],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
