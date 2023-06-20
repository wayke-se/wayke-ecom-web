import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';

const Shared = {
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

const ctx = esbuild.build({
  ...Shared,
  outfile: 'dist-cdn/index.js',
  format: 'esm',
});

try {
  await ctx;
} catch (e) {
  // eslint-disable-next-line
  console.log('Error occured', e);
}
