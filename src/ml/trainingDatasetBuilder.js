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

            // =========================
            // CORE FEATURES
            // =========================

            symbol:
              trade.symbol,

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
              trade.overall_trend,

            buyScore:
              Number(
                trade.buy_score || 0
              ),

            sellScore:
              Number(
                trade.sell_score || 0
              ),
trend15m:
  trade.trend_15m,

trend1h:
  trade.trend_1h,

trend4h:
  trade.trend_4h,

alignmentScore:
  Number(
    trade.alignment_score || 0
  ),
            // =========================
            // LABELS
            // =========================

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
