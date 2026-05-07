require("dotenv").config();

const app = require("./app");

const { runEngine } = require("./engine/engine");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Run immediately
  runEngine();

  // Run every 60 seconds
  setInterval(runEngine, 60000);
});
