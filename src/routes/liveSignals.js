const express = require("express");

const router = express.Router();

const pool = require("../db/db");

// ======================================
// LIVE SIGNALS
// ======================================

router.get("/", async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT
        symbol,
        side,
        confidence,
        pnl,
        trend,
        regime,
        created_at
      FROM positions
      ORDER BY created_at DESC
      LIMIT 20
    `);

    const signals =
      result.rows.map((row) => ({

        ...row,

        signal_strength:

          Number(row.confidence) >= 65
            ? "STRONG"

            : Number(row.confidence) >= 55
            ? "MODERATE"

            : "WEAK",
      }));

    res.json({
      success: true,
      signals,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;
