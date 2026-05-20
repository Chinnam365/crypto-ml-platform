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

  const [positions, setPositions] =
    useState([]);

  const [strategies, setStrategies] =
    useState([]);

  const [signals, setSignals] =
    useState([]);

  const [equityCurve, setEquityCurve] =
    useState([]);

  const loadData = async () => {

    try {

      const positionsResponse =
        await axios.get(
          "https://crypto-ml-platform-02b7.onrender.com/positions"
        );

      const strategyResponse =
        await axios.get(
          "https://crypto-ml-platform-02b7.onrender.com/strategy-performance"
        );

      const signalsResponse =
        await axios.get(
          "https://crypto-ml-platform-02b7.onrender.com/live-signals"
        );

      const positionsData =
        positionsResponse.data.positions || [];

      setPositions(
        positionsData
      );

      setStrategies(
        strategyResponse.data.strategies || []
      );

      setSignals(
        signalsResponse.data.signals || []
      );

      let runningEquity = 10000;

      const curve =
        positionsData
          .slice()
          .reverse()
          .map((p, index) => {

            runningEquity +=
              Number(p.pnl || 0);

            return {
              trade: index + 1,
              equity: runningEquity,
            };
          });

      setEquityCurve(curve);

    } catch (err) {

      console.error(err);
    }
  };

  useEffect(() => {

    loadData();

    const interval =
      setInterval(
        loadData,
        10000
      );

    return () =>
      clearInterval(interval);

  }, []);

  const totalPnL =
    positions.reduce(
      (sum, p) =>
        sum + Number(p.pnl || 0),
      0
    );

  const winRate =
    positions.length > 0
      ? (
          positions.filter(
            p => Number(p.pnl) > 0
          ).length /
          positions.length
        ) * 100
      : 0;

  const dashboardStyle = {
    backgroundColor: "#020617",
    minHeight: "100vh",
    color: "white",
    display: "flex",
    fontFamily: "Arial",
  };

  const sidebarStyle = {
    width: "220px",
    background: "#081028",
    padding: "20px",
  };

  const contentStyle = {
    flex: 1,
    padding: "30px",
  };

  const cardsContainer = {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px",
    marginBottom: "30px",
  };

  const statCard = {
    background: "#0B1739",
    padding: "20px",
    borderRadius: "14px",
  };

  const positionsGrid = {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(280px,1fr))",
    gap: "18px",
  };

  const positionCard = {
    background: "#081028",
    border: "1px solid #1E293B",
    padding: "16px",
    borderRadius: "14px",
  };

  return (

    <div style={dashboardStyle}>

      <div style={sidebarStyle}>

        <h2>
          AI Terminal
        </h2>

        <div style={{ marginTop: "40px" }}>
          <p>Dashboard</p>
          <p>Positions</p>
          <p>Strategies</p>
          <p>Analytics</p>
          <p>Risk</p>
          <p>AI Engine</p>
        </div>

      </div>

      <div style={contentStyle}>

        <h1
          style={{
            fontSize: "58px",
            marginBottom: "30px",
          }}
        >
          AI Trading Dashboard
        </h1>

        {/* STATS */}

        <div style={cardsContainer}>

          <div style={statCard}>
            <h3>Open Positions</h3>
            <h1>
              {positions.length}
            </h1>
          </div>

          <div style={statCard}>
            <h3>Total PnL</h3>

            <h1
              style={{
                color:
                  totalPnL >= 0
                    ? "#00FF85"
                    : "#FF4D4F",
              }}
            >
              {totalPnL.toFixed(2)}
            </h1>

          </div>

          <div style={statCard}>
            <h3>Win Rate</h3>

            <h1
              style={{
                color: "#38BDF8",
              }}
            >
              {winRate.toFixed(2)}%
            </h1>

          </div>

          <div style={statCard}>
            <h3>Strategies</h3>

            <h1
              style={{
                color: "#FACC15",
              }}
            >
              {strategies.length}
            </h1>

          </div>

        </div>

        {/* EQUITY CURVE */}

        <div
          style={{
            background: "#0B1739",
            padding: "20px",
            borderRadius: "14px",
            marginBottom: "40px",
          }}
        >

          <h2>
            Equity Curve
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <LineChart data={equityCurve}>

              <CartesianGrid stroke="#334155" />

              <XAxis dataKey="trade" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="equity"
                stroke="#00FF85"
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        {/* LIVE AI SIGNALS */}

        <div
          style={{
            marginBottom: "40px",
          }}
        >

          <h2
            style={{
              color: "#00FF85",
              marginBottom: "20px",
            }}
          >
            🚨 LIVE AI SIGNALS
          </h2>

          <div style={positionsGrid}>

            {signals.map(
              (signal, index) => (

                <div
                  key={index}
                  style={positionCard}
                >

                  <h2>

                    {signal.symbol}
                    {" "}

                    <span
                      style={{
                        color:
                          signal.side === "BUY"
                            ? "#00FF85"
                            : "#FF4D4F",
                      }}
                    >
                      {signal.side}
                    </span>

                  </h2>

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
                    {signal.signal_strength}
                  </p>

                </div>
              )
            )}

          </div>

        </div>

        {/* LIVE POSITIONS */}

        <div>

          <h2
            style={{
              marginBottom: "20px",
            }}
          >
            Live Positions
          </h2>

          <div style={positionsGrid}>

            {positions.map(
              (position, index) => (

                <div
                  key={index}
                  style={positionCard}
                >

                  <h2>

                    {position.symbol}
                    {" "}

                    <span
                      style={{
                        color:
                          position.side === "BUY"
                            ? "#00FF85"
                            : "#FF4D4F",
                      }}
                    >
                      {position.side}
                    </span>

                  </h2>

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

                    PnL:
                    {" "}

                    <span
                      style={{
                        color:
                          Number(position.pnl) >= 0
                            ? "#00FF85"
                            : "#FF4D4F",
                      }}
                    >
                      {position.pnl}
                    </span>

                  </p>

                </div>
              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;
