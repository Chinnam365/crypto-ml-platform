"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceStore = require("./passwordResetProviderRegistryNodeRegistryPersistenceStore");
const PasswordResetProviderRegistryNodeRegistryPersistenceSerializer = require("./passwordResetProviderRegistryNodeRegistryPersistenceSerializer");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepository {
  constructor(options = {}) {
    this.store =
      options.store ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceStore(options);

    this.serializer =
      options.serializer ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceSerializer();
  }

  save(id, record = {}) {
    return this.store.add(id, record);
  }

  update(id, updates = {}) {
    return this.store.update(id, updates);
  }

  findById(id) {
    return this.store.get(id);
  }

  findAll() {
    return this.store.getAll();
  }

  exists(id) {
    return this.store.has(id);
  }

  delete(id) {
    return this.store.remove(id);
  }

  deleteAll() {
    this.store.clear();
    return true;
  }

  count() {
    return this.store.count();
  }

  export() {
    return this.serializer.serializeCollection(
      this.store.getAll()
    );
  }

  import(serializedData) {
    const records =
      this.serializer.deserializeCollection(serializedData);

    this.store.clear();

    for (const record of records) {
      this.store.add(record.id, record);
    }

    return this.count();
  }

  status() {
    return {
      repository:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepository",
      records: this.count(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepository;
