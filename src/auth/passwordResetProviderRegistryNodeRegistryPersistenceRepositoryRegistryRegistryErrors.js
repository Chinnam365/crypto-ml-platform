"use strict";

const Constants = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryConstants");

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

class ProviderAlreadyExistsError extends RegistryError {
  constructor(name) {
    super(
      Constants.ERRORS.PROVIDER_ALREADY_EXISTS,
      `Provider '${name}' is already registered.`,
      { provider: name }
    );
  }
}

class ProviderNotFoundError extends RegistryError {
  constructor(name) {
    super(
      Constants.ERRORS.PROVIDER_NOT_FOUND,
      `Provider '${name}' was not found.`,
      { provider: name }
    );
  }
}

class InvalidProviderError extends RegistryError {
  constructor(provider) {
    super(
      Constants.ERRORS.INVALID_PROVIDER,
      "Invalid provider supplied.",
      { provider }
    );
  }
}

class InvalidProviderNameError extends RegistryError {
  constructor(name) {
    super(
      Constants.ERRORS.INVALID_NAME,
      "Invalid provider name supplied.",
      { provider: name }
    );
  }
}

module.exports = {
  RegistryError,
  ProviderAlreadyExistsError,
  ProviderNotFoundError,
  InvalidProviderError,
  InvalidProviderNameError
};
