/*
==================================================
GLOBAL OPTIMIZATION ENGINE
==================================================
PHASE 9
PART 1
==================================================
*/

const {
    analyzeEnterpriseAIManager
} = require("./enterpriseAIManager");

const {
    analyzeGlobalAISupervisor
} = require("./globalAISupervisor");

const {
    analyzeMasterAIController
} = require("./masterAIController");

const {
    analyzeMetaLearning
} = require("./metaLearningV2");

let cachedOptimization = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
GLOBAL OPTIMIZATION SCORE
==================================================
*/

function calculateOptimizationScore({

    enterprise,

    supervisor,

    controller,

    meta

}) {

    const score =

        (

            Number(
                enterprise.enterpriseScore || 0
            ) * 0.35 +

            Number(
                supervisor.supervisorScore || 0
            ) * 0.25 +

            Number(
                controller.aiControlScore || 0
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
OPTIMIZATION LEVEL
==================================================
*/

function determineOptimizationLevel(
    score
) {

    if (score >= 95) {

        return "GLOBAL_SELF_OPTIMIZING";

    }

    if (score >= 85) {

        return "ENTERPRISE_OPTIMIZING";

    }

    if (score >= 70) {

        return "ADAPTIVE_OPTIMIZING";

    }

    if (score >= 55) {

        return "STANDARD_OPTIMIZING";

    }

    return "STATIC";

}

/*
==================================================
OPTIMIZATION CAPABILITIES
==================================================
*/

function buildOptimizationCapabilities(
    level
) {

    return {

        optimizeStrategies:

            level !== "STATIC",

        optimizePortfolio:

            level !== "STATIC",

        optimizeRisk:

            level === "GLOBAL_SELF_OPTIMIZING" ||

            level === "ENTERPRISE_OPTIMIZING",

        selfEvolution:

            level === "GLOBAL_SELF_OPTIMIZING"

    };

}
/*
==================================================
GLOBAL OPTIMIZATION RECOMMENDATION
==================================================
*/

function generateOptimizationRecommendation({

    score,

    level,

    enterprise,

    supervisor

}) {

    return {

        score,

        level,

        recommendation:

            score >= 95

                ? "FULLY_SELF_OPTIMIZING"

            : score >= 85

                ? "ENTERPRISE_OPTIMIZATION"

            : score >= 70

                ? "ADAPTIVE_OPTIMIZATION"

            : score >= 55

                ? "STANDARD_OPTIMIZATION"

            : "MANUAL_OPTIMIZATION",

        tradingEnabled:

            enterprise.recommendation
                ?.tradingEnabled || false,

        emergencyStop:

            supervisor.recommendation
                ?.emergencyStop || false

    };

}

/*
==================================================
GLOBAL HEALTH
==================================================
*/

function calculateOptimizationHealth({

    enterprise,

    supervisor,

    controller,

    meta

}) {

    const health =

        (

            Number(
                enterprise.enterpriseHealth || 0
            ) * 0.30 +

            Number(
                supervisor.globalHealth || 0
            ) * 0.25 +

            Number(
                controller.aiHealth || 0
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
OPTIMIZATION STATUS
==================================================
*/

function determineOptimizationStatus(
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

async function analyzeGlobalOptimization() {

    try {

        const now = Date.now();

        if (

            cachedOptimization &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedOptimization;

        }

        const enterprise =
            await analyzeEnterpriseAIManager();

        const supervisor =
            await analyzeGlobalAISupervisor();

        const controller =
            await analyzeMasterAIController();

        const meta =
            await analyzeMetaLearning();

        const optimizationScore =
            calculateOptimizationScore({

                enterprise,

                supervisor,

                controller,

                meta

            });

        const optimizationLevel =
            determineOptimizationLevel(
                optimizationScore
            );

        const capabilities =
            buildOptimizationCapabilities(
                optimizationLevel
            );

        const recommendation =
            generateOptimizationRecommendation({

                score: optimizationScore,

                level: optimizationLevel,

                enterprise,

                supervisor

            });

        const optimizationHealth =
            calculateOptimizationHealth({

                enterprise,

                supervisor,

                controller,

                meta

            });

        const optimizationStatus =
            determineOptimizationStatus(
                optimizationHealth
            );

        const result = {

            generatedAt:
                new Date(),

            optimizationScore,

            optimizationLevel,

            capabilities,

            recommendation,

            optimizationHealth,

            optimizationStatus,

            enterprise,

            supervisor,

            controller,

            meta

        };

        cachedOptimization =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
GLOBAL OPTIMIZATION ENGINE
==================================

Optimization Score:
${optimizationScore}

Optimization Level:
${optimizationLevel}

Optimization Health:
${optimizationHealth}

Optimization Status:
${optimizationStatus}

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
GLOBAL OPTIMIZATION ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            optimizationScore: 0,

            optimizationLevel: "STATIC",

            capabilities: {

                optimizeStrategies: false,

                optimizePortfolio: false,

                optimizeRisk: false,

                selfEvolution: false

            },

            recommendation: {

                score: 0,

                level: "STATIC",

                recommendation: "MANUAL_OPTIMIZATION",

                tradingEnabled: false,

                emergencyStop: true

            },

            optimizationHealth: 0,

            optimizationStatus: "CRITICAL",

            enterprise: {},

            supervisor: {},

            controller: {},

            meta: {}

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearGlobalOptimizationCache() {

    cachedOptimization = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeGlobalOptimization,

    clearGlobalOptimizationCache,

    calculateOptimizationScore,

    determineOptimizationLevel,

    buildOptimizationCapabilities,

    generateOptimizationRecommendation,

    calculateOptimizationHealth,

    determineOptimizationStatus

};
