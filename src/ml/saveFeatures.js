const pool =
  require("../db/pool");

async function saveFeatures(data) {

  try {

    const result =
      await pool.query(

        `
        INSERT INTO features (

          symbol,
          price,
          rsi,
          macd,
          trend,
          volatility,
          probability,
          score,
          decision

        )

        VALUES (

          $1,$2,$3,$4,$5,
          $6,$7,$8,$9

        )

        RETURNING id
        `,
        [

          data.symbol,
          data.price,
          data.rsi,
          data.macd,
          data.trend,
          data.volatility,
          data.probability,
          data.score,
          data.decision,
        ]
      );

    return result.rows[0].id;

  } catch (error) {

    console.error(
      "Save features failed:",
      error.message
    );

    return null;
  }
}

module.exports = {
  saveFeatures,
};
