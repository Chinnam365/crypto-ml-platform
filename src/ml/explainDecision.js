function explainDecision({

  side,

  confidence,

  threshold,

  volatility,

  trend,

  regime,

  tradeQuality,

  multiTf = {},

  consensusStrength = 0,

  sentiment = "NEUTRAL",

  riskMode = "NORMAL",

  anomalyThreat = "NORMAL",

  predictedState = "NEUTRAL",
}) {

  const reasons = [];

  /*
  ==================================================
  DECISION
  ==================================================
  */

  if (side === "BUY") {

    reasons.push(
      "Bullish conditions detected"
    );
  }

  else if (side === "SELL") {

    reasons.push(
      "Bearish conditions detected"
    );
  }

  else {

    reasons.push(
      "No strong directional signal"
    );
  }

  /*
  ==================================================
  CONFIDENCE
  ==================================================
  */

  if (
    confidence >= threshold
  ) {

    reasons.push(
      "Confidence exceeded threshold"
    );
  }

  else {

    reasons.push(
      "Confidence below adaptive threshold"
    );
  }

  /*
  ==================================================
  CONSENSUS
  ==================================================
  */

  if (
    consensusStrength >= 80
  ) {

    reasons.push(
      "Strong intelligence consensus"
    );
  }

  else if (
    consensusStrength >= 60
  ) {

    reasons.push(
      "Moderate intelligence consensus"
    );
  }

  else if (
    consensusStrength > 0
  ) {

    reasons.push(
      "Weak intelligence consensus"
    );
  }

  /*
  ==================================================
  VOLATILITY
  ==================================================
  */

  if (
    volatility < 0.4
  ) {

    reasons.push(
      "Volatility too low"
    );
  }

  else if (
    volatility > 7
  ) {

    reasons.push(
      "Volatility extremely high"
    );
  }

  else if (
    volatility > 3
  ) {

    reasons.push(
      "Elevated volatility detected"
    );
  }

  /*
  ==================================================
  MULTI TIMEFRAME
  ==================================================
  */

  if (

    multiTf?.overallTrend ===
    trend

  ) {

    reasons.push(
      "Trend aligned across timeframes"
    );
  }

  else {

    reasons.push(
      "Timeframe trend conflict"
    );
  }

  /*
  ==================================================
  REGIME
  ==================================================
  */

  reasons.push(
    `Market regime: ${regime}`
  );

  /*
  ==================================================
  SENTIMENT
  ==================================================
  */

  if (
    sentiment !== "NEUTRAL"
  ) {

    reasons.push(
      `Market sentiment: ${sentiment}`
    );
  }

  /*
  ==================================================
  PREDICTED STATE
  ==================================================
  */

  if (
    predictedState !== "NEUTRAL"
  ) {

    reasons.push(
      `Predicted market state: ${predictedState}`
    );
  }

  /*
  ==================================================
  TRADE QUALITY
  ==================================================
  */

  if (
    tradeQuality >= 85
  ) {

    reasons.push(
      "Institutional-grade setup"
    );
  }

  else if (
    tradeQuality >= 70
  ) {

    reasons.push(
      "High quality setup"
    );
  }

  else if (
    tradeQuality >= 50
  ) {

    reasons.push(
      "Moderate quality setup"
    );
  }

  else {

    reasons.push(
      "Low quality setup"
    );
  }

  /*
  ==================================================
  RISK MODE
  ==================================================
  */

  if (
    riskMode !== "NORMAL"
  ) {

    reasons.push(
      `Risk mode: ${riskMode}`
    );
  }

  /*
  ==================================================
  ANOMALY DETECTION
  ==================================================
  */

  if (
    anomalyThreat !== "NORMAL"
  ) {

    reasons.push(
      `Anomaly threat: ${anomalyThreat}`
    );
  }

  /*
  ==================================================
  RETURN
  ==================================================
  */

  return reasons;
}

module.exports = {
  explainDecision,
};
