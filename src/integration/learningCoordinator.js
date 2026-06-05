async function processTradeOutcome({

  symbol,

  pnl,

  outcome,

}) {

  console.log(`
==================================
LEARNING COORDINATOR
==================================
Symbol:
${symbol}

PnL:
${pnl}

Outcome:
${outcome}
==================================
`);

  return true;
}

module.exports = {
  processTradeOutcome,
};
