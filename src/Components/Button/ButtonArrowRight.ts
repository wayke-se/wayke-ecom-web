import Loader from '../../Templates/Loader';
import Attach from './../Extension/Attach';

interface ButtonArrowRightProps {
  title: string;
  id: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (e: Event) => void;
}

class ButtonArrowRight extends Attach {
  private props: ButtonArrowRightProps;

  constructor(element: HTMLDivElement | null, props: ButtonArrowRightProps) {
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
    this.element.innerHTML = `
      <button
        type="button"
        id="${this.props.id}"
        title="${this.props.title}"
        ${this.props.disabled && `disabled=""`}
        class="waykeecom-button waykeecom-button--full-width waykeecom-button--action"
      >
        <span class="waykeecom-button__content">${this.props.title}</span>
        <span class="waykeecom-button__content">
          ${
            this.props.loading
              ? Loader({ type: 'inline' })
              : `
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  class="waykeecom-icon"
                >
                  <title>Ikon: pil höger</title>
                  <path d="m15.2 8.8-4.8 4.8-1.7-1.7 2.7-2.7H1.2C.5 9.2 0 8.7 0 8s.5-1.2 1.2-1.2h10.2L8.7 4.1l1.7-1.7 4.8 4.8.8.8-.8.8z" />
                </svg>`
          }
          
        </span>
      </button>
    `;
    if (this.props.onClick) {
      this.element
        .querySelector<HTMLButtonElement>('button')
        ?.addEventListener('click', this.props.onClick);
    }
  }
}

export default ButtonArrowRight;
