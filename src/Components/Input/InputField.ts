import HtmlNode from '../Extension/HtmlNode';
import InputError from './InputError';
import InputInformation from './InputInformation';

interface InputFieldProps {
  readonly title: string;
  readonly value: string;
  readonly name: string;
  readonly id: string;
  readonly unit?: string;
  readonly min?: number;
  error?: boolean;
  errorMessage?: string;
  readonly placeholder?: string;
  readonly information?: string;
  readonly type?: string;
  readonly autocomplete?: string;
  readonly pattern?: string;
  readonly inputmode?: string;
  readonly help?: string;
  readonly onChange?: (e: Event) => void;
  readonly onBlur?: (e: Event) => void;
  readonly onClickInformation?: (visible: boolean) => void;
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

    const { id } = this.props;
    if (error) {
      document.getElementById(id)?.setAttribute('aria-invalid', 'true');
      document.getElementById(id)?.setAttribute('aria-describedby', `${id}-error`);
    } else {
      document.getElementById(id)?.removeAttribute('aria-invalid');
      document.getElementById(id)?.removeAttribute('aria-describedby');
    }
  }

  private render() {
    const {
      id,
      title,
      type,
      name,
      min,
      value,
      autocomplete,
      placeholder,
      unit,
      error,
      errorMessage,
      information,
      pattern,
      inputmode,
      help,
      onChange,
      onBlur,
      onClickInformation,
    } = this.props;

    this.node.innerHTML = `
      <div class="waykeecom-input-label">
        <label for="${id}" class="waykeecom-input-label__label">${title}</label>
      </div>
      <div class="waykeecom-input-text">
        <input
          ${type ? `type="${type}"` : 'type="text"'}
          ${type === 'number' ? `pattern="[0-9]*" inputmode="numeric"` : ''}
          id="${id}"
          ${pattern ? `pattern="${pattern}"` : ''}
          ${inputmode ? `inputmode="${inputmode}"` : ''}
          value="${value}"
          name="${name}"
          ${min !== undefined ? `min="${min}"` : ''}
          ${autocomplete ? `autocomplete="${autocomplete}"` : ''}
          ${placeholder ? `placeholder="${placeholder}"` : ''}
          ${help ? `aria-describedby="${id}-help"` : ''}
          class="waykeecom-input-text__input"
        />
        ${unit ? `<div class="waykeecom-input-text__unit">${unit}</div>` : ''}
      </div>
      ${help ? `<div class="waykeecom-input-help" id="${id}-help">${help}</div>` : ''}
    `;

    this.updateBorder();

    if (errorMessage) {
      this.contexts.error = new InputError(this.node, {
        error,
        errorMessage,
        id: `${id}-error`,
      });
    }

    if (information) {
      new InputInformation(this.node.querySelector<HTMLElement>('.waykeecom-input-label'), {
        information,
        onClickInformation,
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
