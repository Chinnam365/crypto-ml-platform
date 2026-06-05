const {
  validateDecision,
} = require(
  "../ml/aiGovernance"
);

async function approveTrade({

  confidence,

  riskScore,

}) {

  return validateDecision({

    confidence,

    riskScore,
  });
}

module.exports = {
  approveTrade,
};
