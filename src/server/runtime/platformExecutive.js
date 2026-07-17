/*
==================================================
AI PLATFORM EXECUTIVE
==================================================
PHASE 55
PART 1
==================================================
*/

const {
    runPlatformDirector
} = require("./platformDirector");

const {
    getPlatformStatus
} = require("./platformEntryPoint");

const {
    getControllerState
} = require("./runtimeController");

let executiveState = {

    initialized: false,

    active: false,

    cycles: 0,

    lastCycle: null,

    health: 100,

    status: "OFFLINE",

    history: []

};

const EXECUTIVE_STAGES = [

    "Initialize Executive",

    "Validate Platform",

    "Validate Runtime",

    "Platform Executive Online"

];

/*
==================================================
LOGGER
==================================================
*/

function logExecutive(message) {

    console.log(`
==================================
AI PLATFORM EXECUTIVE
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

function calculateExecutiveHealth() {

    const platform = getPlatformStatus();

    const controller = getControllerState();

    let score = 100;

    if (platform.status !== "ONLINE")
        score -= 40;

    if (!controller.initialized)
        score -= 20;

    if (controller.mode !== "AUTONOMOUS")
        score -= 20;

    executiveState.health = Math.max(score, 0);

    return executiveState.health;

}
/*
==================================================
EXECUTIVE EXECUTION
==================================================
*/

async function startPlatformExecutive() {

    executiveState.status = "STARTING";

    logExecutive(
        EXECUTIVE_STAGES[0]
    );

    const director =
        await runPlatformDirector();

    executiveState.initialized =
        director.success;

    executiveState.cycles++;

    executiveState.lastCycle =
        new Date();

    logExecutive(
        EXECUTIVE_STAGES[1]
    );

    const platform =
        getPlatformStatus();

    logExecutive(
        EXECUTIVE_STAGES[2]
    );

    const controller =
        getControllerState();

    const health =
        calculateExecutiveHealth();

    if (

        director.success &&

        health >= 90 &&

        platform.status === "ONLINE"

    ) {

        executiveState.active = true;

        executiveState.status = "ONLINE";

    } else {

        executiveState.active = false;

        executiveState.status = "DEGRADED";

    }

    executiveState.history.push({

        timestamp:
            new Date(),

        status:
            executiveState.status,

        health,

        platformStatus:
            platform.status,

        controllerMode:
            controller.mode

    });

    if (

        executiveState.history.length >

        1000

    ) {

        executiveState.history.shift();

    }

    logExecutive(
        EXECUTIVE_STAGES[3]
    );

    return {

        success:
            executiveState.active,

        status:
            executiveState.status,

        health,

        cycles:
            executiveState.cycles,

        platform,

        controller

    };

}
/*
==================================================
RUN PLATFORM EXECUTIVE
==================================================
*/

async function runPlatformExecutive() {

    console.log(`
==================================
AI PLATFORM EXECUTIVE
==================================
`);

    const result = await startPlatformExecutive();

    console.log(`
==================================
PLATFORM EXECUTIVE SUMMARY
==================================

Status:
${executiveState.status}

Active:
${executiveState.active}

Initialized:
${executiveState.initialized}

Cycles:
${executiveState.cycles}

Health:
${executiveState.health}

Last Cycle:
${executiveState.lastCycle}

History Records:
${executiveState.history.length}

==================================
`);

    return result;

}

/*
==================================================
RESET
==================================================
*/

function resetExecutiveState() {

    executiveState = {

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

    runPlatformExecutive,

    startPlatformExecutive,

    calculateExecutiveHealth,

    resetExecutiveState,

    logExecutive

};
