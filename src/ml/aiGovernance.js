function validateDecision({

  confidence,

  riskScore,

}) {

  if (
    confidence < 50
  ) {

    return false;
  }

  if (
    riskScore > 80
  ) {

    return false;
  }

  return true;
}

module.exports = {
  validateDecision,
};
