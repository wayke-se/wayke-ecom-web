import HtmlNode from '../Extension/HtmlNode';

interface ModalCloseProps {
  id: string;
  onClose?: () => void;
}
class ModalClose extends HtmlNode {
  private props: ModalCloseProps;

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

    this.node.innerHTML = `
      <button title="Stäng modalen" class="waykeecom-modal__close-btn">
        <span class="waykeecom-sr-only">Stäng modalen</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          class="waykeecom-icon"
          aria-hidden="true"
        >
          <path d="M9.1 8l5.9 5.9-1.1 1.1L8 9.1 2.1 15 1 13.9 6.9 8 1 2.1 2.1 1 8 6.9 13.9 1 15 2.1 9.1 8z" />
        </svg>
      </button>
    `;

    if (onClose) {
      this.node.querySelectorAll<HTMLButtonElement>('button').forEach((button) => {
        button.addEventListener('click', () => onClose());
      });
    }
  }
}

export default ModalClose;
