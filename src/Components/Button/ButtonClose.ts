import HtmlNode from '../Extension/HtmlNode';

interface ButtonCloseProps {
  readonly title: string;
  readonly id?: string;
  readonly onClick?: (e: Event) => void;
}

class ButtonClose extends HtmlNode {
  private readonly props: ButtonCloseProps;

  constructor(element: HTMLElement | null, props: ButtonCloseProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    const { title, id, onClick } = this.props;

    this.node.innerHTML = `
      <button
        title="${title}"
        ${id ? `id="${id}"` : ''}
        class="waykeecom-modal__close-btn"
      >
        <span class="waykeecom-sr-only">${title}</span>
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
    if (onClick) {
      this.node.querySelector<HTMLButtonElement>('button')?.addEventListener('click', onClick);
    }
  }
}

export default ButtonClose;
