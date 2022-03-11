import HtmlNode from '../Extension/HtmlNode';
import InputError from './InputError';
import InputInformation from './InputInformation';

interface InputTextareaProps {
  readonly title: string;
  readonly value: string;
  readonly name: string;
  readonly id: string;
  readonly error?: boolean;
  readonly errorMessage?: string;
  readonly placeholder?: string;
  readonly information?: string;
  readonly autocomplete?: string;
  readonly onChange?: (e: Event) => void;
  readonly onBlur?: (e: Event) => void;
}

class InputTextarea extends HtmlNode {
  private readonly props: InputTextareaProps;
  private contexts: {
    error?: InputError;
  } = {};

  constructor(element: HTMLElement | null, props: InputTextareaProps) {
    super(element);

    this.props = props;
    this.render();
  }

  setError(error: boolean) {
    this.contexts.error?.setError(error);
  }

  private render() {
    const {
      title,
      value,
      name,
      id,
      error,
      errorMessage,
      placeholder,
      information,
      autocomplete,
      onChange,
      onBlur,
    } = this.props;

    this.node.innerHTML = `
      <div class="waykeecom-input-label">
        <label for="${id}" class="waykeecom-input-label__label">${title}</label>
      </div>
      <textarea
        id="${id}"
        name="${name}"
        ${autocomplete ? `autocomplete="${autocomplete}"` : ''}
        ${placeholder ? `placeholder="${placeholder}"` : ''}
        class="waykeecom-textarea"
      >${value}</textarea>
    `;

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

    const input = this.node.querySelector('textarea');
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

export default InputTextarea;
