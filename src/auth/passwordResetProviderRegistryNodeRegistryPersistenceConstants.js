"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceConstants = Object.freeze({
  NAME: "password-reset-provider-registry-node-registry-persistence",

  DISPLAY_NAME:
    "Password Reset Provider Registry Node Registry Persistence",

  VERSION: "1.0.0",

  DESCRIPTION:
    "Persistence layer for Password Reset Provider Registry Node Registry.",

  AUTHOR: "AI Investment Operating System",

  LICENSE: "MIT",

  DEFAULT_DIRECTORY: "data",

  DEFAULT_FILENAME:
    "password-reset-provider-registry-node-registry.json",

  DEFAULT_FILE_ENCODING: "utf8",

  DEFAULT_TIMEOUT_MS: 30000,

  DEFAULT_BACKUP_EXTENSION: ".bak",

  DEFAULT_MAX_BACKUPS: 25,

  EVENTS: Object.freeze({
    CONNECTED: "persistence.connected",
    DISCONNECTED: "persistence.disconnected",
    SAVED: "persistence.saved",
    LOADED: "persistence.loaded",
    BACKUP_CREATED: "persistence.backup.created",
    RESTORED: "persistence.restored",
    DELETED: "persistence.deleted",
    ERROR: "persistence.error"
  }),

  STATUS: Object.freeze({
    CREATED: "created",
    CONNECTED: "connected",
    DISCONNECTED: "disconnected",
    SAVING: "saving",
    LOADING: "loading",
    READY: "ready",
    FAILED: "failed"
  })
});

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceConstants;
