/*
==================================================
COLLECTIVE INTELLIGENCE ENGINE
==================================================
PHASE 12
PART 1
==================================================
*/

const {
    analyzeAIKernel
} = require("./aiKernel");

const {
    analyzeUltimateAI
} = require("./ultimateAIEngine");

const {
    analyzeFinalGovernance
} = require("./finalGovernanceEngine");

const {
    analyzeMetaLearning
} = require("./metaLearningV2");

let cachedCollective = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
COLLECTIVE SCORE
==================================================
*/

function calculateCollectiveScore({

    kernel,

    ultimate,

    governance,

    meta

}) {

    const score =

        (

            Number(
                kernel.kernelScore || 0
            ) * 0.35 +

            Number(
                ultimate.ultimateScore || 0
            ) * 0.25 +

            Number(
                governance.governanceScore || 0
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
COLLECTIVE MODE
==================================================
*/

function determineCollectiveMode(
    score
) {

    if (score >= 95) {

        return "GLOBAL_COLLECTIVE_INTELLIGENCE";

    }

    if (score >= 85) {

        return "COLLECTIVE_SUPER_AI";

    }

    if (score >= 70) {

        return "COLLABORATIVE_AI";

    }

    if (score >= 55) {

        return "COORDINATED_AI";

    }

    return "INDIVIDUAL_AI";

}

/*
==================================================
COLLECTIVE CAPABILITIES
==================================================
*/

function buildCollectiveCapabilities(
    mode
) {

    return {

        collaborativeLearning:

            mode !== "INDIVIDUAL_AI",

        distributedDecisionMaking:

            mode !== "INDIVIDUAL_AI",

        collectiveOptimization:

            mode === "COLLECTIVE_SUPER_AI" ||

            mode === "GLOBAL_COLLECTIVE_INTELLIGENCE",

        swarmIntelligence:

            mode === "GLOBAL_COLLECTIVE_INTELLIGENCE"

    };

}
/*
==================================================
COLLECTIVE RECOMMENDATION
==================================================
*/

function generateCollectiveRecommendation({

    score,

    mode,

    kernel,

    ultimate

}) {

    return {

        score,

        mode,

        recommendation:

            score >= 95

                ? "ENABLE_GLOBAL_COLLECTIVE_INTELLIGENCE"

            : score >= 85

                ? "ENABLE_COLLECTIVE_SUPER_AI"

            : score >= 70

                ? "ENABLE_COLLABORATIVE_AI"

            : score >= 55

                ? "ENABLE_COORDINATED_AI"

            : "INDIVIDUAL_AI_MODE",

        tradingEnabled:

            kernel.recommendation
                ?.tradingEnabled || false,

        emergencyStop:

            ultimate.recommendation
                ?.emergencyStop || false

    };

}

/*
==================================================
COLLECTIVE HEALTH
==================================================
*/

function calculateCollectiveHealth({

    kernel,

    ultimate,

    governance,

    meta

}) {

    const health =

        (

            Number(
                kernel.kernelHealth || 0
            ) * 0.30 +

            Number(
                ultimate.ultimateHealth || 0
            ) * 0.25 +

            Number(
                governance.governanceHealth || 0
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
COLLECTIVE STATUS
==================================================
*/

function determineCollectiveStatus(
    health
) {

    if (health >= 95) {

        return "TRANSCENDENT";

    }

    if (health >= 85) {

        return "WORLD_CLASS";

    }

    if (health >= 70) {

        return "ELITE";

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

async function analyzeCollectiveIntelligence() {

    try {

        const now = Date.now();

        if (

            cachedCollective &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedCollective;

        }

        const kernel =
            await analyzeAIKernel();

        const ultimate =
            await analyzeUltimateAI();

        const governance =
            await analyzeFinalGovernance();

        const meta =
            await analyzeMetaLearning();

        const collectiveScore =
            calculateCollectiveScore({

                kernel,

                ultimate,

                governance,

                meta

            });

        const collectiveMode =
            determineCollectiveMode(
                collectiveScore
            );

        const capabilities =
            buildCollectiveCapabilities(
                collectiveMode
            );

        const recommendation =
            generateCollectiveRecommendation({

                score: collectiveScore,

                mode: collectiveMode,

                kernel,

                ultimate

            });

        const collectiveHealth =
            calculateCollectiveHealth({

                kernel,

                ultimate,

                governance,

                meta

            });

        const collectiveStatus =
            determineCollectiveStatus(
                collectiveHealth
            );

        const result = {

            generatedAt:
                new Date(),

            collectiveScore,

            collectiveMode,

            capabilities,

            recommendation,

            collectiveHealth,

            collectiveStatus,

            kernel,

            ultimate,

            governance,

            meta

        };

        cachedCollective =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
COLLECTIVE INTELLIGENCE ENGINE
==================================

Collective Score:
${collectiveScore}

Collective Mode:
${collectiveMode}

Collective Health:
${collectiveHealth}

Collective Status:
${collectiveStatus}

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
COLLECTIVE INTELLIGENCE ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            collectiveScore: 0,

            collectiveMode: "INDIVIDUAL_AI",

            capabilities: {

                collaborativeLearning: false,

                distributedDecisionMaking: false,

                collectiveOptimization: false,

                swarmIntelligence: false

            },

            recommendation: {

                score: 0,

                mode: "INDIVIDUAL_AI",

                recommendation: "INDIVIDUAL_AI_MODE",

                tradingEnabled: false,

                emergencyStop: true

            },

            collectiveHealth: 0,

            collectiveStatus: "RECOVERY",

            kernel: {},

            ultimate: {},

            governance: {},

            meta: {}

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearCollectiveIntelligenceCache() {

    cachedCollective = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeCollectiveIntelligence,

    clearCollectiveIntelligenceCache,

    calculateCollectiveScore,

    determineCollectiveMode,

    buildCollectiveCapabilities,

    generateCollectiveRecommendation,

    calculateCollectiveHealth,

    determineCollectiveStatus

};
