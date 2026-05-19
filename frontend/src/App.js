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

  const [
    positions,
    setPositions,
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
          response.data.strategies
        );

      } catch (err) {

        console.error(err);
      }
    };

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
          response.data.positions
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

    loadPositions();

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

      <h1>
        AI Trading Dashboard
      </h1>

      {/* ====================================== */}
      {/* STRATEGY PERFORMANCE */}
      {/* ====================================== */}

      <h2
        style={{
          marginTop: "40px",
        }}
      >
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
              borderRadius:
                "10px",
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

      {/* ====================================== */}
      {/* LIVE POSITIONS */}
      {/* ====================================== */}

      <h2
        style={{
          marginTop: "50px",
        }}
      >
        Live Positions
      </h2>

      {positions.map(
        (
          position,
          index
        ) => (

          <div
            key={index}
            style={{
              background:
                "#111827",

              border:
                "1px solid #334155",

              borderRadius:
                "10px",

              padding: "15px",

              marginBottom: "15px",
            }}
          >

            <h3>

              {position.symbol}

              {" "}

              <span
                style={{
                  color:
                    position.side === "BUY"
                      ? "#22C55E"
                      : "#EF4444",
                }}
              >

                {position.side}

              </span>

            </h3>

            <p>
              Confidence:
              {" "}
              {Number(
                position.confidence
              ).toFixed(2)}
            </p>

            <p>
              Entry:
              {" "}
              {position.entry_price}
            </p>

            <p>
              Stop Loss:
              {" "}
              {position.stop_loss}
            </p>

            <p>
              Take Profit:
              {" "}
              {position.take_profit}
            </p>

            <p>
              Position Size:
              {" "}
              {position.position_size}
            </p>

            <p>

              PnL:

              {" "}

              <span
                style={{
                  color:
                    Number(
                      position.pnl
                    ) >= 0
                      ? "#22C55E"
                      : "#EF4444",
                }}
              >

                {position.pnl}

              </span>

            </p>

            <p>
              Trend:
              {" "}
              {position.trend}
            </p>

            <p>
              Regime:
              {" "}
              {position.regime}
            </p>

          </div>
        )
      )}

    </div>
  );
}

export default App;
