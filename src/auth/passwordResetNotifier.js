"use strict";

class PasswordResetNotifier {
  constructor(options = {}) {
    this.emailProvider =
      options.emailProvider || null;

    this.smsProvider =
      options.smsProvider || null;

    this.pushProvider =
      options.pushProvider || null;
  }

  async notifyPasswordResetRequested(user, resetToken) {
    return this.send({
      type: "PASSWORD_RESET_REQUESTED",
      user,
      payload: {
        resetToken
      }
    });
  }

  async notifyPasswordResetCompleted(user) {
    return this.send({
      type: "PASSWORD_RESET_COMPLETED",
      user,
      payload: {}
    });
  }

  async notifyPasswordChanged(user) {
    return this.send({
      type: "PASSWORD_CHANGED",
      user,
      payload: {}
    });
  }

  async send(notification) {
    const result = {
      email: false,
      sms: false,
      push: false
    };

    if (
      this.emailProvider &&
      typeof this.emailProvider.send === "function"
    ) {
      await this.emailProvider.send(notification);
      result.email = true;
    }

    if (
      this.smsProvider &&
      typeof this.smsProvider.send === "function"
    ) {
      await this.smsProvider.send(notification);
      result.sms = true;
    }

    if (
      this.pushProvider &&
      typeof this.pushProvider.send === "function"
    ) {
      await this.pushProvider.send(notification);
      result.push = true;
    }

    return result;
  }
}

module.exports = PasswordResetNotifier;
