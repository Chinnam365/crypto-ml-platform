class ModelVersionManager {

  constructor() {

    this.models = [];
  }

  registerModel({

    name,

    version,

    accuracy,

  }) {

    this.models.push({

      name,

      version,

      accuracy,

      deployedAt:
        new Date()
          .toISOString(),
    });
  }

  getLatestModel(
    name
  ) {

    return this.models

      .filter(
        model =>
          model.name ===
          name
      )

      .sort(
        (a, b) =>
          b.version -
          a.version
      )[0];
  }
}

module.exports =
  new ModelVersionManager();
