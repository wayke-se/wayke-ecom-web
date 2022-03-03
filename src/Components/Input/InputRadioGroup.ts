import HtmlNode from '../Extension/HtmlNode';
import InputError from './InputError';
import InputRadioField from './InputRadioField';

export interface RadioItem {
  id: string;
  value: string;
  title?: string;
  description?: string;
  meta?: string;
}

interface InputRadioGroupProps {
  title: string;
  name: string;
  checked: string;
  options: RadioItem[];
  error?: boolean;
  errorMessage?: string;
  onClick: (e: Event) => void;
}

class InputRadioGroup extends HtmlNode {
  private props: InputRadioGroupProps;
  private contexts: {
    error?: InputError;
  } = {};

  constructor(element: HTMLElement | null, props: InputRadioGroupProps) {
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

  setError(error: boolean) {
    this.props.error = error;
    this.updateBorder();
    this.contexts.error?.setError(error);
  }

  render() {
    this.node.innerHTML = `
     <fieldset class="waykeecom-input-group" role="radiogroup" aria-required="true">
        <legend class="waykeecom-input-group__legend">${this.props.title}</legend>
        ${this.props.options
          .map((option) => `<div class="waykeecom-input-group__item" id="${option.id}-node"></div>`)
          .join('')}
      </fieldset>
    `;

    this.updateBorder();
    if (this.props.errorMessage) {
      this.contexts.error = new InputError(this.node, {
        error: this.props.error,
        errorMessage: this.props.errorMessage,
      });
    }

    this.props.options.forEach(
      (option) =>
        new InputRadioField(this.node.querySelector<HTMLDivElement>(`#${option.id}-node`), {
          id: option.id,
          name: this.props.name,
          title: option.title || option.value,
          value: option.value,
          checked: this.props.checked === option.value,
          description: option.description,
          meta: option.meta,
          onClick: (e) => this.props.onClick(e),
        })
    );
  }
}

export default InputRadioGroup;
