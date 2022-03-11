import HtmlNode from '../Extension/HtmlNode';
import ModalBody from './ModalBody';
import ModalCenter from './ModalCenter';
import ModalContainer from './ModalContainer';
import ModalDialog from './ModalDialog';
import ModalHeader from './ModalHeader';

interface ModalProps {
  title: string;
  id: string;
  onClose?: () => void;
}

class Modal extends HtmlNode {
  private props: ModalProps;
  content: HTMLElement;

  constructor(element: HTMLElement, props: ModalProps) {
    super(element, {
      htmlTag: 'div',
      className: 'waykeecom-modal',
      attributes: [
        {
          key: 'role',
          value: 'dialog',
        },
        { key: 'aria-modal', value: 'true' },
        { key: 'aria-labelledby', value: 'wayke-ecom-title' },
      ],
      id: props.id,
    });
    this.props = props;
    this.content = this.render();
  }

  render() {
    const { title, id, onClose } = this.props;
    const container = new ModalContainer(this.node, { id: `${id}-container` });
    const center = new ModalCenter(container.node, { id: `${id}-center` });
    const dialog = new ModalDialog(center.node, { id: `${id}-dialog` });
    new ModalHeader(dialog.node, {
      title,
      onClose,
      id: `${id}-header`,
    });
    const body = new ModalBody(dialog.node, {
      id: `${id}-body`,
    });
    return body.node;
  }
}

export default Modal;
