import { AuthMethod } from '@wayke-se/ecom';

import ButtonBankId from '../../../Components/Button/ButtonBankId';
import ButtonAsLink from '../../../Components/Button/ButtonAsLink';
import { getBankIdAuth } from '../../../Data/getBankIdAuth';
import { getBankIdStatus } from '../../../Data/getBankIdStatus';
import { setSocialIdAndAddress } from '../../../Redux/action';
import Alert from '../../../Templates/Alert';
import { isMobile } from '../../../Utils/isMobile';
import { Image } from '../../../Utils/constants';
import BankIdSign from '../../../Components/BankId/BankIdSign';
import DisclaimerSafe from './DisclaimerSafe';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import { validationMethods } from '../../../Utils/validationMethods';
import { createPortal, destroyPortal } from '../../../Utils/portal';

const BANKID_START_NODE = `bankid-start-node`;
const BANKID_START = `bankid-start`;

const LINK_TOGGLE_METHOD_NODE = 'link-toggle-method-node';
const LINK_TOGGLE_METHOD = 'link-toggle-method';

const DISCLAIMER_SAFE_NODE = 'address-disclaimer-node';

class FullAddressByBankId extends HtmlNode {
  private lastStage: boolean;
  private _ontoggleMethod: () => void;
  private bankidStatusInterval?: NodeJS.Timer;
  private view: number = 1;
  private contexts: {
    buttonLinkToggle?: ButtonAsLink;
    bankId?: BankIdSign;
  } = {};
  private ageError = false;

  constructor(element: HTMLElement, lastStage: boolean, onToggleMethod: () => void) {
    super(element, { htmlTag: 'div', className: 'waykeecom-stack waykeecom-stack--2' });
    this.ageError = false;
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
      try {
        const response = await getBankIdStatus(reference);
        if (response.isCompleted()) {
          clearInterval(this.bankidStatusInterval as NodeJS.Timer);
          const address = response.getAddress();
          const socialId = response.getPersonalNumber();

          if (address && socialId) {
            const over18 = validationMethods.requiredSsnOver18(socialId);
            if (over18) {
              setSocialIdAndAddress(socialId, address, this.lastStage);
            } else {
              this.view = 1;
              this.ageError = true;
              clearInterval(this.bankidStatusInterval as NodeJS.Timer);
              this.render();
              return;
            }
            destroyPortal();
          }
        }
        if (response.shouldRenew()) {
          this.onStartBankIdAuth(method);
        }
      } catch (e) {
        clearInterval(this.bankidStatusInterval as NodeJS.Timer);
        this.contexts.bankId?.setErrorMessage(
          '<p>Det gick inte att hämta status kring nuvanrade BankId signering/p>'
        );
      }
    }, 2000);
  }

  async onStartBankIdAuth(method: AuthMethod) {
    if (this.bankidStatusInterval) {
      clearInterval(this.bankidStatusInterval);
    }

    try {
      this.contexts.bankId?.update(method);
      this.contexts.buttonLinkToggle?.disabled(true);
      const response = await getBankIdAuth(method);
      const reference = response.getOrderRef();
      this.bankIdStatus(reference, method);

      if (method === AuthMethod.SameDevice) {
        try {
          const autoLaunchUrl = response.getAutoLaunchUrl() as string;
          this.contexts.bankId?.update(method, autoLaunchUrl);
        } catch (e) {
          const _e = e as { message: string };
          this.contexts.bankId?.setErrorMessage(`<p>Error: ${_e.message}</p>`);
        }
      } else {
        const qrCode = response.getQrCode() as string;
        this.contexts.bankId?.update(method, qrCode);
      }
    } catch (e) {
      this.contexts.bankId?.setErrorMessage(
        '<p>Det gick tyvärr inte att initiera BankId. Vänligen försök igen.</p>'
      );
    } finally {
      this.contexts.buttonLinkToggle?.disabled(false);
    }
  }

  onAbort() {
    this.view = 1;
    if (this.bankidStatusInterval) {
      clearInterval(this.bankidStatusInterval);
    }
    destroyPortal();
    this.render();
  }

  render() {
    const mobile = isMobile();
    if (this.view === 2) {
      this.contexts.bankId = new BankIdSign(createPortal(), {
        method: mobile ? AuthMethod.SameDevice : AuthMethod.QrCode,
        descriptionQrCode:
          'För att hämta dina uppgifter, starta din BankID applikation på din andra enhet.',
        descriptionSameDevice: 'För att hämta dina uppgifter, starta din BankID-applikation.',
        onAbort: () => this.onAbort(),
        onStart: (method: AuthMethod) => this.onStartBankIdAuth(method),
      });
    } else {
      this.node.innerHTML = `
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
          ${
            this.ageError
              ? `
           <div class="waykeecom-stack waykeecom-stack--3">${Alert({
             tone: 'error',
             children:
               '<p>Du måste vara över 18 år för att kunna fortsätta. Identifiering med BankId visar att du är under 18 år gammal.</p>',
           })}</div>
          `
              : ''
          }
          <div class="waykeecom-stack waykeecom-stack--3">
            <div class="waykeecom-stack waykeecom-stack--2" id="${BANKID_START_NODE}"></div>
            <div class="waykeecom-stack waykeecom-stack--2" id="${DISCLAIMER_SAFE_NODE}"></div>
          </div>
          <div class="waykeecom-stack waykeecom-stack--3">
            <div class="waykeecom-text-center" id="${LINK_TOGGLE_METHOD_NODE}"></div>
          </div>
        </div>
      `;

      new ButtonBankId(this.node.querySelector<HTMLDivElement>(`#${BANKID_START_NODE}`), {
        title: 'Hämta uppgifter med Mobilt BankID',
        id: BANKID_START,
        onClick: () => {
          this.view = 2;
          this.render();
        },
      });

      new DisclaimerSafe(this.node.querySelector(`#${DISCLAIMER_SAFE_NODE}`));

      this.contexts.buttonLinkToggle = new ButtonAsLink(
        this.node.querySelector<HTMLDivElement>(`#${LINK_TOGGLE_METHOD_NODE}`),
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
