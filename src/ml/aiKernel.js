/*
==================================================
AI KERNEL
==================================================
PHASE 11
PART 1
==================================================
*/

const {
    analyzeUltimateAI
} = require("./ultimateAIEngine");

const {
    analyzeFinalGovernance
} = require("./finalGovernanceEngine");

const {
    analyzeMasterAIController
} = require("./masterAIController");

const {
    analyzeMetaLearning
} = require("./metaLearningV2");

let cachedKernel = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
KERNEL SCORE
==================================================
*/

function calculateKernelScore({

    ultimate,

    governance,

    controller,

    meta

}) {

    const score =

        (

            Number(
                ultimate.ultimateScore || 0
            ) * 0.35 +

            Number(
                governance.governanceScore || 0
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
KERNEL MODE
==================================================
*/

function determineKernelMode(
    score
) {

    if (score >= 95) {

        return "SELF_AWARE_KERNEL";

    }

    if (score >= 85) {

        return "GLOBAL_KERNEL";

    }

    if (score >= 70) {

        return "ENTERPRISE_KERNEL";

    }

    if (score >= 55) {

        return "ADVANCED_KERNEL";

    }

    return "STANDARD_KERNEL";

}

/*
==================================================
KERNEL CAPABILITIES
==================================================
*/

function buildKernelCapabilities(
    mode
) {

    return {

        autonomousTrading:

            mode !== "STANDARD_KERNEL",

        autonomousLearning:

            mode !== "STANDARD_KERNEL",

        autonomousGovernance:

            mode === "GLOBAL_KERNEL" ||

            mode === "SELF_AWARE_KERNEL",

        autonomousEvolution:

            mode === "SELF_AWARE_KERNEL"

    };

}
/*
==================================================
KERNEL RECOMMENDATION
==================================================
*/

function generateKernelRecommendation({

    score,

    mode,

    ultimate,

    governance

}) {

    return {

        score,

        mode,

        recommendation:

            score >= 95

                ? "ENABLE_SELF_AWARE_KERNEL"

            : score >= 85

                ? "ENABLE_GLOBAL_KERNEL"

            : score >= 70

                ? "ENABLE_ENTERPRISE_KERNEL"

            : score >= 55

                ? "ENABLE_ADVANCED_KERNEL"

            : "ENABLE_STANDARD_KERNEL",

        tradingEnabled:

            ultimate.recommendation
                ?.tradingEnabled || false,

        emergencyStop:

            governance.recommendation
                ?.emergencyStop || false

    };

}

/*
==================================================
KERNEL HEALTH
==================================================
*/

function calculateKernelHealth({

    ultimate,

    governance,

    controller,

    meta

}) {

    const health =

        (

            Number(
                ultimate.ultimateHealth || 0
            ) * 0.30 +

            Number(
                governance.governanceHealth || 0
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
KERNEL STATUS
==================================================
*/

function determineKernelStatus(
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

async function analyzeAIKernel() {

    try {

        const now = Date.now();

        if (

            cachedKernel &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedKernel;

        }

        const ultimate =
            await analyzeUltimateAI();

        const governance =
            await analyzeFinalGovernance();

        const controller =
            await analyzeMasterAIController();

        const meta =
            await analyzeMetaLearning();

        const kernelScore =
            calculateKernelScore({

                ultimate,

                governance,

                controller,

                meta

            });

        const kernelMode =
            determineKernelMode(
                kernelScore
            );

        const capabilities =
            buildKernelCapabilities(
                kernelMode
            );

        const recommendation =
            generateKernelRecommendation({

                score: kernelScore,

                mode: kernelMode,

                ultimate,

                governance

            });

        const kernelHealth =
            calculateKernelHealth({

                ultimate,

                governance,

                controller,

                meta

            });

        const kernelStatus =
            determineKernelStatus(
                kernelHealth
            );

        const result = {

            generatedAt:
                new Date(),

            kernelScore,

            kernelMode,

            capabilities,

            recommendation,

            kernelHealth,

            kernelStatus,

            ultimate,

            governance,

            controller,

            meta

        };

        cachedKernel =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
AI KERNEL
==================================

Kernel Score:
${kernelScore}

Kernel Mode:
${kernelMode}

Kernel Health:
${kernelHealth}

Kernel Status:
${kernelStatus}

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
AI KERNEL ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            kernelScore: 0,

            kernelMode: "STANDARD_KERNEL",

            capabilities: {

                autonomousTrading: false,

                autonomousLearning: false,

                autonomousGovernance: false,

                autonomousEvolution: false

            },

            recommendation: {

                score: 0,

                mode: "STANDARD_KERNEL",

                recommendation: "ENABLE_STANDARD_KERNEL",

                tradingEnabled: false,

                emergencyStop: true

            },

            kernelHealth: 0,

            kernelStatus: "RECOVERY",

            ultimate: {},

            governance: {},

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

function clearAIKernelCache() {

    cachedKernel = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeAIKernel,

    clearAIKernelCache,

    calculateKernelScore,

    determineKernelMode,

    buildKernelCapabilities,

    generateKernelRecommendation,

    calculateKernelHealth,

    determineKernelStatus

};
