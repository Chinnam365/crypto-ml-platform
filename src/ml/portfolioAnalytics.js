const pool = require("../db/db");

/*
==================================================
PORTFOLIO ANALYTICS
==================================================
PHASE 5
PART 1
==================================================
*/

const {
    analyzePortfolioLearning
} = require("./portfolioLearning");

let cachedAnalytics = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
LOAD CLOSED TRADES
==================================================
*/

async function loadTrades() {

    const result = await pool.query(`
        SELECT
            symbol,
            pnl,
            confidence,
            decision,
            created_at,
            closed_at
        FROM positions
        WHERE status='CLOSED'
        ORDER BY id DESC
        LIMIT 5000
    `);

    return result.rows;

}

/*
==================================================
BUILD ANALYTICS
==================================================
*/

function buildAnalytics(
    trades = []
) {

    const analytics = {

        totalTrades:
            trades.length,

        wins: 0,

        losses: 0,

        totalPnL: 0,

        avgPnL: 0,

        avgConfidence: 0,

        avgDurationHours: 0

    };

    if (trades.length === 0) {

        return analytics;

    }

    let confidenceTotal = 0;

    let durationTotal = 0;

    for (const trade of trades) {

        const pnl =
            Number(trade.pnl || 0);

        analytics.totalPnL += pnl;

        confidenceTotal +=
            Number(
                trade.confidence || 0
            );

        if (pnl > 0) {

            analytics.wins++;

        }

        else if (pnl < 0) {

            analytics.losses++;

        }

        if (

            trade.created_at &&

            trade.closed_at

        ) {

            durationTotal +=

                (

                    new Date(
                        trade.closed_at
                    ) -

                    new Date(
                        trade.created_at
                    )

                ) / 3600000;

        }

    }

    analytics.avgPnL =

        Number(

            (

                analytics.totalPnL /

                trades.length

            ).toFixed(2)

        );

    analytics.avgConfidence =

        Number(

            (

                confidenceTotal /

                trades.length

            ).toFixed(2)

        );

    analytics.avgDurationHours =

        Number(

            (

                durationTotal /

                trades.length

            ).toFixed(2)

        );

    analytics.totalPnL =

        Number(
            analytics.totalPnL.toFixed(2)
        );

    return analytics;

}

/*
==================================================
PERFORMANCE SCORE
==================================================
*/

function calculatePerformanceScore(
    analytics
) {

    const winRate =

        analytics.totalTrades === 0

            ? 0

            :

            (

                analytics.wins /

                analytics.totalTrades

            ) * 100;

    const score =

        (

            winRate * 0.50 +

            analytics.avgConfidence * 0.30 +

            Math.max(
                0,
                analytics.avgPnL
            ) * 0.20

        );

    return Number(
        score.toFixed(2)
    );

}
/*
==================================================
ANALYTICS CLASSIFICATION
==================================================
*/

function classifyPerformance(
    performanceScore
) {

    if (performanceScore >= 90) {

        return "EXCELLENT";

    }

    if (performanceScore >= 75) {

        return "GOOD";

    }

    if (performanceScore >= 60) {

        return "STABLE";

    }

    if (performanceScore >= 40) {

        return "IMPROVING";

    }

    return "POOR";

}

/*
==================================================
ANALYTICS RECOMMENDATION
==================================================
*/

function generateAnalyticsRecommendation(
    analytics,
    performanceScore
) {

    const winRate =

        analytics.totalTrades === 0

            ? 0

            :

            (

                analytics.wins /

                analytics.totalTrades

            ) * 100;

    if (analytics.totalTrades < 100) {

        return "MORE_DATA_REQUIRED";

    }

    if (winRate < 45) {

        return "OPTIMIZE_STRATEGIES";

    }

    if (analytics.avgConfidence < 55) {

        return "CALIBRATE_CONFIDENCE";

    }

    if (performanceScore >= 80) {

        return "CONTINUE_CURRENT_APPROACH";

    }

    return "REVIEW_PORTFOLIO";

}

/*
==================================================
CONSISTENCY SCORE
==================================================
*/

function calculateConsistencyScore(
    analytics
) {

    let score = 50;

    score +=

        (

            analytics.avgConfidence - 50

        ) * 0.40;

    score +=

        Math.min(

            25,

            Math.max(

                -25,

                analytics.avgPnL * 2

            )

        );

    score = Math.max(

        0,

        Math.min(

            Number(
                score.toFixed(2)
            ),

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

async function analyzePortfolioAnalytics() {

    try {

        const now = Date.now();

        if (

            cachedAnalytics &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedAnalytics;

        }

        const trades =
            await loadTrades();

        const learning =
            await analyzePortfolioLearning();

        const analytics =
            buildAnalytics(
                trades
            );

        const performanceScore =
            calculatePerformanceScore(
                analytics
            );

        const consistencyScore =
            calculateConsistencyScore(
                analytics
            );

        const classification =
            classifyPerformance(
                performanceScore
            );

        const recommendation =
            generateAnalyticsRecommendation(

                analytics,

                performanceScore

            );

        const result = {

            generatedAt:
                new Date(),

            analytics,

            performanceScore,

            consistencyScore,

            classification,

            recommendation,

            learning

        };

        cachedAnalytics =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
PORTFOLIO ANALYTICS
==================================

Trades:
${analytics.totalTrades}

Performance Score:
${performanceScore}

Consistency:
${consistencyScore}

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
PORTFOLIO ANALYTICS ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            analytics: {},

            performanceScore: 0,

            consistencyScore: 0,

            classification: "UNKNOWN",

            recommendation: "UNKNOWN",

            learning: {}

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearPortfolioAnalyticsCache() {

    cachedAnalytics = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzePortfolioAnalytics,

    clearPortfolioAnalyticsCache,

    buildAnalytics,

    calculatePerformanceScore,

    calculateConsistencyScore,

    classifyPerformance,

    generateAnalyticsRecommendation

};
