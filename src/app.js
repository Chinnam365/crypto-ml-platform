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

  // ==========================================
  // LOAD STRATEGY ANALYTICS
  // ==========================================

  const loadStrategies =
    async () => {

      try {

        const response =
          await axios.get(
            "https://crypto-ml-platform-02b7.onrender.com/strategy-performance"
          );

        setStrategies(
          response.data.strategies
        );

      } catch (err) {

        console.error(
          err.message
        );
      }
    };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {

    loadStrategies();

  }, []);

  return (

    <div
      style={{
        padding: 30,
        fontFamily: "Arial",
        background: "#111827",
        minHeight: "100vh",
        color: "white",
      }}
    >

      <h1
        style={{
          marginBottom: 30,
        }}
      >
        AI Trading Dashboard
      </h1>

      {/* ====================================== */}
      {/* STRATEGY TABLE */}
      {/* ====================================== */}

      <h2>
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

            <th style={tableHeader}>
              Symbol
            </th>

            <th style={tableHeader}>
              Side
            </th>

            <th style={tableHeader}>
              Regime
            </th>

            <th style={tableHeader}>
              Trades
            </th>

            <th style={tableHeader}>
              Avg PnL
            </th>

            <th style={tableHeader}>
              Win Rate
            </th>

          </tr>

        </thead>

        <tbody>

          {strategies.map(
            (strategy, index) => (

              <tr key={index}>

                <td style={tableCell}>
                  {strategy.symbol}
                </td>

                <td style={tableCell}>
                  {strategy.side}
                </td>

                <td style={tableCell}>
                  {strategy.regime}
                </td>

                <td style={tableCell}>
                  {strategy.trades}
                </td>

                <td style={tableCell}>
                  {strategy.avg_pnl}
                </td>

                <td style={tableCell}>
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

// ==========================================
// TABLE STYLES
// ==========================================

const tableHeader = {

  border:
    "1px solid #374151",

  padding: "12px",

  background: "#111827",
};

const tableCell = {

  border:
    "1px solid #374151",

  padding: "12px",

  textAlign: "center",
};

export default App;
