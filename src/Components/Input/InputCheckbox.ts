import HtmlNode from '../Extension/HtmlNode';

interface InputCheckboxProps {
  readonly title: string;
  readonly value: string;
  readonly name: string;
  readonly description?: string;
  readonly meta?: string;
  readonly id: string;
  readonly checked: boolean;
  readonly onClick?: (e: Event) => void;
  readonly append?: boolean;
  disabled?: boolean;
}

class InputCheckbox extends HtmlNode {
  private readonly props: InputCheckboxProps;

  constructor(element: HTMLElement | null, props: InputCheckboxProps) {
    super(
      element,
      props.append
        ? {
            htmlTag: 'div',
            className: 'waykeecom-input-radio',
            attributes: [{ key: 'role', value: 'checkbox' }],
          }
        : undefined
    );
    this.props = props;
    this.render();
  }

  disabled(disabled: boolean) {
    if (this.props.disabled !== disabled) {
      this.props.disabled = disabled;
      this.render();
    }
  }

  render() {
    const { id, title, value, name, checked, meta, description, append, disabled, onClick } =
      this.props;

    const content = `
        <input
          type="checkbox"
          id="${id}"
          value="${value}"
          name="${name}"
          ${disabled ? 'disabled=""' : ''}
          ${checked ? 'checked="true"' : ''}
          class="waykeecom-input-radio__input"
        />
        <div class="waykeecom-input-radio__header">
          <label for="${id}" class="waykeecom-input-radio__label">${title}${
      disabled ? `disabled` : ''
    }</label>
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
  `;

    if (append) {
      this.node.innerHTML = content;
    }

    this.node.innerHTML = `
      <div class="waykeecom-input-radio" role="checkbox">
       ${content}
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

export default InputCheckbox;
