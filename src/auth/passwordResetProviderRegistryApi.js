"use strict";

const createPasswordResetProviderRegistryRouter = require("./passwordResetProviderRegistryRoutes");

class PasswordResetProviderRegistryApi {
  constructor(options = {}) {
    this.path =
      options.path ||
      "/auth/providers";

    this.router =
      options.router ||
      createPasswordResetProviderRegistryRouter();
  }

  register(app) {
    if (
      !app ||
      typeof app.use !== "function"
    ) {
      throw new Error(
        "A valid Express application instance is required."
      );
    }

    app.use(
      this.path,
      this.router
    );

    return this;
  }

  getPath() {
    return this.path;
  }

  getRouter() {
    return this.router;
  }

  setPath(path) {
    this.path = path;
    return this;
  }

  status() {
    return {
      mountedPath: this.path,
      registered: true,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryApi;
