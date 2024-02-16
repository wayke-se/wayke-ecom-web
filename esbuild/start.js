import * as esbuild from 'esbuild';
import Common from './common.js';

const ctx = await esbuild.context({
  ...Common,
  entryPoints: ['src/index-dev.ts'],
  outdir: 'www/build',
});

ctx.serve({
  servedir: 'www',
  port: 5000,
});
