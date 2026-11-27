import { vi } from 'vitest';
import * as fixtures from '../../test/fixtures';
import * as api from '../http/apis/bankid';
import { mockExport } from '../../test/mock-export';
const fixture = (name: string): any => fixtures.create(name);

import { BankIdAuthRequestBuilder } from './bankid-auth-request-builder';
import { IBankIdAuthRequest, AuthMethod, IBankIdCollectRequest } from './types';
import * as bankid from '.';
import { BankIdCollectRequestBuilder } from './bankid-collect-request-builder';
import { BankIdCancelRequestBuilder } from './bankid-cancel-request-builder';

describe('BankId Functions', () => {
  describe(':newAuthRequest()', () => {
    it('returns correct builder type', () => {
      const builder = bankid.newAuthRequest();

      expect(builder).toBeInstanceOf(BankIdAuthRequestBuilder);
    });

    it('returns a new builder instance', () => {
      const b1 = bankid.newAuthRequest();
      const b2 = bankid.newAuthRequest();

      expect(b1).not.toBe(b2);
    });
  });

  describe(':newCollectRequest()', () => {
    it('returns correct builder type', () => {
      const builder = bankid.newCollectRequest();

      expect(builder).toBeInstanceOf(BankIdCollectRequestBuilder);
    });

    it('returns a new builder instance', () => {
      const b1 = bankid.newCollectRequest();
      const b2 = bankid.newCollectRequest();

      expect(b1).not.toBe(b2);
    });
  });

  describe(':newCancelRequest()', () => {
    it('returns correct builder type', () => {
      const builder = bankid.newCancelRequest();

      expect(builder).toBeInstanceOf(BankIdCancelRequestBuilder);
    });

    it('returns a new builder instance', () => {
      const b1 = bankid.newCancelRequest();
      const b2 = bankid.newCancelRequest();

      expect(b1).not.toBe(b2);
    });
  });

  describe(':auth()', () => {
    let request: IBankIdAuthRequest;

    beforeAll(() => {
      mockExport(api, 'auth').mockImplementation(
        () =>
          new Promise((resolve) => {
            const response = fixture('IBankIdAuthApiResponse');
            resolve(response);
          })
      );

      request = fixture('IBankIdAuthRequest');
    });

    it('Should validate request', async () => {
      const spy = vi.spyOn(BankIdAuthRequestBuilder, 'validate');
      await bankid.auth(request);

      expect(spy).toHaveBeenCalledWith(request);
    });

    it('should be same method in response as request', async () => {
      const response = await bankid.auth(request);
      expect(response.getMethod()).toEqual(request.method);
    });

    afterAll(() => {
      api.auth.mockClear();
    });
  });

  describe(':collect()', () => {
    beforeAll(() => {
      mockExport(api, 'collect').mockImplementation(
        () =>
          new Promise((resolve) => {
            const response = fixture('IBankIdCollectApiResponse');
            resolve(response);
          })
      );
    });

    it('Should validate request', async () => {
      const request = fixture('IBankIdCollectRequest');
      const spy = vi.spyOn(BankIdCollectRequestBuilder, 'validate');

      await bankid.collect(request);

      expect(spy).toHaveBeenCalledWith(request);
    });

    afterAll(() => {
      api.collect.mockClear();
    });
  });

  describe(':cancel()', () => {
    beforeAll(() => {
      mockExport(api, 'cancel').mockImplementation(() => new Promise((resolve) => resolve(true)));
    });

    it('Should validate request', async () => {
      const request = fixture('IBankIdCancelRequest');
      const spy = vi.spyOn(BankIdCancelRequestBuilder, 'validate');

      await bankid.cancel(request);

      expect(spy).toHaveBeenCalledWith(request);
    });

    afterAll(() => {
      api.collect.mockClear();
    });
  });
});
