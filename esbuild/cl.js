const fs = require('fs');

const getFiles = () => fs.readdirSync('component-library/component');

const { sassPlugin } = require('esbuild-sass-plugin');

require('esbuild').serve(
  {
    servedir: 'component-library',
    port: 8000,
  },
  {
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
    define: {
      'process.env.COMPONENT_FILES': JSON.stringify(getFiles()),
    },
  }
);
