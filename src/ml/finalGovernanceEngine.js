/*
==================================================
FINAL GOVERNANCE ENGINE
==================================================
PHASE 10
PART 1
==================================================
*/

const {
    analyzeSelfImprovement
} = require("./selfImprovementEngine");

const {
    analyzeGlobalOptimization
} = require("./globalOptimizationEngine");

const {
    analyzeEnterpriseAIManager
} = require("./enterpriseAIManager");

const {
    analyzeMasterAIController
} = require("./masterAIController");

let cachedGovernance = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
GOVERNANCE SCORE
==================================================
*/

function calculateGovernanceScore({

    improvement,

    optimization,

    enterprise,

    controller

}) {

    const score =

        (

            Number(
                improvement.selfImprovementScore || 0
            ) * 0.35 +

            Number(
                optimization.optimizationScore || 0
            ) * 0.25 +

            Number(
                enterprise.enterpriseScore || 0
            ) * 0.20 +

            Number(
                controller.aiControlScore || 0
            ) * 0.20

        );

    return Number(
        score.toFixed(2)
    );

}

/*
==================================================
GOVERNANCE LEVEL
==================================================
*/

function determineGovernanceLevel(
    score
) {

    if (score >= 95) {

        return "GLOBAL_AI_GOVERNANCE";

    }

    if (score >= 85) {

        return "ENTERPRISE_GOVERNANCE";

    }

    if (score >= 70) {

        return "AUTONOMOUS_GOVERNANCE";

    }

    if (score >= 55) {

        return "SUPERVISED_GOVERNANCE";

    }

    return "MANUAL_GOVERNANCE";

}

/*
==================================================
GOVERNANCE CAPABILITIES
==================================================
*/

function buildGovernanceCapabilities(
    level
) {

    return {

        autonomousTrading:

            level !== "MANUAL_GOVERNANCE",

        autonomousLearning:

            level !== "MANUAL_GOVERNANCE",

        autonomousOptimization:

            level === "AUTONOMOUS_GOVERNANCE" ||

            level === "ENTERPRISE_GOVERNANCE" ||

            level === "GLOBAL_AI_GOVERNANCE",

        autonomousGovernance:

            level === "GLOBAL_AI_GOVERNANCE"

    };

}
/*
==================================================
GOVERNANCE RECOMMENDATION
==================================================
*/

function generateGovernanceRecommendation({

    score,

    level,

    improvement,

    optimization

}) {

    return {

        score,

        level,

        recommendation:

            score >= 95

                ? "ENABLE_GLOBAL_AI_GOVERNANCE"

            : score >= 85

                ? "ENABLE_ENTERPRISE_GOVERNANCE"

            : score >= 70

                ? "ENABLE_AUTONOMOUS_GOVERNANCE"

            : score >= 55

                ? "ENABLE_SUPERVISED_GOVERNANCE"

            : "MANUAL_GOVERNANCE",

        tradingEnabled:

            improvement.recommendation
                ?.tradingEnabled || false,

        emergencyStop:

            optimization.recommendation
                ?.emergencyStop || false

    };

}

/*
==================================================
GOVERNANCE HEALTH
==================================================
*/

function calculateGovernanceHealth({

    improvement,

    optimization,

    enterprise,

    controller

}) {

    const health =

        (

            Number(
                improvement.selfImprovementHealth || 0
            ) * 0.30 +

            Number(
                optimization.optimizationHealth || 0
            ) * 0.25 +

            Number(
                enterprise.enterpriseHealth || 0
            ) * 0.25 +

            Number(
                controller.aiHealth || 0
            ) * 0.20

        );

    return Number(
        health.toFixed(2)
    );

}

/*
==================================================
GOVERNANCE STATUS
==================================================
*/

function determineGovernanceStatus(
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

async function analyzeFinalGovernance() {

    try {

        const now = Date.now();

        if (

            cachedGovernance &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedGovernance;

        }

        const improvement =
            await analyzeSelfImprovement();

        const optimization =
            await analyzeGlobalOptimization();

        const enterprise =
            await analyzeEnterpriseAIManager();

        const controller =
            await analyzeMasterAIController();

        const governanceScore =
            calculateGovernanceScore({

                improvement,

                optimization,

                enterprise,

                controller

            });

        const governanceLevel =
            determineGovernanceLevel(
                governanceScore
            );

        const capabilities =
            buildGovernanceCapabilities(
                governanceLevel
            );

        const recommendation =
            generateGovernanceRecommendation({

                score: governanceScore,

                level: governanceLevel,

                improvement,

                optimization

            });

        const governanceHealth =
            calculateGovernanceHealth({

                improvement,

                optimization,

                enterprise,

                controller

            });

        const governanceStatus =
            determineGovernanceStatus(
                governanceHealth
            );

        const result = {

            generatedAt:
                new Date(),

            governanceScore,

            governanceLevel,

            capabilities,

            recommendation,

            governanceHealth,

            governanceStatus,

            improvement,

            optimization,

            enterprise,

            controller

        };

        cachedGovernance =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
FINAL GOVERNANCE ENGINE
==================================

Governance Score:
${governanceScore}

Governance Level:
${governanceLevel}

Governance Health:
${governanceHealth}

Governance Status:
${governanceStatus}

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
FINAL GOVERNANCE ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            governanceScore: 0,

            governanceLevel: "MANUAL_GOVERNANCE",

            capabilities: {

                autonomousTrading: false,

                autonomousLearning: false,

                autonomousOptimization: false,

                autonomousGovernance: false

            },

            recommendation: {

                score: 0,

                level: "MANUAL_GOVERNANCE",

                recommendation: "MANUAL_GOVERNANCE",

                tradingEnabled: false,

                emergencyStop: true

            },

            governanceHealth: 0,

            governanceStatus: "CRITICAL",

            improvement: {},

            optimization: {},

            enterprise: {},

            controller: {}

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearFinalGovernanceCache() {

    cachedGovernance = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeFinalGovernance,

    clearFinalGovernanceCache,

    calculateGovernanceScore,

    determineGovernanceLevel,

    buildGovernanceCapabilities,

    generateGovernanceRecommendation,

    calculateGovernanceHealth,

    determineGovernanceStatus

};
