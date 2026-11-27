# Ecom API client

The client for the Wayke ecom REST API (`ecom.wayke.se`): order options and creation, payment
lookup, insurance, address and trade-in lookup, BankID and credit assessment.

This is the source of the `@wayke-se/ecom` npm package
([wayke-se/wayke-ecom-js](https://github.com/wayke-se/wayke-ecom-js)), copied here unchanged at
v4.6.1 (`65c61c8`) so the widget no longer depends on the package. Two things differ from that
source: the formatting follows this repository's Biome settings, and the lint suppression around
the development-only request logging in `http/index.ts` is written for Biome instead of ESLint.
Imports keep their original order (Biome's import sorting is off for this folder).

- The specs (`*.spec.ts`) came with it and run with vitest (`npm run test:unit`, part of
  `npm test`). They were written for jest and converted: imports instead of `require()`,
  `vi` for `jest`, and `mockExport()` (`src/test/mock-export.ts`) where a spec replaced an
  exported function by assigning to it, which an ES module does not allow.
- A spy on an export only reaches callers in other modules. A function that calls its own
  module's export directly (like `getUrl` in `http/apis/bankid/*`) still runs the real one, so
  give it what it needs (a bound `Configuration`) rather than mocking it.
- Test data comes from `src/test/fixtures`, built with a small port of the deprecated
  `autofixture` package (`src/test/fixtures/factory.js`).
- As in the package, `tsc` does not type-check the specs, and they are left out of the published
  types.
