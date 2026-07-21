"use strict";

const Constants = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryConstants");

class RegistryError extends Error {
  constructor(code, message, details = null) {
    super(message);

    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace?.(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp
    };
  }
}

class RegistryAlreadyExistsError extends RegistryError {
  constructor(name) {
    super(
      Constants.ERRORS.REGISTRY_ALREADY_EXISTS,
      `Registry '${name}' already exists.`,
      { registry: name }
    );
  }
}

class RegistryNotFoundError extends RegistryError {
  constructor(name) {
    super(
      Constants.ERRORS.REGISTRY_NOT_FOUND,
      `Registry '${name}' was not found.`,
      { registry: name }
    );
  }
}

class InvalidRegistryError extends RegistryError {
  constructor(registry) {
    super(
      Constants.ERRORS.INVALID_REGISTRY,
      "Invalid registry supplied.",
      { registry }
    );
  }
}

class InvalidRegistryNameError extends RegistryError {
  constructor(name) {
    super(
      Constants.ERRORS.INVALID_NAME,
      "Invalid registry name supplied.",
      { registry: name }
    );
  }
}

module.exports = {
  RegistryError,
  RegistryAlreadyExistsError,
  RegistryNotFoundError,
  InvalidRegistryError,
  InvalidRegistryNameError
};
