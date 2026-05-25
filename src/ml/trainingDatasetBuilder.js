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

        trade => ({

          // =========================
          // CORE FEATURES
          // =========================

          symbol:
            trade.symbol || "",

          rsi:
            Number(
              trade.rsi || 0
            ),

          confidence:
            Number(
              trade.confidence || 0
            ),

          emaDistance:
            Number(
              trade.ema_distance || 0
            ),

          trend:
            trade.trend || "UNKNOWN",

          regime:
            trade.regime || "UNKNOWN",

          volatilityRegime:
            trade.volatility_regime || "UNKNOWN",

          signalQuality:
            trade.signal_quality || "UNKNOWN",

          // =========================
          // ADVANCED ML FEATURES
          // =========================

          macd:
            Number(
              trade.macd || 0
            ),

          volatility:
            Number(
              trade.volatility || 0
            ),

          tradeQuality:
            Number(
              trade.trade_quality || 0
            ),

          overallTrend:
            trade.overall_trend || "UNKNOWN",

          buyScore:
            Number(
              trade.buy_score || 0
            ),

          sellScore:
            Number(
              trade.sell_score || 0
            ),

          trend15m:
            trade.trend_15m || "UNKNOWN",

          trend1h:
            trade.trend_1h || "UNKNOWN",

          trend4h:
            trade.trend_4h || "UNKNOWN",

          alignmentScore:
            Number(
              trade.alignment_score || 0
            ),

          // =========================
          // LABELS
          // =========================

          outcome:
            trade.outcome || "UNKNOWN",

          pnl:
            Number(
              trade.pnl || 0
            ),
        })
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
