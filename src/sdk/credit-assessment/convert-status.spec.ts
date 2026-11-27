import theoretically from 'jest-theories';

import asStatus from './convert-status';
import { CreditAssessmentStatus } from './types';

describe('Convert status text to status', () => {
  const theories = [
    { text: 'received', expectedStatus: CreditAssessmentStatus.Received },
    {
      text: 'signingInitiated',
      expectedStatus: CreditAssessmentStatus.SigningInitiated,
    },
    {
      text: 'signingFailed',
      expectedStatus: CreditAssessmentStatus.SigningFailed,
    },
    { text: 'signed', expectedStatus: CreditAssessmentStatus.Signed },
    {
      text: 'scoringInitiated',
      expectedStatus: CreditAssessmentStatus.ScoringInitiated,
    },
    { text: 'scored', expectedStatus: CreditAssessmentStatus.Scored },
    { text: 'notScored', expectedStatus: CreditAssessmentStatus.NotScored },
    { text: 'accepted', expectedStatus: CreditAssessmentStatus.Accepted },
    { text: 'declined', expectedStatus: CreditAssessmentStatus.Declined },
    { text: 'unknown', expectedStatus: CreditAssessmentStatus.Unknown },
    { text: 'asdf', expectedStatus: CreditAssessmentStatus.Unknown },
  ];

  theoretically("Given '{text}', should be '{expectedStatus}'", theories, (theory) => {
    const status = asStatus(theory.text);
    expect(status).toBe(theory.expectedStatus);
  });
});
