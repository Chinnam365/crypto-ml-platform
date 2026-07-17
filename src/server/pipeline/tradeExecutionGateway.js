/*
==================================================
TRADE EXECUTION GATEWAY
==================================================
PHASE 34
PART 1
==================================================
*/

const {
    runLiveTradingPipeline
} = require("./liveTradingPipeline");

const {
    analyzeProductionOptimization
} = require("../../production/phase30/productionOptimizationEngine");

const {
    executeTrade
} = require("../../exchange/tradeExecutor");

const {
    calculatePositionSize
} = require("../../ml/adaptiveSizing");

const {
    calculateStopLoss
} = require("../../ml/stopLossEngine");

const {
    calculateTakeProfit
} = require("../../ml/takeProfitEngine");

let executionState = {

    running: false,

    evaluated: 0,

    executed: 0,

    rejected: 0,

    failed: 0,

    executions: []

};

const EXECUTION_STAGES = [

    "Pipeline",

    "Position Sizing",

    "Risk Calculation",

    "Trade Execution",

    "Verification"

];

/*
==================================================
LOGGER
==================================================
*/

function logExecutionStage(stage) {

    console.log(`
==================================
TRADE EXECUTION
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

function getExecutionState() {

    return {

        ...executionState,

        stages: EXECUTION_STAGES

    };

}
/*
==================================================
EXECUTION ENGINE
==================================================
*/

async function executeApprovedTrades() {

    executionState.running = true;

    logExecutionStage(
        EXECUTION_STAGES[0]
    );

    const pipeline =
        await runLiveTradingPipeline();

    const optimization =
        await analyzeProductionOptimization();

    for (const trade of pipeline.approved) {

        executionState.evaluated++;

        try {

            logExecutionStage(
                EXECUTION_STAGES[1]
            );

            const positionSize =
                await calculatePositionSize({

                    market:
                        trade.market,

                    confidence:
                        trade.confidence,

                    optimization

                });

            logExecutionStage(
                EXECUTION_STAGES[2]
            );

            const stopLoss =
                await calculateStopLoss({

                    market:
                        trade.market,

                    confidence:
                        trade.confidence

                });

            const takeProfit =
                await calculateTakeProfit({

                    market:
                        trade.market,

                    confidence:
                        trade.confidence

                });

            logExecutionStage(
                EXECUTION_STAGES[3]
            );

            const result =
                await executeTrade({

                    symbol:
                        trade.market.symbol,

                    side:
                        trade.market.side,

                    quantity:
                        positionSize,

                    stopLoss,

                    takeProfit

                });

            executionState.executions.push({

                symbol:
                    trade.market.symbol,

                side:
                    trade.market.side,

                quantity:
                    positionSize,

                stopLoss,

                takeProfit,

                exchangeResult:
                    result,

                timestamp:
                    new Date()

            });

            executionState.executed++;

        }

        catch (error) {

            executionState.failed++;

            executionState.executions.push({

                symbol:
                    trade.market.symbol,

                error:
                    error.message,

                timestamp:
                    new Date()

            });

        }

    }

    executionState.rejected =
        pipeline.rejected.length;

}
/*
==================================================
MAIN EXECUTION GATEWAY
==================================================
*/

async function runTradeExecutionGateway() {

    console.log(`
==================================
TRADE EXECUTION GATEWAY
==================================
`);

    await executeApprovedTrades();

    logExecutionStage(
        EXECUTION_STAGES[4]
    );

    executionState.running = false;

    console.log(`
==================================
EXECUTION SUMMARY
==================================

Trades Evaluated:
${executionState.evaluated}

Trades Executed:
${executionState.executed}

Trades Rejected:
${executionState.rejected}

Execution Failures:
${executionState.failed}

==================================
`);

    return {

        running:
            executionState.running,

        evaluated:
            executionState.evaluated,

        executed:
            executionState.executed,

        rejected:
            executionState.rejected,

        failed:
            executionState.failed,

        executions:
            executionState.executions

    };

}

/*
==================================================
RESET
==================================================
*/

function resetExecutionState() {

    executionState = {

        running: false,

        evaluated: 0,

        executed: 0,

        rejected: 0,

        failed: 0,

        executions: []

    };

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    runTradeExecutionGateway,

    executeApprovedTrades,

    getExecutionState,

    resetExecutionState,

    logExecutionStage

};
