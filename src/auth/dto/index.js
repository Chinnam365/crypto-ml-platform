"use strict";

const LoginRequest = require("./LoginRequest");
const LoginResponse = require("./LoginResponse");

const RefreshTokenRequest = require("./RefreshTokenRequest");
const RefreshTokenResponse = require("./RefreshTokenResponse");

const LogoutRequest = require("./LogoutRequest");
const LogoutResponse = require("./LogoutResponse");

const MfaVerificationRequest = require("./MfaVerificationRequest");
const MfaVerificationResponse = require("./MfaVerificationResponse");

module.exports = Object.freeze({
  LoginRequest,
  LoginResponse,

  RefreshTokenRequest,
  RefreshTokenResponse,

  LogoutRequest,
  LogoutResponse,

  MfaVerificationRequest,
  MfaVerificationResponse,

  requests: Object.freeze({
    LoginRequest,
    RefreshTokenRequest,
    LogoutRequest,
    MfaVerificationRequest
  }),

  responses: Object.freeze({
    LoginResponse,
    RefreshTokenResponse,
    LogoutResponse,
    MfaVerificationResponse
  })
});
