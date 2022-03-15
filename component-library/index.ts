import '../src/styles/styles.scss';
import HtmlNode from './html-node';

const regexComment = /<!--(.|\n)*?-->/g;

const basePath = 'component/';
const loadHTML = async (htmlRelativeUrl: string) => {
  return fetch(`${basePath}${htmlRelativeUrl}`).then((response) => response.text());
};

const resolve = async (url: string) => {
  const template = await loadHTML(url);
  const componentName = url.split('.').slice(0, -1).join('.').replace('-', ' ');
  const componentDescription = template
    .match(regexComment)?.[0]
    ?.replace(/<!--|-->/g, '')
    ?.trim();

  // Component list
  const root = document.getElementById('cl-main');
  if (root) {
    const { node } = new HtmlNode(root, { htmlTag: 'div', id: url });

    node.className = 'cl-section';
    node.innerHTML = `
      <h2 class="cl-section__title">${componentName}</h2>
      ${
        componentDescription
          ? `<div class="cl-section__description">${componentDescription}</div>`
          : ''
      }
      <div class="cl-section__body">
        ${template}
      </div>
    `;
  }

  // Navigation
  const navigation = document.getElementById('cl-nav');
  if (navigation) {
    const { node } = new HtmlNode(navigation, { htmlTag: 'div' });
    node.className = 'cl-nav__item';
    node.innerHTML = `<a href="#${url}" title="View component ${url}" class="cl-nav__link">${componentName}</a>`;
  }
};

window.addEventListener('DOMContentLoaded', async (_) => {
  new EventSource(`http://localhost:${process.env.EVENT_STREAM_PORT}`).onmessage = async (ev) => {
    const data = JSON.parse(ev.data) as string[];
    const root = document.getElementById('cl-main');
    if (root) {
      root.innerHTML = '';
    }

    const navigation = document.getElementById('cl-nav');
    if (navigation) {
      navigation.innerHTML = '';
    }

    for (const url of data) {
      await resolve(url);
    }
  };

  for (const url of process.env.COMPONENT_FILES as unknown as string[]) {
    await resolve(url);
  }
});
