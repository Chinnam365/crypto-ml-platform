const {
  optimizeSystemBehavior,
} = require("./selfOptimizer");

const {
  analyzeStrategyPerformance,
} = require("./strategyAnalytics");

const {
  getAdaptiveSymbolWeights,
} = require("./adaptiveSymbolWeights");

/*
==================================================
META-COORDINATION INTELLIGENCE
==================================================
*/

async function generateSystemAnalytics() {

  try {

    /*
    ==================================================
    SELF-HEALING STATUS
    ==================================================
    */

    const optimizer =
      await optimizeSystemBehavior();

    /*
    ==================================================
    STRATEGY EVOLUTION
    ==================================================
    */

    const strategyAnalytics =
      await analyzeStrategyPerformance();

    /*
    ==================================================
    SYMBOL INTELLIGENCE
    ==================================================
    */

    const symbolData =
      await getAdaptiveSymbolWeights();

    /*
    ==================================================
    PROMOTED STRATEGIES
    ==================================================
    */

    const promotedCount =

      strategyAnalytics
        .promotedStrategies
        .length;

    /*
    ==================================================
    SUPPRESSED STRATEGIES
    ==================================================
    */

    const suppressedCount =

      strategyAnalytics
        .suppressedStrategies
        .length;

    /*
    ==================================================
    TOP SYMBOLS
    ==================================================
    */

    const topSymbols =

      symbolData.rankings
        .slice(0, 5);

    /*
    ==================================================
    SYSTEM STABILITY
    ==================================================
    */

    let systemStability = 100;

    systemStability -=

      optimizer.degradationScore;

    /*
    Clamp
    */

    systemStability =

      Math.max(
        0,
        Math.min(
          systemStability,
          100
        )
      );

    systemStability =
      Number(
        systemStability.toFixed(2)
      );

    /*
    ==================================================
    SYSTEM MODE
    ==================================================
    */

    let systemMode =
      "BALANCED";

    /*
    Healing mode
    */

    if (
      optimizer.healingMode
    ) {

      systemMode =
        "SELF_HEALING";
    }

    /*
    Aggressive exploitation
    */

    else if (
      optimizer.exploitationRate >=
      0.85
    ) {

      systemMode =
        "HIGH_CONFIDENCE";
    }

    /*
    Exploratory adaptation
    */

    else if (
      optimizer.explorationRate >=
      0.5
    ) {

      systemMode =
        "ADAPTIVE_EXPLORATION";
    }

    /*
    ==================================================
    AI HEALTH SCORE
    ==================================================
    */

    let aiHealthScore =

      (
        systemStability * 0.5
      )

      +

      (
        optimizer.confidenceMultiplier
        * 25
      )

      +

      (
        promotedCount * 2
      )

      -

      (
        suppressedCount * 1.5
      );

    /*
    Clamp
    */

    aiHealthScore =

      Math.max(
        1,
        Math.min(
          aiHealthScore,
          100
        )
      );

    aiHealthScore =
      Number(
        aiHealthScore.toFixed(2)
      );

    /*
    ==================================================
    ADAPTATION LEVEL
    ==================================================
    */

    let adaptationLevel =
      "NORMAL";

    if (
      aiHealthScore >= 85
    ) {

      adaptationLevel =
        "HIGHLY_ADAPTIVE";
    }

    else if (
      aiHealthScore <= 45
    ) {

      adaptationLevel =
        "DEFENSIVE_ADAPTATION";
    }

    /*
    ==================================================
    META INTELLIGENCE SUMMARY
    ==================================================
    */

    const summary = {

      aiHealthScore,

      systemStability,

      systemMode,

      adaptationLevel,

      healingMode:
        optimizer.healingMode,

      degradationScore:
        optimizer.degradationScore,

      explorationRate:
        optimizer.explorationRate,

      exploitationRate:
        optimizer.exploitationRate,

      confidenceMultiplier:
        optimizer.confidenceMultiplier,

      promotedStrategies:
        promotedCount,

      suppressedStrategies:
        suppressedCount,

      topSymbols,
    };

    /*
    ==================================================
    LOGGING
    ==================================================
    */

    console.log(`
==================================
META-COORDINATION INTELLIGENCE
==================================

AI Health Score:
${summary.aiHealthScore}

System Stability:
${summary.systemStability}

System Mode:
${summary.systemMode}

Adaptation Level:
${summary.adaptationLevel}

Healing Mode:
${summary.healingMode}

Degradation Score:
${summary.degradationScore}

Exploration Rate:
${summary.explorationRate}

Exploitation Rate:
${summary.exploitationRate}

Promoted Strategies:
${summary.promotedStrategies}

Suppressed Strategies:
${summary.suppressedStrategies}

==================================
TOP SYMBOL INTELLIGENCE
==================================
`);

    console.table(
      topSymbols
    );

    console.log(`
==================================
`);

    /*
    ==================================================
    RETURN
    ==================================================
    */

    return summary;

  } catch (err) {

    console.log(`
==================================
META-COORDINATION ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);

    return {

      aiHealthScore: 50,

      systemStability: 50,

      systemMode: "BALANCED",

      adaptationLevel:
        "NORMAL",

      healingMode: false,

      degradationScore: 0,

      explorationRate: 0.3,

      exploitationRate: 0.7,

      confidenceMultiplier: 1,

      promotedStrategies: 0,

      suppressedStrategies: 0,

      topSymbols: [],
    };
  }
}

module.exports = {
  generateSystemAnalytics,
};
