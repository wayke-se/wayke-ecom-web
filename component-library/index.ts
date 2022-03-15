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
  const root = document.getElementById('root');
  if (root) {
    const { node } = new HtmlNode(root, { htmlTag: 'div', id: url });
    node.innerHTML = template;
  }

  const navigation = document.getElementById('navigation');
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
