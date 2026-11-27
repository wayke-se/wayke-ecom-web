# Ecom API client

The client for the Wayke ecom REST API (`ecom.wayke.se`): order options and creation, payment
lookup, insurance, address and trade-in lookup, BankID and credit assessment.

This is the source of the `@wayke-se/ecom` npm package
([wayke-se/wayke-ecom-js](https://github.com/wayke-se/wayke-ecom-js)), copied here unchanged at
v4.6.1 (`65c61c8`) so the widget no longer depends on the package. Two things differ from that
source: the formatting follows this repository's Biome settings, and the lint suppression around
the development-only request logging in `http/index.ts` is written for Biome instead of ESLint.
Imports keep their original order (Biome's import sorting is off for this folder).

- The specs (`*.spec.ts`) came with it and run with `npm run test:unit`. Their fixtures and the
  fetch mock are in `src/test`.
- As in the package, `tsc` does not type-check the specs, and they are left out of the published
  types.
