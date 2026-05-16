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

      hiddenLayers: [8, 8],

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

        bullishTrend:
          item.bullishTrend,

        bearishTrend:
          item.bearishTrend,

        trendingRegime:
          item.trendingRegime,

        sidewaysRegime:
          item.sidewaysRegime,
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

  console.log(`
==================================
ML MODEL TRAINED
==================================

Samples:
${data.length}

==================================
`);

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

      bullishTrend:
        features.trend === "BULLISH"
          ? 1
          : 0,

      bearishTrend:
        features.trend === "BEARISH"
          ? 1
          : 0,

      trendingRegime:
        features.regime &&
        features.regime.includes(
          "TRENDING"
        )
          ? 1
          : 0,

      sidewaysRegime:
        features.regime === "SIDEWAYS"
          ? 1
          : 0,
    });

  return result.win || 0.5;
}

module.exports = {

  trainModel,

  predictTrade,
};
