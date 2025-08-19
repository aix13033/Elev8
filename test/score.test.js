
---

# tests/score.test.mjs (final)

> This version works even if `score.js` is located in either `backend/lib/` **or** `lib/`.  
> (Uses dynamic import with fallback; Node 20+ ESM compatible.)

```js
import assert from 'assert';

let calculateScore;
try {
  // Preferred: backend/lib structure
  ({ calculateScore } = await import('../backend/lib/score.js'));
} catch {
  // Fallback: root lib structure
  ({ calculateScore } = await import('../lib/score.js'));
}

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
