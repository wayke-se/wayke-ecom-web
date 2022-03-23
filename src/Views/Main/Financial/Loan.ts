import { IPaymentRangeSpec } from '@wayke-se/ecom';
import { PaymentOption } from '../../../@types/OrderOptions';
import { PaymentLookup } from '../../../@types/PaymentLookup';
import ButtonArrowRight from '../../../Components/Button/ButtonArrowRight';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import InputRange from '../../../Components/Input/InputRange';
import { getPayment } from '../../../Data/getPayment';
import { setPaymentLookupResponse } from '../../../Redux/action';
import { WaykeStore } from '../../../Redux/store';
import Alert from '../../../Templates/Alert';
import { convertPaymentLookupResponse } from '../../../Utils/convert';
import CreditAssessment from './CreditAssessment';
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

interface PaymentState {
  vehicleId: string;
  dealerId: string;
  downPayment: IPaymentRangeSpec;
  duration: IPaymentRangeSpec;
  residual: IPaymentRangeSpec;
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
  private paymentLookupResponse: PaymentLookup;
  private paymentRequestFailed?: boolean;
  private lastEditedField: LoanNames = 'downPayment';
  private contexts: {
    downPayment?: InputRange;
    duration?: InputRange;
    residual?: InputRange;
    loanDetails?: LoanDetails;
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
    };

    this.render();
  }

  private async payment() {
    this.contexts.downPayment?.disabled(true);
    this.contexts.duration?.disabled(true);
    this.contexts.residual?.disabled(true);

    if (this.paymentRequestFailed) {
      this.paymentRequestFailed = false;
      this.render();
    }

    try {
      const response = await getPayment({
        vehicleId: this.paymentState.vehicleId,
        downPayment: this.paymentState.downPayment.current,
        duration: this.paymentState.duration.current,
        residual: this.paymentState.residual?.current,
      });
      this.paymentLookupResponse = convertPaymentLookupResponse(response);
      this.paymentState = {
        ...this.paymentState,
        downPayment: this.paymentLookupResponse.downPaymentSpec,
        duration: this.paymentLookupResponse.durationSpec,
        residual: this.paymentLookupResponse.residualValueSpec,
      };
      setPaymentLookupResponse(response)(this.props.store.dispatch);
      this.update();
      this.contexts.downPayment?.disabled(false);
      this.contexts.duration?.disabled(false);
      this.contexts.residual?.disabled(false);
    } catch (e) {
      this.paymentRequestFailed = true;
      this.render();
    }
  }

  private onChange(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const name = currentTarget.name as LoanNames;
    const value = currentTarget.value;

    this.paymentState[name].current =
      name === 'residual' ? parseInt(value, 10) / 100 : parseInt(value, 10);
    this.lastEditedField = name;
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
    const shouldUseCreditScoring = this.paymentLookupResponse.shouldUseCreditScoring;

    const requestError = this.paymentRequestFailed
      ? ` <div class="waykeecom-stack waykeecom-stack--3">${Alert({
          tone: 'error',
          children: `Ett fel uppstod, försök igen.`,
        })}</div>`
      : '';

    this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--3">
        <hr class="waykeecom-separator" />
      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        <h5 class="waykeecom-heading waykeecom-heading--4">Billån</h5>
        <div class="waykeecom-content">
          <p class="waykeecom-content__p">Finansiera bilen med billån via Volvofinans Bank. Gör din låneansökan här - och få besked direkt. Kom ihåg, köpet är inte bindande förrän du signerat det definitiva affärsförslaget som tas fram av ${name}.</p>
          <p class="waykeecom-content__p">Ange din tänkta kontantinsats och hur många månader du vill lägga upp ditt lån på.</p>
        </div>
      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-stack waykeecom-stack--3" id="${DOWNPAYMENT_RANGE_NODE}"></div>
        ${this.lastEditedField === 'downPayment' ? requestError : ''}
        <div class="waykeecom-stack waykeecom-stack--3" id="${DURATION_RANGE_NODE}"></div>
        ${this.lastEditedField === 'duration' ? requestError : ''}
        <div class="waykeecom-stack waykeecom-stack--3" id="${RESIDUAL_RANGE_NODE}"></div>
        ${this.lastEditedField === 'residual' ? requestError : ''}
       

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
        title: 'Kontantinsats',
        value: this.paymentState.downPayment.current,
        id: DOWNPAYMENT_RANGE,
        name: 'downPayment',
        onChange: (e) => this.onChange(e),
        min: this.paymentState.downPayment.min,
        max: this.paymentState.downPayment.max,
        unit: 'kr',
        information: `
          <div class="waykeecom-content waykeecom-content--inherit-size">
            <p class="waykeecom-content__p"><span class="waykeecom-text waykeecom-text--font-medium">Hur mycket av dina egna pengar vill du lägga?</span></p>
            <p class="waykeecom-content__p">Kontantinsatsen är en del av bilens pris som du betalar med egna pengar. Den behöver vara minst 20% av priset på bilen. Kontantinsatsen betalar du senare i samband med avtalsskrivning hos ${name}.</p>
            <p class="waykeecom-content__p">Ifall du har en inbytesbil kan du betala kontantinsatsen med den. Detta kommer du överens om tillsammans med ${name} vid avtalsskrivning. </p>
          </div>
        `,
      }
    );

    this.contexts.duration = new InputRange(
      this.node.querySelector<HTMLDivElement>(`#${DURATION_RANGE_NODE}`),
      {
        title: 'Avbetalning',
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
          title: 'Restvärde',
          value: this.paymentState.residual.current * 100,
          id: RESIDUAL_RANGE,
          name: 'residual',
          onChange: (e) => this.onChange(e),
          min: this.paymentState.residual.min * 100,
          max: this.paymentState.residual.max * 100,
          step: this.paymentState.residual.step * 100,
          unit: '%',
        }
      );
    }

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
      new ButtonArrowRight(this.node.querySelector<HTMLDivElement>(`#${PROCEED_NODE}`), {
        title: 'Gå vidare',
        id: PROCEED,
        onClick: () => onProceed(),
      });
    }
  }
}

export default Loan;
