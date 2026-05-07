const express = require("express");

const router = express.Router();

const {
  runBacktest,
} = require("../backtest/backtestEngine");

router.get(
  "/",
  async (req, res) => {
    try {
      const results =
        await runBacktest();

      res.json(results);
    } catch (error) {
      res.status(500).json({
        error:
          error.message,
      });
    }
  }
);

module.exports = router;
