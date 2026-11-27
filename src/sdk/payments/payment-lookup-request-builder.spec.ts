import * as fixtures from '../../test/fixtures';
import { PaymentLookupRequestBuilder } from './payment-lookup-request-builder';

const fixture = (name: string, withData: any = undefined): any => fixtures.create(name, withData);

describe('PaymentLookupRequestBuilder', () => {
  describe('.validateRequest()', () => {
    it('fails and throws error for missing request', () => {
      expect(() => {
        PaymentLookupRequestBuilder.validateRequest(null as any);
      }).toThrowError();
    });
    it('fails and throws error for missing vehicle id value', () => {
      expect(() => {
        const request = fixture('IPaymentLookupRequest');
        delete request.id;
        PaymentLookupRequestBuilder.validateRequest(request);
      }).toThrowError();
    });
    it('fails and throws error for missing duration value', () => {
      expect(() => {
        const request = fixture('IPaymentLookupRequest');
        delete request.duration;
        PaymentLookupRequestBuilder.validateRequest(request);
      }).toThrowError();
    });
    it('fails and throws error for negative duration value', () => {
      expect(() => {
        const request = fixture('IPaymentLookupRequest', {
          duration: -1,
        });
        PaymentLookupRequestBuilder.validateRequest(request);
      }).toThrowError();
    });
    it('fails and throws error for missing down payment value', () => {
      expect(() => {
        const request = fixture('IPaymentLookupRequest');
        delete request.downPayment;
        PaymentLookupRequestBuilder.validateRequest(request);
      }).toThrowError();
    });
    it('fails and throws error for negative down payment value', () => {
      expect(() => {
        const request = fixture('IPaymentLookupRequest', {
          downPayment: -1,
        });
        PaymentLookupRequestBuilder.validateRequest(request);
      }).toThrowError();
    });
    it('does not throw for valid requests', () => {
      expect(() => {
        const request = fixture('IPaymentLookupRequest');
        PaymentLookupRequestBuilder.validateRequest(request);
      }).not.toThrowError();
    });
  });

  describe(':forVehicle()', () => {
    it('returns the PaymentLookupRequestBuilder instance', () => {
      const builder = new PaymentLookupRequestBuilder();
      const instance = builder.forVehicle('vehicle-id');

      expect(instance).toBe(builder);
    });
  });

  describe(':forDealer()', () => {
    it('returns the PaymentLookupRequestBuilder instance', () => {
      const builder = new PaymentLookupRequestBuilder();
      const instance = builder.forDealer('dealer-id');

      expect(instance).toBe(builder);
    });
  });

  describe(':withDownPayment()', () => {
    it('returns the PaymentLookupRequestBuilder instance', () => {
      const builder = new PaymentLookupRequestBuilder();
      const instance = builder.withDownPayment(10000);

      expect(instance).toBe(builder);
    });
  });

  describe(':withDuration()', () => {
    it('returns the PaymentLookupRequestBuilder instance', () => {
      const builder = new PaymentLookupRequestBuilder();
      const instance = builder.withDuration(72);

      expect(instance).toBe(builder);
    });
  });

  describe(':withResidualValue()', () => {
    it('returns the PaymentLookupRequestBuilder instance', () => {
      const builder = new PaymentLookupRequestBuilder();
      const instance = builder.withResidualValue(0.2);

      expect(instance).toBe(builder);
    });
  });

  describe(':withFinancialOptionId()', () => {
    it('returns the PaymentLookupRequestBuilder instance', () => {
      const builder = new PaymentLookupRequestBuilder();
      const instance = builder.withFinancialOptionId('financial-option-id');

      expect(instance).toBe(builder);
    });
  });

  describe(':build()', () => {
    it('returns a IPaymentLookupRequest for the specified builder properties', () => {
      const expected = fixture('IPaymentLookupRequest');
      const actual = new PaymentLookupRequestBuilder()
        .forVehicle(expected.id)
        .forDealer(expected.branchId)
        .withDownPayment(expected.downPayment)
        .withDuration(expected.duration)
        .withFinancialOptionId(expected.financialOptionId)
        .build();

      expect(actual).toEqual(expected);
    });
  });
});
