async function getLearningStatus(
  pool
) {

  const decisionMemory =
    await pool.query(
      `
      SELECT COUNT(*)
      FROM decision_memory
      `
    );

  const reinforcementMemory =
    await pool.query(
      `
      SELECT COUNT(*)
      FROM reinforcement_memory
      `
    );

  return {

    decisionMemory:
      Number(
        decisionMemory
          .rows[0]
          .count
      ),

    reinforcementMemory:
      Number(
        reinforcementMemory
          .rows[0]
          .count
      ),
  };
}

module.exports = {
  getLearningStatus,
};
