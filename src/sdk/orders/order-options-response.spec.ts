import * as fixtures from '../../test/fixtures';
import { PaymentLookupResponse } from '../payments/payment-lookup-response';
import { OrderOptionsResponse } from './order-options-response';
import { IOrderOptionsResponseData, IDealerOption, IAccessory } from './types';

const fixture = (name: string, withData: any = undefined): any => fixtures.create(name, withData);

describe('OrderOptionsResponse', () => {
  describe(':constructor()', () => {
    it('throws error for missing response param', () => {
      expect(() => {
        new OrderOptionsResponse(null as any);
      }).toThrowError();
    });
  });

  describe(':getOrderVehicle()', () => {
    it('returns the vehicle in the order', () => {
      const response = fixture('IOrderOptionsResponse');
      const expected: Array<IAccessory> = response.accessories;
      const actual = new OrderOptionsResponse(response).getAccessories();

      expect(actual).toEqual(expected);
    });
  });

  describe(':getAccessories()', () => {
    it('returns a list of vehicle accessories', () => {
      const response = fixture('IOrderOptionsResponse');
      const expected: Array<IAccessory> = response.accessories;
      const actual = new OrderOptionsResponse(response).getAccessories();

      expect(actual).toEqual(expected);
    });
  });

  describe(':requiresDealerSelection()', () => {
    it('is falsy when only one dealer is available', () => {
      const response = fixture('IOrderOptionsResponse');
      response.dealers = [fixture('IDealerOption')];
      const actual = new OrderOptionsResponse(response).requiresDealerSelection();

      expect(actual).toBeFalsy();
    });
    it('is truthy when more than one dealer is available', () => {
      const response = fixture('IOrderOptionsResponse');
      response.dealers = [fixture('IDealerOption'), fixture('IDealerOption')];
      const actual = new OrderOptionsResponse(response).requiresDealerSelection();

      expect(actual).toBeTruthy();
    });
  });

  describe(':getDealerSites()', () => {
    it('returns a list of available dealers', () => {
      const response = fixture('IOrderOptionsResponse');
      const expected: Array<IDealerOption> = response.dealers;
      const actual = new OrderOptionsResponse(response).getDealerSites();

      expect(actual).toEqual(expected);
    });
  });

  describe(':getPaymentOptions()', () => {
    it('returns a IOptionsPayment list with the response payments', () => {
      const response = fixture('IOrderOptionsResponse');
      const expected: Array<{ [key: string]: any }> = response.payment;
      const actual = new OrderOptionsResponse(response).getPaymentOptions();

      for (let i = 0; i < expected.length; i++) {
        expected[i].loanDetails = new PaymentLookupResponse(expected[i].loanDetails);
      }

      expect(actual).toEqual(expected);
    });
    it('returns an empty list when values missing in response', () => {
      const response = fixture('IOrderOptionsResponse');
      delete response.payment;
      const actual = new OrderOptionsResponse(response).getPaymentOptions();

      expect(actual).toEqual([]);
    });
    it('returns undefined for missing loan details', () => {
      const response = fixture('IOrderOptionsResponse');
      response.payment = response.payment.map((x: any) => ({
        ...x,
        loanDetails: null,
      }));

      const actual = new OrderOptionsResponse(response)
        .getPaymentOptions()
        .map((x) => x.loanDetails)
        .filter((x) => !!x);

      expect(actual.length).toBe(0);
    });
    it('returns external id in payment options', () => {
      const response: IOrderOptionsResponseData = fixture('IOrderOptionsResponse');

      const options = new OrderOptionsResponse(response).getPaymentOptions();

      for (let i = 0; i < response.payment.length; i++) {
        const expected = response.payment[i].externalId;
        const actual = options[i].externalId;
        expect(actual).toBe(expected);
      }
    });
  });

  describe(':getDeliveryOptions()', () => {
    it('returns a IOptionsDelivery list with the response deliveries', () => {
      const response = fixture('IOrderOptionsResponse');
      const expected = response.delivery;
      const actual = new OrderOptionsResponse(response).getDeliveryOptions();

      expect(actual).toEqual(expected);
    });
    it('returns an empty list when values missing in response', () => {
      const response = fixture('IOrderOptionsResponse');
      delete response.delivery;
      const actual = new OrderOptionsResponse(response).getDeliveryOptions();

      expect(actual).toEqual([]);
    });
  });

  describe(':getInsuranceOptions()', () => {
    it('returns a IOptionsInsurance with the response insurance', () => {
      const response = fixture('IOrderOptionsResponse');
      const expected = response.insurance;
      const actual = new OrderOptionsResponse(response).getInsuranceOption();

      expect(actual).toEqual(expected);
    });
    it('returns undefined when no IOptionsInsurance is available on response', () => {
      const response = fixture('IOrderOptionsResponse');
      delete response.insurance;

      const actual = new OrderOptionsResponse(response).getInsuranceOption();

      expect(actual).toBeUndefined();
    });
  });

  describe(':getOrderConditions()', () => {
    it('returns the conditions from the response object', () => {
      const response = fixture('IOrderOptionsResponse');
      const expected = response.conditions;
      const actual = new OrderOptionsResponse(response).getOrderConditions();

      expect(actual).toEqual(expected);
    });
  });

  describe(':getOrderReturnConditions()', () => {
    it('returns the return conditions from the response object', () => {
      const response = fixture('IOrderOptionsResponse');
      const expected = response.returnConditions;
      const actual = new OrderOptionsResponse(response).getOrderReturnConditions();

      expect(actual).toEqual(expected);
    });
  });

  describe(':getConditionsPdfUri()', () => {
    it('returns the conditions PDF URI from the response object', () => {
      const response = fixture('IOrderOptionsResponse');
      const expected = response.conditionsPdfUri;
      const actual = new OrderOptionsResponse(response).getConditionsPdfUri();

      expect(actual).toEqual(expected);
    });
  });

  describe(':getContactInformation()', () => {
    it('returns the contact information from the response object', () => {
      const response = fixture('IOrderOptionsResponse');
      const expected = response.contactInformation;
      const actual = new OrderOptionsResponse(response).getContactInformation();

      expect(actual).toEqual(expected);
    });
  });

  describe(':allowsTradeIn()', () => {
    it('returns the trade in flag from the response object', () => {
      const response = fixture('IOrderOptionsResponse');
      const expected = response.tradeIn;
      const actual = new OrderOptionsResponse(response).allowsTradeIn();

      expect(actual).toEqual(expected);
    });
  });

  describe(':isUnavailable()', () => {
    it('returns the unavailable in flag from the response object', () => {
      const response = fixture('IOrderOptionsResponse');
      const expected = response.unavailable;
      const actual = new OrderOptionsResponse(response).isUnavailable();

      expect(actual).toEqual(expected);
    });
  });

  describe(':isReserved()', () => {
    it('returns the reserved flag from the response object', () => {
      const response = fixture('IOrderOptionsResponse');
      const expected = response.reserved;
      const actual = new OrderOptionsResponse(response).isReserved();

      expect(actual).toEqual(expected);
    });
  });

  describe(':isPaymentRequired()', () => {
    it('returns the paymentRequired flag from the response object', () => {
      const response = fixture('IOrderOptionsResponse');
      const expected = response.paymentRequired;
      const actual = new OrderOptionsResponse(response).isPaymentRequired();
      expect(actual).toEqual(expected);
    });
  });
});
