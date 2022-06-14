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
import ecomEvent, { EcomStep, EcomEvent, EcomView } from '../../../Utils/ecomEvent';

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

  private async acceptCreditAssessment() {
    const { caseId } = this.props.store.getState();
    if (caseId) {
      try {
        ecomEvent(
          EcomView.MAIN,
          EcomEvent.CONFIRMATION_ACCEPT_CREDIT_ASSESSMENT_REQUEST,
          EcomStep.CONFIRMATION
        );
        await creditAssessmentAccept(caseId);
        ecomEvent(
          EcomView.MAIN,
          EcomEvent.CONFIRMATION_ACCEPT_CREDIT_ASSESSMENT_SUCCEEDED,
          EcomStep.CONFIRMATION
        );
      } catch (e) {
        ecomEvent(
          EcomView.MAIN,
          EcomEvent.CONFIRMATION_ACCEPT_CREDIT_ASSESSMENT_FAILED,
          EcomStep.CONFIRMATION
        );
      }
    }
  }

  private async onCreateOrder() {
    const { store } = this.props;
    this.requestError = false;
    try {
      ecomEvent(
        EcomView.MAIN,
        EcomEvent.CONFIRMATION_CREATE_ORDER_REQUESTED,
        EcomStep.CONFIRMATION
      );

      const { order } = store.getState();
      const response = await createOrder(store);
      ecomEvent(
        EcomView.MAIN,
        EcomEvent.CONFIRMATION_CREATE_ORDER_SUCCEEDED,
        EcomStep.CONFIRMATION
      );

      const paymentRequired = order?.isPaymentRequired;
      if (paymentRequired) {
        destroyPortal();
      }

      const payment = response.getPayment();

      setCreatedOrderId(response.getId(), payment)(store.dispatch);
      this.acceptCreditAssessment();
    } catch (e) {
      ecomEvent(EcomView.MAIN, EcomEvent.CONFIRMATION_CREATE_ORDER_FAILED, EcomStep.CONFIRMATION);
      this.requestError = true;
      this.render();
    }
  }

  private bankIdStatus(reference: string, method: AuthMethod) {
    this.bankidStatusInterval = setInterval(async () => {
      try {
        ecomEvent(
          EcomView.MAIN,
          method === AuthMethod.SameDevice
            ? EcomEvent.CONFIRMATION_BANKID_STATUS_SAME_DEVICE_REQUESTED
            : EcomEvent.CONFIRMATION_BANKID_STATUS_QR_REQUESTED,
          EcomStep.CONFIRMATION
        );

        const response = await getBankIdStatus(reference);
        ecomEvent(
          EcomView.MAIN,
          method === AuthMethod.SameDevice
            ? EcomEvent.CONFIRMATION_BANKID_STATUS_SAME_DEVICE_SUCCEEDED
            : EcomEvent.CONFIRMATION_BANKID_STATUS_QR_SUCCEEDED,
          EcomStep.CONFIRMATION
        );

        if (response.isCompleted()) {
          clearInterval(this.bankidStatusInterval as NodeJS.Timer);
          const address = response.getAddress();
          const socialId = response.getPersonalNumber();

          if (address && socialId) {
            const state = this.props.store.getState();
            const over18 = validationMethods.requiredSsnOver18(socialId);
            if (!over18) {
              ecomEvent(
                EcomView.MAIN,
                method === AuthMethod.SameDevice
                  ? EcomEvent.CONFIRMATION_BANKID_STATUS_SAME_DEVICE_COMPLETED_NOT_OVER_18
                  : EcomEvent.CONFIRMATION_BANKID_STATUS_QR_COMPLETED_NOT_OVER_18,
                EcomStep.CONFIRMATION
              );
              this.view = 1;
              this.ageError = true;
              clearInterval(this.bankidStatusInterval as NodeJS.Timer);
              destroyPortal();
              this.render();
              return;
            } else if (state.customer.socialId !== socialId) {
              ecomEvent(
                EcomView.MAIN,
                method === AuthMethod.SameDevice
                  ? EcomEvent.CONFIRMATION_BANKID_STATUS_SAME_DEVICE_COMPLETED_SSN_MISSMATCH
                  : EcomEvent.CONFIRMATION_BANKID_STATUS_QR_COMPLETED_SSN_MISSMATCH,
                EcomStep.CONFIRMATION
              );
              this.view = 1;
              this.socialIdNotMatchingError = true;
              clearInterval(this.bankidStatusInterval as NodeJS.Timer);
              destroyPortal();
              this.render();
              return;
            }
            ecomEvent(
              EcomView.MAIN,
              method === AuthMethod.SameDevice
                ? EcomEvent.CONFIRMATION_BANKID_STATUS_SAME_DEVICE_COMPLETED
                : EcomEvent.CONFIRMATION_BANKID_STATUS_QR_COMPLETED,
              EcomStep.CONFIRMATION
            );
            this.contexts.bankId?.setDescription('Verifiering klar, ordern skapas nu...');
            await this.onCreateOrder();
          }
        } else if (response.shouldRenew()) {
          ecomEvent(
            EcomView.MAIN,
            method === AuthMethod.SameDevice
              ? EcomEvent.CONFIRMATION_BANKID_STATUS_SAME_DEVICE_SHOULD_RENEW
              : EcomEvent.CONFIRMATION_BANKID_STATUS_QR_SHOULD_RENEW,
            EcomStep.CONFIRMATION
          );
          this.onStartBankIdAuth(method);
        }
      } catch (e) {
        clearInterval(this.bankidStatusInterval as NodeJS.Timer);
        this.contexts.bankId?.setErrorMessage(
          'Det gick inte att hämta status kring nuvanrade BankId signering.'
        );
        ecomEvent(
          EcomView.MAIN,
          method === AuthMethod.SameDevice
            ? EcomEvent.CONFIRMATION_BANKID_STATUS_SAME_DEVICE_FAILED
            : EcomEvent.CONFIRMATION_BANKID_STATUS_QR_FAILED,
          EcomStep.CONFIRMATION
        );
      }
    }, 2000);
  }

  private async onStartBankIdAuth(method: AuthMethod) {
    if (this.bankidStatusInterval) {
      clearInterval(this.bankidStatusInterval);
    }

    try {
      ecomEvent(EcomView.MAIN, EcomEvent.CONFIRMATION_BANKID_INIT_REQUESTED, EcomStep.CONFIRMATION);
      this.contexts.bankId?.update(method);
      this.contexts.buttonLinkToggle?.disabled(true);
      const response = await getBankIdAuth(method);
      ecomEvent(EcomView.MAIN, EcomEvent.CONFIRMATION_BANKID_INIT_SUCCEEDED, EcomStep.CONFIRMATION);
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
      ecomEvent(EcomView.MAIN, EcomEvent.CONFIRMATION_BANKID_INIT_FAILED, EcomStep.CONFIRMATION);
      this.contexts.bankId?.setErrorMessage(
        'Det gick tyvärr inte att initiera BankId. Vänligen försök igen.'
      );
    } finally {
      this.contexts.buttonLinkToggle?.disabled(false);
    }
  }

  private onAbort() {
    ecomEvent(EcomView.MAIN, EcomEvent.CONFIRMATION_BANKID_ABORTED, EcomStep.CONFIRMATION);
    this.view = 1;
    if (this.bankidStatusInterval) {
      clearInterval(this.bankidStatusInterval);
    }
    destroyPortal();
    this.render();
  }

  render() {
    const mobile = isMobile();
    const { navigation, order } = this.props.store.getState();

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
      const name = order?.contactInformation?.name;
      const conditionsPdfUri = order?.conditionsPdfUri;
      const policy = 'https://www.wayke.se/personuppgiftspolicy-wayke';

      this.node.innerHTML = `
        <div class="waykeecom-stack waykeecom-stack--3">
          <h4 class="waykeecom-heading waykeecom-heading--4">Strax klart!</h4>
          <div class="waykeecom-content">
            <p class="waykeecom-content__p">För att reservera bilen åt dig behöver vi bara verifiera din identitet med BankID. Efter det kommer ${name} att kontakta dig för att slutföra köpet.
            <p class="waykeecom-content__p">Köpet blir bindande först när du signerat det definitiva affärsförslaget med ${name}. Det är även då betalningen sker.</p>
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
        text: `Genom att gå vidare bekräftar du att du tagit del av Waykes <a href="${conditionsPdfUri}" title="" target="_blank" rel="noopener noreferrer" class="waykeecom-link">köpvillkor och villkor för ångerrätt</a>.`,
      });

      new DisclaimerPadlock(this.node.querySelector<HTMLDivElement>(`#${DISCLAIMER_SAFE_NODE}`), {
        text: `Dina uppgifter lagras och sparas säkert. Läs mer i vår <a href="${policy}" title="" target="_blank" rel="noopener noreferrer" class="waykeecom-link">personuppgiftspolicy</a>.`,
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
