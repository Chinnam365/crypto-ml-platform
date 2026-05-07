const express = require("express");

const cors = require("cors");

const dogeRoute =
  require("./routes/doge");

const tradesRoute =
  require("./routes/trades");

const decisionsRoute =
  require("./routes/decisions");

const analyticsRoute =
  require("./routes/analytics");

const app = express();

app.use(cors());

app.use(express.json());

// ROOT
app.get("/", (req, res) => {
  res.send(
    "Crypto ML Platform Running"
  );
});

// ROUTES
app.use(
  "/api/doge",
  dogeRoute
);

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

module.exports = app;
