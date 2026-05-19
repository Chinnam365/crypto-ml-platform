import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

function App() {

  const [
    strategies,
    setStrategies,
  ] = useState([]);

  useEffect(() => {

    const loadData =
      async () => {

        try {

          const response =
            await axios.get(
              "https://crypto-ml-platform-02b7.onrender.com/strategy-performance"
            );

          console.log(
            response.data
          );

          setStrategies(
            response.data.strategies
          );

        } catch (err) {

          console.error(err);
        }
      };

    loadData();

  }, []);

  return (

    <div
      style={{
        backgroundColor: "#111827",
        color: "white",
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >

      <h1>
        AI Trading Dashboard
      </h1>

      <h2>
        Strategy Performance
      </h2>

      {strategies.map(
        (
          strategy,
          index
        ) => (

          <div
            key={index}
            style={{
              marginBottom: "12px",
              padding: "10px",
              border:
                "1px solid gray",
            }}
          >

            <p>
              Symbol:
              {" "}
              {strategy.symbol}
            </p>

            <p>
              Side:
              {" "}
              {strategy.side}
            </p>

            <p>
              Avg PnL:
              {" "}
              {strategy.avg_pnl}
            </p>

            <p>
              Win Rate:
              {" "}
              {strategy.win_rate}%
            </p>

          </div>
        )
      )}

    </div>
  );
}

export default App;
