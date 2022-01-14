interface InputFieldProps {
  title: string;
  value: string;
  name: string;
  id: string;
  errorId: string;
  errorMessage?: string;
  placeholder?: string;
  information?: string;
}

class InputField {
  private element: HTMLDivElement;
  private props: InputFieldProps;

  constructor(element: HTMLDivElement, props: InputFieldProps) {
    this.element = element;
    this.props = props;
    this.render();
  }

  render() {
    this.element.innerHTML = `
      <div class="input-label">
        <label for="${this.props.id}" class="input-label__label">${this.props.title}</label>
      </div>
      <input
        type="text"
        id="${this.props.id}"
        value="${this.props.value}"
        name="${this.props.name}"
        ${this.props.placeholder ? `placeholder="${this.props.placeholder}"` : ''}
        
        class="input-text"
      />
      ${
        this.props.errorMessage &&
        ` <div id="${this.props.errorId}" class="input-error">${this.props.errorMessage}</div>`
      }
    `;
  }
}

export default InputField;
