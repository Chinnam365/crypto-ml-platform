const express = require("express");

const router = express.Router();

const {
  getDoge5mCandles,
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

router.get("/", async (req, res) => {
  try {

    // =========================
    // 5M DATA
    // =========================

    const rawCandles =
      await getDoge5mCandles();

    const candles =
      formatCandles(rawCandles);

    const closes =
      candles.map(
        (c) => c.close
      );

    const latestPrice =
      closes[
        closes.length - 1
      ];

    const ema5m20 =
      calculateEMA(
        closes.slice(-20),
        20
      );

    const ema5m50 =
      calculateEMA(
        closes.slice(-50),
        50
      );

    const rsi5m =
      calculateRSI(
        closes.slice(-15)
      );

    // =========================
    // PLACEHOLDER VALUES
    // =========================

    const strategy =
      evaluateDogeStrategy({
        ema5m20,
        ema5m50,

        ema15m20: ema5m20,
        ema15m50: ema5m50,

        ema1h20: ema5m20,
        ema1h50: ema5m50,

        rsi5m,

        latestPrice,

        btcBullish: true,
      });

    res.json({
      symbol: "DOGEUSDT",

      latestPrice,

      indicators: {
        ema5m20,

        ema5m50,

        rsi5m,
      },

      strategy,

      latestCandle:
        candles[
          candles.length - 1
        ],
    });

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
