/*
==================================================
MULTI AGENT COORDINATOR
==================================================
PHASE 16
PART 1
==================================================
*/

const {
    analyzeMarketDiscovery
} = require("./marketDiscoveryEngine");

const {
    analyzeAutonomousResearch
} = require("./autonomousResearchEngine");

const {
    analyzeUniversalReasoning
} = require("./universalReasoningEngine");

const {
    analyzeMetaLearning
} = require("./metaLearningV2");

let cachedCoordinator = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
COORDINATION SCORE
==================================================
*/

function calculateCoordinationScore({

    discovery,

    research,

    reasoning,

    meta

}) {

    const score =

        (

            Number(
                discovery.discoveryScore || 0
            ) * 0.35 +

            Number(
                research.researchScore || 0
            ) * 0.25 +

            Number(
                reasoning.reasoningScore || 0
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
COORDINATION LEVEL
==================================================
*/

function determineCoordinationLevel(
    score
) {

    if (score >= 95) {

        return "GLOBAL_MULTI_AGENT";

    }

    if (score >= 85) {

        return "ENTERPRISE_MULTI_AGENT";

    }

    if (score >= 70) {

        return "ADVANCED_MULTI_AGENT";

    }

    if (score >= 55) {

        return "COORDINATED_MULTI_AGENT";

    }

    return "SINGLE_AGENT";

}

/*
==================================================
COORDINATION CAPABILITIES
==================================================
*/

function buildCoordinationCapabilities(
    level
) {

    return {

        parallelAgents:

            level !== "SINGLE_AGENT",

        cooperativeReasoning:

            level !== "SINGLE_AGENT",

        distributedOptimization:

            level === "ADVANCED_MULTI_AGENT" ||

            level === "ENTERPRISE_MULTI_AGENT" ||

            level === "GLOBAL_MULTI_AGENT",

        autonomousCoordination:

            level === "GLOBAL_MULTI_AGENT"

    };

}
/*
==================================================
COORDINATION RECOMMENDATION
==================================================
*/

function generateCoordinationRecommendation({

    score,

    level,

    discovery,

    research

}) {

    return {

        score,

        level,

        recommendation:

            score >= 95

                ? "ENABLE_GLOBAL_MULTI_AGENT"

            : score >= 85

                ? "ENABLE_ENTERPRISE_MULTI_AGENT"

            : score >= 70

                ? "ENABLE_ADVANCED_MULTI_AGENT"

            : score >= 55

                ? "ENABLE_COORDINATED_MULTI_AGENT"

            : "SINGLE_AGENT_MODE",

        tradingEnabled:

            discovery.recommendation
                ?.tradingEnabled || false,

        emergencyStop:

            research.recommendation
                ?.emergencyStop || false

    };

}

/*
==================================================
COORDINATION HEALTH
==================================================
*/

function calculateCoordinationHealth({

    discovery,

    research,

    reasoning,

    meta

}) {

    const health =

        (

            Number(
                discovery.discoveryHealth || 0
            ) * 0.30 +

            Number(
                research.researchHealth || 0
            ) * 0.25 +

            Number(
                reasoning.reasoningHealth || 0
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
COORDINATION STATUS
==================================================
*/

function determineCoordinationStatus(
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

async function analyzeMultiAgentCoordinator() {

    try {

        const now = Date.now();

        if (

            cachedCoordinator &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedCoordinator;

        }

        const discovery =
            await analyzeMarketDiscovery();

        const research =
            await analyzeAutonomousResearch();

        const reasoning =
            await analyzeUniversalReasoning();

        const meta =
            await analyzeMetaLearning();

        const coordinationScore =
            calculateCoordinationScore({

                discovery,

                research,

                reasoning,

                meta

            });

        const coordinationLevel =
            determineCoordinationLevel(
                coordinationScore
            );

        const capabilities =
            buildCoordinationCapabilities(
                coordinationLevel
            );

        const recommendation =
            generateCoordinationRecommendation({

                score: coordinationScore,

                level: coordinationLevel,

                discovery,

                research

            });

        const coordinationHealth =
            calculateCoordinationHealth({

                discovery,

                research,

                reasoning,

                meta

            });

        const coordinationStatus =
            determineCoordinationStatus(
                coordinationHealth
            );

        const result = {

            generatedAt:
                new Date(),

            coordinationScore,

            coordinationLevel,

            capabilities,

            recommendation,

            coordinationHealth,

            coordinationStatus,

            discovery,

            research,

            reasoning,

            meta

        };

        cachedCoordinator =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
MULTI AGENT COORDINATOR
==================================

Coordination Score:
${coordinationScore}

Coordination Level:
${coordinationLevel}

Coordination Health:
${coordinationHealth}

Coordination Status:
${coordinationStatus}

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
MULTI AGENT COORDINATOR ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            coordinationScore: 0,

            coordinationLevel: "SINGLE_AGENT",

            capabilities: {

                parallelAgents: false,

                cooperativeReasoning: false,

                distributedOptimization: false,

                autonomousCoordination: false

            },

            recommendation: {

                score: 0,

                level: "SINGLE_AGENT",

                recommendation: "SINGLE_AGENT_MODE",

                tradingEnabled: false,

                emergencyStop: true

            },

            coordinationHealth: 0,

            coordinationStatus: "RECOVERY",

            discovery: {},

            research: {},

            reasoning: {},

            meta: {}

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearMultiAgentCoordinatorCache() {

    cachedCoordinator = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeMultiAgentCoordinator,

    clearMultiAgentCoordinatorCache,

    calculateCoordinationScore,

    determineCoordinationLevel,

    buildCoordinationCapabilities,

    generateCoordinationRecommendation,

    calculateCoordinationHealth,

    determineCoordinationStatus

};
