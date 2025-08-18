import assert from 'assert';
import { calculateScore } from '../backend/lib/score.js';

// Basic sanity check
const result = calculateScore({
  hrv: 60,
  rhr: 55,
  sleepScore: 85,
  tg: 100,
  hdl: 50,
  hsCRP: 1,
  nutritionAdherence: 0.8
});

assert.ok(result.score >= 0 && result.score <= 100, 'score within 0-100');
assert.ok(result.confidence > 0, 'confidence computed');
assert.ok(result.components.hrv, 'component hrv present');

console.log('score test passed');
