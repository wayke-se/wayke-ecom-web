import { vi } from 'vitest';
import * as fixtures from '../../test/fixtures';
vi.mock('../http/apis/customers');

import Configuration from '../config';
import * as api from '../http/apis/customers';
import { AddressLookupRequestBuilder } from './address-lookup-request-builder';
import { CustomerBuilder } from './customer-builder';

import * as customers from '.';

const fixture = (name: string, withData: any = undefined) => fixtures.create(name, withData);

describe('Customer Functions', () => {
  describe('newAddressLookupRequest()', () => {
    it('returns a AddressLookupRequestBuilder', () => {
      const builder = customers.newAddressLookupRequest();

      expect(builder).toBeInstanceOf(AddressLookupRequestBuilder);
    });
    it('returns a new instance of AddressLookupRequestBuilder', () => {
      const b1 = customers.newAddressLookupRequest();
      const b2 = customers.newAddressLookupRequest();

      expect(b1).not.toBe(b2);
    });
  });

  describe('newCustomer()', () => {
    it('returns a CustomerBuilder', () => {
      const builder = customers.newCustomer();

      expect(builder).toBeInstanceOf(CustomerBuilder);
    });
    it('returns a new instance of CustomerBuilder', () => {
      const b1 = customers.newCustomer();
      const b2 = customers.newCustomer();

      expect(b1).not.toBe(b2);
    });
  });

  describe('lookupAddress()', () => {
    it('throws error if no configuration is bound', async () => {
      const request = fixture('IAddressLookupRequest');

      let err;
      try {
        await customers.lookupAddress(request);
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(Error);
    });
    it('validates the provided request', async () => {
      const spy = vi.spyOn(AddressLookupRequestBuilder, 'validateRequest');
      const request = fixture('IAddressLookupRequest');

      (api.lookupAddress as any).mockImplementation(
        () =>
          new Promise((resolve) => {
            const response = fixture('IAddress');
            resolve(response);
          })
      );

      Configuration.bind(fixture('IConfiguration'));
      await customers.lookupAddress(request);

      expect(spy).toHaveBeenCalledWith(request);
      Configuration.destroy();
    });
  });
});
