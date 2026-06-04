function classifyFearGreed(
  value
) {

  if (
    value >= 80
  ) {

    return
      "EXTREME_GREED";
  }

  if (
    value >= 60
  ) {

    return
      "GREED";
  }

  if (
    value >= 40
  ) {

    return
      "NEUTRAL";
  }

  if (
    value >= 20
  ) {

    return
      "FEAR";
  }

  return
    "EXTREME_FEAR";
}

module.exports = {
  classifyFearGreed,
};
