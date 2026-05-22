const pool =
  require("./db");

async function saveMarketCandle(
  candle
) {

  try {

    await pool.query(

      `
      INSERT INTO market_candles (

        symbol,
        timeframe,
        open,
        high,
        low,
        close,
        volume,
        candle_time

      ) VALUES (

        $1,$2,$3,$4,$5,$6,$7,$8
      )
      `,

      [

        candle.symbol,
        "1m",

        candle.open,
        candle.high,
        candle.low,
        candle.close,

        candle.volume,

        candle.closeTime,
      ]
    );

    console.log(

      `Saved candle: ${candle.symbol}`
    );

  } catch (err) {

    console.error(

      "Save Candle Error:",

      err.message
    );
  }
}

module.exports = {
  saveMarketCandle,
};
