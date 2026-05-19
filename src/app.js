import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

function App() {

  const [
    positions,
    setPositions,
  ] = useState([]);

  const [
    strategies,
    setStrategies,
  ] = useState([]);

  // ==========================================
  // LOAD POSITIONS
  // ==========================================

  const loadPositions =
    async () => {

      try {

        const response =
          await axios.get(
            "https://crypto-ml-platform-02b7.onrender.com/positions"
          );

        setPositions(
          response.data
        );

      } catch (err) {

        console.error(
          err.message
        );
      }
    };

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

    loadPositions();

    loadStrategies();

  }, []);

  return (

    <div
      style={{
        padding: 20,
        fontFamily: "Arial",
      }}
    >

      <h1>
        AI Trading Dashboard
      </h1>

      {/* ====================================== */}
      {/* POSITIONS */}
      {/* ====================================== */}

      <h2>
        Open Positions
      </h2>

      <table
        border="1"
        cellPadding="10"
      >

        <thead>

          <tr>

            <th>Symbol</th>

            <th>Side</th>

            <th>Confidence</th>

            <th>PnL</th>

          </tr>

        </thead>

        <tbody>

          {positions.map(
            (position, index) => (

              <tr key={index}>

                <td>
                  {position.symbol}
                </td>

                <td>
                  {position.side}
                </td>

                <td>
                  {position.confidence}
                </td>

                <td>
                  {position.pnl}
                </td>

              </tr>
            )
          )}

        </tbody>

      </table>

      {/* ====================================== */}
      {/* STRATEGY ANALYTICS */}
      {/* ====================================== */}

      <h2
        style={{
          marginTop: 40,
        }}
      >
        Strategy Analytics
      </h2>

      <table
        border="1"
        cellPadding="10"
      >

        <thead>

          <tr>

            <th>Symbol</th>

            <th>Side</th>

            <th>Regime</th>

            <th>Trades</th>

            <th>Avg PnL</th>

            <th>Win Rate</th>

          </tr>

        </thead>

        <tbody>

          {strategies.map(
            (strategy, index) => (

              <tr key={index}>

                <td>
                  {strategy.symbol}
                </td>

                <td>
                  {strategy.side}
                </td>

                <td>
                  {strategy.regime}
                </td>

                <td>
                  {strategy.trades}
                </td>

                <td>
                  {strategy.avg_pnl}
                </td>

                <td>
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

export default App;
