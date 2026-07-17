/*
==================================================
AI PLATFORM GOVERNOR
==================================================
PHASE 56
PART 1
==================================================
*/

const {
    runPlatformExecutive
} = require("./platformExecutive");

const {
    getPlatformStatus
} = require("./platformEntryPoint");

const {
    getControllerState
} = require("./runtimeController");

let governorState = {

    initialized: false,

    active: false,

    cycles: 0,

    lastCycle: null,

    health: 100,

    status: "OFFLINE",

    history: []

};

const GOVERNOR_STAGES = [

    "Initialize Governor",

    "Validate Platform",

    "Validate Runtime",

    "Platform Governor Online"

];

/*
==================================================
LOGGER
==================================================
*/

function logGovernor(message) {

    console.log(`
==================================
AI PLATFORM GOVERNOR
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

function calculateGovernorHealth() {

    const platform = getPlatformStatus();

    const controller = getControllerState();

    let score = 100;

    if (platform.status !== "ONLINE")
        score -= 40;

    if (!controller.initialized)
        score -= 20;

    if (controller.mode !== "AUTONOMOUS")
        score -= 20;

    governorState.health = Math.max(score, 0);

    return governorState.health;

}
/*
==================================================
GOVERNOR EXECUTION
==================================================
*/

async function startPlatformGovernor() {

    governorState.status = "STARTING";

    logGovernor(
        GOVERNOR_STAGES[0]
    );

    const executive =
        await runPlatformExecutive();

    governorState.initialized =
        executive.success;

    governorState.cycles++;

    governorState.lastCycle =
        new Date();

    logGovernor(
        GOVERNOR_STAGES[1]
    );

    const platform =
        getPlatformStatus();

    logGovernor(
        GOVERNOR_STAGES[2]
    );

    const controller =
        getControllerState();

    const health =
        calculateGovernorHealth();

    if (

        executive.success &&

        health >= 90 &&

        platform.status === "ONLINE"

    ) {

        governorState.active = true;

        governorState.status = "ONLINE";

    } else {

        governorState.active = false;

        governorState.status = "DEGRADED";

    }

    governorState.history.push({

        timestamp:
            new Date(),

        status:
            governorState.status,

        health,

        platformStatus:
            platform.status,

        controllerMode:
            controller.mode

    });

    if (

        governorState.history.length >

        1000

    ) {

        governorState.history.shift();

    }

    logGovernor(
        GOVERNOR_STAGES[3]
    );

    return {

        success:
            governorState.active,

        status:
            governorState.status,

        health,

        cycles:
            governorState.cycles,

        platform,

        controller

    };

}
/*
==================================================
RUN PLATFORM GOVERNOR
==================================================
*/

async function runPlatformGovernor() {

    console.log(`
==================================
AI PLATFORM GOVERNOR
==================================
`);

    const result = await startPlatformGovernor();

    console.log(`
==================================
PLATFORM GOVERNOR SUMMARY
==================================

Status:
${governorState.status}

Active:
${governorState.active}

Initialized:
${governorState.initialized}

Cycles:
${governorState.cycles}

Health:
${governorState.health}

Last Cycle:
${governorState.lastCycle}

History Records:
${governorState.history.length}

==================================
`);

    return result;

}

/*
==================================================
RESET
==================================================
*/

function resetGovernorState() {

    governorState = {

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

    runPlatformGovernor,

    startPlatformGovernor,

    calculateGovernorHealth,

    resetGovernorState,

    logGovernor

};
