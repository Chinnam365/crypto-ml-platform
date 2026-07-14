/*
==================================================
SYSTEM EVOLUTION ENGINE
==================================================
PHASE 7
PART 1
==================================================
*/

const {
    analyzeSystemOrchestrator
} = require("./systemOrchestratorV2");

const {
    analyzeMetaLearning
} = require("./metaLearningV2");

const {
    analyzePortfolioAnalytics
} = require("./portfolioAnalytics");

let cachedEvolution = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
EVOLUTION SCORE
==================================================
*/

function calculateEvolutionScore({

    system,

    meta,

    portfolio

}) {

    const score =

        (

            Number(
                system.systemScore || 0
            ) * 0.40 +

            Number(
                meta.metaLearningScore || 0
            ) * 0.35 +

            Number(
                portfolio.performanceScore || 0
            ) * 0.25

        );

    return Number(
        score.toFixed(2)
    );

}

/*
==================================================
EVOLUTION STAGE
==================================================
*/

function determineEvolutionStage(
    score
) {

    if (score >= 95) {

        return "SELF_EVOLVING_AI";

    }

    if (score >= 85) {

        return "AUTONOMOUS_AI";

    }

    if (score >= 70) {

        return "ADAPTIVE_AI";

    }

    if (score >= 55) {

        return "LEARNING_AI";

    }

    return "STATIC_AI";

}

/*
==================================================
EVOLUTION CAPABILITIES
==================================================
*/

function buildEvolutionCapabilities(
    stage
) {

    return {

        selfLearning:

            stage !== "STATIC_AI",

        selfOptimization:

            stage === "ADAPTIVE_AI" ||

            stage === "AUTONOMOUS_AI" ||

            stage === "SELF_EVOLVING_AI",

        selfCalibration:

            stage !== "STATIC_AI",

        autonomousEvolution:

            stage === "SELF_EVOLVING_AI"

    };

}
/*
==================================================
EVOLUTION RECOMMENDATION
==================================================
*/

function generateEvolutionRecommendation({

    score,

    stage,

    system

}) {

    return {

        score,

        stage,

        recommendation:

            score >= 95

                ? "ENABLE_FULL_SELF_EVOLUTION"

            : score >= 85

                ? "ENABLE_AUTONOMOUS_EVOLUTION"

            : score >= 70

                ? "CONTINUE_ADAPTIVE_LEARNING"

            : score >= 55

                ? "EXPAND_TRAINING"

            : "RETRAIN_SYSTEM",

        autonomousTrading:

            system.permissions
                ?.autonomousTrading || false,

        selfOptimization:

            system.permissions
                ?.selfOptimization || false

    };

}

/*
==================================================
SYSTEM MATURITY
==================================================
*/

function calculateSystemMaturity({

    system,

    meta,

    portfolio

}) {

    const maturity =

        (

            Number(
                system.overallHealth || 0
            ) * 0.40 +

            Number(
                meta.metaLearningScore || 0
            ) * 0.35 +

            Number(
                portfolio.consistencyScore || 0
            ) * 0.25

        );

    return Number(
        maturity.toFixed(2)
    );

}

/*
==================================================
MATURITY STATUS
==================================================
*/

function determineMaturityStatus(
    maturity
) {

    if (maturity >= 90) {

        return "WORLD_CLASS";

    }

    if (maturity >= 75) {

        return "PRODUCTION_READY";

    }

    if (maturity >= 60) {

        return "ADVANCED";

    }

    if (maturity >= 45) {

        return "DEVELOPING";

    }

    return "EXPERIMENTAL";

}
/*
==================================================
MAIN ENGINE
==================================================
*/

async function analyzeSystemEvolution() {

    try {

        const now = Date.now();

        if (

            cachedEvolution &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedEvolution;

        }

        const system =
            await analyzeSystemOrchestrator();

        const meta =
            await analyzeMetaLearning();

        const portfolio =
            await analyzePortfolioAnalytics();

        const evolutionScore =
            calculateEvolutionScore({

                system,

                meta,

                portfolio

            });

        const evolutionStage =
            determineEvolutionStage(
                evolutionScore
            );

        const capabilities =
            buildEvolutionCapabilities(
                evolutionStage
            );

        const recommendation =
            generateEvolutionRecommendation({

                score: evolutionScore,

                stage: evolutionStage,

                system

            });

        const maturity =
            calculateSystemMaturity({

                system,

                meta,

                portfolio

            });

        const maturityStatus =
            determineMaturityStatus(
                maturity
            );

        const result = {

            generatedAt:
                new Date(),

            evolutionScore,

            evolutionStage,

            capabilities,

            recommendation,

            maturity,

            maturityStatus,

            system,

            meta,

            portfolio

        };

        cachedEvolution =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
SYSTEM EVOLUTION ENGINE
==================================

Evolution Score:
${evolutionScore}

Evolution Stage:
${evolutionStage}

System Maturity:
${maturity}

Maturity Status:
${maturityStatus}

Self Learning:
${capabilities.selfLearning}

Autonomous Evolution:
${capabilities.autonomousEvolution}

==================================
`);

        return result;

    }

    catch (err) {

        console.log(`
==================================
SYSTEM EVOLUTION ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            evolutionScore: 0,

            evolutionStage: "STATIC_AI",

            capabilities: {

                selfLearning: false,

                selfOptimization: false,

                selfCalibration: false,

                autonomousEvolution: false

            },

            recommendation: {

                score: 0,

                stage: "STATIC_AI",

                recommendation: "RETRAIN_SYSTEM",

                autonomousTrading: false,

                selfOptimization: false

            },

            maturity: 0,

            maturityStatus: "EXPERIMENTAL",

            system: {},

            meta: {},

            portfolio: {}

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearSystemEvolutionCache() {

    cachedEvolution = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeSystemEvolution,

    clearSystemEvolutionCache,

    calculateEvolutionScore,

    determineEvolutionStage,

    buildEvolutionCapabilities,

    generateEvolutionRecommendation,

    calculateSystemMaturity,

    determineMaturityStatus

};
