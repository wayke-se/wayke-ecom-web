const { sassPlugin } = require('esbuild-sass-plugin');
const { build } = require('esbuild');

const shared = {
  entryPoints: ['src/styles/styles.scss'],
  bundle: true,
  minify: true,
  sourcemap: true,
  logLevel: 'info',
  loader: {
    '.woff': 'file',
    '.woff2': 'file',
  },
  plugins: [sassPlugin()],
};

build({
  ...shared,
  outfile: 'clip-ui/static/styles.css',
});
