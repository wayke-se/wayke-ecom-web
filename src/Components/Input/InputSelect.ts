import Attach from '../Extension/Attach';

export interface SelectItem {
  value: string;
  title?: string;
}

interface InputSelectProps {
  title: string;
  name: string;
  id?: string;
  value?: string;
  options: SelectItem[];
  onChange: (e: Event) => void;
}

class InputSelect extends Attach {
  private props: InputSelectProps;
  constructor(element: HTMLElement | null, props: InputSelectProps) {
    super(element);

    this.props = props;
    this.render();
  }

  render() {
    this.element.innerHTML = `
      <div class="waykeecom-input-label">
        <label for="wayke-estimated-mileage" class="waykeecom-input-label__label">Uppskattad körsträcka per år</label>
      </div>
      <select
        class="waykeecom-select"
        id="wayke-estimated-mileage"
        ${this.props.id ? `id="${this.props.id}"` : ''}
      >
        ${this.props.options
          .map(
            (option) =>
              `<option value="${option.value}" ${
                option.value === this.props.value ? `selected="selected"` : ''
              }>${option.title || option.value}</option>`
          )
          .join('')}
      </select>
    `;

    this.element.querySelector('select')?.addEventListener('change', (e) => this.props.onChange(e));
  }
}

export default InputSelect;
