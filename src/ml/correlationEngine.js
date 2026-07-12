const pool = require("../db/db");

/*
==================================================
CORRELATION ENGINE
==================================================
PHASE 5
PART 1
==================================================
*/

let cachedCorrelation = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
LOAD OPEN POSITIONS
==================================================
*/

async function loadPortfolioSymbols() {

    const result = await pool.query(`
        SELECT
            symbol,
            quantity,
            entry_price,
            current_price,
            pnl,
            confidence
        FROM positions
        WHERE status='OPEN'
        ORDER BY symbol
    `);

    return result.rows;

}

/*
==================================================
BUILD SYMBOL MATRIX
==================================================
*/

function buildCorrelationMatrix(
    positions = []
) {

    const matrix = {};

    for (const position of positions) {

        matrix[position.symbol] = {};

    }

    for (const a of positions) {

        for (const b of positions) {

            if (a.symbol === b.symbol) {

                matrix[a.symbol][b.symbol] = 1;

                continue;

            }

            const confidenceDiff =

                Math.abs(

                    Number(a.confidence || 50) -

                    Number(b.confidence || 50)

                );

            const pnlDiff =

                Math.abs(

                    Number(a.pnl || 0) -

                    Number(b.pnl || 0)

                );

            let similarity =

                100 -

                (confidenceDiff * 0.5) -

                (pnlDiff * 2);

            similarity = Math.max(
                0,
                Math.min(
                    Number(similarity.toFixed(2)),
                    100
                )
            );

            matrix[a.symbol][b.symbol] =
                similarity;

        }

    }

    return matrix;

}

/*
==================================================
AVERAGE CORRELATION
==================================================
*/

function calculateAverageCorrelation(
    matrix = {}
) {

    let total = 0;

    let count = 0;

    for (const symbol of Object.keys(matrix)) {

        for (const other of Object.keys(matrix[symbol])) {

            if (symbol === other) {

                continue;

            }

            total +=
                Number(
                    matrix[symbol][other] || 0
                );

            count++;

        }

    }

    return count === 0

        ? 0

        : Number(
            (
                total /
                count
            ).toFixed(2)
        );

}
/*
==================================================
CORRELATION RISK
==================================================
*/

function calculateCorrelationRisk(
    averageCorrelation
) {

    let risk =

        averageCorrelation;

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
DIVERSIFICATION SCORE
==================================================
*/

function calculateDiversificationScore(
    averageCorrelation
) {

    let score =

        100 -

        averageCorrelation;

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
CORRELATION STATUS
==================================================
*/

function classifyCorrelation(
    averageCorrelation
) {

    if (
        averageCorrelation >= 85
    ) {

        return "CRITICAL";

    }

    if (
        averageCorrelation >= 70
    ) {

        return "HIGH";

    }

    if (
        averageCorrelation >= 50
    ) {

        return "MODERATE";

    }

    return "LOW";

}

/*
==================================================
AI CORRELATION SCORE
==================================================
*/

function calculateCorrelationAI({

    diversification,

    correlationRisk

}) {

    const score =

        (

            diversification * 0.65 +

            (100 - correlationRisk) * 0.35

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

async function analyzeCorrelation() {

    try {

        const now = Date.now();

        if (

            cachedCorrelation &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedCorrelation;

        }

        const positions =
            await loadPortfolioSymbols();

        const matrix =
            buildCorrelationMatrix(
                positions
            );

        const averageCorrelation =
            calculateAverageCorrelation(
                matrix
            );

        const correlationRisk =
            calculateCorrelationRisk(
                averageCorrelation
            );

        const diversification =
            calculateDiversificationScore(
                averageCorrelation
            );

        const aiScore =
            calculateCorrelationAI({

                diversification,

                correlationRisk

            });

        const status =
            classifyCorrelation(
                averageCorrelation
            );

        const result = {

            generatedAt:
                new Date(),

            symbols:
                positions.length,

            matrix,

            averageCorrelation,

            correlationRisk,

            diversification,

            aiScore,

            status

        };

        cachedCorrelation =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
CORRELATION ENGINE
==================================

Symbols:
${positions.length}

Average Correlation:
${averageCorrelation}

Correlation Risk:
${correlationRisk}

Diversification:
${diversification}

AI Score:
${aiScore}

Status:
${status}

==================================
`);

        return result;

    }

    catch (err) {

        console.log(`
==================================
CORRELATION ENGINE ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            symbols: 0,

            matrix: {},

            averageCorrelation: 0,

            correlationRisk: 100,

            diversification: 0,

            aiScore: 0,

            status: "UNKNOWN"

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearCorrelationCache() {

    cachedCorrelation = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeCorrelation,

    clearCorrelationCache,

    buildCorrelationMatrix,

    calculateAverageCorrelation,

    calculateCorrelationRisk,

    calculateDiversificationScore,

    classifyCorrelation,

    calculateCorrelationAI

};
