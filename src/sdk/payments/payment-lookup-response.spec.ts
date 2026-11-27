import * as fixtures from '../../test/fixtures';
import { PaymentLookupResponse } from './payment-lookup-response';
import { IPaymentLookupResponse, IPaymentLookupResponseData } from './types';

const fixture = (name: string, withData: any = undefined) => fixtures.create(name, withData);

describe('PaymentLookupResponse', () => {
  describe(':constructor()', () => {
    it('throws an error for missing response param', () => {
      expect(() => {
        new PaymentLookupResponse(null as any);
      }).toThrowError();
    });
  });

  describe(':getCosts()', () => {
    it('returns a IPaymentCosts with the specified costs', () => {
      const expected = fixture('IPaymentCosts');
      const response = fixture('IPaymentLookupResponse', { ...expected });
      const actual = new PaymentLookupResponse(response).getCosts();

      expect(actual).toEqual(expected);
    });
  });

  describe(':getFees()', () => {
    it('returns a IPaymentFees with the specified fees', () => {
      const expected = fixture('IPaymentFees');
      const response = fixture('IPaymentLookupResponse', { ...expected });
      const actual = new PaymentLookupResponse(response).getFees();

      expect(actual).toEqual(expected);
    });
  });

  describe(':getInterests()', () => {
    it('returns a IPaymentInterests with the specified interests', () => {
      const expected = fixture('IPaymentInterests');
      const response = fixture('IPaymentLookupResponse', { ...expected });
      const actual = new PaymentLookupResponse(response).getInterests();

      expect(actual).toEqual(expected);
    });
  });

  describe(':getDurationSpec()', () => {
    it('returns a IPaymentRangeSpec with the specified spec', () => {
      const expected = fixture('IPaymentRangeSpec');
      const response = fixture('IPaymentLookupResponse', {
        duration: expected,
      });
      const actual = new PaymentLookupResponse(response).getDurationSpec();

      expect(actual).toEqual(expected);
    });
  });

  describe(':getDownPaymentSpec()', () => {
    it('returns a IPaymentRangeSpec with the specified spec', () => {
      const expected = fixture('IPaymentRangeSpec');
      const response = fixture('IPaymentLookupResponse', {
        downPayment: expected,
      });
      const actual = new PaymentLookupResponse(response).getDownPaymentSpec();

      expect(actual).toEqual(expected);
    });
  });

  describe(':getResidualValueSpec()', () => {
    it('returns a IPaymentRangeSpec with the specified spec', () => {
      const expected = fixture('IPaymentRangeSpec');
      const response = fixture('IPaymentLookupResponse', {
        residual: expected,
      });
      const actual = new PaymentLookupResponse(response).getResidualValueSpec();

      expect(actual).toEqual(expected);
    });
  });

  describe(':getTotalResidualValue()', () => {
    it('returns the specified response', () => {
      const expected = 50000;
      const response = fixture('IPaymentLookupResponse', {
        totalResidualValue: expected,
      });
      const actual = new PaymentLookupResponse(response).getTotalResidualValue();

      expect(actual).toEqual(expected);
    });
  });

  describe(':getPublicURL()', () => {
    it('returns the specified response', () => {
      const expected = 'https://www.outbound.com';
      const response = fixture('IPaymentLookupResponse', {
        link: expected,
      });
      const actual = new PaymentLookupResponse(response).getPublicURL();

      expect(actual).toEqual(expected);
    });
  });

  describe(':shouldUseCreditScoring()', () => {
    it('returns the specified response', () => {
      const response: IPaymentLookupResponseData = fixture('IPaymentLookupResponse');

      const actual = new PaymentLookupResponse(response).shouldUseCreditScoring();

      expect(actual).toEqual(response.useCreditScoring);
    });
  });

  describe(':getFinacialProductCode()', () => {
    it('returns the specified response', () => {
      const response: IPaymentLookupResponseData = fixture('IPaymentLookupResponse');

      const actual = new PaymentLookupResponse(response).getFinancialProductCode();

      expect(actual).toEqual(response.financialProductCode);
    });
  });

  describe(':getPrice()', () => {
    it('returns the specified response', () => {
      const response: IPaymentLookupResponseData = fixture('IPaymentLookupResponse');

      const actual = new PaymentLookupResponse(response).getPrice();

      expect(actual).toEqual(response.vehiclePrice);
    });
  });

  describe(':getCreditAmount()', () => {
    it('returns the specified response', () => {
      const response: IPaymentLookupResponseData = fixture('IPaymentLookupResponse');

      const actual = new PaymentLookupResponse(response).getCreditAmount();

      expect(actual).toEqual(response.loanAmount);
    });
  });

  describe('given privacy policy url', () => {
    let expectedUrl: string;
    let response: IPaymentLookupResponse;

    beforeAll(() => {
      expectedUrl = 'https://www.privacy-policy.com';
      const rawResponse = fixture('IPaymentLookupResponse', {
        privacyPolicyUrl: expectedUrl,
      });

      response = new PaymentLookupResponse(rawResponse);
    });

    describe(':hasPrivacyPolicy()', () => {
      it('is true', () => {
        const hasPrivacyPolicy = response.hasPrivacyPolicy();
        expect(hasPrivacyPolicy).toBe(true);
      });
    });

    describe(':getPrivacyPolicyUrl()', () => {
      it('should equal url for raw response', () => {
        const privacyPolicyUrl = response.getPrivacyPolicyUrl();
        expect(privacyPolicyUrl).toBe(expectedUrl);
      });
    });
  });

  describe('given no privacy policy url', () => {
    let response: IPaymentLookupResponse;

    beforeAll(() => {
      const rawResponse = fixture('IPaymentLookupResponse', {
        privacyPolicyUrl: null,
      });
      response = new PaymentLookupResponse(rawResponse);
    });

    describe(':hasPrivacyPolicy()', () => {
      it('is false', () => {
        const hasPrivacyPolicy = response.hasPrivacyPolicy();
        expect(hasPrivacyPolicy).toBe(false);
      });
    });

    describe(':getPrivacyPolicyUrl()', () => {
      it('should be falsy', () => {
        const privacyPolicyUrl = response.getPrivacyPolicyUrl();
        expect(privacyPolicyUrl).toBeFalsy();
      });
    });
  });

  describe('given a money laundering information URL', () => {
    let expectedURL: string;
    let response: IPaymentLookupResponse;

    beforeAll(() => {
      expectedURL = 'https://kalp.local/path';
      const rawResponse = fixture('IPaymentLookupResponse', {
        moneyLaunderingInformationUrl: expectedURL,
      });
      response = new PaymentLookupResponse(rawResponse);
    });

    describe(':hasMoneyLaunderingInformationURL()', () => {
      it('is truthy', () => {
        const v = response.hasMoneyLaunderingInformationURL();
        expect(v).toBe(true);
      });
    });

    describe(':getMoneyLaunderingInformationURL()', () => {
      it('should equal url from raw response', () => {
        const v = response.getMoneyLaunderingInformationURL();
        expect(v).toEqual(expectedURL);
      });
    });
  });

  describe('given a financial option ID', () => {
    let expectedFinancialOptionId: string;
    let response: IPaymentLookupResponse;

    beforeAll(() => {
      expectedFinancialOptionId = 'financial-option-id-1';
      const rawResponse = fixture('IPaymentLookupResponse', {
        financialOptionId: expectedFinancialOptionId,
      });
      response = new PaymentLookupResponse(rawResponse);
    });

    describe(':hasFinancialOptionId()', () => {
      it('is truthy', () => {
        const v = response.hasFinancialOptionId();
        expect(v).toBe(true);
      });
    });

    describe(':getFinancialOptionId()', () => {
      it('should equal financial option id from raw response', () => {
        const v = response.getFinancialOptionId();
        expect(v).toEqual(expectedFinancialOptionId);
      });
    });
  });
});
