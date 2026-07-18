"use strict";

class PasswordResetSmsProvider {
  constructor(provider = null) {
    this.provider = provider;
  }

  async send(message = {}) {
    if (
      this.provider &&
      typeof this.provider.send === "function"
    ) {
      return this.provider.send(message);
    }

    return {
      success: true,
      provider: "noop",
      recipient: message.recipient || null,
      messageId: null,
      sentAt: new Date().toISOString()
    };
  }

  async verifyConnection() {
    if (
      this.provider &&
      typeof this.provider.verifyConnection === "function"
    ) {
      return this.provider.verifyConnection();
    }

    return {
      connected: true,
      provider: "noop"
    };
  }

  getName() {
    return this.provider?.name || "noop";
  }

  isConfigured() {
    return this.provider !== null;
  }
}

module.exports = PasswordResetSmsProvider;
