let trainedModel = null;

function setModel(model) {

  trainedModel = model;
}

function getModel() {

  return trainedModel;
}

module.exports = {
  setModel,
  getModel,
};
