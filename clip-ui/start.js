const clipUi = require('@ourstudio/clip-ui');

clipUi.serve({
  folder: `${__dirname}/components`,
  staticFolder: `${__dirname}/static`,
  containerClassName: 'waykevaluation-root',
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
