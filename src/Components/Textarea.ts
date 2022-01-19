import InputHelp from '../Templates/InputHelp';

interface TextareaProps {
  title: string;
  value: string;
  name: string;
  id: string;
  errorId: string;
  error?: boolean;
  errorMessage?: string;
  placeholder?: string;
  information?: string;
  onChange?: (e: Event) => void;
  onBlur?: (e: Event) => void;
}

class Textarea {
  private element: HTMLDivElement;
  private props: TextareaProps;

  constructor(element: HTMLDivElement | null, props: TextareaProps) {
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
      <div class="input-label">
        <label for="${this.props.id}" class="input-label__label">${this.props.title}</label>
        ${
          this.props.information
            ? `${InputHelp()}${this.props.information ? this.props.information : ''}`
            : ''
        }
      </div>
      <textarea
        id="${this.props.id}"
        name="${this.props.name}"
        ${this.props.placeholder ? `placeholder="${this.props.placeholder}"` : ''}
        class="textarea"
      >${this.props.value}</textarea>
      ${
        this.props.errorMessage &&
        ` <div id="${this.props.errorId}" class="input-error">${this.props.errorMessage}</div>`
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

export default Textarea;
