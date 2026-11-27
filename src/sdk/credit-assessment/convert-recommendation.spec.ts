import theoretically from 'jest-theories';

import asRecommendation from './convert-recommendation';
import { CreditAssessmentRecommendation } from './types';

describe('Convert recommendation text to recommendation', () => {
  const theories = [
    {
      text: 'approve',
      expectedRecommendation: CreditAssessmentRecommendation.Approve,
    },
    {
      text: 'assessManually',
      expectedRecommendation: CreditAssessmentRecommendation.AssessManually,
    },
    {
      text: 'reject',
      expectedRecommendation: CreditAssessmentRecommendation.Reject,
    },
    {
      text: 'asdf',
      expectedRecommendation: CreditAssessmentRecommendation.Unknown,
    },
    {
      text: undefined,
      expectedRecommendation: CreditAssessmentRecommendation.Unknown,
    },
  ];

  theoretically("Given '{text}', should be '{expectedRecommendation}'", theories, (theory) => {
    const recommendation = asRecommendation(theory.text);
    expect(recommendation).toBe(theory.expectedRecommendation);
  });
});
