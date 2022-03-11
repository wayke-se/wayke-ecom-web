import Button from '../../Components/Button/Button';
import ButtonAlt from '../../Components/Button/ButtonAlt';
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
        <h3 class="waykeecom-heading waykeecom-heading--3">Bilen är inte reserverad ännu</h3>
        <div class="waykeecom-content">
          <p>Du har inte klickat dig igenom alla steg som krävs för att ordern ska slutföras och bilen ska reserveras till dig. Är du säker på att du vill avsluta din order?</p>
        </div>
      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-stack waykeecom-stack--1" id="${ABORT_CLOSE_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--1" id="${CONFIRM_CLOSE_NODE}"></div>
      </div>
    `;

    new Button(this.node.querySelector<HTMLDivElement>(`#${ABORT_CLOSE_NODE}`), {
      title: 'Fortsätt min order',
      onClick: () => onAbortClose(),
    });

    new ButtonAlt(this.node.querySelector<HTMLDivElement>(`#${CONFIRM_CLOSE_NODE}`), {
      title: 'Avbryt min order',
      onClick: () => onConfirmClose(),
    });
  }
}

export default ConfirmClose;
