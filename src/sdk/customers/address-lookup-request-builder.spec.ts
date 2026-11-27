const fixtures = require('../../test/fixtures');

import { AddressLookupRequestBuilder } from './address-lookup-request-builder';

const fixture = (id: string): any => fixtures.create(id);

describe('AddressLookupRequestBuilder', () => {
  describe('.validateRequest()', () => {
    it('fails and throws error for missing request', () => {
      expect(() => {
        AddressLookupRequestBuilder.validateRequest(null as any);
      }).toThrowError();
    });
    it('fails and throws for missing personalNumber value', () => {
      expect(() => {
        const request = fixture('IAddressLookupRequest');
        delete request.personalNumber;
        AddressLookupRequestBuilder.validateRequest(request);
      }).toThrowError();
    });
    it('does not throw for valid requests', () => {
      expect(() => {
        const request = fixture('IAddressLookupRequest');
        AddressLookupRequestBuilder.validateRequest(request);
      }).not.toThrowError();
    });
  });

  describe(':forCustomer()', () => {
    it('returns the AddressLookupRequestBuilder instance', () => {
      const builder = new AddressLookupRequestBuilder();
      const instance = builder.forCustomer('123456-1234');

      expect(instance).toBe(builder);
    });
  });

  describe(':build()', () => {
    it('returns a IAddressLookupRequest for the specified builder properties', () => {
      const expected = fixture('IAddressLookupRequest');
      const actual = new AddressLookupRequestBuilder().forCustomer(expected.personalNumber).build();

      expect(actual).toEqual(expected);
    });
  });
});
