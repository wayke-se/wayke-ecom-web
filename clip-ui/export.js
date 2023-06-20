const clipUi = require('@ourstudio/clip-ui');

clipUi.build({
  folder: `${__dirname}/components`,
  out: `out/yoy`,
  staticFolder: `${__dirname}/static`,
  injectHead: [
    {
      tag: 'link',
      attributes: [
        { key: 'rel', value: 'stylesheet' },
        { key: 'href', value: '/static/styles.css' },
      ],
    },
  ],
});
