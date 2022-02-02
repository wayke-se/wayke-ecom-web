import { IPaymentOption, IPaymentRangeSpec } from '@wayke-se/ecom';
import { PaymentLookupResponse } from '@wayke-se/ecom/dist-types/payments/payment-lookup-response';
import InputRange from '../../../Components/InputRange';
import { getPayment } from '../../../Data/getPayment';
import { setPaymentLookupResponse } from '../../../Redux/action';
import KeyValueListItem from '../../../Templates/KeyValueListItem';
import { prettyNumber } from '../../../Utils/format';

const DOWNPAYMENT_RANGE_NODE = 'downpayment-range-node';
const DOWNPAYMENT_RANGE = 'downpayment-range';

const DURATION_RANGE_NODE = 'duration-range-node';
const DURATION_RANGE = 'duration-range';

const RESIDUAL_RANGE_NODE = 'residual-range-node';
const RESIDUAL_RANGE = 'residual-range';

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

    this.render();
  }

  async payment() {
    try {
      const response = await getPayment({
        vehicleId: this.paymentState.vehicleId,
        downPayment: this.paymentState.downPayment.current,
        duration: this.paymentState.duration.current,
        residual: this.paymentState.residual.current,
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
    const { monthlyCost, totalCreditCost } = this.paymentLookupResponse.getCosts();
    const { interest, effectiveInterest } = this.paymentLookupResponse.getInterests();

    const downPayment = this.paymentLookupResponse.getDownPaymentSpec().current;
    const duration = this.paymentLookupResponse.getDurationSpec().current;
    const { administrationFee, setupFee } = this.paymentLookupResponse.getFees();
    const creditAmount = this.paymentLookupResponse.getCreditAmount();

    const publicUrl = this.loan.loanDetails?.getPublicURL();

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

        <div class="waykeecom-stack waykeecom-stack--3">
          <div style="border: 5px solid black; padding: 16px;">
            <div>${this.loan.name}</div>
            <img style="width: 200px;" src="${this.loan.logo}" />
            <div>Månadskostnad för lånet: ${prettyNumber(monthlyCost, {
              postfix: 'kr/mån',
            })}</div>
            <p>*Beräknat på ${interest * 100} % ränta (effektivt ${
      effectiveInterest * 100
    } %). Den ränta du får sätts vid avtalskrivning.</p>
            <h2>Detaljer</h2>
            <div class="waykeecom-stack waykeecom-stack--1">
              <ul class="waykeecom-key-value-list">
                ${KeyValueListItem({
                  key: 'Kontantinsats',
                  value: prettyNumber(downPayment, { postfix: 'kr' }),
                })}
                ${KeyValueListItem({
                  key: 'Lån',
                  value: prettyNumber(creditAmount, { postfix: 'kr' }),
                })}
              </ul>
            </div>
            <h2>Detaljer</h2>
            <div class="waykeecom-stack waykeecom-stack--1">
              <ul class="waykeecom-key-value-list">
                ${KeyValueListItem({ key: 'Avbetalningsperoid', value: `${duration} mån` })}

                ${KeyValueListItem({ key: 'Ränta', value: `${interest * 100}%` })}

                ${KeyValueListItem({ key: 'Effektiv ränta', value: `${effectiveInterest * 100}%` })}

                ${
                  setupFee !== undefined &&
                  KeyValueListItem({
                    key: 'Uppläggningskostnad',
                    value: prettyNumber(setupFee, { postfix: 'kr' }),
                  })
                }

                ${
                  administrationFee !== undefined &&
                  KeyValueListItem({
                    key: 'Administrativa kostnader',
                    value: prettyNumber(administrationFee, { postfix: 'kr' }),
                  })
                }
                ${KeyValueListItem({
                  key: 'Total kreditkostnad',
                  value: prettyNumber(totalCreditCost, { postfix: 'kr/mån' }),
                })}
              </ul>
            </div>
            <div class="waykeecom-stack waykeecom-stack--1">
              <p>*Det här är inte den slutgiltiga offerten. Räntan kan komma att ändras ifall det sker justeringar i initial amorteringsplan, tillägg i utrustning eller andra ändringar som påverkar det initiala prisförslaget. 

              Om marknadsräntan förändras kan månadskostnaden komma att ändras i motsvarande mån. Månadskostnaden kan också komma att påverkas utifrån den kreditriskbedömning som görs efter en kreditupplysning.
              </p>
              ${
                publicUrl
                  ? `
                  <a
                    href="${publicUrl}"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Mer information om ${this.loan.name}
                  </a>
                `
                  : ''
              }
            </div>
          </div>
        </div>

      </div>
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
}

export default Loan;
