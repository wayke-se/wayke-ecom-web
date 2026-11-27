import { type MockInstance, vi } from 'vitest';

type Module = Record<string, any>;

/**
 * Replaces an exported function with a fresh mock for the rest of the spec file: no recorded
 * calls, running `implementation` (or returning undefined). Under jest the specs did this by
 * assigning `module.fn = jest.fn(implementation)`, which an ES module's exports do not allow.
 */
export const mockExport = <M extends Module, K extends keyof M & string>(
  module: M,
  name: K,
  implementation: (...args: never[]) => unknown = () => undefined
): MockInstance => {
  const spy = vi.spyOn(module, name) as unknown as MockInstance;
  spy.mockReset();
  spy.mockImplementation(implementation as never);
  return spy;
};
