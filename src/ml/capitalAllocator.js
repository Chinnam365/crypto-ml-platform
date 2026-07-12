const pool = require("../db/db");

/*
==================================================
CAPITAL ALLOCATOR
==================================================
PHASE 5
PART 1
==================================================
*/

let cachedCapital = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

const DEFAULT_CAPITAL = Number(
    process.env.DEFAULT_CAPITAL || 10000
);

/*
==================================================
LOAD OPEN POSITIONS
==================================================
*/

async function loadOpenPositions() {

    const result = await pool.query(`
        SELECT
            symbol,
            quantity,
            entry_price,
            pnl,
            confidence,
            status
        FROM positions
        WHERE status='OPEN'
    `);

    return result.rows;

}

/*
==================================================
PORTFOLIO CAPITAL
==================================================
*/

function calculatePortfolioCapital(
    positions = []
) {

    let investedCapital = 0;

    let unrealizedPnL = 0;

    for (const position of positions) {

        investedCapital +=

            Number(position.quantity || 0) *

            Number(position.entry_price || 0);

        unrealizedPnL +=
            Number(position.pnl || 0);

    }

    const totalCapital =

        DEFAULT_CAPITAL +
        unrealizedPnL;

    const availableCapital =

        Math.max(
            0,
            totalCapital -
            investedCapital
        );

    const utilization =

        totalCapital === 0

            ? 0

            :

            Number(

                (
                    investedCapital /
                    totalCapital
                ).toFixed(4)

            );

    return {

        totalCapital:
            Number(totalCapital.toFixed(2)),

        investedCapital:
            Number(investedCapital.toFixed(2)),

        availableCapital:
            Number(availableCapital.toFixed(2)),

        utilization

    };

}

/*
==================================================
BASE ALLOCATION
==================================================
*/

function calculateBaseAllocation(
    capital
) {

    let allocation =

        capital.availableCapital *
        0.05;

    allocation =

        Math.max(
            50,
            allocation
        );

    allocation =

        Math.min(
            allocation,
            capital.availableCapital
        );

    return Number(
        allocation.toFixed(2)
    );

}

/*
==================================================
MAIN ENGINE
==================================================
*/

async function getCapitalAllocation() {

    try {

        const now = Date.now();

        if (

            cachedCapital &&

            now - cacheTimestamp <
            CACHE_DURATION_MS

        ) {

            return cachedCapital;

        }

        const positions =
            await loadOpenPositions();

        const capital =
            calculatePortfolioCapital(
                positions
            );

        const allocation =
            calculateBaseAllocation(
                capital
            );

        const result = {

            generatedAt:
                new Date(),

            openPositions:
                positions.length,

            capital,

            recommendedAllocation:
                allocation

        };

        cachedCapital =
            result;

        cacheTimestamp =
            now;

        return result;

    }

    catch (err) {

        console.log(`
==================================
CAPITAL ALLOCATOR ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            openPositions: 0,

            capital: {

                totalCapital:
                    DEFAULT_CAPITAL,

                investedCapital: 0,

                availableCapital:
                    DEFAULT_CAPITAL,

                utilization: 0

            },

            recommendedAllocation:
                DEFAULT_CAPITAL * 0.05

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearCapitalAllocatorCache() {

    cachedCapital = null;

    cacheTimestamp = 0;

}

module.exports = {

    getCapitalAllocation,

    clearCapitalAllocatorCache,

    calculatePortfolioCapital,

    calculateBaseAllocation

};
/*
==================================================
PORTFOLIO HEALTH ADJUSTMENT
==================================================
*/

function applyPortfolioHealthAdjustment(
    allocation,
    portfolioHealth
) {

    let adjusted = allocation;

    const score =
        Number(portfolioHealth?.score || 50);

    if (score >= 90) {

        adjusted *= 1.30;

    }
    else if (score >= 80) {

        adjusted *= 1.20;

    }
    else if (score >= 70) {

        adjusted *= 1.10;

    }
    else if (score >= 60) {

        adjusted *= 1.00;

    }
    else if (score >= 50) {

        adjusted *= 0.90;

    }
    else if (score >= 40) {

        adjusted *= 0.75;

    }
    else {

        adjusted *= 0.50;

    }

    return Number(
        adjusted.toFixed(2)
    );

}

/*
==================================================
DRAWDOWN ADJUSTMENT
==================================================
*/

function applyDrawdownAdjustment(
    allocation,
    drawdownState = {}
) {

    let adjusted = allocation;

    switch (
        drawdownState.riskMode
    ) {

        case "CAUTION":

            adjusted *= 0.90;

            break;

        case "DEFENSIVE":

            adjusted *= 0.75;

            break;

        case "CAPITAL_PRESERVATION":

            adjusted *= 0.50;

            break;

    }

    return Number(
        adjusted.toFixed(2)
    );

}

/*
==================================================
CAPITAL UTILIZATION
==================================================
*/

function applyCapitalUtilizationAdjustment(
    allocation,
    capital
) {

    let adjusted =
        allocation;

    const utilization =

        Number(
            capital.utilization || 0
        );

    if (
        utilization >= 0.90
    ) {

        adjusted *= 0.40;

    }
    else if (
        utilization >= 0.80
    ) {

        adjusted *= 0.60;

    }
    else if (
        utilization >= 0.70
    ) {

        adjusted *= 0.75;

    }
    else if (
        utilization >= 0.60
    ) {

        adjusted *= 0.90;

    }

    return Number(
        adjusted.toFixed(2)
    );

}

/*
==================================================
AI CAPITAL SCORE
==================================================
*/

function calculateCapitalScore({

    capital,

    portfolioHealth,

    drawdownState

}) {

    let score = 100;

    score -=
        Number(
            capital.utilization || 0
        ) * 40;

    score +=
        (
            Number(
                portfolioHealth?.score || 50
            ) - 50
        ) * 0.50;

    switch (
        drawdownState?.riskMode
    ) {

        case "CAUTION":

            score -= 10;

            break;

        case "DEFENSIVE":

            score -= 25;

            break;

        case "CAPITAL_PRESERVATION":

            score -= 45;

            break;

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
FINAL ALLOCATION ENGINE
==================================================
*/

async function getRecommendedAllocation({

    portfolioHealth = { score: 50 },

    drawdownState = { riskMode: "NORMAL" }

} = {}) {

    const portfolio =
        await getCapitalAllocation();

    let allocation =
        portfolio.recommendedAllocation;

    allocation =
        applyPortfolioHealthAdjustment(
            allocation,
            portfolioHealth
        );

    allocation =
        applyDrawdownAdjustment(
            allocation,
            drawdownState
        );

    allocation =
        applyCapitalUtilizationAdjustment(
            allocation,
            portfolio.capital
        );

    allocation = Math.min(

        allocation,

        portfolio.capital.availableCapital

    );

    allocation = Math.max(

        25,

        allocation

    );

    const capitalScore =
        calculateCapitalScore({

            capital:
                portfolio.capital,

            portfolioHealth,

            drawdownState

        });

    const recommendation =

        capitalScore >= 80

            ? "AGGRESSIVE"

        : capitalScore >= 65

            ? "NORMAL"

        : capitalScore >= 45

            ? "CONSERVATIVE"

            : "DEFENSIVE";

    console.log(`
==================================
CAPITAL ALLOCATOR
==================================

Portfolio Capital:
${portfolio.capital.totalCapital}

Invested:
${portfolio.capital.investedCapital}

Available:
${portfolio.capital.availableCapital}

Utilization:
${(portfolio.capital.utilization * 100).toFixed(2)}%

Capital Score:
${capitalScore}

Recommendation:
${recommendation}

Suggested Allocation:
${allocation}

==================================
`);

    return {

        generatedAt:
            portfolio.generatedAt,

        capital:
            portfolio.capital,

        capitalScore,

        recommendation,

        recommendedAllocation:
            Number(
                allocation.toFixed(2)
            )

    };

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    getCapitalAllocation,

    getRecommendedAllocation,

    clearCapitalAllocatorCache,

    calculatePortfolioCapital,

    calculateBaseAllocation,

    applyPortfolioHealthAdjustment,

    applyDrawdownAdjustment,

    applyCapitalUtilizationAdjustment,

    calculateCapitalScore

};
