import i18next from '@i18n';
import { IPaymentRangeSpec } from '@wayke-se/ecom';
import { PaymentOption } from '../../../@types/OrderOptions';
import { PaymentLookup } from '../../../@types/PaymentLookup';
import ButtonArrowRight from '../../../Components/Button/ButtonArrowRight';
import ErrorAlert from '../../../Components/ErrorAlert';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import InputRange from '../../../Components/Input/InputRange';
import { getPayment } from '../../../Data/getPayment';
import { setPaymentLookupResponse } from '../../../Redux/action';
import { WaykeStore } from '../../../Redux/store';
import { convertPaymentLookupResponse } from '../../../Utils/convert';
import ecomEvent, { EcomEvent, EcomView, EcomStep } from '../../../Utils/ecomEvent';
import CreditAssessment, { DISCLAIMER_WRAPPER_NODE } from './CreditAssessment';
import LoanDetails from './LoanDetails';

const DOWNPAYMENT_RANGE_NODE = 'downpayment-range-node';
const DOWNPAYMENT_RANGE = 'downpayment-range';

const DURATION_RANGE_NODE = 'duration-range-node';
const DURATION_RANGE = 'duration-range';

const RESIDUAL_RANGE_NODE = 'residual-range-node';
const RESIDUAL_RANGE = 'residual-range';

const LOAN_DETAILS_id = 'loan-details';
const LOAN_DETAILS_NODE = `${LOAN_DETAILS_id}-node`;

const CREDIT_ASSESMENT_NODE = 'credit-assessment-node';

const PROCEED = 'credit-assessment-proceed';
const PROCEED_NODE = `${PROCEED}-node`;
const ERROR_NODE = 'loan-error-node';

interface PaymentState {
  vehicleId: string;
  dealerId: string;
  downPayment: IPaymentRangeSpec;
  duration: IPaymentRangeSpec;
  residual: IPaymentRangeSpec;
  financialOptionId?: string;
}

interface LoanProps {
  readonly store: WaykeStore;
  readonly loan: PaymentOption;
  readonly vehicleId: string;
  readonly paymentLookupResponse?: PaymentLookup;
  readonly onProceed: () => void;
}

type LoanNames = 'downPayment' | 'duration' | 'residual';

class Loan extends HtmlNode {
  private readonly props: LoanProps;
  private paymentState: PaymentState;
  private previousState: PaymentState;
  private paymentLookupResponse: PaymentLookup;
  private contexts: {
    downPayment?: InputRange;
    duration?: InputRange;
    residual?: InputRange;
    loanDetails?: LoanDetails;
    proceedButton?: ButtonArrowRight;
    errorAlert?: ErrorAlert;
  } = {};

  constructor(element: HTMLDivElement, props: LoanProps) {
    super(element);
    this.props = props;
    const loanDetails = this.props.loan.loanDetails;
    if (!loanDetails) throw 'err';
    this.paymentLookupResponse = this.props.paymentLookupResponse || loanDetails;

    this.paymentState = {
      vehicleId: this.props.vehicleId,
      dealerId: '',
      downPayment: this.paymentLookupResponse.downPaymentSpec,
      duration: this.paymentLookupResponse.durationSpec,
      residual: this.paymentLookupResponse.residualValueSpec,
      financialOptionId: this.paymentLookupResponse.financialOptionId,
    };
    this.previousState = JSON.parse(JSON.stringify(this.paymentState));

    this.render();
  }

  private async payment() {
    this.contexts.downPayment?.disabled(true);
    this.contexts.duration?.disabled(true);
    this.contexts.residual?.disabled(true);
    this.contexts.proceedButton?.disabled(true);
    try {
      const response = await getPayment({
        vehicleId: this.paymentState.vehicleId,
        downPayment: this.paymentState.downPayment.current,
        duration: this.paymentState.duration.current,
        residual: this.paymentState.residual?.current,
        financialOptionId: this.paymentState.financialOptionId,
      });
      this.previousState = JSON.parse(JSON.stringify(this.paymentState));
      this.paymentLookupResponse = convertPaymentLookupResponse(response);
      this.paymentState = {
        ...this.paymentState,
        downPayment: this.paymentLookupResponse.downPaymentSpec,
        duration: this.paymentLookupResponse.durationSpec,
        residual: this.paymentLookupResponse.residualValueSpec,
        financialOptionId: this.paymentLookupResponse.financialOptionId,
      };

      setPaymentLookupResponse(response)(this.props.store.dispatch);
      this.update();

      this.contexts.errorAlert?.update(undefined);
      this.contexts.downPayment?.update(
        this.paymentState.downPayment.current,
        this.paymentState.downPayment.min,
        this.paymentState.downPayment.max
      );
      this.contexts.residual?.update(
        parseInt(`${this.paymentState.residual.current * 100}`, 10),
        parseInt(`${this.paymentState.residual.min * 100}`, 10),
        parseInt(`${this.paymentState.residual.max * 100}`, 10)
      );
      this.contexts.duration?.update(
        this.paymentState.duration.current,
        this.paymentState.duration.min,
        this.paymentState.duration.max
      );
    } catch (_e) {
      this.contexts.errorAlert?.update(i18next.t('loan.errorOccurred'));
      this.contexts.downPayment?.disabled(false);
      this.contexts.duration?.disabled(false);
      this.contexts.residual?.disabled(false);

      /*Roll back to previous state */
      this.contexts.downPayment?.update(
        this.previousState.downPayment.current,
        this.previousState.downPayment.min,
        this.previousState.downPayment.max
      );

      this.contexts.residual?.update(
        parseInt(`${this.previousState.residual.current * 100}`, 10),
        parseInt(`${this.previousState.residual.min * 100}`, 10),
        parseInt(`${this.previousState.residual.max * 100}`, 10)
      );
      this.contexts.duration?.update(
        this.previousState.duration.current,
        this.previousState.duration.min,
        this.previousState.duration.max
      );
    } finally {
      this.contexts.downPayment?.disabled(false);
      this.contexts.duration?.disabled(false);
      this.contexts.residual?.disabled(false);
      this.contexts.proceedButton?.disabled(false);
    }
  }

  private onChange(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const name = currentTarget.name as LoanNames;
    const value = currentTarget.value;
    currentTarget.value = value;
    this.paymentState[name].current =
      name === 'residual' ? parseInt(value, 10) / 100 : parseInt(value, 10);
    this.payment();
  }

  private update() {
    this.contexts.loanDetails?.update({
      loan: this.props.loan,
      paymentLookupResponse: this.paymentLookupResponse,
    });
  }

  render() {
    const { store, loan, onProceed } = this.props;
    const { order } = store.getState();
    const name = order?.contactInformation?.name;
    const shouldUseCreditScoring = loan.loanDetails?.shouldUseCreditScoring;

    this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--3">
        <hr class="waykeecom-separator" />
      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        <h5 class="waykeecom-heading waykeecom-heading--4">${i18next.t('loan.title')}</h5>
        <div class="waykeecom-content">
          <p class="waykeecom-content__p">${i18next.t('loan.description', { name: loan?.name })}${
            shouldUseCreditScoring ? ` ${i18next.t('loan.creditScoringInfo', { name })}` : ''
          }</p>
          <p class="waykeecom-content__p">${i18next.t('loan.instruction')}</p>
        </div>
      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-stack waykeecom-stack--3" id="${DOWNPAYMENT_RANGE_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--3" id="${DURATION_RANGE_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--3" id="${RESIDUAL_RANGE_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--3" id="${ERROR_NODE}"></div>

        <div class="waykeecom-stack waykeecom-stack--3" id="${LOAN_DETAILS_NODE}"></div>
      </div>
      ${
        shouldUseCreditScoring
          ? `
            <div class="waykeecom-stack waykeecom-stack--3" id="${CREDIT_ASSESMENT_NODE}"></div>
          `
          : `<div class="waykeecom-stack waykeecom-stack--3" id="${PROCEED_NODE}"></div>`
      }
    `;

    this.contexts.downPayment = new InputRange(
      this.node.querySelector<HTMLDivElement>(`#${DOWNPAYMENT_RANGE_NODE}`),
      {
        title: i18next.t('loan.downPaymentTitle'),
        value: this.paymentState.downPayment.current,
        id: DOWNPAYMENT_RANGE,
        name: 'downPayment',
        onChange: (e) => this.onChange(e),
        min: this.paymentState.downPayment.min,
        max: this.paymentState.downPayment.max,
        unit: 'kr',
        information: `
          <div class="waykeecom-content waykeecom-content--inherit-size">
            <p class="waykeecom-content__p"><span class="waykeecom-text waykeecom-text--font-medium">${i18next.t('loan.downPaymentInfoTitle')}</span></p>
            <p class="waykeecom-content__p">${i18next.t('loan.downPaymentInfoDescription', { name })}</p>
          </div>
        `,
        onClickInformation: () => {
          ecomEvent(
            EcomView.MAIN,
            EcomEvent.FINANCIAL_LOAN_DOWNPAYMENT_INFORMATION_TOGGLE,
            EcomStep.FINANCIAL
          );
        },
      }
    );

    this.contexts.duration = new InputRange(
      this.node.querySelector<HTMLDivElement>(`#${DURATION_RANGE_NODE}`),
      {
        title: i18next.t('loan.durationTitle'),
        value: this.paymentState.duration.current,
        id: DURATION_RANGE,
        name: 'duration',
        onChange: (e) => this.onChange(e),
        min: this.paymentState.duration.min,
        max: this.paymentState.duration.max,
        step: this.paymentState.duration.step,
        unit: 'mån',
      }
    );

    if (this.paymentState.residual) {
      this.contexts.residual = new InputRange(
        this.node.querySelector<HTMLDivElement>(`#${RESIDUAL_RANGE_NODE}`),
        {
          title: i18next.t('loan.residualTitle'),
          value: parseInt(`${this.paymentState.residual.current * 100}`, 10),
          id: RESIDUAL_RANGE,
          name: 'residual',
          onChange: (e) => this.onChange(e),
          min: parseInt(`${this.paymentState.residual.min * 100}`, 10),
          max: parseInt(`${this.paymentState.residual.max * 100}`, 10),
          step: parseInt(`${this.paymentState.residual.step * 100}`, 10),
          unit: '%',
        }
      );
    }

    this.contexts.errorAlert = new ErrorAlert(
      this.node.querySelector<HTMLDivElement>(`#${ERROR_NODE}`),
      {}
    );

    this.contexts.loanDetails = new LoanDetails(
      this.node.querySelector<HTMLDivElement>(`#${LOAN_DETAILS_NODE}`),
      {
        loan,
        paymentLookupResponse: this.paymentLookupResponse,
      }
    );

    if (shouldUseCreditScoring) {
      new CreditAssessment(this.node.querySelector<HTMLDivElement>(`#${CREDIT_ASSESMENT_NODE}`), {
        store,
        loan,
        paymentLookupResponse: this.paymentLookupResponse,
        onProceed: () => onProceed(),
      });
    } else {
      this.contexts.proceedButton = new ButtonArrowRight(
        this.node.querySelector<HTMLDivElement>(`#${PROCEED_NODE}`),
        {
          title: i18next.t('loan.proceedButton'),
          id: PROCEED,
          onClick: () => onProceed(),
        }
      );
    }
  }
}

export default Loan;
