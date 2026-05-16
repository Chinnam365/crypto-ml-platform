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

        label
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
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

        label,
      ]
    );

    console.log(
      `ML dataset saved for ${symbol}`
    );

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
