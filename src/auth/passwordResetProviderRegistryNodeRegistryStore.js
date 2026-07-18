"use strict";

class PasswordResetProviderRegistryNodeRegistryStore {
  constructor(options = {}) {
    this.records = new Map();
    this.createdAt = new Date().toISOString();
    this.options = options;
  }

  add(id, record) {
    if (!id) {
      throw new TypeError("Record id is required.");
    }

    this.records.set(id, {
      ...record,
      id,
      createdAt: record?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return this.records.get(id);
  }

  update(id, updates = {}) {
    if (!this.records.has(id)) {
      return null;
    }

    const current = this.records.get(id);

    const updated = {
      ...current,
      ...updates,
      id,
      updatedAt: new Date().toISOString()
    };

    this.records.set(id, updated);

    return updated;
  }

  get(id) {
    return this.records.get(id) || null;
  }

  getAll() {
    return Array.from(this.records.values());
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

  count() {
    return this.records.size;
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

  status() {
    return {
      store: "PasswordResetProviderRegistryNodeRegistryStore",
      records: this.count(),
      createdAt: this.createdAt,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeRegistryStore;
