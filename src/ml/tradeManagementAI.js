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
/*
==========================================
DECISION PRIORITY
==========================================
*/

const evaluations = [

    emergencyEvaluation(
        decision,
        confidence,
        drawdown
    ),

    momentumEvaluation(
        decision,
        momentum,
        pnlPercent
    ),

    profitProtectionEvaluation(
        decision,
        pnlPercent,
        trend,
        currentPrice,
        position
    ),

    timeEvaluation(
        decision,
        position,
        pnlPercent
    )

];

const highestPriority = evaluations
    .filter(Boolean)
    .sort(
        (a, b) =>
            b.priority - a.priority
    )[0];

if (highestPriority) {

    return highestPriority;

}

return decision;
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
PARTIAL PROFIT
==========================================
*/

if (

    pnlPercent >= 5 &&

    confidence >= 70 &&

    confidence < 85

) {

    decision.action =

        "PARTIAL_EXIT";

    decision.partialExit = 25;

    decision.reason =

        "Secure partial profits";

}

/*
==========================================
TRAILING STOP
==========================================
*/

if (

    pnlPercent >= 6 &&

    trend === "BULLISH"

) {

    decision.action =

        "MOVE_STOP";

    decision.newStopLoss =

        currentPrice * 0.985;

    decision.reason =

        "Activate trailing stop";

}

/*
==========================================
MOMENTUM WEAKENING
==========================================
*/

if (

    momentum ===

    "BEARISH_ACCELERATION" &&

    pnlPercent > 2

) {

    decision.action =

        "EXIT";

    decision.reason =

        "Momentum reversal detected";

    decision.urgency =

        "HIGH";

}

/*
==========================================
TIME BASED EXIT
==========================================
*/

if (

    position.opened_at

) {

    const hoursOpen =

        (Date.now() -

        new Date(

            position.opened_at

        ).getTime())

        / 3600000;

    decision.hoursOpen =

        Number(

            hoursOpen.toFixed(2)

        );

    if (

        hoursOpen >= 48 &&

        pnlPercent < 1

    ) {

        decision.action =

            "EXIT";

        decision.reason =

            "Trade stalled";

    }

}

/*
==========================================
VOLATILITY PROTECTION
==========================================
*/

if (

    volatility >= 8 &&

    pnlPercent > 3

) {

    decision.action =

        "MOVE_STOP";

    decision.newStopLoss =

        currentPrice * 0.99;

    decision.reason =

        "High volatility protection";

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
function emergencyEvaluation(
    decision,
    confidence,
    drawdown
) {

    if (

        confidence < 35 ||

        drawdown?.riskMode === "EMERGENCY"

    ) {

        return {

            ...decision,

            action: "EXIT",

            urgency: "CRITICAL",

            reason: "Emergency risk"

        };

    }

    return null;

}

function momentumEvaluation(
    decision,
    momentum,
    pnlPercent
) {

    if (

        momentum === "BEARISH_ACCELERATION" &&

        pnlPercent > 2

    ) {

        return {

            ...decision,

            action: "EXIT",

            priority: 90,

            reason: "Momentum reversal"

        };

    }

    return null;

}

function profitProtectionEvaluation(
    decision,
    pnlPercent,
    trend,
    currentPrice,
    position
) {

    if (

        pnlPercent >= 6 &&

        trend === "BULLISH"

    ) {

        return {

            ...decision,

            action: "MOVE_STOP",

            priority: 70,

            newStopLoss:
                currentPrice * 0.985,

            reason:
                "Protect profits"

        };

    }

    return null;

}

function timeEvaluation(
    decision,
    position,
    pnlPercent
) {

    if (!position.opened_at) {

        return null;

    }

    const hours =

        (Date.now() -

        new Date(
            position.opened_at
        ).getTime())

        / 3600000;

    if (

        hours > 48 &&

        pnlPercent < 1

    ) {

        return {

            ...decision,

            action: "EXIT",

            priority: 40,

            reason:
                "Trade stalled"

        };

    }

    return null;

}
module.exports = {

    evaluateTradeManagement,

};
