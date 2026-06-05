class RuntimePositionRegistry {

  constructor() {

    this.positions = [];
  }

  add(
    position
  ) {

    this.positions.push(
      position
    );
  }

  getOpen() {

    return this.positions.filter(

      p =>

        p.status !==
        "CLOSED"
    );
  }
}

module.exports =
  new RuntimePositionRegistry();
