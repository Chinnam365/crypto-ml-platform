const pool = require("../db/db");

/*
==================================================
EXPOSURE MANAGER
==================================================
PHASE 5
PART 1
==================================================
*/

let cachedExposure = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
LOAD OPEN POSITIONS
==================================================
*/

async function loadPositions() {

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
    `);

    return result.rows;

}

/*
==================================================
SYMBOL EXPOSURE
==================================================
*/

function calculateExposure(
    positions = []
) {

    const exposure = {};

    let portfolioValue = 0;

    for (const position of positions) {

        const value =

            Number(position.quantity || 0) *

            Number(
                position.current_price ||
                position.entry_price ||
                0
            );

        portfolioValue += value;

        exposure[position.symbol] =

            (exposure[position.symbol] || 0)

            + value;

    }

    Object.keys(exposure).forEach(symbol => {

        exposure[symbol] = {

            value:
                Number(
                    exposure[symbol].toFixed(2)
                ),

            percentage: 0

        };

    });

    Object.keys(exposure).forEach(symbol => {

        exposure[symbol].percentage =

            portfolioValue === 0

                ? 0

                : Number(

                    (

                        exposure[symbol].value /

                        portfolioValue *

                        100

                    ).toFixed(2)

                );

    });

    return {

        portfolioValue:
            Number(
                portfolioValue.toFixed(2)
            ),

        exposure

    };

}

/*
==================================================
CONCENTRATION
==================================================
*/

function calculateConcentration(
    exposure
) {

    let highest = 0;

    let dominantSymbol = null;

    for (

        const symbol of

        Object.keys(
            exposure.exposure
        )

    ) {

        if (

            exposure.exposure[symbol]
                .percentage >

            highest

        ) {

            highest =

                exposure.exposure[symbol]
                    .percentage;

            dominantSymbol =
                symbol;

        }

    }

    return {

        dominantSymbol,

        concentration:
            Number(
                highest.toFixed(2)
            )

    };

}
/*
==================================================
EXPOSURE RISK SCORE
==================================================
*/

function calculateExposureRisk(
    concentration
) {

    let score = 100;

    score -=
        concentration.concentration;

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
DIVERSIFICATION SCORE
==================================================
*/

function calculateDiversification(
    exposure
) {

    const symbols =
        Object.keys(
            exposure.exposure
        );

    if (symbols.length === 0) {

        return 0;

    }

    const equalWeight =

        100 /
        symbols.length;

    let deviation = 0;

    for (const symbol of symbols) {

        deviation += Math.abs(

            exposure.exposure[symbol]
                .percentage -

            equalWeight

        );

    }

    let score =

        100 -

        (

            deviation /

            symbols.length

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
PORTFOLIO EXPOSURE STATUS
==================================================
*/

function classifyExposure(
    concentration
) {

    const value =
        concentration.concentration;

    if (value >= 70) {

        return "CRITICAL";

    }

    if (value >= 50) {

        return "HIGH";

    }

    if (value >= 35) {

        return "MODERATE";

    }

    return "BALANCED";

}

/*
==================================================
AI EXPOSURE SCORE
==================================================
*/

function calculateExposureAI({

    diversification,

    exposureRisk

}) {

    const score =

        (

            diversification *
            0.60 +

            exposureRisk *
            0.40

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

async function analyzeExposure() {

    try {

        const now = Date.now();

        if (

            cachedExposure &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedExposure;

        }

        const positions =
            await loadPositions();

        const exposure =
            calculateExposure(
                positions
            );

        const concentration =
            calculateConcentration(
                exposure
            );

        const exposureRisk =
            calculateExposureRisk(
                concentration
            );

        const diversification =
            calculateDiversification(
                exposure
            );

        const status =
            classifyExposure(
                concentration
            );

        const aiScore =
            calculateExposureAI({

                diversification,

                exposureRisk

            });

        const result = {

            generatedAt:
                new Date(),

            portfolioValue:
                exposure.portfolioValue,

            symbols:
                Object.keys(
                    exposure.exposure
                ).length,

            exposure:
                exposure.exposure,

            concentration,

            diversification,

            exposureRisk,

            aiScore,

            status

        };

        cachedExposure =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
EXPOSURE MANAGER
==================================

Portfolio Value:
${result.portfolioValue}

Symbols:
${result.symbols}

Dominant Symbol:
${concentration.dominantSymbol}

Concentration:
${concentration.concentration}%

Diversification:
${diversification}

Exposure Risk:
${exposureRisk}

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
EXPOSURE MANAGER ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            portfolioValue: 0,

            symbols: 0,

            exposure: {},

            concentration: {

                dominantSymbol: null,

                concentration: 0

            },

            diversification: 0,

            exposureRisk: 100,

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

function clearExposureCache() {

    cachedExposure = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeExposure,

    clearExposureCache,

    calculateExposure,

    calculateConcentration,

    calculateExposureRisk,

    calculateDiversification,

    classifyExposure,

    calculateExposureAI

};
