import Attach from '../Extension/Attach';

const errorInputClassName = 'waykeecom-input-error';

interface InputErrorProps {
  error?: boolean;
  errorMessage: string;
}

class InputError extends Attach {
  private props: InputErrorProps;

  constructor(element: HTMLElement, props: InputErrorProps) {
    super(element);
    this.props = props;

    this.render();
  }

  setError(error: boolean) {
    this.props.error = error;
    this.render();
  }

  render() {
    const errorNode = this.element.querySelector(`.${errorInputClassName}`);
    if (errorNode) {
      if (!this.props.error) {
        errorNode.remove();
      }
    } else {
      if (this.props.error) {
        const errorElement = document.createElement('div');
        errorElement.className = errorInputClassName;
        errorElement.setAttribute('role', 'alert');
        errorElement.innerHTML = this.props.errorMessage;
        this.element.appendChild(errorElement);
      }
    }
  }
}

export default InputError;
