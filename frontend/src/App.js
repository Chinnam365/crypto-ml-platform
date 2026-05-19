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

  const loadStrategies =
    async () => {

      try {

        const response =
          await axios.get(
            "https://crypto-ml-platform-02b7.onrender.com/strategy-performance"
          );

        if (
          response.data &&
          Array.isArray(
            response.data.strategies
          )
        ) {

          setStrategies(
            response.data.strategies
          );
        }

      } catch (err) {

        console.error(
          err.message
        );
      }
    };

  useEffect(() => {

    loadStrategies();

  }, []);

  return (

    <div
      style={{
        background: "#111827",
        color: "white",
        minHeight: "100vh",
        padding: "30px",
        fontFamily: "Arial",
      }}
    >

      <h1>
        AI Trading Dashboard
      </h1>

      <h2
        style={{
          marginTop: "30px",
        }}
      >
        Strategy Performance
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#1F2937",
        }}
      >

        <thead>

          <tr>

            <th style={headerStyle}>
              Symbol
            </th>

            <th style={headerStyle}>
              Side
            </th>

            <th style={headerStyle}>
              Regime
            </th>

            <th style={headerStyle}>
              Trades
            </th>

            <th style={headerStyle}>
              Avg PnL
            </th>

            <th style={headerStyle}>
              Win Rate
            </th>

          </tr>

        </thead>

        <tbody>

          {strategies.map(
            (strategy, index) => (

              <tr key={index}>

                <td style={cellStyle}>
                  {strategy.symbol}
                </td>

                <td style={cellStyle}>
                  {strategy.side}
                </td>

                <td style={cellStyle}>
                  {strategy.regime}
                </td>

                <td style={cellStyle}>
                  {strategy.trades}
                </td>

                <td style={cellStyle}>
                  {strategy.avg_pnl}
                </td>

                <td style={cellStyle}>
                  {strategy.win_rate}%
                </td>

              </tr>
            )
          )}

        </tbody>

      </table>

    </div>
  );
}

const headerStyle = {

  border:
    "1px solid #374151",

  padding: "12px",

  background: "#111827",
};

const cellStyle = {

  border:
    "1px solid #374151",

  padding: "12px",

  textAlign: "center",
};

export default App;
