/*
==================================================
AI PLATFORM CORE
==================================================
PHASE 51
PART 1
==================================================
*/

const {
    runPlatformKernel
} = require("./platformKernel");

const {
    getPlatformStatus
} = require("./platformEntryPoint");

const {
    getControllerState
} = require("./runtimeController");

let coreState = {

    initialized: false,

    active: false,

    cycles: 0,

    lastCycle: null,

    health: 100,

    status: "OFFLINE",

    history: []

};

const CORE_STAGES = [

    "Initialize Core",

    "Validate Platform",

    "Validate Runtime",

    "Platform Core Online"

];

/*
==================================================
LOGGER
==================================================
*/

function logCore(message) {

    console.log(`
==================================
AI PLATFORM CORE
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

function calculateCoreHealth() {

    const platform = getPlatformStatus();

    const controller = getControllerState();

    let score = 100;

    if (platform.status !== "ONLINE")
        score -= 40;

    if (!controller.initialized)
        score -= 20;

    if (controller.mode !== "AUTONOMOUS")
        score -= 20;

    coreState.health = Math.max(score, 0);

    return coreState.health;

}
/*
==================================================
CORE EXECUTION
==================================================
*/

async function startPlatformCore() {

    coreState.status = "STARTING";

    logCore(
        CORE_STAGES[0]
    );

    const kernel =
        await runPlatformKernel();

    coreState.initialized =
        kernel.success;

    coreState.cycles++;

    coreState.lastCycle =
        new Date();

    logCore(
        CORE_STAGES[1]
    );

    const platform =
        getPlatformStatus();

    logCore(
        CORE_STAGES[2]
    );

    const controller =
        getControllerState();

    const health =
        calculateCoreHealth();

    if (

        kernel.success &&

        health >= 90 &&

        platform.status === "ONLINE"

    ) {

        coreState.active = true;

        coreState.status = "ONLINE";

    } else {

        coreState.active = false;

        coreState.status = "DEGRADED";

    }

    coreState.history.push({

        timestamp:
            new Date(),

        status:
            coreState.status,

        health,

        platformStatus:
            platform.status,

        controllerMode:
            controller.mode

    });

    if (

        coreState.history.length >

        1000

    ) {

        coreState.history.shift();

    }

    logCore(
        CORE_STAGES[3]
    );

    return {

        success:
            coreState.active,

        status:
            coreState.status,

        health,

        cycles:
            coreState.cycles,

        platform,

        controller

    };

}
/*
==================================================
RUN PLATFORM CORE
==================================================
*/

async function runPlatformCore() {

    console.log(`
==================================
AI PLATFORM CORE
==================================
`);

    const result = await startPlatformCore();

    console.log(`
==================================
PLATFORM CORE SUMMARY
==================================

Status:
${coreState.status}

Active:
${coreState.active}

Initialized:
${coreState.initialized}

Cycles:
${coreState.cycles}

Health:
${coreState.health}

Last Cycle:
${coreState.lastCycle}

History Records:
${coreState.history.length}

==================================
`);

    return result;

}

/*
==================================================
RESET
==================================================
*/

function resetCoreState() {

    coreState = {

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

    runPlatformCore,

    startPlatformCore,

    calculateCoreHealth,

    resetCoreState,

    logCore

};
