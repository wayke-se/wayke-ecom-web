import Loader from '../../Templates/Loader';
import HtmlNode from '../Extension/HtmlNode';

interface ButtonProps {
  title: string;
  id?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (e: Event) => void;
}

class Button extends HtmlNode {
  private props: ButtonProps;

  constructor(element: HTMLDivElement | null, props: ButtonProps) {
    super(element);
    this.props = props;
    this.render();
  }

  isDisabled() {
    return this.props.disabled;
  }

  disabled(disabled: boolean) {
    if (this.props.disabled !== disabled) {
      this.props.disabled = disabled;
      this.render();
    }
  }

  loading(loading: boolean) {
    if (this.props.loading !== loading) {
      this.props.loading = loading;
      this.props.disabled = loading;
      this.render();
    }
  }

  render() {
    const { title, id, disabled, loading, onClick } = this.props;
    this.node.innerHTML = `
      <button
        type="button"
        ${id ? `id="${id}"` : ''}
        title="${title}"
        ${disabled && `disabled=""`}
        class="waykeecom-button waykeecom-button--full-width waykeecom-button--action"
      >
        <span class="waykeecom-button__content">${title}</span>
        <span class="waykeecom-button__content">
          ${loading ? Loader({ type: 'inline' }) : ''}
        </span>
      </button>
    `;
    if (onClick) {
      this.node.querySelector<HTMLButtonElement>('button')?.addEventListener('click', onClick);
    }
  }
}

export default Button;
