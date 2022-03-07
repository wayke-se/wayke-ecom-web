import HtmlNode from '../Extension/HtmlNode';
import InputError from './InputError';
import InputInformation from './InputInformation';

interface InputFieldProps {
  title: string;
  value: string;
  name: string;
  id: string;
  unit?: string;
  error?: boolean;
  errorMessage?: string;
  placeholder?: string;
  information?: string;
  type?: string;
  autocomplete?: string;
  onChange?: (e: Event) => void;
  onBlur?: (e: Event) => void;
}

class InputField extends HtmlNode {
  private props: InputFieldProps;
  private contexts: {
    error?: InputError;
  } = {};

  constructor(element: HTMLElement | null, props: InputFieldProps) {
    super(element);

    this.props = props;
    this.render();
  }

  private updateBorder() {
    const border = this.node.querySelector('.waykeecom-input-text');
    if (border) {
      if (this.props.error) {
        border?.classList.add('waykeecom-input-text--has-error');
      } else {
        border?.classList.remove('waykeecom-input-text--has-error');
      }
    }
  }

  setError(error: boolean, errorMessage?: string) {
    this.props.error = error;
    if (errorMessage) {
      this.props.errorMessage = errorMessage;
    }
    this.updateBorder();
    this.contexts.error?.setError(error);
  }

  private render() {
    this.node.innerHTML = `
      <div class="waykeecom-input-label">
        <label for="${this.props.id}" class="waykeecom-input-label__label">${
      this.props.title
    }</label>
      </div>
      <div class="waykeecom-input-text">
        <input
          ${this.props.type ? `type="${this.props.type}"` : 'type="text"'}
          id="${this.props.id}"
          value="${this.props.value}"
          name="${this.props.name}"
          ${this.props.autocomplete ? `autocomplete="${this.props.autocomplete}"` : ''}
          ${this.props.placeholder ? `placeholder="${this.props.placeholder}"` : ''}
          class="waykeecom-input-text__input"
        />
        ${this.props.unit ? `<div class="waykeecom-input-text__unit">${this.props.unit}</div>` : ''}
      </div>
    `;

    this.updateBorder();
    if (this.props.errorMessage) {
      this.contexts.error = new InputError(this.node, {
        error: this.props.error,
        errorMessage: this.props.errorMessage,
      });
    }

    if (this.props.information) {
      new InputInformation(this.node.querySelector<HTMLElement>('.waykeecom-input-label'), {
        information: this.props.information,
      });
    }

    const input = this.node.querySelector('input');
    if (input) {
      if (this.props.onChange) {
        input.addEventListener('input', this.props.onChange);
      }
      if (this.props.onBlur) {
        input.addEventListener('blur', this.props.onBlur);
      }
    }
  }
}

export default InputField;
