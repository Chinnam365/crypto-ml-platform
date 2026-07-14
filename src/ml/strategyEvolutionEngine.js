/*
==================================================
STRATEGY EVOLUTION ENGINE
==================================================
PHASE 18
PART 1
==================================================
*/

const {
    analyzeSwarmConsensus
} = require("./swarmConsensusEngine");

const {
    analyzeMultiAgentCoordinator
} = require("./multiAgentCoordinator");

const {
    analyzeMarketDiscovery
} = require("./marketDiscoveryEngine");

const {
    analyzeMetaLearning
} = require("./metaLearningV2");

let cachedStrategy = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
STRATEGY EVOLUTION SCORE
==================================================
*/

function calculateStrategyScore({

    swarm,

    coordinator,

    discovery,

    meta

}) {

    const score =

        (

            Number(
                swarm.swarmScore || 0
            ) * 0.35 +

            Number(
                coordinator.coordinationScore || 0
            ) * 0.25 +

            Number(
                discovery.discoveryScore || 0
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
STRATEGY EVOLUTION LEVEL
==================================================
*/

function determineStrategyLevel(
    score
) {

    if (score >= 95) {

        return "FULLY_AUTONOMOUS_STRATEGY_EVOLUTION";

    }

    if (score >= 85) {

        return "GLOBAL_STRATEGY_EVOLUTION";

    }

    if (score >= 70) {

        return "ADAPTIVE_STRATEGY_EVOLUTION";

    }

    if (score >= 55) {

        return "GUIDED_STRATEGY_EVOLUTION";

    }

    return "STATIC_STRATEGY";

}

/*
==================================================
EVOLUTION CAPABILITIES
==================================================
*/

function buildStrategyCapabilities(
    level
) {

    return {

        evolveStrategies:

            level !== "STATIC_STRATEGY",

        retireStrategies:

            level !== "STATIC_STRATEGY",

        generateStrategies:

            level ===
                "ADAPTIVE_STRATEGY_EVOLUTION"

            ||

            level ===
                "GLOBAL_STRATEGY_EVOLUTION"

            ||

            level ===
                "FULLY_AUTONOMOUS_STRATEGY_EVOLUTION",

        continuousEvolution:

            level ===
                "FULLY_AUTONOMOUS_STRATEGY_EVOLUTION"

    };

}
/*
==================================================
STRATEGY RECOMMENDATION
==================================================
*/

function generateStrategyRecommendation({

    score,

    level,

    swarm,

    coordinator

}) {

    return {

        score,

        level,

        recommendation:

            score >= 95

                ? "ENABLE_FULL_STRATEGY_EVOLUTION"

            : score >= 85

                ? "ENABLE_GLOBAL_STRATEGY_EVOLUTION"

            : score >= 70

                ? "ENABLE_ADAPTIVE_STRATEGY_EVOLUTION"

            : score >= 55

                ? "ENABLE_GUIDED_STRATEGY_EVOLUTION"

            : "STATIC_STRATEGY_MODE",

        tradingEnabled:

            swarm.recommendation
                ?.tradingEnabled || false,

        emergencyStop:

            coordinator.recommendation
                ?.emergencyStop || false

    };

}

/*
==================================================
STRATEGY HEALTH
==================================================
*/

function calculateStrategyHealth({

    swarm,

    coordinator,

    discovery,

    meta

}) {

    const health =

        (

            Number(
                swarm.swarmHealth || 0
            ) * 0.30 +

            Number(
                coordinator.coordinationHealth || 0
            ) * 0.25 +

            Number(
                discovery.discoveryHealth || 0
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
STRATEGY STATUS
==================================================
*/

function determineStrategyStatus(
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

async function analyzeStrategyEvolution() {

    try {

        const now = Date.now();

        if (

            cachedStrategy &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedStrategy;

        }

        const swarm =
            await analyzeSwarmConsensus();

        const coordinator =
            await analyzeMultiAgentCoordinator();

        const discovery =
            await analyzeMarketDiscovery();

        const meta =
            await analyzeMetaLearning();

        const strategyScore =
            calculateStrategyScore({

                swarm,

                coordinator,

                discovery,

                meta

            });

        const strategyLevel =
            determineStrategyLevel(
                strategyScore
            );

        const capabilities =
            buildStrategyCapabilities(
                strategyLevel
            );

        const recommendation =
            generateStrategyRecommendation({

                score: strategyScore,

                level: strategyLevel,

                swarm,

                coordinator

            });

        const strategyHealth =
            calculateStrategyHealth({

                swarm,

                coordinator,

                discovery,

                meta

            });

        const strategyStatus =
            determineStrategyStatus(
                strategyHealth
            );

        const result = {

            generatedAt:
                new Date(),

            strategyScore,

            strategyLevel,

            capabilities,

            recommendation,

            strategyHealth,

            strategyStatus,

            swarm,

            coordinator,

            discovery,

            meta

        };

        cachedStrategy =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
STRATEGY EVOLUTION ENGINE
==================================

Strategy Score:
${strategyScore}

Strategy Level:
${strategyLevel}

Strategy Health:
${strategyHealth}

Strategy Status:
${strategyStatus}

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
STRATEGY EVOLUTION ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            strategyScore: 0,

            strategyLevel: "STATIC_STRATEGY",

            capabilities: {

                evolveStrategies: false,

                retireStrategies: false,

                generateStrategies: false,

                continuousEvolution: false

            },

            recommendation: {

                score: 0,

                level: "STATIC_STRATEGY",

                recommendation: "STATIC_STRATEGY_MODE",

                tradingEnabled: false,

                emergencyStop: true

            },

            strategyHealth: 0,

            strategyStatus: "RECOVERY",

            swarm: {},

            coordinator: {},

            discovery: {},

            meta: {}

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearStrategyEvolutionCache() {

    cachedStrategy = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeStrategyEvolution,

    clearStrategyEvolutionCache,

    calculateStrategyScore,

    determineStrategyLevel,

    buildStrategyCapabilities,

    generateStrategyRecommendation,

    calculateStrategyHealth,

    determineStrategyStatus

};
