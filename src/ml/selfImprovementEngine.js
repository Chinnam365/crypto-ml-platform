/*
==================================================
SELF IMPROVEMENT ENGINE
==================================================
PHASE 9
PART 1
==================================================
*/

const {
    analyzeGlobalOptimization
} = require("./globalOptimizationEngine");

const {
    analyzeEnterpriseAIManager
} = require("./enterpriseAIManager");

const {
    analyzeMetaLearning
} = require("./metaLearningV2");

const {
    analyzePortfolioAnalytics
} = require("./portfolioAnalytics");

let cachedImprovement = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
SELF IMPROVEMENT SCORE
==================================================
*/

function calculateSelfImprovementScore({

    optimization,

    enterprise,

    meta,

    portfolio

}) {

    const score =

        (

            Number(
                optimization.optimizationScore || 0
            ) * 0.35 +

            Number(
                enterprise.enterpriseScore || 0
            ) * 0.25 +

            Number(
                meta.metaLearningScore || 0
            ) * 0.20 +

            Number(
                portfolio.performanceScore || 0
            ) * 0.20

        );

    return Number(
        score.toFixed(2)
    );

}

/*
==================================================
SELF IMPROVEMENT LEVEL
==================================================
*/

function determineSelfImprovementLevel(
    score
) {

    if (score >= 95) {

        return "CONTINUOUS_SELF_EVOLUTION";

    }

    if (score >= 85) {

        return "AUTONOMOUS_SELF_IMPROVEMENT";

    }

    if (score >= 70) {

        return "ADAPTIVE_IMPROVEMENT";

    }

    if (score >= 55) {

        return "GUIDED_IMPROVEMENT";

    }

    return "STATIC";

}

/*
==================================================
SELF IMPROVEMENT CAPABILITIES
==================================================
*/

function buildSelfImprovementCapabilities(
    level
) {

    return {

        strategyLearning:

            level !== "STATIC",

        parameterOptimization:

            level !== "STATIC",

        modelEvolution:

            level === "AUTONOMOUS_SELF_IMPROVEMENT" ||

            level === "CONTINUOUS_SELF_EVOLUTION",

        continuousLearning:

            level === "CONTINUOUS_SELF_EVOLUTION"

    };

}
/*
==================================================
SELF IMPROVEMENT RECOMMENDATION
==================================================
*/

function generateSelfImprovementRecommendation({

    score,

    level,

    optimization,

    enterprise

}) {

    return {

        score,

        level,

        recommendation:

            score >= 95

                ? "ENABLE_CONTINUOUS_SELF_EVOLUTION"

            : score >= 85

                ? "ENABLE_AUTONOMOUS_SELF_IMPROVEMENT"

            : score >= 70

                ? "ENABLE_ADAPTIVE_IMPROVEMENT"

            : score >= 55

                ? "ENABLE_GUIDED_IMPROVEMENT"

            : "MANUAL_IMPROVEMENT",

        tradingEnabled:

            enterprise.recommendation
                ?.tradingEnabled || false,

        emergencyStop:

            optimization.recommendation
                ?.emergencyStop || false

    };

}

/*
==================================================
SELF IMPROVEMENT HEALTH
==================================================
*/

function calculateSelfImprovementHealth({

    optimization,

    enterprise,

    meta,

    portfolio

}) {

    const health =

        (

            Number(
                optimization.optimizationHealth || 0
            ) * 0.30 +

            Number(
                enterprise.enterpriseHealth || 0
            ) * 0.25 +

            Number(
                meta.metaLearningScore || 0
            ) * 0.20 +

            Number(
                portfolio.consistencyScore || 0
            ) * 0.25

        );

    return Number(
        health.toFixed(2)
    );

}

/*
==================================================
SELF IMPROVEMENT STATUS
==================================================
*/

function determineSelfImprovementStatus(
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

        return "STABLE";

    }

    if (health >= 40) {

        return "DEGRADED";

    }

    return "CRITICAL";

}
/*
==================================================
MAIN ENGINE
==================================================
*/

async function analyzeSelfImprovement() {

    try {

        const now = Date.now();

        if (

            cachedImprovement &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedImprovement;

        }

        const optimization =
            await analyzeGlobalOptimization();

        const enterprise =
            await analyzeEnterpriseAIManager();

        const meta =
            await analyzeMetaLearning();

        const portfolio =
            await analyzePortfolioAnalytics();

        const selfImprovementScore =
            calculateSelfImprovementScore({

                optimization,

                enterprise,

                meta,

                portfolio

            });

        const selfImprovementLevel =
            determineSelfImprovementLevel(
                selfImprovementScore
            );

        const capabilities =
            buildSelfImprovementCapabilities(
                selfImprovementLevel
            );

        const recommendation =
            generateSelfImprovementRecommendation({

                score: selfImprovementScore,

                level: selfImprovementLevel,

                optimization,

                enterprise

            });

        const selfImprovementHealth =
            calculateSelfImprovementHealth({

                optimization,

                enterprise,

                meta,

                portfolio

            });

        const selfImprovementStatus =
            determineSelfImprovementStatus(
                selfImprovementHealth
            );

        const result = {

            generatedAt:
                new Date(),

            selfImprovementScore,

            selfImprovementLevel,

            capabilities,

            recommendation,

            selfImprovementHealth,

            selfImprovementStatus,

            optimization,

            enterprise,

            meta,

            portfolio

        };

        cachedImprovement =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
SELF IMPROVEMENT ENGINE
==================================

Self Improvement Score:
${selfImprovementScore}

Improvement Level:
${selfImprovementLevel}

Health:
${selfImprovementHealth}

Status:
${selfImprovementStatus}

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
SELF IMPROVEMENT ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            selfImprovementScore: 0,

            selfImprovementLevel: "STATIC",

            capabilities: {

                strategyLearning: false,

                parameterOptimization: false,

                modelEvolution: false,

                continuousLearning: false

            },

            recommendation: {

                score: 0,

                level: "STATIC",

                recommendation: "MANUAL_IMPROVEMENT",

                tradingEnabled: false,

                emergencyStop: true

            },

            selfImprovementHealth: 0,

            selfImprovementStatus: "CRITICAL",

            optimization: {},

            enterprise: {},

            meta: {},

            portfolio: {}

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearSelfImprovementCache() {

    cachedImprovement = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeSelfImprovement,

    clearSelfImprovementCache,

    calculateSelfImprovementScore,

    determineSelfImprovementLevel,

    buildSelfImprovementCapabilities,

    generateSelfImprovementRecommendation,

    calculateSelfImprovementHealth,

    determineSelfImprovementStatus

};
