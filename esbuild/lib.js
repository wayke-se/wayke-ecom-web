/* eslint-disable no-console */
import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import npmDts from 'npm-dts';
import packageJson from '../package.json' assert { type: 'json' };

/*
const { sassPlugin } = require('esbuild-sass-plugin');
const { Generator } = require('npm-dts');
const { build } = require('esbuild');
const { dependencies, peerDependencies } = require('../package.json');
*/

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
  outfile: 'dist/index.js',
});
await ctx;

const ctx2 = esbuild.build({
  ...shared,
  outfile: 'dist/index.mjs',
  format: 'esm',
});
await ctx2;

const timetaken = '⚡ Generating types done in';
console.time(timetaken);
const generator = new npmDts.Generator({
  entry: 'src/index.ts',
  output: 'dist/index.d.ts',
  help: true,
  logLevel: 'debug',
});

try {
  await generator.generate();
} catch (e) {
  console.log('Error occured while generating types');
} finally {
  console.timeEnd(timetaken);
}
