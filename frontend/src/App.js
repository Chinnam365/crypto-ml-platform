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
  // LOAD STRATEGIES
  // ==========================================

  const loadStrategies =
    async () => {

      try {

        const response =
          await axios.get(
            "https://crypto-ml-platform-02b7.onrender.com/strategy-performance"
          );

        setStrategies(
          response.data.strategies || []
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

    <div style={styles.container}>

      <h1>
        AI Trading Dashboard
      </h1>

      <p>
        Live AI Strategy Analytics
      </p>

      {/* ====================================== */}
      {/* STRATEGY TABLE */}
      {/* ====================================== */}

      <table style={styles.table}>

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
            (strategy, index) => (

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
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = {

  container: {

    backgroundColor:
      "#111827",

    color:
      "white",

    minHeight:
      "100vh",

    padding:
      "40px",

    fontFamily:
      "Arial",
  },

  table: {

    width:
      "100%",

    borderCollapse:
      "collapse",

    marginTop:
      "30px",

    backgroundColor:
      "#1F2937",
  },

  header: {

    border:
      "1px solid #374151",

    padding:
      "12px",

    backgroundColor:
      "#111827",
  },

  cell: {

    border:
      "1px solid #374151",

    padding:
      "12px",

    textAlign:
      "center",
  },
};

export default App;
