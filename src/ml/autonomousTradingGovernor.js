/*
==================================================
AUTONOMOUS TRADING GOVERNOR
==================================================
PHASE 6
PART 1
==================================================
*/

const {
    analyzeExecutionIntelligence
} = require("./executionIntelligence");

const {
    analyzeMetaLearning
} = require("./metaLearningV2");

const {
    analyzeRiskIntelligence
} = require("./riskIntelligenceEngine");

let cachedGovernor = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
GOVERNOR SCORE
==================================================
*/

function calculateGovernorScore({

    execution,

    risk,

    meta

}) {

    const score =

        (

            Number(
                execution.executionScore || 0
            ) * 0.45 +

            Number(
                risk.riskScore || 0
            ) * 0.35 +

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
AUTONOMOUS LEVEL
==================================================
*/

function determineAutonomousLevel(
    score
) {

    if (score >= 90) {

        return "FULLY_AUTONOMOUS";

    }

    if (score >= 80) {

        return "HIGH_AUTONOMY";

    }

    if (score >= 65) {

        return "SEMI_AUTONOMOUS";

    }

    if (score >= 50) {

        return "SUPERVISED";

    }

    return "MANUAL_ONLY";

}

/*
==================================================
AUTONOMY PERMISSIONS
==================================================
*/

function buildPermissions(
    level
) {

    return {

        canOpenTrades:

            level !== "MANUAL_ONLY",

        canCloseTrades:

            level !== "MANUAL_ONLY",

        canScalePositions:

            level === "FULLY_AUTONOMOUS" ||

            level === "HIGH_AUTONOMY",

        canRotatePortfolio:

            level === "FULLY_AUTONOMOUS",

        canSelfOptimize:

            level !== "MANUAL_ONLY"

    };

}
/*
==================================================
GOVERNOR RECOMMENDATION
==================================================
*/

function generateGovernorRecommendation({

    score,

    level,

    execution,

    risk

}) {

    return {

        score,

        level,

        recommendation:

            score >= 85

                ? "AUTONOMOUS_TRADING_ENABLED"

            : score >= 70

                ? "LIMITED_AUTONOMOUS_TRADING"

            : score >= 55

                ? "SUPERVISED_TRADING"

            : "MANUAL_APPROVAL_REQUIRED",

        tradingEnabled:

            execution.executionPlan
                ?.executeTrades &&

            risk.decision
                ?.allowTrading,

        emergencyStop:

            risk.decision
                ?.emergencyMode || false

    };

}

/*
==================================================
SYSTEM HEALTH
==================================================
*/

function calculateSystemHealth({

    execution,

    risk,

    meta

}) {

    const health =

        (

            Number(
                execution.executionScore || 0
            ) * 0.40 +

            Number(
                risk.riskScore || 0
            ) * 0.35 +

            Number(
                meta.metaLearningScore || 0
            ) * 0.25

        );

    return Number(
        health.toFixed(2)
    );

}

/*
==================================================
SAFETY STATUS
==================================================
*/

function determineSafetyStatus(
    health
) {

    if (health >= 90) {

        return "SAFE";

    }

    if (health >= 75) {

        return "LOW_RISK";

    }

    if (health >= 60) {

        return "CAUTION";

    }

    if (health >= 45) {

        return "HIGH_RISK";

    }

    return "CRITICAL";

}
/*
==================================================
MAIN ENGINE
==================================================
*/

async function analyzeAutonomousTradingGovernor() {

    try {

        const now = Date.now();

        if (

            cachedGovernor &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedGovernor;

        }

        const execution =
            await analyzeExecutionIntelligence();

        const risk =
            await analyzeRiskIntelligence();

        const meta =
            await analyzeMetaLearning();

        const governorScore =
            calculateGovernorScore({

                execution,

                risk,

                meta

            });

        const autonomousLevel =
            determineAutonomousLevel(
                governorScore
            );

        const permissions =
            buildPermissions(
                autonomousLevel
            );

        const recommendation =
            generateGovernorRecommendation({

                score: governorScore,

                level: autonomousLevel,

                execution,

                risk

            });

        const systemHealth =
            calculateSystemHealth({

                execution,

                risk,

                meta

            });

        const safetyStatus =
            determineSafetyStatus(
                systemHealth
            );

        const result = {

            generatedAt:
                new Date(),

            governorScore,

            autonomousLevel,

            permissions,

            recommendation,

            systemHealth,

            safetyStatus,

            execution,

            risk,

            meta

        };

        cachedGovernor =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
AUTONOMOUS TRADING GOVERNOR
==================================

Governor Score:
${governorScore}

Autonomous Level:
${autonomousLevel}

System Health:
${systemHealth}

Safety Status:
${safetyStatus}

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
AUTONOMOUS GOVERNOR ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            governorScore: 0,

            autonomousLevel: "MANUAL_ONLY",

            permissions: {

                canOpenTrades: false,

                canCloseTrades: false,

                canScalePositions: false,

                canRotatePortfolio: false,

                canSelfOptimize: false

            },

            recommendation: {

                score: 0,

                level: "MANUAL_ONLY",

                recommendation: "MANUAL_APPROVAL_REQUIRED",

                tradingEnabled: false,

                emergencyStop: true

            },

            systemHealth: 0,

            safetyStatus: "CRITICAL",

            execution: {},

            risk: {},

            meta: {}

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearAutonomousTradingGovernorCache() {

    cachedGovernor = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeAutonomousTradingGovernor,

    clearAutonomousTradingGovernorCache,

    calculateGovernorScore,

    determineAutonomousLevel,

    buildPermissions,

    generateGovernorRecommendation,

    calculateSystemHealth,

    determineSafetyStatus

};
