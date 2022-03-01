import Alert from '../../Templates/Alert';
import Loader from '../../Templates/Loader';
import Attach from '../Extension/Attach';

interface BankIdSignQrCodeProps {
  qrCode?: string;
  errorMessage?: string;
}

class BankIdSignQrCode extends Attach {
  private props: BankIdSignQrCodeProps;

  constructor(element: HTMLElement | null, props: BankIdSignQrCodeProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    if (this.props.errorMessage) {
      this.element.innerHTML = Alert({
        tone: 'error',
        children: this.props.errorMessage,
      });
    }

    this.element.innerHTML = `
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
