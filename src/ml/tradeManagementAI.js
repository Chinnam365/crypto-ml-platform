/*
==================================================
TRADE MANAGEMENT AI
Version 1.0
==================================================
*/

function evaluateTradeManagement({

    position,

    currentPrice,

    confidence,

    trend,

    regime,

    volatility,

    momentum,

    multiTf,

    drawdown,

    portfolio,

}) {

    const decision = {

        action: "HOLD",

        confidence,

        reason: "Position healthy",

        newStopLoss: null,

        newTakeProfit: null,

        partialExit: 0,

        urgency: "LOW",

    };

    if (!position) {

        decision.action = "EXIT";

        decision.reason = "Missing position";

        decision.urgency = "CRITICAL";

        return decision;

    }

    if (

        !Number.isFinite(currentPrice) ||

        currentPrice <= 0

    ) {

        decision.action = "HOLD";

        decision.reason = "Invalid market price";

        decision.urgency = "HIGH";

        return decision;

    }

    const entryPrice =
        Number(position.entry_price);

    const side =
        position.side;

    let pnlPercent = 0;

    if (side === "BUY") {

        pnlPercent =
            ((currentPrice - entryPrice) /
                entryPrice) * 100;

    } else {

        pnlPercent =
            ((entryPrice - currentPrice) /
                entryPrice) * 100;

    }

    decision.pnlPercent =
        Number(
            pnlPercent.toFixed(2)
        );

    /*
    ==========================================
    BREAK EVEN
    ==========================================
    */

    if (

        pnlPercent >= 3 &&

        position.stop_loss <

        entryPrice

    ) {

        decision.action =

            "MOVE_STOP";

        decision.newStopLoss =

            entryPrice;

        decision.reason =

            "Move stop to break even";

        decision.urgency =

            "MEDIUM";
    }

    /*
    ==========================================
    BIG WINNER
    ==========================================
    */

    if (

        pnlPercent >= 8 &&

        confidence >= 80 &&

        trend === "BULLISH"

    ) {

        decision.action =

            "EXTEND_TARGET";

        decision.reason =

            "Strong trend still active";

        decision.newTakeProfit =

            position.take_profit * 1.20;

    }

    /*
    ==========================================
    EMERGENCY EXIT
    ==========================================
    */

    if (

        confidence < 35 ||

        drawdown?.riskMode ===

        "EMERGENCY"

    ) {

        decision.action =

            "EXIT";

        decision.reason =

            "Confidence collapsed";

        decision.urgency =

            "CRITICAL";

    }

    return decision;

}

module.exports = {

    evaluateTradeManagement,

};
