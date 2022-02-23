const GridItem = (element: HTMLElement) => {
  const item = document.createElement('div');

  const className = ['waykeecom-overflow-grid__item'];
  item.className = className.join(' ');

  element.appendChild(item);

  const content = item;
  if (!content) throw 'Err no element';
  return content;
};

export default GridItem;
