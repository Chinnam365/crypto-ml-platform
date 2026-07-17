/*
==================================================
AI PLATFORM BOOT SEQUENCE
==================================================
PHASE 32
PART 1
==================================================
*/

const {
    initializeAIPlatform
} = require("./initializeAIPlatform");

const {
    analyzeProductionOptimization
} = require("../../production/phase30/productionOptimizationEngine");

const {
    scanUniverse
} = require("../../ml/marketScanner");

const {
    buildDiscoveryRanking
} = require("../../ml/discoveryRanking");

const {
    selectBestMarkets
} = require("../../ml/discoverySelector");

let bootState = {

    started: false,

    completed: false,

    readyForTrading: false,

    startupTime: null,

    marketUniverse: [],

    selectedMarkets: []

};

const BOOT_STEPS = [

    "Initialize AI Platform",

    "Warm AI Cache",

    "Scan Market",

    "Rank Markets",

    "Select Markets",

    "Production Validation"

];

/*
==================================================
BOOT LOGGER
==================================================
*/

function logBootStep(step) {

    console.log(`
==================================
BOOT STEP
==================================

${step}

==================================
`);

}

/*
==================================================
BOOT STATUS
==================================================
*/

function getBootStatus() {

    return {

        ...bootState,

        steps: BOOT_STEPS

    };

}
/*
==================================================
BOOT PROCESS
==================================================
*/

async function executeBootSequence() {

    try {

        bootState.started = true;

        bootState.startupTime =
            new Date();

        logBootStep(
            BOOT_STEPS[0]
        );

        await initializeAIPlatform();

        logBootStep(
            BOOT_STEPS[1]
        );

        await analyzeProductionOptimization();

        logBootStep(
            BOOT_STEPS[2]
        );

        bootState.marketUniverse =
            await scanUniverse();

        logBootStep(
            BOOT_STEPS[3]
        );

        const rankedMarkets =
            await buildDiscoveryRanking(

                bootState.marketUniverse

            );

        logBootStep(
            BOOT_STEPS[4]
        );

        bootState.selectedMarkets =
            await selectBestMarkets(

                rankedMarkets

            );

    }

    catch (error) {

        console.log(`
==================================
BOOT FAILURE
==================================

${error.stack}

==================================
`);

        throw error;

    }

}

/*
==================================================
PRODUCTION VALIDATION
==================================================
*/

async function validateProductionReadiness() {

    const optimization =
        await analyzeProductionOptimization();

    const ready =

        optimization.optimizationScore >= 80

        &&

        optimization.optimizationStatus !==
        "RECOVERY";

    bootState.readyForTrading =
        ready;

    return {

        ready,

        score:
            optimization.optimizationScore,

        status:
            optimization.optimizationStatus

    };

}
/*
==================================================
MAIN BOOT SEQUENCE
==================================================
*/

async function bootTradingPlatform() {

    console.log(`
==================================
STARTING AI TRADING PLATFORM
==================================
`);

    await executeBootSequence();

    logBootStep(
        BOOT_STEPS[5]
    );

    const validation =
        await validateProductionReadiness();

    bootState.completed = true;

    console.log(`
==================================
BOOT COMPLETE
==================================

Startup:
${bootState.startupTime}

Markets Scanned:
${bootState.marketUniverse.length}

Markets Selected:
${bootState.selectedMarkets.length}

Ready For Trading:
${validation.ready}

Optimization Score:
${validation.score}

Platform Status:
${validation.status}

==================================
`);

    return {

        started:
            bootState.started,

        completed:
            bootState.completed,

        readyForTrading:
            validation.ready,

        startupTime:
            bootState.startupTime,

        optimizationScore:
            validation.score,

        optimizationStatus:
            validation.status,

        marketUniverse:
            bootState.marketUniverse,

        selectedMarkets:
            bootState.selectedMarkets

    };

}

/*
==================================================
RESET BOOT STATE
==================================================
*/

function resetBootState() {

    bootState = {

        started: false,

        completed: false,

        readyForTrading: false,

        startupTime: null,

        marketUniverse: [],

        selectedMarkets: []

    };

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    bootTradingPlatform,

    executeBootSequence,

    validateProductionReadiness,

    getBootStatus,

    resetBootState,

    logBootStep

};
