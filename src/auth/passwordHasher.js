"use strict";

const crypto = require("crypto");

const DEFAULT_OPTIONS = Object.freeze({
  algorithm: "sha512",
  iterations: 210000,
  keyLength: 64,
  digest: "sha512",
  saltLength: 32
});

class PasswordHasher {
  constructor(options = {}) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options
    };
  }

  generateSalt() {
    return crypto
      .randomBytes(this.options.saltLength)
      .toString("hex");
  }

  async hash(password, salt = this.generateSalt()) {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(
        password,
        salt,
        this.options.iterations,
        this.options.keyLength,
        this.options.digest,
        (err, derivedKey) => {
          if (err) {
            return reject(err);
          }

          resolve({
            algorithm: this.options.algorithm,
            iterations: this.options.iterations,
            digest: this.options.digest,
            salt,
            hash: derivedKey.toString("hex")
          });
        }
      );
    });
  }

  async verify(password, stored) {
    const result = await this.hash(
      password,
      stored.salt
    );

    const hashA = Buffer.from(result.hash, "hex");
    const hashB = Buffer.from(stored.hash, "hex");

    if (hashA.length !== hashB.length) {
      return false;
    }

    return crypto.timingSafeEqual(hashA, hashB);
  }
}

module.exports = PasswordHasher;
