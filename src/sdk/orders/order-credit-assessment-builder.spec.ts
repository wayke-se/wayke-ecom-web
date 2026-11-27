import * as fixtures from '../../test/fixtures';
const fixture = (id: string): any => fixtures.create(id);

import { OrderCreditAssessmentBuilder } from './order-credit-assessment-builder';

describe('OrderCreditAssessmentBuilder', () => {
  describe(':build()', () => {
    it('returns a IOrderCreditAssessment for the specified builder properties', () => {
      const expected = fixture('IOrderCreditAssessment');

      const actual = new OrderCreditAssessmentBuilder()
        .withScoreId(expected.scoreId)
        .withFinancialProductCode(expected.financialProductCode)
        .withDecision(expected.decision)
        .withRecommendation(expected.recommendation)
        .build();

      expect(actual).toEqual(expected);
    });
  });
});
