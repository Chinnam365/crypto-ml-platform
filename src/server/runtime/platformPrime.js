/*
==================================================
AI PLATFORM PRIME
==================================================
PHASE 58
PART 1
==================================================
*/

const {
    runPlatformPresident
} = require("./platformPresident");

const {
    getPlatformStatus
} = require("./platformEntryPoint");

const {
    getControllerState
} = require("./runtimeController");

let primeState = {

    initialized: false,

    active: false,

    cycles: 0,

    lastCycle: null,

    health: 100,

    status: "OFFLINE",

    history: []

};

const PRIME_STAGES = [

    "Initialize Prime",

    "Validate Platform",

    "Validate Runtime",

    "Platform Prime Online"

];

/*
==================================================
LOGGER
==================================================
*/

function logPrime(message) {

    console.log(`
==================================
AI PLATFORM PRIME
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

function calculatePrimeHealth() {

    const platform = getPlatformStatus();

    const controller = getControllerState();

    let score = 100;

    if (platform.status !== "ONLINE")
        score -= 40;

    if (!controller.initialized)
        score -= 20;

    if (controller.mode !== "AUTONOMOUS")
        score -= 20;

    primeState.health = Math.max(score, 0);

    return primeState.health;

}
/*
==================================================
PRIME EXECUTION
==================================================
*/

async function startPlatformPrime() {

    primeState.status = "STARTING";

    logPrime(
        PRIME_STAGES[0]
    );

    const president =
        await runPlatformPresident();

    primeState.initialized =
        president.success;

    primeState.cycles++;

    primeState.lastCycle =
        new Date();

    logPrime(
        PRIME_STAGES[1]
    );

    const platform =
        getPlatformStatus();

    logPrime(
        PRIME_STAGES[2]
    );

    const controller =
        getControllerState();

    const health =
        calculatePrimeHealth();

    if (

        president.success &&

        health >= 90 &&

        platform.status === "ONLINE"

    ) {

        primeState.active = true;

        primeState.status = "ONLINE";

    } else {

        primeState.active = false;

        primeState.status = "DEGRADED";

    }

    primeState.history.push({

        timestamp:
            new Date(),

        status:
            primeState.status,

        health,

        platformStatus:
            platform.status,

        controllerMode:
            controller.mode

    });

    if (

        primeState.history.length >

        1000

    ) {

        primeState.history.shift();

    }

    logPrime(
        PRIME_STAGES[3]
    );

    return {

        success:
            primeState.active,

        status:
            primeState.status,

        health,

        cycles:
            primeState.cycles,

        platform,

        controller

    };

}
/*
==================================================
RUN PLATFORM PRIME
==================================================
*/

async function runPlatformPrime() {

    console.log(`
==================================
AI PLATFORM PRIME
==================================
`);

    const result = await startPlatformPrime();

    console.log(`
==================================
PLATFORM PRIME SUMMARY
==================================

Status:
${primeState.status}

Active:
${primeState.active}

Initialized:
${primeState.initialized}

Cycles:
${primeState.cycles}

Health:
${primeState.health}

Last Cycle:
${primeState.lastCycle}

History Records:
${primeState.history.length}

==================================
`);

    return result;

}

/*
==================================================
RESET
==================================================
*/

function resetPrimeState() {

    primeState = {

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

    runPlatformPrime,

    startPlatformPrime,

    calculatePrimeHealth,

    resetPrimeState,

    logPrime

};
