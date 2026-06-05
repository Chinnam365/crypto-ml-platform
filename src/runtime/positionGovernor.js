function canOpenPosition({

  openPositions,

  maxPositions,

}) {

  return (

    openPositions <
    maxPositions
  );
}

module.exports = {
  canOpenPosition,
};
