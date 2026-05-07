const express = require("express");

const router = express.Router();

const {
  runWeightOptimization,
} = require("../backtest/weightOptimizer");

router.get(
  "/",
  async (req, res) => {
    try {
      const results =
        await runWeightOptimization();

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
