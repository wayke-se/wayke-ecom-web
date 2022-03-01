import Attach from '../Extension/Attach';
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
  onClick: (e: Event) => void;
}

class InputRadioGroup extends Attach {
  private props: InputRadioGroupProps;

  constructor(element: HTMLElement | null, props: InputRadioGroupProps) {
    super(element);

    this.props = props;
    this.render();
  }

  render() {
    this.element.innerHTML = `
     <fieldset class="waykeecom-input-group" role="radiogroup" aria-required="true">
        <legend class="waykeecom-input-group__legend">${this.props.title}</legend>
        ${this.props.options
          .map((option) => `<div class="waykeecom-input-group__item" id="${option.id}-node"></div>`)
          .join('')}
      </fieldset>
    `;

    this.props.options.forEach(
      (option) =>
        new InputRadioField(this.element.querySelector<HTMLDivElement>(`#${option.id}-node`), {
          id: option.id,
          name: 'condition',
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
