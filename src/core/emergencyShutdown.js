function shouldShutdown({

  drawdown,

  systemHealth,

}) {

  if (
    drawdown > 30
  ) {

    return true;
  }

  if (
    systemHealth ===
    "CRITICAL"
  ) {

    return true;
  }

  return false;
}

module.exports = {
  shouldShutdown,
};
