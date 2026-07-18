"use strict";

class PasswordResetTemplates {
  passwordResetRequested(data = {}) {
    return {
      subject: "Password Reset Request",
      text: [
        `Hello ${data.name || "User"},`,
        "",
        "We received a request to reset your password.",
        "",
        `Reset Token: ${data.token || ""}`,
        `Expires: ${data.expiresAt || ""}`,
        "",
        "If you did not request this change, please ignore this message.",
        "",
        "Security Team"
      ].join("\n")
    };
  }

  passwordResetCompleted(data = {}) {
    return {
      subject: "Password Successfully Reset",
      text: [
        `Hello ${data.name || "User"},`,
        "",
        "Your password has been successfully reset.",
        "",
        "If you did not perform this action, please contact support immediately.",
        "",
        "Security Team"
      ].join("\n")
    };
  }

  passwordChanged(data = {}) {
    return {
      subject: "Password Changed",
      text: [
        `Hello ${data.name || "User"},`,
        "",
        "Your account password has been changed.",
        "",
        "If this was not you, contact support immediately.",
        "",
        "Security Team"
      ].join("\n")
    };
  }
}

module.exports = PasswordResetTemplates;
