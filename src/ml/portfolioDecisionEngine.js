/*
==================================================
PORTFOLIO DECISION ENGINE
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

const {
    analyzeCorrelation
} = require("./correlationEngine");

const {
    analyzeCapitalRotation
} = require("./dynamicCapitalRotation");

const {
    analyzeReserveCapital
} = require("./reserveCapitalManager");

let cachedDecision = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
BUILD DECISION INPUT
==================================================
*/

function buildDecisionInput({

    health,

    exposure,

    correlation,

    rotation,

    reserve

}) {

    return {

        portfolioHealth:
            Number(
                health.healthScore || 0
            ),

        exposureRisk:
            Number(
                exposure.exposureRisk || 0
            ),

        diversification:
            Number(
                exposure.diversification || 0
            ),

        correlationRisk:
            Number(
                correlation.correlationRisk || 0
            ),

        reserveScore:
            Number(
                reserve.reserveScore || 0
            ),

        rotationScore:

            rotation.topRotation.length > 0

                ?

                Number(

                    rotation.topRotation[0]
                        .adjustedScore || 0

                )

                : 0

    };

}

/*
==================================================
PORTFOLIO SCORE
==================================================
*/

function calculatePortfolioDecisionScore(
    input
) {

    const score =

        (

            input.portfolioHealth * 0.25 +

            (100 - input.exposureRisk) * 0.20 +

            input.diversification * 0.15 +

            (100 - input.correlationRisk) * 0.15 +

            input.reserveScore * 0.10 +

            input.rotationScore * 0.15

        );

    return Number(
        score.toFixed(2)
    );

}
/*
==================================================
PORTFOLIO DECISION
==================================================
*/

function determineDecision(
    score
) {

    if (score >= 90) {

        return "AGGRESSIVE_BUY";

    }

    if (score >= 75) {

        return "BUY";

    }

    if (score >= 60) {

        return "ACCUMULATE";

    }

    if (score >= 45) {

        return "HOLD";

    }

    if (score >= 30) {

        return "REDUCE";

    }

    return "DEFENSIVE";

}

/*
==================================================
PORTFOLIO CONFIDENCE
==================================================
*/

function calculateDecisionConfidence(
    input
) {

    const confidence =

        (

            input.portfolioHealth * 0.30 +

            input.reserveScore * 0.20 +

            (100 - input.exposureRisk) * 0.20 +

            (100 - input.correlationRisk) * 0.15 +

            input.rotationScore * 0.15

        );

    return Number(
        confidence.toFixed(2)
    );

}

/*
==================================================
PORTFOLIO RECOMMENDATION
==================================================
*/

function generateRecommendation(
    decision,
    confidence
) {

    return {

        action:
            decision,

        confidence,

        allowNewPositions:

            confidence >= 60 &&

            (
                decision === "BUY" ||

                decision === "ACCUMULATE" ||

                decision === "AGGRESSIVE_BUY"

            ),

        reduceExposure:

            decision === "REDUCE" ||

            decision === "DEFENSIVE"

    };

}
/*
==================================================
MAIN ENGINE
==================================================
*/

async function analyzePortfolioDecision() {

    try {

        const now = Date.now();

        if (

            cachedDecision &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedDecision;

        }

        const health =
            await analyzePortfolioHealth();

        const exposure =
            await analyzeExposure();

        const correlation =
            await analyzeCorrelation();

        const rotation =
            await analyzeCapitalRotation();

        const reserve =
            await analyzeReserveCapital();

        const input =
            buildDecisionInput({

                health,

                exposure,

                correlation,

                rotation,

                reserve

            });

        const decisionScore =
            calculatePortfolioDecisionScore(
                input
            );

        const decision =
            determineDecision(
                decisionScore
            );

        const confidence =
            calculateDecisionConfidence(
                input
            );

        const recommendation =
            generateRecommendation(

                decision,

                confidence

            );

        const result = {

            generatedAt:
                new Date(),

            input,

            decisionScore,

            decision,

            confidence,

            recommendation,

            health,

            exposure,

            correlation,

            rotation,

            reserve

        };

        cachedDecision =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
PORTFOLIO DECISION ENGINE
==================================

Decision Score:
${decisionScore}

Decision:
${decision}

Confidence:
${confidence}

Allow New Positions:
${recommendation.allowNewPositions}

Reduce Exposure:
${recommendation.reduceExposure}

==================================
`);

        return result;

    }

    catch (err) {

        console.log(`
==================================
PORTFOLIO DECISION ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            input: {},

            decisionScore: 0,

            decision: "UNKNOWN",

            confidence: 0,

            recommendation: {

                action: "UNKNOWN",

                confidence: 0,

                allowNewPositions: false,

                reduceExposure: false

            }

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearPortfolioDecisionCache() {

    cachedDecision = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzePortfolioDecision,

    clearPortfolioDecisionCache,

    buildDecisionInput,

    calculatePortfolioDecisionScore,

    determineDecision,

    calculateDecisionConfidence,

    generateRecommendation

};
