import { vi } from 'vitest';
import * as fixtures from '../../test/fixtures';
vi.mock('../http/apis/payments');

import Configuration from '../config';
import * as api from '../http/apis/payments';
import { PaymentLookupRequestBuilder } from './payment-lookup-request-builder';

import * as payments from '.';

const fixture = (name: string, withData: any = undefined): any => fixtures.create(name, withData);

describe('Payment Functions', () => {
  describe('newLookupRequest()', () => {
    it('returns a PaymentLookupRequestBuilder', () => {
      const builder = payments.newLookupRequest();

      expect(builder).toBeInstanceOf(PaymentLookupRequestBuilder);
    });
    it('returns a new instance of PaymentLookupRequestBuilder', () => {
      const b1 = payments.newLookupRequest();
      const b2 = payments.newLookupRequest();

      expect(b1).not.toBe(b2);
    });
  });

  describe('lookup()', () => {
    it('throws error if no configuration is bound', async () => {
      const request = fixture('IPaymentLookupRequest');

      let err;
      try {
        await payments.lookupPayment(request);
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(Error);
    });
    it('validates the provided request', async () => {
      const spy = vi.spyOn(PaymentLookupRequestBuilder, 'validateRequest');
      const request = fixture('IPaymentLookupRequest');

      (api.lookup as any).mockImplementation(
        () =>
          new Promise((resolve) => {
            const response = fixture('IPaymentLookupResponse');
            resolve(response);
          })
      );

      Configuration.bind(fixture('IConfiguration'));
      await payments.lookupPayment(request);

      expect(spy).toHaveBeenCalledWith(request);
    });
  });
});
