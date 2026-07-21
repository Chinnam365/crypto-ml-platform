"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryMetadata = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryMetadata");

const metadata =
  new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryMetadata();

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryConstants =
  Object.freeze({
    MODULE_NAME:
      "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistry",

    MODULE_VERSION: metadata.get().version,

    CATEGORY: "authentication",

    COMPONENT: "repository-registry",

    LAYER: "persistence",

    DEFAULT_NAMESPACE:
      "password-reset-provider-registry-node-registry-repository-registry",

    DEFAULT_REGISTRY_NAME: "default",

    STATUS: Object.freeze({
      ACTIVE: "active",
      INACTIVE: "inactive",
      INITIALIZING: "initializing",
      ERROR: "error"
    }),

    EVENTS: Object.freeze({
      REGISTERED: "repository.registry.registered",
      UNREGISTERED: "repository.registry.unregistered",
      CLEARED: "repository.registry.cleared",
      UPDATED: "repository.registry.updated",
      ACCESSED: "repository.registry.accessed"
    })
  });

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryConstants;
