"use strict";

const PasswordResetProviderRegistry = require("./passwordResetProviderRegistry");
const PasswordResetProviderFactory = require("./passwordResetProviderFactory");
const PasswordResetProviderHealth = require("./passwordResetProviderHealth");
const PasswordResetProviderMetrics = require("./passwordResetProviderMetrics");

class PasswordResetProviderManager {
  constructor(options = {}) {
    this.registry =
      options.registry ||
      new PasswordResetProviderRegistry();

    this.factory =
      options.factory ||
      new PasswordResetProviderFactory();

    this.health =
      options.health ||
      new PasswordResetProviderHealth(this.registry);

    this.metrics =
      options.metrics ||
      new PasswordResetProviderMetrics();
  }

  register(type, providerImplementation = null) {
    const provider = this.factory.create(
      type,
      providerImplementation
    );

    this.registry.register(type, provider);
    this.metrics.register(type);

    return provider;
  }

  unregister(type) {
    return this.registry.unregister(type);
  }

  get(type) {
    return this.registry.get(type);
  }

  list() {
    return this.registry.list();
  }

  async verifyHealth() {
    return this.health.verifyProviders();
  }

  getHealth() {
    return this.health.getHealth();
  }

  getMetrics() {
    return this.metrics.summary();
  }

  clear() {
    this.registry.clear();
    this.metrics.reset();
  }
}

module.exports = PasswordResetProviderManager;
