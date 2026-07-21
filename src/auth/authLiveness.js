"use strict";

class AuthLiveness {
  constructor(options = {}) {
    this.startedAt = options.startedAt || new Date().toISOString();
  }

  check() {
    return {
      alive: true,
      service: "Authentication",
      uptimeSeconds: Math.floor(process.uptime()),
      startedAt: this.startedAt,
      checkedAt: new Date().toISOString()
    };
  }

  isAlive() {
    return true;
  }

  status() {
    return this.check();
  }
}

module.exports = AuthLiveness;
