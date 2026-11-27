const fixtures = require('../../test/fixtures');
const fixture = (name: string): any => fixtures.create(name);

import { BankIdQrCodeRequestBuilder } from './bankid-qrcode-request-builder';

const BANK_ID_QRCODE_REQUEST = 'IBankIdQrCodeRequest';

describe('BankIdQrCodeRequestBuilder', () => {
  describe('.validate()', () => {
    it('should throw given null request', () => {
      expect(() => {
        BankIdQrCodeRequestBuilder.validate(null as any);
      }).toThrowError();
    });

    it('should throw given missing orderRef', () => {
      expect(() => {
        const request = fixture(BANK_ID_QRCODE_REQUEST);
        delete request.orderRef;
        BankIdQrCodeRequestBuilder.validate(request);
      }).toThrowError();
    });

    it('does not throw for valid requests', () => {
      expect(() => {
        const request = fixture(BANK_ID_QRCODE_REQUEST);
        BankIdQrCodeRequestBuilder.validate(request);
      }).not.toThrowError();
    });
  });

  describe(':withOrderRef()', () => {
    it('returns the builder instance', () => {
      const builder = new BankIdQrCodeRequestBuilder();
      const instance = builder.withOrderRef('orderRef-fake');

      expect(instance).toBe(builder);
    });
  });

  describe(':build()', () => {
    it('returns a IBankIdQrCodeRequest for the specified builder properties', () => {
      const expected = fixture(BANK_ID_QRCODE_REQUEST);
      const actual = new BankIdQrCodeRequestBuilder().withOrderRef(expected.orderRef).build();

      expect(actual).toEqual(expected);
    });
  });
});
