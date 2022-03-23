import { AuthMethod } from '@wayke-se/ecom';

import ButtonBankId from '../../../Components/Button/ButtonBankId';
import ButtonAsLink from '../../../Components/Button/ButtonAsLink';
import Disclaimer from '../../../Components/Disclaimer/Disclaimer';
import DisclaimerPadlock from '../../../Components/Disclaimer/DisclaimerPadlock';
import { getBankIdAuth } from '../../../Data/getBankIdAuth';
import { getBankIdStatus } from '../../../Data/getBankIdStatus';
import Alert from '../../../Templates/Alert';
import { isMobile } from '../../../Utils/isMobile';
import BankIdSign from '../../../Components/BankId/BankIdSign';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import { validationMethods } from '../../../Utils/validationMethods';
import { createPortal, destroyPortal } from '../../../Utils/portal';
import { WaykeStore } from '../../../Redux/store';
import { setCreatedOrderId } from '../../../Redux/action';
import { createOrder } from '../../../Data/createOrder';
import { creditAssessmentAccept } from '../../../Data/creditAssessmentAccept';

const BANKID_START_NODE = `bankid-start-node`;
const BANKID_START = `bankid-start`;

const DISCLAIMER_NODE = 'address-disclaimer-node';
const DISCLAIMER_SAFE_NODE = 'address-disclaimer-safe-node';
const DISCLAIMER_RESERVATION_NODE = 'address-disclaimer-reservation-node';

interface VerifyByBankIdProps {
  readonly store: WaykeStore;
  readonly index: number;
  readonly lastStage: boolean;
}

class VerifyByBankId extends HtmlNode {
  private readonly props: VerifyByBankIdProps;
  private bankidStatusInterval?: NodeJS.Timer;
  private view: number = 1;
  private contexts: {
    buttonLinkToggle?: ButtonAsLink;
    bankId?: BankIdSign;
  } = {};
  private ageError = false;
  private requestError = false;
  private socialIdNotMatchingError = false;

  constructor(element: HTMLElement, props: VerifyByBankIdProps) {
    super(element, { htmlTag: 'div', className: 'waykeecom-stack waykeecom-stack--2' });
    this.props = props;
    this.ageError = false;

    this.render();
  }

  private async onCreateOrder() {
    const { store } = this.props;
    this.requestError = false;
    try {
      const { order } = store.getState();
      const response = await createOrder(store);

      const paymentRequired = order?.isPaymentRequired;
      if (paymentRequired) {
        destroyPortal();
      }

      const payment = response.getPayment();

      setCreatedOrderId(response.getId(), payment)(store.dispatch);
      const { caseId } = store.getState();
      if (caseId) {
        creditAssessmentAccept(caseId);
      }
    } catch (e) {
      this.requestError = true;
      this.render();
    }
  }

  private bankIdStatus(reference: string, method: AuthMethod) {
    this.bankidStatusInterval = setInterval(async () => {
      try {
        const response = await getBankIdStatus(reference);
        if (response.isCompleted()) {
          clearInterval(this.bankidStatusInterval as NodeJS.Timer);
          const address = response.getAddress();
          const socialId = response.getPersonalNumber();

          if (address && socialId) {
            const state = this.props.store.getState();
            const over18 = validationMethods.requiredSsnOver18(socialId);
            if (!over18) {
              this.view = 1;
              this.ageError = true;
              clearInterval(this.bankidStatusInterval as NodeJS.Timer);
              destroyPortal();
              this.render();
              return;
            } else if (state.customer.socialId !== socialId) {
              this.view = 1;
              this.socialIdNotMatchingError = true;
              clearInterval(this.bankidStatusInterval as NodeJS.Timer);
              destroyPortal();
              this.render();
              return;
            }

            this.contexts.bankId?.setDescription('Verifiering klar, ordern skapas nu...');
            await this.onCreateOrder();
          }
        }
        if (response.shouldRenew()) {
          this.onStartBankIdAuth(method);
        }
      } catch (e) {
        clearInterval(this.bankidStatusInterval as NodeJS.Timer);
        this.contexts.bankId?.setErrorMessage(
          'Det gick inte att hämta status kring nuvanrade BankId signering.'
        );
      }
    }, 2000);
  }

  private async onStartBankIdAuth(method: AuthMethod) {
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
          this.contexts.bankId?.setErrorMessage(`Error: ${_e.message}`);
        }
      } else {
        const qrCode = response.getQrCode() as string;
        this.contexts.bankId?.update(method, qrCode);
      }
    } catch (e) {
      this.contexts.bankId?.setErrorMessage(
        'Det gick tyvärr inte att initiera BankId. Vänligen försök igen.'
      );
    } finally {
      this.contexts.buttonLinkToggle?.disabled(false);
    }
  }

  private onAbort() {
    this.view = 1;
    if (this.bankidStatusInterval) {
      clearInterval(this.bankidStatusInterval);
    }
    destroyPortal();
    this.render();
  }

  render() {
    const mobile = isMobile();
    const { navigation } = this.props.store.getState();

    if (this.view === 2) {
      this.contexts.bankId = new BankIdSign(createPortal(), {
        method: mobile ? AuthMethod.SameDevice : AuthMethod.QrCode,
        descriptionQrCode:
          'För att verifiera din identitet, starta din BankID applikation på din andra enhet.',
        descriptionSameDevice: 'För att verifiera din identitet, starta din BankID-applikation.',
        onAbort: () => this.onAbort(),
        onStart: (method: AuthMethod) => this.onStartBankIdAuth(method),
      });
    } else {
      this.node.innerHTML = `
        <div class="waykeecom-stack waykeecom-stack--3">
          <h4 class="waykeecom-heading waykeecom-heading--4">Strax klart!</h4>
          <div class="waykeecom-content">
            <p class="waykeecom-content__p">För att reservera bilen åt dig behöver vi bara verifiera din identitet med BankID. Efter det kommer handlaren att kontakta dig för att slutföra köpet.
            <p class="waykeecom-content__p">Köpet blir bindande först när du signerat det definitiva affärsförslaget med handlaren. Det är även då betalningen sker.</p>
          </div>
        </div>
        ${
          this.ageError
            ? `
          <div class="waykeecom-stack waykeecom-stack--3">${Alert({
            tone: 'error',
            children:
              'Du måste vara över 18 år för att kunna fortsätta. Identifiering med BankId visar att du är under 18 år gammal.',
          })}</div>
        `
            : ''
        }
        ${
          this.socialIdNotMatchingError
            ? `
          <div class="waykeecom-stack waykeecom-stack--3">${Alert({
            tone: 'error',
            children:
              'Personnummret i första steget matchar inte med det som är kopplat mot bankid',
          })}</div>
        `
            : ''
        }
        <div class="waykeecom-stack waykeecom-stack--3">
          <div class="waykeecom-stack waykeecom-stack--2" id="${BANKID_START_NODE}"></div>
          <div class="waykeecom-stack waykeecom-stack--2">
            <div class="waykeecom-stack waykeecom-stack--1" id="${DISCLAIMER_NODE}"></div>
            <div class="waykeecom-stack waykeecom-stack--1" id="${DISCLAIMER_SAFE_NODE}"></div>
            <div class="waykeecom-stack waykeecom-stack--1" id="${DISCLAIMER_RESERVATION_NODE}"></div>
          </div>
        </div>
      `;

      new ButtonBankId(this.node.querySelector<HTMLDivElement>(`#${BANKID_START_NODE}`), {
        title: 'Genomför order',
        id: BANKID_START,
        onClick: () => {
          this.view = 2;
          this.render();
        },
      });

      new Disclaimer(this.node.querySelector<HTMLDivElement>(`#${DISCLAIMER_NODE}`), {
        text: `Genom att gå vidare bekräftar du att du tagit del av Waykes <a href="#" title="" target="_blank" rel="noopener noreferrer" class="waykeecom-link">köpvillkor</a> och <a href="#" title="" target="_blank" rel="noopener noreferrer" class="waykeecom-link">villkor för ångerrätt</a>.`,
      });

      new DisclaimerPadlock(this.node.querySelector<HTMLDivElement>(`#${DISCLAIMER_SAFE_NODE}`), {
        text: 'Dina uppgifter lagras och sparas säkert. Läs mer i vår <a href="#" title="" target="_blank" rel="noopener noreferrer" class="waykeecom-link">personuppgiftspolicy</a>.',
      });

      new Disclaimer(this.node.querySelector<HTMLDivElement>(`#${DISCLAIMER_RESERVATION_NODE}`), {
        text: 'Vi reserverar oss för eventuell ändring i tillgången av utbjudna bilar.',
      });

      if (navigation.stage === this.props.index) {
        this.node.parentElement?.scrollIntoView();
      }
    }
  }
}

export default VerifyByBankId;
