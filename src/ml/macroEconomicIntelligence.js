/*
==================================================
MACRO ECONOMIC INTELLIGENCE
==================================================
PHASE 22
PART 1
==================================================
*/

const {
    analyzeInstitutionalPortfolio
} = require("./institutionalPortfolioEngine");

const {
    analyzeCrossExchangeIntelligence
} = require("./crossExchangeIntelligence");

const {
    analyzeStrategyEvolution
} = require("./strategyEvolutionEngine");

const {
    analyzeMetaLearning
} = require("./metaLearningV2");

let cachedMacro = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
MACRO SCORE
==================================================
*/

function calculateMacroScore({

    institutional,

    exchange,

    strategy,

    meta

}) {

    const score =

        (

            Number(
                institutional.institutionalScore || 0
            ) * 0.35 +

            Number(
                exchange.exchangeScore || 0
            ) * 0.25 +

            Number(
                strategy.strategyScore || 0
            ) * 0.20 +

            Number(
                meta.metaLearningScore || 0
            ) * 0.20

        );

    return Number(
        score.toFixed(2)
    );

}

/*
==================================================
MACRO LEVEL
==================================================
*/

function determineMacroLevel(
    score
) {

    if (score >= 95) {

        return "GLOBAL_MACRO_INTELLIGENCE";

    }

    if (score >= 85) {

        return "INSTITUTIONAL_MACRO";

    }

    if (score >= 70) {

        return "ADVANCED_MACRO";

    }

    if (score >= 55) {

        return "GUIDED_MACRO";

    }

    return "STANDARD_MACRO";

}

/*
==================================================
MACRO CAPABILITIES
==================================================
*/

function buildMacroCapabilities(
    level
) {

    return {

        monitorGlobalEconomy:

            level !== "STANDARD_MACRO",

        predictMacroCycles:

            level !== "STANDARD_MACRO",

        crossAssetForecasting:

            level ===
                "ADVANCED_MACRO"

            ||

            level ===
                "INSTITUTIONAL_MACRO"

            ||

            level ===
                "GLOBAL_MACRO_INTELLIGENCE",

        autonomousMacroAllocation:

            level ===
                "GLOBAL_MACRO_INTELLIGENCE"

    };

}
/*
==================================================
MACRO RECOMMENDATION
==================================================
*/

function generateMacroRecommendation({

    score,

    level,

    institutional,

    exchange

}) {

    return {

        score,

        level,

        recommendation:

            score >= 95

                ? "ENABLE_GLOBAL_MACRO_INTELLIGENCE"

            : score >= 85

                ? "ENABLE_INSTITUTIONAL_MACRO"

            : score >= 70

                ? "ENABLE_ADVANCED_MACRO"

            : score >= 55

                ? "ENABLE_GUIDED_MACRO"

            : "STANDARD_MACRO_MODE",

        tradingEnabled:

            institutional.recommendation
                ?.tradingEnabled || false,

        emergencyStop:

            exchange.recommendation
                ?.emergencyStop || false

    };

}

/*
==================================================
MACRO HEALTH
==================================================
*/

function calculateMacroHealth({

    institutional,

    exchange,

    strategy,

    meta

}) {

    const health =

        (

            Number(
                institutional.institutionalHealth || 0
            ) * 0.30 +

            Number(
                exchange.exchangeHealth || 0
            ) * 0.25 +

            Number(
                strategy.strategyHealth || 0
            ) * 0.25 +

            Number(
                meta.metaLearningScore || 0
            ) * 0.20

        );

    return Number(
        health.toFixed(2)
    );

}

/*
==================================================
MACRO STATUS
==================================================
*/

function determineMacroStatus(
    health
) {

    if (health >= 95) {

        return "WORLD_CLASS";

    }

    if (health >= 85) {

        return "EXCELLENT";

    }

    if (health >= 70) {

        return "HEALTHY";

    }

    if (health >= 55) {

        return "ADVANCED";

    }

    if (health >= 40) {

        return "STABLE";

    }

    return "RECOVERY";

}
/*
==================================================
MAIN ENGINE
==================================================
*/

async function analyzeMacroEconomicIntelligence() {

    try {

        const now = Date.now();

        if (

            cachedMacro &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedMacro;

        }

        const institutional =
            await analyzeInstitutionalPortfolio();

        const exchange =
            await analyzeCrossExchangeIntelligence();

        const strategy =
            await analyzeStrategyEvolution();

        const meta =
            await analyzeMetaLearning();

        const macroScore =
            calculateMacroScore({

                institutional,

                exchange,

                strategy,

                meta

            });

        const macroLevel =
            determineMacroLevel(
                macroScore
            );

        const capabilities =
            buildMacroCapabilities(
                macroLevel
            );

        const recommendation =
            generateMacroRecommendation({

                score: macroScore,

                level: macroLevel,

                institutional,

                exchange

            });

        const macroHealth =
            calculateMacroHealth({

                institutional,

                exchange,

                strategy,

                meta

            });

        const macroStatus =
            determineMacroStatus(
                macroHealth
            );

        const result = {

            generatedAt:
                new Date(),

            macroScore,

            macroLevel,

            capabilities,

            recommendation,

            macroHealth,

            macroStatus,

            institutional,

            exchange,

            strategy,

            meta

        };

        cachedMacro =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
MACRO ECONOMIC INTELLIGENCE
==================================

Macro Score:
${macroScore}

Macro Level:
${macroLevel}

Macro Health:
${macroHealth}

Macro Status:
${macroStatus}

Trading Enabled:
${recommendation.tradingEnabled}

Emergency Stop:
${recommendation.emergencyStop}

==================================
`);

        return result;

    }

    catch (err) {

        console.log(`
==================================
MACRO ECONOMIC INTELLIGENCE ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            macroScore: 0,

            macroLevel: "STANDARD_MACRO",

            capabilities: {

                monitorGlobalEconomy: false,

                predictMacroCycles: false,

                crossAssetForecasting: false,

                autonomousMacroAllocation: false

            },

            recommendation: {

                score: 0,

                level: "STANDARD_MACRO",

                recommendation: "STANDARD_MACRO_MODE",

                tradingEnabled: false,

                emergencyStop: true

            },

            macroHealth: 0,

            macroStatus: "RECOVERY",

            institutional: {},

            exchange: {},

            strategy: {},

            meta: {}

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearMacroEconomicCache() {

    cachedMacro = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeMacroEconomicIntelligence,

    clearMacroEconomicCache,

    calculateMacroScore,

    determineMacroLevel,

    buildMacroCapabilities,

    generateMacroRecommendation,

    calculateMacroHealth,

    determineMacroStatus

};
