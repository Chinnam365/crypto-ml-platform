/*
==================================================
GLOBAL EXECUTION MANAGER
==================================================
PHASE 49
PART 1
==================================================
*/

const {
    runGlobalCoordinator
} = require("./globalCoordinator");

const {
    getPlatformStatus
} = require("./platformEntryPoint");

const {
    getControllerState
} = require("./runtimeController");

let executionState = {

    initialized: false,

    running: false,

    executions: 0,

    lastExecution: null,

    health: 100,

    status: "OFFLINE",

    history: []

};

const EXECUTION_STAGES = [

    "Initialize Global Coordinator",

    "Validate Platform",

    "Validate Runtime",

    "Global Execution Online"

];

/*
==================================================
LOGGER
==================================================
*/

function logExecution(message) {

    console.log(`
==================================
GLOBAL EXECUTION MANAGER
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

function calculateExecutionHealth() {

    const platform = getPlatformStatus();

    const controller = getControllerState();

    let score = 100;

    if (platform.status !== "ONLINE")
        score -= 40;

    if (!controller.initialized)
        score -= 20;

    if (controller.mode !== "AUTONOMOUS")
        score -= 20;

    executionState.health = Math.max(score, 0);

    return executionState.health;

}
/*
==================================================
GLOBAL EXECUTION
==================================================
*/

async function startGlobalExecution() {

    executionState.status = "STARTING";

    logExecution(
        EXECUTION_STAGES[0]
    );

    const coordinator =
        await runGlobalCoordinator();

    executionState.initialized =
        coordinator.success;

    executionState.executions++;

    executionState.lastExecution =
        new Date();

    logExecution(
        EXECUTION_STAGES[1]
    );

    const platform =
        getPlatformStatus();

    logExecution(
        EXECUTION_STAGES[2]
    );

    const controller =
        getControllerState();

    const health =
        calculateExecutionHealth();

    if (

        coordinator.success &&

        health >= 90 &&

        platform.status === "ONLINE"

    ) {

        executionState.running = true;

        executionState.status = "ONLINE";

    } else {

        executionState.running = false;

        executionState.status = "DEGRADED";

    }

    executionState.history.push({

        timestamp:
            new Date(),

        status:
            executionState.status,

        health,

        platformStatus:
            platform.status,

        controllerMode:
            controller.mode

    });

    if (

        executionState.history.length >

        1000

    ) {

        executionState.history.shift();

    }

    logExecution(
        EXECUTION_STAGES[3]
    );

    return {

        success:
            executionState.running,

        status:
            executionState.status,

        health,

        executions:
            executionState.executions,

        platform,

        controller

    };

}
/*
==================================================
RUN GLOBAL EXECUTION MANAGER
==================================================
*/

async function runGlobalExecutionManager() {

    console.log(`
==================================
GLOBAL EXECUTION MANAGER
==================================
`);

    const result = await startGlobalExecution();

    console.log(`
==================================
GLOBAL EXECUTION SUMMARY
==================================

Status:
${executionState.status}

Running:
${executionState.running}

Initialized:
${executionState.initialized}

Executions:
${executionState.executions}

Health:
${executionState.health}

Last Execution:
${executionState.lastExecution}

History Records:
${executionState.history.length}

==================================
`);

    return result;

}

/*
==================================================
RESET
==================================================
*/

function resetExecutionState() {

    executionState = {

        initialized: false,

        running: false,

        executions: 0,

        lastExecution: null,

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

    runGlobalExecutionManager,

    startGlobalExecution,

    calculateExecutionHealth,

    resetExecutionState,

    logExecution

};
