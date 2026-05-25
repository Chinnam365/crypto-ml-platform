const pool =
  require("../db/db");

const {
  calculateEMA,
} = require("../indicators/ema");

/*
==================================================
CALCULATE TREND
==================================================
*/

function calculateTrend(
  closes
) {

  if (
    !closes ||
    closes.length < 20
  ) {

    return "UNKNOWN";
  }

  const ema =
    calculateEMA(
      closes
    );

  const currentPrice =
    closes[
      closes.length - 1
    ];

  const distance =
    (
      (
        currentPrice - ema
      ) / ema
    ) * 100;

  if (distance > 0.35) {
    return "BULLISH";
  }

  if (distance < -0.35) {
    return "BEARISH";
  }

  return "SIDEWAYS";
}

/*
==================================================
AGGREGATE CANDLES
==================================================
*/

function aggregateCandles(
  candles,
  groupSize
) {

  const grouped = [];

  for (
    let i = 0;
    i < candles.length;
    i += groupSize
  ) {

    const slice =
      candles.slice(
        i,
        i + groupSize
      );

    if (
      slice.length < groupSize
    ) {
      continue;
    }

    grouped.push({

      open:
        Number(slice[0].open),

      high:
        Math.max(
          ...slice.map(
            c => Number(c.high)
          )
        ),

      low:
        Math.min(
          ...slice.map(
            c => Number(c.low)
          )
        ),

      close:
        Number(
          slice[
            slice.length - 1
          ].close
        ),

      volume:
        slice.reduce(

          (sum, c) =>

            sum +
            Number(c.volume),

          0
        ),
    });
  }

  return grouped;
}

/*
==================================================
MULTI TIMEFRAME ENGINE
==================================================
*/

async function getMultiTimeframeTrend(
  symbol = "BTCUSDT"
) {

  try {

    const result =
      await pool.query(

        `
        SELECT *
        FROM market_candles
        WHERE symbol = $1
        ORDER BY candle_time ASC
        LIMIT 240
        `,

        [symbol]
      );

    const candles =
      result.rows;

    if (
      candles.length < 60
    ) {

      return {

        trend15m:
          "UNKNOWN",

        trend1h:
          "UNKNOWN",

        trend4h:
          "UNKNOWN",

        alignmentScore: 0,

        overallTrend:
          "UNKNOWN",
      };
    }

    /*
    ==================================================
    15M
    ==================================================
    */

    const closes15m =
      candles.map(
        c => Number(c.close)
      );

    const trend15m =
      calculateTrend(
        closes15m
      );

    /*
    ==================================================
    1H
    ==================================================
    */

    const candles1h =
      aggregateCandles(
        candles,
        4
      );

    const closes1h =
      candles1h.map(
        c => c.close
      );

    const trend1h =
      calculateTrend(
        closes1h
      );

    /*
    ==================================================
    4H
    ==================================================
    */

    const candles4h =
      aggregateCandles(
        candles,
        16
      );

    const closes4h =
      candles4h.map(
        c => c.close
      );

    const trend4h =
      calculateTrend(
        closes4h
      );

    /*
    ==================================================
    ALIGNMENT
    ==================================================
    */

    const trends = [

      trend15m,

      trend1h,

      trend4h,
    ];

    const bullishCount =
      trends.filter(

        t =>
          t === "BULLISH"

      ).length;

    const bearishCount =
      trends.filter(

        t =>
          t === "BEARISH"

      ).length;

    let alignmentScore =
      30;

    if (
      bullishCount === 3 ||
      bearishCount === 3
    ) {

      alignmentScore = 100;
    }

    else if (
      bullishCount === 2 ||
      bearishCount === 2
    ) {

      alignmentScore = 70;
    }

    /*
    ==================================================
    OVERALL TREND
    ==================================================
    */

    let overallTrend =
      "SIDEWAYS";

    if (
      bullishCount >= 2
    ) {

      overallTrend =
        "BULLISH";
    }

    if (
      bearishCount >= 2
    ) {

      overallTrend =
        "BEARISH";
    }

    return {

      trend15m,

      trend1h,

      trend4h,

      alignmentScore,

      overallTrend,
    };

  } catch (err) {

    console.log(

      "Multi timeframe error:",

      err.message
    );

    return {

      trend15m:
        "UNKNOWN",

      trend1h:
        "UNKNOWN",

      trend4h:
        "UNKNOWN",

      alignmentScore: 0,

      overallTrend:
        "UNKNOWN",
    };
  }
}

module.exports = {
  getMultiTimeframeTrend,
};
