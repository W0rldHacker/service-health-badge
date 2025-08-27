import { describe, it, expect } from 'vitest';
import { computeNextBackoff } from '../src/_scheduler-testable.js';

describe('computeNextBackoff', () => {
  it('resets to base on success', () => {
    expect(computeNextBackoff(40000, 'success', 10000)).toBe(10000);
    expect(computeNextBackoff(60000, 'success', 20000)).toBe(20000);
  });

  it('doubles on failure up to 60s cap', () => {
    expect(computeNextBackoff(10000, 'failure', 10000)).toBe(20000);
    expect(computeNextBackoff(20000, 'failure', 10000)).toBe(40000);
    expect(computeNextBackoff(40000, 'failure', 10000)).toBe(60000);
    expect(computeNextBackoff(60000, 'failure', 10000)).toBe(60000);
  });

  it('uses base as floor when prev < base or invalid', () => {
    expect(computeNextBackoff(1000, 'failure', 10000)).toBe(20000);
    expect(computeNextBackoff(NaN, 'failure', 10000)).toBe(20000);
  });
});
