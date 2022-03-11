import Button from '../../Components/Button/Button';
import HtmlNode from '../../Components/Extension/HtmlNode';

const CONFIRM_CLOSE_NODE = 'confirm-close-node';
const ABORT_CLOSE_NODE = 'abort-close-node';

interface ConfirmCloseProps {
  onConfirmClose: () => void;
  onAbortClose: () => void;
}

class ConfirmClose extends HtmlNode {
  private props: ConfirmCloseProps;
  constructor(element: HTMLElement, props: ConfirmCloseProps) {
    super(element);
    this.props = props;

    this.render();
  }

  render() {
    const { onConfirmClose, onAbortClose } = this.props;

    this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--3">
        <p>Vill du verkligen avbryta?</p>
      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-stack waykeecom-stack--1" id="${CONFIRM_CLOSE_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--1" id="${ABORT_CLOSE_NODE}"></div>
      </div>
    `;

    new Button(this.node.querySelector<HTMLDivElement>(`#${CONFIRM_CLOSE_NODE}`), {
      title: 'Ja',
      onClick: () => onConfirmClose(),
    });

    new Button(this.node.querySelector<HTMLDivElement>(`#${ABORT_CLOSE_NODE}`), {
      title: 'Nej',
      onClick: () => onAbortClose(),
    });
  }
}

export default ConfirmClose;
