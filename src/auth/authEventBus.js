"use strict";

const authEvents = require("./authEvents");
const EVENT_TYPES = require("./authEventTypes");

class AuthEventBus {
  emit(eventType, payload = {}) {
    return authEvents.emitEvent(eventType, payload);
  }

  on(eventType, handler) {
    authEvents.on(eventType, handler);
    return this;
  }

  once(eventType, handler) {
    authEvents.once(eventType, handler);
    return this;
  }

  off(eventType, handler) {
    authEvents.off(eventType, handler);
    return this;
  }

  removeAll(eventType) {
    authEvents.removeAllListeners(eventType);
    return this;
  }

  listenerCount(eventType) {
    return authEvents.listenerCount(eventType);
  }

  emitLoginAttempt(payload) {
    return this.emit(EVENT_TYPES.LOGIN_ATTEMPT, payload);
  }

  emitLoginSuccess(payload) {
    return this.emit(EVENT_TYPES.LOGIN_SUCCESS, payload);
  }

  emitLoginFailed(payload) {
    return this.emit(EVENT_TYPES.LOGIN_FAILED, payload);
  }

  emitLogout(payload) {
    return this.emit(EVENT_TYPES.LOGOUT, payload);
  }

  emitSessionCreated(payload) {
    return this.emit(
      EVENT_TYPES.SESSION_CREATED,
      payload
    );
  }

  emitSessionRefreshed(payload) {
    return this.emit(
      EVENT_TYPES.SESSION_REFRESHED,
      payload
    );
  }

  emitSessionExpired(payload) {
    return this.emit(
      EVENT_TYPES.SESSION_EXPIRED,
      payload
    );
  }

  emitSessionRevoked(payload) {
    return this.emit(
      EVENT_TYPES.SESSION_REVOKED,
      payload
    );
  }

  emitMfaVerified(payload) {
    return this.emit(
      EVENT_TYPES.MFA_VERIFIED,
      payload
    );
  }

  emitAuthorizationGranted(payload) {
    return this.emit(
      EVENT_TYPES.AUTHORIZATION_GRANTED,
      payload
    );
  }

  emitAuthorizationDenied(payload) {
    return this.emit(
      EVENT_TYPES.AUTHORIZATION_DENIED,
      payload
    );
  }

  history(limit = 100) {
    return authEvents.getHistory(limit);
  }

  statistics() {
    return authEvents.statistics();
  }

  clearHistory() {
    authEvents.clearHistory();
  }
}

module.exports = new AuthEventBus();
