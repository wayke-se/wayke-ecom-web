const config = require("./common");

require("esbuild").serve(
  {
    servedir: "www",
    port: 5000,
  },
  Object.assign(config, {
    entryPoints: ['src/index-dev.ts'],
    outdir: "www/js",
  })
);
