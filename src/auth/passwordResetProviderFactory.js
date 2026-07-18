"use strict";

const PasswordResetEmailProvider = require("./passwordResetEmailProvider");
const PasswordResetSmsProvider = require("./passwordResetSmsProvider");
const PasswordResetPushProvider = require("./passwordResetPushProvider");

class PasswordResetProviderFactory {
  create(type, provider = null) {
    switch ((type || "").toLowerCase()) {
      case "email":
        return new PasswordResetEmailProvider(provider);

      case "sms":
        return new PasswordResetSmsProvider(provider);

      case "push":
        return new PasswordResetPushProvider(provider);

      default:
        throw new Error(
          `Unsupported password reset provider type: ${type}`
        );
    }
  }

  createAll(providers = {}) {
    return {
      email: this.create(
        "email",
        providers.email || null
      ),
      sms: this.create(
        "sms",
        providers.sms || null
      ),
      push: this.create(
        "push",
        providers.push || null
      )
    };
  }

  supportedProviders() {
    return [
      "email",
      "sms",
      "push"
    ];
  }
}

module.exports = PasswordResetProviderFactory;
