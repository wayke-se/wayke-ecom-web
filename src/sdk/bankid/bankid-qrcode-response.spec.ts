const fixtures = require('../../test/fixtures');
const fixture = (name: string): any => fixtures.create(name);

import { IBankIdQrCodeResponse, IBankIdQrCodeApiResponse } from './types';
import { BankIdQrCodeResponse } from './bankid-qrcode-response';

describe('BankId QrCode Response', () => {
  it('Should have order ref', () => {
    const apiResponse: IBankIdQrCodeApiResponse = fixture('IBankIdQrCodeApiResponse');

    const response = new BankIdQrCodeResponse(apiResponse);

    expect(response.getOrderRef()).toBe(apiResponse.orderRef);
  });

  describe('Given falsy response', () => {
    it('should throw', () => {
      expect(() => {
        new BankIdQrCodeResponse(null as any);
      }).toThrowError();
    });
  });

  describe('Given falsy orderRef', () => {
    it('should throw', () => {
      const apiResponse: IBankIdQrCodeApiResponse = fixture('IBankIdQrCodeApiResponse');
      apiResponse.orderRef = '';
      expect(() => {
        new BankIdQrCodeResponse(apiResponse);
      }).toThrowError();
    });
  });

  describe('Given falsy QR code', () => {
    it('should throw', () => {
      const apiResponse: IBankIdQrCodeApiResponse = fixture('IBankIdQrCodeApiResponse');
      apiResponse.qrCodeAsBase64 = '';
      expect(() => {
        new BankIdQrCodeResponse(apiResponse);
      }).toThrowError();
    });
  });

  describe('Given valid orderRef', () => {
    let apiResponse: IBankIdQrCodeApiResponse;
    let response: IBankIdQrCodeResponse;

    beforeAll(() => {
      apiResponse = fixture('IBankIdQrCodeApiResponse');
      response = new BankIdQrCodeResponse(apiResponse);
    });

    it('Should have qr code', () => {
      expect(response.getQrCode()).toEqual(apiResponse.qrCodeAsBase64);
    });
  });
});
