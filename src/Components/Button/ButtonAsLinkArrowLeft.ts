import HtmlNode from '../Extension/HtmlNode';

interface ButtonAsLinkArrowLeftProps {
  readonly title: string;
  readonly id?: string;
  disabled?: boolean;
  readonly onClick?: (e: Event) => void;
}

class ButtonAsLinkArrowLeft extends HtmlNode {
  private readonly props: ButtonAsLinkArrowLeftProps;

  constructor(element: HTMLDivElement | null, props: ButtonAsLinkArrowLeftProps) {
    super(element);
    this.props = props;
    this.render();
  }

  disabled(disable: boolean) {
    this.props.disabled = !disable;
    this.render();
  }

  render() {
    const { title, id, disabled, onClick } = this.props;
    this.node.innerHTML = `
      <button
        ${id ? `id="${id}"` : ''}
        title="${title}"
        class="waykeecom-link waykeecom-link--has-content"
        ${disabled && `disabled=""`}
      >
        <span class="waykeecom-link__content">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            class="waykeecom-icon"
            data-icon="Arrow left"
          >
            <path d="m.8 7.2 4.8-4.8 1.7 1.7-2.7 2.7h10.2c.7 0 1.2.5 1.2 1.2s-.5 1.2-1.2 1.2H4.6l2.7 2.7-1.7 1.7L.8 8.8 0 8l.8-.8z"/>
          </svg>
        </span>
        <span class="waykeecom-link__content">${title}</span>
      </button>
    `;
    if (onClick) {
      this.node.querySelector<HTMLButtonElement>('button')?.addEventListener('click', onClick);
    }
  }
}

export default ButtonAsLinkArrowLeft;
