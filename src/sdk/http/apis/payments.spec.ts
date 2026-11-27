const fixtures = require('../../../test/fixtures');

import Configuration from '../../config';
import { lookup } from './payments';

const fixture = (name: string, withValues: any = undefined): any =>
  fixtures.create(name, withValues);

describe('API: Payments', () => {
  describe('lookup()', () => {
    it('calls the correct URL', async () => {
      const fake = fixture('IConfiguration');
      const config = Configuration.bind(fake);

      const http = require('..');
      http.context = jest.fn(() => ({ requestForgeryToken: '-' }));
      http.json = jest.fn(
        () =>
          new Promise((resolve) => {
            const data = fixture('IPaymentLookupResponse');
            const response = fixture('IApiResponse', {
              response: data,
              successful: true,
            });
            resolve(response);
          })
      );
      const request = fixture('IPaymentLookupRequest');
      await lookup(request, config);

      const expected = `${fake.api.address}/payment/${request.id}`;
      const args = http.json.mock.calls[0];
      expect(args[0]).toEqual(expected);
    });
    it('throws error if response was unsuccessful', async () => {
      const config = Configuration.bind(fixture('IConfiguration'));

      const http = require('..');
      http.context = jest.fn(() => ({ requestForgeryToken: '-' }));
      http.json = jest.fn(
        () =>
          new Promise((resolve) => {
            const response = fixture('IApiResponse', {
              successful: false,
            });
            resolve(response);
          })
      );

      let err;
      try {
        await lookup(fixture('IPaymentLookupRequest'), config);
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(Error);
    });
    it('throws error if data validation fails', async () => {
      const config = Configuration.bind(fixture('IConfiguration'));

      const http = require('..');
      http.context = jest.fn(() => ({ requestForgeryToken: '-' }));
      http.json = jest.fn(
        () =>
          new Promise((resolve) => {
            const response = fixture('IApiResponse', {
              response: null,
              successful: true,
            });
            resolve(response);
          })
      );

      let err;
      try {
        await lookup(fixture('IPaymentLookupRequest'), config);
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(Error);
    });
  });
});
