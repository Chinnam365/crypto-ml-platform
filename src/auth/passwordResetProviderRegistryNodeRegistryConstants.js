"use strict";

const PasswordResetProviderRegistryNodeRegistryConstants = Object.freeze({
  NAME: "password-reset-provider-registry-node-registry",
  DISPLAY_NAME: "Password Reset Provider Registry Node Registry",

  VERSION: "1.0.0",

  DESCRIPTION:
    "Registry responsible for managing password reset provider registry nodes.",

  AUTHOR: "AI Investment Operating System",

  LICENSE: "MIT",

  BASE_ROUTE: "/auth/provider-registry/registry",

  DEFAULT_HOST: "localhost",

  DEFAULT_PORT: 3000,

  DEFAULT_TIMEOUT_MS: 30000,

  DEFAULT_HEALTH_CHECK_INTERVAL_MS: 60000,

  DEFAULT_RETRY_ATTEMPTS: 3,

  DEFAULT_RETRY_DELAY_MS: 1000,

  STATUS: Object.freeze({
    CREATED: "created",
    INITIALIZED: "initialized",
    STARTING: "starting",
    RUNNING: "running",
    STOPPING: "stopping",
    STOPPED: "stopped",
    FAILED: "failed"
  }),

  EVENTS: Object.freeze({
    INITIALIZED: "registry.initialized",
    STARTED: "registry.started",
    STOPPED: "registry.stopped",
    HEALTH_CHANGED: "registry.healthChanged",
    NODE_REGISTERED: "registry.nodeRegistered",
    NODE_UNREGISTERED: "registry.nodeUnregistered",
    NODE_UPDATED: "registry.nodeUpdated",
    ERROR: "registry.error"
  }),

  HEALTH: Object.freeze({
    HEALTHY: "healthy",
    DEGRADED: "degraded",
    UNHEALTHY: "unhealthy"
  })
});

module.exports = PasswordResetProviderRegistryNodeRegistryConstants;
