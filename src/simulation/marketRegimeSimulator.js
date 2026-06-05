function simulateRegime(
  regime
) {

  return {

    regime,

    volatility:

      regime ===
      "CHAOTIC"

        ? 10

        : regime ===
          "TRENDING"

        ? 5

        : 2,

    simulated:
      true,
  };
}

module.exports = {
  simulateRegime,
};
