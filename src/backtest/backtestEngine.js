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

async function runBacktest() {

  console.log(
    "Starting volatility-aware backtest..."
  );

  // =========================
  // LOAD HISTORICAL DATA
  // =========================

  const raw5m =
    await getDoge5mCandles(2000);

  const raw15m =
    await getDoge15mCandles(1000);

  const raw1h =
    await getDoge1hCandles(500);

  const rawBtc =
    await getBtc15mCandles(1000);

  const candles5m =
    formatCandles(raw5m);

  const candles15m =
    formatCandles(raw15m);

  const candles1h =
    formatCandles(raw1h);

  const btcCandles =
    formatCandles(rawBtc);

  // =========================
  // THRESHOLDS
  // =========================

  const thresholds = [
    4, 5, 6, 7, 8,
  ];

  const results = [];

  // =========================
  // TEST THRESHOLDS
  // =========================

  for (const threshold of thresholds) {

    let wins = 0;

    let losses = 0;

    let timedOut = 0;

    let totalPnl = 0;

    let activeTrade = null;

    // =======================
    // REPLAY LOOP
    // =======================

    for (
      let i = 50;
      i < candles5m.length;
      i++
    ) {

      // =====================
      // 5M DATA
      // =====================

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

      const rsi5m =
        calculateRSI(
          closes5m.slice(-15)
        );

      const volatility =
        calculateVolatility(
          slice5m,
          10
        );

      // =====================
      // 15M DATA
      // =====================

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

      // =====================
      // 1H DATA
      // =====================

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

      // =====================
      // BTC DATA
      // =====================

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

      // =====================
      // CONDITIONS
      // =====================

      const bullish5m =
        ema5m20 > ema5m50;

      const bullish15m =
        ema15m20 > ema15m50;

      const bullish1h =
        ema1h20 > ema1h50;

      const btcBullish =
        btcEma20 > btcEma50;

      const idealRsi =
        rsi5m >= 50 &&
        rsi5m <= 65;

      const strongVolatility =
        volatility >= 0.0008;

      // =====================
      // SCORE
      // =====================

      let {
        score,
      } = calculateScore({
        btcBullish,

        bullish1h,

        bullish15m,

        bullish5m,

        idealRsi,
      });

      // =====================
      // VOLATILITY BONUS
      // =====================

      if (strongVolatility) {
        score += 2;
      }

      // =====================
      // OPEN TRADE
      // =====================

      if (
        !activeTrade &&
        score >= threshold
      ) {

        activeTrade = {
          entryPrice:
            latestPrice,

          takeProfit:
            latestPrice *
            1.01,

          stopLoss:
            latestPrice *
            0.995,

          openedAt: i,
        };
      }

      // =====================
      // MONITOR TRADE
      // =====================

      if (activeTrade) {

        const candlesOpen =
          i -
          activeTrade.openedAt;

        // ===================
        // TIMEOUT
        // ===================

        if (
          candlesOpen >= 24
        ) {

          const pnl =
            ((latestPrice -
              activeTrade.entryPrice) /
              activeTrade.entryPrice) *
            100;

          totalPnl += pnl;

          timedOut++;

          activeTrade = null;

          continue;
        }

        // ===================
        // TAKE PROFIT
        // ===================

        if (
          latestPrice >=
          activeTrade.takeProfit
        ) {

          wins++;

          const pnl =
            ((latestPrice -
              activeTrade.entryPrice) /
              activeTrade.entryPrice) *
            100;

          totalPnl += pnl;

          activeTrade = null;
        }

        // ===================
        // STOP LOSS
        // ===================

        else if (
          latestPrice <=
          activeTrade.stopLoss
        ) {

          losses++;

          const pnl =
            ((latestPrice -
              activeTrade.entryPrice) /
              activeTrade.entryPrice) *
            100;

          totalPnl += pnl;

          activeTrade = null;
        }
      }
    }

    // =======================
    // RESULTS
    // =======================

    const totalTrades =
      wins +
      losses +
      timedOut;

    const winRate =
      totalTrades > 0
        ? (
            (wins /
              totalTrades) *
            100
          ).toFixed(2)
        : 0;

    results.push({
      threshold,

      totalTrades,

      wins,

      losses,

      timedOut,

      winRate,

      totalPnl:
        totalPnl.toFixed(2),
    });
  }

  // =========================
  // SORT RESULTS
  // =========================

  results.sort(
    (a, b) =>
      parseFloat(
        b.totalPnl
      ) -
      parseFloat(
        a.totalPnl
      )
  );

  console.log(
    "Backtest completed"
  );

  return results;
}

module.exports = {
  runBacktest,
};
