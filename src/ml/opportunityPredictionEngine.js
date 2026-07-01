/*
==================================================
OPPORTUNITY PREDICTION ENGINE
Version 1.0
==================================================
*/

function clamp(value, min = 0, max = 100) {

    if (!Number.isFinite(value)) {

        return 0;

    }

    return Math.max(min, Math.min(max, value));

}

function predictOpportunity({

    fusionScore = 50,

    liquidity = 50,

    momentum = 50,

    volatility = 50,

    confidence = 50,

    discovery = 50,

    reinforcement = 50,

    trend = "SIDEWAYS",

}) {

    let probability =

        fusionScore * 0.30 +

        liquidity * 0.15 +

        momentum * 0.15 +

        volatility * 0.10 +

        confidence * 0.15 +

        discovery * 0.10 +

        reinforcement * 0.05;

    if (trend === "BULLISH") {

        probability += 5;

    }

    if (trend === "BEARISH") {

        probability -= 5;

    }

    probability = clamp(probability);

    return {

        probability:
            Number(probability.toFixed(2)),

        confidenceLevel:

            probability >= 90

                ? "VERY_HIGH"

            : probability >= 80

                ? "HIGH"

            : probability >= 65

                ? "MEDIUM"

            : probability >= 50

                ? "LOW"

            : "VERY_LOW",

        shouldTrade:

            probability >= 75,

        explanation: [

            `Fusion Score: ${fusionScore}`,

            `Momentum: ${momentum}`,

            `Liquidity: ${liquidity}`,

            `Confidence: ${confidence}`

        ]

    };

}

module.exports = {

    predictOpportunity,

};
