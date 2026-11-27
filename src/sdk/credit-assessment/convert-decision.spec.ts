import theoretically from 'jest-theories';

import asDecision from './convert-decision';
import { CreditAssessmentDecision } from './types';

describe('Convert decision text to decision', () => {
  const theories = [
    {
      text: 'approved',
      expectedDecision: CreditAssessmentDecision.Approved,
    },
    {
      text: 'rejected',
      expectedDecision: CreditAssessmentDecision.Rejected,
    },
    { text: 'asdf', expectedDecision: CreditAssessmentDecision.Unknown },
    { text: undefined, expectedDecision: CreditAssessmentDecision.Unknown },
  ];

  theoretically("Given '{text}', should be '{expectedDecision}'", theories, (theory) => {
    const decision = asDecision(theory.text);
    expect(decision).toBe(theory.expectedDecision);
  });
});
