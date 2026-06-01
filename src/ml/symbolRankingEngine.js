// src/ml/symbolRankingEngine.js

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getClassification(score) {
  if (score >= 90) return "ELITE";
  if (score >= 75) return "LEADER";
  if (score >= 60) return "ACTIVE";
  if (score >= 40) return "WATCHLIST";
  return "SUPPRESSED";
}

function getAllocation(classification) {
  switch (classification) {
    case "ELITE":
      return 3.0;

    case "LEADER":
      return 2.0;

    case "ACTIVE":
      return 1.5;

    case "WATCHLIST":
      return 0.75;

    default:
      return 0;
  }
}

async function generateSymbolRankings() {
  try {
    const positionsResult = await pool.query(`
      SELECT *
      FROM positions
      WHERE status = 'CLOSED'
    `);

    const reinforcementResult = await pool.query(`
      SELECT *
      FROM reinforcement_memory
    `);

    const positions = positionsResult.rows;
    const reinforcementMemory = reinforcementResult.rows;

    const symbols = [
      "BTCUSDT",
      "ETHUSDT",
      "SOLUSDT",
      "LINKUSDT",
      "DOGEUSDT",
    ];

    const rankings = [];

    for (const symbol of symbols) {
      const symbolTrades = positions.filter(
        (p) => p.symbol === symbol
      );

      const tradeCount = symbolTrades.length;

      if (tradeCount === 0) {
        rankings.push({
          symbol,
          score: 0,
          rank: 0,
          classification: "SUPPRESSED",
          allocation: 0,
          status: "NO_DATA",
        });

        continue;
      }

      const wins = symbolTrades.filter(
        (t) => Number(t.pnl) > 0
      ).length;

      const winRate =
        tradeCount > 0
          ? (wins / tradeCount) * 100
          : 0;

      const avgPnl =
        symbolTrades.reduce(
          (sum, t) => sum + Number(t.pnl || 0),
          0
        ) / tradeCount;

      const avgConfidence =
        symbolTrades.reduce(
          (sum, t) => sum + Number(t.confidence || 0),
          0
        ) / tradeCount;

      const recentTrades = symbolTrades
        .sort(
          (a, b) =>
            new Date(b.closed_at) -
            new Date(a.closed_at)
        )
        .slice(0, 20);

      const recentPnl =
        recentTrades.length > 0
          ? recentTrades.reduce(
              (sum, t) =>
                sum + Number(t.pnl || 0),
              0
            ) / recentTrades.length
          : 0;

      const avgVolatility =
        symbolTrades.reduce(
          (sum, t) =>
            sum + Number(t.volatility || 1),
          0
        ) / tradeCount;

      const volatilityEfficiency =
        avgVolatility > 0
          ? (avgPnl / avgVolatility) * 100
          : 0;

      const reinforcementRows =
        reinforcementMemory.filter(
          (r) =>
            r.context_key &&
            r.context_key.includes(symbol)
        );

      const avgReward =
        reinforcementRows.length > 0
          ? reinforcementRows.reduce(
              (sum, r) =>
                sum +
                Number(r.avg_reward || 0),
              0
            ) / reinforcementRows.length
          : 0;

      const winRateScore =
        clamp(winRate, 0, 100);

      const pnlScore =
        clamp(avgPnl * 10 + 50, 0, 100);

      const rewardScore =
        clamp(avgReward * 10 + 50, 0, 100);

      const confidenceScore =
        clamp(avgConfidence, 0, 100);

      const recentScore =
        clamp(recentPnl * 10 + 50, 0, 100);

      const volatilityScore =
        clamp(
          volatilityEfficiency + 50,
          0,
          100
        );

      const finalScore =
        winRateScore * 0.25 +
        pnlScore * 0.20 +
        rewardScore * 0.20 +
        confidenceScore * 0.15 +
        recentScore * 0.10 +
        volatilityScore * 0.10;

      const classification =
        getClassification(finalScore);

      rankings.push({
        symbol,

        trades: tradeCount,

        winRate:
          Number(winRate.toFixed(2)),

        avgPnl:
          Number(avgPnl.toFixed(2)),

        avgConfidence:
          Number(
            avgConfidence.toFixed(2)
          ),

        avgReward:
          Number(avgReward.toFixed(2)),

        score:
          Number(finalScore.toFixed(2)),

        classification,

        allocation:
          getAllocation(classification),

        status:
          classification ===
          "SUPPRESSED"
            ? "SUPPRESSED"
            : "ACTIVE",
      });
    }

    rankings.sort(
      (a, b) => b.score - a.score
    );

    rankings.forEach(
      (item, index) => {
        item.rank = index + 1;
      }
    );

    return {
      rankings,
      generatedAt: new Date(),
    };
  } catch (error) {
    console.error(
      "Symbol Ranking Engine Error:",
      error
    );

    return {
      rankings: [],
      error: error.message,
    };
  }
}

module.exports = {
  generateSymbolRankings,
};
