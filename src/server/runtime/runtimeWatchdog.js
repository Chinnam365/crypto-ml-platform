/*
==================================================
AUTONOMOUS RUNTIME WATCHDOG
==================================================
PHASE 42
PART 1
==================================================
*/

const {
    getRuntimeState,
    startAutonomousRuntime
} = require("./autonomousRuntime");

const {
    runAutonomousRecovery
} = require("../pipeline/autonomousRecoveryEngine");

const {
    getSchedulerState
} = require("./runtimeScheduler");

let watchdogState = {

    running: false,

    checks: 0,

    recoveries: 0,

    failures: 0,

    lastCheck: null,

    lastRecovery: null,

    alerts: []

};

const WATCHDOG_STAGES = [

    "Runtime Inspection",

    "Scheduler Inspection",

    "Health Assessment",

    "Recovery Decision",

    "Recovery Execution",

    "Verification"

];

/*
==================================================
LOGGER
==================================================
*/

function logWatchdog(stage) {

    console.log(`
==================================
RUNTIME WATCHDOG
==================================

${stage}

==================================
`);

}

/*
==================================================
WATCHDOG HEALTH
==================================================
*/

function calculateWatchdogHealth({

    runtime,

    scheduler

}) {

    let score = 100;

    if (!runtime.running) {

        score -= 25;

    }

    if (runtime.failedCycles > 0) {

        score -= Math.min(
            runtime.failedCycles * 5,
            30
        );

    }

    if (!scheduler.running) {

        score -= 20;

    }

    return Math.max(
        0,
        Number(score.toFixed(2))
    );

}
/*
==================================================
WATCHDOG ENGINE
==================================================
*/

async function executeWatchdogCycle() {

    watchdogState.running = true;

    watchdogState.checks++;

    watchdogState.lastCheck =
        new Date();

    watchdogState.alerts = [];

    logWatchdog(
        WATCHDOG_STAGES[0]
    );

    const runtime =
        getRuntimeState();

    logWatchdog(
        WATCHDOG_STAGES[1]
    );

    const scheduler =
        getSchedulerState();

    logWatchdog(
        WATCHDOG_STAGES[2]
    );

    const watchdogHealth =
        calculateWatchdogHealth({

            runtime,

            scheduler

        });

    let recoveryRequired = false;

    if (watchdogHealth < 70) {

        recoveryRequired = true;

        watchdogState.alerts.push({

            severity: "HIGH",

            code: "LOW_RUNTIME_HEALTH",

            message:
                `Runtime health dropped to ${watchdogHealth}.`

        });

    }

    if (!scheduler.running) {

        recoveryRequired = true;

        watchdogState.alerts.push({

            severity: "CRITICAL",

            code: "SCHEDULER_STOPPED",

            message:
                "Runtime Scheduler is not running."

        });

    }

    if (runtime.status === "ERROR") {

        recoveryRequired = true;

        watchdogState.alerts.push({

            severity: "CRITICAL",

            code: "RUNTIME_ERROR",

            message:
                runtime.lastError?.message ||
                "Unknown runtime failure."

        });

    }

    logWatchdog(
        WATCHDOG_STAGES[3]
    );

    if (recoveryRequired) {

        logWatchdog(
            WATCHDOG_STAGES[4]
        );

        await runAutonomousRecovery();

        await startAutonomousRuntime();

        watchdogState.recoveries++;

        watchdogState.lastRecovery =
            new Date();

    }

    logWatchdog(
        WATCHDOG_STAGES[5]
    );

    watchdogState.running = false;

}
/*
==================================================
MAIN RUNTIME WATCHDOG
==================================================
*/

async function runRuntimeWatchdog() {

    console.log(`
==================================
AUTONOMOUS RUNTIME WATCHDOG
==================================
`);

    await executeWatchdogCycle();

    console.log(`
==================================
WATCHDOG SUMMARY
==================================

Checks:
${watchdogState.checks}

Recoveries:
${watchdogState.recoveries}

Failures:
${watchdogState.failures}

Last Check:
${watchdogState.lastCheck}

Last Recovery:
${watchdogState.lastRecovery}

Active Alerts:
${watchdogState.alerts.length}

==================================
`);

    return {

        running:
            watchdogState.running,

        checks:
            watchdogState.checks,

        recoveries:
            watchdogState.recoveries,

        failures:
            watchdogState.failures,

        lastCheck:
            watchdogState.lastCheck,

        lastRecovery:
            watchdogState.lastRecovery,

        alerts:
            watchdogState.alerts

    };

}

/*
==================================================
RESET
==================================================
*/

function resetWatchdogState() {

    watchdogState = {

        running: false,

        checks: 0,

        recoveries: 0,

        failures: 0,

        lastCheck: null,

        lastRecovery: null,

        alerts: []

    };

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    runRuntimeWatchdog,

    executeWatchdogCycle,

    calculateWatchdogHealth,

    resetWatchdogState,

    logWatchdog

};
