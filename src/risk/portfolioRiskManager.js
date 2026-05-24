const pool =
  require("../db/db");

async function evaluatePortfolioRisk() {

  try {

    // =========================
    // LOAD ACTIVE TRADES
    // =========================

    const result =
      await pool.query(

        `
        SELECT *
        FROM trade_history
        WHERE outcome = 'PENDING'
        `
      );

    const activeTrades =
      result.rows;

    // =========================
    // MAX ACTIVE TRADES
    // =========================

    const maxTrades = 5;

    // =========================
    // PORTFOLIO STATUS
    // =========================

    const tradeCount =
      activeTrades.length;

    const portfolioRisk =
      tradeCount / maxTrades;

    // =========================
    // TRADE BLOCKING
    // =========================

    let allowNewTrades =
      true;

    if (
      tradeCount >=
      maxTrades
    ) {

      allowNewTrades =
        false;
    }

    return {

      activeTrades:
        tradeCount,

      maxTrades,

      portfolioRisk:
        Number(
          portfolioRisk.toFixed(2)
        ),

      allowNewTrades,
    };

  } catch (err) {

    console.error(

      "Portfolio Risk Error:",

      err.message
    );

    return {

      activeTrades: 0,

      maxTrades: 0,

      portfolioRisk: 0,

      allowNewTrades: false,
    };
  }
}

module.exports = {
  evaluatePortfolioRisk,
};
