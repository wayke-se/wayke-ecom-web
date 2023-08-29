import HtmlNode from '../Extension/HtmlNode';
import InputError from './InputError';

export interface SelectItem {
  value: string;
  title?: string;
  disabled?: boolean;
}

interface InputSelectProps {
  readonly title: string;
  readonly name: string;
  readonly id?: string;
  error?: boolean;
  errorMessage?: string;
  readonly value?: string;
  readonly options: SelectItem[];
  readonly onChange: (e: Event) => void;
}

class InputSelect extends HtmlNode {
  private readonly props: InputSelectProps;
  private contexts: {
    error?: InputError;
  } = {};

  constructor(element: HTMLElement | null, props: InputSelectProps) {
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
    const { id, options, value, name, title, error, errorMessage, onChange } = this.props;
    this.node.innerHTML = `
      <div class="waykeecom-input-label">
        <label for="wayke-estimated-mileage" class="waykeecom-input-label__label">${title}</label>
      </div>
      <select
        class="waykeecom-select"
        id="wayke-estimated-mileage"
        ${name ? `name="${name}"` : ''}
        ${id ? `id="${id}"` : ''}
      >
        ${options
          .map(
            (option) =>
              `<option
                value="${option.value}"
                ${option.disabled ? `disabled` : ''}
                ${option.value === value ? `selected="selected"` : ''}
                >${option.title || option.value}</option>`
          )
          .join('')}
      </select>
    `;

    this.updateBorder();
    if (errorMessage) {
      this.contexts.error = new InputError(this.node, {
        error,
        errorMessage,
      });
    }

    this.node.querySelector('select')?.addEventListener('change', (e) => onChange(e));
  }
}

export default InputSelect;
