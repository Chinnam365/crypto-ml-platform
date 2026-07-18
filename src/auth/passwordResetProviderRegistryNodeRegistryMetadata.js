"use strict";

const PasswordResetProviderRegistryNodeRegistryManifest = require("./passwordResetProviderRegistryNodeRegistryManifest");

class PasswordResetProviderRegistryNodeRegistryMetadata {
  constructor(options = {}) {
    this.manifest =
      options.manifest ||
      new PasswordResetProviderRegistryNodeRegistryManifest(options);

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
          "node-registry"
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
    this.tags = this.tags.filter((t) => t !== tag);
    this.touch();

    return this;
  }

  touch() {
    this.updatedAt = new Date().toISOString();
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
      metadata: "PasswordResetProviderRegistryNodeRegistryMetadata",
      data: this.toJSON(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeRegistryMetadata;
