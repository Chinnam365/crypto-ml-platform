/*
==================================================
PRODUCTION MANAGER
==================================================
PHASE 46
PART 1
==================================================
*/

const {
    runSystemLauncher
} = require("./systemLauncher");

const {
    getPlatformStatus
} = require("./platformEntryPoint");

const {
    getControllerState
} = require("./runtimeController");

let productionState = {

    online: false,

    initialized: false,

    deployments: 0,

    lastDeployment: null,

    uptimeStarted: null,

    health: 100,

    incidents: [],

    status: "OFFLINE"

};

const PRODUCTION_STAGES = [

    "Launching Platform",

    "Verifying Runtime",

    "Production Validation",

    "Production Online"

];

/*
==================================================
LOGGER
==================================================
*/

function logProduction(message) {

    console.log(`
==================================
PRODUCTION MANAGER
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

function calculateProductionHealth() {

    const platform = getPlatformStatus();
    const controller = getControllerState();

    let score = 100;

    if (platform.status !== "ONLINE")
        score -= 40;

    if (!controller.initialized)
        score -= 20;

    if (controller.mode !== "AUTONOMOUS")
        score -= 20;

    productionState.health = Math.max(score, 0);

    return productionState.health;

}
/*
==================================================
PRODUCTION EXECUTION
==================================================
*/

async function startProduction() {

    productionState.status = "STARTING";

    logProduction(
        PRODUCTION_STAGES[0]
    );

    const launcherResult =
        await runSystemLauncher();

    productionState.initialized =
        launcherResult.success;

    productionState.deployments++;

    productionState.lastDeployment =
        new Date();

    productionState.uptimeStarted =
        new Date();

    logProduction(
        PRODUCTION_STAGES[1]
    );

    const platform =
        getPlatformStatus();

    const controller =
        getControllerState();

    const health =
        calculateProductionHealth();

    if (

        launcherResult.success &&

        health >= 80 &&

        platform.status === "ONLINE"

    ) {

        productionState.online = true;

        productionState.status = "ONLINE";

    } else {

        productionState.online = false;

        productionState.status = "DEGRADED";

        productionState.incidents.push({

            timestamp: new Date(),

            health,

            platformStatus:
                platform.status,

            controllerMode:
                controller.mode,

            reason:
                "Production validation failed"

        });

    }

    logProduction(
        PRODUCTION_STAGES[2]
    );

    return {

        success:
            productionState.online,

        status:
            productionState.status,

        deployments:
            productionState.deployments,

        health,

        platform,

        controller

    };

}
/*
==================================================
RUN PRODUCTION
==================================================
*/

async function runProductionManager() {

    console.log(`
==================================
PRODUCTION MANAGER
==================================
`);

    const result = await startProduction();

    logProduction(
        PRODUCTION_STAGES[3]
    );

    console.log(`
==================================
PRODUCTION SUMMARY
==================================

Status:
${productionState.status}

Online:
${productionState.online}

Initialized:
${productionState.initialized}

Deployments:
${productionState.deployments}

Health:
${productionState.health}

Last Deployment:
${productionState.lastDeployment}

Uptime Started:
${productionState.uptimeStarted}

Incidents:
${productionState.incidents.length}

==================================
`);

    return result;

}

/*
==================================================
RESET
==================================================
*/

function resetProductionState() {

    productionState = {

        online: false,

        initialized: false,

        deployments: 0,

        lastDeployment: null,

        uptimeStarted: null,

        health: 100,

        incidents: [],

        status: "OFFLINE"

    };

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    runProductionManager,

    startProduction,

    calculateProductionHealth,

    resetProductionState,

    logProduction

};
