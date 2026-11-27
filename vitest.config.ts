import { defineConfig } from 'vitest/config';

// Runs the specs that came with the ecom API client in src/sdk (formerly the @wayke-se/ecom
// package). `globals` gives them describe/it/expect without imports, as under jest.
export default defineConfig({
  test: {
    // The client reads window.location for the order origin.
    environment: 'jsdom',
    globals: true,
    include: ['src/sdk/**/*.spec.ts'],
  },
});
