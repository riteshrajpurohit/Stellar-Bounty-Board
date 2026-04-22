import { describe, it, expect } from 'vitest';
import { bountySchema } from './bountySchema';
import { addDays, subDays } from 'date-fns';

describe('Bounty Schema Validation', () => {
  it('should accept valid bounty data', () => {
    const validData = {
      title: 'Fix Navigation Bug',
      description: 'The mobile navigation breaks on smaller screens. Need to use a hamburger menu.',
      category: 'Design',
      reward_amount: 150.5,
      deadline: addDays(new Date(), 5).toISOString(),
    };
    
    const result = bountySchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject titles that are too short', () => {
    const invalidData = {
      title: 'Fix', // 3 chars
      description: 'The mobile navigation breaks on smaller screens.',
      category: 'Development',
      reward_amount: 100,
      deadline: addDays(new Date(), 5).toISOString(),
    };
    
    const result = bountySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least 5 characters');
    }
  });

  it('should reject non-positive reward amounts', () => {
    const invalidData = {
      title: 'Fix Navigation Bug',
      description: 'The mobile navigation breaks on smaller screens.',
      category: 'Design',
      reward_amount: 0,
      deadline: addDays(new Date(), 5).toISOString(),
    };
    
    const result = bountySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('positive number');
    }
  });

  it('should reject past deadlines', () => {
    const invalidData = {
      title: 'Fix Navigation Bug',
      description: 'The mobile navigation breaks on smaller screens.',
      category: 'Design',
      reward_amount: 50,
      deadline: subDays(new Date(), 1).toISOString(), // Yesterday
    };
    
    const result = bountySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject descriptions that are too short', () => {
    const invalidData = {
      title: 'Fix Navigation Bug',
      description: 'Too short', // Under 20 chars
      category: 'Design',
      reward_amount: 100,
      deadline: addDays(new Date(), 5).toISOString(),
    };

    const result = bountySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least 20');
    }
  });
});
