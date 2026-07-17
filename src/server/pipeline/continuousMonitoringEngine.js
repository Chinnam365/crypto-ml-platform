/*
==================================================
CONTINUOUS MONITORING ENGINE
==================================================
PHASE 36
PART 1
==================================================
*/

const {
    runPostTradeLearningPipeline
} = require("./postTradeLearningPipeline");

const {
    analyzeProductionOptimization
} = require("../../production/phase30/productionOptimizationEngine");

const {
    analyzeMasterOrchestrator
} = require("../../ml/masterOrchestratorV2");

const {
    analyzeAICompliance
} = require("../../ml/aiGovernanceCompliance");

const {
    analyzeSystemValidation
} = require("../../tests/phase29/systemValidationSuite");

let monitoringState = {

    running: false,

    monitoringStarted: null,

    lastHealthCheck: null,

    platformHealth: "UNKNOWN",

    alerts: [],

    metrics: {}

};

const MONITORING_STAGES = [

    "Production Optimization",

    "System Validation",

    "AI Governance",

    "Master Orchestrator",

    "Learning Pipeline",

    "Platform Health"

];

/*
==================================================
LOGGER
==================================================
*/

function logMonitoringStage(stage) {

    console.log(`
==================================
CONTINUOUS MONITORING
==================================

${stage}

==================================
`);

}

/*
==================================================
PLATFORM HEALTH
==================================================
*/

function calculateOverallHealth({

    optimization,

    validation,

    governance,

    orchestrator

}) {

    const score = (

        Number(
            optimization.optimizationHealth || 0
        ) * 0.35 +

        Number(
            validation.validationHealth || 0
        ) * 0.25 +

        Number(
            governance.complianceHealth || 0
        ) * 0.20 +

        Number(
            orchestrator.masterHealth || 0
        ) * 0.20

    );

    if (score >= 95)
        return "WORLD_CLASS";

    if (score >= 85)
        return "EXCELLENT";

    if (score >= 70)
        return "HEALTHY";

    if (score >= 55)
        return "WARNING";

    return "CRITICAL";

}

/*
==================================================
STATE
==================================================
*/

function getMonitoringState() {

    return {

        ...monitoringState,

        stages: MONITORING_STAGES

    };

}
/*
==================================================
MONITORING ENGINE
==================================================
*/

async function executeMonitoringCycle() {

    monitoringState.running = true;

    monitoringState.lastHealthCheck =
        new Date();

    logMonitoringStage(
        MONITORING_STAGES[0]
    );

    const optimization =
        await analyzeProductionOptimization();

    logMonitoringStage(
        MONITORING_STAGES[1]
    );

    const validation =
        await analyzeSystemValidation();

    logMonitoringStage(
        MONITORING_STAGES[2]
    );

    const governance =
        await analyzeAICompliance();

    logMonitoringStage(
        MONITORING_STAGES[3]
    );

    const orchestrator =
        await analyzeMasterOrchestrator();

    logMonitoringStage(
        MONITORING_STAGES[4]
    );

    const learning =
        await runPostTradeLearningPipeline();

    logMonitoringStage(
        MONITORING_STAGES[5]
    );

    monitoringState.platformHealth =
        calculateOverallHealth({

            optimization,

            validation,

            governance,

            orchestrator

        });

    monitoringState.metrics = {

        optimizationScore:
            optimization.optimizationScore,

        validationScore:
            validation.validationScore,

        complianceScore:
            governance.complianceScore,

        masterScore:
            orchestrator.masterScore,

        learningProcessed:
            learning.processed,

        learningSuccessful:
            learning.successful,

        learningFailed:
            learning.failed

    };

    monitoringState.alerts = [];

    if (
        monitoringState.platformHealth ===
        "CRITICAL"
    ) {

        monitoringState.alerts.push({

            severity: "HIGH",

            code: "PLATFORM_HEALTH",

            message:
                "Platform health is CRITICAL."

        });

    }

    if (
        governance.recommendation
            ?.emergencyStop
    ) {

        monitoringState.alerts.push({

            severity: "CRITICAL",

            code: "EMERGENCY_STOP",

            message:
                "AI Governance requested emergency stop."

        });

    }

    if (
        learning.failed > 0
    ) {

        monitoringState.alerts.push({

            severity: "MEDIUM",

            code: "LEARNING_FAILURE",

            message:
                `${learning.failed} learning updates failed.`

        });

    }

}
/*
==================================================
MAIN CONTINUOUS MONITOR
==================================================
*/

async function runContinuousMonitoring() {

    console.log(`
==================================
CONTINUOUS MONITORING ENGINE
==================================
`);

    if (!monitoringState.monitoringStarted) {

        monitoringState.monitoringStarted =
            new Date();

    }

    await executeMonitoringCycle();

    monitoringState.running = false;

    console.log(`
==================================
MONITORING SUMMARY
==================================

Platform Health:
${monitoringState.platformHealth}

Alerts:
${monitoringState.alerts.length}

Optimization Score:
${monitoringState.metrics.optimizationScore}

Validation Score:
${monitoringState.metrics.validationScore}

Compliance Score:
${monitoringState.metrics.complianceScore}

Master Score:
${monitoringState.metrics.masterScore}

Learning Processed:
${monitoringState.metrics.learningProcessed}

==================================
`);

    return {

        running:
            monitoringState.running,

        monitoringStarted:
            monitoringState.monitoringStarted,

        lastHealthCheck:
            monitoringState.lastHealthCheck,

        platformHealth:
            monitoringState.platformHealth,

        alerts:
            monitoringState.alerts,

        metrics:
            monitoringState.metrics

    };

}

/*
==================================================
RESET
==================================================
*/

function resetMonitoringState() {

    monitoringState = {

        running: false,

        monitoringStarted: null,

        lastHealthCheck: null,

        platformHealth: "UNKNOWN",

        alerts: [],

        metrics: {}

    };

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    runContinuousMonitoring,

    executeMonitoringCycle,

    calculateOverallHealth,

    getMonitoringState,

    resetMonitoringState,

    logMonitoringStage

};
