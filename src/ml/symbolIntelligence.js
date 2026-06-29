[
  {
    "symbol":"BTCUSDT",
    "score":22,
    "classification":"DISABLE"
  },
  {
    "symbol":"LINKUSDT",
    "score":91,
    "classification":"PROMOTE"
  }
]
/*
==================================================
SYMBOL INTELLIGENCE
==================================================
*/

async function getSymbolIntelligence(pool) {

    const result = await pool.query(`
        SELECT

            symbol,

            COUNT(*) AS trades,

            SUM(
                CASE
                    WHEN pnl > 0
                    THEN 1
                    ELSE 0
                END
            ) AS wins,

            SUM(
                CASE
                    WHEN pnl <= 0
                    THEN 1
                    ELSE 0
                END
            ) AS losses,

            ROUND(
                AVG(
                    NULLIF(pnl::text,'NaN')::numeric
                ),
                2
            ) AS average_pnl,

            ROUND(
                100.0 *
                SUM(
                    CASE
                        WHEN pnl > 0
                        THEN 1
                        ELSE 0
                    END
                )
                /
                COUNT(*),
                2
            ) AS win_rate

        FROM positions

        WHERE status='CLOSED'

        GROUP BY symbol

        HAVING COUNT(*)>=5

        ORDER BY win_rate DESC;
    `);

    const symbols =
        result.rows.map(symbol => {

            const winRate =
    Number(symbol.win_rate);

const avgPnL =
    Number(symbol.average_pnl);

const trades =
    Number(symbol.trades);

const wins =
    Number(symbol.wins);

const losses =
    Number(symbol.losses);

// ==========================================
// WIN RATE SCORE
// ==========================================

let winRateScore =
    winRate;

// ==========================================
// PROFIT SCORE
// ==========================================

let profitScore = 50;

if (avgPnL > 10)
    profitScore = 100;
else if (avgPnL > 5)
    profitScore = 80;
else if (avgPnL > 2)
    profitScore = 70;
else if (avgPnL > 0)
    profitScore = 60;
else if (avgPnL > -2)
    profitScore = 40;
else if (avgPnL > -5)
    profitScore = 20;
else
    profitScore = 0;

// ==========================================
// EXPERIENCE SCORE
// ==========================================

let experienceScore =
    Math.min(
        100,
        trades
    );

// ==========================================
// CONSISTENCY SCORE
// ==========================================

let consistencyScore = 50;

if (wins + losses > 0) {

    consistencyScore =
        Math.max(
            0,
            100 -
            (
                Math.abs(
                    wins - losses
                ) * 2
            )
        );

}

// ==========================================
// FINAL SCORE
// ==========================================

const score =
    Math.round(

        (
            winRateScore * 0.35
        ) +

        (
            profitScore * 0.35
        ) +

        (
            experienceScore * 0.15
        ) +

        (
            consistencyScore * 0.15
        )

    );

let classification =
    "NEUTRAL";

if (score >= 80)
    classification = "PROMOTE";

else if (score >= 65)
    classification = "FAVOR";

else if (score >= 45)
    classification = "NEUTRAL";

else if (score >= 20)
    classification = "SUPPRESS";

else
    classification = "DISABLE";

return {

    ...symbol,

    score,

    winRateScore,

    profitScore,

    experienceScore,

    consistencyScore,

    classification

};

        });

    return symbols;

}

module.exports = {

    getSymbolIntelligence

};
