import { AuthMethod } from '@wayke-se/ecom';
import { isMobile } from '../../Utils/isMobile';
import ButtonAsLink from '../Button/ButtonAsLink';
import HtmlNode from '../Extension/HtmlNode';
import BankIdSignQrCode from './BankIdSignQrCode';
import BankIdSignSameDevice from './BankIdSignSameDevice';

const BANKID_START_NODE = `bankid-start-node`;
const BANKID_START = `bankid-start`;

const ABORT = 'bankid-abort';
const ABORT_NODE = `${ABORT}-node`;

const AUTH_METHOD_NODE = 'bankid-auth-method-node';

interface BankIdSignProps {
  qrCode?: string;
  autoLaunchUrl?: string;
  method: AuthMethod;
  errorMessage?: string;
  descriptionQrCode: string;
  descriptionSameDevice: string;
  hint?: string;
  onStart: (method: AuthMethod) => void;
  onAbort: () => void;
}

class BankIdSign extends HtmlNode {
  private props: BankIdSignProps;

  constructor(element: HTMLElement, props: BankIdSignProps) {
    super(element);
    this.props = props;

    const mobile = isMobile();
    if (mobile) {
      this.props.onStart(AuthMethod.SameDevice);
    } else {
      this.props.onStart(AuthMethod.QrCode);
    }
    this.render();
  }

  update(method: AuthMethod, value?: string) {
    this.props.errorMessage = undefined;
    this.props.method = method;
    switch (method) {
      case AuthMethod.QrCode:
        this.props.autoLaunchUrl = undefined;
        this.props.qrCode = value || this.props.qrCode;
        break;
      case AuthMethod.SameDevice:
        this.props.qrCode = undefined;
        this.props.autoLaunchUrl = value || this.props.autoLaunchUrl;
        break;
      default:
        break;
    }
    this.render();
  }

  setErrorMessage(errorMessage?: string) {
    this.props.errorMessage = errorMessage;
    this.render();
  }

  render() {
    const title =
      this.props.method === AuthMethod.QrCode
        ? 'Öppna BankID och scanna QR-koden'
        : 'Skriv in din säkerhetskod i BankID-appen';

    const description =
      this.props.method === AuthMethod.QrCode
        ? this.props.descriptionQrCode
        : this.props.descriptionSameDevice;

    this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--2">
        <hr class="waykeecom-separator" />
      </div>
      <div class="waykeecom-stack waykeecom-stack--2">
        <div class="waykeecom-overlay">
          <div class="waykeecom-container waykeecom-container--narrow">
            <div class="waykeecom-stack waykeecom-stack--4" id="">
              <h4 class="waykeecom-heading waykeecom-heading--4">${title}</h4>
              <div class="waykeecom-content">
                <p>${description}</p>
              </div>
            </div>
            <div class="waykeecom-stack waykeecom-stack--4" id="${AUTH_METHOD_NODE}"></div>
            <div class="waykeecom-stack waykeecom-stack--4">
              <div class="waykeecom-stack waykeecom-stack--3">
                <div class="waykeecom-stack waykeecom-stack--2" id="${BANKID_START_NODE}"></div>
                <div class="waykeecom-stack waykeecom-stack--2" id="${ABORT_NODE}"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    if (this.props.method === AuthMethod.SameDevice) {
      new BankIdSignSameDevice(this.node.querySelector<HTMLDivElement>(`#${AUTH_METHOD_NODE}`), {
        autoLaunchUrl: this.props.autoLaunchUrl,
        errorMessage: this.props.errorMessage,
      });
    } else if (this.props.method === AuthMethod.QrCode) {
      new BankIdSignQrCode(this.node.querySelector<HTMLDivElement>(`#${AUTH_METHOD_NODE}`), {
        qrCode: this.props.qrCode,
        errorMessage: this.props.errorMessage,
      });
    }

    const toggleMethodTitle =
      this.props.method === AuthMethod.SameDevice
        ? 'Mitt BankID är på en annan enhet'
        : 'Öppna BankID på den här enheten';
    new ButtonAsLink(this.node.querySelector<HTMLDivElement>(`#${BANKID_START_NODE}`), {
      title: toggleMethodTitle,
      id: BANKID_START,
      onClick: () =>
        this.props.onStart(
          this.props.method === AuthMethod.SameDevice ? AuthMethod.QrCode : AuthMethod.SameDevice
        ),
    });

    new ButtonAsLink(this.node.querySelector<HTMLDivElement>(`#${ABORT_NODE}`), {
      title: 'Avbryt',
      id: ABORT,
      onClick: () => this.props.onAbort(),
    });
  }
}

export default BankIdSign;
