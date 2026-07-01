/*
==================================================
OPPORTUNITY FUSION ENGINE
Version 1.0
==================================================
*/

function normalize(score) {

    if (!Number.isFinite(score))
        return 0;

    return Math.max(
        0,
        Math.min(
            100,
            score
        )
    );

}

function fuseOpportunity({

    opportunity,

    symbolScore = 50,

    confidence = 50,

    reinforcement = 50,

    discovery = 50,

    portfolio = 50,

}) {

    const scores = {

        opportunity:
            normalize(
                opportunity
                    ?.opportunityScore
            ),

        symbol:
            normalize(
                symbolScore
            ),

        confidence:
            normalize(
                confidence
            ),

        reinforcement:
            normalize(
                reinforcement
            ),

        discovery:
            normalize(
                discovery
            ),

        portfolio:
            normalize(
                portfolio
            )

    };

    const finalScore =

        scores.opportunity * 0.35 +

        scores.symbol * 0.20 +

        scores.confidence * 0.15 +

        scores.discovery * 0.15 +

        scores.reinforcement * 0.10 +

        scores.portfolio * 0.05;

    return {

        symbol:
            opportunity.symbol,

        finalScore:
            Number(
                finalScore.toFixed(2)
            ),

        confidence:
            scores.confidence,

        scores,

        classification:

            finalScore >= 90

                ? "EXCEPTIONAL"

            : finalScore >= 80

                ? "ELITE"

            : finalScore >= 70

                ? "HIGH"

            : finalScore >= 55

                ? "MEDIUM"

            : "LOW"

    };

}

module.exports = {

    fuseOpportunity,

};
