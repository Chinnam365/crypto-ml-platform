const pool = require("../db/db");

/*
==================================================
SECTOR ROTATION AI
==================================================
PHASE 5
PART 1
==================================================
*/

const {
    analyzeCapitalRotation
} = require("./dynamicCapitalRotation");

let cachedSectorRotation = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
SECTOR MAP
==================================================
*/

const SECTOR_MAP = {

    BTCUSDT: "STORE_OF_VALUE",
    ETHUSDT: "SMART_CONTRACT",

    SOLUSDT: "SMART_CONTRACT",
    ADAUSDT: "SMART_CONTRACT",
    AVAXUSDT: "SMART_CONTRACT",

    LINKUSDT: "ORACLE",

    DOGEUSDT: "MEME",
    SHIBUSDT: "MEME",
    PEPEUSDT: "MEME",

    AAVEUSDT: "DEFI",
    UNIUSDT: "DEFI",

    ARBUSDT: "L2",
    OPUSDT: "L2"

};

/*
==================================================
BUILD SECTOR DATA
==================================================
*/

function buildSectorPerformance(
    recommendations = []
) {

    const sectors = {};

    for (const symbol of recommendations) {

        const sector =

            SECTOR_MAP[symbol.symbol] ||

            "OTHER";

        if (!sectors[sector]) {

            sectors[sector] = {

                sector,

                symbols: 0,

                totalScore: 0,

                avgScore: 0

            };

        }

        sectors[sector].symbols++;

        sectors[sector].totalScore +=

            Number(
                symbol.adjustedScore || 0
            );

    }

    for (

        const sector of

        Object.values(sectors)

    ) {

        sector.avgScore =

            Number(

                (

                    sector.totalScore /

                    sector.symbols

                ).toFixed(2)

            );

    }

    return Object.values(sectors);

}

/*
==================================================
RANK SECTORS
==================================================
*/

function rankSectors(
    sectors = []
) {

    return sectors.sort(

        (a, b) =>

            b.avgScore -

            a.avgScore

    );

}
/*
==================================================
SECTOR CLASSIFICATION
==================================================
*/

function classifySector(
    avgScore
) {

    if (avgScore >= 85) {

        return "ACCUMULATE";

    }

    if (avgScore >= 70) {

        return "OVERWEIGHT";

    }

    if (avgScore >= 55) {

        return "NEUTRAL";

    }

    if (avgScore >= 40) {

        return "UNDERWEIGHT";

    }

    return "AVOID";

}

/*
==================================================
CAPITAL ALLOCATION
==================================================
*/

function calculateSectorAllocation(
    sectors = []
) {

    const totalScore = sectors.reduce(

        (sum, sector) =>

            sum + sector.avgScore,

        0

    );

    return sectors.map(sector => {

        const allocation =

            totalScore === 0

                ? 0

                :

                (

                    sector.avgScore /

                    totalScore

                ) * 100;

        return {

            ...sector,

            allocation:

                Number(
                    allocation.toFixed(2)
                ),

            recommendation:

                classifySector(
                    sector.avgScore
                )

        };

    });

}

/*
==================================================
SECTOR AI SCORE
==================================================
*/

function calculateSectorAIScore(
    sectors = []
) {

    if (
        sectors.length === 0
    ) {

        return 0;

    }

    const avg =

        sectors.reduce(

            (sum, sector) =>

                sum + sector.avgScore,

            0

        ) /

        sectors.length;

    return Number(
        avg.toFixed(2)
    );

}
/*
==================================================
MAIN ENGINE
==================================================
*/

async function analyzeSectorRotation() {

    try {

        const now = Date.now();

        if (

            cachedSectorRotation &&

            (now - cacheTimestamp) <
            CACHE_DURATION_MS

        ) {

            return cachedSectorRotation;

        }

        const capitalRotation =
            await analyzeCapitalRotation();

        const sectors =
            buildSectorPerformance(

                capitalRotation.recommendations

            );

        const ranked =
            rankSectors(
                sectors
            );

        const allocations =
            calculateSectorAllocation(
                ranked
            );

        const aiScore =
            calculateSectorAIScore(
                allocations
            );

        const result = {

            generatedAt:
                new Date(),

            sectors:
                allocations,

            topSectors:
                allocations.slice(0, 5),

            aiScore

        };

        cachedSectorRotation =
            result;

        cacheTimestamp =
            now;

        console.log(`
==================================
SECTOR ROTATION AI
==================================

Sectors:
${allocations.length}

Top Sector:
${allocations[0]?.sector || "NONE"}

Recommendation:
${allocations[0]?.recommendation || "NONE"}

Allocation:
${allocations[0]?.allocation || 0}%

AI Score:
${aiScore}

==================================
`);

        return result;

    }

    catch (err) {

        console.log(`
==================================
SECTOR ROTATION ERROR
==================================
`);

        console.log(err);

        console.log(`
==================================
`);

        return {

            generatedAt:
                new Date(),

            sectors: [],

            topSectors: [],

            aiScore: 0

        };

    }

}

/*
==================================================
CACHE
==================================================
*/

function clearSectorRotationCache() {

    cachedSectorRotation = null;

    cacheTimestamp = 0;

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

    analyzeSectorRotation,

    clearSectorRotationCache,

    buildSectorPerformance,

    rankSectors,

    classifySector,

    calculateSectorAllocation,

    calculateSectorAIScore

};
