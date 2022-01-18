interface InputRadioFieldProps {
  title: string;
  value: string;
  name: string;
  id: string;
  checked: boolean;
  onClick?: (e: Event) => void;
}

class InputRadioField {
  private element: HTMLDivElement;
  private props: InputRadioFieldProps;

  constructor(element: HTMLDivElement | null, props: InputRadioFieldProps) {
    if (!element) throw `No element provided to InputRadioField`;
    this.element = element;
    this.props = props;
    this.render();
  }

  render() {
    this.element.innerHTML = `
      <input
        type="radio"
        id="${this.props.id}"
        value="${this.props.value}"
        name="${this.props.name}"
        ${this.props.checked ? 'checked="true"' : ''}
        class="input-radio"
      />
      <label for="${this.props.id}">${this.props.title}</label>
    `;

    const input = this.element.querySelector(`#${this.props.id}`);
    if (input) {
      if (this.props.onClick) {
        input.addEventListener('click', this.props.onClick);
      }
    }
  }
}

export default InputRadioField;
