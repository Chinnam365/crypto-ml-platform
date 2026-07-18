"use strict";

class PasswordResetProviderBalancer {
  constructor(selector) {
    this.selector = selector;
    this.roundRobinIndex = 0;
  }

  select(providers = []) {
    const available = this.selector
      ? this.selector.selectAvailable(providers)
      : [];

    if (available.length === 0) {
      return null;
    }

    const provider =
      available[
        this.roundRobinIndex % available.length
      ];

    this.roundRobinIndex =
      (this.roundRobinIndex + 1) %
      available.length;

    return provider;
  }

  selectFirst(providers = []) {
    const available = this.selector
      ? this.selector.selectAvailable(providers)
      : [];

    return available.length > 0
      ? available[0]
      : null;
  }

  selectAll(providers = []) {
    return this.selector
      ? this.selector.selectAvailable(providers)
      : [];
  }

  reset() {
    this.roundRobinIndex = 0;
  }

  getStatus() {
    return {
      strategy: "ROUND_ROBIN",
      nextIndex: this.roundRobinIndex
    };
  }
}

module.exports = PasswordResetProviderBalancer;
