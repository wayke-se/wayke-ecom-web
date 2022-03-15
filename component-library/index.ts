import HtmlNode from '../src/Components/Extension/HtmlNode';
import '../src/styles/styles.scss';

const basePath = 'component/';
const loadHTML = async (htmlRelativeUrl: string) => {
  return fetch(`${basePath}${htmlRelativeUrl}`).then((response) => response.text());
};

const resolve = async (url: string) => {
  const template = await loadHTML(url);
  const componentName = url.split('.').slice(0, -1).join('.').replace('-', ' ');

  // Component list
  const root = document.getElementById('cl-main');
  if (root) {
    const { node } = new HtmlNode(root, { htmlTag: 'div', id: url });
    node.className = 'cl-section';
    node.innerHTML = `
      <h2 class="cl-section__title">${componentName}</h2>
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
  for (const url of process.env.COMPONENT_FILES as unknown as string[]) {
    await resolve(url);
  }
});
