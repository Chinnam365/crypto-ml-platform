"use strict";

const DEFAULT_CONFIG = Object.freeze({
  enabled: true,

  token: {
    length: 32,
    expiryMinutes: 30,
    allowMultipleActiveTokens: false
  },

  cleanup: {
    enabled: true,
    intervalMs: 5 * 60 * 1000
  },

  security: {
    invalidateAllOnPasswordChange: true,
    maxRequestsPerHour: 5,
    requireHttps: true,
    auditEnabled: true
  },

  notifications: {
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: false
  },

  metrics: {
    enabled: true
  }
});

class PasswordResetConfig {
  constructor(config = {}) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      token: {
        ...DEFAULT_CONFIG.token,
        ...(config.token || {})
      },
      cleanup: {
        ...DEFAULT_CONFIG.cleanup,
        ...(config.cleanup || {})
      },
      security: {
        ...DEFAULT_CONFIG.security,
        ...(config.security || {})
      },
      notifications: {
        ...DEFAULT_CONFIG.notifications,
        ...(config.notifications || {})
      },
      metrics: {
        ...DEFAULT_CONFIG.metrics,
        ...(config.metrics || {})
      }
    };
  }

  get() {
    return JSON.parse(JSON.stringify(this.config));
  }

  getSection(section) {
    return this.config[section];
  }

  update(partial = {}) {
    this.config = {
      ...this.config,
      ...partial
    };

    return this.get();
  }

  isEnabled() {
    return this.config.enabled === true;
  }
}

module.exports = {
  DEFAULT_CONFIG,
  PasswordResetConfig
};
