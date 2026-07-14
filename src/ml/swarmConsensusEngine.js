/*
==================================================
SWARM CONSENSUS ENGINE
==================================================
PHASE 17
PART 1
==================================================
*/

const {
    analyzeMultiAgentCoordinator
} = require("./multiAgentCoordinator");

const {
    analyzeMarketDiscovery
} = require("./marketDiscoveryEngine");

const {
    analyzeUniversalReasoning
} = require("./universalReasoningEngine");

const {
    analyzeMetaLearning
} = require("./metaLearningV2");

let cachedSwarm = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
SWARM SCORE
==================================================
*/

function calculateSwarmScore({

    coordinator,

    discovery,

    reasoning,

    meta

}) {

    const score =

        (

            Number(
                coordinator.coordinationScore || 0
            ) * 0.35 +

            Number(
                discovery.discoveryScore || 0
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
SWARM LEVEL
==================================================
*/

function determineSwarmLevel(
    score
) {

    if (score >= 95) {

        return "GLOBAL_SWARM_INTELLIGENCE";

    }

    if (score >= 85) {

        return "ENTERPRISE_SWARM";

    }

    if (score >= 70) {

        return "ADVANCED_SWARM";

    }

    if (score >= 55) {

        return "COORDINATED_SWARM";

    }

    return "INDIVIDUAL";

}

/*
==================================================
SWARM CAPABILITIES
==================================================
*/

function buildSwarmCapabilities(
    level
) {

    return {

        collectiveVoting:

            level !== "INDIVIDUAL",

        distributedConsensus:

            level !== "INDIVIDUAL",

        adaptiveCoordination:

            level === "ADVANCED_SWARM" ||

            level === "ENTERPRISE_SWARM" ||

            level === "GLOBAL_SWARM_INTELLIGENCE",

        autonomousConsensus:

            level === "GLOBAL_SWARM_INTELLIGENCE"

    };

}
/*
==================================================
SWARM RECOMMENDATION
==================================================
*/

function generateSwarmRecommendation({

    score,

    level,

    coordinator,

    discovery

}) {

    return {

        score,

        level,

        recommendation:

            score >= 95

                ? "ENABLE_GLOBAL_SWARM_INTELLIGENCE"

            : score >= 85

                ? "ENABLE_ENTERPRISE_SWARM"

            : score >= 70

                ? "ENABLE_ADVANCED_SWARM"

            : score >= 55

                ? "ENABLE_COORDINATED_SWARM"

            : "INDIVIDUAL_MODE",

        tradingEnabled:

            coordinator.recommendation
                ?.tradingEnabled || false,

        emergencyStop:

            discovery.recommendation
                ?.emergencyStop || false

    };

}

/*
==================================================
SWARM HEALTH
==================================================
*/

function calculateSwarmHealth({

    coordinator,

    discovery,

    reasoning,

    meta

}) {

    const health =

        (

            Number(
                coordinator.coordinationHealth || 0
            ) * 0.30 +

            Number(
                discovery.discoveryHealth || 0
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
SWARM STATUS
==================================================
*/

function determineSwarmStatus(
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

async function analyzeSwarmConsensus() {

    try {

        const now = Date.now();

        if (

            cachedSwarm &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedSwarm;

        }

        const coordinator =
            await analyzeMultiAgentCoordinator();

        const discovery =
            await analyzeMarketDiscovery();

        const reasoning =
            await analyzeUniversalReasoning();

        const meta =
            await analyzeMetaLearning();

        const swarmScore =
            calculateSwarmScore({

                coordinator,

                discovery,

                reasoning,

                meta

            });

        const swarmLevel =
            determineSwarmLevel(
                swarmScore
            );

        const capabilities =
            buildSwarmCapabilities(
                swarmLevel
            );

        const recommendation =
            generateSwarmRecommendation({

                score: swarmScore,

                level: swarmLevel,

                coordinator,

                discovery

            });

        const swarmHealth =
            calculateSwarmHealth({

                coordinator,

                discovery,

                reasoning,

                meta

            });

        const swarmStatus =
            determineSwarmStatus(
                swarmHealth
            );

        const result = {

            generatedAt:
                new Date(),

            swarmScore,

            swarmLevel,

            capabilities,

            recommendation,

            swarmHealth,

            swarmStatus,

            coordinator,

            discovery,

            reasoning,

            meta

        };

        cachedSwarm =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
SWARM CONSENSUS ENGINE
==================================

Swarm Score:
${swarmScore}

Swarm Level:
${swarmLevel}

Swarm Health:
${swarmHealth}

Swarm Status:
${swarmStatus}

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
SWARM CONSENSUS ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            swarmScore: 0,

            swarmLevel: "INDIVIDUAL",

            capabilities: {

                collectiveVoting: false,

                distributedConsensus: false,

                adaptiveCoordination: false,

                autonomousConsensus: false

            },

            recommendation: {

                score: 0,

                level: "INDIVIDUAL",

                recommendation: "INDIVIDUAL_MODE",

                tradingEnabled: false,

                emergencyStop: true

            },

            swarmHealth: 0,

            swarmStatus: "RECOVERY",

            coordinator: {},

            discovery: {},

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

function clearSwarmConsensusCache() {

    cachedSwarm = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeSwarmConsensus,

    clearSwarmConsensusCache,

    calculateSwarmScore,

    determineSwarmLevel,

    buildSwarmCapabilities,

    generateSwarmRecommendation,

    calculateSwarmHealth,

    determineSwarmStatus

};
