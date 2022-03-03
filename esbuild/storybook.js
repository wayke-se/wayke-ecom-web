const { sassPlugin } = require('esbuild-sass-plugin');
const { build } = require('esbuild');

const shared = {
  entryPoints: ['src/styles/styles.scss'],
  bundle: true,
  minify: true,
  sourcemap: false,
  logLevel: 'info',
  loader: {
    '.woff': 'file',
    '.woff2': 'file',
  },
  plugins: [sassPlugin()],
};

build({
  ...shared,
  outfile: 'src/stories/assets/styles/styles.min.css',
  format: 'esm',
});
