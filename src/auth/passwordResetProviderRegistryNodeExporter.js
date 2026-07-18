"use strict";

const fs = require("fs");
const path = require("path");
const PasswordResetProviderRegistryNodeReporter = require("./passwordResetProviderRegistryNodeReporter");

class PasswordResetProviderRegistryNodeExporter {
  constructor(options = {}) {
    this.reporter =
      options.reporter ||
      new PasswordResetProviderRegistryNodeReporter(options);

    this.outputDirectory =
      options.outputDirectory ||
      path.join(process.cwd(), "exports");
  }

  export(fileName = "password-reset-provider-registry-node-report.json") {
    if (!fs.existsSync(this.outputDirectory)) {
      fs.mkdirSync(this.outputDirectory, {
        recursive: true
      });
    }

    const report = this.reporter.export();

    const filePath = path.join(
      this.outputDirectory,
      fileName
    );

    fs.writeFileSync(filePath, report, "utf8");

    return {
      success: true,
      filePath,
      exportedAt: new Date().toISOString()
    };
  }

  status() {
    return {
      exporter: "PasswordResetProviderRegistryNodeExporter",
      outputDirectory: this.outputDirectory,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeExporter;
