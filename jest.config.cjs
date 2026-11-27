// Runs the specs that came with the ecom API client in src/sdk (formerly the @wayke-se/ecom
// package). They are only transpiled here; as in that package, tsc does not type-check them.
module.exports = {
  // The client reads window.location for the order origin, and its specs replace it.
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['<rootDir>/src/sdk/**/*.spec.ts'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        diagnostics: false,
        tsconfig: { module: 'commonjs', isolatedModules: true, esModuleInterop: true },
      },
    ],
  },
};
