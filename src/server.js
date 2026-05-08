const app = require("./app");

const {
  runEngine,
} = require("./engine/engine");

const PORT =
  process.env.PORT || 10000;

// =====================================
// START SERVER
// =====================================

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );
});

// =====================================
// ENGINE LOOP
// =====================================

async function startEngine() {

  try {

    await runEngine();

  } catch (error) {

    console.error(
      "Engine startup failed:",
      error.message
    );
  }
}

// =====================================
// START IMMEDIATELY
// =====================================

startEngine();

// =====================================
// REPEAT EVERY 5 MINUTES
// =====================================

setInterval(

  startEngine,

  5 * 60 * 1000
);
