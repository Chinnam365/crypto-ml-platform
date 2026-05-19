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

        console.error(err);
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
        backgroundColor: "#0F172A",
        color: "white",
        minHeight: "100vh",
        padding: "30px",
        fontFamily: "Arial",
      }}
    >

      <h1
        style={{
          marginBottom: "30px",
        }}
      >
        AI Trading Dashboard
      </h1>

      {/* ====================================== */}
      {/* STRATEGY PERFORMANCE */}
      {/* ====================================== */}

      <div
        style={{
          background: "#1E293B",
          padding: "20px",
          borderRadius: "10px",
        }}
      >

        <h2>
          Strategy Performance
        </h2>

        <table
          style={{
            width: "100%",
            borderCollapse:
              "collapse",
            marginTop: "20px",
          }}
        >

          <thead>

            <tr>

              <th style={styles.header}>
                Symbol
              </th>

              <th style={styles.header}>
                Side
              </th>

              <th style={styles.header}>
                Regime
              </th>

              <th style={styles.header}>
                Trades
              </th>

              <th style={styles.header}>
                Avg PnL
              </th>

              <th style={styles.header}>
                Win Rate
              </th>

            </tr>

          </thead>

          <tbody>

            {strategies.map(
              (
                strategy,
                index
              ) => (

                <tr key={index}>

                  <td style={styles.cell}>
                    {strategy.symbol}
                  </td>

                  <td style={styles.cell}>
                    {strategy.side}
                  </td>

                  <td style={styles.cell}>
                    {strategy.regime}
                  </td>

                  <td style={styles.cell}>
                    {strategy.trades}
                  </td>

                  <td style={styles.cell}>
                    {strategy.avg_pnl}
                  </td>

                  <td style={styles.cell}>
                    {strategy.win_rate}%
                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

// ==========================================
// TABLE STYLES
// ==========================================

const styles = {

  header: {

    border:
      "1px solid #334155",

    padding: "12px",

    background:
      "#0F172A",
  },

  cell: {

    border:
      "1px solid #334155",

    padding: "12px",

    textAlign:
      "center",
  },
};

export default App;
