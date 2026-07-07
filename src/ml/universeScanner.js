
/*
==================================================
DYNAMIC UNIVERSE SCANNER
Generation 2
==================================================
*/

const axios = require("axios");

const BINANCE_URL =
    "https://fapi.binance.com/fapi/v1/ticker/24hr";

async function scanUniverse() {

    const { data } =
        await axios.get(BINANCE_URL);

    return data

        .filter(symbol =>

            symbol.symbol.endsWith("USDT")

        )

        .filter(symbol =>

            Number(symbol.quoteVolume) > 1000000

        )

        .filter(symbol =>

            Number(symbol.lastPrice) > 0

        )

        .map(symbol => ({

            symbol:
                symbol.symbol,

            quoteVolume:
                Number(symbol.quoteVolume),

            volume:
                Number(symbol.volume),

            trades:
                Number(symbol.count),

            priceChange:
                Number(symbol.priceChangePercent),

            high:
                Number(symbol.highPrice),

            low:
                Number(symbol.lowPrice),

            lastPrice:
                Number(symbol.lastPrice),

            volatility:

                Math.abs(

                    Number(symbol.highPrice)

                    -

                    Number(symbol.lowPrice)

                )

                /

                Number(symbol.lastPrice)

                *

                100

        }))

        .map(symbol => {

    const volumeScore =
        Math.min(
            100,
            symbol.quoteVolume / 10000000
        );

    const volatilityScore =
        Math.min(
            100,
            symbol.volatility * 5
        );

    const activityScore =
        Math.min(
            100,
            symbol.trades / 50000
        );

    const momentumScore =
        Math.abs(
            symbol.priceChange
        );

    const universeScore =

        volumeScore * 0.35 +

        volatilityScore * 0.25 +

        activityScore * 0.20 +

        momentumScore * 0.20;

    return {

        ...symbol,

        universeScore:
            Number(
                universeScore.toFixed(2)
            ),

    };

})
        .sort(

    (a, b) =>

        b.universeScore -

        a.universeScore

)

}

module.exports = {

    scanUniverse,

};
