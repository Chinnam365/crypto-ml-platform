/*
==================================================
INSTITUTIONAL PORTFOLIO ENGINE
==================================================
PHASE 21
PART 1
==================================================
*/

const {
    analyzeCrossExchangeIntelligence
} = require("./crossExchangeIntelligence");

const {
    analyzeSelfHealing
} = require("./selfHealingEngine");

const {
    analyzeStrategyEvolution
} = require("./strategyEvolutionEngine");

const {
    analyzeMetaLearning
} = require("./metaLearningV2");

let cachedInstitutional = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
INSTITUTIONAL SCORE
==================================================
*/

function calculateInstitutionalScore({

    exchange,

    healing,

    strategy,

    meta

}) {

    const score =

        (

            Number(
                exchange.exchangeScore || 0
            ) * 0.35 +

            Number(
                healing.healingScore || 0
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
INSTITUTIONAL LEVEL
==================================================
*/

function determineInstitutionalLevel(
    score
) {

    if (score >= 95) {

        return "GLOBAL_INSTITUTIONAL";

    }

    if (score >= 85) {

        return "ENTERPRISE_INSTITUTIONAL";

    }

    if (score >= 70) {

        return "ADVANCED_INSTITUTIONAL";

    }

    if (score >= 55) {

        return "GUIDED_INSTITUTIONAL";

    }

    return "STANDARD_PORTFOLIO";

}

/*
==================================================
INSTITUTIONAL CAPABILITIES
==================================================
*/

function buildInstitutionalCapabilities(
    level
) {

    return {

        dynamicAllocation:

            level !== "STANDARD_PORTFOLIO",

        crossAssetManagement:

            level !== "STANDARD_PORTFOLIO",

        institutionalRiskControl:

            level ===
                "ADVANCED_INSTITUTIONAL"

            ||

            level ===
                "ENTERPRISE_INSTITUTIONAL"

            ||

            level ===
                "GLOBAL_INSTITUTIONAL",

        autonomousRebalancing:

            level ===
                "GLOBAL_INSTITUTIONAL"

    };

}
/*
==================================================
INSTITUTIONAL RECOMMENDATION
==================================================
*/

function generateInstitutionalRecommendation({

    score,

    level,

    exchange,

    healing

}) {

    return {

        score,

        level,

        recommendation:

            score >= 95

                ? "ENABLE_GLOBAL_INSTITUTIONAL_PORTFOLIO"

            : score >= 85

                ? "ENABLE_ENTERPRISE_INSTITUTIONAL_PORTFOLIO"

            : score >= 70

                ? "ENABLE_ADVANCED_INSTITUTIONAL_PORTFOLIO"

            : score >= 55

                ? "ENABLE_GUIDED_INSTITUTIONAL_PORTFOLIO"

            : "STANDARD_PORTFOLIO_MODE",

        tradingEnabled:

            exchange.recommendation
                ?.tradingEnabled || false,

        emergencyStop:

            healing.recommendation
                ?.emergencyStop || false

    };

}

/*
==================================================
INSTITUTIONAL HEALTH
==================================================
*/

function calculateInstitutionalHealth({

    exchange,

    healing,

    strategy,

    meta

}) {

    const health =

        (

            Number(
                exchange.exchangeHealth || 0
            ) * 0.30 +

            Number(
                healing.healingHealth || 0
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
INSTITUTIONAL STATUS
==================================================
*/

function determineInstitutionalStatus(
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

async function analyzeInstitutionalPortfolio() {

    try {

        const now = Date.now();

        if (

            cachedInstitutional &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedInstitutional;

        }

        const exchange =
            await analyzeCrossExchangeIntelligence();

        const healing =
            await analyzeSelfHealing();

        const strategy =
            await analyzeStrategyEvolution();

        const meta =
            await analyzeMetaLearning();

        const institutionalScore =
            calculateInstitutionalScore({

                exchange,

                healing,

                strategy,

                meta

            });

        const institutionalLevel =
            determineInstitutionalLevel(
                institutionalScore
            );

        const capabilities =
            buildInstitutionalCapabilities(
                institutionalLevel
            );

        const recommendation =
            generateInstitutionalRecommendation({

                score: institutionalScore,

                level: institutionalLevel,

                exchange,

                healing

            });

        const institutionalHealth =
            calculateInstitutionalHealth({

                exchange,

                healing,

                strategy,

                meta

            });

        const institutionalStatus =
            determineInstitutionalStatus(
                institutionalHealth
            );

        const result = {

            generatedAt:
                new Date(),

            institutionalScore,

            institutionalLevel,

            capabilities,

            recommendation,

            institutionalHealth,

            institutionalStatus,

            exchange,

            healing,

            strategy,

            meta

        };

        cachedInstitutional =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
INSTITUTIONAL PORTFOLIO ENGINE
==================================

Institutional Score:
${institutionalScore}

Institutional Level:
${institutionalLevel}

Institutional Health:
${institutionalHealth}

Institutional Status:
${institutionalStatus}

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
INSTITUTIONAL PORTFOLIO ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            institutionalScore: 0,

            institutionalLevel: "STANDARD_PORTFOLIO",

            capabilities: {

                dynamicAllocation: false,

                crossAssetManagement: false,

                institutionalRiskControl: false,

                autonomousRebalancing: false

            },

            recommendation: {

                score: 0,

                level: "STANDARD_PORTFOLIO",

                recommendation: "STANDARD_PORTFOLIO_MODE",

                tradingEnabled: false,

                emergencyStop: true

            },

            institutionalHealth: 0,

            institutionalStatus: "RECOVERY",

            exchange: {},

            healing: {},

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

function clearInstitutionalPortfolioCache() {

    cachedInstitutional = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeInstitutionalPortfolio,

    clearInstitutionalPortfolioCache,

    calculateInstitutionalScore,

    determineInstitutionalLevel,

    buildInstitutionalCapabilities,

    generateInstitutionalRecommendation,

    calculateInstitutionalHealth,

    determineInstitutionalStatus

};
