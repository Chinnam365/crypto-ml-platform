const pool = require("../db/db");

/*
==================================================
PORTFOLIO INTELLIGENCE V3
==================================================
Master AI Portfolio Engine

Part 1
- Portfolio Loading
- Portfolio Health
- Capital Utilization
- Cache
==================================================
*/

let cachedPortfolio = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
LOAD OPEN POSITIONS
==================================================
*/

async function loadOpenPositions() {

    const result = await pool.query(`
        SELECT
            id,
            symbol,
            side,
            quantity,
            entry_price,
            current_price,
            pnl,
            confidence,
            created_at
        FROM positions
        WHERE status = 'OPEN'
        ORDER BY created_at ASC
    `);

    return result.rows;
}

/*
==================================================
PORTFOLIO METRICS
==================================================
*/

function calculatePortfolioMetrics(positions = []) {

    const metrics = {

        totalPositions: positions.length,

        winningPositions: 0,

        losingPositions: 0,

        totalPnL: 0,

        averageConfidence: 0,

        averageAgeHours: 0,

        totalCapital: 0

    };

    if (positions.length === 0) {

        return metrics;

    }

    let confidenceTotal = 0;
    let ageTotal = 0;

    const now = Date.now();

    for (const position of positions) {

        const pnl =
            Number(position.pnl || 0);

        metrics.totalPnL += pnl;

        if (pnl > 0) {

            metrics.winningPositions++;

        }
        else if (pnl < 0) {

            metrics.losingPositions++;

        }

        confidenceTotal +=
            Number(position.confidence || 0);

        const ageHours =

            (
                now -
                new Date(position.created_at).getTime()
            ) / 3600000;

        ageTotal += ageHours;

        metrics.totalCapital +=

            Number(position.quantity || 0) *

            Number(position.entry_price || 0);

    }

    metrics.averageConfidence =

        Number(

            (
                confidenceTotal /
                positions.length
            ).toFixed(2)

        );

    metrics.averageAgeHours =

        Number(

            (
                ageTotal /
                positions.length
            ).toFixed(2)

        );

    metrics.totalPnL =

        Number(
            metrics.totalPnL.toFixed(2)
        );

    metrics.totalCapital =

        Number(
            metrics.totalCapital.toFixed(2)
        );

    return metrics;

}

/*
==================================================
PORTFOLIO HEALTH
==================================================
*/

function calculatePortfolioHealth(metrics) {

    let score = 100;

    score += metrics.totalPnL * 0.20;

    score -= metrics.losingPositions * 2;

    score += metrics.winningPositions * 2;

    score +=

        (
            metrics.averageConfidence - 50
        ) * 0.30;

    score =

        Math.max(
            0,
            Math.min(
                Number(score.toFixed(2)),
                100
            )
        );

    return {

        score,

        status:

            score >= 80
                ? "EXCELLENT"

            : score >= 65
                ? "GOOD"

            : score >= 50
                ? "STABLE"

            : score >= 35
                ? "WARNING"

            : "CRITICAL"

    };

}

/*
==================================================
MAIN ENGINE
==================================================
*/

async function analyzePortfolio() {

    try {

        const now = Date.now();

        if (

            cachedPortfolio &&

            (now - cacheTimestamp) < CACHE_DURATION_MS

        ) {

            return cachedPortfolio;

        }

        const positions =
            await loadOpenPositions();

        const metrics =
            calculatePortfolioMetrics(
                positions
            );

        const health =
            calculatePortfolioHealth(
                metrics
            );

        const result = {

            generatedAt:
                new Date(),

            positions,

            metrics,

            health

        };

        cachedPortfolio = result;

        cacheTimestamp = now;

        return result;

    }

    catch (err) {

        console.log(`
==================================
PORTFOLIO INTELLIGENCE ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            positions: [],

            metrics: {},

            health: {

                score: 0,

                status: "UNKNOWN"

            }

        };

    }

}
