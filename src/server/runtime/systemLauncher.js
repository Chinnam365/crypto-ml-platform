/*
==================================================
SYSTEM LAUNCHER
==================================================
PHASE 45
PART 1
==================================================
*/

const {
    runPlatform,
    getPlatformStatus
} = require("./platformEntryPoint");

const {
    runRuntimeWatchdog
} = require("./runtimeWatchdog");

const {
    getControllerState
} = require("./runtimeController");

let launcherState = {

    launched: false,

    running: false,

    launchCount: 0,

    lastLaunch: null,

    lastHealthCheck: null,

    health: 100,

    history: []

};

const LAUNCH_STAGES = [

    "Platform Startup",

    "Controller Verification",

    "Watchdog Verification",

    "Health Validation",

    "Production Ready"

];

/*
==================================================
LOGGER
==================================================
*/

function logLauncher(message) {

    console.log(`
==================================
SYSTEM LAUNCHER
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

function calculateLauncherHealth() {

    const platform = getPlatformStatus();

    const controller = getControllerState();

    let score = 100;

    if (platform.status !== "ONLINE")
        score -= 40;

    if (!controller.initialized)
        score -= 20;

    if (!controller.autonomous &&
        controller.mode !== "AUTONOMOUS")
        score -= 20;

    launcherState.health = Math.max(score, 0);

    launcherState.lastHealthCheck = new Date();

    return launcherState.health;

}
/*
==================================================
SYSTEM LAUNCH SEQUENCE
==================================================
*/

async function executeLaunchSequence() {

    launcherState.running = true;

    logLauncher(
        LAUNCH_STAGES[0]
    );

    const platform = await runPlatform();

    launcherState.launched =
        platform.success;

    launcherState.launchCount++;

    launcherState.lastLaunch =
        new Date();

    logLauncher(
        LAUNCH_STAGES[1]
    );

    const controller =
        getControllerState();

    logLauncher(
        LAUNCH_STAGES[2]
    );

    await runRuntimeWatchdog();

    logLauncher(
        LAUNCH_STAGES[3]
    );

    const health =
        calculateLauncherHealth();

    launcherState.history.push({

        timestamp:
            new Date(),

        platformStatus:
            platform.status,

        controllerMode:
            controller.mode,

        controllerInitialized:
            controller.initialized,

        health

    });

    if (

        launcherState.history.length >

        1000

    ) {

        launcherState.history.shift();

    }

    launcherState.running = false;

    logLauncher(
        LAUNCH_STAGES[4]
    );

    return {

        success:
            launcherState.launched,

        platform,

        controller,

        health,

        launchCount:
            launcherState.launchCount

    };

}
/*
==================================================
RUN SYSTEM LAUNCHER
==================================================
*/

async function runSystemLauncher() {

    console.log(`
==================================
SYSTEM LAUNCHER
==================================
`);

    const result = await executeLaunchSequence();

    console.log(`
==================================
SYSTEM LAUNCH SUMMARY
==================================

Launched:
${launcherState.launched}

Running:
${launcherState.running}

Launch Count:
${launcherState.launchCount}

Health:
${launcherState.health}

Last Launch:
${launcherState.lastLaunch}

History Records:
${launcherState.history.length}

==================================
`);

    return result;

}

/*
==================================================
RESET
==================================================
*/

function resetLauncherState() {

    launcherState = {

        launched: false,

        running: false,

        launchCount: 0,

        lastLaunch: null,

        lastHealthCheck: null,

        health: 100,

        history: []

    };

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    runSystemLauncher,

    executeLaunchSequence,

    calculateLauncherHealth,

    resetLauncherState,

    logLauncher

};
