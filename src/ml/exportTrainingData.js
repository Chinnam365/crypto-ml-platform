const fs = require("fs");

const {
  getDoge5mCandles,
  getDoge15mCandles,
  getDoge1hCandles,
  getBtc15mCandles,
} = require("../market/binance");

const {
  formatCandles,
} = require("../market/formatter");

const {
  calculateEMA,
} = require("../indicators/ema");

const {
  calculateRSI,
} = require("../indicators/rsi");

const {
  calculateVolatility,
} = require("../indicators/volatility");

const {
  calculateScore,
} = require("../strategies/scoreCalculator");

async function exportTrainingData() {

  console.log(
    "Generating ML training dataset..."
  );

  // =====================================
  // LOAD HISTORICAL DATA
  // =====================================

  const raw5m =
    await getDoge5mCandles(20000);

  const raw15m =
    await getDoge15mCandles(7000);

  const raw1h =
    await getDoge1hCandles(3000);

  const rawBtc =
    await getBtc15mCandles(7000);

  const candles5m =
    formatCandles(raw5m);

  const candles15m =
    formatCandles(raw15m);

  const candles1h =
    formatCandles(raw1h);

  const btcCandles =
    formatCandles(rawBtc);

  // =====================================
  // DATASET
  // =====================================

  const dataset = [];

  // =====================================
  // REPLAY LOOP
  // =====================================

  for (
    let i = 100;
    i < candles5m.length - 30;
    i++
  ) {

    const slice5m =
      candles5m.slice(0, i);

    const closes5m =
      slice5m.map(
        (c) => c.close
      );

    const latestPrice =
      closes5m[
        closes5m.length - 1
      ];

    const ema5m20 =
      calculateEMA(
        closes5m.slice(-20),
        20
      );

    const ema5m50 =
      calculateEMA(
        closes5m.slice(-50),
        50
      );

    const rsi =
      calculateRSI(
        closes5m.slice(-15)
      );

    const volatility =
      calculateVolatility(
        slice5m,
        10
      );

    // ===================================
    // 15M DATA
    // ===================================

    const index15m =
      Math.floor(i / 3);

    const slice15m =
      candles15m.slice(
        0,
        index15m
      );

    const closes15m =
      slice15m.map(
        (c) => c.close
      );

    const ema15m20 =
      closes15m.length >= 50
        ? calculateEMA(
            closes15m.slice(-20),
            20
          )
        : 0;

    const ema15m50 =
      closes15m.length >= 50
        ? calculateEMA(
            closes15m.slice(-50),
            50
          )
        : 0;

    // ===================================
    // 1H DATA
    // ===================================

    const index1h =
      Math.floor(i / 12);

    const slice1h =
      candles1h.slice(
        0,
        index1h
      );

    const closes1h =
      slice1h.map(
        (c) => c.close
      );

    const ema1h20 =
      closes1h.length >= 50
        ? calculateEMA(
            closes1h.slice(-20),
            20
          )
        : 0;

    const ema1h50 =
      closes1h.length >= 50
        ? calculateEMA(
            closes1h.slice(-50),
            50
          )
        : 0;

    // ===================================
    // BTC DATA
    // ===================================

    const btcIndex =
      Math.floor(i / 3);

    const btcSlice =
      btcCandles.slice(
        0,
        btcIndex
      );

    const btcCloses =
      btcSlice.map(
        (c) => c.close
      );

    const btcEma20 =
      btcCloses.length >= 50
        ? calculateEMA(
            btcCloses.slice(-20),
            20
          )
        : 0;

    const btcEma50 =
      btcCloses.length >= 50
        ? calculateEMA(
            btcCloses.slice(-50),
            50
          )
        : 0;

    // ===================================
    // CONDITIONS
    // ===================================

    const bullish5m =
      ema5m20 > ema5m50;

    const bullish15m =
      ema15m20 > ema15m50;

    const bullish1h =
      ema1h20 > ema1h50;

    const btcBullish =
      btcEma20 > btcEma50;

    const idealRsi =
      rsi >= 50 &&
      rsi <= 65;

    // ===================================
    // SCORE
    // ===================================

    let {
      score,
    } = calculateScore({
      btcBullish,
      bullish1h,
      bullish15m,
      bullish5m,
      idealRsi,
    });

    // ===================================
    // FUTURE TRADE SIMULATION
    // ===================================

    const takeProfit =
      latestPrice * 1.005;

    const stopLoss =
      latestPrice * 0.993;

    let result =
      "TIMEOUT";

    for (
      let j = i;
      j < i + 24;
      j++
    ) {

      const futurePrice =
        candles5m[j].close;

      if (
        futurePrice >=
        takeProfit
      ) {

        result = "WIN";

        break;
      }

      if (
        futurePrice <=
        stopLoss
      ) {

        result = "LOSS";

        break;
      }
    }

    // ===================================
    // DATA ROW
    // ===================================

    dataset.push({

      rsi,

      volatility,

      score,

      bullish5m:
        bullish5m ? 1 : 0,

      bullish15m:
        bullish15m ? 1 : 0,

      bullish1h:
        bullish1h ? 1 : 0,

      btcBullish:
        btcBullish ? 1 : 0,

      ema5mSpread:
        ema5m20 - ema5m50,

      ema15mSpread:
        ema15m20 - ema15m50,

      ema1hSpread:
        ema1h20 - ema1h50,

      result,
    });
  }

  // =====================================
  // SAVE JSON
  // =====================================

  fs.writeFileSync(

    "/tmp/training-data.json",

    JSON.stringify(
      dataset,
      null,
      2
    )
  );

  // =====================================
  // SAVE CSV
  // =====================================

  const headers =
    Object.keys(
      dataset[0]
    );

  const csvRows = [
    headers.join(","),
  ];

  for (const row of dataset) {

    csvRows.push(

      headers
        .map(
          (h) => row[h]
        )
        .join(",")
    );
  }

  fs.writeFileSync(

    "/tmp/training-data.csv",

    csvRows.join("\n")
  );

  console.log(
    `Exported ${dataset.length} rows`
  );

  return {

    rows:
      dataset.length,

    json:
      "/tmp/training-data.json",

    csv:
      "/tmp/training-data.csv",
  };
}

module.exports = {
  exportTrainingData,
};
