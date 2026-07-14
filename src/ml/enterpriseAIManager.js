/*
==================================================
ENTERPRISE AI MANAGER
==================================================
PHASE 8
PART 1
==================================================
*/

const {
    analyzeGlobalAISupervisor
} = require("./globalAISupervisor");

const {
    analyzeMasterAIController
} = require("./masterAIController");

const {
    analyzeSystemEvolution
} = require("./systemEvolutionEngine");

const {
    analyzeMetaLearning
} = require("./metaLearningV2");

let cachedEnterprise = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
ENTERPRISE SCORE
==================================================
*/

function calculateEnterpriseScore({

    supervisor,

    controller,

    evolution,

    meta

}) {

    const score =

        (

            Number(
                supervisor.supervisorScore || 0
            ) * 0.35 +

            Number(
                controller.aiControlScore || 0
            ) * 0.25 +

            Number(
                evolution.evolutionScore || 0
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
ENTERPRISE MODE
==================================================
*/

function determineEnterpriseMode(
    score
) {

    if (score >= 95) {

        return "GLOBAL_ENTERPRISE_AI";

    }

    if (score >= 85) {

        return "ENTERPRISE_AI";

    }

    if (score >= 70) {

        return "ADVANCED_AI";

    }

    if (score >= 55) {

        return "STANDARD_AI";

    }

    return "MANUAL";

}

/*
==================================================
ENTERPRISE CAPABILITIES
==================================================
*/

function buildEnterpriseCapabilities(
    mode
) {

    return {

        enterpriseAutomation:

            mode !== "MANUAL",

        autonomousGovernance:

            mode === "GLOBAL_ENTERPRISE_AI" ||

            mode === "ENTERPRISE_AI",

        predictiveOptimization:

            mode !== "MANUAL",

        globalScaling:

            mode === "GLOBAL_ENTERPRISE_AI"

    };

}
/*
==================================================
ENTERPRISE RECOMMENDATION
==================================================
*/

function generateEnterpriseRecommendation({

    score,

    mode,

    supervisor,

    controller

}) {

    return {

        score,

        mode,

        recommendation:

            score >= 95

                ? "FULL_ENTERPRISE_AUTONOMY"

            : score >= 85

                ? "ENTERPRISE_AUTONOMY"

            : score >= 70

                ? "ADVANCED_AI_CONTROL"

            : score >= 55

                ? "STANDARD_AI_CONTROL"

            : "MANUAL_CONTROL",

        tradingEnabled:

            controller.recommendation
                ?.tradingEnabled || false,

        emergencyStop:

            supervisor.recommendation
                ?.emergencyStop || false

    };

}

/*
==================================================
ENTERPRISE HEALTH
==================================================
*/

function calculateEnterpriseHealth({

    supervisor,

    controller,

    evolution,

    meta

}) {

    const health =

        (

            Number(
                supervisor.globalHealth || 0
            ) * 0.30 +

            Number(
                controller.aiHealth || 0
            ) * 0.25 +

            Number(
                evolution.maturity || 0
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
ENTERPRISE STATUS
==================================================
*/

function determineEnterpriseStatus(
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

async function analyzeEnterpriseAIManager() {

    try {

        const now = Date.now();

        if (

            cachedEnterprise &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedEnterprise;

        }

        const supervisor =
            await analyzeGlobalAISupervisor();

        const controller =
            await analyzeMasterAIController();

        const evolution =
            await analyzeSystemEvolution();

        const meta =
            await analyzeMetaLearning();

        const enterpriseScore =
            calculateEnterpriseScore({

                supervisor,

                controller,

                evolution,

                meta

            });

        const enterpriseMode =
            determineEnterpriseMode(
                enterpriseScore
            );

        const capabilities =
            buildEnterpriseCapabilities(
                enterpriseMode
            );

        const recommendation =
            generateEnterpriseRecommendation({

                score: enterpriseScore,

                mode: enterpriseMode,

                supervisor,

                controller

            });

        const enterpriseHealth =
            calculateEnterpriseHealth({

                supervisor,

                controller,

                evolution,

                meta

            });

        const enterpriseStatus =
            determineEnterpriseStatus(
                enterpriseHealth
            );

        const result = {

            generatedAt:
                new Date(),

            enterpriseScore,

            enterpriseMode,

            capabilities,

            recommendation,

            enterpriseHealth,

            enterpriseStatus,

            supervisor,

            controller,

            evolution,

            meta

        };

        cachedEnterprise =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
ENTERPRISE AI MANAGER
==================================

Enterprise Score:
${enterpriseScore}

Enterprise Mode:
${enterpriseMode}

Enterprise Health:
${enterpriseHealth}

Enterprise Status:
${enterpriseStatus}

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
ENTERPRISE AI MANAGER ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            enterpriseScore: 0,

            enterpriseMode: "MANUAL",

            capabilities: {

                enterpriseAutomation: false,

                autonomousGovernance: false,

                predictiveOptimization: false,

                globalScaling: false

            },

            recommendation: {

                score: 0,

                mode: "MANUAL",

                recommendation: "MANUAL_CONTROL",

                tradingEnabled: false,

                emergencyStop: true

            },

            enterpriseHealth: 0,

            enterpriseStatus: "CRITICAL",

            supervisor: {},

            controller: {},

            evolution: {},

            meta: {}

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearEnterpriseAIManagerCache() {

    cachedEnterprise = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeEnterpriseAIManager,

    clearEnterpriseAIManagerCache,

    calculateEnterpriseScore,

    determineEnterpriseMode,

    buildEnterpriseCapabilities,

    generateEnterpriseRecommendation,

    calculateEnterpriseHealth,

    determineEnterpriseStatus

};
