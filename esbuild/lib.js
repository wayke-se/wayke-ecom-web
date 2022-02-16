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
  outfile: 'dist/index.esm.js',
  format: 'esm',
});

new Generator({
  entry: 'src/index.ts',
  output: 'dist/index.d.ts',
  help: true,
  logLevel: 'verbose',
}).generate();
