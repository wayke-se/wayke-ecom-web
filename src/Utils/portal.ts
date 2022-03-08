export const createPortal = () => {
  destroyPortal();
  const el = document.getElementById('wayke-ecom-modal-body');
  if (el) {
    (el.firstElementChild as HTMLDivElement).setAttribute('hidden', '');
  }
  const element = document.createElement('div');
  element.className = 'waykeecom-portal';
  el?.appendChild(element);
  return element;
};

export const destroyPortal = () => {
  const el = document.getElementById('wayke-ecom-modal-body');
  if (el) {
    (el.firstElementChild as HTMLDivElement).removeAttribute('hidden');
  }
  el?.childNodes.forEach((node, index) => {
    if (index > 0) {
      node.remove();
    }
  });
};
