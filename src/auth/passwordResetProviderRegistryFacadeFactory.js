"use strict";

const PasswordResetProviderRegistryManager = require("./passwordResetProviderRegistryManager");
const PasswordResetProviderRegistryFacade = require("./passwordResetProviderRegistryFacade");

class PasswordResetProviderRegistryFacadeFactory {
  constructor(options = {}) {
    this.options = options;
  }

  create(overrides = {}) {
    const manager =
      overrides.manager ||
      new PasswordResetProviderRegistryManager(
        this.options.managerOptions || {}
      );

    return new PasswordResetProviderRegistryFacade({
      manager,
      ...overrides
    });
  }

  createSingleton() {
    if (!this.singleton) {
      this.singleton = this.create();
    }

    return this.singleton;
  }

  resetSingleton() {
    this.singleton = null;
  }

  hasSingleton() {
    return !!this.singleton;
  }
}

module.exports = PasswordResetProviderRegistryFacadeFactory;
