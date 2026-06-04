function createAuditRecord({

  event,

  source,

  payload,

}) {

  return {

    event,

    source,

    payload,

    timestamp:
      new Date()
        .toISOString(),
  };
}

module.exports = {
  createAuditRecord,
};
