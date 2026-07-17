/*
==================================================
LIVE TRADING PIPELINE
==================================================
PHASE 33
PART 1
==================================================
*/

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
    calculateConfidence
} = require("../../ml/confidenceEngine");

const {
    calculateAdaptiveThreshold
} = require("../../ml/adaptiveThreshold");

const {
    scanUniverse
} = require("../../ml/marketScanner");

const {
    buildDiscoveryRanking
} = require("../../ml/discoveryRanking");

const {
    selectBestMarkets
} = require("../../ml/discoverySelector");

let pipelineState = {

    initialized: false,

    running: false,

    marketUniverse: [],

    rankedMarkets: [],

    candidateMarkets: [],

    approvedTrades: [],

    rejectedTrades: []

};

const PIPELINE_STAGES = [

    "Market Scan",

    "Discovery Ranking",

    "Candidate Selection",

    "Confidence Evaluation",

    "AI Governance",

    "Master Orchestrator",

    "Production Optimization",

    "Execution Decision"

];

/*
==================================================
PIPELINE LOGGER
==================================================
*/

function logPipelineStage(stage) {

    console.log(`
==================================
LIVE TRADING PIPELINE
==================================

${stage}

==================================
`);

}

/*
==================================================
PIPELINE STATUS
==================================================
*/

function getPipelineStatus() {

    return {

        ...pipelineState,

        stages: PIPELINE_STAGES

    };

}
/*
==================================================
PIPELINE EXECUTION
==================================================
*/

async function executePipeline() {

    pipelineState.running = true;

    logPipelineStage(
        PIPELINE_STAGES[0]
    );

    pipelineState.marketUniverse =
        await scanUniverse();

    logPipelineStage(
        PIPELINE_STAGES[1]
    );

    pipelineState.rankedMarkets =
        await buildDiscoveryRanking(

            pipelineState.marketUniverse

        );

    logPipelineStage(
        PIPELINE_STAGES[2]
    );

    pipelineState.candidateMarkets =
        await selectBestMarkets(

            pipelineState.rankedMarkets

        );

    pipelineState.approvedTrades = [];

    pipelineState.rejectedTrades = [];

    for (const market of pipelineState.candidateMarkets) {

        logPipelineStage(
            PIPELINE_STAGES[3]
        );

        const confidence =
            await calculateConfidence(
                market
            );

        const threshold =
            await calculateAdaptiveThreshold(
                market
            );

        logPipelineStage(
            PIPELINE_STAGES[4]
        );

        const compliance =
            await analyzeAICompliance();

        logPipelineStage(
            PIPELINE_STAGES[5]
        );

        const orchestrator =
            await analyzeMasterOrchestrator();

        logPipelineStage(
            PIPELINE_STAGES[6]
        );

        const optimization =
            await analyzeProductionOptimization();

        const approved =

            confidence.finalConfidence >= threshold

            &&

            compliance.recommendation
                ?.tradingEnabled

            &&

            !compliance.recommendation
                ?.emergencyStop

            &&

            optimization.optimizationStatus !==
            "RECOVERY";

        if (approved) {

            pipelineState.approvedTrades.push({

                market,

                confidence,

                threshold,

                compliance,

                orchestrator,

                optimization

            });

        }

        else {

            pipelineState.rejectedTrades.push({

                market,

                confidence,

                threshold,

                compliance,

                orchestrator,

                optimization

            });

        }

    }

    pipelineState.initialized = true;

}
/*
==================================================
MAIN LIVE TRADING PIPELINE
==================================================
*/

async function runLiveTradingPipeline() {

    console.log(`
==================================
LIVE TRADING PIPELINE STARTED
==================================
`);

    await executePipeline();

    logPipelineStage(
        PIPELINE_STAGES[7]
    );

    console.log(`
==================================
PIPELINE SUMMARY
==================================

Markets Scanned:
${pipelineState.marketUniverse.length}

Ranked Markets:
${pipelineState.rankedMarkets.length}

Candidates:
${pipelineState.candidateMarkets.length}

Approved Trades:
${pipelineState.approvedTrades.length}

Rejected Trades:
${pipelineState.rejectedTrades.length}

==================================
`);

    pipelineState.running = false;

    return {

        initialized:
            pipelineState.initialized,

        running:
            pipelineState.running,

        scanned:
            pipelineState.marketUniverse.length,

        ranked:
            pipelineState.rankedMarkets.length,

        candidates:
            pipelineState.candidateMarkets.length,

        approved:
            pipelineState.approvedTrades,

        rejected:
            pipelineState.rejectedTrades

    };

}

/*
==================================================
PIPELINE RESET
==================================================
*/

function resetPipeline() {

    pipelineState = {

        initialized: false,

        running: false,

        marketUniverse: [],

        rankedMarkets: [],

        candidateMarkets: [],

        approvedTrades: [],

        rejectedTrades: []

    };

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    runLiveTradingPipeline,

    executePipeline,

    getPipelineStatus,

    resetPipeline,

    logPipelineStage

};
