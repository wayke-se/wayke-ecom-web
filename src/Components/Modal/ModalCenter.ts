import HtmlNode from '../Extension/HtmlNode';

class ModalCenter extends HtmlNode {
  constructor(element: HTMLElement) {
    super(element, {
      htmlTag: 'div',
      className: 'waykeecom-modal__center',
    });
  }
}

export default ModalCenter;
