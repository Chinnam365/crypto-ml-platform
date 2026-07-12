const pool = require("../db/db");

/*
==================================================
DYNAMIC CAPITAL ROTATION
==================================================
PHASE 5
PART 1
==================================================
*/

const {
    analyzePortfolioHealth
} = require("./portfolioHealthEngine");

const {
    analyzeExposure
} = require("./exposureManager");

let cachedRotation = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
LOAD SYMBOL PERFORMANCE
==================================================
*/

async function loadSymbolPerformance() {

    const result = await pool.query(`
        SELECT
            symbol,
            COUNT(*) AS trades,
            AVG(pnl) AS avg_pnl,
            AVG(confidence) AS avg_confidence,
            SUM(pnl) AS total_pnl
        FROM positions
        GROUP BY symbol
    `);

    return result.rows;

}

/*
==================================================
ROTATION SCORE
==================================================
*/

function calculateRotationScores(
    symbols = []
) {

    return symbols.map(symbol => {

        const trades =
            Number(symbol.trades || 0);

        const avgPnL =
            Number(symbol.avg_pnl || 0);

        const avgConfidence =
            Number(symbol.avg_confidence || 50);

        const totalPnL =
            Number(symbol.total_pnl || 0);

        const rotationScore =

            (

                avgPnL * 35 +

                avgConfidence * 0.50 +

                Math.min(trades, 100) * 0.20 +

                totalPnL * 0.05

            );

        return {

            symbol:
                symbol.symbol,

            trades,

            avgPnL:
                Number(avgPnL.toFixed(2)),

            avgConfidence:
                Number(avgConfidence.toFixed(2)),

            totalPnL:
                Number(totalPnL.toFixed(2)),

            rotationScore:
                Number(rotationScore.toFixed(2))

        };

    });

}

/*
==================================================
RANK ROTATION
==================================================
*/

function rankRotationCandidates(
    candidates = []
) {

    return candidates.sort(

        (a, b) =>

            b.rotationScore -

            a.rotationScore

    );

}
/*
==================================================
ROTATION RECOMMENDATIONS
==================================================
*/

function classifyRotation(
    score
) {

    if (score >= 85) {

        return "INCREASE";

    }

    if (score >= 70) {

        return "ACCUMULATE";

    }

    if (score >= 55) {

        return "HOLD";

    }

    if (score >= 40) {

        return "REDUCE";

    }

    return "EXIT";

}

/*
==================================================
CAPITAL ALLOCATION FACTOR
==================================================
*/

function calculateAllocationFactor(
    score
) {

    if (score >= 85) {

        return 1.40;

    }

    if (score >= 70) {

        return 1.20;

    }

    if (score >= 55) {

        return 1.00;

    }

    if (score >= 40) {

        return 0.75;

    }

    return 0.40;

}

/*
==================================================
PORTFOLIO ADJUSTMENT
==================================================
*/

function applyPortfolioAdjustment(
    ranked,
    portfolioHealth,
    exposure
) {

    return ranked.map(symbol => {

        let adjustedScore =
            symbol.rotationScore;

        adjustedScore +=

            (
                Number(
                    portfolioHealth.healthScore || 50
                ) - 50
            ) * 0.30;

        if (

            exposure.exposure &&
            exposure.exposure[symbol.symbol]

        ) {

            adjustedScore -=

                exposure.exposure[symbol.symbol]
                    .percentage * 0.20;

        }

        adjustedScore = Number(
            adjustedScore.toFixed(2)
        );

        return {

            ...symbol,

            adjustedScore,

            recommendation:
                classifyRotation(
                    adjustedScore
                ),

            allocationFactor:
                calculateAllocationFactor(
                    adjustedScore
                )

        };

    });

}
/*
==================================================
MAIN ENGINE
==================================================
*/

async function analyzeCapitalRotation() {

    try {

        const now = Date.now();

        if (

            cachedRotation &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedRotation;

        }

        const symbols =
            await loadSymbolPerformance();

        const portfolioHealth =
            await analyzePortfolioHealth();

        const exposure =
            await analyzeExposure();

        const ranked =
            rankRotationCandidates(

                calculateRotationScores(
                    symbols
                )

            );

        const adjusted =
            applyPortfolioAdjustment(

                ranked,

                portfolioHealth,

                exposure

            );

        const result = {

            generatedAt:
                new Date(),

            totalSymbols:
                adjusted.length,

            recommendations:
                adjusted,

            topRotation:
                adjusted.slice(0, 10)

        };

        cachedRotation =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
DYNAMIC CAPITAL ROTATION
==================================

Symbols:
${adjusted.length}

Top Candidate:
${adjusted[0]?.symbol || "NONE"}

Recommendation:
${adjusted[0]?.recommendation || "NONE"}

Allocation Factor:
${adjusted[0]?.allocationFactor || 1}

==================================
`);

        return result;

    }

    catch (err) {

        console.log(`
==================================
CAPITAL ROTATION ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            totalSymbols: 0,

            recommendations: [],

            topRotation: []

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearCapitalRotationCache() {

    cachedRotation = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeCapitalRotation,

    clearCapitalRotationCache,

    loadSymbolPerformance,

    calculateRotationScores,

    rankRotationCandidates,

    classifyRotation,

    calculateAllocationFactor,

    applyPortfolioAdjustment

};
