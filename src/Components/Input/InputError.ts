import HtmlNode from '../Extension/HtmlNode';

const errorInputClassName = 'waykeecom-input-error';

interface InputErrorProps {
  error?: boolean;
  id?: string;
  readonly errorMessage: string;
}

class InputError extends HtmlNode {
  private readonly props: InputErrorProps;

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
    const { error, errorMessage } = this.props;
    const errorNode = this.node.querySelector(`.${errorInputClassName}`);
    if (errorNode) {
      if (!error) {
        errorNode.remove();
      }
    } else {
      if (error) {
        const errorElement = document.createElement('div');
        errorElement.className = errorInputClassName;
        errorElement.setAttribute('aria-live', 'assertive');
        errorElement.innerHTML = errorMessage;
        this.node.appendChild(errorElement);

        if (this.props.id) {
          errorElement.id = this.props.id;
        }
      }
    }
  }
}

export default InputError;
