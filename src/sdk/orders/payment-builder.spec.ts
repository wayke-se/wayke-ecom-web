import * as fixtures from '../../test/fixtures';
import { PaymentBuilder } from './payment-builder';

const fixture = (id: string, withData: any = undefined): any => fixtures.create(id, withData);

describe('PaymentBuilder', () => {
  describe(':build()', () => {
    it('returns a IOrderPaymentRequest for the specified builder properties', () => {
      const expected = fixture('IOrderPaymentRequest');

      const actual = new PaymentBuilder()
        .withType(expected.type)
        .withDuration(expected.months)
        .withDownPayment(expected.downPayment)
        .withResidualValue(expected.residualValue)
        .withExternalId(expected.externalId)
        .withCreditAssessment(expected.creditAssessment)
        .build();

      expect(actual).toEqual(expected);
    });
  });
});
