import { PaymentType } from '@wayke-se/ecom';
import StackNode from '../../Components/Extension/StackNode';
import { WaykeStore } from '../../Redux/store';
import ItemTileLarge from '../../Templates/ItemTileLarge';
import KeyValueListItem from '../../Templates/KeyValueListItem';
import { prettyNumber } from '../../Utils/format';
import { extractPaymentType } from '../Main/Financial/utils';

interface OrderProps {
  readonly store: WaykeStore;
  readonly cdnMedia?: string;
}

class Order extends StackNode {
  private readonly props: OrderProps;

  constructor(element: HTMLElement, props: OrderProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    const { store, cdnMedia } = this.props;
    const state = store.getState();

    const paymentLoan = state.order?.paymentOptions.find((x) => x.type === PaymentType.Loan);
    const paymentLookupResponse = state.paymentLookupResponse || paymentLoan?.loanDetails;
    const paymentLease = state.order?.paymentOptions.find((x) => x.type === PaymentType.Lease);
    const paymentType = extractPaymentType(state.paymentType)!;

    this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--2">
        <h4 class="waykeecom-heading waykeecom-heading--4 waykeecom-no-margin">Din order</h4>
      </div>
      <div class="waykeecom-stack waykeecom-stack--2">
        ${ItemTileLarge({
          vehicle: state.vehicle,
          order: state.order,
          cdnMedia,
          meta: `
            <div class="waykeecom-stack waykeecom-stack--2">
              ${
                paymentType === PaymentType.Loan && paymentLoan
                  ? `
                  <div class="waykeecom-stack waykeecom-stack--05">
                    <div class="waykeecom-label">Betalsätt</div>
                  </div>
                  <div class="waykeecom-stack waykeecom-stack--05">
                    <ul class="waykeecom-key-value-list">
                    ${
                      paymentLookupResponse
                        ? KeyValueListItem({
                            key: paymentLoan.name || '???',
                            value: prettyNumber(paymentLookupResponse.costs.monthlyCost, {
                              postfix: 'kr/mån',
                            }),
                          })
                        : ``
                    }
                    </ul>
                  </div>
                `
                  : paymentType === PaymentType.Cash
                    ? `
                    <div class="waykeecom-stack waykeecom-stack--05">
                      <div class="waykeecom-label">Betalsätt</div>
                    </div>
                    <div class="waykeecom-stack waykeecom-stack--05">
                      <ul class="waykeecom-key-value-list">
                        ${KeyValueListItem({
                          key: 'Kontant',
                          value: prettyNumber(state.vehicle?.price, { postfix: 'kr' }),
                        })}
                      </ul>
                    </div>
                  `
                    : paymentType === PaymentType.Lease
                      ? `
                    <div class="waykeecom-stack waykeecom-stack--05">
                      <div class="waykeecom-label">Betalsätt</div>
                    </div>
                    <div class="waykeecom-stack waykeecom-stack--05">
                      <ul class="waykeecom-key-value-list">
                        ${KeyValueListItem({
                          key: 'Privatleasing',
                          value: `Från ${prettyNumber(paymentLease?.price, {
                            postfix: paymentLease?.unit,
                          })}`,
                        })}
                      </ul>
                    </div>
                  `
                      : ''
              }
            </div>
            ${
              !!state.accessories.length
                ? `
                  <div class="waykeecom-stack waykeecom-stack--2">
                    <div class="waykeecom-stack waykeecom-stack--05">
                      <div class="waykeecom-label">Tillbehör</div>
                    </div>
                    <div class="waykeecom-stack waykeecom-stack--05">
                      <ul class="waykeecom-key-value-list">
                        ${state.accessories
                          .map((accessory) =>
                            KeyValueListItem({
                              key: accessory.name,
                              value: prettyNumber(accessory.price, { postfix: 'kr' }),
                            })
                          )
                          .join('')}
                      </ul>
                    </div>
                  </div>`
                : ''
            }
            ${
              state.insurance || state.freeInsurance
                ? `
                <div class="waykeecom-stack waykeecom-stack--2">
                  ${
                    state.insurance
                      ? `
                      <div class="waykeecom-stack waykeecom-stack--05">
                        <div class="waykeecom-label">Försäkring</div>
                      </div>
                      <div class="waykeecom-stack waykeecom-stack--05">
                        <ul class="waykeecom-key-value-list">
                          ${KeyValueListItem({
                            key: state.insurance.name,
                            value: prettyNumber(state.insurance.price, { postfix: 'kr/mån' }),
                          })}
                          ${
                            state.insuranceAddOns?.addOns.length &&
                            state.insuranceAddOns.insurance === state.insurance.name
                              ? state.insuranceAddOns.addOns
                                  .map((addon) =>
                                    KeyValueListItem({
                                      key: addon.title,
                                      value: prettyNumber(addon.monthlyPrice, {
                                        postfix: 'kr/mån',
                                      }),
                                    })
                                  )
                                  .join('')
                              : ''
                          }
                        </ul>
                      </div>
                    `
                      : ''
                  }
                  ${
                    state.freeInsurance
                      ? `
                      <div class="waykeecom-stack waykeecom-stack--05">
                        <div class="waykeecom-label">Försäkring</div>
                      </div>
                      <div class="waykeecom-stack waykeecom-stack--05">
                        <ul class="waykeecom-key-value-list">
                          ${KeyValueListItem({
                            key: state.freeInsurance.title,
                            value: 'Gratis',
                          })}
                        </ul>
                      </div>
                    `
                      : ''
                  }
                </div>`
                : ''
            }
           
          `,
        })}
      </div>
    `;
  }
}

export default Order;
