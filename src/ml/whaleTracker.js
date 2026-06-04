function detectWhales(
  transactions
) {

  return transactions.filter(
    tx =>
      tx.valueUSD >
      1000000
  );
}

module.exports = {
  detectWhales,
};
