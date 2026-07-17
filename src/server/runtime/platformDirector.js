/*
==================================================
AI PLATFORM DIRECTOR
==================================================
PHASE 54
PART 1
==================================================
*/

const {
    runPlatformCommander
} = require("./platformCommander");

const {
    getPlatformStatus
} = require("./platformEntryPoint");

const {
    getControllerState
} = require("./runtimeController");

let directorState = {

    initialized: false,

    active: false,

    cycles: 0,

    lastCycle: null,

    health: 100,

    status: "OFFLINE",

    history: []

};

const DIRECTOR_STAGES = [

    "Initialize Director",

    "Validate Platform",

    "Validate Runtime",

    "Platform Director Online"

];

/*
==================================================
LOGGER
==================================================
*/

function logDirector(message) {

    console.log(`
==================================
AI PLATFORM DIRECTOR
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

function calculateDirectorHealth() {

    const platform = getPlatformStatus();

    const controller = getControllerState();

    let score = 100;

    if (platform.status !== "ONLINE")
        score -= 40;

    if (!controller.initialized)
        score -= 20;

    if (controller.mode !== "AUTONOMOUS")
        score -= 20;

    directorState.health = Math.max(score, 0);

    return directorState.health;

}
/*
==================================================
DIRECTOR EXECUTION
==================================================
*/

async function startPlatformDirector() {

    directorState.status = "STARTING";

    logDirector(
        DIRECTOR_STAGES[0]
    );

    const commander =
        await runPlatformCommander();

    directorState.initialized =
        commander.success;

    directorState.cycles++;

    directorState.lastCycle =
        new Date();

    logDirector(
        DIRECTOR_STAGES[1]
    );

    const platform =
        getPlatformStatus();

    logDirector(
        DIRECTOR_STAGES[2]
    );

    const controller =
        getControllerState();

    const health =
        calculateDirectorHealth();

    if (

        commander.success &&

        health >= 90 &&

        platform.status === "ONLINE"

    ) {

        directorState.active = true;

        directorState.status = "ONLINE";

    } else {

        directorState.active = false;

        directorState.status = "DEGRADED";

    }

    directorState.history.push({

        timestamp:
            new Date(),

        status:
            directorState.status,

        health,

        platformStatus:
            platform.status,

        controllerMode:
            controller.mode

    });

    if (

        directorState.history.length >

        1000

    ) {

        directorState.history.shift();

    }

    logDirector(
        DIRECTOR_STAGES[3]
    );

    return {

        success:
            directorState.active,

        status:
            directorState.status,

        health,

        cycles:
            directorState.cycles,

        platform,

        controller

    };

}
/*
==================================================
RUN PLATFORM DIRECTOR
==================================================
*/

async function runPlatformDirector() {

    console.log(`
==================================
AI PLATFORM DIRECTOR
==================================
`);

    const result = await startPlatformDirector();

    console.log(`
==================================
PLATFORM DIRECTOR SUMMARY
==================================

Status:
${directorState.status}

Active:
${directorState.active}

Initialized:
${directorState.initialized}

Cycles:
${directorState.cycles}

Health:
${directorState.health}

Last Cycle:
${directorState.lastCycle}

History Records:
${directorState.history.length}

==================================
`);

    return result;

}

/*
==================================================
RESET
==================================================
*/

function resetDirectorState() {

    directorState = {

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

    runPlatformDirector,

    startPlatformDirector,

    calculateDirectorHealth,

    resetDirectorState,

    logDirector

};
