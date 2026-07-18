"use strict";

const PasswordResetProviderRegistry = require("./passwordResetProviderRegistry");
const PasswordResetProviderFactory = require("./passwordResetProviderFactory");
const PasswordResetProviderRegistryManager = require("./passwordResetProviderRegistryManager");
const PasswordResetProviderRegistryFacade = require("./passwordResetProviderRegistryFacade");
const PasswordResetProviderRegistryHealth = require("./passwordResetProviderRegistryHealth");
const PasswordResetProviderRegistryDiagnostics = require("./passwordResetProviderRegistryDiagnostics");
const PasswordResetProviderRegistryReporter = require("./passwordResetProviderRegistryReporter");
const PasswordResetProviderRegistryExporter = require("./passwordResetProviderRegistryExporter");
const PasswordResetProviderRegistryImporter = require("./passwordResetProviderRegistryImporter");
const PasswordResetProviderRegistryBackup = require("./passwordResetProviderRegistryBackup");
const PasswordResetProviderRegistryRestore = require("./passwordResetProviderRegistryRestore");
const PasswordResetProviderRegistrySnapshot = require("./passwordResetProviderRegistrySnapshot");
const PasswordResetProviderRegistryVersionManager = require("./passwordResetProviderRegistryVersionManager");
const PasswordResetProviderRegistryLifecycle = require("./passwordResetProviderRegistryLifecycle");

module.exports = Object.freeze({
  PasswordResetProviderRegistry,
  PasswordResetProviderFactory,
  PasswordResetProviderRegistryManager,
  PasswordResetProviderRegistryFacade,
  PasswordResetProviderRegistryHealth,
  PasswordResetProviderRegistryDiagnostics,
  PasswordResetProviderRegistryReporter,
  PasswordResetProviderRegistryExporter,
  PasswordResetProviderRegistryImporter,
  PasswordResetProviderRegistryBackup,
  PasswordResetProviderRegistryRestore,
  PasswordResetProviderRegistrySnapshot,
  PasswordResetProviderRegistryVersionManager,
  PasswordResetProviderRegistryLifecycle
});
