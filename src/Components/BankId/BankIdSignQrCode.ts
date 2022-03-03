import Alert from '../../Templates/Alert';
import Loader from '../../Templates/Loader';
import HtmlNode from '../Extension/HtmlNode';

interface BankIdSignQrCodeProps {
  qrCode?: string;
  errorMessage?: string;
}

class BankIdSignQrCode extends HtmlNode {
  private props: BankIdSignQrCodeProps;

  constructor(element: HTMLElement | null, props: BankIdSignQrCodeProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    if (this.props.errorMessage) {
      this.node.innerHTML = Alert({
        tone: 'error',
        children: this.props.errorMessage,
      });
      return;
    }

    this.node.innerHTML = `
      ${
        this.props.qrCode
          ? `
            <div class="waykeecom-stack waykeecom-stack--4">
              <div class="waykeecom-align waykeecom-align--center">
                <img src="data:image/png;base64, ${this.props.qrCode}" alt="BankID QR" class="waykeecom-qr" />
              </div>
            </div>`
          : ''
      }
      <div class="waykeecom-stack waykeecom-stack--4">${Loader()}</div>`;
  }
}

export default BankIdSignQrCode;
