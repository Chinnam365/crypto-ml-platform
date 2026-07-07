const WebSocket = require("ws");
const {
  selectSymbols,
} = require("../ml/symbolSelector");
// ==========================================
// LIVE MARKET STORE
// ==========================================

const liveMarketData = {};

// ==========================================
// START WEBSOCKET
// ==========================================

async function startBinanceWebsocket(pool) {

    // ==========================================
    // LOAD AI-SELECTED SYMBOLS
    // ==========================================

    let symbols;

    try {

        symbols =
            await selectSymbols(pool);
      if (!Array.isArray(symbols) || symbols.length === 0) {

    throw new Error(
        "selectSymbols() returned no symbols"
    );

}
      
console.log(`
==================================
AI SYMBOL SUBSCRIPTIONS
==================================

${symbols.join("\n")}

==================================
`);
    } catch (err) {

    console.error(`
==================================
AI SYMBOL SELECTION FAILED
==================================

${err.stack}

==================================
`);

    console.log(
        "Using fallback symbols"
    );

        symbols = [
            "BTCUSDT",
            "ETHUSDT",
            "SOLUSDT",
            "LINKUSDT",
            "DOGEUSDT",
        ];

    }

    const streams =
        symbols
            .map(
                s => `${s.toLowerCase()}@kline_1m`
            )
            .join("/");

    const wsUrl =
        `wss://stream.binance.com:9443/stream?streams=${streams}`;

  console.log(
    "Starting Binance WebSocket..."
  );

  const {
  saveMarketCandle,
} = require("../db/saveMarketCandle");
  
  const ws =
    new WebSocket(wsUrl);

  ws.on(
    "open",
    () => {

      console.log(
        "Binance WebSocket Connected"
      );
    }
  );

  ws.on(
    "message",
    (message) => {

      try {

        const parsed =
          JSON.parse(message);

        const data =
          parsed.data;

        if (!data || !data.k)
          return;

        const candle =
          data.k;

        const symbol =
          candle.s;

        liveMarketData[symbol] = {

          symbol,

          open:
            Number(candle.o),

          high:
            Number(candle.h),

          low:
            Number(candle.l),

          close:
            Number(candle.c),

          volume:
            Number(candle.v),

          closed:
            candle.x,

          startTime:
            candle.t,

          closeTime:
            candle.T,
        };

        if (candle.x) {

  saveMarketCandle({

    symbol,

    open:
      Number(candle.o),

    high:
      Number(candle.h),

    low:
      Number(candle.l),

    close:
      Number(candle.c),

    volume:
      Number(candle.v),

    closeTime:
      candle.T,
  });
}
        
      } catch (err) {

        console.error(
          "WebSocket Parse Error:",
          err.message
        );
      }
    }
  );

  ws.on(
    "close",
    () => {

      console.log(
        "WebSocket Disconnected. Reconnecting..."
      );

      setTimeout(
    () => startBinanceWebsocket(pool),
    5000
);
    }
  );

  ws.on(
    "error",
    (err) => {

      console.error(
        "WebSocket Error:",
        err.message
      );
    }
  );
}

// ==========================================
// EXPORTS
// ==========================================

module.exports = {

  startBinanceWebsocket,

  liveMarketData,
};
