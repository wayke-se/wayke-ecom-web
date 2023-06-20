const { sassPlugin } = require('esbuild-sass-plugin');
const { build } = require('esbuild');

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
  outfile: 'dist-cdn/index.js',
  format: 'esm',
});
