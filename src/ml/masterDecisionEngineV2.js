/*
==================================================
MASTER DECISION ENGINE V2
==================================================
PHASE 7
PART 1
==================================================
*/

const {
    analyzeSystemEvolution
} = require("./systemEvolutionEngine");

const {
    analyzeExecutionIntelligence
} = require("./executionIntelligence");

const {
    analyzeRiskIntelligence
} = require("./riskIntelligenceEngine");

const {
    analyzePortfolioDecision
} = require("./portfolioDecisionEngine");

let cachedDecision = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
MASTER SCORE
==================================================
*/

function calculateMasterScore({

    evolution,

    execution,

    risk,

    portfolio

}) {

    const score =

        (

            Number(
                evolution.evolutionScore || 0
            ) * 0.30 +

            Number(
                execution.executionScore || 0
            ) * 0.30 +

            Number(
                risk.riskScore || 0
            ) * 0.20 +

            Number(
                portfolio.decisionScore || 0
            ) * 0.20

        );

    return Number(
        score.toFixed(2)
    );

}

/*
==================================================
MASTER DECISION
==================================================
*/

function determineMasterDecision(
    score
) {

    if (score >= 90) {

        return "EXECUTE_IMMEDIATELY";

    }

    if (score >= 75) {

        return "EXECUTE";

    }

    if (score >= 60) {

        return "WATCH";

    }

    if (score >= 45) {

        return "WAIT";

    }

    return "BLOCK";

}

/*
==================================================
EXECUTION PERMISSIONS
==================================================
*/

function buildMasterPermissions(
    decision
) {

    return {

        execute:

            decision ===
                "EXECUTE"

            ||

            decision ===
                "EXECUTE_IMMEDIATELY",

        paperTrade:

            decision === "WATCH" ||

            decision === "WAIT",

        blockTrading:

            decision === "BLOCK"

    };

}
/*
==================================================
MASTER RECOMMENDATION
==================================================
*/

function generateMasterRecommendation({

    score,

    decision,

    evolution,

    execution,

    risk,

    portfolio

}) {

    return {

        score,

        decision,

        recommendation:

            score >= 90

                ? "FULLY_AUTONOMOUS_EXECUTION"

            : score >= 75

                ? "EXECUTE_WITH_RISK_CONTROLS"

            : score >= 60

                ? "PAPER_TRADE_AND_MONITOR"

            : score >= 45

                ? "WAIT_FOR_CONFIRMATION"

            : "BLOCK_AND_RETRAIN",

        allowTrading:

            execution.executionPlan
                ?.executeTrades &&

            risk.decision
                ?.allowTrading &&

            portfolio.recommendation
                ?.allowNewPositions,

        emergencyStop:

            risk.decision
                ?.emergencyMode || false,

        autonomousEvolution:

            evolution.capabilities
                ?.autonomousEvolution || false

    };

}

/*
==================================================
MASTER CONFIDENCE
==================================================
*/

function calculateMasterConfidence({

    evolution,

    execution,

    risk,

    portfolio

}) {

    const confidence =

        (

            Number(
                evolution.maturity || 0
            ) * 0.25 +

            Number(
                execution.executionScore || 0
            ) * 0.30 +

            Number(
                risk.riskScore || 0
            ) * 0.20 +

            Number(
                portfolio.confidence || 0
            ) * 0.25

        );

    return Number(
        confidence.toFixed(2)
    );

}

/*
==================================================
MASTER STATUS
==================================================
*/

function determineMasterStatus(
    confidence
) {

    if (confidence >= 90) {

        return "OPTIMAL";

    }

    if (confidence >= 75) {

        return "READY";

    }

    if (confidence >= 60) {

        return "MONITOR";

    }

    if (confidence >= 45) {

        return "LIMITED";

    }

    return "BLOCKED";

}
/*
==================================================
MAIN ENGINE
==================================================
*/

async function analyzeMasterDecision() {

    try {

        const now = Date.now();

        if (

            cachedDecision &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedDecision;

        }

        const evolution =
            await analyzeSystemEvolution();

        const execution =
            await analyzeExecutionIntelligence();

        const risk =
            await analyzeRiskIntelligence();

        const portfolio =
            await analyzePortfolioDecision();

        const masterScore =
            calculateMasterScore({

                evolution,

                execution,

                risk,

                portfolio

            });

        const decision =
            determineMasterDecision(
                masterScore
            );

        const permissions =
            buildMasterPermissions(
                decision
            );

        const recommendation =
            generateMasterRecommendation({

                score: masterScore,

                decision,

                evolution,

                execution,

                risk,

                portfolio

            });

        const confidence =
            calculateMasterConfidence({

                evolution,

                execution,

                risk,

                portfolio

            });

        const status =
            determineMasterStatus(
                confidence
            );

        const result = {

            generatedAt:
                new Date(),

            masterScore,

            decision,

            permissions,

            recommendation,

            confidence,

            status,

            evolution,

            execution,

            risk,

            portfolio

        };

        cachedDecision =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
MASTER DECISION ENGINE V2
==================================

Master Score:
${masterScore}

Decision:
${decision}

Confidence:
${confidence}

Status:
${status}

Allow Trading:
${recommendation.allowTrading}

Emergency Stop:
${recommendation.emergencyStop}

==================================
`);

        return result;

    }

    catch (err) {

        console.log(`
==================================
MASTER DECISION ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            masterScore: 0,

            decision: "BLOCK",

            permissions: {

                execute: false,

                paperTrade: false,

                blockTrading: true

            },

            recommendation: {

                score: 0,

                decision: "BLOCK",

                recommendation: "BLOCK_AND_RETRAIN",

                allowTrading: false,

                emergencyStop: true,

                autonomousEvolution: false

            },

            confidence: 0,

            status: "BLOCKED",

            evolution: {},

            execution: {},

            risk: {},

            portfolio: {}

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearMasterDecisionCache() {

    cachedDecision = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeMasterDecision,

    clearMasterDecisionCache,

    calculateMasterScore,

    determineMasterDecision,

    buildMasterPermissions,

    generateMasterRecommendation,

    calculateMasterConfidence,

    determineMasterStatus

};
