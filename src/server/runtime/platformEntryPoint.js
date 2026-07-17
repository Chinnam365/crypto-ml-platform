/*
==================================================
AI PLATFORM ENTRY POINT
==================================================
PHASE 44
PART 1
==================================================
*/

const {
    initializeAIPlatform
} = require("../bootstrap/initializeAIPlatform");

const {
    bootTradingPlatform
} = require("../bootstrap/bootSequence");

const {
    runRuntimeController,
    enableAutonomousMode
} = require("./runtimeController");

let platformState = {

    initialized: false,

    booted: false,

    autonomous: false,

    startedAt: null,

    version: "4.0.0",

    status: "OFFLINE"

};

const PLATFORM_STAGES = [

    "Initialize Platform",

    "Boot Platform",

    "Enable Autonomous Runtime",

    "Start Controller",

    "Platform Online"

];

/*
==================================================
LOGGER
==================================================
*/

function logPlatformStage(stage) {

    console.log(`
==================================
AI PLATFORM
==================================

${stage}

==================================
`);

}

/*
==================================================
STATUS
==================================================
*/

function getPlatformStatus() {

    return {

        ...platformState

    };

}
/*
==================================================
PLATFORM STARTUP
==================================================
*/

async function startAIPlatform() {

    platformState.status = "INITIALIZING";

    platformState.startedAt = new Date();

    logPlatformStage(
        PLATFORM_STAGES[0]
    );

    await initializeAIPlatform();

    platformState.initialized = true;

    logPlatformStage(
        PLATFORM_STAGES[1]
    );

    await bootTradingPlatform();

    platformState.booted = true;

    logPlatformStage(
        PLATFORM_STAGES[2]
    );

    await enableAutonomousMode();

    platformState.autonomous = true;

    logPlatformStage(
        PLATFORM_STAGES[3]
    );

    await runRuntimeController();

    platformState.status = "ONLINE";

    logPlatformStage(
        PLATFORM_STAGES[4]
    );

    return {

        success: true,

        status:
            platformState.status,

        initialized:
            platformState.initialized,

        booted:
            platformState.booted,

        autonomous:
            platformState.autonomous,

        startedAt:
            platformState.startedAt

    };

}

/*
==================================================
PLATFORM SHUTDOWN
==================================================
*/

function shutdownPlatform() {

    platformState.status = "OFFLINE";

    platformState.autonomous = false;

    return {

        success: true,

        status: "OFFLINE"

    };

}
/*
==================================================
PLATFORM RESET
==================================================
*/

function resetPlatform() {

    platformState = {

        initialized: false,

        booted: false,

        autonomous: false,

        startedAt: null,

        version: "4.0.0",

        status: "OFFLINE"

    };

}

/*
==================================================
MAIN ENTRY POINT
==================================================
*/

async function runPlatform() {

    try {

        const result = await startAIPlatform();

        console.log(`
==================================
AI PLATFORM STARTED
==================================

Status:
${result.status}

Initialized:
${result.initialized}

Booted:
${result.booted}

Autonomous:
${result.autonomous}

Started:
${result.startedAt}

==================================
`);

        return result;

    } catch (error) {

        console.error(`
==================================
PLATFORM STARTUP FAILED
==================================

${error.message}

==================================
`);

        platformState.status = "ERROR";

        return {

            success: false,

            status: "ERROR",

            error: error.message

        };

    }

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    runPlatform,

    startAIPlatform,

    shutdownPlatform,

    getPlatformStatus,

    resetPlatform,

    logPlatformStage

};
