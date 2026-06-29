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

            let score = 50;

            score +=
                (winRate - 50);

            score +=
                avgPnL * 2;

            score =
                Math.max(
                    0,
                    Math.min(
                        100,
                        Math.round(score)
                    )
                );

            let classification =
                "NEUTRAL";

            if (score >= 80)
                classification = "PROMOTE";

            else if (score >= 60)
                classification = "FAVOR";

            else if (score < 40)
                classification = "SUPPRESS";

            else if (score < 20)
                classification = "DISABLE";

            return {

                ...symbol,

                score,

                classification

            };

        });

    return symbols;

}

module.exports = {

    getSymbolIntelligence

};
