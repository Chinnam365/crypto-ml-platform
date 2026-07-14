/*
==================================================
DIGITAL TWIN ENGINE
==================================================
PHASE 24
PART 1
==================================================
*/

const {
    analyzeReinforcementLearning
} = require("./reinforcementLearningV3");

const {
    analyzeMacroEconomicIntelligence
} = require("./macroEconomicIntelligence");

const {
    analyzeInstitutionalPortfolio
} = require("./institutionalPortfolioEngine");

const {
    analyzeMetaLearning
} = require("./metaLearningV2");

let cachedTwin = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
DIGITAL TWIN SCORE
==================================================
*/

function calculateDigitalTwinScore({

    reinforcement,

    macro,

    institutional,

    meta

}) {

    const score =

        (

            Number(
                reinforcement.reinforcementScore || 0
            ) * 0.35 +

            Number(
                macro.macroScore || 0
            ) * 0.25 +

            Number(
                institutional.institutionalScore || 0
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
DIGITAL TWIN LEVEL
==================================================
*/

function determineDigitalTwinLevel(
    score
) {

    if (score >= 95) {

        return "FULL_DIGITAL_TWIN";

    }

    if (score >= 85) {

        return "AUTONOMOUS_DIGITAL_TWIN";

    }

    if (score >= 70) {

        return "ADVANCED_SIMULATION";

    }

    if (score >= 55) {

        return "GUIDED_SIMULATION";

    }

    return "BASIC_SIMULATION";

}

/*
==================================================
DIGITAL TWIN CAPABILITIES
==================================================
*/

function buildDigitalTwinCapabilities(
    level
) {

    return {

        simulatePortfolio:

            level !== "BASIC_SIMULATION",

        simulateMarket:

            level !== "BASIC_SIMULATION",

        predictFutureScenarios:

            level ===
                "ADVANCED_SIMULATION"

            ||

            level ===
                "AUTONOMOUS_DIGITAL_TWIN"

            ||

            level ===
                "FULL_DIGITAL_TWIN",

        autonomousSimulation:

            level ===
                "FULL_DIGITAL_TWIN"

    };

}
/*
==================================================
DIGITAL TWIN RECOMMENDATION
==================================================
*/

function generateDigitalTwinRecommendation({

    score,

    level,

    reinforcement,

    macro

}) {

    return {

        score,

        level,

        recommendation:

            score >= 95

                ? "ENABLE_FULL_DIGITAL_TWIN"

            : score >= 85

                ? "ENABLE_AUTONOMOUS_DIGITAL_TWIN"

            : score >= 70

                ? "ENABLE_ADVANCED_SIMULATION"

            : score >= 55

                ? "ENABLE_GUIDED_SIMULATION"

            : "BASIC_SIMULATION_MODE",

        tradingEnabled:

            reinforcement.recommendation
                ?.tradingEnabled || false,

        emergencyStop:

            macro.recommendation
                ?.emergencyStop || false

    };

}

/*
==================================================
DIGITAL TWIN HEALTH
==================================================
*/

function calculateDigitalTwinHealth({

    reinforcement,

    macro,

    institutional,

    meta

}) {

    const health =

        (

            Number(
                reinforcement.reinforcementHealth || 0
            ) * 0.30 +

            Number(
                macro.macroHealth || 0
            ) * 0.25 +

            Number(
                institutional.institutionalHealth || 0
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
DIGITAL TWIN STATUS
==================================================
*/

function determineDigitalTwinStatus(
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

async function analyzeDigitalTwin() {

    try {

        const now = Date.now();

        if (

            cachedTwin &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedTwin;

        }

        const reinforcement =
            await analyzeReinforcementLearning();

        const macro =
            await analyzeMacroEconomicIntelligence();

        const institutional =
            await analyzeInstitutionalPortfolio();

        const meta =
            await analyzeMetaLearning();

        const digitalTwinScore =
            calculateDigitalTwinScore({

                reinforcement,

                macro,

                institutional,

                meta

            });

        const digitalTwinLevel =
            determineDigitalTwinLevel(
                digitalTwinScore
            );

        const capabilities =
            buildDigitalTwinCapabilities(
                digitalTwinLevel
            );

        const recommendation =
            generateDigitalTwinRecommendation({

                score: digitalTwinScore,

                level: digitalTwinLevel,

                reinforcement,

                macro

            });

        const digitalTwinHealth =
            calculateDigitalTwinHealth({

                reinforcement,

                macro,

                institutional,

                meta

            });

        const digitalTwinStatus =
            determineDigitalTwinStatus(
                digitalTwinHealth
            );

        const result = {

            generatedAt:
                new Date(),

            digitalTwinScore,

            digitalTwinLevel,

            capabilities,

            recommendation,

            digitalTwinHealth,

            digitalTwinStatus,

            reinforcement,

            macro,

            institutional,

            meta

        };

        cachedTwin =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
DIGITAL TWIN ENGINE
==================================

Digital Twin Score:
${digitalTwinScore}

Digital Twin Level:
${digitalTwinLevel}

Digital Twin Health:
${digitalTwinHealth}

Digital Twin Status:
${digitalTwinStatus}

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
DIGITAL TWIN ENGINE ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            digitalTwinScore: 0,

            digitalTwinLevel: "BASIC_SIMULATION",

            capabilities: {

                simulatePortfolio: false,

                simulateMarket: false,

                predictFutureScenarios: false,

                autonomousSimulation: false

            },

            recommendation: {

                score: 0,

                level: "BASIC_SIMULATION",

                recommendation: "BASIC_SIMULATION_MODE",

                tradingEnabled: false,

                emergencyStop: true

            },

            digitalTwinHealth: 0,

            digitalTwinStatus: "RECOVERY",

            reinforcement: {},

            macro: {},

            institutional: {},

            meta: {}

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearDigitalTwinCache() {

    cachedTwin = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeDigitalTwin,

    clearDigitalTwinCache,

    calculateDigitalTwinScore,

    determineDigitalTwinLevel,

    buildDigitalTwinCapabilities,

    generateDigitalTwinRecommendation,

    calculateDigitalTwinHealth,

    determineDigitalTwinStatus

};
