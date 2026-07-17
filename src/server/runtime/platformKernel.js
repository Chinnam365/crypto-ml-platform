/*
==================================================
AI PLATFORM KERNEL
==================================================
PHASE 50
PART 1
==================================================
*/

const {
    runGlobalExecutionManager
} = require("./globalExecutionManager");

const {
    getPlatformStatus
} = require("./platformEntryPoint");

const {
    getControllerState
} = require("./runtimeController");

let kernelState = {

    initialized: false,

    active: false,

    cycles: 0,

    lastCycle: null,

    health: 100,

    status: "OFFLINE",

    history: []

};

const KERNEL_STAGES = [

    "Initialize Kernel",

    "Validate Platform",

    "Validate Runtime",

    "Kernel Online"

];

/*
==================================================
LOGGER
==================================================
*/

function logKernel(message) {

    console.log(`
==================================
AI PLATFORM KERNEL
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

function calculateKernelHealth() {

    const platform = getPlatformStatus();

    const controller = getControllerState();

    let score = 100;

    if (platform.status !== "ONLINE")
        score -= 40;

    if (!controller.initialized)
        score -= 20;

    if (controller.mode !== "AUTONOMOUS")
        score -= 20;

    kernelState.health = Math.max(score, 0);

    return kernelState.health;

}
/*
==================================================
KERNEL EXECUTION
==================================================
*/

async function startPlatformKernel() {

    kernelState.status = "STARTING";

    logKernel(
        KERNEL_STAGES[0]
    );

    const execution =
        await runGlobalExecutionManager();

    kernelState.initialized =
        execution.success;

    kernelState.cycles++;

    kernelState.lastCycle =
        new Date();

    logKernel(
        KERNEL_STAGES[1]
    );

    const platform =
        getPlatformStatus();

    logKernel(
        KERNEL_STAGES[2]
    );

    const controller =
        getControllerState();

    const health =
        calculateKernelHealth();

    if (

        execution.success &&

        health >= 90 &&

        platform.status === "ONLINE"

    ) {

        kernelState.active = true;

        kernelState.status = "ONLINE";

    } else {

        kernelState.active = false;

        kernelState.status = "DEGRADED";

    }

    kernelState.history.push({

        timestamp:
            new Date(),

        status:
            kernelState.status,

        health,

        platformStatus:
            platform.status,

        controllerMode:
            controller.mode

    });

    if (

        kernelState.history.length >

        1000

    ) {

        kernelState.history.shift();

    }

    logKernel(
        KERNEL_STAGES[3]
    );

    return {

        success:
            kernelState.active,

        status:
            kernelState.status,

        health,

        cycles:
            kernelState.cycles,

        platform,

        controller

    };

}
/*
==================================================
RUN PLATFORM KERNEL
==================================================
*/

async function runPlatformKernel() {

    console.log(`
==================================
AI PLATFORM KERNEL
==================================
`);

    const result = await startPlatformKernel();

    console.log(`
==================================
PLATFORM KERNEL SUMMARY
==================================

Status:
${kernelState.status}

Active:
${kernelState.active}

Initialized:
${kernelState.initialized}

Cycles:
${kernelState.cycles}

Health:
${kernelState.health}

Last Cycle:
${kernelState.lastCycle}

History Records:
${kernelState.history.length}

==================================
`);

    return result;

}

/*
==================================================
RESET
==================================================
*/

function resetKernelState() {

    kernelState = {

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

    runPlatformKernel,

    startPlatformKernel,

    calculateKernelHealth,

    resetKernelState,

    logKernel

};
