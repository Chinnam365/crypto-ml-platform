"use strict";

const logger = require("../config/logger");
const eventBus = require("./authEventBus");
const EVENTS = require("./authEventTypes");

class AuthEventListeners {
  constructor() {
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) {
      return;
    }

    eventBus.on(
      EVENTS.LOGIN_ATTEMPT,
      this.onLoginAttempt.bind(this)
    );

    eventBus.on(
      EVENTS.LOGIN_SUCCESS,
      this.onLoginSuccess.bind(this)
    );

    eventBus.on(
      EVENTS.LOGIN_FAILED,
      this.onLoginFailed.bind(this)
    );

    eventBus.on(
      EVENTS.LOGOUT,
      this.onLogout.bind(this)
    );

    eventBus.on(
      EVENTS.SESSION_CREATED,
      this.onSessionCreated.bind(this)
    );

    eventBus.on(
      EVENTS.SESSION_REFRESHED,
      this.onSessionRefreshed.bind(this)
    );

    eventBus.on(
      EVENTS.SESSION_REVOKED,
      this.onSessionRevoked.bind(this)
    );

    eventBus.on(
      EVENTS.MFA_VERIFIED,
      this.onMfaVerified.bind(this)
    );

    eventBus.on(
      EVENTS.AUTHORIZATION_GRANTED,
      this.onAuthorizationGranted.bind(this)
    );

    eventBus.on(
      EVENTS.AUTHORIZATION_DENIED,
      this.onAuthorizationDenied.bind(this)
    );

    this.initialized = true;

    logger.info(
      "Authentication event listeners initialized."
    );
  }

  shutdown() {
    if (!this.initialized) {
      return;
    }

    Object.values(EVENTS).forEach(event =>
      eventBus.removeAll(event)
    );

    this.initialized = false;

    logger.info(
      "Authentication event listeners stopped."
    );
  }

  onLoginAttempt(event) {
    logger.info({
      event: event.event,
      payload: event.payload
    });
  }

  onLoginSuccess(event) {
    logger.info({
      event: event.event,
      payload: event.payload
    });
  }

  onLoginFailed(event) {
    logger.warn({
      event: event.event,
      payload: event.payload
    });
  }

  onLogout(event) {
    logger.info({
      event: event.event,
      payload: event.payload
    });
  }

  onSessionCreated(event) {
    logger.info({
      event: event.event,
      payload: event.payload
    });
  }

  onSessionRefreshed(event) {
    logger.info({
      event: event.event,
      payload: event.payload
    });
  }

  onSessionRevoked(event) {
    logger.warn({
      event: event.event,
      payload: event.payload
    });
  }

  onMfaVerified(event) {
    logger.info({
      event: event.event,
      payload: event.payload
    });
  }

  onAuthorizationGranted(event) {
    logger.debug({
      event: event.event,
      payload: event.payload
    });
  }

  onAuthorizationDenied(event) {
    logger.warn({
      event: event.event,
      payload: event.payload
    });
  }
}

module.exports = new AuthEventListeners();
