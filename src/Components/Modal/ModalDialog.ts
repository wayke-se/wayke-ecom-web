import HtmlNode from '../Extension/HtmlNode';

interface ModalDialogProps {
  id: string;
}
class ModalDialog extends HtmlNode {
  constructor(element: HTMLElement, { id }: ModalDialogProps) {
    super(element, {
      htmlTag: 'div',
      className: 'waykeecom-modal__dialog',
      id,
    });
  }
}

export default ModalDialog;
