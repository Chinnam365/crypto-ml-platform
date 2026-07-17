/*
==================================================
ENTERPRISE ORCHESTRATOR
==================================================
PHASE 47
PART 1
==================================================
*/

const {
    runProductionManager
} = require("./productionManager");

const {
    getPlatformStatus
} = require("./platformEntryPoint");

const {
    getControllerState
} = require("./runtimeController");

let enterpriseState = {

    initialized: false,

    operational: false,

    executions: 0,

    lastExecution: null,

    health: 100,

    status: "OFFLINE",

    history: []

};

const ENTERPRISE_STAGES = [

    "Initialize Enterprise",

    "Production Validation",

    "Enterprise Verification",

    "Enterprise Online"

];

/*
==================================================
LOGGER
==================================================
*/

function logEnterprise(message) {

    console.log(`
==================================
ENTERPRISE ORCHESTRATOR
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

function calculateEnterpriseHealth() {

    const platform = getPlatformStatus();
    const controller = getControllerState();

    let score = 100;

    if (platform.status !== "ONLINE")
        score -= 40;

    if (!controller.initialized)
        score -= 20;

    if (controller.mode !== "AUTONOMOUS")
        score -= 20;

    enterpriseState.health = Math.max(score, 0);

    return enterpriseState.health;

}
/*
==================================================
ENTERPRISE EXECUTION
==================================================
*/

async function startEnterprise() {

    enterpriseState.status = "STARTING";

    logEnterprise(
        ENTERPRISE_STAGES[0]
    );

    const production =
        await runProductionManager();

    enterpriseState.initialized =
        production.success;

    enterpriseState.executions++;

    enterpriseState.lastExecution =
        new Date();

    logEnterprise(
        ENTERPRISE_STAGES[1]
    );

    const platform =
        getPlatformStatus();

    const controller =
        getControllerState();

    const health =
        calculateEnterpriseHealth();

    if (

        production.success &&

        health >= 85 &&

        platform.status === "ONLINE"

    ) {

        enterpriseState.operational = true;

        enterpriseState.status = "ONLINE";

    } else {

        enterpriseState.operational = false;

        enterpriseState.status = "DEGRADED";

    }

    enterpriseState.history.push({

        timestamp:
            new Date(),

        status:
            enterpriseState.status,

        health,

        platformStatus:
            platform.status,

        controllerMode:
            controller.mode

    });

    if (

        enterpriseState.history.length >

        1000

    ) {

        enterpriseState.history.shift();

    }

    logEnterprise(
        ENTERPRISE_STAGES[2]
    );

    return {

        success:
            enterpriseState.operational,

        status:
            enterpriseState.status,

        health,

        executions:
            enterpriseState.executions,

        platform,

        controller

    };

}
/*
==================================================
RUN ENTERPRISE ORCHESTRATOR
==================================================
*/

async function runEnterpriseOrchestrator() {

    console.log(`
==================================
ENTERPRISE ORCHESTRATOR
==================================
`);

    const result = await startEnterprise();

    logEnterprise(
        ENTERPRISE_STAGES[3]
    );

    console.log(`
==================================
ENTERPRISE SUMMARY
==================================

Status:
${enterpriseState.status}

Operational:
${enterpriseState.operational}

Initialized:
${enterpriseState.initialized}

Executions:
${enterpriseState.executions}

Health:
${enterpriseState.health}

Last Execution:
${enterpriseState.lastExecution}

History Records:
${enterpriseState.history.length}

==================================
`);

    return result;

}

/*
==================================================
RESET
==================================================
*/

function resetEnterpriseState() {

    enterpriseState = {

        initialized: false,

        operational: false,

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

    runEnterpriseOrchestrator,

    startEnterprise,

    calculateEnterpriseHealth,

    resetEnterpriseState,

    logEnterprise

};
