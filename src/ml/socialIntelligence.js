function analyzeSocialTrend({

  mentions,

  growthRate,

}) {

  let score =

    mentions *

    (
      1 +
      growthRate
    );

  let sentiment =
    "NEUTRAL";

  if (
    score > 10000
  ) {

    sentiment =
      "BULLISH";
  }

  if (
    score < 1000
  ) {

    sentiment =
      "BEARISH";
  }

  return {

    score,

    sentiment,
  };
}

module.exports = {
  analyzeSocialTrend,
};
