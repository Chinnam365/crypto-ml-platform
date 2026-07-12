const pool = require("../db/db");

/*
==================================================
RISK INTELLIGENCE ENGINE
==================================================
PHASE 6
PART 1
==================================================
*/

const {
    analyzeMetaLearning
} = require("./metaLearningV2");

const {
    analyzePortfolioDecision
} = require("./portfolioDecisionEngine");

const {
    getDrawdownState
} = require("./drawdownIntelligence");

const {
    getAdaptiveSizeMultiplier
} = require("./adaptiveSizing");

let cachedRisk = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
LOAD RECENT RISK EVENTS
==================================================
*/

async function loadRiskHistory() {

    const result = await pool.query(`
        SELECT
            pnl,
            confidence,
            symbol,
            regime,
            trend,
            created_at
        FROM positions
        WHERE status='CLOSED'
        ORDER BY id DESC
        LIMIT 1000
    `);

    return result.rows;

}

/*
==================================================
BUILD RISK METRICS
==================================================
*/

function calculateRiskMetrics(
    history = []
) {

    const metrics = {

        totalTrades:
            history.length,

        losses: 0,

        wins: 0,

        largestLoss: 0,

        averageLoss: 0,

        averageWin: 0,

        totalLoss: 0,

        totalWin: 0

    };

    if (history.length === 0) {

        return metrics;

    }

    for (const trade of history) {

        const pnl =
            Number(trade.pnl || 0);

        if (pnl < 0) {

            metrics.losses++;

            metrics.totalLoss +=
                Math.abs(pnl);

            metrics.largestLoss =
                Math.max(
                    metrics.largestLoss,
                    Math.abs(pnl)
                );

        }

        else if (pnl > 0) {

            metrics.wins++;

            metrics.totalWin += pnl;

        }

    }

    metrics.averageLoss =

        metrics.losses === 0

            ? 0

            : Number(

                (
                    metrics.totalLoss /
                    metrics.losses
                ).toFixed(2)

            );

    metrics.averageWin =

        metrics.wins === 0

            ? 0

            : Number(

                (
                    metrics.totalWin /
                    metrics.wins
                ).toFixed(2)

            );

    return metrics;

}
/*
==================================================
RISK SCORE
==================================================
*/

function calculateRiskScore(
    metrics,
    drawdownState,
    metaLearning
) {

    let score = 100;

    score -=
        metrics.averageLoss * 1.2;

    score -=
        metrics.largestLoss * 0.40;

    score -=
        Number(
            drawdownState.maxDrawdown || 0
        ) * 0.60;

    score +=
        Number(
            metaLearning.metaLearningScore || 0
        ) * 0.20;

    score = Math.max(
        0,
        Math.min(
            Number(score.toFixed(2)),
            100
        )
    );

    return score;

}

/*
==================================================
RISK CLASSIFICATION
==================================================
*/

function classifyRisk(
    score
) {

    if (score >= 90) {

        return "VERY_LOW";

    }

    if (score >= 75) {

        return "LOW";

    }

    if (score >= 60) {

        return "MODERATE";

    }

    if (score >= 40) {

        return "HIGH";

    }

    return "EXTREME";

}

/*
==================================================
RISK DECISION
==================================================
*/

function buildRiskDecision({

    riskScore,

    classification,

    portfolioDecision,

    sizeMultiplier

}) {

    return {

        riskScore,

        classification,

        allowTrading:

            riskScore >= 60 &&

            portfolioDecision.recommendation
                ?.allowNewPositions,

        maxPositionMultiplier:

            Number(
                sizeMultiplier || 1
            ),

        emergencyMode:

            classification === "EXTREME"

    };

}
/*
==================================================
MAIN ENGINE
==================================================
*/

async function analyzeRiskIntelligence() {

    try {

        const now = Date.now();

        if (

            cachedRisk &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedRisk;

        }

        const history =
            await loadRiskHistory();

        const metrics =
            calculateRiskMetrics(
                history
            );

        const metaLearning =
            await analyzeMetaLearning();

        const portfolioDecision =
            await analyzePortfolioDecision();

        const drawdownState =
            await getDrawdownState();

        const sizeMultiplier =
            await getAdaptiveSizeMultiplier();

        const riskScore =
            calculateRiskScore(

                metrics,

                drawdownState,

                metaLearning

            );

        const classification =
            classifyRisk(
                riskScore
            );

        const decision =
            buildRiskDecision({

                riskScore,

                classification,

                portfolioDecision,

                sizeMultiplier

            });

        const result = {

            generatedAt:
                new Date(),

            metrics,

            drawdownState,

            metaLearning,

            portfolioDecision,

            riskScore,

            classification,

            decision

        };

        cachedRisk =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
RISK INTELLIGENCE ENGINE
==================================

Risk Score:
${riskScore}

Classification:
${classification}

Allow Trading:
${decision.allowTrading}

Position Multiplier:
${decision.maxPositionMultiplier}

Emergency Mode:
${decision.emergencyMode}

==================================
`);

        return result;

    }

    catch (err) {

        console.log(`
==================================
RISK INTELLIGENCE ERROR
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

            drawdownState: {},

            metaLearning: {},

            portfolioDecision: {},

            riskScore: 0,

            classification: "UNKNOWN",

            decision: {

                riskScore: 0,

                classification: "UNKNOWN",

                allowTrading: false,

                maxPositionMultiplier: 0,

                emergencyMode: true

            }

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearRiskIntelligenceCache() {

    cachedRisk = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeRiskIntelligence,

    clearRiskIntelligenceCache,

    loadRiskHistory,

    calculateRiskMetrics,

    calculateRiskScore,

    classifyRisk,

    buildRiskDecision

};
