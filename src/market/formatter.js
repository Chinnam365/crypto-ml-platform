function formatCandles(rawCandles) {
  return rawCandles.map((candle) => ({
    openTime: candle[0],
    open: Number(candle[1]),
    high: Number(candle[2]),
    low: Number(candle[3]),
    close: Number(candle[4]),
    volume: Number(candle[5]),
  }));
}

module.exports = {
  formatCandles,
};
