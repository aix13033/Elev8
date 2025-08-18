export function calculateScore({
  hrv,
  rhr,
  sleepScore,
  tg,
  hdl,
  hsCRP,
  nutritionAdherence
}) {
  const weights = {
    labs: 0.5,
    hrv: 0.2,
    rhr: 0.1,
    sleep: 0.1,
    nutrition: 0.1
  };

  const components = {};
  let totalWeight = 0;
  let weightedScore = 0;

  // Labs component (tg/hdl ratio and hsCRP)
  let labScores = [];
  if (tg != null && hdl != null && hdl > 0) {
    const ratio = tg / hdl;
    // Ratio <=1 is best (~100), >=4 is worst (~0)
    const ratioScore = Math.max(0, Math.min(1, (4 - ratio) / 3)) * 100;
    labScores.push(ratioScore);
  }
  if (hsCRP != null) {
    // hsCRP 0-1 good, 3+ poor
    const crpScore = Math.max(0, Math.min(1, (3 - hsCRP) / 3)) * 100;
    labScores.push(crpScore);
  }
  if (labScores.length) {
    const labScore = labScores.reduce((a, b) => a + b, 0) / labScores.length;
    components.labs = Math.round(labScore);
    weightedScore += labScore * weights.labs;
    totalWeight += weights.labs;
  }

  if (hrv != null) {
    const hrvScore = Math.min(hrv / 70, 1) * 100; // 70ms+ considered good
    components.hrv = Math.round(hrvScore);
    weightedScore += hrvScore * weights.hrv;
    totalWeight += weights.hrv;
  }

  if (rhr != null) {
    const rhrScore = Math.max(0, Math.min(1, (80 - rhr) / 30)) * 100; // 50-80 bpm range
    components.rhr = Math.round(rhrScore);
    weightedScore += rhrScore * weights.rhr;
    totalWeight += weights.rhr;
  }

  if (sleepScore != null) {
    const sleepComponent = Math.max(0, Math.min(100, sleepScore));
    components.sleep = Math.round(sleepComponent);
    weightedScore += sleepComponent * weights.sleep;
    totalWeight += weights.sleep;
  }

  if (nutritionAdherence != null) {
    const nutritionScore = Math.max(0, Math.min(1, nutritionAdherence)) * 100;
    components.nutrition = Math.round(nutritionScore);
    weightedScore += nutritionScore * weights.nutrition;
    totalWeight += weights.nutrition;
  }

  const finalScore = totalWeight > 0 ? weightedScore / totalWeight : 0;
  const confidence = totalWeight; // since weights sum to 1

  return {
    score: Math.round(finalScore),
    confidence: Number(confidence.toFixed(2)),
    components
  };
}
export default calculateScore;
