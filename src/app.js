const express = require("express");
const cors = require("cors");

const dogeRoute = require("./routes/doge");
const tradesRoute = require("./routes/trades");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Crypto ML Platform Running");
});

app.use("/api/doge", dogeRoute);

app.use("/api/trades", tradesRoute);

module.exports = app;
