"use strict";

const fs = require("fs");
const path = require("path");

const PasswordResetProviderRegistryNodeRegistrySerializer = require("./passwordResetProviderRegistryNodeRegistrySerializer");
const PasswordResetProviderRegistryNodeRegistryDeserializer = require("./passwordResetProviderRegistryNodeRegistryDeserializer");

class PasswordResetProviderRegistryNodeRegistryPersistence {
  constructor(options = {}) {
    this.filePath =
      options.filePath ||
      path.join(process.cwd(), "data", "password-reset-provider-registry-node-registry.json");

    this.serializer =
      options.serializer ||
      new PasswordResetProviderRegistryNodeRegistrySerializer();

    this.deserializer =
      options.deserializer ||
      new PasswordResetProviderRegistryNodeRegistryDeserializer({
        serializer: this.serializer
      });
  }

  save(data) {
    const directory = path.dirname(this.filePath);

    fs.mkdirSync(directory, { recursive: true });

    fs.writeFileSync(
      this.filePath,
      this.serializer.serialize(data),
      "utf8"
    );

    return this.filePath;
  }

  load() {
    if (!fs.existsSync(this.filePath)) {
      return null;
    }

    const content = fs.readFileSync(this.filePath, "utf8");

    return this.deserializer.deserialize(content);
  }

  exists() {
    return fs.existsSync(this.filePath);
  }

  delete() {
    if (!this.exists()) {
      return false;
    }

    fs.unlinkSync(this.filePath);

    return true;
  }

  backup(destinationPath) {
    if (!this.exists()) {
      throw new Error("Registry persistence file does not exist.");
    }

    const target =
      destinationPath ||
      `${this.filePath}.${Date.now()}.bak`;

    fs.copyFileSync(this.filePath, target);

    return target;
  }

  restore(sourcePath) {
    if (!fs.existsSync(sourcePath)) {
      throw new Error("Backup file does not exist.");
    }

    const directory = path.dirname(this.filePath);

    fs.mkdirSync(directory, { recursive: true });

    fs.copyFileSync(sourcePath, this.filePath);

    return this.load();
  }

  status() {
    return {
      persistence: "PasswordResetProviderRegistryNodeRegistryPersistence",
      filePath: this.filePath,
      exists: this.exists(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeRegistryPersistence;
