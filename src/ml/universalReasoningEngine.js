/*
==================================================
UNIVERSAL REASONING ENGINE
==================================================
PHASE 13
PART 1
==================================================
*/

const {
    analyzeGlobalKnowledge
} = require("./globalKnowledgeEngine");

const {
    analyzeCollectiveIntelligence
} = require("./collectiveIntelligenceEngine");

const {
    analyzeAIKernel
} = require("./aiKernel");

const {
    analyzeMetaLearning
} = require("./metaLearningV2");

let cachedReasoning = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
REASONING SCORE
==================================================
*/

function calculateReasoningScore({

    knowledge,

    collective,

    kernel,

    meta

}) {

    const score =

        (

            Number(
                knowledge.knowledgeScore || 0
            ) * 0.35 +

            Number(
                collective.collectiveScore || 0
            ) * 0.25 +

            Number(
                kernel.kernelScore || 0
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
REASONING LEVEL
==================================================
*/

function determineReasoningLevel(
    score
) {

    if (score >= 95) {

        return "UNIVERSAL_REASONING";

    }

    if (score >= 85) {

        return "GLOBAL_REASONING";

    }

    if (score >= 70) {

        return "ADVANCED_REASONING";

    }

    if (score >= 55) {

        return "LEARNING_REASONING";

    }

    return "LOCAL_REASONING";

}

/*
==================================================
REASONING CAPABILITIES
==================================================
*/

function buildReasoningCapabilities(
    level
) {

    return {

        multiModelReasoning:

            level !== "LOCAL_REASONING",

        causalInference:

            level !== "LOCAL_REASONING",

        predictiveReasoning:

            level === "ADVANCED_REASONING" ||

            level === "GLOBAL_REASONING" ||

            level === "UNIVERSAL_REASONING",

        selfReasoning:

            level === "UNIVERSAL_REASONING"

    };

}
/*
==================================================
REASONING RECOMMENDATION
==================================================
*/

function generateReasoningRecommendation({

    score,

    level,

    knowledge,

    collective

}) {

    return {

        score,

        level,

        recommendation:

            score >= 95

                ? "ENABLE_UNIVERSAL_REASONING"

            : score >= 85

                ? "ENABLE_GLOBAL_REASONING"

            : score >= 70

                ? "ENABLE_ADVANCED_REASONING"

            : score >= 55

                ? "ENABLE_LEARNING_REASONING"

            : "LOCAL_REASONING_MODE",

        tradingEnabled:

            knowledge.recommendation
                ?.tradingEnabled || false,

        emergencyStop:

            collective.recommendation
                ?.emergencyStop || false

    };

}

/*
==================================================
REASONING HEALTH
==================================================
*/

function calculateReasoningHealth({

    knowledge,

    collective,

    kernel,

    meta

}) {

    const health =

        (

            Number(
                knowledge.knowledgeHealth || 0
            ) * 0.30 +

            Number(
                collective.collectiveHealth || 0
            ) * 0.25 +

            Number(
                kernel.kernelHealth || 0
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
REASONING STATUS
==================================================
*/

function determineReasoningStatus(
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

async function analyzeUniversalReasoning() {

    try {

        const now = Date.now();

        if (

            cachedReasoning &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedReasoning;

        }

        const knowledge =
            await analyzeGlobalKnowledge();

        const collective =
            await analyzeCollectiveIntelligence();

        const kernel =
            await analyzeAIKernel();

        const meta =
            await analyzeMetaLearning();

        const reasoningScore =
            calculateReasoningScore({

                knowledge,

                collective,

                kernel,

                meta

            });

        const reasoningLevel =
            determineReasoningLevel(
                reasoningScore
            );

        const capabilities =
            buildReasoningCapabilities(
                reasoningLevel
            );

        const recommendation =
            generateReasoningRecommendation({

                score: reasoningScore,

                level: reasoningLevel,

                knowledge,

                collective

            });

        const reasoningHealth =
            calculateReasoningHealth({

                knowledge,

                collective,

                kernel,

                meta

            });

        const reasoningStatus =
            determineReasoningStatus(
                reasoningHealth
            );

        const result = {

            generatedAt:
                new Date(),

            reasoningScore,

            reasoningLevel,

            capabilities,

            recommendation,

            reasoningHealth,

            reasoningStatus,

            knowledge,

            collective,

            kernel,

            meta

        };

        cachedReasoning =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
UNIVERSAL REASONING ENGINE
==================================

Reasoning Score:
${reasoningScore}

Reasoning Level:
${reasoningLevel}

Reasoning Health:
${reasoningHealth}

Reasoning Status:
${reasoningStatus}

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
UNIVERSAL REASONING ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            reasoningScore: 0,

            reasoningLevel: "LOCAL_REASONING",

            capabilities: {

                multiModelReasoning: false,

                causalInference: false,

                predictiveReasoning: false,

                selfReasoning: false

            },

            recommendation: {

                score: 0,

                level: "LOCAL_REASONING",

                recommendation: "LOCAL_REASONING_MODE",

                tradingEnabled: false,

                emergencyStop: true

            },

            reasoningHealth: 0,

            reasoningStatus: "RECOVERY",

            knowledge: {},

            collective: {},

            kernel: {},

            meta: {}

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearUniversalReasoningCache() {

    cachedReasoning = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeUniversalReasoning,

    clearUniversalReasoningCache,

    calculateReasoningScore,

    determineReasoningLevel,

    buildReasoningCapabilities,

    generateReasoningRecommendation,

    calculateReasoningHealth,

    determineReasoningStatus

};
