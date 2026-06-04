function scorePortfolioAsset({

  confidence,

  winRate,

  rewardScore,

  volatility,

}) {

  const score =

    (confidence * 0.35)

    +

    (winRate * 0.30)

    +

    (rewardScore * 0.25)

    -

    (volatility * 0.10);

  return Number(
    score.toFixed(2)
  );
}

module.exports = {
  scorePortfolioAsset,
};
