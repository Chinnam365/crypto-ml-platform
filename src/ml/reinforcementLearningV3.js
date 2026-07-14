/*
==================================================
REINFORCEMENT LEARNING V3
==================================================
PHASE 23
PART 1
==================================================
*/

const {
    analyzeMacroEconomicIntelligence
} = require("./macroEconomicIntelligence");

const {
    analyzeInstitutionalPortfolio
} = require("./institutionalPortfolioEngine");

const {
    analyzeSelfHealing
} = require("./selfHealingEngine");

const {
    analyzeMetaLearning
} = require("./metaLearningV2");

let cachedRL = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
REINFORCEMENT SCORE
==================================================
*/

function calculateReinforcementScore({

    macro,

    institutional,

    healing,

    meta

}) {

    const score =

        (

            Number(
                macro.macroScore || 0
            ) * 0.35 +

            Number(
                institutional.institutionalScore || 0
            ) * 0.25 +

            Number(
                healing.healingScore || 0
            ) * 0.20 +

            Number(
                meta.metaLearningScore || 0
            ) * 0.20

        );

    return Number(
        score.toFixed(2)
    );

}

/*
==================================================
REINFORCEMENT LEVEL
==================================================
*/

function determineReinforcementLevel(
    score
) {

    if (score >= 95) {

        return "AUTONOMOUS_REINFORCEMENT";

    }

    if (score >= 85) {

        return "INSTITUTIONAL_REINFORCEMENT";

    }

    if (score >= 70) {

        return "ADAPTIVE_REINFORCEMENT";

    }

    if (score >= 55) {

        return "GUIDED_REINFORCEMENT";

    }

    return "STANDARD_REINFORCEMENT";

}

/*
==================================================
REINFORCEMENT CAPABILITIES
==================================================
*/

function buildReinforcementCapabilities(
    level
) {

    return {

        continuousLearning:

            level !== "STANDARD_REINFORCEMENT",

        rewardOptimization:

            level !== "STANDARD_REINFORCEMENT",

        policyEvolution:

            level ===
                "ADAPTIVE_REINFORCEMENT"

            ||

            level ===
                "INSTITUTIONAL_REINFORCEMENT"

            ||

            level ===
                "AUTONOMOUS_REINFORCEMENT",

        autonomousPolicyUpdates:

            level ===
                "AUTONOMOUS_REINFORCEMENT"

    };

}
/*
==================================================
REINFORCEMENT RECOMMENDATION
==================================================
*/

function generateReinforcementRecommendation({

    score,

    level,

    macro,

    institutional

}) {

    return {

        score,

        level,

        recommendation:

            score >= 95

                ? "ENABLE_AUTONOMOUS_REINFORCEMENT"

            : score >= 85

                ? "ENABLE_INSTITUTIONAL_REINFORCEMENT"

            : score >= 70

                ? "ENABLE_ADAPTIVE_REINFORCEMENT"

            : score >= 55

                ? "ENABLE_GUIDED_REINFORCEMENT"

            : "STANDARD_REINFORCEMENT_MODE",

        tradingEnabled:

            macro.recommendation
                ?.tradingEnabled || false,

        emergencyStop:

            institutional.recommendation
                ?.emergencyStop || false

    };

}

/*
==================================================
REINFORCEMENT HEALTH
==================================================
*/

function calculateReinforcementHealth({

    macro,

    institutional,

    healing,

    meta

}) {

    const health =

        (

            Number(
                macro.macroHealth || 0
            ) * 0.30 +

            Number(
                institutional.institutionalHealth || 0
            ) * 0.25 +

            Number(
                healing.healingHealth || 0
            ) * 0.25 +

            Number(
                meta.metaLearningScore || 0
            ) * 0.20

        );

    return Number(
        health.toFixed(2)
    );

}

/*
==================================================
REINFORCEMENT STATUS
==================================================
*/

function determineReinforcementStatus(
    health
) {

    if (health >= 95) {

        return "WORLD_CLASS";

    }

    if (health >= 85) {

        return "EXCELLENT";

    }

    if (health >= 70) {

        return "HEALTHY";

    }

    if (health >= 55) {

        return "ADVANCED";

    }

    if (health >= 40) {

        return "STABLE";

    }

    return "RECOVERY";

}
/*
==================================================
MAIN ENGINE
==================================================
*/

async function analyzeReinforcementLearning() {

    try {

        const now = Date.now();

        if (

            cachedRL &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedRL;

        }

        const macro =
            await analyzeMacroEconomicIntelligence();

        const institutional =
            await analyzeInstitutionalPortfolio();

        const healing =
            await analyzeSelfHealing();

        const meta =
            await analyzeMetaLearning();

        const reinforcementScore =
            calculateReinforcementScore({

                macro,

                institutional,

                healing,

                meta

            });

        const reinforcementLevel =
            determineReinforcementLevel(
                reinforcementScore
            );

        const capabilities =
            buildReinforcementCapabilities(
                reinforcementLevel
            );

        const recommendation =
            generateReinforcementRecommendation({

                score: reinforcementScore,

                level: reinforcementLevel,

                macro,

                institutional

            });

        const reinforcementHealth =
            calculateReinforcementHealth({

                macro,

                institutional,

                healing,

                meta

            });

        const reinforcementStatus =
            determineReinforcementStatus(
                reinforcementHealth
            );

        const result = {

            generatedAt:
                new Date(),

            reinforcementScore,

            reinforcementLevel,

            capabilities,

            recommendation,

            reinforcementHealth,

            reinforcementStatus,

            macro,

            institutional,

            healing,

            meta

        };

        cachedRL =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
REINFORCEMENT LEARNING V3
==================================

Reinforcement Score:
${reinforcementScore}

Reinforcement Level:
${reinforcementLevel}

Reinforcement Health:
${reinforcementHealth}

Reinforcement Status:
${reinforcementStatus}

Trading Enabled:
${recommendation.tradingEnabled}

Emergency Stop:
${recommendation.emergencyStop}

==================================
`);

        return result;

    }

    catch (err) {

        console.log(`
==================================
REINFORCEMENT LEARNING ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            reinforcementScore: 0,

            reinforcementLevel: "STANDARD_REINFORCEMENT",

            capabilities: {

                continuousLearning: false,

                rewardOptimization: false,

                policyEvolution: false,

                autonomousPolicyUpdates: false

            },

            recommendation: {

                score: 0,

                level: "STANDARD_REINFORCEMENT",

                recommendation: "STANDARD_REINFORCEMENT_MODE",

                tradingEnabled: false,

                emergencyStop: true

            },

            reinforcementHealth: 0,

            reinforcementStatus: "RECOVERY",

            macro: {},

            institutional: {},

            healing: {},

            meta: {}

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearReinforcementLearningCache() {

    cachedRL = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeReinforcementLearning,

    clearReinforcementLearningCache,

    calculateReinforcementScore,

    determineReinforcementLevel,

    buildReinforcementCapabilities,

    generateReinforcementRecommendation,

    calculateReinforcementHealth,

    determineReinforcementStatus

};
