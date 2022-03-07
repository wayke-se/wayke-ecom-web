import { IPaymentOption } from '@wayke-se/ecom';
import { PaymentLookupResponse } from '@wayke-se/ecom/dist-types/payments/payment-lookup-response';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import KeyValueListItem from '../../../Templates/KeyValueListItem';
import { Image } from '../../../Utils/constants';
import { prettyNumber } from '../../../Utils/format';

interface LoanDetailsProps {
  paymentLookupResponse: PaymentLookupResponse;
  loan: IPaymentOption;
}

class LoanDetails extends HtmlNode {
  private props: LoanDetailsProps;

  constructor(element: HTMLElement | null | undefined, props: LoanDetailsProps) {
    super(element);
    this.props = props;

    this.render();
  }

  render() {
    const { monthlyCost, totalCreditCost } = this.props.paymentLookupResponse.getCosts();
    const { interest, effectiveInterest } = this.props.paymentLookupResponse.getInterests();

    const downPayment = this.props.paymentLookupResponse.getDownPaymentSpec().current;
    const duration = this.props.paymentLookupResponse.getDurationSpec().current;
    const { administrationFee, setupFee } = this.props.paymentLookupResponse.getFees();
    const creditAmount = this.props.paymentLookupResponse.getCreditAmount();

    const publicUrl = this.props.loan.loanDetails?.getPublicURL();

    const total = downPayment + creditAmount;
    const downPaymentPercentage = Math.round((downPayment / total) * 100);
    const creditAmountPercentage = Math.round((creditAmount / total) * 100);

    const disclaimerText = `Beräknat på ${interest * 100} % ränta (effektivt ${
      effectiveInterest * 100
    } %). Den ränta du får sätts vid avtalskrivning.`;

    this.node.innerHTML = `
    <div class="waykeecom-stepper__break">
            <div class="waykeecom-shadow-box">
              <div class="waykeecom-stack waykeecom-stack--3">
                <div class="waykeecom-stack waykeecom-stack--1">
                  <h6 class="waykeecom-heading waykeecom-heading--5">${this.props.loan.name}</h6>
                </div>
                <div class="waykeecom-stack waykeecom-stack--1">
                  <img src="${this.props.loan.logo}" alt="${
      this.props.loan.name
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
                  <div class="waykeecom-disclaimer-text">${disclaimerText}</div>
                </div>
              </div>
              <div class="waykeecom-stack waykeecom-stack--3">
                  <div class="waykeecom-pie-chart">
                    <svg height="20" width="20" viewBox="0 0 20 20" class="waykeecom-pie-chart__chart">
                      <circle r="10" cx="10" cy="10" class="waykeecom-pie-chart__chart-data-base" />
                      <circle r="5" cx="10" cy="10" fill="transparent"
                        stroke-width="10"
                        stroke-dasharray="calc(${creditAmountPercentage} * 31.4 / 100) 31.4"
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
                            Kontantinsats (${downPaymentPercentage} %)
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
                            Lån (${creditAmountPercentage} %)
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
                            value: prettyNumber(totalCreditCost, { postfix: 'kr' }),
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
                                title="Visa mer information om ${this.props.loan.name}"
                                rel="noopener noreferrer"
                                target="_blank"
                                class="waykeecom-link"
                              >
                                Mer information om ${this.props.loan.name}
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
    `;
  }
}

export default LoanDetails;
