import { sassPlugin } from 'esbuild-sass-plugin';

const Common = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  outdir: 'build',
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

export default Common;
