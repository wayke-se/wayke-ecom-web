const StackItem = (element: HTMLElement) => {
  const item = document.createElement('div');

  const className = ['waykeecom-stack', 'waykeecom-stack--4'];
  item.className = className.join(' ');

  element.appendChild(item);

  const content = item;
  if (!content) throw 'Err no element';
  return content;
};

export default StackItem;
