import HtmlNode from '../Extension/HtmlNode';

class ModalBody extends HtmlNode {
  constructor(element: HTMLElement) {
    super(element, {
      htmlTag: 'div',
      className: 'waykeecom-modal__body',
    });
  }
}

export default ModalBody;
