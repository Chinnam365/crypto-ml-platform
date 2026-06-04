function rotateCapital(
  candidates
) {

  const totalScore =
    candidates.reduce(
      (sum, c) =>
        sum + c.aiScore,
      0
    );

  return candidates.map(
    coin => ({

      symbol:
        coin.symbol,

      aiScore:
        coin.aiScore,

      allocation:
        Number(
          (
            (
              coin.aiScore /
              totalScore
            ) * 100
          ).toFixed(2)
        ),
    })
  );
}

module.exports = {
  rotateCapital,
};
