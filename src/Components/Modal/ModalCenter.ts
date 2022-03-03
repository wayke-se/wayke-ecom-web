import HtmlNode from '../Extension/HtmlNode';

interface ModalCenterProps {
  id: string;
}
class ModalCenter extends HtmlNode {
  constructor(element: HTMLElement, { id }: ModalCenterProps) {
    super(element, {
      htmlTag: 'div',
      className: 'waykeecom-modal__center',
      id,
    });
  }
}

export default ModalCenter;
