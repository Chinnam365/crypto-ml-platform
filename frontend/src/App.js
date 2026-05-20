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
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function App() {

const [strategies, setStrategies] =
  useState([]);

const [signals, setSignals] =
  useState([]);
  
  const [
    positions,
    setPositions,
  ] = useState([]);

  // ==========================================
  // LOAD DATA
  // ==========================================

  const loadData =
    async () => {

      try {

        const strategyResponse =
          await axios.get(
            "https://crypto-ml-platform-02b7.onrender.com/strategy-performance"
          );

        setStrategies(
          strategyResponse.data.strategies
        );

        const positionsResponse =
          await axios.get(
            "https://crypto-ml-platform-02b7.onrender.com/positions"
          );

        setPositions(
          positionsResponse.data.positions
        );

      } catch (err) {

        console.error(err);
      }
    };

  const loadSignals =
  async () => {

    try {

      const response =
        await axios.get(
          "https://crypto-ml-platform-02b7.onrender.com/live-signals"
        );

      setSignals(
        response.data.signals
      );

    } catch (err) {

      console.error(err);
    }
  };
  
  // ==========================================
  // AUTO REFRESH
  // ==========================================

  useEffect(() => {

  loadData();

  loadSignals();

  const interval =
    setInterval(() => {

      loadData();

      loadSignals();

    }, 10000);

  return () =>
    clearInterval(interval);

}, []);

  // ==========================================
  // METRICS
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

  let runningEquity =
    10000;

  const equityData =
    positions.map(
      (
        position,
        index
      ) => {

        runningEquity +=
          Number(
            position.pnl || 0
          );

        return {

          trade:
            index + 1,

          equity:
            runningEquity,
        };
      }
    );

  // ==========================================
  // UI
  // ==========================================

  return (

    <div
      style={{
        display: "flex",
        background:
          "#020617",
        color: "white",
        minHeight: "100vh",
        fontFamily: "Arial",
      }}
    >

      {/* ==================================== */}
      {/* SIDEBAR */}
      {/* ==================================== */}

      <div
        style={{
          width: "240px",
          background:
            "#0F172A",
          padding: "30px",
          borderRight:
            "1px solid #1E293B",
        }}
      >

        <h2>
          AI Terminal
        </h2>

        <div
          style={{
            marginTop: "40px",
          }}
        >

          <SidebarItem
            label="Dashboard"
          />

          <SidebarItem
            label="Positions"
          />

          <SidebarItem
            label="Strategies"
          />

          <SidebarItem
            label="Analytics"
          />

          <SidebarItem
            label="Risk"
          />

          <SidebarItem
            label="AI Engine"
          />

        </div>

      </div>

      {/* ==================================== */}
      {/* MAIN CONTENT */}
      {/* ==================================== */}

      <div
        style={{
          flex: 1,
          padding: "30px",
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

        {/* ================================= */}
        {/* SUMMARY CARDS */}
        {/* ================================= */}

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

        {/* ================================= */}
        {/* EQUITY CHART */}
        {/* ================================= */}

        <div
          style={{
            background:
              "#0F172A",

            borderRadius:
              "14px",

            padding: "20px",

            marginBottom: "40px",
          }}
        >

          <h2>
            Equity Curve
          </h2>

          <div
            style={{
              width: "100%",
              height: "350px",
            }}
          >

            <ResponsiveContainer>

              <LineChart
                data={equityData}
              >

                <CartesianGrid
                  stroke="#334155"
                />

                <XAxis
                  dataKey="trade"
                />

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

        </div>

{/* ================================= */}
{/* LIVE AI SIGNALS */}
{/* ================================= */}

<h2
  style={{
    marginBottom: "20px",
  }}
>
  Live AI Signals
</h2>

<div
  style={{
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(260px, 1fr))",

    gap: "20px",

    marginBottom: "40px",
  }}
>

  {signals.map(
    (signal, index) => (

      <div
        key={index}
        style={{
          background:
            "#09142A",

          border:
            "1px solid #1E293B",

          borderRadius:
            "14px",

          padding: "20px",
        }}
      >

        <div
          style={{
            display: "flex",

            justifyContent:
              "space-between",

            marginBottom:
              "15px",
          }}
        >

          <h3>
            {signal.symbol}
          </h3>

          <span
            style={{
              color:
                signal.side === "BUY"
                  ? "#00FF85"
                  : "#FF4D4D",

              fontWeight:
                "bold",
            }}
          >

            {signal.side}

          </span>

        </div>

        <p>
          Confidence:
          {" "}

          {Number(
            signal.confidence
          ).toFixed(2)}
        </p>

        <p>
          Trend:
          {" "}

          {signal.trend}
        </p>

        <p>
          Regime:
          {" "}

          {signal.regime}
        </p>

        <p>

          Strength:
          {" "}

          <span
            style={{
              color:
                signal.signal_strength === "STRONG"
                  ? "#00FF85"

                  : signal.signal_strength === "MODERATE"
                  ? "#FFD700"

                  : "#FF4D4D",
            }}
          >

            {signal.signal_strength}

          </span>

        </p>

        <p>

          PnL:
          {" "}

          <span
            style={{
              color:
                Number(
                  signal.pnl
                ) >= 0
                  ? "#22C55E"
                  : "#EF4444",
            }}
          >

            {Number(
              signal.pnl
            ).toFixed(2)}

          </span>

        </p>

      </div>
    )
  )}

</div>

        {/* ================================= */}
        {/* LIVE POSITIONS */}
        {/* ================================= */}

        <h2>
  Live AI Signals
</h2>

<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  }}
>

  {signals.map(
    (signal, index) => (

      <div
        key={index}
        style={{
          background:
            "#09142A",

          border:
            "1px solid #1E293B",

          borderRadius:
            "14px",

          padding: "20px",
        }}
      >

        <h3>

          {signal.symbol}

          {" "}

          <span
            style={{
              color:
                signal.side === "BUY"
                  ? "#22C55E"
                  : "#EF4444",
            }}
          >

            {signal.side}

          </span>

        </h3>

        <p>
          Confidence:
          {" "}
          {Number(
            signal.confidence
          ).toFixed(2)}
        </p>

        <p>
          Trend:
          {" "}
          {signal.trend}
        </p>

        <p>
          Regime:
          {" "}
          {signal.regime}
        </p>

        <p>

          Strength:
          {" "}

          <span
            style={{
              color:
                signal.signal_strength === "STRONG"
                  ? "#22C55E"

                  : signal.signal_strength === "MODERATE"
                  ? "#FACC15"

                  : "#EF4444",
            }}
          >

            {signal.signal_strength}

          </span>

        </p>

      </div>
    )
  )}

</div>

<h2>
  Live Positions
</h2>

// ==========================================
// SIDEBAR ITEM
// ==========================================

function SidebarItem({
  label,
}) {

  return (

    <div
      style={{
        padding: "14px",
        marginBottom: "10px",
        borderRadius: "10px",
        cursor: "pointer",
        background: "#111827",
      }}
    >

      {label}

    </div>
  );
}

// ==========================================
// DASHBOARD CARD
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

        borderRadius:
          "14px",

        padding: "25px",
      }}
    >

      <h3
        style={{
          color: "#94A3B8",
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          color,
          marginTop: "15px",
          fontSize: "36px",
        }}
      >
        {value}
      </h1>

    </div>
  );
}

export default App;
