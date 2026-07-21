"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryConstants =
  Object.freeze({
    COMPONENT:
      "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistry",

    VERSION: "1.0.0",

    STATUS: Object.freeze({
      UP: "UP",
      DOWN: "DOWN",
      UNKNOWN: "UNKNOWN"
    }),

    EVENTS: Object.freeze({
      CREATED: "registry.created",
      REMOVED: "registry.removed",
      CLEARED: "registry.cleared"
    }),

    ERRORS: Object.freeze({
      REGISTRY_ALREADY_EXISTS: "REGISTRY_ALREADY_EXISTS",
      REGISTRY_NOT_FOUND: "REGISTRY_NOT_FOUND",
      INVALID_REGISTRY: "INVALID_REGISTRY",
      INVALID_NAME: "INVALID_NAME"
    }),

    DEFAULTS: Object.freeze({
      AUTO_INITIALIZE: true,
      MAX_REGISTRIES: 10000,
      CASE_SENSITIVE: true
    }),

    ROUTES: Object.freeze({
      BASE: "/",
      STATUS: "/status",
      REGISTRY: "/:name"
    }),

    HEADERS: Object.freeze({
      CONTENT_TYPE: "application/json"
    })
  });

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryConstants;
