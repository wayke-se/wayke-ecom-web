import * as fixtures from '../../../test/fixtures';
import * as http from '..';
import Configuration from '../../config';
import * as bankidApiUtils from './bankid/utils';
import { mockExport } from '../../../test/mock-export';
const fixture = (name: string, withValues: any = undefined): any =>
  fixtures.create(name, withValues);

import {
  IBankIdAuthApiResponse,
  IBankIdCollectApiResponse,
  IBankIdQrCodeApiResponse,
} from '../../bankid/types';
import { auth, collect, cancel, qrcode } from './bankid';

describe('API: BankId', () => {
  beforeAll(() => {
    mockExport(bankidApiUtils, 'createRequest');
    // The request modules build their URL with their own getUrl, which an ES module's caller
    // cannot replace (under jest the spec mocked it); give it a configuration to build from.
    Configuration.bind(fixture('IConfiguration'));
  });

  describe('Given unsuccessful request', () => {
    beforeAll(() => {
      mockExport(
        http,
        'json',
        () =>
          new Promise((resolve) => {
            const response = fixture('IApiResponse', {
              successful: false,
            });
            resolve(response);
          })
      );
      mockExport(http, 'raw', () => {
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
        mockExport(
          http,
          'json',
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
        mockExport(
          http,
          'json',
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
        mockExport(
          http,
          'json',
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
