import HtmlNode from '../Extension/HtmlNode';
import ModalCenter from './ModalCenter';

class ModalContainer extends HtmlNode {
  constructor(element: HTMLElement) {
    super(element, {
      htmlTag: 'div',
      className: 'waykeecom-modal__container',
    });
    this.render();
  }
  render() {
    new ModalCenter(this.node);
  }
}

export default ModalContainer;
