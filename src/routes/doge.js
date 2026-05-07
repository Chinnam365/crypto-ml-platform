const express = require("express");
const router = express.Router();

const { getDogeCandles } = require("../market/binance");

router.get("/", async (req, res) => {
  const candles = await getDogeCandles();

  res.json({
    symbol: "DOGEUSDT",
    interval: "5m",
    candles,
  });
});

module.exports = router;
