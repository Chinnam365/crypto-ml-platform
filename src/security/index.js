"use strict";

const passwordService = require("./passwordService");
const encryptionService = require("./encryptionService");
const tokenManager = require("./tokenManager");
const sessionManager = require("./sessionManager");
const secretManager = require("./secretManager");
const keyRotationService = require("./keyRotationService");
const totpService = require("./totpService");
const auditLogger = require("./auditLogger");
const emergencyStopService = require("./emergencyStopService");
const securityHealthService = require("./securityHealthService");
const securityBootstrap = require("./securityBootstrap");

module.exports = Object.freeze({
  initialize: securityBootstrap.initialize.bind(securityBootstrap),
  shutdown: securityBootstrap.shutdown.bind(securityBootstrap),

  password: passwordService,

  encryption: encryptionService,

  tokens: tokenManager,

  sessions: sessionManager,

  secrets: secretManager,

  keyRotation: keyRotationService,

  totp: totpService,

  audit: auditLogger,

  emergency: emergencyStopService,

  health: securityHealthService
});
