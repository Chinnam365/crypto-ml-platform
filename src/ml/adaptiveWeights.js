const {
  calculateFeatureImportance,
} = require("./featureImportanceEngine");

/*
==================================================
ADAPTIVE WEIGHT ENGINE
==================================================
*/

async function getAdaptiveWeights() {

  try {

    const analytics =
      await calculateFeatureImportance();

    /*
    ==================================================
    DEFAULT WEIGHTS
    ==================================================
    */

    let weights = {

      trend: 25,

      momentum: 25,

      alignment: 20,

      volatility: 15,

      rsi: 15,
    };

    /*
    ==================================================
    NOT ENOUGH DATA
    ==================================================
    */

    if (
      !analytics.success
    ) {

      return weights;
    }

    const report =
      analytics.report;

    /*
    ==================================================
    ADJUST ALIGNMENT
    ==================================================
    */

    const alignmentWinRate =
      report?.alignment
        ?.highAlignmentWinRate || 50;

    if (
      alignmentWinRate >= 70
    ) {

      weights.alignment = 30;
    }

    else if (
      alignmentWinRate >= 60
    ) {

      weights.alignment = 25;
    }

    /*
    ==================================================
    ADJUST MOMENTUM
    ==================================================
    */

    const momentumWinRate =
      report?.momentum
        ?.bullishMomentumWinRate || 50;

    if (
      momentumWinRate >= 70
    ) {

      weights.momentum = 30;
    }

    else if (
      momentumWinRate >= 60
    ) {

      weights.momentum = 25;
    }

    /*
    ==================================================
    ADJUST VOLATILITY
    ==================================================
    */

    const volatilityWinRate =
      report?.volatility
        ?.normalVolatilityWinRate || 50;

    if (
      volatilityWinRate < 45
    ) {

      weights.volatility = 10;
    }

    /*
    ==================================================
    NORMALIZE TOTAL
    ==================================================
    */

    const total =

      weights.trend +

      weights.momentum +

      weights.alignment +

      weights.volatility +

      weights.rsi;

    weights.trend =
      Number(
        (
          (weights.trend / total)
          * 100
        ).toFixed(2)
      );

    weights.momentum =
      Number(
        (
          (weights.momentum / total)
          * 100
        ).toFixed(2)
      );

    weights.alignment =
      Number(
        (
          (weights.alignment / total)
          * 100
        ).toFixed(2)
      );

    weights.volatility =
      Number(
        (
          (weights.volatility / total)
          * 100
        ).toFixed(2)
      );

    weights.rsi =
      Number(
        (
          (weights.rsi / total)
          * 100
        ).toFixed(2)
      );

    return weights;

  } catch (err) {

    console.log(

      "Adaptive weight error:",

      err.message
    );

    return {

      trend: 25,

      momentum: 25,

      alignment: 20,

      volatility: 15,

      rsi: 15,
    };
  }
}

module.exports = {
  getAdaptiveWeights,
};
