import { vi } from 'vitest';
import * as fixtures from '../../test/fixtures';
vi.mock('../http/apis/insurances');

import Configuration from '../config';
import * as api from '../http/apis/insurances';
import { InsuranceOptionsRequestBuilder } from './insurance-options-request-builder';

import * as insurances from '.';

const fixture = (name: string, withData: any = undefined) => fixtures.create(name, withData);

describe('Insurance Functions', () => {
  describe('newInsuranceOptionsRequest()', () => {
    it('returns a InsuranceOptionsRequestBuilder', () => {
      const builder = insurances.newInsuranceOptionsRequest();

      expect(builder).toBeInstanceOf(InsuranceOptionsRequestBuilder);
    });
    it('returns a new instance of InsuranceOptionsRequestBuilder', () => {
      const b1 = insurances.newInsuranceOptionsRequest();
      const b2 = insurances.newInsuranceOptionsRequest();

      expect(b1).not.toBe(b2);
    });
  });

  describe('getOptions()', () => {
    it('throws error if no configuration is bound', async () => {
      const request = fixture('IInsuranceOptionsRequest');

      let err;
      try {
        await insurances.getOptions(request);
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(Error);
    });
    it('validates the provided request', async () => {
      const spy = vi.spyOn(InsuranceOptionsRequestBuilder, 'validateRequest');
      const request = fixture('IInsuranceOptionsRequest');

      (api.find as any).mockImplementation(
        () =>
          new Promise((resolve) => {
            const response = fixture('IInsuranceOptionsResponse');
            resolve(response);
          })
      );

      Configuration.bind(fixture('IConfiguration'));
      await insurances.getOptions(request);

      expect(spy).toHaveBeenCalledWith(request);
    });
  });
});
