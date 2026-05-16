async function saveMLDataset({

  pool,

  symbol,

  side,

  rsi,

  macd,

  trend,

  regime,

  volatility,

  confidence,

  positionSize,

  pnl,

  durationMinutes,
}) {

  try {

    const label =
      pnl > 0
        ? "WIN"
        : "LOSS";

    await pool.query(
      `
      INSERT INTO ml_dataset
      (
        symbol,

        side,

        rsi,

        macd,

        trend,

        regime,

        volatility,

        confidence,

        position_size,

        pnl,

        duration_minutes,

        label
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
      )
      `,
      [

        symbol,

        side,

        rsi,

        macd,

        trend,

        regime,

        volatility,

        confidence,

        positionSize,

        pnl,

        durationMinutes,

        label,
      ]
    );

    console.log(`
==================================
ML DATASET SAVED
==================================

Symbol:
${symbol}

Side:
${side}

PnL:
${pnl}

Duration Minutes:
${durationMinutes}

Label:
${label}

==================================
`);

  } catch (err) {

    console.error(
      "ML dataset error:",
      err.message
    );
  }
}

module.exports = {
  saveMLDataset,
};
