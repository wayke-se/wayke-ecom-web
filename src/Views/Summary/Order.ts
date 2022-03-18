import { PaymentType } from '@wayke-se/ecom';
import StackNode from '../../Components/Extension/StackNode';
import { goTo } from '../../Redux/action';
import { WaykeStore } from '../../Redux/store';
import ItemTileLarge from '../../Templates/ItemTileLarge';
import KeyValueListItem from '../../Templates/KeyValueListItem';
import { prettyNumber } from '../../Utils/format';

const EDIT_FINANCIAL = 'edit-financial';
const EDIT_INSURANCE = 'edit-insurance';
const EDIT_ACCESSORIES = 'edit-accessory';

interface OrderProps {
  readonly store: WaykeStore;
  readonly createdOrderId?: string;
}

class Order extends StackNode {
  private readonly props: OrderProps;

  constructor(element: HTMLElement, props: OrderProps) {
    super(element);
    this.props = props;
    this.render();
  }

  private onEdit(index: number) {
    goTo('main', index)(this.props.store.dispatch);
  }

  render() {
    const { store, createdOrderId } = this.props;
    const state = store.getState();

    const paymentLoan = state.order?.getPaymentOptions().find((x) => x.type === PaymentType.Loan);
    const paymentLookupResponse = state.paymentLookupResponse || paymentLoan?.loanDetails;
    const paymentLease = state.order?.getPaymentOptions().find((x) => x.type === PaymentType.Lease);

    this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--2">
        <h4 class="waykeecom-heading waykeecom-heading--4 waykeecom-no-margin">Din order</h4>
      </div>
      <div class="waykeecom-stack waykeecom-stack--2">
        ${ItemTileLarge({
          vehicle: state.vehicle,
          order: state.order,
          meta: `
            <div class="waykeecom-stack waykeecom-stack--2">
              ${
                state.paymentType === PaymentType.Loan && paymentLoan
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
                            value: prettyNumber(paymentLookupResponse.getCosts().monthlyCost, {
                              postfix: 'kr/mån',
                            }),
                          })
                        : ``
                    }
                    </ul>
                  </div>
                `
                  : state.paymentType === PaymentType.Cash
                  ? `
                    <div class="waykeecom-stack waykeecom-stack--05">
                      <div class="waykeecom-label">Betalsätt</div>
                    </div>
                    <div class="waykeecom-stack waykeecom-stack--05">
                      <ul class="waykeecom-key-value-list">
                        ${KeyValueListItem({
                          key: 'Kontant',
                          value: prettyNumber(state.vehicle?.price || '???', { postfix: 'kr' }),
                        })}
                      </ul>
                    </div>
                  `
                  : state.paymentType === PaymentType.Lease
                  ? `
                    <div class="waykeecom-stack waykeecom-stack--05">
                      <div class="waykeecom-label">Betalsätt</div>
                    </div>
                    <div class="waykeecom-stack waykeecom-stack--05">
                      <ul class="waykeecom-key-value-list">
                        ${KeyValueListItem({
                          key: 'Leasing',
                          value: prettyNumber(paymentLease?.price || '???', {
                            postfix: paymentLease?.unit,
                          }),
                        })}
                      </ul>
                    </div>
                  `
                  : ''
              }
              ${
                !createdOrderId
                  ? `
                    <div class="waykeecom-stack waykeecom-stack--05">
                      <div class="waykeecom-align waykeecom-align--end">
                        <button id="${EDIT_FINANCIAL}" title="Ändra finansiering" class="waykeecom-link">Ändra</button>
                      </div>
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
                    ${
                      !createdOrderId
                        ? `
                          <div class="waykeecom-stack waykeecom-stack--05">
                            <div class="waykeecom-align waykeecom-align--end">
                              <button id="${EDIT_ACCESSORIES}" title="Ändra försäkring" class="waykeecom-link">Ändra</button>
                            </div>
                          </div>
                        `
                        : ''
                    }
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
                  ${
                    !createdOrderId
                      ? `
                        <div class="waykeecom-stack waykeecom-stack--05">
                          <div class="waykeecom-align waykeecom-align--end">
                            <button id="${EDIT_INSURANCE}" title="Ändra försäkring" class="waykeecom-link">Ändra</button>
                          </div>
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

    if (!createdOrderId) {
      const editFinancialIndex = state.stages?.findIndex((x) => x.name === 'financial');
      if (editFinancialIndex !== undefined) {
        document
          .querySelector<HTMLButtonElement>(`#${EDIT_FINANCIAL}`)
          ?.addEventListener('click', () => this.onEdit(editFinancialIndex + 1));
      }

      const editInsuranceIndex = state.stages?.findIndex((x) => x.name === 'insurance');
      if (editInsuranceIndex !== undefined) {
        document
          .querySelector<HTMLButtonElement>(`#${EDIT_INSURANCE}`)
          ?.addEventListener('click', () => this.onEdit(editInsuranceIndex + 1));
      }

      const editAccessoryIndex = state.stages?.findIndex((x) => x.name === 'accessories');
      if (editAccessoryIndex !== undefined) {
        document
          .querySelector<HTMLButtonElement>(`#${EDIT_ACCESSORIES}`)
          ?.addEventListener('click', () => this.onEdit(editAccessoryIndex + 1));
      }
    }
  }
}

export default Order;
