import { PaymentType } from '@wayke-se/ecom';
import StackNode from '../../Components/Extension/StackNode';
import { goTo } from '../../Redux/action';
import store from '../../Redux/store';
import ItemTileLarge from '../../Templates/ItemTileLarge';
import KeyValueListItem from '../../Templates/KeyValueListItem';
import { prettyNumber } from '../../Utils/format';

const EDIT_FINANCIAL = 'edit-financial';
const EDIT_INSURANCE = 'edit-insurance';

class Order extends StackNode {
  constructor(element: HTMLElement) {
    super(element);
    this.render();
  }

  render() {
    const state = store.getState();

    this.node.innerHTML = `
      <h3 class="waykeecom-heading waykeecom-heading--3">Din order</h3>
      ${ItemTileLarge({
        vehicle: state.vehicle,
        order: state.order,
        meta: `
          <div class="waykeecom-stack waykeecom-stack--2">
            ${
              state.paymentType === PaymentType.Loan && state.paymentLookupResponse
                ? `
                <div class="waykeecom-stack waykeecom-stack--05">
                  <div class="waykeecom-label">Billån</div>
                </div>
                <div class="waykeecom-stack waykeecom-stack--05">
                  <ul class="waykeecom-key-value-list">
                    ${KeyValueListItem({
                      key: 'Volvofinans Bank',
                      value: prettyNumber(state.paymentLookupResponse.getCosts().totalCreditCost, {
                        postfix: 'kr/mån',
                      }),
                    })}
                  </ul>
                </div>
              `
                : state.paymentType === PaymentType.Cash && state.vehicle?.price !== undefined
                ? `
                  <div class="waykeecom-stack waykeecom-stack--05">
                    <div class="waykeecom-label">Kontant</div>
                  </div>
                  <div class="waykeecom-stack waykeecom-stack--05">
                    <ul class="waykeecom-key-value-list">
                      ${KeyValueListItem({
                        key: 'Volvofinans Bank',
                        value: prettyNumber(state.vehicle.price, { postfix: 'kr' }),
                      })}
                    </ul>
                  </div>
                `
                : `
                  <div class="waykeecom-stack waykeecom-stack--05">
                    <div class="waykeecom-label">Billån</div>
                  </div>
                  <div class="waykeecom-stack waykeecom-stack--05">
                    <ul class="waykeecom-key-value-list">
                      ${KeyValueListItem({
                        key: 'Leasing',
                        value: '[PRIS] kr/mån',
                      })}
                    </ul>
                  </div>
                `
            }
            <div class="waykeecom-stack waykeecom-stack--05">
              <div class="waykeecom-align waykeecom-align--end">
                <button id="${EDIT_FINANCIAL}" title="Ändra finansiering" class="waykeecom-link">Ändra</button>
              </div>
            </div>
          </div>
          ${
            state.insurance
              ? `
              <div class="waykeecom-stack waykeecom-stack--2">
                <div class="waykeecom-stack waykeecom-stack--05">
                  <div class="waykeecom-label">Helförsäkring</div>
                </div>
                <div class="waykeecom-stack waykeecom-stack--05">
                  <ul class="waykeecom-key-value-list">
                    ${KeyValueListItem({
                      key: state.insurance.name,
                      value: prettyNumber(state.insurance.price, { postfix: 'kr/mån' }),
                    })}
                  </ul>
                </div>
                <div class="waykeecom-stack waykeecom-stack--05">
                  <div class="waykeecom-align waykeecom-align--end">
                    <button id="${EDIT_INSURANCE}" title="Ändra försäkring" class="waykeecom-link">Ändra</button>
                  </div>
                </div>
              </div>`
              : ''
          }
        `,
      })}
    `;

    const editFinancialIndex = state.stages?.findIndex((x) => x.name === 'financial');
    if (editFinancialIndex !== undefined) {
      document
        .querySelector<HTMLButtonElement>(`#${EDIT_FINANCIAL}`)
        ?.addEventListener('click', () => goTo('main', editFinancialIndex + 1));
    }

    const editInsuranceIndex = state.stages?.findIndex((x) => x.name === 'insurance');
    if (editInsuranceIndex !== undefined) {
      document
        .querySelector<HTMLButtonElement>(`#${EDIT_INSURANCE}`)
        ?.addEventListener('click', () => goTo('main', editInsuranceIndex + 1));
    }
  }
}

export default Order;
