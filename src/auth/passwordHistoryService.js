"use strict";

class PasswordHistoryService {
  constructor(maxHistory = 10) {
    this.maxHistory = maxHistory;
    this.history = new Map();
  }

  getHistory(userId) {
    return this.history.get(userId) || [];
  }

  add(userId, passwordHash) {
    const history = this.getHistory(userId);

    history.unshift({
      hash: passwordHash.hash,
      salt: passwordHash.salt,
      algorithm: passwordHash.algorithm,
      iterations: passwordHash.iterations,
      digest: passwordHash.digest,
      createdAt: new Date().toISOString()
    });

    if (history.length > this.maxHistory) {
      history.length = this.maxHistory;
    }

    this.history.set(userId, history);

    return history;
  }

  async isReused(userId, password, passwordHasher) {
    const history = this.getHistory(userId);

    for (const entry of history) {
      const matches = await passwordHasher.verify(password, {
        hash: entry.hash,
        salt: entry.salt,
        algorithm: entry.algorithm,
        iterations: entry.iterations,
        digest: entry.digest
      });

      if (matches) {
        return true;
      }
    }

    return false;
  }

  remove(userId) {
    this.history.delete(userId);
  }

  clear() {
    this.history.clear();
  }

  size() {
    return this.history.size;
  }
}

module.exports = PasswordHistoryService;
