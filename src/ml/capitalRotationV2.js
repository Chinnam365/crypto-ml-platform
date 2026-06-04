function calculateCapitalRotation({

  opportunities,

}) {

  const totalScore =
    opportunities.reduce(

      (sum, item) =>

        sum +
        item.aiScore,

      0
    );

  return opportunities.map(

    item => ({

      symbol:
        item.symbol,

      allocation:

        Number(

          (

            (
              item.aiScore /
              totalScore
            ) * 100

          ).toFixed(2)
        ),
    })
  );
}

module.exports = {
  calculateCapitalRotation,
};
