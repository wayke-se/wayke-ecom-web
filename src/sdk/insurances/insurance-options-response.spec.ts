import * as fixtures from '../../test/fixtures';
import { resolveNaptr } from 'dns';
import { InsuranceOptionsResponse } from './insurance-options-response';

const fixture = (name: string, withData: any = undefined): any => fixtures.create(name, withData);

describe('InsuranceOptionsResponse', () => {
  describe(':constructor()', () => {
    it('throws error for missing response param', () => {
      expect(() => {
        new InsuranceOptionsResponse(null as any);
      }).toThrowError();
    });
  });

  describe(':getInsuranceOptions()', () => {
    it('returns a IInsuranceOption with mapped data from IInsuranceOptionsResponse', () => {
      const response = fixture('IInsuranceOptionsResponse');

      const expected = [
        {
          name: response.insurances[0].name,
          price: response.insurances[0].price,
          unit: response.insurances[0].unit,
          includesFinancingInPrice: response.insurances[0].includesFinancingInPrice,
          addons: response.insurances[0].addons,
          branding: response.insurances[0].branding,
          description: response.insurances[0].description,
          insuranceItems: response.insurances[0].insuranceItems,
          legalUrl: response.insurances[0].legalUrl,
          legalDescription: response.insurances[0].legalDescription,
        },
        {
          name: response.insurances[1].name,
          price: response.insurances[1].price,
          unit: response.insurances[1].unit,
          includesFinancingInPrice: response.insurances[1].includesFinancingInPrice,
          addons: response.insurances[1].addons,
          description: response.insurances[1].description,
          branding: response.insurances[1].branding,
          insuranceItems: response.insurances[1].insuranceItems,
          legalUrl: response.insurances[1].legalUrl,
          legalDescription: response.insurances[1].legalDescription,
        },
      ];
      const actual = new InsuranceOptionsResponse(response).getInsuranceOptions();

      expect(actual).toEqual(expected);
    });
  });
});
