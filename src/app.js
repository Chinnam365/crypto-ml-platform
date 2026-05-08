const express = require("express");

const app = express();

app.use(express.json());

// =====================================
// ROUTES
// =====================================

const tradesRoute =
  require("./routes/trades");

const decisionsRoute =
  require("./routes/decisions");

const analyticsRoute =
  require("./routes/analytics");

const backtestRoute =
  require("./routes/backtest");

const optimizeRoute =
  require("./routes/optimize");

const weightsRoute =
  require("./routes/weights");

const dogeRoute =
  require("./routes/doge");

// =====================================
// ML MODULES
// =====================================

const {
  exportTrainingData,
} = require("./ml/exportTrainingData");

const {
  trainModel,
} = require("./ml/trainModel");

// =====================================
// ROOT
// =====================================

app.get("/", (req, res) => {

  res.json({
    status:
      "Crypto ML Platform Running",
  });
});

// =====================================
// ROUTE REGISTRATION
// =====================================

app.use(
  "/api/trades",
  tradesRoute
);

app.use(
  "/api/decisions",
  decisionsRoute
);

app.use(
  "/api/analytics",
  analyticsRoute
);

app.use(
  "/api/backtest",
  backtestRoute
);

app.use(
  "/api/optimize",
  optimizeRoute
);

app.use(
  "/api/weights",
  weightsRoute
);

app.use(
  "/api/doge",
  dogeRoute
);

// =====================================
// EXPORT TRAINING DATA
// =====================================

app.get(
  "/api/export-training-data",

  async (req, res) => {

    try {

      const result =
        await exportTrainingData();

      res.json(result);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error:
          error.message,
      });
    }
  }
);

// =====================================
// TRAIN ML MODEL
// =====================================

app.get(
  "/api/train-model",

  async (req, res) => {

    try {

      const result =
        await trainModel();

      res.json(result);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error:
          error.message,
      });
    }
  }
);

// =====================================
// LIVE ML PREDICTION
// =====================================

app.get(
  "/api/predict",

  async (req, res) => {

    try {

      const {
        runDogeStrategy,
      } = require(
        "./strategies/dogeStrategy"
      );

      const result =
        await runDogeStrategy();

      res.json(result);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error:
          error.message,
      });
    }
  }
);

// =====================================
// EXPORT
// =====================================

module.exports = app;
