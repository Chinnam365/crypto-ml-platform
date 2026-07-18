"use strict";

class PasswordResetProviderFailover {
  constructor(selector) {
    this.selector = selector;
  }

  async execute(providerOrder = [], operation) {
    const failures = [];

    for (const providerType of providerOrder) {
      const provider = this.selector
        ? this.selector.select(providerType)
        : null;

      if (!provider) {
        failures.push({
          provider: providerType,
          error: "PROVIDER_NOT_AVAILABLE"
        });
        continue;
      }

      try {
        const result = await operation(provider, providerType);

        return {
          success: true,
          provider: providerType,
          result,
          failures
        };
      } catch (error) {
        failures.push({
          provider: providerType,
          error: error.message
        });
      }
    }

    return {
      success: false,
      provider: null,
      result: null,
      failures
    };
  }

  async executeSingle(providerType, operation) {
    return this.execute([providerType], operation);
  }

  async broadcast(providerTypes = [], operation) {
    const results = [];

    for (const providerType of providerTypes) {
      const outcome = await this.executeSingle(
        providerType,
        operation
      );

      results.push(outcome);
    }

    return results;
  }
}

module.exports = PasswordResetProviderFailover;
