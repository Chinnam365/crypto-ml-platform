const EventEmitter =
  require("events");

class AIEventBus
  extends EventEmitter {}

module.exports =
  new AIEventBus();
