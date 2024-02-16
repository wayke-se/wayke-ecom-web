import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';

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

const ctx = esbuild.build({
  ...shared,
  outfile: 'dist-cdn/index.js',
  format: 'esm',
});
await ctx;
