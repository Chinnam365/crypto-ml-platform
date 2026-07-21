"use strict";

const fs = require("fs");
const path = require("path");

class AuthTelemetryExporter {
  export(metrics, outputFile) {
    if (!metrics || typeof metrics.snapshot !== "function") {
      throw new TypeError("A valid metrics instance is required.");
    }

    if (typeof outputFile !== "string" || outputFile.trim() === "") {
      throw new TypeError("A valid output file is required.");
    }

    const target = path.resolve(outputFile);

    fs.mkdirSync(path.dirname(target), {
      recursive: true
    });

    fs.writeFileSync(
      target,
      JSON.stringify(metrics.snapshot(), null, 2),
      "utf8"
    );

    return {
      success: true,
      file: target,
      exportedAt: new Date().toISOString()
    };
  }

  exportToObject(metrics) {
    if (!metrics || typeof metrics.snapshot !== "function") {
      throw new TypeError("A valid metrics instance is required.");
    }

    return metrics.snapshot();
  }

  status() {
    return {
      component: "AuthTelemetryExporter",
      healthy: true,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = AuthTelemetryExporter;
