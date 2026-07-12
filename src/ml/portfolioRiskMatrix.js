/*
==================================================
PORTFOLIO RISK MATRIX
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

const {
    analyzePortfolioHealth
} = require("./portfolioHealthEngine");

let cachedRiskMatrix = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
RISK COMPONENTS
==================================================
*/

function buildRiskComponents({

    exposure,

    correlation,

    health

}) {

    return {

        exposureRisk:
            Number(
                exposure.exposureRisk || 0
            ),

        correlationRisk:
            Number(
                correlation.correlationRisk || 0
            ),

        portfolioRisk:
            Number(
                health.risk || 0
            )

    };

}

/*
==================================================
OVERALL RISK SCORE
==================================================
*/

function calculateRiskScore(
    components
) {

    const score =

        (

            components.exposureRisk * 0.35 +

            components.correlationRisk * 0.35 +

            components.portfolioRisk * 0.30

        );

    return Number(
        score.toFixed(2)
    );

}

/*
==================================================
RISK CLASSIFICATION
==================================================
*/

function classifyRisk(
    score
) {

    if (score >= 80) {

        return "CRITICAL";

    }

    if (score >= 65) {

        return "HIGH";

    }

    if (score >= 45) {

        return "MODERATE";

    }

    return "LOW";

}
/*
==================================================
AI RISK SCORE
==================================================
*/

function calculateAIRiskScore({

    riskScore,

    health

}) {

    const aiScore =

        (

            riskScore * 0.70 +

            (100 - Number(health.healthScore || 0)) * 0.30

        );

    return Number(
        aiScore.toFixed(2)
    );

}

/*
==================================================
PORTFOLIO RECOMMENDATION
==================================================
*/

function generateRiskRecommendation(
    classification
) {

    switch (classification) {

        case "CRITICAL":

            return "REDUCE_POSITIONS";

        case "HIGH":

            return "REDUCE_EXPOSURE";

        case "MODERATE":

            return "MONITOR";

        default:

            return "NORMAL";

    }

}

/*
==================================================
RISK MATRIX
==================================================
*/

function buildRiskMatrix({

    exposure,

    correlation,

    health,

    components,

    riskScore,

    aiRiskScore,

    classification,

    recommendation

}) {

    return {

        generatedAt:
            new Date(),

        exposure,

        correlation,

        health,

        components,

        riskScore,

        aiRiskScore,

        classification,

        recommendation

    };

}
/*
==================================================
MAIN ENGINE
==================================================
*/

async function analyzePortfolioRiskMatrix() {

    try {

        const now = Date.now();

        if (

            cachedRiskMatrix &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedRiskMatrix;

        }

        const exposure =
            await analyzeExposure();

        const correlation =
            await analyzeCorrelation();

        const health =
            await analyzePortfolioHealth();

        const components =
            buildRiskComponents({

                exposure,

                correlation,

                health

            });

        const riskScore =
            calculateRiskScore(
                components
            );

        const classification =
            classifyRisk(
                riskScore
            );

        const aiRiskScore =
            calculateAIRiskScore({

                riskScore,

                health

            });

        const recommendation =
            generateRiskRecommendation(
                classification
            );

        const result =
            buildRiskMatrix({

                exposure,

                correlation,

                health,

                components,

                riskScore,

                aiRiskScore,

                classification,

                recommendation

            });

        cachedRiskMatrix =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
PORTFOLIO RISK MATRIX
==================================

Risk Score:
${riskScore}

AI Risk Score:
${aiRiskScore}

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
PORTFOLIO RISK MATRIX ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            exposure: {},

            correlation: {},

            health: {},

            components: {},

            riskScore: 100,

            aiRiskScore: 100,

            classification: "UNKNOWN",

            recommendation: "UNKNOWN"

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearPortfolioRiskMatrixCache() {

    cachedRiskMatrix = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzePortfolioRiskMatrix,

    clearPortfolioRiskMatrixCache,

    buildRiskComponents,

    calculateRiskScore,

    calculateAIRiskScore,

    classifyRisk,

    generateRiskRecommendation,

    buildRiskMatrix

};
