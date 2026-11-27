import * as fixtures from '../../../test/fixtures';
import * as http from '..';
import { mockExport } from '../../../test/mock-export';
import Configuration from '../../config';
import { find } from './insurances';

const fixture = (name: string, withData: any = undefined): any => fixtures.create(name, withData);

describe('API: Insurances', () => {
  describe('find()', () => {
    it('calls the correct URL', async () => {
      const fake = fixture('IConfiguration');
      const config = Configuration.bind(fake);

      mockExport(http, 'context', () => ({ requestForgeryToken: '-' }));
      mockExport(
        http,
        'json',
        () =>
          new Promise((resolve) => {
            const data = fixture('IInsuranceOptionsResponse');
            const response = fixture('IApiResponse', {
              response: data,
              successful: true,
            });
            resolve(response);
          })
      );
      await find(fixture('IInsuranceOptionsRequest'), config);

      const expected = `${fake.api.address}/v3/insurance`;
      const args = http.json.mock.calls[0];
      expect(args[0]).toEqual(expected);
    });
    it('uses request forgery token', async () => {
      const config = Configuration.bind(fixture('IConfiguration'));

      const expected = 'rf-token';
      mockExport(http, 'context', () => ({ requestForgeryToken: expected }));
      mockExport(
        http,
        'json',
        () =>
          new Promise((resolve) => {
            const data = fixture('IInsuranceOptionsResponse');
            const response = fixture('IApiResponse', {
              response: data,
              successful: true,
            });
            resolve(response);
          })
      );
      await find(fixture('IInsuranceOptionsRequest'), config);

      const args = http.json.mock.calls[0];
      const headers = args[1].headers;
      expect(headers['x-rf-token']).toEqual(expected);
    });
    it('sets request forgery token', async () => {
      const config = Configuration.bind(fixture('IConfiguration'));

      const expected = 'rf-token';
      const httpContext = { requestForgeryToken: undefined };

      mockExport(http, 'captureStateContext', (promise) => {
        return promise.then((response: any) => {
          httpContext.requestForgeryToken = response.requestForgeryToken;
          return response;
        });
      });
      mockExport(
        http,
        'json',
        () =>
          new Promise((resolve) => {
            const data = fixture('IInsuranceOptionsResponse');
            const response = fixture('IApiResponse', {
              response: data,
              successful: true,
              requestForgeryToken: expected,
            });
            resolve(response);
          })
      );
      await find(fixture('IInsuranceOptionsRequest'), config);

      expect(httpContext.requestForgeryToken).toEqual(expected);
    });
    it('throws error if response was unsuccessful', async () => {
      const config = Configuration.bind(fixture('IConfiguration'));

      mockExport(http, 'context', () => ({ requestForgeryToken: '-' }));
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

      let err;
      try {
        await find(fixture('IInsuranceOptionsRequest'), config);
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(Error);
    });
    it('throws error if data validation fails', async () => {
      const config = Configuration.bind(fixture('IConfiguration'));

      mockExport(http, 'context', () => ({ requestForgeryToken: '-' }));
      mockExport(
        http,
        'json',
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
        await find(fixture('IInsuranceOptionsRequest'), config);
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(Error);
    });
  });
});
