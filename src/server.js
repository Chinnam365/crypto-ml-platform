const app = require("./app");

const {
  runEngine,
} = require("./engine/engine");

const {
  trainModel,
} = require("./ml/trainModel");

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
      "Engine failed:",
      error.message
    );
  }
}

// =====================================
// INITIALIZE SYSTEM
// =====================================

async function initializeSystem() {

  try {

    console.log(
      "Initializing ML system..."
    );

    // ===============================
    // TRAIN MODEL FIRST
    // ===============================

    await trainModel();

    console.log(
      "ML model ready"
    );

    // ===============================
    // START ENGINE
    // ===============================

    await startEngine();

    // ===============================
    // REPEAT EVERY 5 MINUTES
    // ===============================

    setInterval(

      startEngine,

      5 * 60 * 1000
    );

    // ===============================
    // RETRAIN MODEL EVERY 6 HOURS
    // ===============================

    setInterval(

      async () => {

        try {

          console.log(
            "Retraining ML model..."
          );

          await trainModel();

          console.log(
            "ML retraining complete"
          );

        } catch (error) {

          console.error(

            "ML retraining failed:",

            error.message
          );
        }

      },

      6 * 60 * 60 * 1000
    );

  } catch (error) {

    console.error(

      "System initialization failed:",

      error.message
    );
  }
}

// =====================================
// START EVERYTHING
// =====================================

initializeSystem();
