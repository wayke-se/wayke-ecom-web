module.exports = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  outdir: 'build',
  loader: { '.js': 'jsx', '.woff': 'file', '.woff2': 'file', '.gif': 'file' },
};
