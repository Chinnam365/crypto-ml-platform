"use strict";

const PasswordResetProviderRegistryNodeRepository = require("./passwordResetProviderRegistryNodeRepository");

class PasswordResetProviderRegistryNodeService {
  constructor(options = {}) {
    this.repository =
      options.repository ||
      new PasswordResetProviderRegistryNodeRepository(options);
  }

  create(data = {}) {
    return this.repository.create(data);
  }

  save(node) {
    return this.repository.save(node);
  }

  findById(id) {
    return this.repository.findById(id);
  }

  exists(id) {
    return this.repository.exists(id);
  }

  delete(id) {
    return this.repository.delete(id);
  }

  list() {
    return this.repository.findAll();
  }

  count() {
    return this.repository.count();
  }

  clear() {
    return this.repository.clear();
  }

  start(id) {
    const node = this.findById(id);

    if (!node) {
      return null;
    }

    node.start();
    return this.save(node);
  }

  stop(id) {
    const node = this.findById(id);

    if (!node) {
      return null;
    }

    node.stop();
    return this.save(node);
  }

  heartbeat(id) {
    const node = this.findById(id);

    if (!node) {
      return null;
    }

    node.heartbeat();
    return this.save(node);
  }

  status() {
    return {
      service: "PasswordResetProviderRegistryNodeService",
      repository: this.repository.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeService;
