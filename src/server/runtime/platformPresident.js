/*
==================================================
AI PLATFORM PRESIDENT
==================================================
PHASE 57
PART 1
==================================================
*/

const {
    runPlatformGovernor
} = require("./platformGovernor");

const {
    getPlatformStatus
} = require("./platformEntryPoint");

const {
    getControllerState
} = require("./runtimeController");

let presidentState = {

    initialized: false,

    active: false,

    cycles: 0,

    lastCycle: null,

    health: 100,

    status: "OFFLINE",

    history: []

};

const PRESIDENT_STAGES = [

    "Initialize President",

    "Validate Platform",

    "Validate Runtime",

    "Platform President Online"

];

/*
==================================================
LOGGER
==================================================
*/

function logPresident(message) {

    console.log(`
==================================
AI PLATFORM PRESIDENT
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

function calculatePresidentHealth() {

    const platform = getPlatformStatus();

    const controller = getControllerState();

    let score = 100;

    if (platform.status !== "ONLINE")
        score -= 40;

    if (!controller.initialized)
        score -= 20;

    if (controller.mode !== "AUTONOMOUS")
        score -= 20;

    presidentState.health = Math.max(score, 0);

    return presidentState.health;

}
/*
==================================================
PRESIDENT EXECUTION
==================================================
*/

async function startPlatformPresident() {

    presidentState.status = "STARTING";

    logPresident(
        PRESIDENT_STAGES[0]
    );

    const governor =
        await runPlatformGovernor();

    presidentState.initialized =
        governor.success;

    presidentState.cycles++;

    presidentState.lastCycle =
        new Date();

    logPresident(
        PRESIDENT_STAGES[1]
    );

    const platform =
        getPlatformStatus();

    logPresident(
        PRESIDENT_STAGES[2]
    );

    const controller =
        getControllerState();

    const health =
        calculatePresidentHealth();

    if (

        governor.success &&

        health >= 90 &&

        platform.status === "ONLINE"

    ) {

        presidentState.active = true;

        presidentState.status = "ONLINE";

    } else {

        presidentState.active = false;

        presidentState.status = "DEGRADED";

    }

    presidentState.history.push({

        timestamp:
            new Date(),

        status:
            presidentState.status,

        health,

        platformStatus:
            platform.status,

        controllerMode:
            controller.mode

    });

    if (

        presidentState.history.length >

        1000

    ) {

        presidentState.history.shift();

    }

    logPresident(
        PRESIDENT_STAGES[3]
    );

    return {

        success:
            presidentState.active,

        status:
            presidentState.status,

        health,

        cycles:
            presidentState.cycles,

        platform,

        controller

    };

}
/*
==================================================
RUN PLATFORM PRESIDENT
==================================================
*/

async function runPlatformPresident() {

    console.log(`
==================================
AI PLATFORM PRESIDENT
==================================
`);

    const result = await startPlatformPresident();

    console.log(`
==================================
PLATFORM PRESIDENT SUMMARY
==================================

Status:
${presidentState.status}

Active:
${presidentState.active}

Initialized:
${presidentState.initialized}

Cycles:
${presidentState.cycles}

Health:
${presidentState.health}

Last Cycle:
${presidentState.lastCycle}

History Records:
${presidentState.history.length}

==================================
`);

    return result;

}

/*
==================================================
RESET
==================================================
*/

function resetPresidentState() {

    presidentState = {

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

    runPlatformPresident,

    startPlatformPresident,

    calculatePresidentHealth,

    resetPresidentState,

    logPresident

};
