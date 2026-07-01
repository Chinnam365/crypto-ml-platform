/*
==================================================
AI DECISION TYPES
Version 1.0
==================================================
*/

const ACTIONS = Object.freeze({

    HOLD: "HOLD",

    MOVE_STOP: "MOVE_STOP",

    EXTEND_TARGET: "EXTEND_TARGET",

    PARTIAL_EXIT: "PARTIAL_EXIT",

    EXIT: "EXIT",

    EMERGENCY_EXIT: "EMERGENCY_EXIT",

});

const PRIORITY = Object.freeze({

    HOLD: 50,

    EXTEND_TARGET: 60,

    MOVE_STOP: 70,

    PARTIAL_EXIT: 80,

    EXIT: 90,

    EMERGENCY_EXIT: 100,

});

function createDecision({

    source,

    action,

    confidence = 0,

    explanation = [],

    metadata = {}

}) {

    return {

        source,

        action,

        priority:

            PRIORITY[action] || 0,

        confidence,

        explanation,

        metadata,

        timestamp:

            new Date().toISOString(),

    };

}

function isValidDecision(decision) {

    if (!decision) {

        return false;

    }

    if (!decision.source) {

        return false;

    }

    if (!decision.action) {

        return false;

    }

    if (

        !Object.values(ACTIONS)

        .includes(decision.action)

    ) {

        return false;

    }

    return true;

}

module.exports = {

    ACTIONS,

    PRIORITY,

    createDecision,

    isValidDecision,

};
