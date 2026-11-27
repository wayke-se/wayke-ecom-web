const fixtures = require('../../../test/fixtures');
const fixture = (name: string, withValues: any = undefined): any =>
  fixtures.create(name, withValues);

const http = require('..');
const authApi = require('./bankid/auth');
const collectApi = require('./bankid/collect');
const cancelApi = require('./bankid/cancel');
const qrcodeApi = require('./bankid/qrcode');
const bankidApiUtils = require('./bankid/utils');

import {
  IBankIdAuthApiResponse,
  IBankIdCollectApiResponse,
  IBankIdQrCodeApiResponse,
} from '../../bankid/types';
import { auth, collect, cancel, qrcode } from './bankid';

describe('API: BankId', () => {
  beforeAll(() => {
    bankidApiUtils.createRequest = jest.fn();
    authApi.getUrl = jest.fn();
    collectApi.getUrl = jest.fn();
    cancelApi.getUrl = jest.fn();
    qrcodeApi.getUrl = jest.fn();
  });

  describe('Given unsuccessful request', () => {
    beforeAll(() => {
      http.json = jest.fn(
        () =>
          new Promise((resolve) => {
            const response = fixture('IApiResponse', {
              successful: false,
            });
            resolve(response);
          })
      );
      http.raw = jest.fn(() => {
        throw new Error();
      });
    });

    describe(':auth()', () => {
      it('throws error', async () => {
        const request = fixture('IBankIdAuthRequest');

        let err: any;
        try {
          await auth(request);
        } catch (e) {
          err = e;
        }

        expect(err).toBeInstanceOf(Error);
      });
    });

    describe(':collect()', () => {
      it('throws error', async () => {
        const request = fixture('IBankIdCollectRequest');

        let err: any;
        try {
          await collect(request);
        } catch (e) {
          err = e;
        }

        expect(err).toBeInstanceOf(Error);
      });
    });

    describe(':cancel()', () => {
      it('throws error', async () => {
        const request = fixture('IBankIdCancelRequest');

        let err: any;
        try {
          await cancel(request);
        } catch (e) {
          err = e;
        }

        expect(err).toBeInstanceOf(Error);
      });
    });

    describe(':qrcode()', () => {
      it('throws error', async () => {
        const request = fixture('IBankIdQrCodeRequest');

        let err: any;
        try {
          await qrcode(request);
        } catch (e) {
          err = e;
        }

        expect(err).toBeInstanceOf(Error);
      });
    });

    afterAll(() => {
      http.json.mockRestore();
      http.raw.mockRestore();
    });
  });

  describe('Given successful request', () => {
    describe(':auth()', () => {
      let expectedResponse: IBankIdAuthApiResponse;

      beforeAll(() => {
        expectedResponse = fixture('IBankIdAuthApiResponse');
        http.json = jest.fn(
          () =>
            new Promise((resolve) => {
              const apiResponse = fixture('IApiResponse', {
                successful: true,
                response: expectedResponse,
              });
              resolve(apiResponse);
            })
        );
      });

      it('return auth response', async () => {
        const request = fixture('IBankIdAuthRequest');

        const response = await auth(request);

        expect(response).toEqual(expectedResponse);
      });

      afterAll(() => {
        http.json.mockRestore();
      });
    });

    describe(':collect()', () => {
      let expectedResponse: IBankIdCollectApiResponse;

      beforeAll(() => {
        expectedResponse = fixture('IBankIdCollectApiResponse');
        http.json = jest.fn(
          () =>
            new Promise((resolve) => {
              const apiResponse = fixture('IApiResponse', {
                successful: true,
                response: expectedResponse,
              });
              resolve(apiResponse);
            })
        );
      });

      it('return collect response', async () => {
        const request = fixture('IBankIdAuthRequest');

        const response = await collect(request);

        expect(response).toEqual(expectedResponse);
      });

      afterAll(() => {
        http.json.mockRestore();
      });
    });

    describe(':qrcode()', () => {
      let expectedResponse: IBankIdQrCodeApiResponse;

      beforeAll(() => {
        expectedResponse = fixture('IBankIdQrCodeApiResponse');
        http.json = jest.fn(
          () =>
            new Promise((resolve) => {
              const apiResponse = fixture('IApiResponse', {
                successful: true,
                response: expectedResponse,
              });
              resolve(apiResponse);
            })
        );
      });

      it('return qrcode response', async () => {
        const request = fixture('IBankIdQrCodeRequest');

        const response = await qrcode(request);

        expect(response).toEqual(expectedResponse);
      });

      afterAll(() => {
        http.json.mockRestore();
      });
    });
  });
});
