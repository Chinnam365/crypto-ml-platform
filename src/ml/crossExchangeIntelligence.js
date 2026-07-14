/*
==================================================
CROSS EXCHANGE INTELLIGENCE
==================================================
PHASE 20
PART 1
==================================================
*/

const {
    analyzeSelfHealing
} = require("./selfHealingEngine");

const {
    analyzeStrategyEvolution
} = require("./strategyEvolutionEngine");

const {
    analyzeMarketDiscovery
} = require("./marketDiscoveryEngine");

const {
    analyzeMetaLearning
} = require("./metaLearningV2");

let cachedExchange = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
CROSS EXCHANGE SCORE
==================================================
*/

function calculateExchangeScore({

    healing,

    strategy,

    discovery,

    meta

}) {

    const score =

        (

            Number(
                healing.healingScore || 0
            ) * 0.35 +

            Number(
                strategy.strategyScore || 0
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
EXCHANGE LEVEL
==================================================
*/

function determineExchangeLevel(
    score
) {

    if (score >= 95) {

        return "GLOBAL_MULTI_EXCHANGE";

    }

    if (score >= 85) {

        return "ENTERPRISE_MULTI_EXCHANGE";

    }

    if (score >= 70) {

        return "ADVANCED_MULTI_EXCHANGE";

    }

    if (score >= 55) {

        return "GUIDED_MULTI_EXCHANGE";

    }

    return "SINGLE_EXCHANGE";

}

/*
==================================================
EXCHANGE CAPABILITIES
==================================================
*/

function buildExchangeCapabilities(
    level
) {

    return {

        multiExchangeTrading:

            level !== "SINGLE_EXCHANGE",

        arbitrageDetection:

            level !== "SINGLE_EXCHANGE",

        liquidityRouting:

            level ===
                "ADVANCED_MULTI_EXCHANGE"

            ||

            level ===
                "ENTERPRISE_MULTI_EXCHANGE"

            ||

            level ===
                "GLOBAL_MULTI_EXCHANGE",

        autonomousExecution:

            level ===
                "GLOBAL_MULTI_EXCHANGE"

    };

}
/*
==================================================
EXCHANGE RECOMMENDATION
==================================================
*/

function generateExchangeRecommendation({

    score,

    level,

    healing,

    strategy

}) {

    return {

        score,

        level,

        recommendation:

            score >= 95

                ? "ENABLE_GLOBAL_MULTI_EXCHANGE"

            : score >= 85

                ? "ENABLE_ENTERPRISE_MULTI_EXCHANGE"

            : score >= 70

                ? "ENABLE_ADVANCED_MULTI_EXCHANGE"

            : score >= 55

                ? "ENABLE_GUIDED_MULTI_EXCHANGE"

            : "SINGLE_EXCHANGE_MODE",

        tradingEnabled:

            healing.recommendation
                ?.tradingEnabled || false,

        emergencyStop:

            strategy.recommendation
                ?.emergencyStop || false

    };

}

/*
==================================================
EXCHANGE HEALTH
==================================================
*/

function calculateExchangeHealth({

    healing,

    strategy,

    discovery,

    meta

}) {

    const health =

        (

            Number(
                healing.healingHealth || 0
            ) * 0.30 +

            Number(
                strategy.strategyHealth || 0
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
EXCHANGE STATUS
==================================================
*/

function determineExchangeStatus(
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

async function analyzeCrossExchangeIntelligence() {

    try {

        const now = Date.now();

        if (

            cachedExchange &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedExchange;

        }

        const healing =
            await analyzeSelfHealing();

        const strategy =
            await analyzeStrategyEvolution();

        const discovery =
            await analyzeMarketDiscovery();

        const meta =
            await analyzeMetaLearning();

        const exchangeScore =
            calculateExchangeScore({

                healing,

                strategy,

                discovery,

                meta

            });

        const exchangeLevel =
            determineExchangeLevel(
                exchangeScore
            );

        const capabilities =
            buildExchangeCapabilities(
                exchangeLevel
            );

        const recommendation =
            generateExchangeRecommendation({

                score: exchangeScore,

                level: exchangeLevel,

                healing,

                strategy

            });

        const exchangeHealth =
            calculateExchangeHealth({

                healing,

                strategy,

                discovery,

                meta

            });

        const exchangeStatus =
            determineExchangeStatus(
                exchangeHealth
            );

        const result = {

            generatedAt:
                new Date(),

            exchangeScore,

            exchangeLevel,

            capabilities,

            recommendation,

            exchangeHealth,

            exchangeStatus,

            healing,

            strategy,

            discovery,

            meta

        };

        cachedExchange =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
CROSS EXCHANGE INTELLIGENCE
==================================

Exchange Score:
${exchangeScore}

Exchange Level:
${exchangeLevel}

Exchange Health:
${exchangeHealth}

Exchange Status:
${exchangeStatus}

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
CROSS EXCHANGE INTELLIGENCE ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            exchangeScore: 0,

            exchangeLevel: "SINGLE_EXCHANGE",

            capabilities: {

                multiExchangeTrading: false,

                arbitrageDetection: false,

                liquidityRouting: false,

                autonomousExecution: false

            },

            recommendation: {

                score: 0,

                level: "SINGLE_EXCHANGE",

                recommendation: "SINGLE_EXCHANGE_MODE",

                tradingEnabled: false,

                emergencyStop: true

            },

            exchangeHealth: 0,

            exchangeStatus: "RECOVERY",

            healing: {},

            strategy: {},

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

function clearCrossExchangeCache() {

    cachedExchange = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeCrossExchangeIntelligence,

    clearCrossExchangeCache,

    calculateExchangeScore,

    determineExchangeLevel,

    buildExchangeCapabilities,

    generateExchangeRecommendation,

    calculateExchangeHealth,

    determineExchangeStatus

};
