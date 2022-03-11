import Alert from '../../Templates/Alert';
import Loader from '../../Templates/Loader';
import HtmlNode from '../Extension/HtmlNode';

interface BankIdSignQrCodeProps {
  readonly qrCode?: string;
  readonly errorMessage?: string;
}

class BankIdSignQrCode extends HtmlNode {
  private readonly props: BankIdSignQrCodeProps;

  constructor(element: HTMLElement | null, props: BankIdSignQrCodeProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    const { qrCode, errorMessage } = this.props;
    if (errorMessage) {
      this.node.innerHTML = Alert({
        tone: 'error',
        children: errorMessage,
      });
      return;
    }

    this.node.innerHTML = `
      ${
        qrCode
          ? `
            <div class="waykeecom-stack waykeecom-stack--4">
              <div class="waykeecom-align waykeecom-align--center">
                <img src="data:image/png;base64, ${qrCode}" alt="BankID QR" class="waykeecom-qr" />
              </div>
            </div>`
          : ''
      }
      <div class="waykeecom-stack waykeecom-stack--4">${Loader()}</div>`;
  }
}

export default BankIdSignQrCode;
