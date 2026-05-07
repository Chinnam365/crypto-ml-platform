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
    "Starting walk-forward validation..."
  );

  // =========================
  // LOAD DATA
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
  // WALK-FORWARD SPLIT
  // =========================

  const splitIndex =
    Math.floor(
      candles5m.length * 0.7
    );

  // =========================
  // PARAMETERS
  // =========================

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

  // =========================
  // TEST COMBINATIONS
  // =========================

  for (const threshold of thresholds) {

    for (const tp of tpLevels) {

      for (const sl of slLevels) {

        // =====================
        // TRAINING STATS
        // =====================

        let trainingPnl = 0;
        let trainingWins = 0;
        let trainingTrades = 0;

        // =====================
        // VALIDATION STATS
        // =====================

        let validationPnl = 0;
        let validationWins = 0;
        let validationTrades = 0;

        let activeTrade = null;

        // =====================
        // REPLAY LOOP
        // =====================

        for (
          let i = 50;
          i < candles5m.length;
          i++
        ) {

          // ===================
          // DATA SEGMENT
          // ===================

          const isValidation =
            i >= splitIndex;

          // ===================
          // 5M DATA
          // ===================

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

          // ===================
          // VOL REGIME
          // ===================

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

          // ===================
          // 15M DATA
          // ===================

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

          // ===================
          // 1H DATA
          // ===================

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

          // ===================
          // BTC DATA
          // ===================

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

          // ===================
          // CONDITIONS
          // ===================

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

          // ===================
          // SCORE
          // ===================

          let {
            score,
          } = calculateScore({
            btcBullish,

            bullish1h,

            bullish15m,

            bullish5m,

            idealRsi,
          });

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

          // ===================
          // OPEN TRADE
          // ===================

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

              isValidation,
            };
          }

          // ===================
          // MONITOR TRADE
          // ===================

          if (activeTrade) {

            const candlesOpen =
              i -
              activeTrade.openedAt;

            let pnl = null;

            // TIMEOUT

            if (
              candlesOpen >= 24
            ) {

              pnl =
                ((latestPrice -
                  activeTrade.entryPrice) /
                  activeTrade.entryPrice) *
                100;
            }

            // TAKE PROFIT

            else if (
              latestPrice >=
              activeTrade.takeProfit
            ) {

              pnl =
                ((latestPrice -
                  activeTrade.entryPrice) /
                  activeTrade.entryPrice) *
                100;

              if (
                activeTrade.isValidation
              ) {
                validationWins++;
              } else {
                trainingWins++;
              }
            }

            // STOP LOSS

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

            // ===================
            // APPLY RESULTS
            // ===================

            if (pnl !== null) {

              if (
                activeTrade.isValidation
              ) {

                validationPnl += pnl;

                validationTrades++;

              } else {

                trainingPnl += pnl;

                trainingTrades++;
              }

              activeTrade = null;
            }
          }
        }

        // =====================
        // WIN RATES
        // =====================

        const trainingWinRate =
          trainingTrades > 0
            ? (
                (trainingWins /
                  trainingTrades) *
                100
              ).toFixed(2)
            : 0;

        const validationWinRate =
          validationTrades > 0
            ? (
                (validationWins /
                  validationTrades) *
                100
              ).toFixed(2)
            : 0;

        // =====================
        // RESULTS
        // =====================

        results.push({
          threshold,

          takeProfit:
            tp,

          stopLoss:
            sl,

          trainingTrades,

          validationTrades,

          trainingWinRate,

          validationWinRate,

          trainingPnl:
            trainingPnl.toFixed(2),

          validationPnl:
            validationPnl.toFixed(2),
        });
      }
    }
  }

  // =========================
  // SORT BY VALIDATION
  // =========================

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
    "Walk-forward validation completed"
  );

  return results.slice(0, 20);
}

module.exports = {
  runBacktest,
};
