const pool = require("../db/db");

/*
==================================================
PORTFOLIO LEARNING
==================================================
PHASE 5
PART 1
==================================================
*/

const {
    analyzePortfolioDecision
} = require("./portfolioDecisionEngine");

let cachedLearning = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
LOAD PORTFOLIO HISTORY
==================================================
*/

async function loadPortfolioHistory() {

    const result = await pool.query(`
        SELECT
            id,
            created_at,
            pnl,
            confidence,
            decision,
            regime,
            trend
        FROM positions
        WHERE status='CLOSED'
        ORDER BY id DESC
        LIMIT 5000
    `);

    return result.rows;

}

/*
==================================================
LEARNING METRICS
==================================================
*/

function calculateLearningMetrics(
    trades = []
) {

    const metrics = {

        totalTrades: trades.length,

        wins: 0,

        losses: 0,

        totalPnL: 0,

        avgConfidence: 0,

        winRate: 0

    };

    if (trades.length === 0) {

        return metrics;

    }

    let confidenceTotal = 0;

    for (const trade of trades) {

        const pnl =
            Number(trade.pnl || 0);

        metrics.totalPnL += pnl;

        confidenceTotal +=
            Number(
                trade.confidence || 0
            );

        if (pnl > 0) {

            metrics.wins++;

        }

        else if (pnl < 0) {

            metrics.losses++;

        }

    }

    metrics.winRate =

        Number(

            (

                metrics.wins /

                trades.length

            ) * 100

        ).toFixed(2);

    metrics.avgConfidence =

        Number(

            (

                confidenceTotal /

                trades.length

            ).toFixed(2)

        );

    metrics.totalPnL =

        Number(
            metrics.totalPnL.toFixed(2)
        );

    return metrics;

}

/*
==================================================
LEARNING SCORE
==================================================
*/

function calculateLearningScore(
    metrics
) {

    const score =

        (

            metrics.winRate * 0.50 +

            metrics.avgConfidence * 0.30 +

            Math.max(
                0,
                metrics.totalPnL
            ) * 0.20

        );

    return Number(
        score.toFixed(2)
    );

}
/*
==================================================
LEARNING CLASSIFICATION
==================================================
*/

function classifyLearning(
    learningScore
) {

    if (learningScore >= 90) {

        return "EXCELLENT";

    }

    if (learningScore >= 75) {

        return "GOOD";

    }

    if (learningScore >= 60) {

        return "STABLE";

    }

    if (learningScore >= 40) {

        return "IMPROVING";

    }

    return "POOR";

}

/*
==================================================
LEARNING RECOMMENDATION
==================================================
*/

function generateLearningRecommendation(
    metrics,
    learningScore
) {

    if (metrics.totalTrades < 100) {

        return "INSUFFICIENT_DATA";

    }

    if (metrics.winRate < 45) {

        return "RETRAIN_MODELS";

    }

    if (metrics.avgConfidence < 55) {

        return "RECALIBRATE_CONFIDENCE";

    }

    if (learningScore >= 80) {

        return "CONTINUE_LEARNING";

    }

    return "OPTIMIZE_STRATEGIES";

}

/*
==================================================
PORTFOLIO IMPROVEMENT SCORE
==================================================
*/

function calculateImprovementScore(
    metrics
) {

    let score = 50;

    score +=
        (
            metrics.winRate - 50
        ) * 0.50;

    score +=
        (
            metrics.avgConfidence - 50
        ) * 0.30;

    score +=
        Math.min(
            20,
            Math.max(
                -20,
                metrics.totalPnL / 100
            )
        );

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
MAIN ENGINE
==================================================
*/

async function analyzePortfolioLearning() {

    try {

        const now = Date.now();

        if (

            cachedLearning &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedLearning;

        }

        const history =
            await loadPortfolioHistory();

        const decision =
            await analyzePortfolioDecision();

        const metrics =
            calculateLearningMetrics(
                history
            );

        const learningScore =
            calculateLearningScore(
                metrics
            );

        const improvementScore =
            calculateImprovementScore(
                metrics
            );

        const classification =
            classifyLearning(
                learningScore
            );

        const recommendation =
            generateLearningRecommendation(

                metrics,

                learningScore

            );

        const result = {

            generatedAt:
                new Date(),

            metrics,

            learningScore,

            improvementScore,

            classification,

            recommendation,

            decision

        };

        cachedLearning =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
PORTFOLIO LEARNING
==================================

Learning Score:
${learningScore}

Improvement Score:
${improvementScore}

Classification:
${classification}

Recommendation:
${recommendation}

==================================
`);

        return result;

    }

    catch (err) {

        console.log(`
==================================
PORTFOLIO LEARNING ERROR
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

            learningScore: 0,

            improvementScore: 0,

            classification: "UNKNOWN",

            recommendation: "UNKNOWN",

            decision: {}

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearPortfolioLearningCache() {

    cachedLearning = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzePortfolioLearning,

    clearPortfolioLearningCache,

    calculateLearningMetrics,

    calculateLearningScore,

    calculateImprovementScore,

    classifyLearning,

    generateLearningRecommendation

};
