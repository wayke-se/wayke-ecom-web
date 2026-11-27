import * as fixtures from '../../test/fixtures';
import { AddressLookupResponse } from './address-lookup-response';

const fixture = (name: string, withData: any = undefined): any => fixtures.create(name, withData);

describe('AddressLookupResponse', () => {
  describe(':constructor()', () => {
    it('throws error for missing response param', () => {
      expect(() => {
        new AddressLookupResponse(null as any);
      }).toThrowError();
    });
  });

  describe(':getAddress()', () => {
    it('returns a IAddressLookupResponse with the response address', () => {
      const response = fixture('IAddress');
      const expected = fixture('IAddressLookupResponse', response);
      const actual = new AddressLookupResponse(response).getAddress();

      expect(actual).toEqual(expected);
    });
  });
});
