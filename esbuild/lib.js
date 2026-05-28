/* eslint-disable no-console */
import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import packageJson from '../package.json' with {type: 'json'};

const shared = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: true,
  sourcemap: true,
  logLevel: 'info',
  external: Object.keys(packageJson.dependencies || {}).concat(
    Object.keys(packageJson.peerDependencies || {})
  ),
  loader: {
    '.js': 'jsx',
    '.woff': 'file',
    '.woff2': 'file',
    '.gif': 'file',
    '.svg': 'dataurl',
    '.png': 'dataurl',
  },
  plugins: [sassPlugin()],
};

const ctx = esbuild.build({
  ...shared,
  outfile: 'dist/index.cjs',
  format: 'cjs',
});
await ctx;

const ctx2 = esbuild.build({
  ...shared,
  outfile: 'dist/index.mjs',
  format: 'esm',
});
await ctx2;
