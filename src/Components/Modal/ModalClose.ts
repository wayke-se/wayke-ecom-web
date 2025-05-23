import i18next from '@i18n';
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

    // Add keydown listener for Escape key if onClose is provided
    if (this.props.onClose) {
      window.addEventListener('keydown', this.handleKeydown);
    }
  }

  private handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.props.onClose && this.props.onClose();
    }
  };

  render() {
    const { onClose } = this.props;
    this.node.innerHTML = '';

    if (onClose) {
      new ButtonClose(this.node, {
        title: i18next.t('glossary.closeModal'),
        onClick: () => onClose(),
      });
    }
  }
}

export default ModalClose;
