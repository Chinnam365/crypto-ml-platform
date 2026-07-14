/*
==================================================
SYSTEM ORCHESTRATOR V2
==================================================
PHASE 6
PART 1
==================================================
*/

const {
    analyzeAutonomousTradingGovernor
} = require("./autonomousTradingGovernor");

const {
    analyzeExecutionIntelligence
} = require("./executionIntelligence");

const {
    analyzePortfolioAnalytics
} = require("./portfolioAnalytics");

const {
    analyzeMetaLearning
} = require("./metaLearningV2");

let cachedSystem = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
SYSTEM SCORE
==================================================
*/

function calculateSystemScore({

    governor,

    execution,

    portfolio,

    meta

}) {

    const score =

        (

            Number(
                governor.governorScore || 0
            ) * 0.35 +

            Number(
                execution.executionScore || 0
            ) * 0.25 +

            Number(
                portfolio.performanceScore || 0
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
SYSTEM STATE
==================================================
*/

function determineSystemState(
    score
) {

    if (score >= 90) {

        return "FULLY_OPERATIONAL";

    }

    if (score >= 75) {

        return "OPTIMAL";

    }

    if (score >= 60) {

        return "STABLE";

    }

    if (score >= 45) {

        return "LIMITED";

    }

    return "RECOVERY";

}

/*
==================================================
SYSTEM PERMISSIONS
==================================================
*/

function buildSystemPermissions(
    governor
) {

    return {

        autonomousTrading:

            governor.permissions
                ?.canOpenTrades || false,

        portfolioRotation:

            governor.permissions
                ?.canRotatePortfolio || false,

        selfOptimization:

            governor.permissions
                ?.canSelfOptimize || false,

        positionScaling:

            governor.permissions
                ?.canScalePositions || false

    };

}
/*
==================================================
SYSTEM RECOMMENDATION
==================================================
*/

function generateSystemRecommendation({

    score,

    state,

    governor

}) {

    return {

        score,

        state,

        recommendation:

            score >= 90

                ? "FULLY_AUTONOMOUS"

            : score >= 75

                ? "AUTONOMOUS"

            : score >= 60

                ? "SUPERVISED"

            : score >= 45

                ? "LIMITED_OPERATION"

            : "RECOVERY_MODE",

        tradingEnabled:

            governor.recommendation
                ?.tradingEnabled || false,

        emergencyStop:

            governor.recommendation
                ?.emergencyStop || false

    };

}

/*
==================================================
SYSTEM HEALTH
==================================================
*/

function calculateOverallHealth({

    governor,

    execution,

    portfolio,

    meta

}) {

    const health =

        (

            Number(
                governor.systemHealth || 0
            ) * 0.35 +

            Number(
                execution.executionScore || 0
            ) * 0.25 +

            Number(
                portfolio.consistencyScore || 0
            ) * 0.20 +

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
SYSTEM STATUS
==================================================
*/

function determineSystemStatus(
    health
) {

    if (health >= 90) {

        return "EXCELLENT";

    }

    if (health >= 75) {

        return "GOOD";

    }

    if (health >= 60) {

        return "STABLE";

    }

    if (health >= 45) {

        return "DEGRADED";

    }

    return "CRITICAL";

}
/*
==================================================
MAIN ENGINE
==================================================
*/

async function analyzeSystemOrchestrator() {

    try {

        const now = Date.now();

        if (

            cachedSystem &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedSystem;

        }

        const governor =
            await analyzeAutonomousTradingGovernor();

        const execution =
            await analyzeExecutionIntelligence();

        const portfolio =
            await analyzePortfolioAnalytics();

        const meta =
            await analyzeMetaLearning();

        const systemScore =
            calculateSystemScore({

                governor,

                execution,

                portfolio,

                meta

            });

        const systemState =
            determineSystemState(
                systemScore
            );

        const permissions =
            buildSystemPermissions(
                governor
            );

        const recommendation =
            generateSystemRecommendation({

                score: systemScore,

                state: systemState,

                governor

            });

        const overallHealth =
            calculateOverallHealth({

                governor,

                execution,

                portfolio,

                meta

            });

        const systemStatus =
            determineSystemStatus(
                overallHealth
            );

        const result = {

            generatedAt:
                new Date(),

            systemScore,

            systemState,

            permissions,

            recommendation,

            overallHealth,

            systemStatus,

            governor,

            execution,

            portfolio,

            meta

        };

        cachedSystem =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
SYSTEM ORCHESTRATOR V2
==================================

System Score:
${systemScore}

System State:
${systemState}

Overall Health:
${overallHealth}

System Status:
${systemStatus}

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
SYSTEM ORCHESTRATOR ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            systemScore: 0,

            systemState: "RECOVERY",

            permissions: {

                autonomousTrading: false,

                portfolioRotation: false,

                selfOptimization: false,

                positionScaling: false

            },

            recommendation: {

                score: 0,

                state: "RECOVERY",

                recommendation: "RECOVERY_MODE",

                tradingEnabled: false,

                emergencyStop: true

            },

            overallHealth: 0,

            systemStatus: "CRITICAL",

            governor: {},

            execution: {},

            portfolio: {},

            meta: {}

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearSystemOrchestratorCache() {

    cachedSystem = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeSystemOrchestrator,

    clearSystemOrchestratorCache,

    calculateSystemScore,

    determineSystemState,

    buildSystemPermissions,

    generateSystemRecommendation,

    calculateOverallHealth,

    determineSystemStatus

};
