const axios = require("axios");
const pool = require("../db/db");

async function loadDiscoveryHistory(
  symbol
) {
  try {

    const response =
      await axios.get(
        "https://api.binance.com/api/v3/klines",
        {
          params: {
            symbol,
            interval: "5m",
            limit: 240,
          },
        }
      );
 
    for (
      const candle of response.data
    ) {

      await pool.query(
        `
        INSERT INTO market_candles(
          symbol,
          timeframe,
          open,
          high,
          low,
          close,
          volume,
          candle_time
        )
        VALUES(
          $1,$2,$3,$4,$5,$6,$7,$8
        )
        ON CONFLICT DO NOTHING
        `,
        [
          symbol,
          "5m",
          Number(candle[1]),
          Number(candle[2]),
          Number(candle[3]),
          Number(candle[4]),
          Number(candle[5]),
          candle[6]
        ]
      );
    }

    console.log(
      `Loaded history: ${symbol}`
    );

    return true;

  } catch (err) {

    console.log(`
==================================
BINANCE HISTORY ERROR
==================================

Symbol:
${symbol}

Status:
${err.response?.status}

Response:
${JSON.stringify(err.response?.data)}

Message:
${err.message}

==================================
`);
    return false;
  }
}

module.exports = {
  loadDiscoveryHistory,
};
