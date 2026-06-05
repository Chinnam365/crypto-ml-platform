const {
  validateDecision,
} = require(
  "../ml/aiGovernance"
);

function routeDecision({

  symbol,

  confidence,

  riskScore,

}) {

  const approved =
    validateDecision({

      confidence,

      riskScore,
    });

  return {

    symbol,

    approved,

    confidence,

    riskScore,
  };
}

module.exports = {
  routeDecision,
};
