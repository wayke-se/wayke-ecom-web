import InputHelp from '../Templates/InputHelp';

interface InputFieldProps {
  title: string;
  value: string;
  name: string;
  id: string;
  unit?: string;
  errorId: string;
  error?: boolean;
  errorMessage?: string;
  placeholder?: string;
  information?: string;
  onChange?: (e: Event) => void;
  onBlur?: (e: Event) => void;
}

class InputField {
  private element: HTMLDivElement;
  private props: InputFieldProps;

  constructor(element: HTMLDivElement | null, props: InputFieldProps) {
    if (!element) throw `No element provided to InputField`;
    this.element = element;
    this.props = props;
    this.render();
  }

  onOpenInformation() {
    const foldout = this.element.querySelector<HTMLDivElement>('.input-label__foldout');
    if (foldout) {
      foldout.style.display = '';
    }
  }

  render() {
    this.element.innerHTML = `
      <div class="waykeecom-input-label">
        <label for="${this.props.id}" class="waykeecom-input-label__label">${
      this.props.title
    }</label>
        ${
          this.props.information
            ? `${InputHelp()}${this.props.information ? this.props.information : ''}`
            : ''
        }
      </div>
      <div class="waykeecom-input-text">
        <input
          type="text"
          id="${this.props.id}"
          value="${this.props.value}"
          name="${this.props.name}"
          ${this.props.placeholder ? `placeholder="${this.props.placeholder}"` : ''}
          
          class="waykeecom-input-text__input"
        />
        ${this.props.unit ? `<div class="waykeecom-input-text__unit">${this.props.unit}</div>` : ''}
      </div>
      ${
        this.props.errorMessage &&
        ` <div id="${this.props.errorId}" class="waykeecom-input-error">${this.props.errorMessage}</div>`
      }
    `;

    if (this.props.information) {
      this.element
        .querySelector('button')
        ?.addEventListener('click', () => this.onOpenInformation());
    }

    const input = this.element.querySelector(`#${this.props.id}`);
    if (input) {
      if (this.props.onChange) {
        input.addEventListener('change', this.props.onChange);
      }

      if (this.props.onBlur) {
        input.addEventListener('blur', this.props.onBlur);
      }
    }

    const error = this.element.querySelector<HTMLDivElement>(`#${this.props.errorId}`);
    if (error) {
      if (this.props.error) {
        error.style.display = '';
      } else {
        error.style.display = 'none';
      }
    }
  }
}

export default InputField;
