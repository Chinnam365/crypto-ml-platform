/*
==================================================
AI PLATFORM INFINITY
==================================================
PHASE 60
PART 1
==================================================
*/

const {
    runPlatformSupreme
} = require("./platformSupreme");

const {
    getPlatformStatus
} = require("./platformEntryPoint");

const {
    getControllerState
} = require("./runtimeController");

let infinityState = {

    initialized: false,

    active: false,

    cycles: 0,

    lastCycle: null,

    health: 100,

    status: "OFFLINE",

    history: []

};

const INFINITY_STAGES = [

    "Initialize Infinity",

    "Validate Platform",

    "Validate Runtime",

    "Platform Infinity Online"

];

/*
==================================================
LOGGER
==================================================
*/

function logInfinity(message) {

    console.log(`
==================================
AI PLATFORM INFINITY
==================================

${message}

==================================
`);

}

/*
==================================================
HEALTH
==================================================
*/

function calculateInfinityHealth() {

    const platform = getPlatformStatus();

    const controller = getControllerState();

    let score = 100;

    if (platform.status !== "ONLINE")
        score -= 40;

    if (!controller.initialized)
        score -= 20;

    if (controller.mode !== "AUTONOMOUS")
        score -= 20;

    infinityState.health = Math.max(score, 0);

    return infinityState.health;

}
/*
==================================================
INFINITY EXECUTION
==================================================
*/

async function startPlatformInfinity() {

    infinityState.status = "STARTING";

    logInfinity(
        INFINITY_STAGES[0]
    );

    const supreme =
        await runPlatformSupreme();

    infinityState.initialized =
        supreme.success;

    infinityState.cycles++;

    infinityState.lastCycle =
        new Date();

    logInfinity(
        INFINITY_STAGES[1]
    );

    const platform =
        getPlatformStatus();

    logInfinity(
        INFINITY_STAGES[2]
    );

    const controller =
        getControllerState();

    const health =
        calculateInfinityHealth();

    if (

        supreme.success &&

        health >= 90 &&

        platform.status === "ONLINE"

    ) {

        infinityState.active = true;

        infinityState.status = "ONLINE";

    } else {

        infinityState.active = false;

        infinityState.status = "DEGRADED";

    }

    infinityState.history.push({

        timestamp:
            new Date(),

        status:
            infinityState.status,

        health,

        platformStatus:
            platform.status,

        controllerMode:
            controller.mode

    });

    if (

        infinityState.history.length >

        1000

    ) {

        infinityState.history.shift();

    }

    logInfinity(
        INFINITY_STAGES[3]
    );

    return {

        success:
            infinityState.active,

        status:
            infinityState.status,

        health,

        cycles:
            infinityState.cycles,

        platform,

        controller

    };

}
/*
==================================================
RUN PLATFORM INFINITY
==================================================
*/

async function runPlatformInfinity() {

    console.log(`
==================================
AI PLATFORM INFINITY
==================================
`);

    const result = await startPlatformInfinity();

    console.log(`
==================================
PLATFORM INFINITY SUMMARY
==================================

Status:
${infinityState.status}

Active:
${infinityState.active}

Initialized:
${infinityState.initialized}

Cycles:
${infinityState.cycles}

Health:
${infinityState.health}

Last Cycle:
${infinityState.lastCycle}

History Records:
${infinityState.history.length}

==================================
`);

    return result;

}

/*
==================================================
RESET
==================================================
*/

function resetInfinityState() {

    infinityState = {

        initialized: false,

        active: false,

        cycles: 0,

        lastCycle: null,

        health: 100,

        status: "OFFLINE",

        history: []

    };

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    runPlatformInfinity,

    startPlatformInfinity,

    calculateInfinityHealth,

    resetInfinityState,

    logInfinity

};
