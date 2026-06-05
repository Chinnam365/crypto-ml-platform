function reconcilePositions({

  exchangePositions,

  databasePositions,

}) {

  const missing =

    exchangePositions.filter(

      exchangePosition =>

        !databasePositions.find(

          dbPosition =>

            dbPosition.symbol ===
            exchangePosition.symbol
        )
    );

  return {

    missing,

    reconciled:
      missing.length === 0,
  };
}

module.exports = {
  reconcilePositions,
};
