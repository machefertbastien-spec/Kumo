/**
 * Growth Math Tests
 * Unit tests for critical growth calculations
 */

import {
  ageDays,
  lerp,
  lmsAtDay,
  zFromLMS,
  xFromLMS,
  percentileFromZ,
  normalCdf,
  isValidMeasurement,
  calculateDelta,
  Z_SCORES,
} from '../math/growthMath';
import type { LMSByDay } from '../types';

describe('Growth Math', () => {
  describe('ageDays', () => {
    it('should calculate days correctly', () => {
      const dob = '2025-01-01T00:00:00.000Z';
      const measured = '2025-01-08T00:00:00.000Z';
      expect(ageDays(dob, measured)).toBe(7);
    });

    it('should clamp to 0-365 range', () => {
      const dob = '2024-01-01T00:00:00.000Z';
      const measured = '2026-01-01T00:00:00.000Z';
      expect(ageDays(dob, measured)).toBe(365);
    });

    it('should handle negative days', () => {
      const dob = '2025-01-08T00:00:00.000Z';
      const measured = '2025-01-01T00:00:00.000Z';
      expect(ageDays(dob, measured)).toBe(0);
    });
  });

  describe('lerp', () => {
    it('should interpolate correctly', () => {
      expect(lerp(0, 10, 0.5)).toBe(5);
      expect(lerp(0, 10, 0)).toBe(0);
      expect(lerp(0, 10, 1)).toBe(10);
    });
  });

  describe('lmsAtDay', () => {
    const lms: LMSByDay = {
      0: { L: 0.1, M: 3.0, S: 0.14 },
      1: { L: 0.1, M: 3.1, S: 0.14 },
      2: { L: 0.1, M: 3.2, S: 0.14 },
    };

    it('should return exact LMS for integer days', () => {
      const result = lmsAtDay(lms, 1);
      expect(result).toEqual({ L: 0.1, M: 3.1, S: 0.14 });
    });

    it('should interpolate for fractional days', () => {
      const result = lmsAtDay(lms, 0.5);
      expect(result.M).toBeCloseTo(3.05, 2);
    });

    it('should handle day 0', () => {
      const result = lmsAtDay(lms, 0);
      expect(result).toEqual({ L: 0.1, M: 3.0, S: 0.14 });
    });
  });

  describe('zFromLMS and xFromLMS', () => {
    const lms = { L: 0.3, M: 5.0, S: 0.12 };

    it('should be inverse operations', () => {
      const x = 5.5;
      const z = zFromLMS(x, lms);
      const xBack = xFromLMS(z, lms);
      expect(xBack).toBeCloseTo(x, 3);
    });

    it('should handle L = 0 case', () => {
      const lmsZero = { L: 0, M: 5.0, S: 0.12 };
      const x = 6.0;
      const z = zFromLMS(x, lmsZero);
      const xBack = xFromLMS(z, lmsZero);
      expect(xBack).toBeCloseTo(x, 3);
    });

    it('should return NaN for invalid inputs', () => {
      expect(zFromLMS(-1, lms)).toBeNaN();
      expect(xFromLMS(10, { L: 0.5, M: -1, S: 0.1 })).toBeNaN();
    });
  });

  describe('normalCdf', () => {
    it('should return 0.5 for z=0', () => {
      expect(normalCdf(0)).toBeCloseTo(0.5, 2);
    });

    it('should return ~0.84 for z=1', () => {
      expect(normalCdf(1)).toBeCloseTo(0.8413, 2);
    });

    it('should return ~0.16 for z=-1', () => {
      expect(normalCdf(-1)).toBeCloseTo(0.1587, 2);
    });

    it('should be symmetric', () => {
      const z = 1.5;
      expect(normalCdf(z) + normalCdf(-z)).toBeCloseTo(1, 4);
    });
  });

  describe('percentileFromZ', () => {
    it('should return 50 for z=0', () => {
      expect(percentileFromZ(0)).toBeCloseTo(50, 1);
    });

    it('should return ~84 for z=1', () => {
      expect(percentileFromZ(1)).toBeCloseTo(84, 0);
    });

    it('should match known Z-scores', () => {
      expect(percentileFromZ(Z_SCORES.p3)).toBeCloseTo(3, 1);
      expect(percentileFromZ(Z_SCORES.p50)).toBeCloseTo(50, 1);
      expect(percentileFromZ(Z_SCORES.p97)).toBeCloseTo(97, 1);
    });
  });

  describe('isValidMeasurement', () => {
    it('should validate within bounds', () => {
      expect(isValidMeasurement(5, 2, 10)).toBe(true);
    });

    it('should reject below bounds', () => {
      expect(isValidMeasurement(1, 2, 10)).toBe(false);
    });

    it('should reject above bounds', () => {
      expect(isValidMeasurement(11, 2, 10)).toBe(false);
    });

    it('should reject NaN', () => {
      expect(isValidMeasurement(NaN, 2, 10)).toBe(false);
    });

    it('should reject Infinity', () => {
      expect(isValidMeasurement(Infinity, 2, 10)).toBe(false);
    });
  });

  describe('calculateDelta', () => {
    it('should calculate positive delta', () => {
      const result = calculateDelta(
        5.5,
        5.0,
        '2025-01-15T00:00:00.000Z',
        '2025-01-08T00:00:00.000Z'
      );
      expect(result.deltaValue).toBe(0.5);
      expect(result.deltaDays).toBe(7);
      expect(result.deltaPerDay).toBeCloseTo(0.071, 3);
    });

    it('should calculate negative delta', () => {
      const result = calculateDelta(
        5.0,
        5.5,
        '2025-01-15T00:00:00.000Z',
        '2025-01-08T00:00:00.000Z'
      );
      expect(result.deltaValue).toBe(-0.5);
      expect(result.deltaDays).toBe(7);
    });

    it('should handle zero days', () => {
      const result = calculateDelta(
        5.5,
        5.0,
        '2025-01-08T00:00:00.000Z',
        '2025-01-08T00:00:00.000Z'
      );
      expect(result.deltaDays).toBe(0);
      expect(result.deltaPerDay).toBe(0);
    });
  });
});
