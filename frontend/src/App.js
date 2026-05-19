import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

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
  // AUTO REFRESH
  // ==========================================

  useEffect(() => {

    loadStrategies();

    loadPositions();

    const interval =
      setInterval(() => {

        loadStrategies();

        loadPositions();

      }, 10000);

    return () =>
      clearInterval(interval);

  }, []);

  // ==========================================
  // STATS
  // ==========================================

  const totalPnL =
    positions.reduce(
      (
        total,
        position
      ) =>
        total +
        Number(
          position.pnl || 0
        ),
      0
    );

  const totalPositions =
    positions.length;

  const profitableTrades =
    positions.filter(
      position =>
        Number(position.pnl) > 0
    ).length;

  const winRate =
    totalPositions > 0
      ? (
          profitableTrades /
          totalPositions
        ) * 100
      : 0;

  // ==========================================
  // CHART DATA
  // ==========================================

  let cumulativePnL = 0;

  const equityData =
    positions.map(
      (
        position,
        index
      ) => {

        cumulativePnL +=
          Number(
            position.pnl || 0
          );

        return {

          trade:
            index + 1,

          pnl:
            Number(
              position.pnl || 0
            ),

          equity:
            10000 +
            cumulativePnL,
        };
      }
    );

  // ==========================================
  // UI
  // ==========================================

  return (

    <div
      style={{
        backgroundColor:
          "#020617",

        color: "white",

        minHeight:
          "100vh",

        padding: "30px",

        fontFamily:
          "Arial",
      }}
    >

      <h1
        style={{
          fontSize: "42px",
          marginBottom: "30px",
        }}
      >
        AI Trading Dashboard
      </h1>

      {/* ====================================== */}
      {/* SUMMARY */}
      {/* ====================================== */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",

          gap: "20px",

          marginBottom: "40px",
        }}
      >

        <DashboardCard
          title="Open Positions"
          value={totalPositions}
        />

        <DashboardCard
          title="Total PnL"
          value={
            totalPnL.toFixed(2)
          }
          color={
            totalPnL >= 0
              ? "#22C55E"
              : "#EF4444"
          }
        />

        <DashboardCard
          title="Win Rate"
          value={
            winRate.toFixed(2) + "%"
          }
          color="#38BDF8"
        />

        <DashboardCard
          title="Strategies"
          value={
            strategies.length
          }
          color="#FACC15"
        />

      </div>

      {/* ====================================== */}
      {/* EQUITY CHART */}
      {/* ====================================== */}

      <div
        style={{
          background:
            "#0F172A",

          border:
            "1px solid #1E293B",

          borderRadius:
            "14px",

          padding: "20px",

          marginBottom: "50px",
        }}
      >

        <h2
          style={{
            marginBottom: "20px",
          }}
        >
          Equity Curve
        </h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <LineChart
            data={equityData}
          >

            <CartesianGrid stroke="#334155" />

            <XAxis dataKey="trade" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="equity"
              stroke="#22C55E"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

      {/* ====================================== */}
      {/* STRATEGIES */}
      {/* ====================================== */}

      <h2
        style={{
          marginBottom: "20px",
        }}
      >
        Strategy Performance
      </h2>

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit, minmax(300px, 1fr))",

          gap: "20px",

          marginBottom: "50px",
        }}
      >

        {strategies.map(
          (
            strategy,
            index
          ) => (

            <div
              key={index}
              style={{
                background:
                  "#0F172A",

                border:
                  "1px solid #1E293B",

                borderRadius:
                  "14px",

                padding: "20px",
              }}
            >

              <h3>

                {strategy.symbol}

                {" "}

                <span
                  style={{
                    color:
                      strategy.side === "BUY"
                        ? "#22C55E"
                        : "#EF4444",
                  }}
                >

                  {strategy.side}

                </span>

              </h3>

              <p>
                Regime:
                {" "}
                {strategy.regime}
              </p>

              <p>
                Trades:
                {" "}
                {strategy.trades}
              </p>

              <p>
                Avg PnL:
                {" "}

                <span
                  style={{
                    color:
                      Number(
                        strategy.avg_pnl
                      ) >= 0
                        ? "#22C55E"
                        : "#EF4444",
                  }}
                >

                  {strategy.avg_pnl}

                </span>

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

      {/* ====================================== */}
      {/* POSITIONS */}
      {/* ====================================== */}

      <h2
        style={{
          marginBottom: "20px",
        }}
      >
        Live Positions
      </h2>

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit, minmax(350px, 1fr))",

          gap: "20px",
        }}
      >

        {positions.map(
          (
            position,
            index
          ) => (

            <div
              key={index}
              style={{
                background:
                  "#0F172A",

                border:
                  "1px solid #1E293B",

                borderRadius:
                  "14px",

                padding: "20px",
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

    </div>
  );
}

// ==========================================
// CARD COMPONENT
// ==========================================

function DashboardCard({
  title,
  value,
  color = "white",
}) {

  return (

    <div
      style={{
        background:
          "#0F172A",

        border:
          "1px solid #1E293B",

        borderRadius:
          "14px",

        padding: "25px",
      }}
    >

      <h3
        style={{
          color: "#94A3B8",
          marginBottom: "10px",
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          color,
          fontSize: "34px",
        }}
      >
        {value}
      </h1>

    </div>
  );
}

export default App;
