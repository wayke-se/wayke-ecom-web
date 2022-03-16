import { AuthMethod } from '@wayke-se/ecom';
import Loader from '../../Templates/Loader';
import { isMobile } from '../../Utils/isMobile';
import { scrollTop } from '../../Utils/scroll';
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
  info?: string;
  title?: string;
  description?: string;
  finalizing?: boolean;
  readonly onStart: (method: AuthMethod) => void;
  readonly onAbort: () => void;
}

class BankIdSign extends HtmlNode {
  private readonly props: BankIdSignProps;

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
    scrollTop();
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

  setInfo(info?: string) {
    if (info !== this.props.info) {
      this.props.info = info;
      this.render();
    }
  }

  setTitle(title?: string) {
    if (title !== this.props.title) {
      this.props.title = title;
      this.render();
    }
  }

  setDescription(description?: string) {
    if (description !== this.props.description) {
      this.props.description = description;
      this.render();
    }
  }

  setFinalizing(finalizing?: boolean) {
    if (finalizing !== this.props.finalizing) {
      this.props.finalizing = finalizing;
      this.render();
    }
  }

  render() {
    const {
      qrCode,
      autoLaunchUrl,
      method,
      errorMessage,
      descriptionQrCode,
      descriptionSameDevice,
      info,
      title,
      description,
      finalizing,
      onStart,
      onAbort,
    } = this.props;

    const methodTitle = title
      ? title
      : method === AuthMethod.QrCode
      ? 'Öppna BankID och scanna QR-koden'
      : 'Skriv in din säkerhetskod i BankID-appen';

    const methodDescription = description
      ? description
      : method === AuthMethod.QrCode
      ? descriptionQrCode
      : descriptionSameDevice;

    this.node.innerHTML = `
      <div class="waykeecom-text waykeecom-text--align-center">
        <div class="waykeecom-stack waykeecom-stack--4" id="">
          <h4 class="waykeecom-heading waykeecom-heading--4">${methodTitle}</h4>
          <div class="waykeecom-content">
            <p>${methodDescription}</p>
          </div>
        </div>
        ${info ? ` <div class="waykeecom-stack waykeecom-stack--4"><p>${info}</p></div>` : ''}

        ${
          !finalizing
            ? `
              <div class="waykeecom-stack waykeecom-stack--4" id="${AUTH_METHOD_NODE}"></div>
            `
            : `<div class="waykeecom-stack waykeecom-stack--4">${Loader()}</div>`
        }
        <div class="waykeecom-stack waykeecom-stack--4">
          ${
            !finalizing
              ? `
          <div class="waykeecom-stack waykeecom-stack--2" id="${BANKID_START_NODE}"></div>
          `
              : ''
          }
          <div class="waykeecom-stack waykeecom-stack--2" id="${ABORT_NODE}"></div>
        </div>
      </div>
    `;

    if (!finalizing) {
      if (method === AuthMethod.SameDevice) {
        new BankIdSignSameDevice(this.node.querySelector<HTMLDivElement>(`#${AUTH_METHOD_NODE}`), {
          autoLaunchUrl,
          errorMessage,
        });
      } else if (method === AuthMethod.QrCode) {
        new BankIdSignQrCode(this.node.querySelector<HTMLDivElement>(`#${AUTH_METHOD_NODE}`), {
          qrCode,
          errorMessage,
        });
      }
      const toggleMethodTitle =
        method === AuthMethod.SameDevice
          ? 'Mitt BankID är på en annan enhet'
          : 'Öppna BankID på den här enheten';
      new ButtonAsLink(this.node.querySelector<HTMLDivElement>(`#${BANKID_START_NODE}`), {
        title: toggleMethodTitle,
        id: BANKID_START,
        onClick: () =>
          onStart(method === AuthMethod.SameDevice ? AuthMethod.QrCode : AuthMethod.SameDevice),
      });
    }

    new ButtonAsLink(this.node.querySelector<HTMLDivElement>(`#${ABORT_NODE}`), {
      title: 'Avbryt',
      id: ABORT,
      onClick: () => onAbort(),
    });
  }
}

export default BankIdSign;
