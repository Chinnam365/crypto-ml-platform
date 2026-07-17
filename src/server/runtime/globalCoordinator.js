/*
==================================================
GLOBAL AI COORDINATOR
==================================================
PHASE 48
PART 1
==================================================
*/

const {
    runEnterpriseOrchestrator
} = require("./enterpriseOrchestrator");

const {
    getPlatformStatus
} = require("./platformEntryPoint");

const {
    getControllerState
} = require("./runtimeController");

let coordinatorState = {

    initialized: false,

    active: false,

    cycles: 0,

    lastCycle: null,

    health: 100,

    status: "OFFLINE",

    history: []

};

const COORDINATOR_STAGES = [

    "Enterprise Startup",

    "Platform Validation",

    "Controller Validation",

    "Global Coordination Online"

];

/*
==================================================
LOGGER
==================================================
*/

function logCoordinator(message) {

    console.log(`
==================================
GLOBAL AI COORDINATOR
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

function calculateCoordinatorHealth() {

    const platform = getPlatformStatus();

    const controller = getControllerState();

    let score = 100;

    if (platform.status !== "ONLINE")
        score -= 40;

    if (!controller.initialized)
        score -= 20;

    if (controller.mode !== "AUTONOMOUS")
        score -= 20;

    coordinatorState.health = Math.max(score, 0);

    return coordinatorState.health;

}
/*
==================================================
GLOBAL COORDINATION
==================================================
*/

async function startGlobalCoordinator() {

    coordinatorState.status = "STARTING";

    logCoordinator(
        COORDINATOR_STAGES[0]
    );

    const enterprise =
        await runEnterpriseOrchestrator();

    coordinatorState.initialized =
        enterprise.success;

    coordinatorState.cycles++;

    coordinatorState.lastCycle =
        new Date();

    logCoordinator(
        COORDINATOR_STAGES[1]
    );

    const platform =
        getPlatformStatus();

    logCoordinator(
        COORDINATOR_STAGES[2]
    );

    const controller =
        getControllerState();

    const health =
        calculateCoordinatorHealth();

    if (

        enterprise.success &&

        health >= 90 &&

        platform.status === "ONLINE"

    ) {

        coordinatorState.active = true;

        coordinatorState.status = "ONLINE";

    } else {

        coordinatorState.active = false;

        coordinatorState.status = "DEGRADED";

    }

    coordinatorState.history.push({

        timestamp:
            new Date(),

        status:
            coordinatorState.status,

        health,

        platformStatus:
            platform.status,

        controllerMode:
            controller.mode

    });

    if (

        coordinatorState.history.length >

        1000

    ) {

        coordinatorState.history.shift();

    }

    logCoordinator(
        COORDINATOR_STAGES[3]
    );

    return {

        success:
            coordinatorState.active,

        status:
            coordinatorState.status,

        health,

        cycles:
            coordinatorState.cycles,

        platform,

        controller

    };

}
/*
==================================================
RUN GLOBAL COORDINATOR
==================================================
*/

async function runGlobalCoordinator() {

    console.log(`
==================================
GLOBAL AI COORDINATOR
==================================
`);

    const result = await startGlobalCoordinator();

    console.log(`
==================================
GLOBAL COORDINATOR SUMMARY
==================================

Status:
${coordinatorState.status}

Active:
${coordinatorState.active}

Initialized:
${coordinatorState.initialized}

Cycles:
${coordinatorState.cycles}

Health:
${coordinatorState.health}

Last Cycle:
${coordinatorState.lastCycle}

History Records:
${coordinatorState.history.length}

==================================
`);

    return result;

}

/*
==================================================
RESET
==================================================
*/

function resetCoordinatorState() {

    coordinatorState = {

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

    runGlobalCoordinator,

    startGlobalCoordinator,

    calculateCoordinatorHealth,

    resetCoordinatorState,

    logCoordinator

};
