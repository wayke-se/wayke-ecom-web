import * as fixtures from '../../../test/fixtures';
const fixture = (name: string, withValues: any = undefined): any =>
  fixtures.create(name, withValues);

import { ResponseError } from '../../errors/request-error';
import { VehicleUnavailableError } from '../../errors/vehicle-unavailable-error';
import handleResponseError from './handle-response-error';

describe('Handle response error', () => {
  describe('Given unspecified error code', () => {
    it('Should throw a generic error', async () => {
      const content = fixture('IApiResponse', {
        errorCode: -1,
      });
      const response = { json: () => Promise.resolve(content) } as any;
      const error = new ResponseError(response, '');

      await expect(handleResponseError(error)).rejects.toThrow(Error);
    });
  });

  describe('Given vehicle unavailable error code', () => {
    it('Should throw VehicleUnavailableError', async () => {
      const content = fixture('IApiResponse', {
        errorCode: 1,
      });
      const response = { json: () => Promise.resolve(content) } as any;
      const error = new ResponseError(response, '');

      await expect(handleResponseError(error)).rejects.toThrow(VehicleUnavailableError);
    });
  });
});
