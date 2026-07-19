"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryMetadata = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryMetadata");

const metadata =
  new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryMetadata();

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryConstants =
  Object.freeze({
    MODULE_NAME:
      "PasswordResetProviderRegistryNodeRegistryPersistenceRepository",

    MODULE_VERSION: metadata.get().version,

    CATEGORY: "authentication",

    COMPONENT: "repository",

    LAYER: "persistence",

    DEFAULT_NAMESPACE:
      "password-reset-provider-registry-node-registry",

    DEFAULT_STORAGE_KEY:
      "password_reset_provider_registry_node_registry_repository",

    STATUS: Object.freeze({
      ACTIVE: "active",
      INACTIVE: "inactive",
      INITIALIZING: "initializing",
      ERROR: "error"
    }),

    EVENTS: Object.freeze({
      CREATED: "repository.created",
      UPDATED: "repository.updated",
      DELETED: "repository.deleted",
      IMPORTED: "repository.imported",
      EXPORTED: "repository.exported"
    })
  });

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryConstants;
