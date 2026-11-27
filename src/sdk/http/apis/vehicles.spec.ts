const fixtures = require('../../../test/fixtures');

import Configuration from '../../config';
import { lookup } from './vehicles';

const fixture = (name: string, withValues: any = undefined): any =>
  fixtures.create(name, withValues);

describe('API: Vehicles', () => {
  describe('lookup()', () => {
    it('calls the correct URL', async () => {
      const fake = fixture('IConfiguration');
      const config = Configuration.bind(fake);

      const http = require('..');
      http.context = jest.fn(() => ({ requestForgeryToken: '-' }));
      http.json = jest.fn(
        () =>
          new Promise((resolve) => {
            const data = fixture('IVehicleLookupResponse');
            const response = fixture('IApiResponse', {
              response: data,
              successful: true,
            });
            resolve(response);
          })
      );
      const request = fixture('IVehicleLookupRequest');
      await lookup(request, config);

      const expected = `${fake.api.address}/v2/tradein/${request.registrationNumber}?mileage=${request.mileage}&condition=${request.condition}`;
      const args = http.json.mock.calls[0];
      expect(args[0]).toEqual(expected);
    });
    it('uses request forgery token', async () => {
      const config = Configuration.bind(fixture('IConfiguration'));

      const expected = 'rf-token';
      const http = require('..');
      http.context = jest.fn(() => ({ requestForgeryToken: expected }));
      http.json = jest.fn(
        () =>
          new Promise((resolve) => {
            const data = fixture('IVehicleLookupResponse');
            const response = fixture('IApiResponse', {
              response: data,
              successful: true,
            });
            resolve(response);
          })
      );
      const request = fixture('IVehicleLookupRequest');
      await lookup(request, config);

      const args = http.json.mock.calls[0];
      const headers = args[1].headers;
      expect(headers['x-rf-token']).toEqual(expected);
    });
    it('sets request forgery token', async () => {
      const config = Configuration.bind(fixture('IConfiguration'));

      const expected = 'rf-token';
      const httpContext = { requestForgeryToken: undefined };

      const http = require('..');
      http.captureStateContext = jest.fn((promise) => {
        return promise.then((response: any) => {
          httpContext.requestForgeryToken = response.requestForgeryToken;
          return response;
        });
      });
      http.json = jest.fn(
        () =>
          new Promise((resolve) => {
            const data = fixture('IVehicleLookupResponse');
            const response = fixture('IApiResponse', {
              response: data,
              successful: true,
              requestForgeryToken: expected,
            });
            resolve(response);
          })
      );
      const request = fixture('IVehicleLookupRequest');
      await lookup(request, config);

      expect(httpContext.requestForgeryToken).toEqual(expected);
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
        await lookup(fixture('IVehicleLookupRequest'), config);
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
        await lookup(fixture('IVehicleLookupRequest'), config);
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(Error);
    });
  });
});
