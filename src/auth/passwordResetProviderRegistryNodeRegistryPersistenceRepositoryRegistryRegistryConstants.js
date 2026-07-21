"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryConstants =
  Object.freeze({
    COMPONENT:
      "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistry",

    VERSION: "1.0.0",

    STATUS: Object.freeze({
      UP: "UP",
      DOWN: "DOWN",
      UNKNOWN: "UNKNOWN"
    }),

    EVENTS: Object.freeze({
      REGISTERED: "registry.registered",
      UNREGISTERED: "registry.unregistered",
      CLEARED: "registry.cleared"
    }),

    ERRORS: Object.freeze({
      PROVIDER_ALREADY_EXISTS: "PROVIDER_ALREADY_EXISTS",
      PROVIDER_NOT_FOUND: "PROVIDER_NOT_FOUND",
      INVALID_PROVIDER: "INVALID_PROVIDER",
      INVALID_NAME: "INVALID_NAME"
    }),

    DEFAULTS: Object.freeze({
      AUTO_INITIALIZE: true,
      MAX_PROVIDERS: 10000,
      CASE_SENSITIVE: true
    }),

    ROUTES: Object.freeze({
      BASE: "/",
      STATUS: "/status",
      PROVIDER: "/:name"
    }),

    HEADERS: Object.freeze({
      CONTENT_TYPE: "application/json"
    })
  });

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryConstants;
