/*
==================================================
EXPLAINABLE AI ENGINE
==================================================
PHASE 25
PART 1
==================================================
*/

const {
    analyzeDigitalTwin
} = require("./digitalTwinEngine");

const {
    analyzeReinforcementLearning
} = require("./reinforcementLearningV3");

const {
    analyzeMacroEconomicIntelligence
} = require("./macroEconomicIntelligence");

const {
    analyzeMetaLearning
} = require("./metaLearningV2");

let cachedExplainable = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
EXPLAINABILITY SCORE
==================================================
*/

function calculateExplainabilityScore({

    digitalTwin,

    reinforcement,

    macro,

    meta

}) {

    const score =

        (

            Number(
                digitalTwin.digitalTwinScore || 0
            ) * 0.35 +

            Number(
                reinforcement.reinforcementScore || 0
            ) * 0.25 +

            Number(
                macro.macroScore || 0
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
EXPLAINABILITY LEVEL
==================================================
*/

function determineExplainabilityLevel(
    score
) {

    if (score >= 95) {

        return "FULLY_EXPLAINABLE_AI";

    }

    if (score >= 85) {

        return "ENTERPRISE_EXPLAINABLE_AI";

    }

    if (score >= 70) {

        return "ADVANCED_EXPLAINABILITY";

    }

    if (score >= 55) {

        return "GUIDED_EXPLAINABILITY";

    }

    return "BASIC_EXPLAINABILITY";

}

/*
==================================================
EXPLAINABILITY CAPABILITIES
==================================================
*/

function buildExplainabilityCapabilities(
    level
) {

    return {

        explainPredictions:

            level !== "BASIC_EXPLAINABILITY",

        explainStrategies:

            level !== "BASIC_EXPLAINABILITY",

        rootCauseAnalysis:

            level ===
                "ADVANCED_EXPLAINABILITY"

            ||

            level ===
                "ENTERPRISE_EXPLAINABLE_AI"

            ||

            level ===
                "FULLY_EXPLAINABLE_AI",

        autonomousDecisionAudit:

            level ===
                "FULLY_EXPLAINABLE_AI"

    };

}
/*
==================================================
EXPLAINABILITY RECOMMENDATION
==================================================
*/

function generateExplainabilityRecommendation({

    score,

    level,

    digitalTwin,

    reinforcement

}) {

    return {

        score,

        level,

        recommendation:

            score >= 95

                ? "ENABLE_FULLY_EXPLAINABLE_AI"

            : score >= 85

                ? "ENABLE_ENTERPRISE_EXPLAINABLE_AI"

            : score >= 70

                ? "ENABLE_ADVANCED_EXPLAINABILITY"

            : score >= 55

                ? "ENABLE_GUIDED_EXPLAINABILITY"

            : "BASIC_EXPLAINABILITY_MODE",

        tradingEnabled:

            digitalTwin.recommendation
                ?.tradingEnabled || false,

        emergencyStop:

            reinforcement.recommendation
                ?.emergencyStop || false

    };

}

/*
==================================================
EXPLAINABILITY HEALTH
==================================================
*/

function calculateExplainabilityHealth({

    digitalTwin,

    reinforcement,

    macro,

    meta

}) {

    const health =

        (

            Number(
                digitalTwin.digitalTwinHealth || 0
            ) * 0.30 +

            Number(
                reinforcement.reinforcementHealth || 0
            ) * 0.25 +

            Number(
                macro.macroHealth || 0
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
EXPLAINABILITY STATUS
==================================================
*/

function determineExplainabilityStatus(
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

async function analyzeExplainableAI() {

    try {

        const now = Date.now();

        if (

            cachedExplainable &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedExplainable;

        }

        const digitalTwin =
            await analyzeDigitalTwin();

        const reinforcement =
            await analyzeReinforcementLearning();

        const macro =
            await analyzeMacroEconomicIntelligence();

        const meta =
            await analyzeMetaLearning();

        const explainabilityScore =
            calculateExplainabilityScore({

                digitalTwin,

                reinforcement,

                macro,

                meta

            });

        const explainabilityLevel =
            determineExplainabilityLevel(
                explainabilityScore
            );

        const capabilities =
            buildExplainabilityCapabilities(
                explainabilityLevel
            );

        const recommendation =
            generateExplainabilityRecommendation({

                score: explainabilityScore,

                level: explainabilityLevel,

                digitalTwin,

                reinforcement

            });

        const explainabilityHealth =
            calculateExplainabilityHealth({

                digitalTwin,

                reinforcement,

                macro,

                meta

            });

        const explainabilityStatus =
            determineExplainabilityStatus(
                explainabilityHealth
            );

        const result = {

            generatedAt:
                new Date(),

            explainabilityScore,

            explainabilityLevel,

            capabilities,

            recommendation,

            explainabilityHealth,

            explainabilityStatus,

            digitalTwin,

            reinforcement,

            macro,

            meta

        };

        cachedExplainable =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
EXPLAINABLE AI ENGINE
==================================

Explainability Score:
${explainabilityScore}

Explainability Level:
${explainabilityLevel}

Explainability Health:
${explainabilityHealth}

Explainability Status:
${explainabilityStatus}

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
EXPLAINABLE AI ENGINE ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            explainabilityScore: 0,

            explainabilityLevel: "BASIC_EXPLAINABILITY",

            capabilities: {

                explainPredictions: false,

                explainStrategies: false,

                rootCauseAnalysis: false,

                autonomousDecisionAudit: false

            },

            recommendation: {

                score: 0,

                level: "BASIC_EXPLAINABILITY",

                recommendation: "BASIC_EXPLAINABILITY_MODE",

                tradingEnabled: false,

                emergencyStop: true

            },

            explainabilityHealth: 0,

            explainabilityStatus: "RECOVERY",

            digitalTwin: {},

            reinforcement: {},

            macro: {},

            meta: {}

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearExplainableAICache() {

    cachedExplainable = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeExplainableAI,

    clearExplainableAICache,

    calculateExplainabilityScore,

    determineExplainabilityLevel,

    buildExplainabilityCapabilities,

    generateExplainabilityRecommendation,

    calculateExplainabilityHealth,

    determineExplainabilityStatus

};
