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
  calculateEMA,
} = require("./indicators/ema");

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
  evaluateOpportunity,
} = require("./ml/opportunityIntelligenceV2");

const {
  fuseOpportunity,
} = require("./ml/opportunityFusionEngine");

const {
  predictOpportunity,
} = require("./ml/opportunityPredictionEngine");

const {
  generateSymbolRankings,
} = require("./ml/symbolRankingEngine");

const {
  calculateStopLoss,
} = require("./ml/stopLossEngine");

const {
  calculateTakeProfit,
} = require("./ml/takeProfitEngine");

const {
  calculatePositionSize,
} = require("./risk/positionSizing");

const {
  getPortfolioStats,
} = require("./ml/portfolioManager");

const {
  getDrawdownStats,
} = require("./ml/drawdownManager");

const {
  monitorPositions,
} = require("./ml/positionMonitor");

const {
  saveMLDataset,
} = require("./ml/datasetBuilder");

const {
  predictTrade,
  trainModel,
} = require("./ml/modelTrainer");

const {
  getModelAnalytics,
} = require("./ml/modelAnalytics");

const {
  getSymbolMemory,
} = require("./ml/symbolMemory");

const {
  getRegimeMemory,
} = require("./ml/regimeMemory");

const {
  getAdaptiveSymbolWeights,
} = require("./ml/adaptiveSymbolWeights");

const {
  getAdaptiveWeights,
} = require("./ml/adaptiveWeights");

const {
  getConfidenceCalibration,
} = require("./ml/confidenceCalibration");

const {
  getAdaptiveSizeMultiplier,
} = require("./ml/adaptiveSizing");

const {
  getDrawdownState,
} = require("./ml/drawdownIntelligence");

const {
  getTrainingData,
} = require("./ml/trainingData");

const {
  runBacktest,
} = require("./backtesting/backtestRunner");

const {
  getMultiTimeframeAnalysis,
} = require("./ml/multiTimeframe");



const {
  getAdaptiveThreshold,
} = require("./ml/adaptiveThreshold");

const {
  calculateTradeQuality,
} = require("./ml/tradeQuality");

const {
  explainDecision,
} = require("./ml/explainDecision");

const {
  saveDecisionMemory,
  getDecisionMemory,
} = require("./ml/decisionMemory");

const {
  calculateSignalScores,
} = require("./ml/probabilisticSignals");

const {
  updateReinforcementMemory,
  getReinforcementScore,
} = require("./ml/reinforcementEngine");

const {
  getOptimizationAdjustments,
} = require("./ml/selfOptimizer");

const liveSignalsRoute =
  require("./routes/liveSignals");

const {
  startBinanceWebsocket,
  liveMarketData,
} = require("./market/binanceWebsocket");

const {
  generateFeatures,
} = require("./features/featureExtractor");

const {
  generateStrategyAnalytics,
} = require("./ml/strategyAnalytics");

const {
  buildTrainingDataset,
} = require("./ml/trainingDatasetBuilder");

const {
  calculateFeatureImportance,
} = require("./ml/featureImportanceEngine");

const {
  calculateRegimeAnalytics,
} = require("./ml/regimeAnalytics");

const {
  updateTradeOutcomes,
} = require("./ml/autoTradeOutcomeUpdater");

const {
  updateSignalOutcomes,
} = require("./ml/signalOutcomeUpdater");

const {
  analyzeFeatureImportance,
} = require("./ml/featureImportanceAnalyzer");


const {
  getMarketScanner,
} = require(
  "./ml/marketScanner"
);

const {
  rankDiscoveries,
} = require(
  "./ml/discoveryRanking"
);

const {
    getSymbolIntelligence
} = require("./ml/symbolIntelligence");


const {
  getDiscoveryCandidates,
} = require(
  "./ml/discoverySelector"
);
const {
  evaluateDiscoveryCandidates,
} = require(
  "./ml/discoveryEvaluator"
);


const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(
  "/live-signals",
  liveSignalsRoute
);
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
  CREATE TABLE IF NOT EXISTS decision_memory (
    id SERIAL PRIMARY KEY,
    pattern TEXT,
    side TEXT,
    confidence FLOAT,
    volatility FLOAT,
    pnl FLOAT,
    created_at TIMESTAMP DEFAULT NOW()
  );
`);

   await pool.query(`
  CREATE TABLE IF NOT EXISTS reinforcement_memory (
    id SERIAL PRIMARY KEY,
    pattern TEXT,
    confidence FLOAT,
    pnl FLOAT,
    reward FLOAT,
    created_at TIMESTAMP DEFAULT NOW()
  );
`);

   await pool.query(`
  CREATE TABLE IF NOT EXISTS positions (
    id SERIAL PRIMARY KEY,
    symbol TEXT,
    side TEXT,
    confidence FLOAT,
    volatility FLOAT,
    macd FLOAT,
    trend TEXT,
    regime TEXT,

    volatility_regime TEXT,
    momentum_state TEXT,
    overall_trend TEXT,
    reinforcement_processed BOOLEAN DEFAULT FALSE,

    entry_price FLOAT,
    stop_loss FLOAT,
    take_profit FLOAT,
    position_size FLOAT,

    pnl FLOAT DEFAULT 0,
    status TEXT DEFAULT 'OPEN',

    opened_at TIMESTAMP DEFAULT NOW(),
    _at TIMESTAMP
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

app.get(
  "/fix-phase2-schema",
  async (req, res) => {

    try {

      await pool.query(`
        ALTER TABLE reinforcement_memory
        ADD COLUMN IF NOT EXISTS context_key TEXT;
      `);

      await pool.query(`
        ALTER TABLE reinforcement_memory
        ADD COLUMN IF NOT EXISTS avg_reward NUMERIC DEFAULT 0;
      `);

      await pool.query(`
        ALTER TABLE reinforcement_memory
        ADD COLUMN IF NOT EXISTS sample_size INTEGER DEFAULT 0;
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS regime_memory (

          id SERIAL PRIMARY KEY,

          context_key TEXT,

          current_state TEXT,

          predicted_state TEXT,

          trend TEXT,

          volatility_regime TEXT,

          momentum_state TEXT,

          transition_probability NUMERIC,

          occurrences INTEGER DEFAULT 1,

          avg_probability NUMERIC DEFAULT 0,

          created_at TIMESTAMP DEFAULT NOW(),

          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);

      await pool.query(`
        ALTER TABLE regime_memory
        ADD COLUMN IF NOT EXISTS context_key TEXT;
      `);

      await pool.query(`
        ALTER TABLE regime_memory
        ADD COLUMN IF NOT EXISTS current_state TEXT;
      `);

      await pool.query(`
        ALTER TABLE regime_memory
        ADD COLUMN IF NOT EXISTS predicted_state TEXT;
      `);

      await pool.query(`
        ALTER TABLE regime_memory
        ADD COLUMN IF NOT EXISTS trend TEXT;
      `);

      await pool.query(`
        ALTER TABLE regime_memory
        ADD COLUMN IF NOT EXISTS volatility_regime TEXT;
      `);

      await pool.query(`
        ALTER TABLE regime_memory
        ADD COLUMN IF NOT EXISTS momentum_state TEXT;
      `);

      await pool.query(`
        ALTER TABLE regime_memory
        ADD COLUMN IF NOT EXISTS transition_probability NUMERIC;
      `);

      await pool.query(`
        ALTER TABLE regime_memory
        ADD COLUMN IF NOT EXISTS occurrences INTEGER DEFAULT 1;
      `);

      await pool.query(`
        ALTER TABLE regime_memory
        ADD COLUMN IF NOT EXISTS avg_probability NUMERIC DEFAULT 0;
      `);

      res.json({
        success: true
      });

    } catch (err) {

      res.json({
        success: false,
        error: err.message
      });
    }
  }
);
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
LIVE MARKET DATA
==================================================
*/

app.get(
  "/market-data",
  async (req, res) => {

    try {

      res.json({

        success: true,

        data: liveMarketData,
      });

    } catch (err) {

      res.status(500).json({

        error:
          err.message,
      });
    }
  }
);
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
// ==========================================
// HEALTH
// ==========================================

app.get(
  "/health",
  async (req, res) => {

    try {

      const db =
        await pool.query(
          "SELECT NOW()"
        );

      res.json({

        success: true,

        status: "RUNNING",

        serverTime:
          db.rows[0].now,

        uptime:
          process.uptime(),

        memory:
          process.memoryUsage(),

      });

    }

    catch (err) {

      res.status(500).json({

        success: false,

        error:
          err.message

      });

    }

  }
);
// ==========================================
// LEARNING STATUS
// ==========================================

app.get(
  "/learning-status",
  async (req, res) => {

    try {

      const tradeHistory =
        await pool.query(
          `
          SELECT COUNT(*) AS count
          FROM trade_history
          `
        );

      const positions =
        await pool.query(
          `
          SELECT COUNT(*) AS count
          FROM positions
          WHERE status='OPEN'
          `
        );

      const closed =
        await pool.query(
          `
          SELECT COUNT(*) AS count
          FROM positions
          WHERE status='CLOSED'
          `
        );

      res.json({

        success: true,

        learning: {

          totalTrades:
            Number(
              tradeHistory.rows[0].count
            ),

          openPositions:
            Number(
              positions.rows[0].count
            ),

          closedPositions:
            Number(
              closed.rows[0].count
            ),

          uptime:
            process.uptime(),

          learningActive: true

        }

      });

    }

    catch (err) {

      res.status(500).json({

        success: false,

        error:
          err.message

      });

    }

  }
);
// ==========================================
// CLOSED TRADES
// ==========================================

app.get(
  "/closed-trades",
  async (req, res) => {

    try {

      const result =
        await pool.query(`
          SELECT
             id,
    symbol,
    side,
    confidence,
    entry_price,
    exit_price,
    stop_loss,
    take_profit,
    pnl,
    trend,
    regime,
    status,
    opened_at,
    closed_at
          FROM positions
          WHERE status = 'CLOSED'
          ORDER BY closed_at DESC
          LIMIT 500
        `);

      res.json({

        success: true,

        total:
          result.rowCount,

        trades:
          result.rows

      });

    }

    catch (err) {

      res.status(500).json({

        success: false,

        error:
          err.message

      });

    }

  }
);

// ==========================================
// SYMBOL INTELLIGENCE
// ==========================================

app.get(
  "/symbol-intelligence",
  async (req, res) => {

    try {

      const symbols =
        await getSymbolIntelligence(pool);

      res.json({

        success: true,

        total: symbols.length,

        symbols

      });

    }

    catch (err) {

      console.error(
        "Symbol Intelligence:",
        err.message
      );

      res.status(500).json({

        success: false,

        error:
          err.message

      });

    }

  }
);
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

// ==========================================
// POSITIONS API
// ==========================================

app.get(
  "/positions",
  async (req, res) => {

    try {

      const result =
        await pool.query(`
          SELECT
  id,
  symbol,
  side,
  confidence,
  entry_price,
  stop_loss,
  take_profit,
  position_size,
  pnl,
  trend,
  regime,
  opened_at
FROM positions
          ORDER BY id DESC
          LIMIT 50
        `);

      res.json({

        positions:
          result.rows,
      });

    } catch (err) {

      console.error(
        "Positions API error:",
        err.message
      );

      res.status(500).json({

        error:
          err.message,
      });
    }
  }
);

// ==========================================
// STRATEGY PERFORMANCE ANALYTICS
// ==========================================

app.get(
  "/strategy-performance",
  async (req, res) => {

    try {

      const result =
        await pool.query(`
         SELECT

symbol,

side,

trend,

regime,

COUNT(*) AS trades,

SUM(
CASE
WHEN pnl > 0
THEN 1
ELSE 0
END
) AS wins,

SUM(
CASE
WHEN pnl <= 0
THEN 1
ELSE 0
END
) AS losses,

ROUND(
AVG(
NULLIF(pnl::text,'NaN')::numeric
),
2
) AS avg_pnl,

ROUND(
MAX(
NULLIF(pnl::text,'NaN')::numeric
),
2
) AS best_trade,

ROUND(
MIN(
NULLIF(pnl::text,'NaN')::numeric
),
2
) AS worst_trade,

ROUND(
100.0 *
SUM(
CASE
WHEN pnl > 0
THEN 1
ELSE 0
END
)
/COUNT(*),
2
) AS win_rate

FROM positions

WHERE status = 'CLOSED'

GROUP BY

symbol,
side,
trend,
regime

HAVING COUNT(*) >= 5

ORDER BY

win_rate DESC,
avg_pnl DESC;
        `);

      res.json({

        strategies:
          result.rows,
      });
    
    } catch (err) {

      console.error(
        "Strategy analytics error:",
        err.message
      );

      res.status(500).json({

        error:
          err.message,
      });
    }
  }
);

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
    await updateReinforcementMemory();
    // ==========================================
// AI SYMBOL SELECTION
// ==========================================

const rankings =
  await getBestSymbols();
    const discoveries =
  await getDiscoveryCandidates();

    // ==========================================
// DISCOVERY SCORE FILTER
// ==========================================

const qualifiedDiscoveries =

(discoveries || [])

.filter(coin => {

    if (!coin) {

        return false;

    }

    if (coin.quoteVolume < 1000000) {

        return false;

    }

    if (coin.symbolScore < 60) {

        return false;

    }

    if (

        coin.classification === "DISABLE" ||

        coin.classification === "SUPPRESS"

    ) {

        return false;

    }

    return true;

})

.sort(

    (a, b) =>

        (b.symbolScore + b.score) -

        (a.symbolScore + a.score)

)

.slice(0, 20);

console.log(`
==================================
DISCOVERY SUMMARY
==================================

Total:
${discoveries.length}

Qualified:
${qualifiedDiscoveries.length}

==================================
`);
    
console.log(`
==================================
RAW DISCOVERIES
==================================

Count:
${discoveries.length}

Data:
${JSON.stringify(discoveries, null, 2)}

==================================
`);



const evaluatedDiscoveries =
  await evaluateDiscoveryCandidates(
    qualifiedDiscoveries
  );

console.log(`
==================================
EVALUATED DISCOVERIES
==================================

Count:
${evaluatedDiscoveries.length}

Data:
${JSON.stringify(
  evaluatedDiscoveries,
  null,
  2
)}

==================================
`);

let symbols = [];

const rankingSymbols =
  rankings || [];

const discoverySymbols =
  evaluatedDiscoveries.map(
    item => item.symbol
  );

symbols = [

  ...new Set([

    ...rankingSymbols,

    ...discoverySymbols

  ])

]
.filter(Boolean)
.slice(0, 40);

    console.log(`
==================================
FINAL TRADING UNIVERSE
==================================

${JSON.stringify(symbols, null, 2)}

==================================
`);

    
symbols = symbols.filter(symbol => {

  if (!symbol) {
    return false;
  }

  if (
    [
      "BTCUSDT",
      "SOLUSDT"
    ].includes(symbol)
  ) {
    return false;
  }

  return true;

});

    console.log(`
==================================
FINAL TRADING UNIVERSE
==================================

Total Symbols:
${symbols.length}

${symbols.join(", ")}

==================================
`);
    
    console.log(`
==================================
DISCOVERY INTEGRATION
==================================

Rankings:
${rankingSymbols.length}

Discoveries:
${discoverySymbols.length}

Final Symbols:
${symbols.length}

==================================
`);
    
console.log(
  "DIRECT ASSIGNMENT WORKING:",
  symbols
);
console.log(
  "SYMBOLS DEBUG:",
  JSON.stringify(
    symbols,
    null,
    2
  )
);

if (
  symbols.length === 0
) {

  symbols = [
    "DOGEUSDT"
  ];
}

console.log(`
==================================
FINAL SYMBOL LIST
==================================

${JSON.stringify(symbols, null, 2)}

==================================
`);

console.log(`
==================================
RANKING SYMBOLS
==================================

${JSON.stringify(rankingSymbols, null, 2)}

==================================
`);

console.log(`
==================================
DISCOVERY SYMBOLS
==================================

${JSON.stringify(discoverySymbols, null, 2)}

==================================
`);

for (
  const randomSymbol of symbols
) {
console.log(`
==================================
SYMBOL SELECTION
==================================

Ranked Symbols:
${rankings.length}

Qualified Discoveries:
${qualifiedDiscoveries.length}

Trading Symbols:
${symbols.length}

==================================
`);
  console.log(
    "PROCESSING SYMBOL:",
    randomSymbol
  );
// ==========================================
// DUPLICATE POSITION CHECK
// ==========================================

const existingPosition =
  await pool.query(
    `
    SELECT id
    FROM positions
    WHERE symbol = $1
      AND status = 'OPEN'
    LIMIT 1
    `,
    [randomSymbol]
  );

if (
  existingPosition.rows.length > 0
) {

  console.log(`
==================================
POSITION ALREADY OPEN
==================================

Symbol:
${randomSymbol}

==================================
`);

  continue;

}
  await new Promise(
    resolve =>
      setTimeout(
        resolve,
        1500
      )
  );

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

    continue;
  }

  /*
  ==================================================
  PHASE 2 FEATURE ENGINE
  ==================================================
  */

  const phase2Features =
    await generateFeatures(
      randomSymbol
    );

  if (!phase2Features) {

    console.log(`
==================================
FEATURE ENGINE FAILED
==================================

Symbol:
${randomSymbol}

==================================
`);

    continue;
  }

  console.log(`
==================================
PHASE 2 FEATURES GENERATED
==================================

Symbol:
${randomSymbol}

Decision:
${phase2Features.decision}

Confidence:
${phase2Features.confidence}

Market State:
${phase2Features.marketState}

==================================
`);
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

    const macdData =
  calculateMACD(closes);

const macd =
  macdData.macd;

    const trend =
      detectTrend(closes);

    const regime =
      detectMarketRegime(closes);
// ==========================================
// MULTI TIMEFRAME ANALYSIS
// ==========================================

const multiTf =
  await getMultiTimeframeAnalysis(
    randomSymbol
  );

  // ==========================================
// OPPORTUNITY FILTER
// ==========================================

if (

  multiTf.alignmentScore < 65

) {

  console.log(`
==================================
SYMBOL FILTERED
==================================

Symbol:
${randomSymbol}

Reason:
Weak Multi-Timeframe Alignment

Alignment:
${multiTf.alignmentScore}

==================================
`);

  continue;

}
  
console.log(`
==================================
MULTI TIMEFRAME ANALYSIS
==================================

15m:
${multiTf.trend15m}

1h:
${multiTf.trend1h}

4h:
${multiTf.trend4h}

Overall:
${multiTf.overallTrend}

==================================
`);
    if (!rsi) {

      console.log(
        `RSI unavailable for ${randomSymbol}`
      );

      continue;
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
const volatilityRegime =
  volatility > 5
    ? "HIGH"
    : volatility > 2
    ? "MEDIUM"
    : "LOW";

const momentumState =
  macd > 0
    ? "BULLISH_ACCELERATION"
    : "BEARISH_ACCELERATION";
    // ==========================================
    // SKIP LOW VOLATILITY
    // ==========================================

    if (volatility < 0.4) {

      console.log(
        `${randomSymbol} volatility too low`
      );

      continue;
    }

// ==========================================
// SYMBOL PERFORMANCE
// ==========================================

const avgSymbolPnL = 0;
const discoveryData =
    qualifiedDiscoveries.find(
        coin => coin.symbol === randomSymbol
    ) || {};
  // ==========================================
// OPPORTUNITY INTELLIGENCE V2
// ==========================================
const discoveryData =
    qualifiedDiscoveries.find(
        coin => coin.symbol === randomSymbol
    ) || {};
  
const opportunity =
  evaluateOpportunity({

    symbol: randomSymbol,

    quoteVolume:
      Number(discoveryData.quoteVolume || 0),

    priceChange:
      Number(
        discoveryData.priceChange ||
        discoveryData.priceChangePercent ||
        0
      ),

    trades:
      Number(
        discoveryData.count ||
        discoveryData.tradeCount ||
        discoveryData.trades ||
        0
      ),

  });

  const ranking =
    rankings.find(
        item => item.symbol === randomSymbol
    ) || {};
  
const fusion =
  fuseOpportunity({

    opportunity,

    symbolScore:
      ranking?.score || 50,

    confidence: 50,

    reinforcement: 50,

    discovery: 50,

    portfolio: 50,

});

const prediction =
  predictOpportunity({

    fusionScore:
      fusion.finalScore,

    liquidity:
      opportunity.liquidity,

    momentum:
      opportunity.momentum,

    volatility:
      opportunity.volatility,

    confidence: 50,

    discovery: 50,

    reinforcement: 50,

    trend,

});
  
// ==========================================
// AI CONFIDENCE
// ==========================================

const confidenceData =
  await calculateConfidence({

    rsi,

    trend,

    regime,

    volatilityRegime,

    momentumState,

    momentumStrength:
      Math.min(
        100,
        Math.abs(macd) * 10
      ),

    opportunityScore:
  opportunity.opportunityScore,

fusionScore:
  fusion.finalScore,
    
    alignmentScore:
      multiTf?.alignmentScore,

    overallTrend:
      multiTf?.overallTrend,

    marketState:
      phase2Features?.marketState ||
      "SIDEWAYS",

    decision:
      phase2Features?.decision ||
      "HOLD",
  });

let confidence =
  Number(
    confidenceData?.confidence || 50
  );

  console.log(`
==================================
OPPORTUNITY AI
==================================

Opportunity Score:
${opportunity.opportunityScore}

Fusion Score:
${fusion.finalScore}

Prediction:
${prediction.probability}

Should Trade:
${prediction.shouldTrade}

==================================
`);
  
 // ==========================================
// CONFIDENCE VALIDATION
// ==========================================

if (
  !Number.isFinite(confidence)
) {

  console.log(`
==================================
INVALID CONFIDENCE
==================================

Symbol:
${randomSymbol}

==================================
`);

  continue;

}
// ==========================================
// ML PREDICTION
// ==========================================

const mlProbability =
  predictTrade({

    rsi,

    macd,

    volatility,

    confidence,

    trend,

    regime,
  });

const mlConfidence =
  mlProbability * 100;

// ==========================================
// COMBINE RULES + ML
// ==========================================

confidence =
  (
    confidence * 0.9
  ) +
  (
    mlConfidence * 0.1
  );
// ==========================================
// MULTI TF CONFIDENCE BOOST
// ==========================================

if (

  multiTf.overallTrend ===
  trend

) {

  confidence += 10;
}

else {

  confidence -= 5;
}


// ==========================================
// SYMBOL WEIGHTING
// ==========================================

const symbolWeightData =
  await getAdaptiveSymbolWeights();

const symbolEntry =
  symbolWeightData?.rankings?.find(
    s => s.symbol === randomSymbol
  );

const symbolWeight =
  Number(
    symbolEntry?.weight || 1
  );
// ==========================================
// SYMBOL SUPPRESSION
// ==========================================

if (
  symbolWeight <= 0.10
) {

  console.log(`
==================================
SYMBOL SUPPRESSED
==================================

Symbol:
${randomSymbol}

Weight:
${symbolWeight}

==================================
`);

  continue;
}
confidence =
  Number(
    confidence || 0
  ) *
  (
    0.5 +
    (
      Number(symbolWeight || 1)
      * 0.5
    )
  );

confidence =
  Number(
    confidence.toFixed(2)
  );
console.log(`
==================================
CONFIDENCE BEFORE WEIGHTING
==================================

Confidence:
${confidence}

==================================
`);
console.log(`
==================================
SYMBOL WEIGHTING
==================================

Symbol:
${randomSymbol}

Weight:
${symbolWeight}

Adjusted Confidence:
${confidence.toFixed(2)}

==================================
`);

// ==========================================
// DRAWDOWN STATE
// ==========================================

const drawdownStats =
  await getDrawdownStats(pool);

const drawdownState =
  getDrawdownState({

    currentEquity:
      drawdownStats.equity,

    peakEquity:
      drawdownStats.peakEquity,

});
  
if (
  !drawdownState.allowTrading
) {

  console.log(`
==================================
DRAWDOWN LOCKDOWN
==================================

Trading Disabled

==================================
`);

  continue;
}

// ==========================================
// DRAWDOWN RISK MODES
// ==========================================

if (
  drawdownState.riskMode ===
  "CAUTION"
) {

  confidence -= 5;
}

if (
  drawdownState.riskMode ===
  "DEFENSIVE"
) {

  confidence -= 10;
}

if (
  drawdownState.riskMode ===
  "CAPITAL_PRESERVATION"
) {

  confidence -= 20;
}

   // ==========================================
// ADAPTIVE THRESHOLD
// ==========================================
console.log("DEBUG VOL REG:", volatilityRegime);
console.log("DEBUG MOMENTUM:", momentumState);
const adaptiveThresholdResult =
  await getAdaptiveThreshold({

    regime,

    volatilityRegime,

    trend,

    momentumState,

    performanceScore: 0,
  });

const adaptiveThresholdValue =
  Number(
    adaptiveThresholdResult?.threshold || 65
  );
// ==========================================
// SELF OPTIMIZATION
// ==========================================

const optimization =
  await getOptimizationAdjustments(
    pool
  );
console.log(`
==================================
CONFIDENCE CHECK
==================================

Confidence Before Optimization:
${confidence}

ML Confidence:
${mlConfidence}

==================================
`);

// ==========================================
// SELF OPTIMIZER
// ==========================================

confidence *=
  optimization.confidenceMultiplier;
// ==========================================
// OPTIMIZED THRESHOLD
// ==========================================

const optimizedThreshold =
  adaptiveThresholdValue +
  optimization.thresholdAdjustment;

console.log(`
==================================
SELF OPTIMIZER
==================================

Avg Reward:
${Number(
  optimization.avgReward || 0
).toFixed(2)}

Threshold Adjustment:
${optimization.thresholdAdjustment}

Confidence Multiplier:
${optimization.confidenceMultiplier.toFixed(2)}

==================================
`);

console.log(`
==================================
ADAPTIVE THRESHOLD
==================================

Threshold:
${optimizedThreshold}

==================================
`);

// ==========================================
// REINFORCEMENT MEMORY
// ==========================================

const reinforcementContextKey =

  `${randomSymbol}_` +

  `${trend}_` +

  `${regime}_` +

  `${volatilityRegime || "NORMAL"}_` +

  `${momentumState || "NEUTRAL"}_` +

  `${multiTf?.overallTrend || trend}`;

const reinforcementLookupResult =
  await pool.query(
    `
    SELECT avg_reward
    FROM reinforcement_memory
    WHERE context_key = $1
    LIMIT 1
    `,
    [reinforcementContextKey]
  );

console.log(`
==================================
REINFORCEMENT LOOKUP
==================================

Context:
${reinforcementContextKey}

Matches:
${reinforcementLookupResult.rows.length}

==================================
`);

if (
  reinforcementLookupResult.rows.length > 0
) {

  const reinforcementReward =
    Number(
      reinforcementLookupResult.rows[0]
        .avg_reward || 0
    );
if (
  reinforcementReward < -0.40
) {

  console.log(`
==================================
RL SUPPRESSED
==================================

Context:
${reinforcementContextKey}

Reward:
${reinforcementReward}

==================================
`);

  continue;
}
  confidence +=
    reinforcementReward * 25;

  console.log(`
==================================
REINFORCEMENT ADJUSTMENT
==================================

Context:
${reinforcementContextKey}

Avg Reward:
${reinforcementReward}

Confidence After RL:
${confidence}

==================================
`);

  // ==========================================
  // REINFORCEMENT TRADE FILTER
  // ==========================================

  if (
    reinforcementReward < -0.40
  ) {

    console.log(`
==================================
RL BLOCKED TRADE
==================================

Context:
${reinforcementContextKey}

Avg Reward:
${reinforcementReward}

==================================
`);

    confidence = 0;
  }
}

// ==========================================
// FINAL CONFIDENCE FLOOR
// ==========================================

confidence =
  Math.max(
    confidence,
    35
  );

// ==========================================
// FINAL CLAMP
// ==========================================

confidence =
  Math.max(
    20,
    Math.min(
      confidence,
      95
    )
  );

console.log(`
==================================
FINAL CONFIDENCE
==================================

Confidence:
${confidence}

Threshold:
${optimizedThreshold}

==================================
`);

console.log(`
==================================
ML PREDICTION
==================================

ML Probability:
${mlConfidence.toFixed(2)}

Final Confidence:
${confidence.toFixed(2)}

==================================
`);

// ==========================================
// PROBABILISTIC SIGNAL ENGINE
// ==========================================

const signalScores =
  await calculateSignalScores({

    rsi,

    macd,

    trend,

    regime,

    multiTf,

    volatilityRegime,

    momentumState,
  });

console.log(`
==================================
SIGNAL THRESHOLD DEBUG
==================================

Buy Score:
${signalScores.buyScore}

Sell Score:
${signalScores.sellScore}

Required:
35

Buy Pass:
${signalScores.buyScore >= 35}

Sell Pass:
${signalScores.sellScore >= 35}

==================================
`);

 
let side = "HOLD";

if (

  signalScores.buyScore >
    signalScores.sellScore &&

  signalScores.buyScore >= 30
) {

  side = "BUY";
}

else if (

  signalScores.sellScore >
    signalScores.buyScore &&

  signalScores.sellScore >= 30
) {

  side = "SELL";
}

console.log(`
==================================
PROBABILISTIC SIGNAL ENGINE
==================================

Buy Score:
${signalScores.buyScore}

Sell Score:
${signalScores.sellScore}

Decision:
${side}

==================================
`);

const strategyResult =
  await getAdaptiveWeights({

    regime,
    trend,
    volatilityRegime,
    momentumState,
    decision: side,
  });

console.log(`
==================================
ADAPTIVE WEIGHT RESULT
==================================

${JSON.stringify(strategyResult, null, 2)}

==================================
`);

const classification =
  strategyResult?.classification ||
  "NEUTRAL";

console.log(`
==================================
STRATEGY CLASSIFICATION
==================================

Classification:
${classification}

==================================
`);

// ==========================================
// TRADE QUALITY
// ==========================================

const tradeQuality =
  calculateTradeQuality({

    confidence,
    regime,
    trend,
    volatility,
    multiTf,
  });

  // ==========================================
// FINAL TRADE VALIDATION
// ==========================================

if (
  !Number.isFinite(tradeQuality)
) {

  console.log(`
==================================
INVALID TRADE QUALITY
==================================

Symbol:
${randomSymbol}

==================================
`);

  continue;

}

if (
  tradeQuality < 75
) {

  console.log(`
==================================
TRADE REJECTED
==================================

Symbol:
${randomSymbol}

Trade Quality:
${tradeQuality}

==================================
`);

  continue;

}
  
console.log(`
==================================
TRADE QUALITY
==================================

Quality Score:
${tradeQuality}

==================================
`);


// ==========================================
// FINAL SAFETY CHECK
// ==========================================

if (

  confidence < 75 &&

  tradeQuality < 80

) {

  console.log(`
==================================
LOW QUALITY SETUP
==================================

Symbol:
${randomSymbol}

Confidence:
${confidence}

Trade Quality:
${tradeQuality}

==================================
`);

  continue;

}
  
   // ==========================================
// DECISION EXPLANATION
// ==========================================

const decisionReasons =
  explainDecision({

    side,

    confidence,

    threshold:
      adaptiveThresholdValue,

    volatility,

    trend,

    regime,

    tradeQuality,

    multiTf,
  });
console.log(`
==================================
AI DECISION REASONING
==================================

${decisionReasons.join("\n")}

==================================
`);
   
    // ==========================================
    // SKIP HOLD / LOW CONFIDENCE
    // ==========================================

    if (
  side === "HOLD"
){

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

      continue;
    }
// ==========================================
// CONFIDENCE FILTER
// ==========================================

let executionThreshold =
  Math.max(
    adaptiveThresholdValue,
    75
  );

// ==========================================
// HIGH QUALITY SETUPS
// ==========================================

if (

  multiTf.alignmentScore >= 100 &&

  tradeQuality >= 90 &&

  confidence >= 85

) {

  executionThreshold =

    Math.max(

      70,

      executionThreshold - 5

    );

}
console.log(`
==================================
FINAL TRADE GATE
==================================

Symbol:
${randomSymbol}

Confidence:
${confidence}

Execution Threshold:
${executionThreshold}

Trade Quality:
${tradeQuality}

Alignment:
${multiTf.alignmentScore}

==================================
`);
if (

  !drawdownState.allowTrading

) {

  console.log(`
==================================
TRADING PAUSED
==================================

Risk Mode:
${drawdownState.riskMode}

==================================
`);

  continue;

}

if (

  confidence <

  executionThreshold

) {

  console.log(`
==================================
CONFIDENCE FILTER
==================================

Symbol:
${randomSymbol}

Confidence:
${confidence}

Threshold:
${executionThreshold}

==================================
`);

  continue;

} 

// ==========================================
// QUALITY FILTER
// ==========================================

if (
  tradeQuality < 70
) {

  console.log(`
==================================
QUALITY FILTER
==================================

Trade Quality:
${tradeQuality}

Minimum:
60

==================================
`);

  continue;
}
   // ==========================================
// ACCOUNT STATUS
// ==========================================

const account =
  await getAccountStats(pool);

   
console.log(`
==================================
ACCOUNT STATUS
==================================

Equity:
${account.equity}

Available Capital:
${account.availableCapital}

Used Capital:
${account.usedCapital}

Realized PnL:
${account.realizedPnL}

Unrealized PnL:
${account.unrealizedPnL}

==================================
`);
   
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
${portfolio.totalExposure ??
  portfolio.usedCapital ??
  0}

Can Trade:
${portfolio.canTrade}

==================================
`);

if (!portfolio.canTrade) {

  console.log(
    "Portfolio risk limit reached"
  );

  continue;
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

  continue;
}
    
    
    // ==========================================
    // LIVE PRICE
    // ==========================================

   const livePrice =
  await getPrice(
    randomSymbol
  );

if (

  !Number.isFinite(livePrice) ||

  livePrice <= 0

) {

  console.log(`
==================================
INVALID LIVE PRICE
==================================

Symbol:
${randomSymbol}

Price:
${livePrice}

==================================
`);

  continue;

}

const openPositionCheck =
await pool.query(
`
SELECT id, side
FROM positions
WHERE symbol = $1
AND status = 'OPEN'
LIMIT 1
`,
[randomSymbol]
);

if (
  openPositionCheck.rows.length > 0
) {

  console.log(`
==================================
POSITION ALREADY OPEN
==================================

Symbol:
${randomSymbol}

Existing Side:
${openPositionCheck.rows[0].side}

Requested Side:
${side}

==================================
`);

  continue;
}

console.log(`
==================================
REACHED EXECUTION SECTION
==================================

Symbol:
${randomSymbol}

Side:
${side}

Confidence:
${confidence}

Threshold:
${adaptiveThresholdValue}

Quality:
${tradeQuality}

==================================
`);

if (
  classification === "SUPPRESS"
) {

  console.log(`
==================================
STRATEGY SUPPRESSED
==================================

Symbol:
${randomSymbol}

Classification:
${classification}

Skipping Trade

==================================
`);

  continue;
}
  // ==========================================
// PHASE 2 RISK ENGINE
// ==========================================

const balance =
  account.availableCapital;

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

const sizingResult =
  calculatePositionSize({

    confidence,

    volatilityRegime:
      volatility > 5
        ? "HIGH"
        : volatility > 2
        ? "MEDIUM"
        : "LOW",

    signalQuality:
      tradeQuality >= 80
        ? "HIGH"
        : tradeQuality >= 60
        ? "MEDIUM"
        : "LOW",

    explorationTrade: false,
  });

let positionSize =
  Number(
    sizingResult
      ?.recommendedPositionSize || 1
  );

// ==========================================
// ADAPTIVE SIZE MULTIPLIER
// ==========================================

const sizeMultiplier = 1;

positionSize =
  positionSize *
  sizeMultiplier;
if (

  !Number.isFinite(positionSize) ||

  positionSize <= 0

) {

  console.log(`
==================================
INVALID POSITION SIZE
==================================

Symbol:
${randomSymbol}

Position Size:
${positionSize}

==================================
`);

  continue;

}
console.log(`
==================================
FINAL POSITION SIZE
==================================

Base Size:
${(
  positionSize /
  sizeMultiplier
).toFixed(4)}

Multiplier:
${sizeMultiplier}

Final Size:
${positionSize.toFixed(4)}

==================================
`);
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
// SAVE DECISION MEMORY
// ==========================================

await saveDecisionMemory({

  pool,

  side,

  trend,

  regime,

  quality:
    tradeQuality,

  confidence,

  volatility,

  multiTf,

  pnl: 0,
});


// ==========================================
// TRADE VALIDATION
// ==========================================

const invalidTrade =

  isNaN(confidence) ||

  isNaN(entryPrice) ||

  isNaN(stopLoss) ||

  isNaN(takeProfit) ||

  isNaN(adjustedPositionSize) ||

  confidence <= 0 ||

  entryPrice <= 0 ||

  stopLoss <= 0 ||

  takeProfit <= 0 ||

  adjustedPositionSize <= 0;

if (invalidTrade) {

  console.log(`
==================================
INVALID TRADE BLOCKED
==================================

Symbol:
${randomSymbol}

Confidence:
${confidence}

Entry:
${entryPrice}

Stop Loss:
${stopLoss}

Take Profit:
${takeProfit}

Position Size:
${adjustedPositionSize}

==================================
`);

  continue;
}
   
/*
==================================================
PHASE 2 LEARNING MODE
ALLOW DUPLICATE EXPLORATION POSITIONS
==================================================
*/

  console.log(`
==================================
FINAL EXECUTION CHECK
==================================

Symbol:
${randomSymbol}

Side:
${side}

Entry Price:
${entryPrice}

Confidence:
${confidence}

Trade Quality:
${tradeQuality}

Execution Threshold:
${executionThreshold}

Stop Loss:
${stopLoss}

Take Profit:
${takeProfit}

Position Size:
${adjustedPositionSize}

Trend:
${trend}

Regime:
${regime}

Volatility:
${volatility}

==================================
`);
await pool.query(
  `
   INSERT INTO positions
  (
  symbol,
  side,
  confidence,
  volatility,
  macd,
  trend,
  regime,
  entry_price,
  stop_loss,
  take_profit,
  position_size,
  pnl,
  volatility_regime,
momentum_state,
overall_trend
)
  VALUES
  ($1,$2,$3,$4,$5,
  $6,$7,$8,$9,$10,
  $11,$12,$13,$14,$15)
  `,
 [
  randomSymbol,
  side,
  confidence,
  volatility,
  macd,
  trend,
  regime,
  entryPrice,
  stopLoss,
  takeProfit,
  adjustedPositionSize,
  0,
  volatilityRegime,
  momentumState,
  multiTf?.overallTrend || trend
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
  entryPrice,
  entryPrice,
  0,
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
    }
  } catch (err) {

  console.log(`
==================================
FULL ENGINE ERROR
==================================
`);

  console.log(err);

  console.log(err.stack);

  console.log(`
==================================
`);
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
    60000
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
// ==========================================
// INITIAL ML TRAINING
// ==========================================

try {

  const data =
    await getTrainingData(pool);

  trainModel(data);

  console.log(
    "Initial ML model loaded"
  );

} catch (err) {

  console.log(
    "ML startup training skipped"
  );
}
 /*
==================================================
TRAIN MODEL
==================================================
*/

app.get(
  "/train-model",

  async (req, res) => {

    try {

      const data =
        await getTrainingData(pool);

      const model =
        trainModel(data);

      res.json({

        success: true,

        samples:
          data.length,

        message:
          "ML model trained",
      });

    } catch (error) {

      res.status(500).json({

        error:
          error.message,
      });
    }
  }
);

 /*
==================================================
ML ANALYTICS
==================================================
*/

app.get(
  "/ml-analytics",

  async (req, res) => {

    try {

      const analytics =
        await getModelAnalytics(pool);

      res.json(analytics);

    } catch (error) {

      res.status(500).json({

        error:
          error.message,
      });
    }
  }
);
 /*
==================================================
SYMBOL MEMORY
==================================================
*/

app.get(
  "/symbol-memory",

  async (req, res) => {

    try {

      const memory =
        await getSymbolMemory(pool);

      res.json(memory);

    } catch (error) {

      res.status(500).json({

        error:
          error.message,
      });
    }
  }
);
 /*
==================================================
REGIME MEMORY
==================================================
*/

app.get(
  "/regime-memory",

  async (req, res) => {

    try {

      const memory =
        await getRegimeMemory(pool);

      res.json(memory);

    } catch (error) {

      res.status(500).json({

        error:
          error.message,
      });
    }
  }
);
 /*
==================================================
CONFIDENCE CALIBRATION
==================================================
*/

app.get(
  "/confidence-calibration",

  async (req, res) => {

    try {

      const calibration =
        await getConfidenceCalibration(pool);

      res.json(calibration);

    } catch (error) {

      res.status(500).json({

        error:
          error.message,
      });
    }
  }
);

 /*
==================================================
BACKTEST ENGINE
==================================================
*/

app.get(
  "/backtest",

  async (req, res) => {

    try {

      const result =
        await runBacktest({

          symbol:
            req.query.symbol ||
            "BTCUSDT",

          interval:
            req.query.interval ||
            "15m",

          limit:
            Number(
              req.query.limit || 300
            ),
        });

      res.json(result);

    } catch (error) {

      res.status(500).json({

        error:
          error.message,
      });
    }
  }
);

 /*
==================================================
DECISION MEMORY
==================================================
*/

app.get(
  "/decision-memory",

  async (req, res) => {

    try {

      const memory =
        await getDecisionMemory(pool);

      res.json(memory);

    } catch (error) {

      res.status(500).json({

        error:
          error.message,
      });
    }
  }
);

 /*
==================================================
REINFORCEMENT MEMORY
==================================================
*/

app.get(
  "/reinforcement-memory",

  async (req, res) => {

    try {

      const result =
        await pool.query(`
          SELECT
            pattern,

            COUNT(*) AS trades,

            AVG(reward) AS avg_reward,

            AVG(pnl) AS avg_pnl

          FROM reinforcement_memory

          GROUP BY pattern

          ORDER BY avg_reward DESC
        `);

      res.json(
        result.rows
      );

    } catch (error) {

      res.status(500).json({

        error:
          error.message,
      });
    }
  }
);

  /*
==================================================
INDICATOR TEST
==================================================
*/

app.get(
  "/indicator-test",
  async (req, res) => {

    try {

      const closes = [

        100,
        101,
        102,
        103,
        104,
        105,
        106,
        107,
        108,
        109,
        110,
        111,
        112,
        113,
        114,
        115,
        116,
        117,
        118,
        119,
      ];

      const rsi =
        calculateRSI(
          closes
        );

      const ema =
        calculateEMA(
          closes
        );

      res.json({

        success: true,

        indicators: {

          rsi,

          ema,
        },
      });

    } catch (err) {

      res.status(500).json({

        error:
          err.message,
      });
    }
  }
);

  /*
==================================================
RECENT MARKET CANDLES
==================================================
*/

app.get(
  "/recent-candles",
  async (req, res) => {

    try {

      const result =
        await pool.query(

          `
          SELECT *
          FROM market_candles
          ORDER BY id DESC
          LIMIT 20
          `
        );

      res.json({

        success: true,

        candles:
          result.rows,
      });

    } catch (err) {

      res.status(500).json({

        error:
          err.message,
      });
    }
  }
);

  /*
==================================================
FEATURE ENGINE TEST
==================================================
*/

app.get(
  "/features/:symbol",
  async (req, res) => {

    try {

      const symbol =
        req.params.symbol;

     const features =
  await generateFeatures(
    symbol
  );
// ==========================================
// FEATURE VALIDATION
// ==========================================

if (
  !features ||
  Object.keys(features).length === 0
) {

  return res.status(400).json({

    success: false,

    error: "Feature generation failed"

  });

}

if (

  !Number.isFinite(features.rsi) ||

  !Number.isFinite(features.emaFast) ||

  !Number.isFinite(features.emaSlow)

) {

  return res.status(400).json({

    success: false,

    error: "Invalid feature data"

  });

}
      res.json({

        success: true,

        features,
      });

    } catch (err) {

      res.status(500).json({

        error:
          err.message,
      });
    }
  }
);
  /*
==================================================
TRADE MEMORY
==================================================
*/

app.get(
  "/trade-history",
  async (req, res) => {

    try {

      const result =
  await pool.query(`
    SELECT *
    FROM trade_history
    LIMIT 5
  `);

      res.json({
        success: true,
        trades: result.rows,
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
);

  /*
==================================================
OUTCOME TRACKING ENGINE
==================================================
*/

setInterval(async () => {

  /*
  ==================================================
  UPDATE TRADE OUTCOMES
  ==================================================
  */

  await updateTradeOutcomes();

  /*
  ==================================================
  UPDATE SIGNAL OUTCOMES
  ==================================================
  */

  await updateSignalOutcomes();

}, 30000);
  /*
==================================================
TRADE OUTCOMES
==================================================
*/

app.get(
  "/trade-outcomes",
  async (req, res) => {

    try {

      const result =
        await pool.query(

          `
          SELECT *
          FROM trade_history
          ORDER BY id DESC
          LIMIT 20
          `
        );

      res.json({

        success: true,

        trades:
          result.rows,
      });

    } catch (err) {

      res.status(500).json({

        error:
          err.message,
      });
    }
  }
);

  /*
==================================================
STRATEGY ANALYTICS
==================================================
*/

app.get(
  "/strategy-analytics",
  async (req, res) => {

    try {

      const analytics =
        await generateStrategyAnalytics();

      res.json({

        success: true,

        analytics,
      });

    } catch (err) {

      res.status(500).json({

        error:
          err.message,
      });
    }
  }
);

  /*
==================================================
ML TRAINING DATASET
==================================================
*/

app.get(
  "/ml-dataset",
  async (req, res) => {

    try {

      const dataset =
        await buildTrainingDataset();

      res.json({

        success: true,

        samples:
          dataset.length,

        dataset,
      });

    } catch (err) {

      res.status(500).json({

        error:
          err.message,
      });
    }
  }
);
  /*
==================================================
FEATURE IMPORTANCE ANALYTICS
==================================================
*/

app.get(
  "/feature-importance",
  async (req, res) => {

    try {

      const result =
        await calculateFeatureImportance();

      res.json(result);

    } catch (err) {

      res.status(500).json({

        success: false,

        error:
          err.message,
      });
    }
  }
);

  /*
==================================================
REGIME ANALYTICS
==================================================
*/

app.get(
  "/regime-analytics",
  async (req, res) => {

    try {

      const result =
        await calculateRegimeAnalytics();

      res.json(result);

    } catch (err) {

      res.status(500).json({

        success: false,

        error:
          err.message,
      });
    }
  }
);
/*
==================================================
SIGNAL MEMORY
==================================================
*/

app.get(
  "/signal-memory",
  async (req, res) => {

    try {

      const result =
        await pool.query(

          `
          SELECT *

          FROM signal_memory

          ORDER BY id DESC

          LIMIT 50
          `
        );

      res.json({

        success: true,

        signals:
          result.rows,
      });

    } catch (err) {

      res.status(500).json({

        success: false,

        error:
          err.message,
      });
    }
  }
);

  /*
==================================================
FEATURE IMPORTANCE V2
==================================================
*/

app.get(
  "/feature-importance-v2",
  async (req, res) => {

    try {

      const report =
        await analyzeFeatureImportance();

      res.json(report);

    } catch (err) {

      res.status(500).json({

        success: false,

        error:
          err.message,
      });
    }
  }
);

  /*
==================================================
TRADE HISTORY DEBUG
==================================================
*/

app.get(
  "/trade-history-debug",
  async (req, res) => {

    try {

      const result =
        await pool.query(

          `
          SELECT

            id,
            symbol,
            decision,
            entry_price,
            pnl,
            outcome,
            created_at,
            closed_at

          FROM trade_history

          ORDER BY id DESC

          LIMIT 50
          `
        );

      res.json({

        success: true,

        trades:
          result.rows,
      });

    } catch (err) {

      res.status(500).json({

        success: false,

        error:
          err.message,
      });
    }
  }
);

  /*
==================================================
SYMBOL RANKINGS
==================================================
*/

app.get(
  "/symbol-rankings",
  async (req, res) => {
    try {

      const result =
        await generateSymbolRankings();

      res.json(result);

    } catch (err) {

      res.status(500).json({
        error: err.message,
      });

    }
  }
);

app.get(
  "/portfolio-status",
  async (req, res) => {

    try {

      const portfolio =
        await getPortfolioStats(pool);

      res.json({

        success: true,

        portfolio,

      });

    } catch (err) {

      res.status(500).json({

        success: false,

        error: err.message,

      });

    }

  }
);

// ==========================================
// PORTFOLIO DEBUG
// ==========================================

app.get("/portfolio-debug", async (req, res) => {

  try {

    const pnl = await pool.query(`
      SELECT
        COUNT(*) AS trades,
        SUM(pnl) AS total_pnl,
        AVG(pnl) AS avg_pnl,
        MIN(pnl) AS worst_trade,
        MAX(pnl) AS best_trade
      FROM positions
      WHERE status = 'CLOSED'
    `);

    res.json({
      success: true,
      debug: pnl.rows[0]
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }

});

 app.get(
  "/discovery",
  async (req, res) => {

    try {

      const marketData =
        await getMarketScanner();

      const discoveries =
        rankDiscoveries(
          marketData
        );

      res.json({

        count:
          discoveries.length,

        discoveries,
      });

    } catch (err) {

      res.status(500).json({

        error:
          err.message,
      });
    }
  }
);
  app.get(
  "/discovery-candidates",
  async (req, res) => {

    const discoveries =
  await getDiscoveryCandidates(
    pool
  );

    res.json({
      count:
        candidates.length,
      candidates,
    });
  }
);
  app.get(
  "/discovery-ai",
  async (req, res) => {

    try {

      const candidates =
        await getDiscoveryCandidates();

      const evaluated =
        await evaluateDiscoveryCandidates(
          candidates
        );

      res.json({

        count:
          evaluated.length,

        evaluated,
      });

    } catch (err) {

      res.status(500).json({

        error:
          err.message,
      });
    }
  }
);
  app.get(
  "/debug-candles/:symbol",
  async (req, res) => {

    try {

      const result =
        await pool.query(
          `
          SELECT COUNT(*) AS count
          FROM market_candles
          WHERE symbol = $1
          `,
          [req.params.symbol]
        );

      res.json({
        symbol: req.params.symbol,
        candles: result.rows[0].count
      });

    } catch (err) {

      res.json({
        error: err.message
      });
    }
  }
);

  app.get("/candles-count", async (req, res) => {

  const result =
    await pool.query(`
      SELECT
        symbol,
        COUNT(*) as candles
      FROM market_candles
      GROUP BY symbol
      ORDER BY candles DESC
    `);

  res.json(result.rows);
});

// ==========================================
// DATABASE SCHEMA
// ==========================================

app.get("/database-schema", async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT
        table_name,
        column_name,
        data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `);

    res.json({
      success: true,
      schema: result.rows
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }

});
  
app.listen(PORT, () => {

  console.log(
    `🚀 Running on port ${PORT}`
  );

  // START LIVE MARKET ENGINE
  startBinanceWebsocket();
});
}
startServer();
