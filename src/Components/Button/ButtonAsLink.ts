import HtmlNode from '../Extension/HtmlNode';

interface ButtonAsLinkProps {
  title: string;
  id?: string;
  disabled?: boolean;
  onClick?: (e: Event) => void;
}

class ButtonAsLink extends HtmlNode {
  private props: ButtonAsLinkProps;

  constructor(element: HTMLDivElement | null, props: ButtonAsLinkProps) {
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
        class="waykeecom-link"
        ${disabled && `disabled=""`}
      >
        ${title}
      </button>
    `;
    if (onClick) {
      this.node.querySelector<HTMLButtonElement>('button')?.addEventListener('click', onClick);
    }
  }
}

export default ButtonAsLink;
