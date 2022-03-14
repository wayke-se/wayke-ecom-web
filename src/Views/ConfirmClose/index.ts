import Button from '../../Components/Button/Button';
import ButtonAlt from '../../Components/Button/ButtonAlt';
import HtmlNode from '../../Components/Extension/HtmlNode';

const CONFIRM_CLOSE_NODE = 'confirm-close-node';
const ABORT_CLOSE_NODE = 'abort-close-node';

interface ConfirmCloseProps {
  readonly onConfirmClose: () => void;
  readonly onAbortClose: () => void;
}

class ConfirmClose extends HtmlNode {
  private readonly props: ConfirmCloseProps;
  constructor(element: HTMLElement, props: ConfirmCloseProps) {
    super(element);
    this.props = props;

    this.render();
  }

  render() {
    const { onConfirmClose, onAbortClose } = this.props;

    this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-stack waykeecom-stack--2">
          <div class="waykeecom-hstack waykeecom-hstack--spacing-2 waykeecom-hstack--align-center">
            <div class="waykeecom-hstack__item" aria-hidden="true">
              <div class="waykeecom-icon-backdrop waykeecom-icon-backdrop--error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  class="waykeecom-icon"
                  data-icon="Exclamation mark"
                >
                  <path d="M7.1 9.6 6.7 2h2.7L9 9.6H7.1zM8 11c-.8 0-1.5.7-1.5 1.5S7.2 14 8 14s1.5-.7 1.5-1.5S8.8 11 8 11z" />
                </svg>
              </div>
            </div>
            <div class="waykeecom-hstack__item">
              <h3 class="waykeecom-heading waykeecom-heading--3 waykeecom-no-margin">Bilen är inte reserverad ännu</h3>
            </div>
          </div>
        </div>
        <div class="waykeecom-stack waykeecom-stack--2">
          <div class="waykeecom-content">
            <p>Du har inte klickat dig igenom alla steg som krävs för att ordern ska slutföras och bilen ska reserveras till dig. Är du säker på att du vill avsluta din order?</p>
          </div>
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
