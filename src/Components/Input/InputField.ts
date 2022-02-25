import Attach from '../Attach';
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
  onChange?: (e: Event) => void;
  onBlur?: (e: Event) => void;
}

class InputField extends Attach {
  private props: InputFieldProps;
  private contexts: {
    error?: InputError;
  } = {};

  constructor(element: HTMLElement | null, props: InputFieldProps) {
    super(element);

    this.props = props;
    this.render();
  }

  setError(error: boolean) {
    this.contexts.error?.setError(error);
  }

  private render() {
    this.element.innerHTML = `
      <div class="waykeecom-input-label">
        <label for="${this.props.id}" class="waykeecom-input-label__label">${
      this.props.title
    }</label>
      </div>
      <div class="waykeecom-input-text">
        <input
          type="text"
          id="${this.props.id}"
          value="${this.props.value}"
          name="${this.props.name}"
          ${this.props.placeholder ? `placeholder="${this.props.placeholder}"` : ''}
          
          class="waykeecom-input-text__input"
        />
        ${this.props.unit ? `<div class="waykeecom-input-text__unit">${this.props.unit}</div>` : ''}
      </div>
    `;

    if (this.props.errorMessage) {
      this.contexts.error = new InputError(this.element, {
        error: this.props.error,
        errorMessage: this.props.errorMessage,
      });
    }

    if (this.props.information) {
      new InputInformation(this.element.querySelector<HTMLElement>('.waykeecom-input-label'), {
        information: this.props.information,
      });
    }

    const input = this.element.querySelector('input');
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
