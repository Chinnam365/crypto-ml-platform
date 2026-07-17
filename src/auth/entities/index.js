"use strict";

const UserEntity = require("./UserEntity");
const SessionEntity = require("./SessionEntity");
const TokenEntity = require("./TokenEntity");
const LoginAttemptEntity = require("./LoginAttemptEntity");
const MfaEntity = require("./MfaEntity");

module.exports = Object.freeze({
  UserEntity,
  SessionEntity,
  TokenEntity,
  LoginAttemptEntity,
  MfaEntity,

  createUser(data = {}) {
    return new UserEntity(data);
  },

  createSession(data = {}) {
    return new SessionEntity(data);
  },

  createToken(data = {}) {
    return new TokenEntity(data);
  },

  createLoginAttempt(data = {}) {
    return new LoginAttemptEntity(data);
  },

  createMfa(data = {}) {
    return new MfaEntity(data);
  },

  fromDatabase: {
    user(row) {
      return UserEntity.fromDatabase(row);
    },

    session(row) {
      return SessionEntity.fromDatabase(row);
    },

    token(row) {
      return TokenEntity.fromDatabase(row);
    },

    loginAttempt(row) {
      return LoginAttemptEntity.fromDatabase(row);
    },

    mfa(row) {
      return MfaEntity.fromDatabase(row);
    }
  }
});
