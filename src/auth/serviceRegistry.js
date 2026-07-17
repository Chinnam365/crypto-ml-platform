"use strict";

const container = require("./authContainer");

class AuthenticationServiceRegistry {
  registerCoreServices() {
    const services = {
      authService: require("./authService"),
      authRepository: require("./authRepository"),

      tokenManager: require("../security/tokenManager"),
      sessionManager: require("../security/sessionManager"),
      passwordService: require("../security/passwordService"),
      encryptionService: require("../security/encryptionService"),
      totpService: require("../security/totpService"),
      auditLogger: require("../security/auditLogger"),
      secretManager: require("../security/secretManager"),
      emergencyStopService: require("../security/emergencyStopService"),

      authMetrics: require("./authMetrics"),
      authStatistics: require("./authStatistics"),
      authDiagnostics: require("./authDiagnostics"),
      authInspector: require("./authInspector"),

      authEventBus: require("./authEventBus"),
      authorizationAudit: require("./authorizationAudit")
    };

    container.initialize(services);

    return services;
  }

  get(name) {
    return container.resolve(name);
  }

  has(name) {
    return container.has(name);
  }

  list() {
    return container.list();
  }

  statistics() {
    return container.statistics();
  }

  export() {
    return container.export();
  }
}

module.exports = new AuthenticationServiceRegistry();
