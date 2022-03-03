import HtmlNode from '../Extension/HtmlNode';

interface InputRadioFieldProps {
  title: string;
  value: string;
  name: string;
  description?: string;
  meta?: string;
  id: string;
  checked: boolean;
  onClick?: (e: Event) => void;
}

class InputRadioField extends HtmlNode {
  private props: InputRadioFieldProps;

  constructor(element: HTMLDivElement | null, props: InputRadioFieldProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    this.node.innerHTML = `
      <div class="waykeecom-input-radio" role="radio">
        <input
          type="radio"
          id="${this.props.id}"
          value="${this.props.value}"
          name="${this.props.name}"
          ${this.props.checked ? 'checked="true"' : ''}
          class="waykeecom-input-radio__input"
        />
        <div class="waykeecom-input-radio__header">
          <label for="${this.props.id}" class="waykeecom-input-radio__label">${
      this.props.title
    }</label>
          ${
            this.props.meta
              ? `<div class="waykeecom-input-radio__meta">${this.props.meta}</div>`
              : ''
          }
        </div>
        ${
          this.props.description
            ? `
          <div class="waykeecom-input-radio__description">
            ${this.props.description}
          </div>
        `
            : ''
        }
      </div>
    `;

    const input = this.node.querySelector(`#${this.props.id}`);
    if (input) {
      if (this.props.onClick) {
        input.addEventListener('click', this.props.onClick);
      }
    }
  }
}

export default InputRadioField;
