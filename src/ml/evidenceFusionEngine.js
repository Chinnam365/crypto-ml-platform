/*
==================================================
EVIDENCE FUSION ENGINE
Version 1.0
==================================================
*/

function clamp(value, min = 0, max = 100) {

    if (!Number.isFinite(value)) {
        return min;
    }

    return Math.max(min, Math.min(max, value));
}

function normalize(value) {

    return clamp(Number(value || 0));

}

function calculateAgreement(scores) {

    if (scores.length <= 1) {
        return 100;
    }

    const mean =
        scores.reduce(
            (sum, value) => sum + value,
            0
        ) / scores.length;

    const variance =
        scores.reduce(
            (sum, value) =>
                sum +
                Math.pow(value - mean, 2),
            0
        ) / scores.length;

    const deviation =
        Math.sqrt(variance);

    return clamp(
        100 - (deviation * 2)
    );
}

function calculateEvidenceQuality({

    sampleConfidence = 1,

    agreement = 100,

    reinforcementScore = 50

}) {

    let quality = 0;

    quality +=
        sampleConfidence * 40;

    quality +=
        (agreement / 100) * 40;

    quality +=
        (reinforcementScore / 100) * 20;

    return clamp(quality);

}

function fuseEvidence({

    mlConfidence = 50,

    reinforcementScore = 50,

    opportunityScore = 50,

    strategyScore = 50,

    memoryScore = 50,

    alignmentScore = 50,

    consensusStrength = 50,

    sampleConfidence = 1

}) {

    mlConfidence =
        normalize(mlConfidence);

    reinforcementScore =
        normalize(reinforcementScore);

    opportunityScore =
        normalize(opportunityScore);

    strategyScore =
        normalize(strategyScore);

    memoryScore =
        normalize(memoryScore);

    alignmentScore =
        normalize(alignmentScore);

    consensusStrength =
        normalize(consensusStrength);

    const weightedScore =

        mlConfidence * 0.30 +

        reinforcementScore * 0.20 +

        opportunityScore * 0.15 +

        strategyScore * 0.10 +

        memoryScore * 0.10 +

        alignmentScore * 0.10 +

        consensusStrength * 0.05;

    const agreement =
        calculateAgreement([

            mlConfidence,

            reinforcementScore,

            opportunityScore,

            strategyScore,

            memoryScore

        ]);

    const evidenceQuality =
        calculateEvidenceQuality({

            sampleConfidence,

            agreement,

            reinforcementScore

        });

    let confidence = weightedScore;

    /*
    ==========================================
    AGREEMENT BONUS
    ==========================================
    */

    if (agreement >= 90) {

        confidence += 8;

    }

    else if (agreement >= 80) {

        confidence += 5;

    }

    else if (agreement >= 70) {

        confidence += 3;

    }

    else if (agreement <= 40) {

        confidence -= 8;

    }

    else if (agreement <= 50) {

        confidence -= 5;

    }

    /*
    ==========================================
    EVIDENCE QUALITY BONUS
    ==========================================
    */

    if (evidenceQuality >= 85) {

        confidence += 5;

    }

    else if (evidenceQuality <= 40) {

        confidence -= 5;

    }

    confidence =
        clamp(confidence);

    return {

        confidence:
            Number(
                confidence.toFixed(2)
            ),

        agreement:
            Number(
                agreement.toFixed(2)
            ),

        evidenceQuality:
            Number(
                evidenceQuality.toFixed(2)
            ),

        weightedScore:
            Number(
                weightedScore.toFixed(2)
            )

    };

}

module.exports = {

    fuseEvidence

};
