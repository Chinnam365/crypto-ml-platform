/*
==================================================
AI PLATFORM COMMANDER
==================================================
PHASE 53
PART 1
==================================================
*/

const {
    runPlatformSupervisor
} = require("./platformSupervisor");

const {
    getPlatformStatus
} = require("./platformEntryPoint");

const {
    getControllerState
} = require("./runtimeController");

let commanderState = {

    initialized: false,

    active: false,

    cycles: 0,

    lastCycle: null,

    health: 100,

    status: "OFFLINE",

    history: []

};

const COMMANDER_STAGES = [

    "Initialize Commander",

    "Validate Platform",

    "Validate Runtime",

    "Platform Commander Online"

];

/*
==================================================
LOGGER
==================================================
*/

function logCommander(message) {

    console.log(`
==================================
AI PLATFORM COMMANDER
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

function calculateCommanderHealth() {

    const platform = getPlatformStatus();

    const controller = getControllerState();

    let score = 100;

    if (platform.status !== "ONLINE")
        score -= 40;

    if (!controller.initialized)
        score -= 20;

    if (controller.mode !== "AUTONOMOUS")
        score -= 20;

    commanderState.health = Math.max(score, 0);

    return commanderState.health;

}
/*
==================================================
COMMANDER EXECUTION
==================================================
*/

async function startPlatformCommander() {

    commanderState.status = "STARTING";

    logCommander(
        COMMANDER_STAGES[0]
    );

    const supervisor =
        await runPlatformSupervisor();

    commanderState.initialized =
        supervisor.success;

    commanderState.cycles++;

    commanderState.lastCycle =
        new Date();

    logCommander(
        COMMANDER_STAGES[1]
    );

    const platform =
        getPlatformStatus();

    logCommander(
        COMMANDER_STAGES[2]
    );

    const controller =
        getControllerState();

    const health =
        calculateCommanderHealth();

    if (

        supervisor.success &&

        health >= 90 &&

        platform.status === "ONLINE"

    ) {

        commanderState.active = true;

        commanderState.status = "ONLINE";

    } else {

        commanderState.active = false;

        commanderState.status = "DEGRADED";

    }

    commanderState.history.push({

        timestamp:
            new Date(),

        status:
            commanderState.status,

        health,

        platformStatus:
            platform.status,

        controllerMode:
            controller.mode

    });

    if (

        commanderState.history.length >

        1000

    ) {

        commanderState.history.shift();

    }

    logCommander(
        COMMANDER_STAGES[3]
    );

    return {

        success:
            commanderState.active,

        status:
            commanderState.status,

        health,

        cycles:
            commanderState.cycles,

        platform,

        controller

    };

}
/*
==================================================
RUN PLATFORM COMMANDER
==================================================
*/

async function runPlatformCommander() {

    console.log(`
==================================
AI PLATFORM COMMANDER
==================================
`);

    const result = await startPlatformCommander();

    console.log(`
==================================
PLATFORM COMMANDER SUMMARY
==================================

Status:
${commanderState.status}

Active:
${commanderState.active}

Initialized:
${commanderState.initialized}

Cycles:
${commanderState.cycles}

Health:
${commanderState.health}

Last Cycle:
${commanderState.lastCycle}

History Records:
${commanderState.history.length}

==================================
`);

    return result;

}

/*
==================================================
RESET
==================================================
*/

function resetCommanderState() {

    commanderState = {

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

    runPlatformCommander,

    startPlatformCommander,

    calculateCommanderHealth,

    resetCommanderState,

    logCommander

};
