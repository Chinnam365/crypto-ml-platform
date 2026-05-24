const pool =
  require("../db/db");

async function buildTrainingDataset() {

  try {

    // =========================
    // LOAD CLOSED TRADES
    // =========================

    const result =
      await pool.query(

        `
        SELECT *
        FROM trade_history
        WHERE outcome != 'PENDING'
        `
      );

    const trades =
      result.rows;

    // =========================
    // BUILD DATASET
    // =========================

    const dataset =
      trades.map(

        trade => {

          return {

            // FEATURES

            rsi:
              Number(
                trade.rsi
              ),

            confidence:
              Number(
                trade.confidence
              ),

            emaDistance:
              Number(
                trade.ema_distance
              ),

            trend:
              trade.trend,

            regime:
              trade.regime,

            volatilityRegime:
              trade.volatility_regime,

            signalQuality:
              trade.signal_quality,

            // LABELS

            outcome:
              trade.outcome,

            pnl:
              Number(
                trade.pnl
              ),
          };
        }
      );

    return dataset;

  } catch (err) {

    console.error(

      "Dataset Builder Error:",

      err.message
    );

    return [];
  }
}

module.exports = {
  buildTrainingDataset,
};
