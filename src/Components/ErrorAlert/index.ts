import HtmlNode from '../Extension/HtmlNode';
import Alert from '../../Templates/Alert';

interface ErrorAlertProps {
  error?: string | Element;
}

class ErrorAlert extends HtmlNode {
  private readonly props: ErrorAlertProps;
  private error?: string | Element;

  constructor(element: HTMLElement | null, props: ErrorAlertProps) {
    super(element);
    this.props = props;
    this.error = props.error;

    this.render();
  }

  update(error?: string | Element) {
    this.error = error;
    this.render();
  }

  render() {
    if (!this.error) {
      this.node.innerHTML = '';
      return;
    }

    this.node.innerHTML = Alert({
      tone: 'error',
      children: this.error,
    });
  }
}

export default ErrorAlert;
