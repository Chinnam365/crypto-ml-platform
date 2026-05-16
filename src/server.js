require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");


const {
  getPrice,
  getCandles,
} = require("./market/binance");

const {
  generateAnalytics,
} = require("./ml/analytics");

const {
  calculateRSI,
} = require("./indicators/rsi");

const {
  calculateMACD,
} = require("./indicators/macd");

const {
  detectTrend,
} = require("./indicators/trend");

const {
  detectMarketRegime,
} = require("./market/regime");

const {
  getBestSymbols,
} = require("./ml/symbolSelector");

const {
  calculateConfidence,
} = require("./ml/confidenceEngine");

const {
  calculateStopLoss,
} = require("./ml/stopLossEngine");

const {
  calculateTakeProfit,
} = require("./ml/takeProfitEngine");

const {
  calculatePositionSize,
} = require("./ml/riskManager");

const {
  getPortfolioStats,
} = require("./ml/portfolioManager");

const {
  getDrawdownStats,
} = require("./ml/drawdownManager");

const {
  monitorPositions,
} = require("./ml/positionMonitor");

const app = express();

app.use(cors());
app.use(express.json());

/*
==================================================
DATABASE
==================================================
*/

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false,
  },
});

/*
==================================================
INIT DATABASE
==================================================
*/

async function initDB() {

  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS trades (
        id SERIAL PRIMARY KEY,
        symbol TEXT,
        side TEXT,
        rsi FLOAT,
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

    const existingModel =
      await pool.query(
        `SELECT * FROM model LIMIT 1`
      );

    if (
      existingModel.rows.length === 0
    ) {

      await pool.query(
        `
        INSERT INTO model (weights)
        VALUES ($1)
        `,
        [
          JSON.stringify({
            rsi: 0.5,
            trend: 0.5,
            volume: 0.5,
          }),
        ]
      );
    }

    console.log(
      "✅ Database initialized"
    );

  } catch (err) {

    console.error(
      "DB INIT ERROR:",
      err.message
    );
  }
}

/*
==================================================
HOME
==================================================
*/

app.get("/", async (req, res) => {

  try {

    const totalResult =
      await pool.query(
        `SELECT COUNT(*) FROM trades`
      );

    const winResult =
      await pool.query(`
        SELECT COUNT(*) AS wins
        FROM trades
        WHERE pnl > 0
      `);

    const total =
      Number(
        totalResult.rows[0].count
      );

    const wins =
      Number(
        winResult.rows[0].wins
      );

    const winRate =
      total > 0
        ? (
            (wins / total) * 100
          ).toFixed(2)
        : "0.00";

    res.send(`
      <h1>🧠 Crypto ML Platform</h1>

      <p>Total Trades: ${total}</p>

      <p>Win Rate: ${winRate}%</p>

      <a href="/status">Status</a><br/>
      <a href="/model">Model</a><br/>
      <a href="/history">History</a><br/>
      <a href="/positions">Positions</a><br/>
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

    const trades =
      await pool.query(
        `SELECT COUNT(*) FROM trades`
      );

    const model =
      await pool.query(
        `SELECT * FROM model LIMIT 1`
      );

    res.json({
      status: "running",
      trades:
        trades.rows[0].count,
      model:
        model.rows[0] || null,
    });

  } catch (err) {

    res.json({
      error: err.message,
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

    const result =
      await pool.query(
        `SELECT * FROM model LIMIT 1`
      );

    res.json(
      result.rows[0] || {}
    );

  } catch (err) {

    res.json({
      error: err.message,
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

    const result =
      await pool.query(`
        SELECT *
        FROM trades
        ORDER BY id DESC
        LIMIT 50
      `);

    let html =
      "<h1>Trade History</h1>";

    result.rows.forEach(
      (trade) => {

        html += `
          <p>
            ${trade.symbol}
            |
            ${trade.side}
            |
            RSI: ${trade.rsi}
            |
            Entry: ${trade.entry_price}
            |
            Exit: ${trade.exit_price}
            |
            PnL: ${trade.pnl}
          </p>
        `;
      }
    );

    res.send(html);

  } catch (err) {

    res.send(err.message);
  }
});
/*
==================================================
POSITIONS
==================================================
*/

app.get("/positions", async (req, res) => {

  try {

    const result =
      await pool.query(`
        SELECT *
        FROM positions
        ORDER BY id DESC
        LIMIT 50
      `);

    let html =
      "<h1>Positions</h1>";

    result.rows.forEach(
      (position) => {

        html += `
          <p>
            ${position.symbol}
            |
            ${position.side}
            |
            Confidence: ${position.confidence}
            |
            Entry: ${position.entry_price}
            |
            SL: ${position.stop_loss}
            |
            TP: ${position.take_profit}
            |
            Size: ${position.position_size}
            |
            PnL: ${position.pnl}
          </p>
        `;
      }
    );

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

    await pool.query(
      `DELETE FROM trades`
    );

    res.send(
      "✅ Trade history reset"
    );

  } catch (err) {

    res.send(err.message);
  }
});

/*
==================================================
ML ENGINE
==================================================
*/

let tradeCounter = 0;

async function runEngine() {

  try {
// ==========================================
// MONITOR OPEN POSITIONS
// ==========================================

await monitorPositions(pool);
    
    // ==========================================
    // AI SYMBOL SELECTION
    // ==========================================

    const rankings =
      await getBestSymbols();

    let symbols = [

      "ETHUSDT",

      "BTCUSDT",

      "SOLUSDT",

      "DOGEUSDT",

      "LINKUSDT",
    ];

    // ==========================================
    // USE ONLY PROFITABLE SYMBOLS
    // ==========================================

    if (rankings.length > 0) {

      const profitable =
        rankings
          .filter(
            s => s.avgPnL > 0
          )
          .map(
            s => s.symbol
          );

      if (profitable.length > 0) {

        symbols = profitable;
      }
    }

    console.log(
      "Allowed symbols:",
      symbols
    );

    const randomSymbol =
      symbols[
        Math.floor(
          Math.random() *
          symbols.length
        )
      ];

    // ==========================================
    // GET REAL CANDLES
    // ==========================================

    const candles =
      await getCandles(
        randomSymbol,
        "5m",
        100
      );

    if (!candles.length) {

      console.log(
        `No candles for ${randomSymbol}`
      );

      return;
    }

    // ==========================================
    // EXTRACT CLOSES
    // ==========================================

    const closes =
      candles.map(
        candle =>
          Number(candle[4])
      );

    // ==========================================
    // INDICATORS
    // ==========================================

    const rsi =
      calculateRSI(closes);

    const macd =
      calculateMACD(closes);

    const trend =
      detectTrend(closes);

    const regime =
      detectMarketRegime(closes);

    if (!rsi) {

      console.log(
        `RSI unavailable for ${randomSymbol}`
      );

      return;
    }

    // ==========================================
    // VOLATILITY
    // ==========================================

    const volatility =
      (
        (
          Math.max(...closes) -
          Math.min(...closes)
        ) /
        closes[
          closes.length - 1
        ]
      ) * 100;

    // ==========================================
    // SKIP LOW VOLATILITY
    // ==========================================

    if (volatility < 0.8) {

      console.log(
        `${randomSymbol} volatility too low`
      );

      return;
    }

    // ==========================================
    // SYMBOL PERFORMANCE
    // ==========================================

    const symbolRanking =
      rankings.find(
        s =>
          s.symbol ===
          randomSymbol
      );

    const avgSymbolPnL =
      symbolRanking
        ? symbolRanking.avgPnL
        : 0;

    // ==========================================
    // AI CONFIDENCE
    // ==========================================

    const confidence =
      calculateConfidence({

        rsi,

        macd,

        trend,

        regime,

        volatility,

        avgSymbolPnL,
      });

    // ==========================================
    // AI DECISION
    // ==========================================

    let side = "HOLD";

    // ==========================================
    // BUY CONDITIONS
    // ==========================================

    if (

      rsi < 55 &&

      macd > -10 &&

      trend === "BULLISH" &&

      regime ===
        "TRENDING_BULLISH"
    ) {

      side = "BUY";
    }

    // ==========================================
    // SELL CONDITIONS
    // ==========================================

    else if (

      rsi > 45 &&

      macd < 10 &&

      trend === "BEARISH" &&

      regime ===
        "TRENDING_BEARISH"
    ) {

      side = "SELL";
    }

    // ==========================================
    // SKIP HOLD / LOW CONFIDENCE
    // ==========================================

    if (

      side === "HOLD" ||

      confidence < 70
    ) {

      console.log(

        `${randomSymbol}

        HOLD

        | RSI ${rsi.toFixed(2)}

        | MACD ${macd.toFixed(4)}

        | Trend ${trend}

        | Regime ${regime}

        | Volatility ${volatility.toFixed(2)}

        | Confidence ${confidence.toFixed(2)}`
      );

      return;
    }

    // ==========================================
// PORTFOLIO CHECK
// ==========================================

const portfolio =
  await getPortfolioStats(pool);

console.log(`
==================================
PORTFOLIO STATUS
==================================

Open Positions:
${portfolio.openPositions}

Total Exposure:
${portfolio.totalExposure}

Can Trade:
${portfolio.canTrade}

==================================
`);

if (!portfolio.canTrade) {

  console.log(
    "Portfolio risk limit reached"
  );

  return;
}

    // ==========================================
// DRAWDOWN CHECK
// ==========================================

const drawdown =
  await getDrawdownStats(pool);

console.log(`
==================================
DRAWDOWN STATUS
==================================

Equity:
${drawdown.equity}

Peak Equity:
${drawdown.peakEquity}

Max Drawdown:
${drawdown.maxDrawdown}%

Risk Multiplier:
${drawdown.riskMultiplier}

Trading Enabled:
${drawdown.tradingEnabled}

==================================
`);

if (!drawdown.tradingEnabled) {

  console.log(
    "Trading disabled due to drawdown protection"
  );

  return;
}
    
    
    // ==========================================
    // LIVE PRICE
    // ==========================================

    const livePrice =
      await getPrice(
        randomSymbol
      );

    if (!livePrice) {

      console.log(
        `Price unavailable for ${randomSymbol}`
      );

      return;
    }
// ==========================================
// PHASE 2 RISK ENGINE
// ==========================================

const balance = 10000;

const entryPrice = livePrice;

const {
  stopLoss,
  stopLossPercent,
} = calculateStopLoss({

  action: side,

  entryPrice,

  volatility,
});

const {
  takeProfit,
  rewardMultiplier,
} = calculateTakeProfit({

  action: side,

  entryPrice,

  stopLoss,

  confidence,
});

const positionSize =
  calculatePositionSize({

    balance,

    confidence,

    volatility,

    entryPrice,

    stopLoss,
  });
const adjustedPositionSize =
  Number(
    (
      positionSize *
      drawdown.riskMultiplier
    ).toFixed(6)
  );
console.log(`
==================================
RISK MANAGEMENT
==================================

Symbol: ${randomSymbol}

Side: ${side}

Entry: ${entryPrice}

Stop Loss: ${stopLoss.toFixed(2)}

Take Profit: ${takeProfit.toFixed(2)}

Position Size: ${adjustedPositionSize}

Volatility: ${volatility.toFixed(2)}

Confidence: ${confidence.toFixed(2)}

==================================
`);
    
    // ==========================================
    // SAVE TRADE
    // ==========================================
// ==========================================
// SAVE POSITION DATA
// ==========================================

await pool.query(
  `
  INSERT INTO positions
  (
    symbol,
    side,
    confidence,
    volatility,
    entry_price,
    stop_loss,
    take_profit,
    position_size,
    pnl
  )
  VALUES
  ($1,$2,$3,$4,$5,$6,$7,$8,$9)
  `,
  [
  randomSymbol,

  side,

  confidence,

  volatility,

  entryPrice,

  stopLoss,

  takeProfit,

  adjustedPositionSize,

  0,
]
);
    await pool.query(
      `
      INSERT INTO trades
(
  symbol,
  side,
  rsi,
  entry_price,
  exit_price,
  pnl
)
      VALUES
      ($1,$2,$3,$4,$5,$6)
      `,
      [
        randomSymbol,
        side,
        rsi,
        entry,
        exit,
        pnl,
      ]
    );

    tradeCounter++;

    // ==========================================
    // STATS
    // ==========================================

    const stats =
      await pool.query(`
        SELECT
          COUNT(*) AS total,

          SUM(
            CASE
              WHEN pnl > 0
              THEN 1
              ELSE 0
            END
          ) AS wins

        FROM trades
      `);

    const total =
      Number(
        stats.rows[0].total
      );

    const wins =
      Number(
        stats.rows[0].wins
      );

    const winRate =
      total > 0
        ? (
            (wins / total) * 100
          ).toFixed(2)
        : "0.00";

    // ==========================================
    // FINAL LOGGING
    // ==========================================

    console.log(
      `
      Trade ${tradeCounter}
      |
      ${randomSymbol}
      |
      ${side}
      |
      RSI ${rsi.toFixed(2)}
      |
      MACD ${macd.toFixed(4)}
      |
      Trend ${trend}
      |
      Regime ${regime}
      |
      Volatility ${volatility.toFixed(2)}
      |
      Confidence ${confidence.toFixed(2)}%
      |
      WinRate ${winRate}%
      `
    );

  } catch (err) {

    console.error(
      "ENGINE ERROR:",
      err.message
    );
  }
}

/*
==================================================
START SERVER
==================================================
*/

async function startServer() {

  await initDB();

  setInterval(
    runEngine,
    15000
  );

  const PORT =
    process.env.PORT || 10000;

  app.get(
  "/analytics",

  async (req, res) => {

    try {

      const analytics =
        await generateAnalytics();

      res.json(analytics);

    } catch (error) {

      res.status(500).json({

        error:
          error.message,
      });
    }
  }
);
  
  app.listen(PORT, () => {

    console.log(
      `🚀 Running on port ${PORT}`
    );
  });
}

startServer();
