const { sassPlugin } = require('esbuild-sass-plugin');
const { build } = require('esbuild');
const { version } = require('../package.json');

const shared = {
  entryPoints: ['src/cdn.ts'],
  bundle: true,
  minify: true,
  sourcemap: true,
  logLevel: 'info',
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
  assetNames: `wayke-ecom-web@${version}-[name]-[hash]`,
  outfile: `dist-cdn/wayke-ecom-web@${version}.js`,
  format: 'esm',
});
