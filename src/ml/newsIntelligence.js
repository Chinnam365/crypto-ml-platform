async function analyzeNews(
  newsItems
) {

  return newsItems.map(
    item => {

      let sentiment =
        "NEUTRAL";

      if (
        item.title
          .toLowerCase()
          .includes(
            "partnership"
          )
      ) {

        sentiment =
          "BULLISH";
      }

      if (
        item.title
          .toLowerCase()
          .includes(
            "hack"
          )
      ) {

        sentiment =
          "BEARISH";
      }

      return {

        ...item,

        sentiment,
      };
    }
  );
}

module.exports = {
  analyzeNews,
};
