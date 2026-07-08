function calculateRSI(
    closes,
    period = 14
) {

    if (!Array.isArray(closes)) {
        return 50;
    }

    const prices = closes
        .map(Number)
        .filter(Number.isFinite);

    if (prices.length < period + 1) {
        return 50;
    }

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {

        const change =
            prices[i] - prices[i - 1];

        if (change > 0) {
            gains += change;
        } else {
            losses -= change;
        }
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    for (let i = period + 1; i < prices.length; i++) {

        const change =
            prices[i] - prices[i - 1];

        const gain =
            change > 0 ? change : 0;

        const loss =
            change < 0 ? -change : 0;

        avgGain =
            (
                (avgGain * (period - 1))
                + gain
            ) / period;

        avgLoss =
            (
                (avgLoss * (period - 1))
                + loss
            ) / period;
    }

    if (avgLoss === 0) {
        return 100;
    }

    if (avgGain === 0) {
        return 0;
    }

    const rs =
        avgGain / avgLoss;

    const rsi =
        100 -
        (
            100 /
            (1 + rs)
        );

    if (!Number.isFinite(rsi)) {
        return 50;
    }

    return Number(
        rsi.toFixed(2)
    );

}

module.exports = {
    calculateRSI,
};
