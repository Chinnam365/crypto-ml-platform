class ModelRegistry {

  constructor() {

    this.models =
      new Map();
  }

  register(
    name,
    model
  ) {

    this.models.set(
      name,
      model
    );
  }

  get(
    name
  ) {

    return this.models.get(
      name
    );
  }

  list() {

    return [
      ...this.models.keys(),
    ];
  }
}

module.exports =
  new ModelRegistry();
