import * as fixtures from '../../test/fixtures';
const fixture = (name: string): any => fixtures.create(name);

import { BankIdCancelRequestBuilder } from './bankid-cancel-request-builder';

const REQUEST_NAME = 'IBankIdCancelRequest';

describe('BankIdCancelRequestBuilder', () => {
  describe('.validate()', () => {
    it('should throw given null request', () => {
      expect(() => {
        BankIdCancelRequestBuilder.validate(null as any);
      }).toThrowError();
    });

    it('should throw given missing order ref', () => {
      expect(() => {
        const request = fixture(REQUEST_NAME);
        delete request.orderRef;
        BankIdCancelRequestBuilder.validate(request);
      }).toThrowError();
    });

    it('does not throw for valid requests', () => {
      expect(() => {
        const request = fixture(REQUEST_NAME);
        BankIdCancelRequestBuilder.validate(request);
      }).not.toThrowError();
    });
  });

  describe(':withOrderRef()', () => {
    it('returns the builder instance', () => {
      const builder = new BankIdCancelRequestBuilder();
      const instance = builder.withOrderRef('order-ref');

      expect(instance).toBe(builder);
    });
  });

  describe(':build()', () => {
    it('returns request with specified properties', () => {
      const expected = fixture(REQUEST_NAME);
      const actual = new BankIdCancelRequestBuilder().withOrderRef(expected.orderRef).build();

      expect(actual).toEqual(expected);
    });
  });
});
