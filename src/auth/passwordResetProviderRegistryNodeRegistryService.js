"use strict";

const PasswordResetProviderRegistryNodeRegistryRepository = require("./passwordResetProviderRegistryNodeRegistryRepository");

class PasswordResetProviderRegistryNodeRegistryService {
  constructor(options = {}) {
    this.repository =
      options.repository ||
      new PasswordResetProviderRegistryNodeRegistryRepository(options);
  }

  getRegistry() {
    return this.repository.getRegistry();
  }

  save(registry) {
    return this.repository.save(registry);
  }

  reset() {
    return this.repository.reset();
  }

  register(id, app) {
    return this.getRegistry().register(id, app);
  }

  unregister(id) {
    return this.getRegistry().unregister(id);
  }

  get(id) {
    return this.getRegistry().get(id);
  }

  exists(id) {
    return this.getRegistry().exists(id);
  }

  list() {
    return this.getRegistry().list();
  }

  count() {
    return this.getRegistry().count();
  }

  clear() {
    return this.getRegistry().clear();
  }

  status() {
    return {
      service:
        "PasswordResetProviderRegistryNodeRegistryService",
      repository: this.repository.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryService;
