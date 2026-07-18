"use strict";

class PasswordResetAudit {
  constructor(options = {}) {
    this.maxEntries = options.maxEntries || 10000;
    this.entries = [];
  }

  record(action, data = {}) {
    const entry = {
      id: `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      action,
      userId: data.userId || null,
      token: data.token || null,
      ipAddress: data.ipAddress || null,
      userAgent: data.userAgent || null,
      requestId: data.requestId || null,
      success:
        typeof data.success === "boolean"
          ? data.success
          : true,
      reason: data.reason || null,
      metadata: data.metadata || {},
      timestamp: new Date().toISOString()
    };

    this.entries.push(entry);

    if (this.entries.length > this.maxEntries) {
      this.entries.shift();
    }

    return entry;
  }

  getAll() {
    return [...this.entries];
  }

  findByUser(userId) {
    return this.entries.filter(
      entry => entry.userId === userId
    );
  }

  findByAction(action) {
    return this.entries.filter(
      entry => entry.action === action
    );
  }

  findByRequest(requestId) {
    return this.entries.filter(
      entry => entry.requestId === requestId
    );
  }

  clear() {
    this.entries.length = 0;
  }

  count() {
    return this.entries.length;
  }
}

module.exports = PasswordResetAudit;
