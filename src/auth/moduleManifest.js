"use strict";

const fs = require("fs");
const path = require("path");

class AuthenticationModuleManifest {
  constructor() {
    this.version = "1.0.0";
    this.name = "Authentication";
    this.generatedAt = new Date().toISOString();
  }

  generate() {
    return {
      name: this.name,
      version: this.version,
      generatedAt: this.generatedAt,
      files: this.scanFiles(),
      statistics: this.statistics()
    };
  }

  scanFiles() {
    const directory = __dirname;

    return fs
      .readdirSync(directory)
      .filter(file => file.endsWith(".js"))
      .sort()
      .map(file => ({
        name: file,
        path: path.join(directory, file)
      }));
  }

  statistics() {
    const files = this.scanFiles();

    return {
      totalFiles: files.length,
      generatedAt: new Date().toISOString()
    };
  }

  export() {
    return JSON.stringify(
      this.generate(),
      null,
      2
    );
  }
}

module.exports = new AuthenticationModuleManifest();
