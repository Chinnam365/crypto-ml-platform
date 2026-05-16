const brain = require("brain.js");

let model = null;

function trainModel(data) {

  if (!data.length) {

    console.log(
      "No training data available"
    );

    return null;
  }

  const network =
    new brain.NeuralNetwork({

      hiddenLayers: [6, 6],

      learningRate: 0.01,
    });

  const trainingData =
    data.map(item => ({

      input: {

        rsi:
          item.rsi / 100,

        macd:
          item.macd / 10,

        volatility:
          item.volatility / 100,

        confidence:
          item.confidence / 100,
      },

      output: {

        win:
          item.label,
      },
    }));

  network.train(
    trainingData,

    {

      iterations: 1000,

      log: true,

      logPeriod: 100,
    }
  );

  model = network;

  console.log(
    "ML model trained successfully"
  );

  return model;
}

function predictTrade(features) {

  if (!model) {

    return 0.5;
  }

  const result =
    model.run({

      rsi:
        features.rsi / 100,

      macd:
        features.macd / 10,

      volatility:
        features.volatility / 100,

      confidence:
        features.confidence / 100,
    });

  return result.win || 0.5;
}

module.exports = {

  trainModel,

  predictTrade,
};
