/*
==================================================
OPPORTUNITY INTELLIGENCE V2
Version 2.0
==================================================
*/

function scoreLiquidity(coin) {

    const volume =
        Number(coin.quoteVolume || 0);

    if (volume >= 50000000) return 100;
    if (volume >= 20000000) return 90;
    if (volume >= 10000000) return 80;
    if (volume >= 5000000) return 70;
    if (volume >= 1000000) return 60;

    return 30;
}

function scoreMomentum(coin) {

    const change =
        Number(coin.priceChange || 0);

    if (change >= 15) return 100;
    if (change >= 10) return 90;
    if (change >= 6) return 80;
    if (change >= 3) return 70;
    if (change >= 0) return 60;
    if (change >= -3) return 45;

    return 20;
}

function scoreActivity(coin) {

    const trades =
        Number(coin.trades || 0);

    if (trades >= 200000) return 100;
    if (trades >= 100000) return 90;
    if (trades >= 50000) return 80;
    if (trades >= 25000) return 70;
    if (trades >= 10000) return 60;

    return 40;
}

function scoreVolatility(coin) {

    const move =
        Math.abs(
            Number(
                coin.priceChange || 0
            )
        );

    if (move >= 20) return 100;
    if (move >= 15) return 90;
    if (move >= 10) return 80;
    if (move >= 5) return 70;

    return 50;
}

function evaluateOpportunity(coin) {

    const liquidity =
        scoreLiquidity(coin);

    const momentum =
        scoreMomentum(coin);

    const activity =
        scoreActivity(coin);

    const volatility =
        scoreVolatility(coin);

    const opportunityScore =

        liquidity * 0.30 +

        momentum * 0.30 +

        activity * 0.20 +

        volatility * 0.20;

    const reasons = [];

    if (liquidity >= 80)
        reasons.push(
            "High liquidity"
        );

    if (momentum >= 80)
        reasons.push(
            "Strong momentum"
        );

    if (activity >= 80)
        reasons.push(
            "Heavy market activity"
        );

    if (volatility >= 80)
        reasons.push(
            "Volatility expansion"
        );

    return {

        symbol:
            coin.symbol,

        opportunityScore:
            Number(
                opportunityScore.toFixed(2)
            ),

        liquidity,

        momentum,

        activity,

        volatility,

        classification:

            opportunityScore >= 85

                ? "ELITE"

            : opportunityScore >= 70

                ? "HIGH"

            : opportunityScore >= 55

                ? "MEDIUM"

            : "LOW",

        reasons,

    };

}

function evaluateMarket(scannerData = []) {

    return scannerData

        .map(
            evaluateOpportunity
        )

        .sort(
            (a, b) =>

                b.opportunityScore -

                a.opportunityScore
        );

}

module.exports = {

    evaluateOpportunity,

    evaluateMarket,

};
