/*
==================================================
AUTONOMOUS RUNTIME SCHEDULER
==================================================
PHASE 41
PART 1
==================================================
*/

const {
    startAutonomousRuntime
} = require("./autonomousRuntime");

let schedulerState = {

    running: false,

    timer: null,

    intervalMs: 60000,

    startedAt: null,

    lastRun: null,

    totalRuns: 0,

    successfulRuns: 0,

    failedRuns: 0

};

/*
==================================================
LOGGER
==================================================
*/

function logScheduler(message) {

    console.log(`
==================================
RUNTIME SCHEDULER
==================================

${message}

==================================
`);

}

/*
==================================================
SCHEDULER STATUS
==================================================
*/

function getSchedulerState() {

    return {

        running:
            schedulerState.running,

        intervalMs:
            schedulerState.intervalMs,

        startedAt:
            schedulerState.startedAt,

        lastRun:
            schedulerState.lastRun,

        totalRuns:
            schedulerState.totalRuns,

        successfulRuns:
            schedulerState.successfulRuns,

        failedRuns:
            schedulerState.failedRuns

    };

}

/*
==================================================
CONFIGURATION
==================================================
*/

function setSchedulerInterval(intervalMs) {

    schedulerState.intervalMs =

        Math.max(

            1000,

            Number(intervalMs) || 60000

        );

}
/*
==================================================
SCHEDULER ENGINE
==================================================
*/

async function executeScheduledRuntime() {

    schedulerState.totalRuns++;

    schedulerState.lastRun =
        new Date();

    try {

        logScheduler(
            "Starting Autonomous Runtime Cycle"
        );

        await startAutonomousRuntime();

        schedulerState.successfulRuns++;

        logScheduler(
            "Runtime Cycle Completed Successfully"
        );

    }

    catch (error) {

        schedulerState.failedRuns++;

        console.log(`
==================================
SCHEDULER ERROR
==================================

${error.stack}

==================================
`);

    }

}

/*
==================================================
START SCHEDULER
==================================================
*/

function startRuntimeScheduler() {

    if (schedulerState.running) {

        return;

    }

    schedulerState.running = true;

    schedulerState.startedAt =
        new Date();

    logScheduler(
        `Scheduler Started (${schedulerState.intervalMs} ms)`
    );

    schedulerState.timer =

        setInterval(

            executeScheduledRuntime,

            schedulerState.intervalMs

        );

}

/*
==================================================
STOP SCHEDULER
==================================================
*/

function stopRuntimeScheduler() {

    if (!schedulerState.running) {

        return;

    }

    clearInterval(

        schedulerState.timer

    );

    schedulerState.timer = null;

    schedulerState.running = false;

    logScheduler(
        "Scheduler Stopped"
    );

}
/*
==================================================
MAIN RUNTIME SCHEDULER
==================================================
*/

async function runRuntimeScheduler() {

    console.log(`
==================================
AUTONOMOUS RUNTIME SCHEDULER
==================================
`);

    if (!schedulerState.running) {

        startRuntimeScheduler();

    }

    await executeScheduledRuntime();

    console.log(`
==================================
SCHEDULER SUMMARY
==================================

Running:
${schedulerState.running}

Started At:
${schedulerState.startedAt}

Interval (ms):
${schedulerState.intervalMs}

Total Runs:
${schedulerState.totalRuns}

Successful Runs:
${schedulerState.successfulRuns}

Failed Runs:
${schedulerState.failedRuns}

Last Run:
${schedulerState.lastRun}

==================================
`);

    return {

        running:
            schedulerState.running,

        startedAt:
            schedulerState.startedAt,

        intervalMs:
            schedulerState.intervalMs,

        totalRuns:
            schedulerState.totalRuns,

        successfulRuns:
            schedulerState.successfulRuns,

        failedRuns:
            schedulerState.failedRuns,

        lastRun:
            schedulerState.lastRun

    };

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    runRuntimeScheduler,

    executeScheduledRuntime,

    startRuntimeScheduler,

    stopRuntimeScheduler,

    getSchedulerState,

    setSchedulerInterval,

    logScheduler

};
