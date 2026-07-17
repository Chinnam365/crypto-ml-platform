/*
==================================================
AI PLATFORM SUPERVISOR
==================================================
PHASE 52
PART 1
==================================================
*/

const {
    runPlatformCore
} = require("./platformCore");

const {
    getPlatformStatus
} = require("./platformEntryPoint");

const {
    getControllerState
} = require("./runtimeController");

let supervisorState = {

    initialized: false,

    active: false,

    cycles: 0,

    lastCycle: null,

    health: 100,

    status: "OFFLINE",

    history: []

};

const SUPERVISOR_STAGES = [

    "Initialize Supervisor",

    "Validate Platform",

    "Validate Runtime",

    "Platform Supervisor Online"

];

/*
==================================================
LOGGER
==================================================
*/

function logSupervisor(message) {

    console.log(`
==================================
AI PLATFORM SUPERVISOR
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

function calculateSupervisorHealth() {

    const platform = getPlatformStatus();

    const controller = getControllerState();

    let score = 100;

    if (platform.status !== "ONLINE")
        score -= 40;

    if (!controller.initialized)
        score -= 20;

    if (controller.mode !== "AUTONOMOUS")
        score -= 20;

    supervisorState.health = Math.max(score, 0);

    return supervisorState.health;

}
/*
==================================================
SUPERVISOR EXECUTION
==================================================
*/

async function startPlatformSupervisor() {

    supervisorState.status = "STARTING";

    logSupervisor(
        SUPERVISOR_STAGES[0]
    );

    const core =
        await runPlatformCore();

    supervisorState.initialized =
        core.success;

    supervisorState.cycles++;

    supervisorState.lastCycle =
        new Date();

    logSupervisor(
        SUPERVISOR_STAGES[1]
    );

    const platform =
        getPlatformStatus();

    logSupervisor(
        SUPERVISOR_STAGES[2]
    );

    const controller =
        getControllerState();

    const health =
        calculateSupervisorHealth();

    if (

        core.success &&

        health >= 90 &&

        platform.status === "ONLINE"

    ) {

        supervisorState.active = true;

        supervisorState.status = "ONLINE";

    } else {

        supervisorState.active = false;

        supervisorState.status = "DEGRADED";

    }

    supervisorState.history.push({

        timestamp:
            new Date(),

        status:
            supervisorState.status,

        health,

        platformStatus:
            platform.status,

        controllerMode:
            controller.mode

    });

    if (

        supervisorState.history.length >

        1000

    ) {

        supervisorState.history.shift();

    }

    logSupervisor(
        SUPERVISOR_STAGES[3]
    );

    return {

        success:
            supervisorState.active,

        status:
            supervisorState.status,

        health,

        cycles:
            supervisorState.cycles,

        platform,

        controller

    };

}
/*
==================================================
RUN PLATFORM SUPERVISOR
==================================================
*/

async function runPlatformSupervisor() {

    console.log(`
==================================
AI PLATFORM SUPERVISOR
==================================
`);

    const result = await startPlatformSupervisor();

    console.log(`
==================================
PLATFORM SUPERVISOR SUMMARY
==================================

Status:
${supervisorState.status}

Active:
${supervisorState.active}

Initialized:
${supervisorState.initialized}

Cycles:
${supervisorState.cycles}

Health:
${supervisorState.health}

Last Cycle:
${supervisorState.lastCycle}

History Records:
${supervisorState.history.length}

==================================
`);

    return result;

}

/*
==================================================
RESET
==================================================
*/

function resetSupervisorState() {

    supervisorState = {

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

    runPlatformSupervisor,

    startPlatformSupervisor,

    calculateSupervisorHealth,

    resetSupervisorState,

    logSupervisor

};
