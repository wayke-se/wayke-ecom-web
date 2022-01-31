import { AuthMethod } from '@wayke-se/ecom';
import ButtonArrowRight from '../../../Components/ButtonArrowRight';
import ButtonAsLink from '../../../Components/ButtonAsLink';
import { getBankIdAuth } from '../../../Data/getBankIdAuth';
import { getBankIdStatus } from '../../../Data/getBankIdStatus';
import { setSocialIdAndAddress } from '../../../Redux/action';
import Alert from '../../../Templates/Alert';
import { isMobile } from '../../../Utils/isMobile';

const BANKID_START_NODE = `bankid-start-node`;
const BANKID_START = `bankid-start`;
const BANKID_FETCH_ERROR = 'bankid-fetch-error';

const BANKID_OPEN_ON_DEVICE_NODE = `bankid-open-on-device-node`;
const BANKID_OPEN_ON_DEVICE = `bankid-open-on-device`;

const QR_CODE_NODE = 'qr-code-node';

const LINK_TOGGLE_METHOD_NODE = 'link-toggle-method-node';
const LINK_TOGGLE_METHOD = 'link-toggle-method';

class Part2WithBankId {
  private element: HTMLDivElement;
  private bankidStatusInterval?: NodeJS.Timer;
  private _ontoggleMethod: () => void;
  private view: number = 1;

  constructor(element: HTMLDivElement, onToggleMethod: () => void) {
    this.element = element;
    this._ontoggleMethod = onToggleMethod;
    this.render();
  }

  onToggleMethod() {
    if (this.bankidStatusInterval) {
      clearInterval(this.bankidStatusInterval);
    }
    this._ontoggleMethod();
  }

  bankIdStatus(reference: string, method: AuthMethod) {
    this.bankidStatusInterval = setInterval(async () => {
      const errorAlert = document.querySelector<HTMLDivElement>(`#${BANKID_FETCH_ERROR}`);
      if (!errorAlert) {
        clearInterval(this.bankidStatusInterval as NodeJS.Timer);
        return;
      }

      try {
        const response = await getBankIdStatus(reference);
        errorAlert.style.display = '';

        if (response.isCompleted()) {
          clearInterval(this.bankidStatusInterval as NodeJS.Timer);
          const address = response.getAddress();
          const socialId = response.getPersonalNumber();
          if (address && socialId) {
            setSocialIdAndAddress(socialId, address);
          }
        }
        if (response.shouldRenew()) {
          this.onStartBankIdAuth(method);
        }
      } catch (e) {
        clearInterval(this.bankidStatusInterval as NodeJS.Timer);
        errorAlert.style.display = '';
        errorAlert.innerHTML = Alert({
          tone: 'error',
          children: '<p>Det gick inte att hämta status kring Nuvanrade bankid signering/p>',
        });
      }
    }, 2000);

    /*
    setTimeout(() => {
      // Kill after 60 sec
      if (this.bankidStatusInterval) {
        clearInterval(this.bankidStatusInterval);
      }
    }, 2 * 60 * 1000);
    */
  }

  async onStartBankIdAuth(method: AuthMethod) {
    if (this.bankidStatusInterval) {
      clearInterval(this.bankidStatusInterval);
    }

    const qrCodeNode = this.element.querySelector<HTMLDivElement>(`#${QR_CODE_NODE}`);
    const errorAlert = document.querySelector<HTMLDivElement>(`#${BANKID_FETCH_ERROR}`);
    const toggle = this.element.querySelector<HTMLDivElement>(`#${LINK_TOGGLE_METHOD}`);

    if (!qrCodeNode || !toggle || !errorAlert) return;
    errorAlert.style.display = 'none';

    try {
      toggle.setAttribute('disabled', '');
      const response = await getBankIdAuth(method);
      const reference = response.getOrderRef();
      this.bankIdStatus(reference, method);

      if (method === AuthMethod.SameDevice) {
        try {
          qrCodeNode.innerHTML = `
            <div class="waykeecom-stack waykeecom-stack--3" id="${BANKID_OPEN_ON_DEVICE_NODE}"></div>
          `;

          response.getAutoLaunchUrl();
          new ButtonArrowRight(
            this.element.querySelector<HTMLDivElement>(`#${BANKID_OPEN_ON_DEVICE_NODE}`),
            {
              title: 'Öppna BankID',
              id: BANKID_OPEN_ON_DEVICE,
              onClick: () => window.open(response.getAutoLaunchUrl(), '_blank'),
            }
          );
          new ButtonAsLink(this.element.querySelector<HTMLDivElement>(`#${BANKID_START_NODE}`), {
            title: 'Mitt BankID är på en annan enhet',
            id: BANKID_START,
            onClick: () => this.onStartBankIdAuth(AuthMethod.QrCode),
          });
        } catch (e) {
          const _e = e as { message: string };
          qrCodeNode.innerHTML = `<p>snap: ${_e.message}</p>`;
        }
      } else {
        const qrCode = response.getQrCode();
        qrCodeNode.innerHTML = `
          <img style="width:400px;" src="data:image/png;base64, ${qrCode}" />
        `;
        new ButtonAsLink(this.element.querySelector<HTMLDivElement>(`#${BANKID_START_NODE}`), {
          title: 'Öppna BankID på den här enheten',
          id: BANKID_START,
          onClick: () => this.onStartBankIdAuth(AuthMethod.SameDevice),
        });
      }
    } catch (e) {
      errorAlert.style.display = '';
      errorAlert.innerHTML = Alert({
        tone: 'error',
        children: '<p>Det gick tyvärr inte att initiera BankId</p>',
      });
    } finally {
      toggle.removeAttribute('disabled');
    }
  }

  onAbort() {
    this.view = 1;
    if (this.bankidStatusInterval) {
      clearInterval(this.bankidStatusInterval);
    }
    this.render();
  }

  render() {
    const mobile = isMobile();
    if (this.view === 2) {
      this.element.innerHTML = `
        <div class="waykeecom-stack waykeecom-stack--2">
          <hr class="waykeecom-separator" />
        </div>
        <div class="waykeecom-stack waykeecom-stack--2">

          <div class="waykeecom-stack waykeecom-stack--3" id="${QR_CODE_NODE}"></div>

          <div class="waykeecom-stack waykeecom-stack--3" style="display:none;" id="${BANKID_FETCH_ERROR}"></div>

        </div>
        <div class="waykeecom-stack waykeecom-stack--3" id="${BANKID_START_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--3" id="${LINK_TOGGLE_METHOD_NODE}"></div>
      `;

      if (mobile) {
        new ButtonAsLink(this.element.querySelector<HTMLDivElement>(`#${BANKID_START_NODE}`), {
          title: 'Mitt BankID är på en annan enhet',
          id: BANKID_START,
          onClick: () => this.onStartBankIdAuth(AuthMethod.QrCode),
        });
      } else {
        new ButtonAsLink(this.element.querySelector<HTMLDivElement>(`#${BANKID_START_NODE}`), {
          title: 'Öppna BankID på den här enheten',
          id: BANKID_START,
          onClick: () => this.onStartBankIdAuth(AuthMethod.SameDevice),
        });
      }

      new ButtonAsLink(this.element.querySelector<HTMLDivElement>(`#${LINK_TOGGLE_METHOD_NODE}`), {
        title: 'Avbryt',
        id: LINK_TOGGLE_METHOD,
        onClick: () => this.onAbort(),
      });
    } else {
      this.element.innerHTML = `
        <div class="waykeecom-stack waykeecom-stack--2">
          <hr class="waykeecom-separator" />
        </div>
        <div class="waykeecom-stack waykeecom-stack--2">

        <div class="waykeecom-stack waykeecom-stack--3" id="${QR_CODE_NODE}"></div>

        <div class="waykeecom-stack waykeecom-stack--3" style="display:none;" id="${BANKID_FETCH_ERROR}">
          ${Alert({
            tone: 'error',
            children: '<p>Tyvärr fick vi ingen träff på personnumret du angav.</p>',
          })}
        </div>

        <div class="waykeecom-stack waykeecom-stack--3">
          ${Alert({
            tone: 'info',
            children: `
              <p>Vi kommer hämta följande uppgifter om dig:</p>
              <ul>
                <li>Personnummer</li>
                <li>Namn</li>
                <li>Folkbokföringsadress</li>
              </ul>
            `,
          })}
        </div>

        </div>
        <div class="waykeecom-stack waykeecom-stack--3" id="${BANKID_START_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--3" id="${LINK_TOGGLE_METHOD_NODE}"></div>
      `;

      new ButtonArrowRight(this.element.querySelector<HTMLDivElement>(`#${BANKID_START_NODE}`), {
        title: 'Hämta adress med Mobilt BankID',
        id: BANKID_START,
        onClick: () => {
          this.view = 2;
          this.render();
          this.onStartBankIdAuth(mobile ? AuthMethod.SameDevice : AuthMethod.QrCode);
        },
      });

      new ButtonArrowRight(
        this.element.querySelector<HTMLDivElement>(`#${LINK_TOGGLE_METHOD_NODE}`),
        {
          title: 'Jag vill fylla i mina uppgifter manuellt',
          id: LINK_TOGGLE_METHOD,
          onClick: () => this.onToggleMethod(),
        }
      );
    }
  }
}

export default Part2WithBankId;
