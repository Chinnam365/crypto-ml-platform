async function getConfidenceCalibration(pool) {

  const result =
    await pool.query(`
      SELECT
        confidence,

        pnl

      FROM ml_dataset

      WHERE pnl IS NOT NULL
    `);

  const rows =
    result.rows;

  const buckets = {

    "50-60": [],

    "60-70": [],

    "70-80": [],

    "80-90": [],

    "90-100": [],
  };

  // ==========================================
  // GROUP INTO BUCKETS
  // ==========================================

  rows.forEach(row => {

    const confidence =
      Number(row.confidence || 0);

    const pnl =
      Number(row.pnl || 0);

    let bucket = null;

    if (
      confidence >= 50 &&
      confidence < 60
    ) {

      bucket = "50-60";
    }

    else if (
      confidence >= 60 &&
      confidence < 70
    ) {

      bucket = "60-70";
    }

    else if (
      confidence >= 70 &&
      confidence < 80
    ) {

      bucket = "70-80";
    }

    else if (
      confidence >= 80 &&
      confidence < 90
    ) {

      bucket = "80-90";
    }

    else if (
      confidence >= 90
    ) {

      bucket = "90-100";
    }

    if (bucket) {

      buckets[bucket].push(pnl);
    }
  });

  // ==========================================
  // CALCULATE PERFORMANCE
  // ==========================================

  const calibration = [];

  Object.keys(buckets)
    .forEach(bucket => {

      const trades =
        buckets[bucket];

      const total =
        trades.length;

      if (!total) {

        calibration.push({

          bucket,

          trades: 0,

          winRate: 0,
        });

        return;
      }

      let wins = 0;

      trades.forEach(pnl => {

        if (pnl > 0) {

          wins++;
        }
      });

      const winRate =
        (
          wins / total
        ) * 100;

      calibration.push({

        bucket,

        trades: total,

        winRate:
          Number(
            winRate.toFixed(2)
          ),
      });
    });

  return calibration;
}

module.exports = {
  getConfidenceCalibration,
};
