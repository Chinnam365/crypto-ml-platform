/*
==================================================
AUTONOMOUS RUNTIME
==================================================
PHASE 40
PART 1
==================================================
*/

const {
    runSystemSupervisor
} = require("../pipeline/systemSupervisor");

const {
    bootTradingPlatform
} = require("../bootstrap/bootSequence");

const {
    runTradeExecutionGateway
} = require("../pipeline/tradeExecutionGateway");

const {
    runContinuousMonitoring
} = require("../pipeline/continuousMonitoringEngine");

const {
    runAutonomousEvolution
} = require("../pipeline/autonomousEvolutionEngine");

let runtimeState = {

    running: false,

    startedAt: null,

    cycle: 0,

    successfulCycles: 0,

    failedCycles: 0,

    uptimeSeconds: 0,

    status: "STOPPED"

};

const RUNTIME_STAGES = [

    "Boot",

    "Supervisor",

    "Trading",

    "Monitoring",

    "Evolution",

    "Cycle Complete"

];

/*
==================================================
LOGGER
==================================================
*/

function logRuntimeStage(stage) {

    console.log(`
==================================
AUTONOMOUS RUNTIME
==================================

${stage}

==================================
`);

}

/*
==================================================
RUNTIME HEALTH
==================================================
*/

function calculateRuntimeHealth({

    supervisor,

    monitoring

}) {

    const emergencyPenalty =

        supervisor.emergencyActions * 10;

    const interventionPenalty =

        supervisor.interventions * 5;

    const score =

        100

        - emergencyPenalty

        - interventionPenalty

        - monitoring.alerts.length;

    return Math.max(

        0,

        Number(score.toFixed(2))

    );

}
/*
==================================================
AUTONOMOUS RUNTIME ENGINE
==================================================
*/

async function executeRuntimeCycle() {

    runtimeState.running = true;

    runtimeState.status =
        "RUNNING";

    runtimeState.cycle++;

    try {

        logRuntimeStage(
            RUNTIME_STAGES[0]
        );

        if (!runtimeState.startedAt) {

            runtimeState.startedAt =
                new Date();

            await bootTradingPlatform();

        }

        logRuntimeStage(
            RUNTIME_STAGES[1]
        );

        const supervisor =
            await runSystemSupervisor();

        logRuntimeStage(
            RUNTIME_STAGES[2]
        );

        const trading =
            await runTradeExecutionGateway();

        logRuntimeStage(
            RUNTIME_STAGES[3]
        );

        const monitoring =
            await runContinuousMonitoring();

        logRuntimeStage(
            RUNTIME_STAGES[4]
        );

        const evolution =
            await runAutonomousEvolution();

        runtimeState.uptimeSeconds =
            Math.floor(

                (
                    Date.now()

                    -

                    runtimeState.startedAt.getTime()

                ) / 1000

            );

        runtimeState.health =
            calculateRuntimeHealth({

                supervisor,

                monitoring

            });

        runtimeState.lastCycle = {

            timestamp:
                new Date(),

            supervisor,

            trading,

            monitoring,

            evolution,

            runtimeHealth:
                runtimeState.health

        };

        runtimeState.successfulCycles++;

        logRuntimeStage(
            RUNTIME_STAGES[5]
        );

    }

    catch (error) {

        runtimeState.failedCycles++;

        runtimeState.status =
            "ERROR";

        runtimeState.lastError = {

            timestamp:
                new Date(),

            message:
                error.message,

            stack:
                error.stack

        };

        console.log(`
==================================
AUTONOMOUS RUNTIME ERROR
==================================

${error.stack}

==================================
`);

    }

}
/*
==================================================
MAIN AUTONOMOUS RUNTIME
==================================================
*/

async function startAutonomousRuntime() {

    console.log(`
==================================
AUTONOMOUS AI RUNTIME STARTING
==================================
`);

    await executeRuntimeCycle();

    runtimeState.running = false;

    runtimeState.status =
        "IDLE";

    console.log(`
==================================
AUTONOMOUS RUNTIME SUMMARY
==================================

Started:
${runtimeState.startedAt}

Cycles:
${runtimeState.cycle}

Successful Cycles:
${runtimeState.successfulCycles}

Failed Cycles:
${runtimeState.failedCycles}

Uptime (Seconds):
${runtimeState.uptimeSeconds}

Runtime Health:
${runtimeState.health}

Current Status:
${runtimeState.status}

==================================
`);

    return {

        running:
            runtimeState.running,

        startedAt:
            runtimeState.startedAt,

        cycle:
            runtimeState.cycle,

        successfulCycles:
            runtimeState.successfulCycles,

        failedCycles:
            runtimeState.failedCycles,

        uptimeSeconds:
            runtimeState.uptimeSeconds,

        runtimeHealth:
            runtimeState.health,

        status:
            runtimeState.status,

        lastCycle:
            runtimeState.lastCycle,

        lastError:
            runtimeState.lastError || null

    };

}

/*
==================================================
STATE
==================================================
*/

function getRuntimeState() {

    return {

        ...runtimeState

    };

}

function resetRuntimeState() {

    runtimeState = {

        running: false,

        startedAt: null,

        cycle: 0,

        successfulCycles: 0,

        failedCycles: 0,

        uptimeSeconds: 0,

        health: 0,

        status: "STOPPED",

        lastCycle: null,

        lastError: null

    };

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    startAutonomousRuntime,

    executeRuntimeCycle,

    calculateRuntimeHealth,

    getRuntimeState,

    resetRuntimeState,

    logRuntimeStage

};
