const runtime =
  require("./aiRuntime");

const scheduler =
  require("./runtimeScheduler");

const {
  runCycle,
} = require(
  "./centralOrchestrator"
);

async function bootstrap() {

  console.log(`
==================================
AI RUNTIME BOOTSTRAP
==================================
`);

  runtime.start();

  runtime.activateModule(
    "discovery"
  );

  runtime.activateModule(
    "portfolio"
  );

  runtime.activateModule(
    "risk"
  );

  runtime.activateModule(
    "execution"
  );

  runtime.activateModule(
    "learning"
  );

  runtime.activateModule(
    "dashboard"
  );

  scheduler.register({

    name:
      "AUTONOMOUS_CYCLE",

    interval:
      60000,

    handler:
      async () => {

        try {

          const result =
            await runCycle();

          console.log(
            "Cycle Complete:",
            result.timestamp
          );

        } catch (err) {

          console.log(
            "Runtime Error:",
            err.message
          );
        }
      },
  });

  scheduler.start();

  return runtime.getStatus();
}

module.exports = {
  bootstrap,
};
