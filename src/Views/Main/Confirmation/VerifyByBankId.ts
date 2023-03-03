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
import InputCheckbox from '../../../Components/Input/InputCheckbox';
import { registerInterval } from '../../../Utils/intervals';
import { getBankIdQrCode } from '../../../Data/getBankIdQrCode';
import { BankIdCollectResponse } from '@wayke-se/ecom/dist-types/bankid/bankid-collect-response';
import { BankIdAuthResponse } from '@wayke-se/ecom/dist-types/bankid/bankid-auth-response';

const CONFIRM_CONDITIONS = 'confirm-conditions';
const CONFIRM_CONDITIONS_NODE = `${CONFIRM_CONDITIONS}-node`;

const BANKID_START_NODE = `bankid-start-node`;
const BANKID_START = `bankid-start`;

const DISCLAIMER_POLICY_NODE = 'address-disclaimer-policy-node';
const DISCLAIMER_RESERVATION_NODE = 'address-disclaimer-reservation-node';

interface VerifyByBankIdProps {
  readonly store: WaykeStore;
  readonly index: number;
  readonly lastStage: boolean;
}

class VerifyByBankId extends HtmlNode {
  private readonly props: VerifyByBankIdProps;
  private bankidStatusInterval?: NodeJS.Timer;
  private bankidQrCodeInterval?: NodeJS.Timer;
  private view: number = 1;
  private contexts: {
    buttonLinkToggle?: ButtonAsLink;
    bankId?: BankIdSign;
    confirmConditions?: InputCheckbox;
    startBankid?: ButtonBankId;
  } = {};
  private ageError = false;
  private requestError = false;
  private socialIdNotMatchingError = false;
  private notAvailable = false;
  private confirmConditions: boolean = false;

  private bankidRequestRef:
    | {
        reference: string;
        method: AuthMethod;
      }
    | undefined = undefined;

  constructor(element: HTMLElement, props: VerifyByBankIdProps) {
    super(element, { htmlTag: 'div', className: 'waykeecom-stack waykeecom-stack--2' });
    this.props = props;
    this.ageError = false;

    this.render();
  }

  private addWindowEvents() {
    this.removeWindowEvents();
    window.addEventListener('focus', () => this.onFocus());
  }
  private removeWindowEvents() {
    window.removeEventListener('focus', () => this.onFocus());
  }

  private clearIntervals() {
    clearInterval(this.bankidQrCodeInterval as NodeJS.Timer);
    clearInterval(this.bankidStatusInterval as NodeJS.Timer);
  }

  private async onFocus() {
    // eslint-disable-next-line
    console.log('ON focus', JSON.stringify(this.bankidRequestRef));
    if (this.bankidRequestRef?.method === AuthMethod.SameDevice) {
      const { reference, method } = this.bankidRequestRef;
      this.clearBankidRequestRef();
      // eslint-disable-next-line
      console.log('fetching status');
      try {
        const response = await getBankIdStatus(reference);
        this.handleBankidStatusResponse(response, method);
      } catch (e) {
        this.clearIntervals();
        this.contexts.bankId?.setErrorMessage(
          'Det gick inte att hämta status kring nuvanrade BankId signering.'
        );
      }
    }
  }

  private setBankidRequestRef(reference: string, method: AuthMethod) {
    this.bankidRequestRef = {
      reference,
      method,
    };
    // eslint-disable-next-line
    console.log('setBankidRequestRef', JSON.stringify(this.bankidRequestRef));
  }

  private clearBankidRequestRef() {
    this.bankidRequestRef = undefined;
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
    this.notAvailable = false;
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

      setCreatedOrderId(response.getOrderNumber(), payment)(store.dispatch);
      this.acceptCreditAssessment();
    } catch (ee) {
      const e = ee as { message?: string };
      this.view = 1;
      ecomEvent(EcomView.MAIN, EcomEvent.CONFIRMATION_CREATE_ORDER_FAILED, EcomStep.CONFIRMATION);
      if (e.message === 'The vehicle is not available for purchase') {
        this.requestError = false;
        this.notAvailable = true;
      } else {
        this.notAvailable = false;
        this.requestError = true;
      }
      destroyPortal();

      this.render();
    }
  }

  private async handleBankidStatusResponse(response: BankIdCollectResponse, method: AuthMethod) {
    if (response.isCompleted()) {
      this.removeWindowEvents();
      this.clearBankidRequestRef();
      this.clearIntervals();
      const address = response.getAddress();
      const socialId = response.getPersonalNumber();

      if (address && socialId) {
        const state = this.props.store.getState();
        const over18 = validationMethods.requiredSsnOver18(socialId);
        if (!over18) {
          ecomEvent(
            EcomView.MAIN,
            method === AuthMethod.SameDevice
              ? EcomEvent.CONFIRMATION_BANKID_STATUS_SAME_DEVICE_SUCCEEDED_NOT_OVER_18
              : EcomEvent.CONFIRMATION_BANKID_STATUS_QR_SUCCEEDED_NOT_OVER_18,
            EcomStep.CONFIRMATION
          );
          this.view = 1;
          this.ageError = true;
          destroyPortal();
          this.render();
          return;
        } else if (state.customer.socialId !== socialId) {
          ecomEvent(
            EcomView.MAIN,
            method === AuthMethod.SameDevice
              ? EcomEvent.CONFIRMATION_BANKID_STATUS_SAME_DEVICE_SUCCEEDED_SSN_MISSMATCH
              : EcomEvent.CONFIRMATION_BANKID_STATUS_QR_SUCCEEDED_SSN_MISSMATCH,
            EcomStep.CONFIRMATION
          );
          this.view = 1;
          this.socialIdNotMatchingError = true;
          destroyPortal();
          this.render();
          return;
        }
        ecomEvent(
          EcomView.MAIN,
          method === AuthMethod.SameDevice
            ? EcomEvent.CONFIRMATION_BANKID_STATUS_SAME_DEVICE_SUCCEEDED
            : EcomEvent.CONFIRMATION_BANKID_STATUS_QR_SUCCEEDED,
          EcomStep.CONFIRMATION
        );
        this.contexts.bankId?.setDescription('Verifiering klar, ordern skapas nu...');
        await this.onCreateOrder();
      }
    }
  }

  private bankidStatus = async (reference: string) => {
    try {
      const response = await getBankIdStatus(reference);
      this.handleBankidStatusResponse(response, AuthMethod.QrCode);
    } catch (e) {
      this.clearIntervals();
      this.contexts.bankId?.setErrorMessage(
        'Det gick inte att hämta status kring nuvanrade BankId signering.'
      );
    }
  };

  private qrCode = async (reference: string) => {
    try {
      const response = await getBankIdQrCode(reference);
      const qrCode = response.getQrCode();
      this.contexts.bankId?.update(AuthMethod.QrCode, qrCode);
    } catch (e) {
      this.clearIntervals();
      this.contexts.bankId?.setErrorMessage(
        'Det gick inte att hämta ny QR-kod för BankId signering.'
      );
    }
  };

  private async startBankidSameDevice(
    response: BankIdAuthResponse,
    reference: string,
    supressTracking = false
  ) {
    if (!supressTracking) {
      ecomEvent(
        EcomView.MAIN,
        EcomEvent.CONFIRMATION_BANKID_STATUS_SAME_DEVICE_REQUESTED,
        EcomStep.CONFIRMATION
      );
    }
    try {
      this.setBankidRequestRef(reference, AuthMethod.SameDevice);
      this.addWindowEvents();
      const autoLaunchUrl = response.getAutoLaunchUrl() as string;
      this.contexts.bankId?.update(AuthMethod.SameDevice, autoLaunchUrl);
    } catch (e) {
      this.removeWindowEvents();
      this.clearBankidRequestRef();
      const _e = e as { message: string };
      this.contexts.bankId?.setErrorMessage(`Error: ${_e.message}`);
    }
  }

  private async startBankidWithQr(reference: string, supressTracking = false) {
    if (!supressTracking) {
      ecomEvent(
        EcomView.MAIN,
        EcomEvent.CONFIRMATION_BANKID_STATUS_QR_REQUESTED,
        EcomStep.CONFIRMATION
      );
    }

    this.bankidStatusInterval = setInterval(() => {
      this.bankidStatus(reference);
    }, 2000);
    registerInterval('bankidStatusInterval', this.bankidStatusInterval as unknown as number);

    this.qrCode(reference);
    this.bankidQrCodeInterval = setInterval(async () => {
      this.qrCode(reference);
    }, 1000);
    registerInterval('bankidQrCodeInterval', this.bankidQrCodeInterval as unknown as number);
  }

  private async onStartBankIdAuth(method: AuthMethod, supressTracking = false) {
    this.clearIntervals();

    try {
      if (!supressTracking) {
        ecomEvent(
          EcomView.MAIN,
          EcomEvent.CONFIRMATION_BANKID_INIT_REQUESTED,
          EcomStep.CONFIRMATION
        );
      }
      this.contexts.bankId?.update(method);
      this.contexts.buttonLinkToggle?.disabled(true);
      const response = await getBankIdAuth(method);
      if (!supressTracking) {
        ecomEvent(
          EcomView.MAIN,
          EcomEvent.CONFIRMATION_BANKID_INIT_SUCCEEDED,
          EcomStep.CONFIRMATION
        );
      }
      const reference = response.getOrderRef();
      if (method === AuthMethod.QrCode) {
        this.startBankidWithQr(reference, supressTracking);
      } else {
        this.startBankidSameDevice(response, method, supressTracking);
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
    this.clearBankidRequestRef();
    this.removeWindowEvents();
    this.clearIntervals();
    ecomEvent(EcomView.MAIN, EcomEvent.CONFIRMATION_BANKID_ABORTED, EcomStep.CONFIRMATION);
    this.view = 1;

    destroyPortal();
    this.render();
  }

  private onCheckbox(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    this.confirmConditions = currentTarget.checked;
    this.contexts.confirmConditions?.checked(this.confirmConditions);
    this.contexts.startBankid?.disabled(!this.confirmConditions);
  }

  render() {
    const mobile = isMobile();
    const { navigation, order, insurance } = this.props.store.getState();

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
      const policy = 'https://www.wayke.se/trygghet-naer-det-kommer-till-dina-personuppgifter';

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
          this.requestError
            ? `
          <div class="waykeecom-stack waykeecom-stack--3">${Alert({
            tone: 'error',
            children: 'Ett fel uppstod och det gick inte att skapa ordern, försök igen.',
          })}</div>
        `
            : ''
        }

        ${
          this.notAvailable
            ? `
          <div class="waykeecom-stack waykeecom-stack--3">${Alert({
            tone: 'error',
            children: 'Den här bilen finns tyvärr inte längre tillgänglig.',
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
          <div class="waykeecom-stack waykeecom-stack--2" id="${CONFIRM_CONDITIONS_NODE}"></div>
          <div class="waykeecom-stack waykeecom-stack--2" id="${BANKID_START_NODE}"></div>
          <div class="waykeecom-stack waykeecom-stack--2">
            <div class="waykeecom-stack waykeecom-stack--1" id="${DISCLAIMER_POLICY_NODE}"></div>
            <div class="waykeecom-stack waykeecom-stack--1" id="${DISCLAIMER_RESERVATION_NODE}"></div>
          </div>
        </div>
      `;
      this.contexts.confirmConditions = new InputCheckbox(
        this.node.querySelector<HTMLDivElement>(`#${CONFIRM_CONDITIONS_NODE}`),
        {
          checked: this.confirmConditions,
          id: CONFIRM_CONDITIONS,
          disabled: this.notAvailable,
          name: 'confirmConditions',
          title: `<div>Jag godkänner <a href="${conditionsPdfUri}" title="" target="_blank" rel="noopener noreferrer" class="waykeecom-link">köpvillkor och villkor för ångerrätt</a>${
            insurance
              ? ' <span class="waykeecom-text waykeecom-text--margin-left">samt har tagit del av information kring försäkringsförmedling</span>'
              : ''
          }.</div>`,
          value: 'confirmConditions',
          onClick: (e) => this.onCheckbox(e),
        }
      );

      this.contexts.startBankid = new ButtonBankId(
        this.node.querySelector<HTMLDivElement>(`#${BANKID_START_NODE}`),
        {
          title: 'Reservera bilen',
          id: BANKID_START,
          disabled: !this.confirmConditions || this.notAvailable,
          onClick: () => {
            this.view = 2;
            this.render();
          },
        }
      );

      new DisclaimerPadlock(this.node.querySelector<HTMLDivElement>(`#${DISCLAIMER_POLICY_NODE}`), {
        text: `Dina personuppgifter behandlas och sparas i enlighet med vår <a href="${policy}" title="personuppgiftspolicy" target="_blank" rel="noopener noreferrer" class="waykeecom-link">personuppgiftspolicy</a>.`,
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
