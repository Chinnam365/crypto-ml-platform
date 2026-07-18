"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceConstants = require("./passwordResetProviderRegistryNodeRegistryPersistenceConstants");

class PasswordResetProviderRegistryNodeRegistryPersistenceValidator {
  constructor(options = {}) {
    this.options = options;
    this.errors = [];
  }

  validate(config = {}) {
    this.errors = [];

    this.validateName(config.name);
    this.validateVersion(config.version);
    this.validateDirectory(config.directory);
    this.validateFilename(config.filename);
    this.validateEncoding(config.encoding);
    this.validateTimeout(config.timeoutMs);
    this.validateMaxBackups(config.maxBackups);

    return {
      valid: this.errors.length === 0,
      errors: [...this.errors]
    };
  }

  validateName(name) {
    if (typeof name !== "string" || name.trim() === "") {
      this.errors.push("Configuration 'name' must be a non-empty string.");
    }
  }

  validateVersion(version) {
    if (typeof version !== "string" || version.trim() === "") {
      this.errors.push("Configuration 'version' must be a non-empty string.");
    }
  }

  validateDirectory(directory) {
    if (typeof directory !== "string" || directory.trim() === "") {
      this.errors.push("Configuration 'directory' must be a non-empty string.");
    }
  }

  validateFilename(filename) {
    if (typeof filename !== "string" || filename.trim() === "") {
      this.errors.push("Configuration 'filename' must be a non-empty string.");
    }
  }

  validateEncoding(encoding) {
    if (typeof encoding !== "string" || encoding.trim() === "") {
      this.errors.push("Configuration 'encoding' must be a non-empty string.");
    }
  }

  validateTimeout(timeoutMs) {
    if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) {
      this.errors.push("Configuration 'timeoutMs' must be a positive integer.");
    }
  }

  validateMaxBackups(maxBackups) {
    if (!Number.isInteger(maxBackups) || maxBackups < 0) {
      this.errors.push("Configuration 'maxBackups' must be zero or greater.");
    }
  }

  validateDefaults() {
    return this.validate({
      name: PasswordResetProviderRegistryNodeRegistryPersistenceConstants.NAME,
      version: PasswordResetProviderRegistryNodeRegistryPersistenceConstants.VERSION,
      directory: PasswordResetProviderRegistryNodeRegistryPersistenceConstants.DEFAULT_DIRECTORY,
      filename: PasswordResetProviderRegistryNodeRegistryPersistenceConstants.DEFAULT_FILENAME,
      encoding: PasswordResetProviderRegistryNodeRegistryPersistenceConstants.DEFAULT_FILE_ENCODING,
      timeoutMs: PasswordResetProviderRegistryNodeRegistryPersistenceConstants.DEFAULT_TIMEOUT_MS,
      maxBackups: PasswordResetProviderRegistryNodeRegistryPersistenceConstants.DEFAULT_MAX_BACKUPS
    });
  }

  getErrors() {
    return [...this.errors];
  }

  clearErrors() {
    this.errors = [];
    return this;
  }

  status() {
    return {
      validator:
        "PasswordResetProviderRegistryNodeRegistryPersistenceValidator",
      valid: this.errors.length === 0,
      errorCount: this.errors.length,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceValidator;
