const fs = require('fs');
const esbuild = require('esbuild');

const getFiles = () => fs.readdirSync('component-library/component');

fs.watch('component-library/component', () => {
  start();
});

const { sassPlugin } = require('esbuild-sass-plugin');

let ref;
const start = async () => {
  if (ref) {
    ref.stop();
  }
  ref = await esbuild.serve(
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
};

start();
