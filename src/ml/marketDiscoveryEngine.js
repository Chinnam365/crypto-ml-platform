/*
==================================================
MARKET DISCOVERY ENGINE
==================================================
PHASE 15
PART 1
==================================================
*/

const {
    analyzeAutonomousResearch
} = require("./autonomousResearchEngine");

const {
    analyzeUniversalReasoning
} = require("./universalReasoningEngine");

const {
    analyzeGlobalKnowledge
} = require("./globalKnowledgeEngine");

const {
    analyzeMetaLearning
} = require("./metaLearningV2");

let cachedDiscovery = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
DISCOVERY SCORE
==================================================
*/

function calculateDiscoveryScore({

    research,

    reasoning,

    knowledge,

    meta

}) {

    const score =

        (

            Number(
                research.researchScore || 0
            ) * 0.35 +

            Number(
                reasoning.reasoningScore || 0
            ) * 0.25 +

            Number(
                knowledge.knowledgeScore || 0
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
DISCOVERY LEVEL
==================================================
*/

function determineDiscoveryLevel(
    score
) {

    if (score >= 95) {

        return "AUTONOMOUS_MARKET_DISCOVERY";

    }

    if (score >= 85) {

        return "GLOBAL_MARKET_DISCOVERY";

    }

    if (score >= 70) {

        return "ADVANCED_DISCOVERY";

    }

    if (score >= 55) {

        return "GUIDED_DISCOVERY";

    }

    return "STANDARD_DISCOVERY";

}

/*
==================================================
DISCOVERY CAPABILITIES
==================================================
*/

function buildDiscoveryCapabilities(
    level
) {

    return {

        discoverNewMarkets:

            level !== "STANDARD_DISCOVERY",

        discoverNewStrategies:

            level !== "STANDARD_DISCOVERY",

        discoverNewAssets:

            level === "ADVANCED_DISCOVERY" ||

            level === "GLOBAL_MARKET_DISCOVERY" ||

            level === "AUTONOMOUS_MARKET_DISCOVERY",

        continuousDiscovery:

            level === "AUTONOMOUS_MARKET_DISCOVERY"

    };

}
/*
==================================================
DISCOVERY RECOMMENDATION
==================================================
*/

function generateDiscoveryRecommendation({

    score,

    level,

    research,

    reasoning

}) {

    return {

        score,

        level,

        recommendation:

            score >= 95

                ? "ENABLE_AUTONOMOUS_MARKET_DISCOVERY"

            : score >= 85

                ? "ENABLE_GLOBAL_MARKET_DISCOVERY"

            : score >= 70

                ? "ENABLE_ADVANCED_MARKET_DISCOVERY"

            : score >= 55

                ? "ENABLE_GUIDED_MARKET_DISCOVERY"

            : "STANDARD_DISCOVERY_MODE",

        tradingEnabled:

            research.recommendation
                ?.tradingEnabled || false,

        emergencyStop:

            reasoning.recommendation
                ?.emergencyStop || false

    };

}

/*
==================================================
DISCOVERY HEALTH
==================================================
*/

function calculateDiscoveryHealth({

    research,

    reasoning,

    knowledge,

    meta

}) {

    const health =

        (

            Number(
                research.researchHealth || 0
            ) * 0.30 +

            Number(
                reasoning.reasoningHealth || 0
            ) * 0.25 +

            Number(
                knowledge.knowledgeHealth || 0
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
DISCOVERY STATUS
==================================================
*/

function determineDiscoveryStatus(
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

async function analyzeMarketDiscovery() {

    try {

        const now = Date.now();

        if (

            cachedDiscovery &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedDiscovery;

        }

        const research =
            await analyzeAutonomousResearch();

        const reasoning =
            await analyzeUniversalReasoning();

        const knowledge =
            await analyzeGlobalKnowledge();

        const meta =
            await analyzeMetaLearning();

        const discoveryScore =
            calculateDiscoveryScore({

                research,

                reasoning,

                knowledge,

                meta

            });

        const discoveryLevel =
            determineDiscoveryLevel(
                discoveryScore
            );

        const capabilities =
            buildDiscoveryCapabilities(
                discoveryLevel
            );

        const recommendation =
            generateDiscoveryRecommendation({

                score: discoveryScore,

                level: discoveryLevel,

                research,

                reasoning

            });

        const discoveryHealth =
            calculateDiscoveryHealth({

                research,

                reasoning,

                knowledge,

                meta

            });

        const discoveryStatus =
            determineDiscoveryStatus(
                discoveryHealth
            );

        const result = {

            generatedAt:
                new Date(),

            discoveryScore,

            discoveryLevel,

            capabilities,

            recommendation,

            discoveryHealth,

            discoveryStatus,

            research,

            reasoning,

            knowledge,

            meta

        };

        cachedDiscovery =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
MARKET DISCOVERY ENGINE
==================================

Discovery Score:
${discoveryScore}

Discovery Level:
${discoveryLevel}

Discovery Health:
${discoveryHealth}

Discovery Status:
${discoveryStatus}

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
MARKET DISCOVERY ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            discoveryScore: 0,

            discoveryLevel: "STANDARD_DISCOVERY",

            capabilities: {

                discoverNewMarkets: false,

                discoverNewStrategies: false,

                discoverNewAssets: false,

                continuousDiscovery: false

            },

            recommendation: {

                score: 0,

                level: "STANDARD_DISCOVERY",

                recommendation: "STANDARD_DISCOVERY_MODE",

                tradingEnabled: false,

                emergencyStop: true

            },

            discoveryHealth: 0,

            discoveryStatus: "RECOVERY",

            research: {},

            reasoning: {},

            knowledge: {},

            meta: {}

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearMarketDiscoveryCache() {

    cachedDiscovery = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeMarketDiscovery,

    clearMarketDiscoveryCache,

    calculateDiscoveryScore,

    determineDiscoveryLevel,

    buildDiscoveryCapabilities,

    generateDiscoveryRecommendation,

    calculateDiscoveryHealth,

    determineDiscoveryStatus

};
