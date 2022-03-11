import HtmlNode from '../Extension/HtmlNode';

export interface SelectItem {
  value: string;
  title?: string;
}

interface InputSelectProps {
  readonly title: string;
  readonly name: string;
  readonly id?: string;
  readonly value?: string;
  readonly options: SelectItem[];
  readonly onChange: (e: Event) => void;
}

class InputSelect extends HtmlNode {
  private readonly props: InputSelectProps;
  constructor(element: HTMLElement | null, props: InputSelectProps) {
    super(element);

    this.props = props;
    this.render();
  }

  render() {
    const { id, options, value, onChange } = this.props;
    this.node.innerHTML = `
      <div class="waykeecom-input-label">
        <label for="wayke-estimated-mileage" class="waykeecom-input-label__label">Uppskattad körsträcka per år</label>
      </div>
      <select
        class="waykeecom-select"
        id="wayke-estimated-mileage"
        ${id ? `id="${id}"` : ''}
      >
        ${options
          .map(
            (option) =>
              `<option value="${option.value}" ${
                option.value === value ? `selected="selected"` : ''
              }>${option.title || option.value}</option>`
          )
          .join('')}
      </select>
    `;

    this.node.querySelector('select')?.addEventListener('change', (e) => onChange(e));
  }
}

export default InputSelect;
