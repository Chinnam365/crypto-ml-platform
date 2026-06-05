function getPlatformStatus() {

  return {

    phase1:
      "COMPLETE",

    phase2:
      "COMPLETE",

    phase3:
      "COMPLETE",

    phase4:
      "ACTIVE",

    phase5:
      "READY",

    phase6:
      "READY",

    phase7:
      "READY",

    status:
      "ONLINE",

    timestamp:
      new Date()
        .toISOString(),
  };
}

module.exports = {
  getPlatformStatus,
};
