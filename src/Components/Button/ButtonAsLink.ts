import Attach from '../Extension/Attach';

interface ButtonAsLinkProps {
  title: string;
  id: string;
  disabled?: boolean;
  onClick?: (e: Event) => void;
}

class ButtonAsLink extends Attach {
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
    this.element.innerHTML = `
      <button
        id="${this.props.id}"
        title="${this.props.title}"
        class="waykeecom-link"
        ${this.props.disabled && `disabled=""`}
      >
        ${this.props.title}
      </button>
    `;
    if (this.props.onClick) {
      this.element
        .querySelector<HTMLButtonElement>('button')
        ?.addEventListener('click', this.props.onClick);
    }
  }
}

export default ButtonAsLink;