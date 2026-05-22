const WebSocket = require("ws");

// ==========================================
// SYMBOLS TO TRACK
// ==========================================

const symbols = [
  "btcusdt",
  "ethusdt",
  "solusdt",
  "linkusdt",
  "dogeusdt",
];

// ==========================================
// LIVE MARKET STORE
// ==========================================

const liveMarketData = {};

// ==========================================
// CREATE STREAM URL
// ==========================================

const streams = symbols
  .map(
    symbol =>
      `${symbol}@kline_1m`
  )
  .join("/");

const wsUrl =
  `wss://stream.binance.com:9443/stream?streams=${streams}`;

// ==========================================
// START WEBSOCKET
// ==========================================

function startBinanceWebsocket() {

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
        startBinanceWebsocket,
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
