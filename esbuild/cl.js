const { sassPlugin } = require('esbuild-sass-plugin');

config = {
  entryPoints: ['component-library/index.ts'],
  bundle: true,
  outdir: 'component-library',
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

require('esbuild').serve(
  {
    servedir: 'component-library',
    port: 8000,
  },
  config
);
