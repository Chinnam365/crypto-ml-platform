"use strict";

class PasswordResetProviderRegistryNode {
  constructor({
    id,
    name,
    host = "localhost",
    port = null,
    metadata = {}
  } = {}) {
    this.id = id || null;
    this.name = name || "default";
    this.host = host;
    this.port = port;
    this.metadata = metadata;

    this.status = "offline";
    this.startedAt = null;
    this.stoppedAt = null;
    this.lastHeartbeat = null;
  }

  start() {
    this.status = "online";
    this.startedAt = new Date().toISOString();
    this.lastHeartbeat = this.startedAt;

    return this.status();
  }

  stop() {
    this.status = "offline";
    this.stoppedAt = new Date().toISOString();

    return this.status();
  }

  heartbeat() {
    this.lastHeartbeat = new Date().toISOString();

    return this.lastHeartbeat;
  }

  updateMetadata(metadata = {}) {
    this.metadata = {
      ...this.metadata,
      ...metadata
    };

    return this.metadata;
  }

  status() {
    return {
      id: this.id,
      name: this.name,
      host: this.host,
      port: this.port,
      state: this.status,
      metadata: this.metadata,
      startedAt: this.startedAt,
      stoppedAt: this.stoppedAt,
      lastHeartbeat: this.lastHeartbeat
    };
  }
}

module.exports = PasswordResetProviderRegistryNode;
