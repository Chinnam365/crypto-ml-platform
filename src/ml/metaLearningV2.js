const pool = require("../db/db");

/*
==================================================
META LEARNING V2
==================================================
PHASE 6
PART 1
==================================================
*/

const {
    analyzePortfolioAnalytics
} = require("./portfolioAnalytics");

const {
    analyzeStrategyPerformance
} = require("./strategyAnalytics");

let cachedMetaLearning = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
LOAD MODEL PERFORMANCE
==================================================
*/

async function loadModelPerformance() {

    const result = await pool.query(`
        SELECT
            symbol,
            AVG(confidence) AS avg_confidence,
            AVG(pnl) AS avg_pnl,
            COUNT(*) AS trades
        FROM positions
        WHERE status='CLOSED'
        GROUP BY symbol
    `);

    return result.rows;

}

/*
==================================================
MODEL SCORES
==================================================
*/

function calculateModelScores(
    models = []
) {

    return models.map(model => {

        const confidence =
            Number(model.avg_confidence || 0);

        const pnl =
            Number(model.avg_pnl || 0);

        const trades =
            Number(model.trades || 0);

        const score =

            (

                confidence * 0.45 +

                pnl * 25 +

                Math.min(trades, 100) * 0.30

            );

        return {

            symbol:
                model.symbol,

            confidence:
                Number(confidence.toFixed(2)),

            avgPnL:
                Number(pnl.toFixed(2)),

            trades,

            score:
                Number(score.toFixed(2))

        };

    });

}

/*
==================================================
RANK MODELS
==================================================
*/

function rankModels(
    models = []
) {

    return models.sort(

        (a, b) =>

            b.score -

            a.score

    );

}
/*
==================================================
META LEARNING CLASSIFICATION
==================================================
*/

function classifyMetaLearning(
    score
) {

    if (score >= 90) {

        return "SELF_EVOLVING";

    }

    if (score >= 75) {

        return "OPTIMIZED";

    }

    if (score >= 60) {

        return "LEARNING";

    }

    if (score >= 40) {

        return "IMPROVING";

    }

    return "RETRAIN";

}

/*
==================================================
META LEARNING SCORE
==================================================
*/

function calculateMetaLearningScore({

    portfolioAnalytics,

    strategyAnalytics,

    rankedModels

}) {

    const portfolioScore =
        Number(
            portfolioAnalytics.performanceScore || 0
        );

    const strategyScore =

        strategyAnalytics.strategies?.length > 0

            ?

            strategyAnalytics.strategies.reduce(

                (sum, strategy) =>

                    sum +

                    Number(
                        strategy.evolutionScore || 0
                    ),

                0

            ) /

            strategyAnalytics.strategies.length

            : 0;

    const modelScore =

        rankedModels.length > 0

            ?

            rankedModels.reduce(

                (sum, model) =>

                    sum +

                    model.score,

                0

            ) /

            rankedModels.length

            : 0;

    return Number(

        (

            portfolioScore * 0.40 +

            strategyScore * 0.35 +

            modelScore * 0.25

        ).toFixed(2)

    );

}

/*
==================================================
META RECOMMENDATION
==================================================
*/

function generateMetaRecommendation(
    score
) {

    if (score >= 85) {

        return "CONTINUE_SELF_LEARNING";

    }

    if (score >= 70) {

        return "OPTIMIZE_MODELS";

    }

    if (score >= 55) {

        return "RETRAIN_LOW_PERFORMERS";

    }

    if (score >= 40) {

        return "REBUILD_MODEL";

    }

    return "FULL_RETRAIN";

}
/*
==================================================
MAIN ENGINE
==================================================
*/

async function analyzeMetaLearning() {

    try {

        const now = Date.now();

        if (

            cachedMetaLearning &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedMetaLearning;

        }

        const portfolioAnalytics =
            await analyzePortfolioAnalytics();

        const strategyAnalytics =
            await analyzeStrategyPerformance();

        const models =
            await loadModelPerformance();

        const rankedModels =
            rankModels(

                calculateModelScores(
                    models
                )

            );

        const metaLearningScore =
            calculateMetaLearningScore({

                portfolioAnalytics,

                strategyAnalytics,

                rankedModels

            });

        const classification =
            classifyMetaLearning(
                metaLearningScore
            );

        const recommendation =
            generateMetaRecommendation(
                metaLearningScore
            );

        const result = {

            generatedAt:
                new Date(),

            metaLearningScore,

            classification,

            recommendation,

            portfolioAnalytics,

            strategyAnalytics,

            rankedModels,

            topModels:
                rankedModels.slice(0, 10)

        };

        cachedMetaLearning =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
META LEARNING V2
==================================

Meta Learning Score:
${metaLearningScore}

Classification:
${classification}

Recommendation:
${recommendation}

Models:
${rankedModels.length}

==================================
`);

        return result;

    }

    catch (err) {

        console.log(`
==================================
META LEARNING ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            metaLearningScore: 0,

            classification: "UNKNOWN",

            recommendation: "UNKNOWN",

            portfolioAnalytics: {},

            strategyAnalytics: {},

            rankedModels: [],

            topModels: []

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearMetaLearningCache() {

    cachedMetaLearning = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeMetaLearning,

    clearMetaLearningCache,

    loadModelPerformance,

    calculateModelScores,

    rankModels,

    calculateMetaLearningScore,

    classifyMetaLearning,

    generateMetaRecommendation

};
