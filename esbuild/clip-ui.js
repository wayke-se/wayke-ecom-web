import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';

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

const ctx = esbuild.build({
  ...shared,
  outfile: 'clip-ui/static/styles.css',
});
await ctx;
