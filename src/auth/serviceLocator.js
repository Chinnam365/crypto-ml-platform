"use strict";

const serviceRegistry = require("./serviceRegistry");

class AuthenticationServiceLocator {
  getAuthService() {
    return serviceRegistry.get("authService");
  }

  getRepository() {
    return serviceRegistry.get("authRepository");
  }

  getTokenManager() {
    return serviceRegistry.get("tokenManager");
  }

  getSessionManager() {
    return serviceRegistry.get("sessionManager");
  }

  getPasswordService() {
    return serviceRegistry.get("passwordService");
  }

  getEncryptionService() {
    return serviceRegistry.get("encryptionService");
  }

  getTotpService() {
    return serviceRegistry.get("totpService");
  }

  getAuditLogger() {
    return serviceRegistry.get("auditLogger");
  }

  getSecretManager() {
    return serviceRegistry.get("secretManager");
  }

  getEmergencyStopService() {
    return serviceRegistry.get(
      "emergencyStopService"
    );
  }

  getMetrics() {
    return serviceRegistry.get("authMetrics");
  }

  getStatistics() {
    return serviceRegistry.get(
      "authStatistics"
    );
  }

  getDiagnostics() {
    return serviceRegistry.get(
      "authDiagnostics"
    );
  }

  getInspector() {
    return serviceRegistry.get(
      "authInspector"
    );
  }

  getEventBus() {
    return serviceRegistry.get(
      "authEventBus"
    );
  }

  getAuthorizationAudit() {
    return serviceRegistry.get(
      "authorizationAudit"
    );
  }

  resolve(name) {
    return serviceRegistry.get(name);
  }

  has(name) {
    return serviceRegistry.has(name);
  }

  list() {
    return serviceRegistry.list();
  }

  export() {
    return serviceRegistry.export();
  }
}

module.exports = new AuthenticationServiceLocator();
