/*
==================================================
AUTONOMOUS RUNTIME CONTROLLER
==================================================
PHASE 43
PART 1
==================================================
*/

const {
    runRuntimeScheduler,
    startRuntimeScheduler,
    stopRuntimeScheduler,
    getSchedulerState
} = require("./runtimeScheduler");

const {
    runRuntimeWatchdog
} = require("./runtimeWatchdog");

const {
    getRuntimeState
} = require("./autonomousRuntime");

let controllerState = {

    initialized: false,

    running: false,

    mode: "MANUAL",

    commandsExecuted: 0,

    lastCommand: null,

    lastCommandTime: null,

    history: []

};

const CONTROLLER_MODES = [

    "MANUAL",

    "AUTONOMOUS",

    "SAFE",

    "MAINTENANCE"

];

/*
==================================================
LOGGER
==================================================
*/

function logController(message) {

    console.log(`
==================================
RUNTIME CONTROLLER
==================================

${message}

==================================
`);

}

/*
==================================================
CONTROLLER STATUS
==================================================
*/

function getControllerState() {

    return {

        ...controllerState,

        scheduler:
            getSchedulerState(),

        runtime:
            getRuntimeState()

    };

}

/*
==================================================
MODE MANAGEMENT
==================================================
*/

function setControllerMode(mode) {

    if (

        !CONTROLLER_MODES.includes(mode)

    ) {

        throw new Error(

            `Invalid controller mode: ${mode}`

        );

    }

    controllerState.mode = mode;

    controllerState.lastCommand =
        `SET_MODE_${mode}`;

    controllerState.lastCommandTime =
        new Date();

    controllerState.commandsExecuted++;

}
/*
==================================================
CONTROLLER ENGINE
==================================================
*/

async function executeControllerCycle() {

    controllerState.running = true;

    controllerState.initialized = true;

    logController(
        `Controller Mode: ${controllerState.mode}`
    );

    switch (controllerState.mode) {

        case "AUTONOMOUS":

            await runRuntimeScheduler();

            await runRuntimeWatchdog();

            break;

        case "SAFE":

            await runRuntimeWatchdog();

            break;

        case "MAINTENANCE":

            stopRuntimeScheduler();

            break;

        case "MANUAL":

        default:

            break;

    }

    controllerState.history.push({

        timestamp:
            new Date(),

        mode:
            controllerState.mode,

        schedulerRunning:
            getSchedulerState().running,

        runtimeStatus:
            getRuntimeState().status

    });

    if (

        controllerState.history.length >

        1000

    ) {

        controllerState.history.shift();

    }

    controllerState.running = false;

}

/*
==================================================
START AUTONOMOUS MODE
==================================================
*/

async function enableAutonomousMode() {

    setControllerMode(
        "AUTONOMOUS"
    );

    startRuntimeScheduler();

    await executeControllerCycle();

}

/*
==================================================
SAFE MODE
==================================================
*/

async function enableSafeMode() {

    setControllerMode(
        "SAFE"
    );

    stopRuntimeScheduler();

    await runRuntimeWatchdog();

}
/*
==================================================
MAIN RUNTIME CONTROLLER
==================================================
*/

async function runRuntimeController() {

    console.log(`
==================================
AUTONOMOUS RUNTIME CONTROLLER
==================================
`);

    await executeControllerCycle();

    console.log(`
==================================
CONTROLLER SUMMARY
==================================

Initialized:
${controllerState.initialized}

Running:
${controllerState.running}

Mode:
${controllerState.mode}

Commands Executed:
${controllerState.commandsExecuted}

Last Command:
${controllerState.lastCommand}

History Records:
${controllerState.history.length}

==================================
`);

    return {

        initialized:
            controllerState.initialized,

        running:
            controllerState.running,

        mode:
            controllerState.mode,

        commandsExecuted:
            controllerState.commandsExecuted,

        lastCommand:
            controllerState.lastCommand,

        lastCommandTime:
            controllerState.lastCommandTime,

        history:
            controllerState.history,

        scheduler:
            getSchedulerState(),

        runtime:
            getRuntimeState()

    };

}

/*
==================================================
RESET
==================================================
*/

function resetControllerState() {

    controllerState = {

        initialized: false,

        running: false,

        mode: "MANUAL",

        commandsExecuted: 0,

        lastCommand: null,

        lastCommandTime: null,

        history: []

    };

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    runRuntimeController,

    executeControllerCycle,

    enableAutonomousMode,

    enableSafeMode,

    setControllerMode,

    getControllerState,

    resetControllerState,

    logController

};
