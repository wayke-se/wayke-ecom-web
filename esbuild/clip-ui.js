import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';

const Shared = {
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
  ...Shared,
  outfile: 'clip-ui/static/build/styles.css',
});

await ctx;
