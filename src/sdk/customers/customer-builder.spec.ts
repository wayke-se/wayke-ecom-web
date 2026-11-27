import * as fixtures from '../../test/fixtures';
import { CustomerBuilder } from './customer-builder';
import { IAddress, ICustomer } from './types';

const fixture = (id: string, withData: any = undefined): any => fixtures.create(id, withData);

describe('CustomerBuilder', () => {
  describe(':build()', () => {
    it('returns a ICustomer for the specified builder properties', () => {
      const expected = fixture('ICustomer');

      const actual = new CustomerBuilder()
        .withAddress(expected.address)
        .withEmail(expected.email)
        .withPersonalNumber(expected.personalNumber)
        .withPhoneNumber(expected.phoneNumber)
        .withGivenName(expected.givenName)
        .withSurname(expected.surname)
        .build();

      expect(actual).toEqual(expected);
    });
  });

  describe(':withAddress()', () => {
    let expected: IAddress;
    let actual: ICustomer;

    beforeAll(() => {
      expected = fixture('IAddress');
      actual = new CustomerBuilder().withAddress(expected).build();
    });

    it('sets given name', () => {
      expect(actual.givenName).toBe(expected.givenName);
    });

    it('sets surname', () => {
      expect(actual.surname).toBe(expected.surname);
    });

    it('sets name', () => {
      expect(actual.name).toBe(expected.name);
    });

    it('sets address', () => {
      expect(actual.address).toBe(expected);
    });
  });
});
