/*
==================================================
MASTER AI CONTROLLER
==================================================
PHASE 7
PART 1
==================================================
*/

const {
    analyzeMasterDecision
} = require("./masterDecisionEngineV2");

const {
    analyzeSystemEvolution
} = require("./systemEvolutionEngine");

const {
    analyzeAutonomousTradingGovernor
} = require("./autonomousTradingGovernor");

const {
    analyzeMetaLearning
} = require("./metaLearningV2");

let cachedController = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
AI CONTROL SCORE
==================================================
*/

function calculateAIControlScore({

    master,

    evolution,

    governor,

    meta

}) {

    const score =

        (

            Number(
                master.masterScore || 0
            ) * 0.35 +

            Number(
                evolution.evolutionScore || 0
            ) * 0.25 +

            Number(
                governor.governorScore || 0
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
AI CONTROL MODE
==================================================
*/

function determineAIControlMode(
    score
) {

    if (score >= 95) {

        return "FULL_AUTONOMY";

    }

    if (score >= 85) {

        return "HIGH_AUTONOMY";

    }

    if (score >= 70) {

        return "SUPERVISED_AI";

    }

    if (score >= 55) {

        return "ASSISTED_AI";

    }

    return "MANUAL";

}

/*
==================================================
AI CONTROL CAPABILITIES
==================================================
*/

function buildAIControlCapabilities(
    mode
) {

    return {

        autonomousTrading:

            mode !== "MANUAL",

        autonomousLearning:

            mode !== "MANUAL",

        autonomousPortfolioManagement:

            mode === "FULL_AUTONOMY" ||

            mode === "HIGH_AUTONOMY",

        autonomousStrategyEvolution:

            mode === "FULL_AUTONOMY"

    };

}
/*
==================================================
AI CONTROLLER RECOMMENDATION
==================================================
*/

function generateAIRecommendation({

    score,

    mode,

    master,

    governor

}) {

    return {

        score,

        mode,

        recommendation:

            score >= 95

                ? "FULL_AUTONOMOUS_CONTROL"

            : score >= 85

                ? "HIGH_AUTONOMOUS_CONTROL"

            : score >= 70

                ? "SUPERVISED_AUTONOMOUS_CONTROL"

            : score >= 55

                ? "AI_ASSISTED_CONTROL"

            : "MANUAL_CONTROL",

        tradingEnabled:

            master.recommendation
                ?.allowTrading || false,

        emergencyStop:

            governor.recommendation
                ?.emergencyStop || false

    };

}

/*
==================================================
AI HEALTH
==================================================
*/

function calculateAIHealth({

    master,

    evolution,

    governor,

    meta

}) {

    const health =

        (

            Number(
                master.confidence || 0
            ) * 0.30 +

            Number(
                evolution.maturity || 0
            ) * 0.25 +

            Number(
                governor.systemHealth || 0
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
AI HEALTH STATUS
==================================================
*/

function determineAIHealthStatus(
    health
) {

    if (health >= 95) {

        return "EXCEPTIONAL";

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

async function analyzeMasterAIController() {

    try {

        const now = Date.now();

        if (

            cachedController &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedController;

        }

        const master =
            await analyzeMasterDecision();

        const evolution =
            await analyzeSystemEvolution();

        const governor =
            await analyzeAutonomousTradingGovernor();

        const meta =
            await analyzeMetaLearning();

        const aiControlScore =
            calculateAIControlScore({

                master,

                evolution,

                governor,

                meta

            });

        const aiControlMode =
            determineAIControlMode(
                aiControlScore
            );

        const capabilities =
            buildAIControlCapabilities(
                aiControlMode
            );

        const recommendation =
            generateAIRecommendation({

                score: aiControlScore,

                mode: aiControlMode,

                master,

                governor

            });

        const aiHealth =
            calculateAIHealth({

                master,

                evolution,

                governor,

                meta

            });

        const aiHealthStatus =
            determineAIHealthStatus(
                aiHealth
            );

        const result = {

            generatedAt:
                new Date(),

            aiControlScore,

            aiControlMode,

            capabilities,

            recommendation,

            aiHealth,

            aiHealthStatus,

            master,

            evolution,

            governor,

            meta

        };

        cachedController =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
MASTER AI CONTROLLER
==================================

AI Control Score:
${aiControlScore}

AI Control Mode:
${aiControlMode}

AI Health:
${aiHealth}

AI Health Status:
${aiHealthStatus}

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
MASTER AI CONTROLLER ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            aiControlScore: 0,

            aiControlMode: "MANUAL",

            capabilities: {

                autonomousTrading: false,

                autonomousLearning: false,

                autonomousPortfolioManagement: false,

                autonomousStrategyEvolution: false

            },

            recommendation: {

                score: 0,

                mode: "MANUAL",

                recommendation: "MANUAL_CONTROL",

                tradingEnabled: false,

                emergencyStop: true

            },

            aiHealth: 0,

            aiHealthStatus: "CRITICAL",

            master: {},

            evolution: {},

            governor: {},

            meta: {}

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearMasterAIControllerCache() {

    cachedController = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeMasterAIController,

    clearMasterAIControllerCache,

    calculateAIControlScore,

    determineAIControlMode,

    buildAIControlCapabilities,

    generateAIRecommendation,

    calculateAIHealth,

    determineAIHealthStatus

};
