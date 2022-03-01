import { IPaymentOption, IPaymentRangeSpec } from '@wayke-se/ecom';
import { PaymentLookupResponse } from '@wayke-se/ecom/dist-types/payments/payment-lookup-response';
import ButtonArrowRight from '../../../Components/Button/ButtonArrowRight';
import InputRange from '../../../Components/Input/InputRange';
import { getPayment } from '../../../Data/getPayment';
import { setPaymentLookupResponse } from '../../../Redux/action';
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

type LoanNames = 'downPayment' | 'duration' | 'residual';

class Loan {
  private element: HTMLDivElement;
  private loan: IPaymentOption;
  private paymentState: PaymentState;
  private paymentLookupResponse: PaymentLookupResponse;

  constructor(
    element: HTMLDivElement,
    loan: IPaymentOption,
    vehicleId: string,
    paymentLookupResponse?: PaymentLookupResponse
  ) {
    this.element = element;
    this.loan = loan;
    if (!this.loan.loanDetails) throw 'err';

    this.paymentLookupResponse = paymentLookupResponse || this.loan.loanDetails;
    this.paymentState = {
      vehicleId,
      dealerId: '',
      downPayment: this.paymentLookupResponse.getDownPaymentSpec(),
      duration: this.paymentLookupResponse.getDurationSpec(),
      residual: this.paymentLookupResponse.getResidualValueSpec(),
    };

    this.paymentLookupResponse.shouldUseCreditScoring();

    this.render();
  }

  async payment() {
    try {
      const response = await getPayment({
        vehicleId: this.paymentState.vehicleId,
        downPayment: this.paymentState.downPayment.current,
        duration: this.paymentState.duration.current,
        residual: this.paymentState.residual?.current,
      });
      this.paymentLookupResponse = response;
      this.paymentState = {
        ...this.paymentState,
        downPayment: response.getDownPaymentSpec(),
        duration: response.getDurationSpec(),
        residual: response.getResidualValueSpec(),
      };
      setPaymentLookupResponse(response);
      // this.render();
    } catch (e) {
      throw e;
    }
  }

  onChange(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const name = currentTarget.name as LoanNames;
    const value = currentTarget.value;

    this.paymentState[name].current =
      name === 'residual' ? parseInt(value, 10) / 100 : parseInt(value, 10);
    this.payment();
  }

  render() {
    const shouldUseCreditScoring = this.paymentLookupResponse.shouldUseCreditScoring();

    this.element.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--3">
        <hr class="waykeecom-separator" />
      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        <h5 class="waykeecom-heading waykeecom-heading--4">Billån</h5>
        <div class="waykeecom-content">
          <p>Finansiera bilen med billån via Volvofinans Bank. Gör din låneansökan här – och få besked direkt. Kom ihåg, köpet är inte bindande förrän du signerat det definitiva affärsförslaget som tas fram av [handlaren].</p>
          <p>Ange din tänkta kontantinsats och hur många månader du vill lägga upp ditt lån på.</p>
        </div>
      </div>
      <div class="waykeecom-stack waykeecom-stack--3">
        <div class="waykeecom-stack waykeecom-stack--3" id="${DOWNPAYMENT_RANGE_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--3" id="${DURATION_RANGE_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--3" id="${RESIDUAL_RANGE_NODE}"></div>
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

    new InputRange(this.element.querySelector<HTMLDivElement>(`#${DOWNPAYMENT_RANGE_NODE}`), {
      title: 'Kontantinsats',
      value: this.paymentState.downPayment.current,
      id: DOWNPAYMENT_RANGE,
      name: 'downPayment',
      onChange: (e) => this.onChange(e),
      min: this.paymentState.downPayment.min,
      max: this.paymentState.downPayment.max,
      unit: 'kr',
    });

    new InputRange(this.element.querySelector<HTMLDivElement>(`#${DURATION_RANGE_NODE}`), {
      title: 'Avbetalning',
      value: this.paymentState.duration.current,
      id: DURATION_RANGE,
      name: 'duration',
      onChange: (e) => this.onChange(e),
      min: this.paymentState.duration.min,
      max: this.paymentState.duration.max,
      step: this.paymentState.duration.step,
      unit: 'mån',
    });

    if (this.paymentState.residual) {
      new InputRange(this.element.querySelector<HTMLDivElement>(`#${RESIDUAL_RANGE_NODE}`), {
        title: 'Restvärde',
        value: this.paymentState.residual.current * 100,
        id: RESIDUAL_RANGE,
        name: 'residual',
        onChange: (e) => this.onChange(e),
        min: this.paymentState.residual.min * 100,
        max: this.paymentState.residual.max * 100,
        step: this.paymentState.residual.step * 100,
        unit: '%',
      });
    }

    new LoanDetails(this.element.querySelector<HTMLDivElement>(`#${LOAN_DETAILS_NODE}`), {
      loan: this.loan,
      paymentLookupResponse: this.paymentLookupResponse,
    });

    if (shouldUseCreditScoring) {
      new CreditAssessment(
        this.element.querySelector<HTMLDivElement>(`#${CREDIT_ASSESMENT_NODE}`),
        {
          loan: this.loan,
          paymentLookupResponse: this.paymentLookupResponse,
        }
      );
    } else {
      new ButtonArrowRight(this.element.querySelector<HTMLDivElement>(`#${PROCEED_NODE}`), {
        title: 'Fortsätt',
        id: PROCEED,
        onClick: () => {},
      });
    }
  }
}

export default Loan;
