/* eslint-disable no-console */

const { sassPlugin } = require('esbuild-sass-plugin');
const { Generator } = require('npm-dts');
const { build } = require('esbuild');
const { dependencies, peerDependencies } = require('../package.json');

const shared = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: true,
  sourcemap: true,
  logLevel: 'info',
  external: Object.keys(dependencies).concat(Object.keys(peerDependencies || {})),
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

build({
  ...shared,
  outfile: 'dist/index.js',
});

build({
  ...shared,
  outfile: 'dist/index.mjs',
  format: 'esm',
});

const timetaken = '⚡ Generating types done in';
console.time(timetaken);
new Generator({
  entry: 'src/index.ts',
  output: 'dist/index.d.ts',
  help: true,
  logLevel: 'debug',
})
  .generate()
  .then(() => console.timeEnd(timetaken))
  .catch(() => console.log('Error occured while generating types'));
