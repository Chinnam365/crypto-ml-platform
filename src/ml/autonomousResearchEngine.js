/*
==================================================
AUTONOMOUS RESEARCH ENGINE
==================================================
PHASE 14
PART 1
==================================================
*/

const {
    analyzeUniversalReasoning
} = require("./universalReasoningEngine");

const {
    analyzeGlobalKnowledge
} = require("./globalKnowledgeEngine");

const {
    analyzeCollectiveIntelligence
} = require("./collectiveIntelligenceEngine");

const {
    analyzeMetaLearning
} = require("./metaLearningV2");

let cachedResearch = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
RESEARCH SCORE
==================================================
*/

function calculateResearchScore({

    reasoning,

    knowledge,

    collective,

    meta

}) {

    const score =

        (

            Number(
                reasoning.reasoningScore || 0
            ) * 0.35 +

            Number(
                knowledge.knowledgeScore || 0
            ) * 0.25 +

            Number(
                collective.collectiveScore || 0
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
RESEARCH LEVEL
==================================================
*/

function determineResearchLevel(
    score
) {

    if (score >= 95) {

        return "AUTONOMOUS_RESEARCH";

    }

    if (score >= 85) {

        return "GLOBAL_RESEARCH";

    }

    if (score >= 70) {

        return "ADVANCED_RESEARCH";

    }

    if (score >= 55) {

        return "GUIDED_RESEARCH";

    }

    return "STANDARD_RESEARCH";

}

/*
==================================================
RESEARCH CAPABILITIES
==================================================
*/

function buildResearchCapabilities(
    level
) {

    return {

        hypothesisGeneration:

            level !== "STANDARD_RESEARCH",

        autonomousBacktesting:

            level !== "STANDARD_RESEARCH",

        strategyDiscovery:

            level === "ADVANCED_RESEARCH" ||

            level === "GLOBAL_RESEARCH" ||

            level === "AUTONOMOUS_RESEARCH",

        continuousResearch:

            level === "AUTONOMOUS_RESEARCH"

    };

}
/*
==================================================
RESEARCH RECOMMENDATION
==================================================
*/

function generateResearchRecommendation({

    score,

    level,

    reasoning,

    knowledge

}) {

    return {

        score,

        level,

        recommendation:

            score >= 95

                ? "ENABLE_FULL_AUTONOMOUS_RESEARCH"

            : score >= 85

                ? "ENABLE_GLOBAL_RESEARCH"

            : score >= 70

                ? "ENABLE_ADVANCED_RESEARCH"

            : score >= 55

                ? "ENABLE_GUIDED_RESEARCH"

            : "STANDARD_RESEARCH_MODE",

        tradingEnabled:

            reasoning.recommendation
                ?.tradingEnabled || false,

        emergencyStop:

            knowledge.recommendation
                ?.emergencyStop || false

    };

}

/*
==================================================
RESEARCH HEALTH
==================================================
*/

function calculateResearchHealth({

    reasoning,

    knowledge,

    collective,

    meta

}) {

    const health =

        (

            Number(
                reasoning.reasoningHealth || 0
            ) * 0.30 +

            Number(
                knowledge.knowledgeHealth || 0
            ) * 0.25 +

            Number(
                collective.collectiveHealth || 0
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
RESEARCH STATUS
==================================================
*/

function determineResearchStatus(
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

async function analyzeAutonomousResearch() {

    try {

        const now = Date.now();

        if (

            cachedResearch &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedResearch;

        }

        const reasoning =
            await analyzeUniversalReasoning();

        const knowledge =
            await analyzeGlobalKnowledge();

        const collective =
            await analyzeCollectiveIntelligence();

        const meta =
            await analyzeMetaLearning();

        const researchScore =
            calculateResearchScore({

                reasoning,

                knowledge,

                collective,

                meta

            });

        const researchLevel =
            determineResearchLevel(
                researchScore
            );

        const capabilities =
            buildResearchCapabilities(
                researchLevel
            );

        const recommendation =
            generateResearchRecommendation({

                score: researchScore,

                level: researchLevel,

                reasoning,

                knowledge

            });

        const researchHealth =
            calculateResearchHealth({

                reasoning,

                knowledge,

                collective,

                meta

            });

        const researchStatus =
            determineResearchStatus(
                researchHealth
            );

        const result = {

            generatedAt:
                new Date(),

            researchScore,

            researchLevel,

            capabilities,

            recommendation,

            researchHealth,

            researchStatus,

            reasoning,

            knowledge,

            collective,

            meta

        };

        cachedResearch =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
AUTONOMOUS RESEARCH ENGINE
==================================

Research Score:
${researchScore}

Research Level:
${researchLevel}

Research Health:
${researchHealth}

Research Status:
${researchStatus}

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
AUTONOMOUS RESEARCH ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            researchScore: 0,

            researchLevel: "STANDARD_RESEARCH",

            capabilities: {

                hypothesisGeneration: false,

                autonomousBacktesting: false,

                strategyDiscovery: false,

                continuousResearch: false

            },

            recommendation: {

                score: 0,

                level: "STANDARD_RESEARCH",

                recommendation: "STANDARD_RESEARCH_MODE",

                tradingEnabled: false,

                emergencyStop: true

            },

            researchHealth: 0,

            researchStatus: "RECOVERY",

            reasoning: {},

            knowledge: {},

            collective: {},

            meta: {}

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearAutonomousResearchCache() {

    cachedResearch = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeAutonomousResearch,

    clearAutonomousResearchCache,

    calculateResearchScore,

    determineResearchLevel,

    buildResearchCapabilities,

    generateResearchRecommendation,

    calculateResearchHealth,

    determineResearchStatus

};
