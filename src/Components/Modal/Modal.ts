import { MarketCode } from '../../@types/MarketCode';
import { trapFocus } from '../../Utils/trapFocus';
import HtmlNode from '../Extension/HtmlNode';
import ModalBody from './ModalBody';
import ModalCenter from './ModalCenter';
import ModalClose from './ModalClose';
import ModalContainer from './ModalContainer';
import ModalDialog from './ModalDialog';
import ModalFooter from './ModalFooter';
import ModalHeader from './ModalHeader';

interface ModalProps {
  readonly title: string;
  readonly id: string;
  readonly logo?: string;
  readonly logoX2?: string;
  readonly onClose?: () => void;
  readonly marketCode: MarketCode;
}

class Modal extends HtmlNode {
  private readonly props: ModalProps;
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
    trapFocus(this.node); // Trap focus within the modal
  }

  render() {
    const { title, id, onClose } = this.props;
    const container = new ModalContainer(this.node, { id: `${id}-container` });
    const center = new ModalCenter(container.node, { id: `${id}-center` });
    const dialog = new ModalDialog(center.node, { id: `${id}-dialog` });
    new ModalClose(dialog.node, { id: `${id}-close`, onClose });
    new ModalHeader(dialog.node, {
      title,
      logo: this.props.logo,
      logoX2: this.props.logoX2,
      onClose,
      id: `${id}-header`,
      marketCode: this.props.marketCode,
    });
    const body = new ModalBody(dialog.node, {
      id: `${id}-body`,
    });
    new ModalFooter(dialog.node, {
      id: `${id}-footer`,
      marketCode: this.props.marketCode,
    });

    return body.node;
  }
}

export default Modal;
