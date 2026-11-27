const fixtures = require('../../test/fixtures');
const fixture = (name: string): any => fixtures.create(name);

import { AuthMethod, IBankIdAuthResponse, IBankIdAuthApiResponse } from './types';
import { BankIdAuthResponse } from './bankid-auth-response';

describe('BankId Auth Response', () => {
  it('Should have order ref', () => {
    const apiResponse: IBankIdAuthApiResponse = fixture('IBankIdAuthApiResponse');

    const response = new BankIdAuthResponse(apiResponse, AuthMethod.QrCode);

    expect(response.getOrderRef()).toBe(apiResponse.orderRef);
  });

  describe('Given falsy response', () => {
    it('should throw', () => {
      expect(() => {
        new BankIdAuthResponse(null as any, AuthMethod.SameDevice);
      }).toThrowError();
    });
  });

  describe('Given falsy method', () => {
    it('should throw', () => {
      const apiResponse: IBankIdAuthApiResponse = fixture('IBankIdAuthApiResponse');
      expect(() => {
        new BankIdAuthResponse(apiResponse, null as any);
      }).toThrowError();
    });
  });

  describe('Given qr code method', () => {
    let apiResponse: IBankIdAuthApiResponse;
    let response: IBankIdAuthResponse;

    beforeAll(() => {
      apiResponse = fixture('IBankIdAuthApiResponse');
      response = new BankIdAuthResponse(apiResponse, AuthMethod.QrCode);
    });

    it('Should be qr code response', () => {
      expect(response.isQrCode).toBeTruthy();
    });

    it('Should have qr code', () => {
      expect(response.getQrCode()).toEqual(apiResponse.qrCodeAsBase64);
    });

    it(':getAutoStartUrl(), should throw', () => {
      expect(() => {
        response.getAutoLaunchUrl();
      }).toThrowError();
    });
  });

  describe('Given same device method', () => {
    let apiResponse: IBankIdAuthApiResponse;
    let response: IBankIdAuthResponse;

    beforeAll(() => {
      apiResponse = fixture('IBankIdAuthApiResponse');
      response = new BankIdAuthResponse(apiResponse, AuthMethod.SameDevice);
    });

    it('Should be same device response', () => {
      expect(response.isSameDevice).toBeTruthy();
    });

    it('Should have auto launch url', () => {
      expect(response.getAutoLaunchUrl()).toEqual(apiResponse.autoLaunchUrl);
    });

    it(':getQrCode(), should throw', () => {
      expect(() => {
        response.getQrCode();
      }).toThrowError();
    });
  });
});
