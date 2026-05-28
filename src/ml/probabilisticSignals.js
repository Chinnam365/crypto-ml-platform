function calculateSignalScores({

  rsi = 50,

  macd = 0,

  trend = "SIDEWAYS",

  regime = "SIDEWAYS",

  multiTf = {},
}) {

  let buyScore = 0;

  let sellScore = 0;

  /*
  =========================================
  RSI
  =========================================
  */

  if (rsi < 25) {

    buyScore += 35;
  }

  else if (rsi < 35) {

    buyScore += 25;
  }

  else if (rsi < 45) {

    buyScore += 15;
  }

  else if (rsi < 55) {

    buyScore += 5;
  }

  if (rsi > 75) {

    sellScore += 35;
  }

  else if (rsi > 65) {

    sellScore += 25;
  }

  else if (rsi > 55) {

    sellScore += 15;
  }

  else if (rsi > 45) {

    sellScore += 5;
  }

  /*
  =========================================
  MACD
  =========================================
  */

  if (macd > 0.5) {

    buyScore += 25;
  }

  else if (macd > 0) {

    buyScore += 15;
  }

  if (macd < -0.5) {

    sellScore += 25;
  }

  else if (macd < 0) {

    sellScore += 15;
  }

  /*
  =========================================
  TREND
  =========================================
  */

  if (trend === "BULLISH") {

    buyScore += 25;
  }

  else if (trend === "BEARISH") {

    sellScore += 25;
  }

  /*
  =========================================
  REGIME
  =========================================
  */

  if (regime === "TRENDING") {

    buyScore += 15;

    sellScore += 15;
  }

  else if (regime === "VOLATILE") {

    buyScore += 10;

    sellScore += 10;
  }

  /*
  =========================================
  MULTI TIMEFRAME
  =========================================
  */

  if (

    multiTf?.overallTrend ===
    "BULLISH"

  ) {

    buyScore += 25;
  }

  else if (

    multiTf?.overallTrend ===
    "BEARISH"

  ) {

    sellScore += 25;
  }

  /*
  =========================================
  ALIGNMENT BONUS
  =========================================
  */

  if (

    trend === "BULLISH"

    &&

    multiTf?.overallTrend ===
    "BULLISH"

  ) {

    buyScore += 15;
  }

  if (

    trend === "BEARISH"

    &&

    multiTf?.overallTrend ===
    "BEARISH"

  ) {

    sellScore += 15;
  }

  /*
  =========================================
  SIDEWAYS PENALTY
  =========================================
  */

  if (
    trend === "SIDEWAYS"
  ) {

    buyScore -= 5;

    sellScore -= 5;
  }

  /*
  =========================================
  SAFETY FLOOR
  =========================================
  */

  buyScore =
    Math.max(
      0,
      Math.round(buyScore)
    );

  sellScore =
    Math.max(
      0,
      Math.round(sellScore)
    );

  /*
  =========================================
  DEBUG LOG
  =========================================
  */

  console.log(`
==================================
PROBABILISTIC SIGNAL ENGINE
==================================

RSI:
${rsi}

MACD:
${macd}

Trend:
${trend}

Regime:
${regime}

Buy Score:
${buyScore}

Sell Score:
${sellScore}

==================================
`);

  return {

    buyScore,

    sellScore,
  };
}

module.exports = {
  calculateSignalScores,
};
