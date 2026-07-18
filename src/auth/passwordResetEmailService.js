"use strict";

const PasswordResetNotifier = require("./passwordResetNotifier");
const PasswordResetTemplates = require("./passwordResetTemplates");

class PasswordResetEmailService {
  constructor(options = {}) {
    this.notifier =
      options.notifier ||
      new PasswordResetNotifier(options);

    this.templates =
      options.templates ||
      new PasswordResetTemplates();
  }

  async sendResetRequest(user, token, expiresAt) {
    const template =
      this.templates.passwordResetRequested({
        name: user.name,
        token,
        expiresAt
      });

    return this.notifier.send({
      type: "PASSWORD_RESET_REQUEST",
      recipient: user.email,
      subject: template.subject,
      text: template.text
    });
  }

  async sendResetConfirmation(user) {
    const template =
      this.templates.passwordResetCompleted({
        name: user.name
      });

    return this.notifier.send({
      type: "PASSWORD_RESET_CONFIRMATION",
      recipient: user.email,
      subject: template.subject,
      text: template.text
    });
  }

  async sendPasswordChanged(user) {
    const template =
      this.templates.passwordChanged({
        name: user.name
      });

    return this.notifier.send({
      type: "PASSWORD_CHANGED",
      recipient: user.email,
      subject: template.subject,
      text: template.text
    });
  }
}

module.exports = PasswordResetEmailService;
