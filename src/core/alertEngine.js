function generateAlert({

  severity,

  title,

  message,

}) {

  return {

    severity,

    title,

    message,

    timestamp:
      new Date()
        .toISOString(),
  };
}

module.exports = {
  generateAlert,
};
