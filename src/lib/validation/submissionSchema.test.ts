import { describe, it, expect } from 'vitest';
import { submissionSchema } from './submissionSchema';

describe('Submission Schema Validation', () => {
  it('should accept valid submission data', () => {
    const validData = {
      notes: 'This resolves the issue perfectly. I also wrote some tests.',
      submission_link: 'https://github.com/stellar/stellar-core',
    };
    
    const result = submissionSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject notes that are too short', () => {
    const invalidData = {
      notes: 'Done it.', // 8 chars (min 10)
      submission_link: '',
    };
    
    const result = submissionSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should accept empty submission_link', () => {
    const validData = {
      notes: 'I have attached the code in the notes here directly.',
      submission_link: '',
    };
    
    const result = submissionSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});
