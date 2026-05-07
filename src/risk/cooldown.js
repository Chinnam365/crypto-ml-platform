let cooldownUntil = null;

function startCooldown(minutes = 30) {
  cooldownUntil = Date.now() + minutes * 60 * 1000;

  console.log("Cooldown started");
}

function isCooldownActive() {
  if (!cooldownUntil) {
    return false;
  }

  return Date.now() < cooldownUntil;
}

function getCooldownRemaining() {
  if (!cooldownUntil) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor((cooldownUntil - Date.now()) / 1000)
  );
}

module.exports = {
  startCooldown,
  isCooldownActive,
  getCooldownRemaining,
};
