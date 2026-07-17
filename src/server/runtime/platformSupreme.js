/*
==================================================
AI PLATFORM SUPREME
==================================================
PHASE 59
PART 1
==================================================
*/

const {
    runPlatformPrime
} = require("./platformPrime");

const {
    getPlatformStatus
} = require("./platformEntryPoint");

const {
    getControllerState
} = require("./runtimeController");

let supremeState = {

    initialized: false,

    active: false,

    cycles: 0,

    lastCycle: null,

    health: 100,

    status: "OFFLINE",

    history: []

};

const SUPREME_STAGES = [

    "Initialize Supreme",

    "Validate Platform",

    "Validate Runtime",

    "Platform Supreme Online"

];

/*
==================================================
LOGGER
==================================================
*/

function logSupreme(message) {

    console.log(`
==================================
AI PLATFORM SUPREME
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

function calculateSupremeHealth() {

    const platform = getPlatformStatus();

    const controller = getControllerState();

    let score = 100;

    if (platform.status !== "ONLINE")
        score -= 40;

    if (!controller.initialized)
        score -= 20;

    if (controller.mode !== "AUTONOMOUS")
        score -= 20;

    supremeState.health = Math.max(score, 0);

    return supremeState.health;

}
/*
==================================================
SUPREME EXECUTION
==================================================
*/

async function startPlatformSupreme() {

    supremeState.status = "STARTING";

    logSupreme(
        SUPREME_STAGES[0]
    );

    const prime =
        await runPlatformPrime();

    supremeState.initialized =
        prime.success;

    supremeState.cycles++;

    supremeState.lastCycle =
        new Date();

    logSupreme(
        SUPREME_STAGES[1]
    );

    const platform =
        getPlatformStatus();

    logSupreme(
        SUPREME_STAGES[2]
    );

    const controller =
        getControllerState();

    const health =
        calculateSupremeHealth();

    if (

        prime.success &&

        health >= 90 &&

        platform.status === "ONLINE"

    ) {

        supremeState.active = true;

        supremeState.status = "ONLINE";

    } else {

        supremeState.active = false;

        supremeState.status = "DEGRADED";

    }

    supremeState.history.push({

        timestamp:
            new Date(),

        status:
            supremeState.status,

        health,

        platformStatus:
            platform.status,

        controllerMode:
            controller.mode

    });

    if (

        supremeState.history.length >

        1000

    ) {

        supremeState.history.shift();

    }

    logSupreme(
        SUPREME_STAGES[3]
    );

    return {

        success:
            supremeState.active,

        status:
            supremeState.status,

        health,

        cycles:
            supremeState.cycles,

        platform,

        controller

    };

}
/*
==================================================
RUN PLATFORM SUPREME
==================================================
*/

async function runPlatformSupreme() {

    console.log(`
==================================
AI PLATFORM SUPREME
==================================
`);

    const result = await startPlatformSupreme();

    console.log(`
==================================
PLATFORM SUPREME SUMMARY
==================================

Status:
${supremeState.status}

Active:
${supremeState.active}

Initialized:
${supremeState.initialized}

Cycles:
${supremeState.cycles}

Health:
${supremeState.health}

Last Cycle:
${supremeState.lastCycle}

History Records:
${supremeState.history.length}

==================================
`);

    return result;

}

/*
==================================================
RESET
==================================================
*/

function resetSupremeState() {

    supremeState = {

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

    runPlatformSupreme,

    startPlatformSupreme,

    calculateSupremeHealth,

    resetSupremeState,

    logSupreme

};
