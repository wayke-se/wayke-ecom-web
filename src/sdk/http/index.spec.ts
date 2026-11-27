import { vi } from 'vitest';
import { mockResponse } from '../../test/mocks/fetch';

import * as http from './index';

describe('HTTP helpers', () => {
  describe('json()', () => {
    it('calls fetch with correct URL and method', async () => {
      mockResponse('{}');
      const response = await http.json('https://www.test.com', {
        method: 'get',
      });

      const args = (fetch as any).mock.calls[0];
      expect(args[0]).toEqual('https://www.test.com');
      expect(args[1].method).toEqual('get');
    });
    it('resolves successful responses as JSON objects', async () => {
      mockResponse('{"id":"1"}');
      const response = await http.json('https://www.test.com', {
        method: 'get',
      });

      expect(response).toEqual({ id: '1' });
    });
    it('resolves null objects for status code 202', async () => {
      mockResponse('{"id":"1"}', 202);
      const response = await http.json('https://www.test.com', {
        method: 'get',
      });

      expect(response).toBeNull();
    });
    it('resolves null objects for status code 204', async () => {
      mockResponse('{"id":"1"}', 204);
      const response = await http.json('https://www.test.com', {
        method: 'get',
      });

      expect(response).toBeNull();
    });
    it('throws error for catching on errornuous status code', async () => {
      mockResponse(undefined, 500, false);

      const spyContainer = {
        catcher: vi.fn(),
      };
      const spy = vi.spyOn(spyContainer, 'catcher');

      const response = await http
        .json('https://www.test.com', {
          method: 'get',
        })
        .catch(spyContainer.catcher);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('raw()', () => {
    it('returns the raw response object', async () => {
      mockResponse('test');
      const response = await http.raw('https://www.test.com', {
        method: 'get',
      });
      const text = await response.text();

      expect(text).toBe('test');
    });
  });
});
