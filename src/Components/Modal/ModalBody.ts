import HtmlNode from '../Extension/HtmlNode';

interface ModalBodyProps {
  id: string;
}

class ModalBody extends HtmlNode {
  constructor(element: HTMLElement, { id }: ModalBodyProps) {
    super(element, {
      htmlTag: 'div',
      className: 'waykeecom-modal__body',
      id,
    });
  }
}

export default ModalBody;
