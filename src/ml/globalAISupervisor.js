/*
==================================================
GLOBAL AI SUPERVISOR
==================================================
PHASE 8
PART 1
==================================================
*/

const {
    analyzeMasterAIController
} = require("./masterAIController");

const {
    analyzeSystemEvolution
} = require("./systemEvolutionEngine");

const {
    analyzeMasterDecision
} = require("./masterDecisionEngineV2");

const {
    analyzeMetaLearning
} = require("./metaLearningV2");

let cachedSupervisor = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
SUPERVISOR SCORE
==================================================
*/

function calculateSupervisorScore({

    controller,

    evolution,

    decision,

    meta

}) {

    const score =

        (

            Number(
                controller.aiControlScore || 0
            ) * 0.35 +

            Number(
                evolution.evolutionScore || 0
            ) * 0.25 +

            Number(
                decision.masterScore || 0
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
SUPERVISOR MODE
==================================================
*/

function determineSupervisorMode(
    score
) {

    if (score >= 95) {

        return "GLOBAL_AUTONOMOUS";

    }

    if (score >= 85) {

        return "ENTERPRISE_AUTONOMOUS";

    }

    if (score >= 70) {

        return "ADVANCED_SUPERVISION";

    }

    if (score >= 55) {

        return "STANDARD_SUPERVISION";

    }

    return "MANUAL_SUPERVISION";

}

/*
==================================================
SUPERVISOR CAPABILITIES
==================================================
*/

function buildSupervisorCapabilities(
    mode
) {

    return {

        globalMonitoring:

            mode !== "MANUAL_SUPERVISION",

        autonomousGovernance:

            mode === "GLOBAL_AUTONOMOUS" ||

            mode === "ENTERPRISE_AUTONOMOUS",

        predictiveMonitoring:

            mode !== "MANUAL_SUPERVISION",

        autonomousRecovery:

            mode === "GLOBAL_AUTONOMOUS"

    };

}
/*
==================================================
SUPERVISOR RECOMMENDATION
==================================================
*/

function generateSupervisorRecommendation({

    score,

    mode,

    controller,

    decision

}) {

    return {

        score,

        mode,

        recommendation:

            score >= 95

                ? "FULL_GLOBAL_AUTONOMY"

            : score >= 85

                ? "ENTERPRISE_AUTONOMY"

            : score >= 70

                ? "ADVANCED_SUPERVISION"

            : score >= 55

                ? "STANDARD_SUPERVISION"

            : "MANUAL_SUPERVISION",

        tradingEnabled:

            controller.recommendation
                ?.tradingEnabled || false,

        emergencyStop:

            decision.recommendation
                ?.emergencyStop || false

    };

}

/*
==================================================
GLOBAL HEALTH
==================================================
*/

function calculateGlobalHealth({

    controller,

    evolution,

    decision,

    meta

}) {

    const health =

        (

            Number(
                controller.aiHealth || 0
            ) * 0.30 +

            Number(
                evolution.maturity || 0
            ) * 0.25 +

            Number(
                decision.confidence || 0
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
GLOBAL STATUS
==================================================
*/

function determineGlobalStatus(
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

async function analyzeGlobalAISupervisor() {

    try {

        const now = Date.now();

        if (

            cachedSupervisor &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedSupervisor;

        }

        const controller =
            await analyzeMasterAIController();

        const evolution =
            await analyzeSystemEvolution();

        const decision =
            await analyzeMasterDecision();

        const meta =
            await analyzeMetaLearning();

        const supervisorScore =
            calculateSupervisorScore({

                controller,

                evolution,

                decision,

                meta

            });

        const supervisorMode =
            determineSupervisorMode(
                supervisorScore
            );

        const capabilities =
            buildSupervisorCapabilities(
                supervisorMode
            );

        const recommendation =
            generateSupervisorRecommendation({

                score: supervisorScore,

                mode: supervisorMode,

                controller,

                decision

            });

        const globalHealth =
            calculateGlobalHealth({

                controller,

                evolution,

                decision,

                meta

            });

        const globalStatus =
            determineGlobalStatus(
                globalHealth
            );

        const result = {

            generatedAt:
                new Date(),

            supervisorScore,

            supervisorMode,

            capabilities,

            recommendation,

            globalHealth,

            globalStatus,

            controller,

            evolution,

            decision,

            meta

        };

        cachedSupervisor =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
GLOBAL AI SUPERVISOR
==================================

Supervisor Score:
${supervisorScore}

Supervisor Mode:
${supervisorMode}

Global Health:
${globalHealth}

Global Status:
${globalStatus}

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
GLOBAL AI SUPERVISOR ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            supervisorScore: 0,

            supervisorMode: "MANUAL_SUPERVISION",

            capabilities: {

                globalMonitoring: false,

                autonomousGovernance: false,

                predictiveMonitoring: false,

                autonomousRecovery: false

            },

            recommendation: {

                score: 0,

                mode: "MANUAL_SUPERVISION",

                recommendation: "MANUAL_SUPERVISION",

                tradingEnabled: false,

                emergencyStop: true

            },

            globalHealth: 0,

            globalStatus: "CRITICAL",

            controller: {},

            evolution: {},

            decision: {},

            meta: {}

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearGlobalAISupervisorCache() {

    cachedSupervisor = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeGlobalAISupervisor,

    clearGlobalAISupervisorCache,

    calculateSupervisorScore,

    determineSupervisorMode,

    buildSupervisorCapabilities,

    generateSupervisorRecommendation,

    calculateGlobalHealth,

    determineGlobalStatus

};
