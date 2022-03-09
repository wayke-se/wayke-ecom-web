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
    const { id, title, value, name, checked, meta, description, onClick } = this.props;
    this.node.innerHTML = `
      <div class="waykeecom-input-radio" role="radio">
        <input
          type="radio"
          id="${id}"
          value="${value}"
          name="${name}"
          ${checked ? 'checked="true"' : ''}
          class="waykeecom-input-radio__input"
        />
        <div class="waykeecom-input-radio__header">
          <label for="${id}" class="waykeecom-input-radio__label">${title}</label>
          ${meta ? `<div class="waykeecom-input-radio__meta">${meta}</div>` : ''}
        </div>
        ${
          description
            ? `
              <label for="${id}" class="waykeecom-input-radio__description">
                ${description}
              </label>
            `
            : ''
        }
      </div>
    `;

    const input = this.node.querySelector(`#${id}`);
    if (input) {
      if (onClick) {
        input.addEventListener('click', onClick);
      }
    }
  }
}

export default InputRadioField;
