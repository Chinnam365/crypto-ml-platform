/*
==================================================
SELF HEALING ENGINE
==================================================
PHASE 19
PART 1
==================================================
*/

const {
    analyzeStrategyEvolution
} = require("./strategyEvolutionEngine");

const {
    analyzeSwarmConsensus
} = require("./swarmConsensusEngine");

const {
    analyzeMultiAgentCoordinator
} = require("./multiAgentCoordinator");

const {
    analyzeMetaLearning
} = require("./metaLearningV2");

let cachedHealing = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
SELF HEALING SCORE
==================================================
*/

function calculateHealingScore({

    strategy,

    swarm,

    coordinator,

    meta

}) {

    const score =

        (

            Number(
                strategy.strategyScore || 0
            ) * 0.35 +

            Number(
                swarm.swarmScore || 0
            ) * 0.25 +

            Number(
                coordinator.coordinationScore || 0
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
SELF HEALING LEVEL
==================================================
*/

function determineHealingLevel(
    score
) {

    if (score >= 95) {

        return "FULL_SELF_HEALING";

    }

    if (score >= 85) {

        return "AUTONOMOUS_SELF_HEALING";

    }

    if (score >= 70) {

        return "ADAPTIVE_SELF_HEALING";

    }

    if (score >= 55) {

        return "GUIDED_SELF_HEALING";

    }

    return "MANUAL_RECOVERY";

}

/*
==================================================
SELF HEALING CAPABILITIES
==================================================
*/

function buildHealingCapabilities(
    level
) {

    return {

        detectFailures:

            level !== "MANUAL_RECOVERY",

        repairFailures:

            level !== "MANUAL_RECOVERY",

        rollbackModels:

            level ===
                "ADAPTIVE_SELF_HEALING"

            ||

            level ===
                "AUTONOMOUS_SELF_HEALING"

            ||

            level ===
                "FULL_SELF_HEALING",

        autonomousRecovery:

            level ===
                "FULL_SELF_HEALING"

    };

}
/*
==================================================
SELF HEALING RECOMMENDATION
==================================================
*/

function generateHealingRecommendation({

    score,

    level,

    strategy,

    swarm

}) {

    return {

        score,

        level,

        recommendation:

            score >= 95

                ? "ENABLE_FULL_SELF_HEALING"

            : score >= 85

                ? "ENABLE_AUTONOMOUS_SELF_HEALING"

            : score >= 70

                ? "ENABLE_ADAPTIVE_SELF_HEALING"

            : score >= 55

                ? "ENABLE_GUIDED_SELF_HEALING"

            : "MANUAL_RECOVERY_MODE",

        tradingEnabled:

            strategy.recommendation
                ?.tradingEnabled || false,

        emergencyStop:

            swarm.recommendation
                ?.emergencyStop || false

    };

}

/*
==================================================
SELF HEALING HEALTH
==================================================
*/

function calculateHealingHealth({

    strategy,

    swarm,

    coordinator,

    meta

}) {

    const health =

        (

            Number(
                strategy.strategyHealth || 0
            ) * 0.30 +

            Number(
                swarm.swarmHealth || 0
            ) * 0.25 +

            Number(
                coordinator.coordinationHealth || 0
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
SELF HEALING STATUS
==================================================
*/

function determineHealingStatus(
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

async function analyzeSelfHealing() {

    try {

        const now = Date.now();

        if (

            cachedHealing &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedHealing;

        }

        const strategy =
            await analyzeStrategyEvolution();

        const swarm =
            await analyzeSwarmConsensus();

        const coordinator =
            await analyzeMultiAgentCoordinator();

        const meta =
            await analyzeMetaLearning();

        const healingScore =
            calculateHealingScore({

                strategy,

                swarm,

                coordinator,

                meta

            });

        const healingLevel =
            determineHealingLevel(
                healingScore
            );

        const capabilities =
            buildHealingCapabilities(
                healingLevel
            );

        const recommendation =
            generateHealingRecommendation({

                score: healingScore,

                level: healingLevel,

                strategy,

                swarm

            });

        const healingHealth =
            calculateHealingHealth({

                strategy,

                swarm,

                coordinator,

                meta

            });

        const healingStatus =
            determineHealingStatus(
                healingHealth
            );

        const result = {

            generatedAt:
                new Date(),

            healingScore,

            healingLevel,

            capabilities,

            recommendation,

            healingHealth,

            healingStatus,

            strategy,

            swarm,

            coordinator,

            meta

        };

        cachedHealing =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
SELF HEALING ENGINE
==================================

Healing Score:
${healingScore}

Healing Level:
${healingLevel}

Healing Health:
${healingHealth}

Healing Status:
${healingStatus}

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
SELF HEALING ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            healingScore: 0,

            healingLevel: "MANUAL_RECOVERY",

            capabilities: {

                detectFailures: false,

                repairFailures: false,

                rollbackModels: false,

                autonomousRecovery: false

            },

            recommendation: {

                score: 0,

                level: "MANUAL_RECOVERY",

                recommendation: "MANUAL_RECOVERY_MODE",

                tradingEnabled: false,

                emergencyStop: true

            },

            healingHealth: 0,

            healingStatus: "RECOVERY",

            strategy: {},

            swarm: {},

            coordinator: {},

            meta: {}

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearSelfHealingCache() {

    cachedHealing = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeSelfHealing,

    clearSelfHealingCache,

    calculateHealingScore,

    determineHealingLevel,

    buildHealingCapabilities,

    generateHealingRecommendation,

    calculateHealingHealth,

    determineHealingStatus

};
