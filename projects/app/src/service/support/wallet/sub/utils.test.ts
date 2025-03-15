import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getStandardSubPlan } from './utils';

describe('getStandardSubPlan', () => {
  beforeEach(() => {
    vi.resetModules();
    global.subPlans = undefined;
  });

  it('should return undefined when global.subPlans is undefined', () => {
    expect(getStandardSubPlan()).toBeUndefined();
  });

  it('should return standard plan when global.subPlans exists', () => {
    const mockStandardPlan = {
      name: 'Standard Plan',
      price: 9.99
    };

    global.subPlans = {
      standard: mockStandardPlan
    };

    expect(getStandardSubPlan()).toBe(mockStandardPlan);
  });

  it('should return undefined when global.subPlans.standard is undefined', () => {
    global.subPlans = {};
    expect(getStandardSubPlan()).toBeUndefined();
  });
});
