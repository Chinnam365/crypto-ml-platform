const pool =
  require("../db/pool");

async function trainModel() {

  try {

    const result =
      await pool.query(

        `
        SELECT
          rsi,
          macd,
          trend,
          decision
        FROM features
        ORDER BY id DESC
        LIMIT 500
        `
      );

    const rows =
      result.rows;

    if (rows.length < 20) {

      console.log(
        "Not enough training data"
      );

      return {
        probability: 50,
      };
    }

    let bullishScore = 0;

    for (const row of rows) {

      if (

        row.rsi < 30 &&

        row.macd > 0 &&

        row.trend === "BULLISH"
      ) {

        bullishScore++;
      }
    }

    const probability =
      (
        bullishScore /
        rows.length
      ) * 100;

    console.log(

      `AI Probability: ${probability.toFixed(2)}%`
    );

    return {
      probability,
    };

  } catch (error) {

    console.error(
      "Training failed:",
      error.message
    );

    return {
      probability: 50,
    };
  }
}

module.exports = {
  trainModel,
};
