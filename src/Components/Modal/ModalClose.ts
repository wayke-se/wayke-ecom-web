import ButtonClose from '../Button/ButtonClose';
import HtmlNode from '../Extension/HtmlNode';

interface ModalCloseProps {
  readonly id: string;
  readonly onClose?: () => void;
}
class ModalClose extends HtmlNode {
  private readonly props: ModalCloseProps;

  constructor(element: HTMLElement, props: ModalCloseProps) {
    super(element, {
      htmlTag: 'div',
      className: 'waykeecom-modal__close',
      id: props.id,
    });

    this.props = props;
    this.render();
  }

  render() {
    const { onClose } = this.props;
    this.node.innerHTML = '';

    if (onClose) {
      new ButtonClose(this.node, { title: 'Stäng modalen', onClick: () => onClose() });
    }
  }
}

export default ModalClose;
