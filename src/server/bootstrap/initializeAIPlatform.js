/*
==================================================
AI PLATFORM INITIALIZER
==================================================
PHASE 31
PART 1
==================================================
*/

const {
    analyzeProductionOptimization
} = require("../../production/phase30/productionOptimizationEngine");

const {
    analyzeSystemValidation
} = require("../../tests/phase29/systemValidationSuite");

const {
    analyzeMasterIntegration
} = require("../integration/masterOrchestratorIntegration");

const {
    analyzeMasterOrchestrator
} = require("../../ml/masterOrchestratorV2");

const {
    analyzeAICompliance
} = require("../../ml/aiGovernanceCompliance");

const {
    analyzeExplainableAI
} = require("../../ml/explainableAIEngine");

const {
    analyzeDigitalTwin
} = require("../../ml/digitalTwinEngine");

let platformState = {

    initialized: false,

    startupTime: null,

    health: "UNKNOWN",

    enginesLoaded: [],

    failures: []

};

/*
==================================================
REGISTER ENGINE
==================================================
*/

function registerEngine(name) {

    if (!platformState.enginesLoaded.includes(name)) {

        platformState.enginesLoaded.push(name);

    }

}

/*
==================================================
REGISTER FAILURE
==================================================
*/

function registerFailure(name, error) {

    platformState.failures.push({

        engine: name,

        error: error.message,

        timestamp: new Date()

    });

}

/*
==================================================
ENGINE HEALTH
==================================================
*/

function calculatePlatformHealth() {

    if (platformState.failures.length === 0) {

        return "HEALTHY";

    }

    if (platformState.failures.length <= 2) {

        return "DEGRADED";

    }

    return "UNHEALTHY";

}
/*
==================================================
INITIALIZE AI ENGINES
==================================================
*/

async function initializeAIEngines() {

    try {

        await analyzeExplainableAI();
        registerEngine("Explainable AI");

        await analyzeDigitalTwin();
        registerEngine("Digital Twin");

        await analyzeAICompliance();
        registerEngine("AI Governance");

        await analyzeMasterOrchestrator();
        registerEngine("Master Orchestrator");

        await analyzeMasterIntegration();
        registerEngine("Master Integration");

        await analyzeSystemValidation();
        registerEngine("System Validation");

        await analyzeProductionOptimization();
        registerEngine("Production Optimization");

    }

    catch (error) {

        registerFailure(
            "Initialization",
            error
        );

    }

}

/*
==================================================
WARM PLATFORM
==================================================
*/

async function warmPlatformCaches() {

    console.log(`
==================================
WARMING AI PLATFORM
==================================
`);

    await initializeAIEngines();

    console.log(`
AI Platform Cache Warmed
`);

}

/*
==================================================
BOOT HEALTH CHECK
==================================================
*/

function runBootHealthCheck() {

    platformState.health =
        calculatePlatformHealth();

    return {

        initialized:
            platformState.initialized,

        health:
            platformState.health,

        enginesLoaded:
            platformState.enginesLoaded.length,

        failures:
            platformState.failures.length

    };

}
/*
==================================================
MAIN INITIALIZER
==================================================
*/

async function initializeAIPlatform() {

    console.log(`
==================================
INITIALIZING AI PLATFORM
==================================
`);

    platformState.startupTime =
        new Date();

    await warmPlatformCaches();

    platformState.initialized = true;

    platformState.health =
        calculatePlatformHealth();

    console.log(`
==================================
AI PLATFORM READY
==================================

Startup:
${platformState.startupTime}

Health:
${platformState.health}

Engines Loaded:
${platformState.enginesLoaded.length}

Failures:
${platformState.failures.length}

==================================
`);

    return {

        initialized:
            platformState.initialized,

        startupTime:
            platformState.startupTime,

        health:
            platformState.health,

        engines:
            platformState.enginesLoaded,

        failures:
            platformState.failures

    };

}

/*
==================================================
PLATFORM STATE
==================================================
*/

function getPlatformState() {

    return {

        ...platformState

    };

}

function resetPlatformState() {

    platformState = {

        initialized: false,

        startupTime: null,

        health: "UNKNOWN",

        enginesLoaded: [],

        failures: []

    };

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    initializeAIPlatform,

    initializeAIEngines,

    warmPlatformCaches,

    runBootHealthCheck,

    getPlatformState,

    resetPlatformState,

    registerEngine,

    registerFailure,

    calculatePlatformHealth

};
