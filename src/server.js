require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

/*
==================================================
DATABASE CONNECTION
==================================================
*/

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

/*
==================================================
DATABASE INIT
==================================================
*/

async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS trades (
        id SERIAL PRIMARY KEY,
        symbol TEXT,
        side TEXT,
        entry_price FLOAT,
        exit_price FLOAT,
        pnl FLOAT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS model (
        id SERIAL PRIMARY KEY,
        weights JSONB,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    const modelCheck = await pool.query(
      `SELECT * FROM model LIMIT 1`
    );

    if (modelCheck.rows.length === 0) {
      await pool.query(
        `
        INSERT INTO model (weights)
        VALUES ($1)
        `,
        [
          JSON.stringify({
            rsi: 0.5,
            macd: 0.5,
            volume: 0.5,
            trend: 0.5
          })
        ]
      );
    }

    console.log("✅ Database ready");
  } catch (err) {
    console.error("❌ DB INIT ERROR:", err.message);
  }
}

/*
==================================================
HOME
==================================================
*/

app.get("/", async (req, res) => {
  try {
    const tradeResult = await pool.query(
      `SELECT COUNT(*) FROM trades`
    );

    const winResult = await pool.query(`
      SELECT COUNT(*) AS wins
      FROM trades
      WHERE pnl > 0
    `);

    const totalTrades = Number(tradeResult.rows[0].count);
    const wins = Number(winResult.rows[0].wins);

    const winRate =
      totalTrades > 0
        ? ((wins / totalTrades) * 100).toFixed(2)
        : "0.00";

    res.send(`
      <h1>🧠 ML Engine v12.1 (Stable)</h1>

      <p>Trades: ${totalTrades}</p>
      <p>Win Rate: ${winRate}%</p>

      <a href="/status">Status</a><br/>
      <a href="/model">Model</a><br/>
      <a href="/history">History</a><br/>
      <a href="/reset">Reset</a>
    `);
  } catch (err) {
    res.send("Server running");
  }
});

/*
==================================================
STATUS
==================================================
*/

app.get("/status", async (req, res) => {
  try {
    const trades = await pool.query(
      `SELECT COUNT(*) FROM trades`
    );

    const model = await pool.query(
      `SELECT * FROM model LIMIT 1`
    );

    res.json({
      status: "running",
      trades: trades.rows[0].count,
      model: model.rows[0] || null
    });
  } catch (err) {
    res.json({
      error: err.message
    });
  }
});

/*
==================================================
MODEL
==================================================
*/

app.get("/model", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM model LIMIT 1`
    );

    res.json(result.rows[0] || {});
  } catch (err) {
    res.json({
      error: err.message
    });
  }
});

/*
==================================================
HISTORY
==================================================
*/

app.get("/history", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM trades
      ORDER BY id DESC
      LIMIT 50
    `);

    let html = "<h1>Trade History</h1>";

    result.rows.forEach((trade) => {
      html += `
        <p>
          ${trade.symbol || "BTCUSDT"}
          |
          ${trade.side || "BUY"}
          |
          PnL: ${trade.pnl || 0}
        </p>
      `;
    });

    res.send(html);
  } catch (err) {
    res.send(err.message);
  }
});

/*
==================================================
RESET
==================================================
*/

app.get("/reset", async (req, res) => {
  try {
    await pool.query(`DELETE FROM trades`);

    res.send("✅ Trades reset complete");
  } catch (err) {
    res.send(err.message);
  }
});

/*
==================================================
SIMULATION ENGINE
==================================================
*/

let tradeCounter = 0;

async function runEngine() {
  try {
    tradeCounter++;

    const symbols = [
      "BTCUSDT",
      "ETHUSDT",
      "SOLUSDT",
      "DOGEUSDT",
      "LINKUSDT"
    ];

    const randomSymbol =
      symbols[Math.floor(Math.random() * symbols.length)];

    const side =
      Math.random() > 0.5 ? "BUY" : "SELL";

    const entry = Number(
      (100 + Math.random() * 100).toFixed(2)
    );

    const exit = Number(
      (entry + (Math.random() * 20 - 10)).toFixed(2)
    );

    const pnl = Number(
      (exit - entry).toFixed(2)
    );

    await pool.query(
      `
      INSERT INTO trades
      (symbol, side, entry_price, exit_price, pnl)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [
        randomSymbol,
        side,
        entry,
        exit,
        pnl
      ]
    );

    const stats = await pool.query(`
      SELECT
        COUNT(*) AS total,
        SUM(
          CASE
            WHEN pnl > 0 THEN 1
            ELSE 0
          END
        ) AS wins
      FROM trades
    `);

    const total = Number(stats.rows[0].total);
    const wins = Number(stats.rows[0].wins);

    const winRate =
      total > 0
        ? ((wins / total) * 100).toFixed(2)
        : "0.00";

    console.log(
      `Trade ${tradeCounter} | WinRate ${winRate}%`
    );
  } catch (err) {
    console.error("ENGINE ERROR:", err.message);
  }
}

/*
==================================================
START SERVER
==================================================
*/

async function startServer() {
  await initDB();

  setInterval(runEngine, 5000);

  const PORT = process.env.PORT || 10000;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer();
