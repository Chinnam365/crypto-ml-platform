const pool = require("../db/db");

/*
==================================================
RESERVE CAPITAL MANAGER
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

let cachedReserve = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
LOAD CAPITAL
==================================================
*/

async function loadCapital() {

    const result = await pool.query(`
        SELECT
            quantity,
            entry_price,
            pnl
        FROM positions
        WHERE status='OPEN'
    `);

    return result.rows;

}

/*
==================================================
CAPITAL SUMMARY
==================================================
*/

function calculateCapitalSummary(
    positions = [],
    accountBalance =
        Number(process.env.DEFAULT_CAPITAL || 10000)
) {

    let invested = 0;

    let pnl = 0;

    for (const position of positions) {

        invested +=

            Number(position.quantity || 0) *

            Number(position.entry_price || 0);

        pnl +=
            Number(position.pnl || 0);

    }

    const equity =
        accountBalance + pnl;

    const reserve =

        Math.max(
            0,
            equity - invested
        );

    return {

        accountBalance,

        invested:
            Number(invested.toFixed(2)),

        equity:
            Number(equity.toFixed(2)),

        reserve:
            Number(reserve.toFixed(2))

    };

}

/*
==================================================
MINIMUM RESERVE
==================================================
*/

function calculateMinimumReserve(
    health,
    exposure
) {

    let reserve = 20;

    if (

        health.healthScore < 60

    ) {

        reserve += 10;

    }

    if (

        exposure.exposureRisk > 60

    ) {

        reserve += 10;

    }

    if (

        exposure.concentration.concentration > 50

    ) {

        reserve += 10;

    }

    return Math.min(
        reserve,
        60
    );

}
/*
==================================================
RESERVE RECOMMENDATION
==================================================
*/

function calculateReserveRecommendation(
    capital,
    minimumReservePercent
) {

    const reservePercent =

        capital.equity === 0

            ? 0

            :

            (

                capital.reserve /

                capital.equity

            ) * 100;

    const sufficient =

        reservePercent >=
        minimumReservePercent;

    return {

        reservePercent:
            Number(
                reservePercent.toFixed(2)
            ),

        minimumReservePercent,

        sufficient,

        additionalReserve:

            sufficient

                ? 0

                :

                Number(

                    (

                        (

                            minimumReservePercent -

                            reservePercent

                        ) *

                        capital.equity /

                        100

                    ).toFixed(2)

                )

    };

}

/*
==================================================
AI RESERVE SCORE
==================================================
*/

function calculateReserveScore(
    recommendation
) {

    let score = 100;

    if (

        !recommendation.sufficient

    ) {

        score -=

            recommendation.additionalReserve *
            0.10;

    }

    score =

        Math.max(

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
STATUS
==================================================
*/

function classifyReserveStatus(
    score
) {

    if (score >= 90) {

        return "EXCELLENT";

    }

    if (score >= 75) {

        return "GOOD";

    }

    if (score >= 60) {

        return "ADEQUATE";

    }

    if (score >= 40) {

        return "LOW";

    }

    return "CRITICAL";

}
/*
==================================================
MAIN ENGINE
==================================================
*/

async function analyzeReserveCapital() {

    try {

        const now = Date.now();

        if (

            cachedReserve &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedReserve;

        }

        const positions =
            await loadCapital();

        const health =
            await analyzePortfolioHealth();

        const exposure =
            await analyzeExposure();

        const capital =
            calculateCapitalSummary(
                positions
            );

        const minimumReservePercent =
            calculateMinimumReserve(
                health,
                exposure
            );

        const recommendation =
            calculateReserveRecommendation(

                capital,

                minimumReservePercent

            );

        const reserveScore =
            calculateReserveScore(
                recommendation
            );

        const status =
            classifyReserveStatus(
                reserveScore
            );

        const result = {

            generatedAt:
                new Date(),

            capital,

            minimumReservePercent,

            recommendation,

            reserveScore,

            status

        };

        cachedReserve =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
RESERVE CAPITAL MANAGER
==================================

Equity:
${capital.equity}

Reserve:
${capital.reserve}

Reserve %:
${recommendation.reservePercent}

Minimum Reserve:
${minimumReservePercent}

Reserve Score:
${reserveScore}

Status:
${status}

==================================
`);

        return result;

    }

    catch (err) {

        console.log(`
==================================
RESERVE CAPITAL ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            capital: {

                accountBalance: 0,

                invested: 0,

                equity: 0,

                reserve: 0

            },

            minimumReservePercent: 0,

            recommendation: {

                reservePercent: 0,

                minimumReservePercent: 0,

                sufficient: false,

                additionalReserve: 0

            },

            reserveScore: 0,

            status: "UNKNOWN"

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearReserveCapitalCache() {

    cachedReserve = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeReserveCapital,

    clearReserveCapitalCache,

    calculateCapitalSummary,

    calculateMinimumReserve,

    calculateReserveRecommendation,

    calculateReserveScore,

    classifyReserveStatus

};
