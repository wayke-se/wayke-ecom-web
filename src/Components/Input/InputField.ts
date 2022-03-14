import HtmlNode from '../Extension/HtmlNode';
import InputError from './InputError';
import InputInformation from './InputInformation';

interface InputFieldProps {
  readonly title: string;
  readonly value: string;
  readonly name: string;
  readonly id: string;
  readonly unit?: string;
  error?: boolean;
  errorMessage?: string;
  readonly placeholder?: string;
  readonly information?: string;
  readonly type?: string;
  readonly autocomplete?: string;
  readonly onChange?: (e: Event) => void;
  readonly onBlur?: (e: Event) => void;
}

class InputField extends HtmlNode {
  private readonly props: InputFieldProps;
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
    const {
      id,
      title,
      type,
      name,
      value,
      autocomplete,
      placeholder,
      unit,
      error,
      errorMessage,
      information,
      onChange,
      onBlur,
    } = this.props;

    this.node.innerHTML = `
      <div class="waykeecom-input-label">
        <label for="${id}" class="waykeecom-input-label__label">${title}</label>
      </div>
      <div class="waykeecom-input-text">
        <input
          ${type ? `type="${type}"` : 'type="text"'}
          ${type === 'number' ? `pattern="[0-9]*"` : ''}
          id="${id}"
          value="${value}"
          name="${name}"
          ${autocomplete ? `autocomplete="${autocomplete}"` : ''}
          ${placeholder ? `placeholder="${placeholder}"` : ''}
          class="waykeecom-input-text__input"
        />
        ${unit ? `<div class="waykeecom-input-text__unit">${unit}</div>` : ''}
      </div>
    `;

    this.updateBorder();
    if (errorMessage) {
      this.contexts.error = new InputError(this.node, {
        error,
        errorMessage,
      });
    }

    if (information) {
      new InputInformation(this.node.querySelector<HTMLElement>('.waykeecom-input-label'), {
        information,
      });
    }

    const input = this.node.querySelector('input');
    if (input) {
      if (onChange) {
        input.addEventListener('input', onChange);
      }
      if (onBlur) {
        input.addEventListener('blur', onBlur);
      }
    }
  }
}

export default InputField;
