/*
==================================================
DIVERSIFICATION AI
==================================================
PHASE 5
PART 1
==================================================
*/

const {
    analyzeExposure
} = require("./exposureManager");

const {
    analyzeCorrelation
} = require("./correlationEngine");

let cachedDiversification = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
DIVERSIFICATION SCORE
==================================================
*/

function calculateDiversificationScore({

    exposure,

    correlation

}) {

    const score =

        (

            exposure.diversification * 0.55 +

            correlation.diversification * 0.45

        );

    return Number(
        score.toFixed(2)
    );

}

/*
==================================================
CONCENTRATION PENALTY
==================================================
*/

function calculateConcentrationPenalty(
    concentration
) {

    let penalty = 0;

    if (

        concentration >= 80

    ) {

        penalty = 40;

    }

    else if (

        concentration >= 60

    ) {

        penalty = 25;

    }

    else if (

        concentration >= 40

    ) {

        penalty = 10;

    }

    return penalty;

}

/*
==================================================
SYMBOL BALANCE
==================================================
*/

function calculateSymbolBalance(
    symbolCount
) {

    if (symbolCount >= 10) {

        return 100;

    }

    if (symbolCount >= 7) {

        return 85;

    }

    if (symbolCount >= 5) {

        return 70;

    }

    if (symbolCount >= 3) {

        return 50;

    }

    return 25;

}
/*
==================================================
AI DIVERSIFICATION SCORE
==================================================
*/

function calculateAIScore({

    diversificationScore,

    concentrationPenalty,

    symbolBalance

}) {

    let score =

        diversificationScore -

        concentrationPenalty +

        (symbolBalance * 0.20);

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
DIVERSIFICATION STATUS
==================================================
*/

function classifyDiversification(
    score
) {

    if (score >= 90) {

        return "EXCELLENT";

    }

    if (score >= 75) {

        return "GOOD";

    }

    if (score >= 60) {

        return "BALANCED";

    }

    if (score >= 40) {

        return "POOR";

    }

    return "CRITICAL";

}

/*
==================================================
PORTFOLIO RECOMMENDATION
==================================================
*/

function generateRecommendation({

    score,

    concentrationPenalty,

    symbolBalance

}) {

    if (concentrationPenalty >= 40) {

        return "REDUCE_CONCENTRATION";

    }

    if (symbolBalance < 50) {

        return "ADD_DIVERSIFICATION";

    }

    if (score >= 80) {

        return "MAINTAIN_PORTFOLIO";

    }

    if (score >= 60) {

        return "MONITOR";

    }

    return "REBALANCE";

}
/*
==================================================
MAIN ENGINE
==================================================
*/

async function analyzeDiversification() {

    try {

        const now = Date.now();

        if (

            cachedDiversification &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedDiversification;

        }

        const exposure =
            await analyzeExposure();

        const correlation =
            await analyzeCorrelation();

        const diversificationScore =
            calculateDiversificationScore({

                exposure,

                correlation

            });

        const concentrationPenalty =
            calculateConcentrationPenalty(

                exposure.concentration
                    .concentration

            );

        const symbolBalance =
            calculateSymbolBalance(

                exposure.symbols

            );

        const aiScore =
            calculateAIScore({

                diversificationScore,

                concentrationPenalty,

                symbolBalance

            });

        const recommendation =
            generateRecommendation({

                score: aiScore,

                concentrationPenalty,

                symbolBalance

            });

        const status =
            classifyDiversification(
                aiScore
            );

        const result = {

            generatedAt:
                new Date(),

            diversificationScore,

            concentrationPenalty,

            symbolBalance,

            aiScore,

            recommendation,

            status,

            exposure,

            correlation

        };

        cachedDiversification =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
DIVERSIFICATION AI
==================================

Diversification:
${diversificationScore}

Penalty:
${concentrationPenalty}

Balance:
${symbolBalance}

AI Score:
${aiScore}

Recommendation:
${recommendation}

Status:
${status}

==================================
`);

        return result;

    }

    catch (err) {

        console.log(`
==================================
DIVERSIFICATION AI ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            diversificationScore: 0,

            concentrationPenalty: 100,

            symbolBalance: 0,

            aiScore: 0,

            recommendation: "UNKNOWN",

            status: "UNKNOWN",

            exposure: {},

            correlation: {}

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearDiversificationCache() {

    cachedDiversification = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeDiversification,

    clearDiversificationCache,

    calculateDiversificationScore,

    calculateConcentrationPenalty,

    calculateSymbolBalance,

    calculateAIScore,

    classifyDiversification,

    generateRecommendation

};
