"use strict";

const container = require("./authContainer");

class AuthModuleRegistry {
  registerDefaults() {
    const modules = {
      authRepository: require("./authRepository"),
      authService: require("./authService"),
      authController: require("./authController"),
      authRoutes: require("./authRoutes"),
      authMiddleware: require("./authMiddleware"),

      authorization: require("./authorization"),
      authorizationMiddleware: require("./authorizationMiddleware"),

      accessControl: require("./accessControl"),
      accessDecisionEngine: require("./accessDecisionEngine"),
      accessPolicy: require("./accessPolicy"),

      roleManager: require("./roleManager"),
      roleHierarchy: require("./roleHierarchy"),

      authEventBus: require("./authEventBus"),
      authEvents: require("./authEvents"),
      authEventListeners: require("./authEventListeners"),

      authMetrics: require("./authMetrics"),
      authStatistics: require("./authStatistics"),
      authDiagnostics: require("./authDiagnostics"),
      authInspector: require("./authInspector")
    };

    container.initialize(modules);

    return modules;
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

  export() {
    return container.export();
  }

  shutdown() {
    return container.shutdown();
  }
}

module.exports = new AuthModuleRegistry();
