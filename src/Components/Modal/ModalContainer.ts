import HtmlNode from '../Extension/HtmlNode';
interface ModalContainerProps {
  id: string;
}
class ModalContainer extends HtmlNode {
  constructor(element: HTMLElement, { id }: ModalContainerProps) {
    super(element, {
      htmlTag: 'div',
      className: 'waykeecom-modal__container',
      id,
    });
  }
}

export default ModalContainer;
