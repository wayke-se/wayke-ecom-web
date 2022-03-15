const fs = require('fs');
const esbuild = require('esbuild');
const { createServer } = require('http');
const { sassPlugin } = require('esbuild-sass-plugin');

const getFiles = () => fs.readdirSync('component-library/component');
const clients = [];

let lock = false;
fs.watch('component-library/component', async () => {
  if (!lock) {
    lock = true;
    const files = getFiles();
    clients.forEach((res) => res.write(`data: ${JSON.stringify(files)}\n\n`));
    setTimeout(() => {
      lock = false;
    }, 1000);
  }
});

const EVENT_STREAM_PORT = 8001;

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
        'process.env.EVENT_STREAM_PORT': EVENT_STREAM_PORT,
      },
    }
  );
};

start();

createServer((req, res) => {
  return clients.push(
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      Connection: 'keep-alive',
    })
  );
}).listen(EVENT_STREAM_PORT);
