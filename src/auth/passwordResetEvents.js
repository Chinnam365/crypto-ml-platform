"use strict";

const EVENTS = Object.freeze({
  TOKEN_CREATED: "auth.passwordReset.token.created",
  TOKEN_VALIDATED: "auth.passwordReset.token.validated",
  TOKEN_CONSUMED: "auth.passwordReset.token.consumed",
  TOKEN_REVOKED: "auth.passwordReset.token.revoked",
  TOKEN_EXPIRED: "auth.passwordReset.token.expired",
  TOKEN_CLEANUP: "auth.passwordReset.token.cleanup"
});

class PasswordResetEvents {
  constructor() {
    this.listeners = new Map();

    Object.values(EVENTS).forEach(event => {
      this.listeners.set(event, new Set());
    });
  }

  on(event, listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event).add(listener);

    return () => this.off(event, listener);
  }

  off(event, listener) {
    if (!this.listeners.has(event)) {
      return;
    }

    this.listeners.get(event).delete(listener);
  }

  emit(event, payload = {}) {
    const listeners = this.listeners.get(event);

    if (!listeners) {
      return;
    }

    for (const listener of listeners) {
      try {
        listener({
          event,
          payload,
          timestamp: new Date().toISOString()
        });
      } catch (_) {
        // Ignore listener failures
      }
    }
  }

  listenerCount(event) {
    return this.listeners.has(event)
      ? this.listeners.get(event).size
      : 0;
  }

  removeAllListeners(event) {
    if (event) {
      this.listeners.get(event)?.clear();
      return;
    }

    for (const listeners of this.listeners.values()) {
      listeners.clear();
    }
  }
}

module.exports = {
  EVENTS,
  PasswordResetEvents
};
