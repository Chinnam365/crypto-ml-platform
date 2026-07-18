"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceManifest = require("./passwordResetProviderRegistryNodeRegistryPersistenceManifest");

class PasswordResetProviderRegistryNodeRegistryPersistenceMetadata {
  constructor(options = {}) {
    this.manifest =
      options.manifest ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceManifest(options);

    this.createdAt =
      options.createdAt || new Date().toISOString();

    this.updatedAt =
      options.updatedAt || this.createdAt;

    this.tags = Array.isArray(options.tags)
      ? [...options.tags]
      : [
          "authentication",
          "password-reset",
          "provider-registry",
          "node-registry",
          "persistence"
        ];
  }

  getManifest() {
    return this.manifest;
  }

  getTags() {
    return [...this.tags];
  }

  addTag(tag) {
    if (tag && !this.tags.includes(tag)) {
      this.tags.push(tag);
      this.touch();
    }

    return this;
  }

  removeTag(tag) {
    this.tags = this.tags.filter((value) => value !== tag);
    this.touch();

    return this;
  }

  hasTag(tag) {
    return this.tags.includes(tag);
  }

  touch() {
    this.updatedAt = new Date().toISOString();
    return this;
  }

  toJSON() {
    return {
      manifest: this.manifest.toJSON(),
      tags: [...this.tags],
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  status() {
    return {
      metadata:
        "PasswordResetProviderRegistryNodeRegistryPersistenceMetadata",
      data: this.toJSON(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceMetadata;
