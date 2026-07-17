"use strict";

const VERSION = Object.freeze({
  name: "Authentication Module",

  shortName: "auth",

  version: "1.0.0",

  apiVersion: "v1",

  release: "Production",

  build: process.env.BUILD_NUMBER || "local",

  commit:
    process.env.GIT_COMMIT ||
    process.env.RENDER_GIT_COMMIT ||
    "unknown",

  environment:
    process.env.NODE_ENV || "development",

  author: "AI Investment Operating System",

  initializedAt: new Date().toISOString()
});

function getVersion() {
  return {
    ...VERSION
  };
}

function getBuildInfo() {
  return {
    version: VERSION.version,
    build: VERSION.build,
    commit: VERSION.commit,
    environment: VERSION.environment,
    release: VERSION.release
  };
}

function getApiInfo() {
  return {
    module: VERSION.shortName,
    apiVersion: VERSION.apiVersion,
    version: VERSION.version
  };
}

function isProduction() {
  return VERSION.environment === "production";
}

module.exports = Object.freeze({
  VERSION,
  getVersion,
  getBuildInfo,
  getApiInfo,
  isProduction
});
