import { vi } from 'vitest';

export const mockResponse = (useBody?: string, useStatusCode?: number, useOK?: boolean) => {
  globalThis.fetch = vi.fn().mockImplementationOnce(
    () =>
      new Promise((resolve) =>
        resolve({
          ok: typeof useOK === 'boolean' ? useOK : true,
          status: typeof useStatusCode === 'number' ? useStatusCode : 200,
          json: () => (typeof useBody === 'string' ? JSON.parse(useBody) : {}),
          text: () => (typeof useBody === 'string' ? useBody : null),
        })
      )
  );
};
