/*
==================================================
SYSTEM SUPERVISOR
==================================================
PHASE 39
PART 1
==================================================
*/

const {
    runAutonomousEvolution
} = require("./autonomousEvolutionEngine");

const {
    runContinuousMonitoring
} = require("./continuousMonitoringEngine");

const {
    runAutonomousRecovery
} = require("./autonomousRecoveryEngine");

const {
    analyzeProductionOptimization
} = require("../../production/phase30/productionOptimizationEngine");

const {
    analyzeMasterOrchestrator
} = require("../../ml/masterOrchestratorV2");

let supervisorState = {

    running: false,

    supervisionCycles: 0,

    decisions: 0,

    interventions: 0,

    emergencyActions: 0,

    status: "INITIALIZING",

    history: []

};

const SUPERVISOR_STAGES = [

    "Continuous Monitoring",

    "Production Assessment",

    "Recovery Assessment",

    "Evolution Assessment",

    "Decision",

    "Platform Supervision"

];

/*
==================================================
LOGGER
==================================================
*/

function logSupervisorStage(stage) {

    console.log(`
==================================
SYSTEM SUPERVISOR
==================================

${stage}

==================================
`);

}

/*
==================================================
SUPERVISOR SCORE
==================================================
*/

function calculateSupervisorScore({

    monitoring,

    optimization,

    orchestrator,

    evolution

}) {

    const monitoringScore =

        monitoring.platformHealth === "WORLD_CLASS"

            ? 100

        : monitoring.platformHealth === "EXCELLENT"

            ? 90

        : monitoring.platformHealth === "HEALTHY"

            ? 75

        : monitoring.platformHealth === "WARNING"

            ? 50

        : 20;

    const evolutionScore =
        evolution.currentScore || 0;

    return Number((

        monitoringScore * 0.30 +

        Number(
            optimization.optimizationScore || 0
        ) * 0.30 +

        Number(
            orchestrator.masterScore || 0
        ) * 0.20 +

        evolutionScore * 0.20

    ).toFixed(2));

}
/*
==================================================
SUPERVISION ENGINE
==================================================
*/

async function executeSupervisionCycle() {

    supervisorState.running = true;

    supervisorState.supervisionCycles++;

    logSupervisorStage(
        SUPERVISOR_STAGES[0]
    );

    const monitoring =
        await runContinuousMonitoring();

    logSupervisorStage(
        SUPERVISOR_STAGES[1]
    );

    const optimization =
        await analyzeProductionOptimization();

    const orchestrator =
        await analyzeMasterOrchestrator();

    logSupervisorStage(
        SUPERVISOR_STAGES[2]
    );

    const recovery =
        await runAutonomousRecovery();

    logSupervisorStage(
        SUPERVISOR_STAGES[3]
    );

    const evolution =
        await runAutonomousEvolution();

    logSupervisorStage(
        SUPERVISOR_STAGES[4]
    );

    const supervisorScore =
        calculateSupervisorScore({

            monitoring,

            optimization,

            orchestrator,

            evolution

        });

    supervisorState.decisions++;

    let decision =
        "CONTINUE_NORMAL_OPERATION";

    if (

        monitoring.platformHealth ===
        "CRITICAL"

    ) {

        decision =
            "EMERGENCY_RECOVERY";

        supervisorState.emergencyActions++;

    }

    else if (

        supervisorScore < 70

    ) {

        decision =
            "INITIATE_RECOVERY";

        supervisorState.interventions++;

    }

    else if (

        supervisorScore >= 90

    ) {

        decision =
            "ENABLE_AUTONOMOUS_MODE";

    }

    supervisorState.status = decision;

    supervisorState.history.push({

        timestamp:
            new Date(),

        supervisorScore,

        platformHealth:
            monitoring.platformHealth,

        optimizationScore:
            optimization.optimizationScore,

        masterScore:
            orchestrator.masterScore,

        evolutionScore:
            evolution.currentScore,

        decision

    });

    if (

        supervisorState.history.length >

        1000

    ) {

        supervisorState.history.shift();

    }

    logSupervisorStage(
        SUPERVISOR_STAGES[5]
    );

}
/*
==================================================
MAIN SYSTEM SUPERVISOR
==================================================
*/

async function runSystemSupervisor() {

    console.log(`
==================================
SYSTEM SUPERVISOR
==================================
`);

    await executeSupervisionCycle();

    supervisorState.running = false;

    console.log(`
==================================
SUPERVISOR SUMMARY
==================================

Supervision Cycles:
${supervisorState.supervisionCycles}

Decisions:
${supervisorState.decisions}

Interventions:
${supervisorState.interventions}

Emergency Actions:
${supervisorState.emergencyActions}

Current Status:
${supervisorState.status}

History Records:
${supervisorState.history.length}

==================================
`);

    return {

        running:
            supervisorState.running,

        supervisionCycles:
            supervisorState.supervisionCycles,

        decisions:
            supervisorState.decisions,

        interventions:
            supervisorState.interventions,

        emergencyActions:
            supervisorState.emergencyActions,

        status:
            supervisorState.status,

        history:
            supervisorState.history

    };

}

/*
==================================================
STATE
==================================================
*/

function getSupervisorState() {

    return {

        ...supervisorState

    };

}

function resetSupervisorState() {

    supervisorState = {

        running: false,

        supervisionCycles: 0,

        decisions: 0,

        interventions: 0,

        emergencyActions: 0,

        status: "INITIALIZING",

        history: []

    };

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    runSystemSupervisor,

    executeSupervisionCycle,

    calculateSupervisorScore,

    getSupervisorState,

    resetSupervisorState,

    logSupervisorStage

};
