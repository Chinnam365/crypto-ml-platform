"use strict";

class PasswordResetRepository {
  constructor() {
    this.records = new Map();
  }

  save(token, record) {
    this.records.set(token, {
      ...record
    });

    return this.records.get(token);
  }

  findByToken(token) {
    return this.records.get(token) || null;
  }

  update(token, updates = {}) {
    const existing = this.findByToken(token);

    if (!existing) {
      return null;
    }

    const updated = {
      ...existing,
      ...updates
    };

    this.records.set(token, updated);

    return updated;
  }

  delete(token) {
    return this.records.delete(token);
  }

  deleteByUser(userId) {
    let count = 0;

    for (const [token, record] of this.records.entries()) {
      if (record.userId === userId) {
        this.records.delete(token);
        count++;
      }
    }

    return count;
  }

  exists(token) {
    return this.records.has(token);
  }

  findExpired(now = Date.now()) {
    const expired = [];

    for (const [token, record] of this.records.entries()) {
      if (record.expiresAt <= now) {
        expired.push({
          token,
          ...record
        });
      }
    }

    return expired;
  }

  cleanup(now = Date.now()) {
    let removed = 0;

    for (const [token, record] of this.records.entries()) {
      if (
        record.used === true ||
        record.expiresAt <= now
      ) {
        this.records.delete(token);
        removed++;
      }
    }

    return removed;
  }

  count() {
    return this.records.size;
  }

  clear() {
    this.records.clear();
  }

  getAll() {
    return Array.from(this.records.entries()).map(
      ([token, record]) => ({
        token,
        ...record
      })
    );
  }
}

module.exports = PasswordResetRepository;
