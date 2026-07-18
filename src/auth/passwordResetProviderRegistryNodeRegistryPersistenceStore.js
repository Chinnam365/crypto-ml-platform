"use strict";

class PasswordResetProviderRegistryNodeRegistryPersistenceStore {
  constructor(options = {}) {
    this.records = new Map();
    this.createdAt = new Date().toISOString();
    this.options = options;
  }

  add(id, record = {}) {
    if (!id) {
      throw new TypeError("Record id is required.");
    }

    const now = new Date().toISOString();

    const storedRecord = {
      id,
      ...record,
      createdAt: record.createdAt || now,
      updatedAt: now
    };

    this.records.set(id, storedRecord);

    return storedRecord;
  }

  update(id, updates = {}) {
    const existing = this.records.get(id);

    if (!existing) {
      return null;
    }

    const updated = {
      ...existing,
      ...updates,
      id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString()
    };

    this.records.set(id, updated);

    return updated;
  }

  get(id) {
    return this.records.get(id) || null;
  }

  has(id) {
    return this.records.has(id);
  }

  remove(id) {
    return this.records.delete(id);
  }

  clear() {
    this.records.clear();
    return this;
  }

  getAll() {
    return Array.from(this.records.values());
  }

  keys() {
    return Array.from(this.records.keys());
  }

  values() {
    return Array.from(this.records.values());
  }

  entries() {
    return Array.from(this.records.entries());
  }

  count() {
    return this.records.size;
  }

  status() {
    return {
      store:
        "PasswordResetProviderRegistryNodeRegistryPersistenceStore",
      records: this.count(),
      createdAt: this.createdAt,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceStore;
