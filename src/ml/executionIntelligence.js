const pool = require("../db/db");

/*
==================================================
EXECUTION INTELLIGENCE ENGINE
==================================================
PHASE 6
PART 1
==================================================
*/

const {
    analyzeRiskIntelligence
} = require("./riskIntelligenceEngine");

const {
    analyzePortfolioDecision
} = require("./portfolioDecisionEngine");

const {
    analyzeSectorRotation
} = require("./sectorRotationAI");

let cachedExecution = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
LOAD EXECUTION HISTORY
==================================================
*/

async function loadExecutionHistory() {

    const result = await pool.query(`
        SELECT
            symbol,
            pnl,
            confidence,
            decision,
            status,
            created_at
        FROM positions
        ORDER BY id DESC
        LIMIT 1000
    `);

    return result.rows;

}

/*
==================================================
EXECUTION METRICS
==================================================
*/

function calculateExecutionMetrics(
    history = []
) {

    const metrics = {

        executions:
            history.length,

        successful: 0,

        failed: 0,

        totalPnL: 0,

        averagePnL: 0,

        averageConfidence: 0

    };

    if (history.length === 0) {

        return metrics;

    }

    let confidenceSum = 0;

    for (const trade of history) {

        const pnl =
            Number(trade.pnl || 0);

        metrics.totalPnL += pnl;

        confidenceSum +=
            Number(
                trade.confidence || 0
            );

        if (pnl > 0) {

            metrics.successful++;

        }

        else if (pnl < 0) {

            metrics.failed++;

        }

    }

    metrics.averagePnL =

        Number(

            (

                metrics.totalPnL /

                history.length

            ).toFixed(2)

        );

    metrics.averageConfidence =

        Number(

            (

                confidenceSum /

                history.length

            ).toFixed(2)

        );

    return metrics;

}
/*
==================================================
EXECUTION SCORE
==================================================
*/

function calculateExecutionScore({

    metrics,

    risk,

    portfolio,

    sectors

}) {

    const successRate =

        metrics.executions === 0

            ? 0

            :

            (

                metrics.successful /

                metrics.executions

            ) * 100;

    const sectorScore =

        Number(
            sectors.aiScore || 0
        );

    const portfolioScore =

        Number(
            portfolio.decisionScore || 0
        );

    const riskScore =

        Number(
            risk.riskScore || 0
        );

    const score =

        (

            successRate * 0.30 +

            portfolioScore * 0.25 +

            riskScore * 0.25 +

            sectorScore * 0.20

        );

    return Number(
        score.toFixed(2)
    );

}

/*
==================================================
EXECUTION DECISION
==================================================
*/

function classifyExecution(
    score
) {

    if (score >= 90) {

        return "EXECUTE_FULL";

    }

    if (score >= 75) {

        return "EXECUTE";

    }

    if (score >= 60) {

        return "LIMITED";

    }

    if (score >= 45) {

        return "WAIT";

    }

    return "BLOCK";

}

/*
==================================================
EXECUTION PLAN
==================================================
*/

function buildExecutionPlan({

    classification,

    risk,

    portfolio

}) {

    return {

        action:
            classification,

        executeTrades:

            classification ===
                "EXECUTE"

            ||

            classification ===
                "EXECUTE_FULL",

        maxPositionMultiplier:

            Number(

                risk.decision
                    ?.maxPositionMultiplier || 1

            ),

        allowNewPositions:

            portfolio.recommendation
                ?.allowNewPositions || false,

        reduceExposure:

            portfolio.recommendation
                ?.reduceExposure || false

    };

}
/*
==================================================
MAIN ENGINE
==================================================
*/

async function analyzeExecutionIntelligence() {

    try {

        const now = Date.now();

        if (

            cachedExecution &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedExecution;

        }

        const history =
            await loadExecutionHistory();

        const metrics =
            calculateExecutionMetrics(
                history
            );

        const risk =
            await analyzeRiskIntelligence();

        const portfolio =
            await analyzePortfolioDecision();

        const sectors =
            await analyzeSectorRotation();

        const executionScore =
            calculateExecutionScore({

                metrics,

                risk,

                portfolio,

                sectors

            });

        const classification =
            classifyExecution(
                executionScore
            );

        const executionPlan =
            buildExecutionPlan({

                classification,

                risk,

                portfolio

            });

        const result = {

            generatedAt:
                new Date(),

            metrics,

            risk,

            portfolio,

            sectors,

            executionScore,

            classification,

            executionPlan

        };

        cachedExecution =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
EXECUTION INTELLIGENCE
==================================

Execution Score:
${executionScore}

Classification:
${classification}

Execute Trades:
${executionPlan.executeTrades}

Allow New Positions:
${executionPlan.allowNewPositions}

Reduce Exposure:
${executionPlan.reduceExposure}

==================================
`);

        return result;

    }

    catch (err) {

        console.log(`
==================================
EXECUTION INTELLIGENCE ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            metrics: {},

            risk: {},

            portfolio: {},

            sectors: {},

            executionScore: 0,

            classification: "UNKNOWN",

            executionPlan: {

                action: "UNKNOWN",

                executeTrades: false,

                maxPositionMultiplier: 0,

                allowNewPositions: false,

                reduceExposure: true

            }

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearExecutionIntelligenceCache() {

    cachedExecution = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeExecutionIntelligence,

    clearExecutionIntelligenceCache,

    loadExecutionHistory,

    calculateExecutionMetrics,

    calculateExecutionScore,

    classifyExecution,

    buildExecutionPlan

};
