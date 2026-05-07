const express = require("express");

const router = express.Router();

const {
  runOptimization,
} = require("../backtest/optimizer");

router.get(
  "/",
  async (req, res) => {
    try {
      const results =
        await runOptimization();

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
