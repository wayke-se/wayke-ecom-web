import { AuthMethod } from '@wayke-se/ecom';

import ButtonBankId from '../../../Components/ButtonBankId';
import ButtonAsLink from '../../../Components/ButtonAsLink';
import { getBankIdAuth } from '../../../Data/getBankIdAuth';
import { getBankIdStatus } from '../../../Data/getBankIdStatus';
import { setSocialIdAndAddress } from '../../../Redux/action';
import Alert from '../../../Templates/Alert';
import { isMobile } from '../../../Utils/isMobile';
import { Image } from '../../../Utils/constants';
import Loader from '../../../Templates/Loader';
import AppendChild from '../../../Components/AppendChild';

const BANKID_START_NODE = `bankid-start-node`;
const BANKID_START = `bankid-start`;
const BANKID_FETCH_ERROR = 'bankid-fetch-error';

const BANKID_OPEN_ON_DEVICE_NODE = `bankid-open-on-device-node`;
const BANKID_OPEN_ON_DEVICE = `bankid-open-on-device`;

const QR_CODE_NODE = 'qr-code-node';

const LINK_TOGGLE_METHOD_NODE = 'link-toggle-method-node';
const LINK_TOGGLE_METHOD = 'link-toggle-method';
const ABORT_NODE = 'abort-node';

class FullAddressByBankId extends AppendChild {
  private lastStage: boolean;
  private _ontoggleMethod: () => void;
  private bankidStatusInterval?: NodeJS.Timer;
  private view: number = 1;
  private QrCodeElement?: HTMLDivElement;
  private toggleMethodButtonContext?: ButtonAsLink;

  constructor(element: HTMLElement, lastStage: boolean, onToggleMethod: () => void) {
    super(element, { htmlTag: 'div', className: 'waykeecom-stack waykeecom-stack--2' });

    this.lastStage = lastStage;
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
            setSocialIdAndAddress(socialId, address, this.lastStage);
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

    const errorAlert = document.querySelector<HTMLDivElement>(`#${BANKID_FETCH_ERROR}`);

    if (!this.QrCodeElement || !this.toggleMethodButtonContext || !errorAlert) return;
    errorAlert.style.display = 'none';

    try {
      this.toggleMethodButtonContext.disabled(true);
      const response = await getBankIdAuth(method);
      const reference = response.getOrderRef();
      this.bankIdStatus(reference, method);

      if (method === AuthMethod.SameDevice) {
        try {
          this.QrCodeElement.innerHTML = `
            <div class="waykeecom-stack waykeecom-stack--4">
              <div class="waykeecom-align waykeecom-align--center">
                <img src="${
                  Image.bankid
                }" alt="BankID logotyp" class="waykeecom-image" style="width: 130px" />
              </div>
            </div>
            <div class="waykeecom-stack waykeecom-stack--4">${Loader()}</div>
            <div class="waykeecom-stack waykeecom-stack--4" id="${BANKID_OPEN_ON_DEVICE_NODE}">
          `;

          response.getAutoLaunchUrl();
          new ButtonBankId(
            this.content.querySelector<HTMLDivElement>(`#${BANKID_OPEN_ON_DEVICE_NODE}`),
            {
              title: 'Öppna BankID',
              id: BANKID_OPEN_ON_DEVICE,
              onClick: () => window.open(response.getAutoLaunchUrl(), '_blank'),
            }
          );
          new ButtonAsLink(this.content.querySelector<HTMLDivElement>(`#${BANKID_START_NODE}`), {
            title: 'Mitt BankID är på en annan enhet',
            id: BANKID_START,
            onClick: () => this.onStartBankIdAuth(AuthMethod.QrCode),
          });
        } catch (e) {
          const _e = e as { message: string };
          this.QrCodeElement.innerHTML = `<p>Error: ${_e.message}</p>`;
        }
      } else {
        const qrCode = response.getQrCode();
        this.QrCodeElement.innerHTML = `
          <div class="waykeecom-align waykeecom-align--center">
            <img src="data:image/png;base64, ${qrCode}" alt="BankID QQ" class="waykeecom-qr" />
          </div>
        `;
        new ButtonAsLink(this.content.querySelector<HTMLDivElement>(`#${BANKID_START_NODE}`), {
          title: 'Öppna BankID på den här enheten',
          id: BANKID_START,
          onClick: () => this.onStartBankIdAuth(AuthMethod.SameDevice),
        });
      }
    } catch (e) {
      errorAlert.style.display = '';
      errorAlert.innerHTML = Alert({
        tone: 'error',
        children: '<p>Det gick tyvärr inte att initiera BankId. Vänligen försök igen.</p>',
      });
    } finally {
      this.toggleMethodButtonContext.disabled(false);
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
      this.content.innerHTML = `
        <div class="waykeecom-stack waykeecom-stack--2">
          <hr class="waykeecom-separator" />
        </div>
        <div class="waykeecom-stack waykeecom-stack--2">
          <div class="waykeecom-overlay">
            <div class="waykeecom-container waykeecom-container--narrow">
              <div class="waykeecom-stack waykeecom-stack--4">
                <h4 class="waykeecom-heading waykeecom-heading--4">Öppna BankID och scanna QR-koden</h4>
                <div class="waykeecom-content">
                  <p>För att hämta dina uppgifter, starta din BankID applikation på din andra enhet.</p>
                </div>
              </div>
              <div class="waykeecom-stack waykeecom-stack--4">
                <div id="${QR_CODE_NODE}"></div>
                <div id="${BANKID_FETCH_ERROR}" style="display:none;"></div>
              </div>
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

      this.QrCodeElement =
        this.content.querySelector<HTMLDivElement>(`#${QR_CODE_NODE}`) || undefined;

      if (mobile) {
        new ButtonAsLink(this.content.querySelector<HTMLDivElement>(`#${BANKID_START_NODE}`), {
          title: 'Mitt BankID är på en annan enhet',
          id: BANKID_START,
          onClick: () => this.onStartBankIdAuth(AuthMethod.QrCode),
        });
      } else {
        new ButtonAsLink(this.content.querySelector<HTMLDivElement>(`#${BANKID_START_NODE}`), {
          title: 'Öppna BankID på den här enheten',
          id: BANKID_START,
          onClick: () => this.onStartBankIdAuth(AuthMethod.SameDevice),
        });
      }

      new ButtonAsLink(this.content.querySelector<HTMLDivElement>(`#${ABORT_NODE}`), {
        title: 'Avbryt',
        id: LINK_TOGGLE_METHOD,
        onClick: () => this.onAbort(),
      });
    } else {
      this.content.innerHTML = `
        <div class="waykeecom-stack waykeecom-stack--2">
          <hr class="waykeecom-separator" />
        </div>
        <div class="waykeecom-stack waykeecom-stack--2">
          <div class="waykeecom-stack waykeecom-stack--3">
            <h4 class="waykeecom-heading waykeecom-heading--4">Personuppgifter</h4>
            <div class="waykeecom-content">
              <p>Identifiera dig med Mobilt BankID <img src="${
                Image.bankid
              }" alt="BankID logotyp" class="waykeecom-image waykeecom-image--inline" aria-hidden="true" /> för att hämta dina uppgifter.</p>
            </div>
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
          <div class="waykeecom-stack waykeecom-stack--3">
            <div class="waykeecom-stack waykeecom-stack--2" id="${BANKID_START_NODE}"></div>
            <div class="waykeecom-stack waykeecom-stack--2">
              <div class="waykeecom-disclaimer">
                <div class="waykeecom-disclaimer__icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    class="waykeecom-icon"
                  >
                    <title>Ikon: hänlås</title>
                    <path d="M13 6h-1V4c0-2.2-1.8-4-4-4S4 1.8 4 4v2H3c-1.1 0-2 .9-2 2v8h14V8c0-1.1-.9-2-2-2zM6 4c0-1.1.9-2 2-2s2 .9 2 2v2H6V4zm7 10H3V8h10v6z" />
                  </svg>
                </div>
                <div class="waykeecom-disclaimer__text">
                  Dina uppgifter lagras och sparas säkert. Läs mer i vår <a href="#" title="" target="_blank" rel="noopener noreferrer" class="waykeecom-link">personuppgiftspolicy</a>.
                </div>
              </div>
            </div>
          </div>
          <div class="waykeecom-stack waykeecom-stack--3">
            <div class="waykeecom-text-center" id="${LINK_TOGGLE_METHOD_NODE}"></div>
          </div>
        </div>
      `;

      new ButtonBankId(this.content.querySelector<HTMLDivElement>(`#${BANKID_START_NODE}`), {
        title: 'Hämta uppgifter med Mobilt BankID',
        id: BANKID_START,
        onClick: () => {
          this.view = 2;
          this.render();
          this.onStartBankIdAuth(mobile ? AuthMethod.SameDevice : AuthMethod.QrCode);
        },
      });

      this.toggleMethodButtonContext = new ButtonAsLink(
        this.content.querySelector<HTMLDivElement>(`#${LINK_TOGGLE_METHOD_NODE}`),
        {
          title: 'Jag vill fylla i mina uppgifter manuellt',
          id: LINK_TOGGLE_METHOD,
          onClick: () => this.onToggleMethod(),
        }
      );
    }
  }
}

export default FullAddressByBankId;