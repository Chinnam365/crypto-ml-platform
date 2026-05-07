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

// ======================================
// CORE BACKTEST FUNCTION
// ======================================

async function runBacktest() {

  console.log(
    "Starting large-scale walk-forward backtest..."
  );

  // ======================================
  // LOAD MASSIVE HISTORICAL DATA
  // ======================================

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

  // ======================================
  // MULTI WALK-FORWARD WINDOWS
  // ======================================

  const walkForwardWindows = [
    {
      trainStart: 0,
      trainEnd: 0.5,
      validationStart: 0.5,
      validationEnd: 0.65,
    },

    {
      trainStart: 0.15,
      trainEnd: 0.65,
      validationStart: 0.65,
      validationEnd: 0.8,
    },

    {
      trainStart: 0.3,
      trainEnd: 0.8,
      validationStart: 0.8,
      validationEnd: 1.0,
    },
  ];

  // ======================================
  // PARAMETERS
  // ======================================

  const thresholds = [6, 7, 8];

  const tpLevels = [
    0.005,
    0.007,
  ];

  const slLevels = [
    0.005,
    0.007,
  ];

  const results = [];

  // ======================================
  // TEST COMBINATIONS
  // ======================================

  for (const threshold of thresholds) {

    for (const tp of tpLevels) {

      for (const sl of slLevels) {

        let totalTrainingPnl = 0;

        let totalValidationPnl = 0;

        let totalTrainingTrades = 0;

        let totalValidationTrades = 0;

        let totalTrainingWins = 0;

        let totalValidationWins = 0;

        // ==================================
        // WALK-FORWARD WINDOWS
        // ==================================

        for (const window of walkForwardWindows) {

          const trainStart =
            Math.floor(
              candles5m.length *
                window.trainStart
            );

          const trainEnd =
            Math.floor(
              candles5m.length *
                window.trainEnd
            );

          const validationStart =
            Math.floor(
              candles5m.length *
                window.validationStart
            );

          const validationEnd =
            Math.floor(
              candles5m.length *
                window.validationEnd
            );

          let activeTrade = null;

          // ================================
          // REPLAY LOOP
          // ================================

          for (
            let i = 50;
            i < validationEnd;
            i++
          ) {

            const isTraining =
              i >= trainStart &&
              i < trainEnd;

            const isValidation =
              i >= validationStart &&
              i < validationEnd;

            if (
              !isTraining &&
              !isValidation
            ) {
              continue;
            }

            // ==============================
            // 5M DATA
            // ==============================

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

            // ==============================
            // VOLATILITY REGIME
            // ==============================

            let volatilityRegime =
              "LOW_VOL";

            if (
              volatility >= 0.0015
            ) {
              volatilityRegime =
                "HIGH_VOL";
            }

            else if (
              volatility >= 0.0008
            ) {
              volatilityRegime =
                "MEDIUM_VOL";
            }

            // ==============================
            // 15M DATA
            // ==============================

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

            // ==============================
            // 1H DATA
            // ==============================

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

            // ==============================
            // BTC DATA
            // ==============================

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

            // ==============================
            // CONDITIONS
            // ==============================

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

            // ==============================
            // SCORE
            // ==============================

            let {
              score,
            } = calculateScore({
              btcBullish,
              bullish1h,
              bullish15m,
              bullish5m,
              idealRsi,
            });

            // volatility weighting

            if (
              volatilityRegime ===
              "MEDIUM_VOL"
            ) {
              score += 2;
            }

            if (
              volatilityRegime ===
              "HIGH_VOL"
            ) {
              score += 1;
            }

            // ==============================
            // ENTRY
            // ==============================

            if (
              !activeTrade &&
              score >= threshold &&
              btcBullish
            ) {

              activeTrade = {
                entryPrice:
                  latestPrice,

                takeProfit:
                  latestPrice *
                  (1 + tp),

                stopLoss:
                  latestPrice *
                  (1 - sl),

                openedAt: i,

                isTraining,
                isValidation,
              };
            }

            // ==============================
            // TRADE MANAGEMENT
            // ==============================

            if (activeTrade) {

              const candlesOpen =
                i -
                activeTrade.openedAt;

              let pnl = null;

              let win = false;

              // timeout

              if (
                candlesOpen >= 24
              ) {

                pnl =
                  ((latestPrice -
                    activeTrade.entryPrice) /
                    activeTrade.entryPrice) *
                  100;
              }

              // take profit

              else if (
                latestPrice >=
                activeTrade.takeProfit
              ) {

                pnl =
                  ((latestPrice -
                    activeTrade.entryPrice) /
                    activeTrade.entryPrice) *
                  100;

                win = true;
              }

              // stop loss

              else if (
                latestPrice <=
                activeTrade.stopLoss
              ) {

                pnl =
                  ((latestPrice -
                    activeTrade.entryPrice) /
                    activeTrade.entryPrice) *
                  100;
              }

              // ============================
              // APPLY RESULTS
              // ============================

              if (pnl !== null) {

                // training

                if (
                  activeTrade.isTraining
                ) {

                  totalTrainingPnl +=
                    pnl;

                  totalTrainingTrades++;

                  if (win) {
                    totalTrainingWins++;
                  }
                }

                // validation

                if (
                  activeTrade.isValidation
                ) {

                  totalValidationPnl +=
                    pnl;

                  totalValidationTrades++;

                  if (win) {
                    totalValidationWins++;
                  }
                }

                activeTrade = null;
              }
            }
          }
        }

        // ==================================
        // FINAL METRICS
        // ==================================

        const trainingWinRate =
          totalTrainingTrades > 0
            ? (
                (totalTrainingWins /
                  totalTrainingTrades) *
                100
              ).toFixed(2)
            : 0;

        const validationWinRate =
          totalValidationTrades > 0
            ? (
                (totalValidationWins /
                  totalValidationTrades) *
                100
              ).toFixed(2)
            : 0;

        results.push({
          threshold,

          takeProfit: tp,

          stopLoss: sl,

          trainingTrades:
            totalTrainingTrades,

          validationTrades:
            totalValidationTrades,

          trainingWinRate,

          validationWinRate,

          trainingPnl:
            totalTrainingPnl.toFixed(2),

          validationPnl:
            totalValidationPnl.toFixed(2),
        });
      }
    }
  }

  // ======================================
  // SORT BY VALIDATION PERFORMANCE
  // ======================================

  results.sort(
    (a, b) =>
      parseFloat(
        b.validationPnl
      ) -
      parseFloat(
        a.validationPnl
      )
  );

  console.log(
    "Large-scale walk-forward completed"
  );

  return results.slice(0, 20);
}

module.exports = {
  runBacktest,
};
