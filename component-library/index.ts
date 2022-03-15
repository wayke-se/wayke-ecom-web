import HtmlNode from '../src/Components/Extension/HtmlNode';
import '../src/styles/styles.scss';

// List of html files
const componentList = ['ComponentA.html', 'ComponentB.html', 'ComponentA.html'];

const basePath = 'component/';
const loadHTML = async (htmlRelativeUrl: string) => {
  return fetch(`${basePath}${htmlRelativeUrl}`).then((response) => response.text());
};

const resolve = async (url: string) => {
  const template = await loadHTML(url);

  // Component list
  const root = document.getElementById('cl-main');
  if (root) {
    const { node } = new HtmlNode(root, { htmlTag: 'div', id: url });
    node.className = 'cl-section';
    node.innerHTML = template;
  }

  // Navigation
  const navigation = document.getElementById('cl-nav');
  if (navigation) {
    const { node } = new HtmlNode(navigation, { htmlTag: 'div', id: url });
    node.innerHTML = `<a href="#${url}">${url}</a>`;
  }
};

window.addEventListener('DOMContentLoaded', async (_) => {
  for (const url of componentList) {
    await resolve(url);
  }
});
