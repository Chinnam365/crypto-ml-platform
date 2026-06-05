class AutonomousMode {

  constructor() {

    this.enabled =
      true;
  }

  enable() {

    this.enabled =
      true;
  }

  disable() {

    this.enabled =
      false;
  }

  isEnabled() {

    return this.enabled;
  }
}

module.exports =
  new AutonomousMode();
