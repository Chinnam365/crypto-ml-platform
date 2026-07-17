/*
==================================================
POST TRADE LEARNING PIPELINE
==================================================
PHASE 35
PART 1
==================================================
*/

const {
    runTradeExecutionGateway
} = require("./tradeExecutionGateway");

const {
    storeDecisionMemory
} = require("../../ml/decisionMemory");

const {
    updateFeatureStore
} = require("../../ml/featureStore");

const {
    updateReinforcementLearning
} = require("../../ml/reinforcementLearningV3");

const {
    updateMetaLearning
} = require("../../ml/metaLearningV2");

const {
    updateAdaptiveThreshold
} = require("../../ml/adaptiveThreshold");

let learningState = {

    running: false,

    processed: 0,

    successful: 0,

    failed: 0,

    updatedModules: []

};

const LEARNING_STAGES = [

    "Trade History",

    "Decision Memory",

    "Feature Store",

    "Reinforcement Learning",

    "Meta Learning",

    "Adaptive Threshold"

];

/*
==================================================
LOGGER
==================================================
*/

function logLearningStage(stage) {

    console.log(`
==================================
POST TRADE LEARNING
==================================

${stage}

==================================
`);

}

/*
==================================================
STATE
==================================================
*/

function getLearningState() {

    return {

        ...learningState,

        stages: LEARNING_STAGES

    };

}
/*
==================================================
LEARNING ENGINE
==================================================
*/

async function executePostTradeLearning() {

    learningState.running = true;

    const execution =
        await runTradeExecutionGateway();

    for (const trade of execution.executions) {

        learningState.processed++;

        try {

            logLearningStage(
                LEARNING_STAGES[1]
            );

            await storeDecisionMemory(
                trade
            );

            logLearningStage(
                LEARNING_STAGES[2]
            );

            await updateFeatureStore(
                trade
            );

            logLearningStage(
                LEARNING_STAGES[3]
            );

            await updateReinforcementLearning(
                trade
            );

            logLearningStage(
                LEARNING_STAGES[4]
            );

            await updateMetaLearning(
                trade
            );

            logLearningStage(
                LEARNING_STAGES[5]
            );

            await updateAdaptiveThreshold(
                trade
            );

            learningState.successful++;

        }

        catch (error) {

            learningState.failed++;

            console.log(`
==================================
LEARNING ERROR
==================================

${trade.symbol}

${error.message}

==================================
`);

        }

    }

    learningState.updatedModules = [

        "Decision Memory",

        "Feature Store",

        "Reinforcement Learning",

        "Meta Learning",

        "Adaptive Threshold"

    ];

}
/*
==================================================
MAIN POST TRADE LEARNING
==================================================
*/

async function runPostTradeLearningPipeline() {

    console.log(`
==================================
POST TRADE LEARNING PIPELINE
==================================
`);

    await executePostTradeLearning();

    learningState.running = false;

    console.log(`
==================================
LEARNING SUMMARY
==================================

Trades Processed:
${learningState.processed}

Successful Updates:
${learningState.successful}

Failed Updates:
${learningState.failed}

Modules Updated:
${learningState.updatedModules.join(", ")}

==================================
`);

    return {

        running:
            learningState.running,

        processed:
            learningState.processed,

        successful:
            learningState.successful,

        failed:
            learningState.failed,

        updatedModules:
            learningState.updatedModules

    };

}

/*
==================================================
RESET
==================================================
*/

function resetLearningState() {

    learningState = {

        running: false,

        processed: 0,

        successful: 0,

        failed: 0,

        updatedModules: []

    };

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    runPostTradeLearningPipeline,

    executePostTradeLearning,

    getLearningState,

    resetLearningState,

    logLearningStage

};
