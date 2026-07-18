"use strict";

const fs = require("fs/promises");

class PasswordResetProviderExporter {
  constructor(reporter) {
    this.reporter = reporter;
  }

  async exportJson(filePath) {
    const report =
      await this.reporter.toJson();

    await fs.writeFile(
      filePath,
      report,
      "utf8"
    );

    return {
      success: true,
      format: "json",
      filePath
    };
  }

  async exportObject() {
    return this.reporter.toObject();
  }

  async exportSummary(filePath) {
    const summary =
      await this.reporter.summary();

    await fs.writeFile(
      filePath,
      JSON.stringify(summary, null, 2),
      "utf8"
    );

    return {
      success: true,
      format: "summary",
      filePath
    };
  }
}

module.exports = PasswordResetProviderExporter;
