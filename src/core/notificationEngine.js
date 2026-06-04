async function sendNotification({

  channel,

  title,

  message,

}) {

  console.log(
    `[${channel}] ${title}`
  );

  return {

    sent: true,

    channel,

    title,

    message,
  };
}

module.exports = {
  sendNotification,
};
