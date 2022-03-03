import HtmlNode from '../Extension/HtmlNode';
import InputError from './InputError';
import InputInformation from './InputInformation';

interface InputTextareaProps {
  title: string;
  value: string;
  name: string;
  id: string;
  unit?: string;
  error?: boolean;
  errorMessage?: string;
  placeholder?: string;
  information?: string;
  autocomplete?: string;
  onChange?: (e: Event) => void;
  onBlur?: (e: Event) => void;
}

class InputTextarea extends HtmlNode {
  private props: InputTextareaProps;
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
    this.node.innerHTML = `
      <div class="waykeecom-input-label">
        <label for="${this.props.id}" class="waykeecom-input-label__label">${
      this.props.title
    }</label>
      </div>
      <textarea
        id="${this.props.id}"
        name="${this.props.name}"
        ${this.props.autocomplete ? `autocomplete="${this.props.autocomplete}"` : ''}
        ${this.props.placeholder ? `placeholder="${this.props.placeholder}"` : ''}
        class="waykeecom-textarea"
      >${this.props.value}</textarea>
    `;

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

    const input = this.node.querySelector('textarea');
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

export default InputTextarea;
