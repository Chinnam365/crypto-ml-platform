const pool = require("../db/db");

/*
==================================================
PORTFOLIO HEALTH ENGINE
==================================================
PHASE 5
PART 1
==================================================
*/

let cachedHealth = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
LOAD PORTFOLIO DATA
==================================================
*/

async function loadPortfolioData() {

    const result = await pool.query(`
        SELECT
            symbol,
            pnl,
            confidence,
            quantity,
            entry_price,
            status,
            created_at
        FROM positions
        WHERE status = 'OPEN'
    `);

    return result.rows;

}

/*
==================================================
PORTFOLIO METRICS
==================================================
*/

function calculateMetrics(
    positions = []
) {

    const metrics = {

        totalPositions: positions.length,

        winning: 0,

        losing: 0,

        breakeven: 0,

        totalPnL: 0,

        avgConfidence: 0,

        investedCapital: 0,

        avgAgeHours: 0

    };

    if (positions.length === 0) {

        return metrics;

    }

    const now = Date.now();

    let confidenceTotal = 0;

    let ageTotal = 0;

    for (const trade of positions) {

        const pnl =
            Number(trade.pnl || 0);

        metrics.totalPnL += pnl;

        if (pnl > 0) {

            metrics.winning++;

        }

        else if (pnl < 0) {

            metrics.losing++;

        }

        else {

            metrics.breakeven++;

        }

        confidenceTotal +=
            Number(
                trade.confidence || 0
            );

        metrics.investedCapital +=

            Number(
                trade.quantity || 0
            ) *

            Number(
                trade.entry_price || 0
            );

        ageTotal +=

            (

                Date.now() -

                new Date(
                    trade.created_at
                ).getTime()

            ) / 3600000;

    }

    metrics.totalPnL =
        Number(
            metrics.totalPnL.toFixed(2)
        );

    metrics.avgConfidence =
        Number(

            (
                confidenceTotal /
                positions.length
            ).toFixed(2)

        );

    metrics.investedCapital =
        Number(
            metrics.investedCapital.toFixed(2)
        );

    metrics.avgAgeHours =
        Number(

            (
                ageTotal /
                positions.length
            ).toFixed(2)

        );

    return metrics;

}

/*
==================================================
HEALTH SCORE
==================================================
*/

function calculateHealthScore(
    metrics
) {

    let score = 100;

    score +=
        metrics.totalPnL * 0.25;

    score -=
        metrics.losing * 3;

    score +=
        metrics.winning * 2;

    score +=

        (
            metrics.avgConfidence -
            50
        ) * 0.25;

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
PORTFOLIO HEALTH CLASSIFICATION
==================================================
*/

function classifyHealth(score) {

    if (score >= 90) {

        return "EXCELLENT";

    }

    if (score >= 75) {

        return "GOOD";

    }

    if (score >= 60) {

        return "STABLE";

    }

    if (score >= 40) {

        return "WARNING";

    }

    return "CRITICAL";

}

/*
==================================================
PORTFOLIO RISK
==================================================
*/

function calculatePortfolioRisk(metrics) {

    let risk = 0;

    risk += metrics.losing * 4;

    risk += metrics.avgAgeHours * 0.20;

    risk -= metrics.winning * 2;

    risk -= metrics.totalPnL * 0.10;

    risk = Math.max(

        0,

        Math.min(

            Number(
                risk.toFixed(2)
            ),

            100

        )

    );

    return risk;

}

/*
==================================================
PORTFOLIO STABILITY
==================================================
*/

function calculatePortfolioStability(metrics) {

    let stability = 100;

    stability -= metrics.losing * 3;

    stability += metrics.winning * 2;

    stability +=

        (
            metrics.avgConfidence -
            50
        ) * 0.30;

    stability = Math.max(

        0,

        Math.min(

            Number(
                stability.toFixed(2)
            ),

            100

        )

    );

    return stability;

}

/*
==================================================
AI HEALTH SCORE
==================================================
*/

function calculateAIHealth({

    healthScore,

    stability,

    risk

}) {

    const score =

        (

            healthScore * 0.45 +

            stability * 0.35 +

            (100 - risk) * 0.20

        );

    return Number(
        score.toFixed(2)
    );

}
/*
==================================================
MAIN ENGINE
==================================================
*/

async function analyzePortfolioHealth() {

    try {

        const now = Date.now();

        if (

            cachedHealth &&

            (now - cacheTimestamp) < CACHE_DURATION_MS

        ) {

            return cachedHealth;

        }

        const positions =
            await loadPortfolioData();

        const metrics =
            calculateMetrics(
                positions
            );

        const healthScore =
            calculateHealthScore(
                metrics
            );

        const risk =
            calculatePortfolioRisk(
                metrics
            );

        const stability =
            calculatePortfolioStability(
                metrics
            );

        const aiHealth =
            calculateAIHealth({

                healthScore,

                stability,

                risk

            });

        const status =
            classifyHealth(
                healthScore
            );

        const result = {

            generatedAt:
                new Date(),

            positions:
                positions.length,

            metrics,

            healthScore,

            stability,

            risk,

            aiHealth,

            status

        };

        cachedHealth =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
PORTFOLIO HEALTH ENGINE
==================================

Health Score:
${healthScore}

AI Health:
${aiHealth}

Risk:
${risk}

Stability:
${stability}

Status:
${status}

==================================
`);

        return result;

    }

    catch (err) {

        console.log(`
==================================
PORTFOLIO HEALTH ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            positions: 0,

            metrics: {},

            healthScore: 0,

            stability: 0,

            risk: 100,

            aiHealth: 0,

            status: "UNKNOWN"

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearPortfolioHealthCache() {

    cachedHealth = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzePortfolioHealth,

    clearPortfolioHealthCache,

    calculateMetrics,

    calculateHealthScore,

    calculatePortfolioRisk,

    calculatePortfolioStability,

    calculateAIHealth,

    classifyHealth

};
