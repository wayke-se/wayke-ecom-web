import HtmlNode from '../Extension/HtmlNode';

class ModalDialog extends HtmlNode {
  constructor(element: HTMLElement) {
    super(element, {
      htmlTag: 'div',
      className: 'waykeecom-modal__dialog',
    });
  }
}

export default ModalDialog;
