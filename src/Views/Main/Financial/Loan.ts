import { IPaymentOption, IPaymentRangeSpec } from '@wayke-se/ecom';
import { PaymentLookupResponse } from '@wayke-se/ecom/dist-types/payments/payment-lookup-response';
import InputRange from '../../../Components/InputRange';
import { getPayment } from '../../../Data/getPayment';
import { setPaymentLookupResponse } from '../../../Redux/action';
import KeyValueListItem from '../../../Templates/KeyValueListItem';
import { Image } from '../../../Utils/constants';
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
          <div class="waykeecom-stepper__break">
            <div class="waykeecom-shadow-box">
              <div class="waykeecom-stack waykeecom-stack--3">
                <div class="waykeecom-stack waykeecom-stack--1">
                  <h6 class="waykeecom-heading waykeecom-heading--5">${this.loan.name}</h6>
                </div>
                <div class="waykeecom-stack waykeecom-stack--1">
                  <img src="${this.loan.logo}" alt="${
      this.loan.name
    } logotyp" class="waykeecom-image waykeecom-image--loan-logo" />
                </div>
              </div>
              <div class="waykeecom-stack waykeecom-stack--3">
                <div class="waykeecom-stack waykeecom-stack--1">
                  <ul class="waykeecom-key-value-list waykeecom-key-value-list--large-value">
                    ${KeyValueListItem({
                      key: 'Månadskostnad för lånet',
                      value: prettyNumber(monthlyCost, {
                        postfix: 'kr/mån*',
                      }),
                    })}
                  </ul>
                </div>
                <div class="waykeecom-stack waykeecom-stack--1">
                  <div class="waykeecom-disclaimer-text">*Beräknat på ${
                    interest * 100
                  } % ränta (effektivt ${
      effectiveInterest * 100
    } %). Den ränta du får sätts vid avtalskrivning.</div>
                </div>
              </div>
              <div class="waykeecom-stack waykeecom-stack--3">
                  <div class="waykeecom-pie-chart">
                    <svg height="20" width="20" viewBox="0 0 20 20" class="waykeecom-pie-chart__chart">
                      <circle r="10" cx="10" cy="10" class="waykeecom-pie-chart__chart-data-base" />
                      <circle r="5" cx="10" cy="10" fill="transparent"
                        stroke-width="10"
                        stroke-dasharray="calc(80 * 31.4 / 100) 31.4"
                        transform="rotate(-90) translate(-20)"
                        class="waykeecom-pie-chart__chart-data waykeecom-pie-chart__chart-data--1"
                      />
                    </svg>
                    <div class="waykeecom-pie-chart__overlay">
                      <img src="${
                        Image.illustrations.payment
                      }" alt="Illustration av betalning" class="waykeecom-pie-chart__illustration" />
                    </div>
                  </div>
                </div>
              <div class="waykeecom-stack waykeecom-stack--3">
                <div class="waykeecom-stack waykeecom-stack--2">
                  <ul class="waykeecom-key-value-list">
                    ${KeyValueListItem({
                      key: `
                        <div class="waykeecom-hstack waykeecom-hstack--spacing-1 waykeecom-hstack--align-center">
                          <div class="waykeecom-hstack__item waykeecom-hstack__item--no-shrink" aria-hidden="true">
                            <div class="waykeecom-chart-indicator waykeecom-chart-indicator--secondary"></div>
                          </div>
                          <div class="waykeecom-hstack__item">
                            Kontantinsats (X %)
                          </div>
                        </div>
                      `,
                      value: prettyNumber(downPayment, { postfix: 'kr' }),
                    })}
                    ${KeyValueListItem({
                      key: `
                        <div class="waykeecom-hstack waykeecom-hstack--spacing-1 waykeecom-hstack--align-center">
                          <div class="waykeecom-hstack__item waykeecom-hstack__item--no-shrink" aria-hidden="true">
                            <div class="waykeecom-chart-indicator waykeecom-chart-indicator--primary"></div>
                          </div>
                          <div class="waykeecom-hstack__item">
                            Lån (X %)
                          </div>
                        </div>
                      `,
                      value: prettyNumber(creditAmount, { postfix: 'kr' }),
                    })}
                  </ul>
                </div>
                <div class="waykeecom-stack waykeecom-stack--2">
                  <hr class="waykeecom-separator" />
                </div>
                <div class="waykeecom-stack waykeecom-stack--2">
                  <div class="waykeecom-accordion">
                    <input type="checkbox" id="finance-details-accordion" class="waykeecom-accordion__checkbox" tabindex="-1" />
                    <label class="waykeecom-accordion__header" for="finance-details-accordion" tabindex="0" aria-label="Visa detaljer">
                      <div class="waykeecom-accordion__header-title">Detaljer</div>
                      <div class="waykeecom-accordion__header-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          class="waykeecom-icon"
                        >
                          <title>Ikon: vinkel ned</title>
                          <path d="M6.7 11.4 0 4.6l1.3-1.4L8 10.1l6.7-6.9L16 4.6l-6.7 6.9L8 12.8l-1.3-1.4z" />
                        </svg>
                      </div>
                    </label>
                    <div class="waykeecom-accordion__body">
                      <div class="waykeecom-stack waykeecom-stack--2">
                        <ul class="waykeecom-key-value-list">
                          ${KeyValueListItem({
                            key: 'Avbetalningsperoid',
                            value: `${duration} mån`,
                          })}

                          ${KeyValueListItem({ key: 'Ränta', value: `${interest * 100}%**` })}

                          ${KeyValueListItem({
                            key: 'Effektiv ränta',
                            value: `${effectiveInterest * 100}%**`,
                          })}

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
                      <div class="waykeecom-stack waykeecom-stack--2">
                        <div class="waykeecom-disclaimer-text">
                          <p>**Det här är inte den slutgiltiga offerten. Räntan kan komma att ändras ifall det sker justeringar i initial amorteringsplan, tillägg i utrustning eller andra ändringar som påverkar det initiala prisförslaget.</p>
                          <p>Om marknadsräntan förändras kan månadskostnaden komma att ändras i motsvarande mån. Månadskostnaden kan också komma att påverkas utifrån den kreditriskbedömning som görs efter en kreditupplysning.</p>
                        </div>
                      </div>
                      ${
                        publicUrl
                          ? `
                            <div class="waykeecom-stack waykeecom-stack--2">
                              <a
                                href="${publicUrl}"
                                title="Visa mer information om ${this.loan.name}"
                                rel="noopener noreferrer"
                                target="_blank"
                                class="waykeecom-link"
                              >
                                Mer information om ${this.loan.name}
                              </a>
                            </div>
                          `
                          : ''
                      }
                    </div>
                  </div>
                </div>
              </div>
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
