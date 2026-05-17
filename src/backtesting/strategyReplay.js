const {
  calculateRSI,
} = require("../indicators/rsi");

const {
  calculateMACD,
} = require("../indicators/macd");

function replayStrategy(candles) {

  const closes =
    candles.map(c => c.close);

  const trades = [];

  for (
    let i = 30;
    i < candles.length - 1;
    i++
  ) {

    const slice =
      closes.slice(0, i);

    const rsi =
      calculateRSI(slice);

    const macd =
      calculateMACD(slice);

    const entryPrice =
      candles[i].close;

    const nextPrice =
      candles[i + 1].close;

    let side = "HOLD";

    // =========================
    // BUY
    // =========================

    if (

      rsi < 45 &&

      macd > -1

    ) {

      side = "BUY";
    }

    // =========================
    // SELL
    // =========================

    else if (

      rsi > 55 &&

      macd < 1

    ) {

      side = "SELL";
    }

    if (side === "HOLD") {

      continue;
    }

    let pnl = 0;

    if (side === "BUY") {

      pnl =
        nextPrice -
        entryPrice;
    }

    if (side === "SELL") {

      pnl =
        entryPrice -
        nextPrice;
    }

    trades.push({

      side,

      entryPrice,

      exitPrice:
        nextPrice,

      pnl:
        Number(
          pnl.toFixed(2)
        ),
    });
  }

  return trades;
}

module.exports = {
  replayStrategy,
};
