import StackNode from '../../Components/Extension/StackNode';
import { goTo } from '../../Redux/action';
import { WaykeStore } from '../../Redux/store';
import KeyValueListItem from '../../Templates/KeyValueListItem';
import { maskSSn, maskText } from '../../Utils/mask';

const EDIT_CUSTOMER = 'edit-customer';

interface CustomerProps {
  store: WaykeStore;
  createdOrderId?: string;
}

class Customer extends StackNode {
  private props: CustomerProps;
  constructor(element: HTMLElement, props: CustomerProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    const state = this.props.store.getState();

    this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--2">
        <h4 class="waykeecom-heading waykeecom-heading--4 waykeecom-no-margin">Kunduppgifter</h4>
      </div>
      <div class="waykeecom-stack waykeecom-stack--2">
        <div class="waykeecom-stack waykeecom-stack--1">
          <ul class="waykeecom-key-value-list">
            ${KeyValueListItem({
              key: 'För- och efternamn',
              value: `${maskText(state.address?.givenName || '')} ${maskText(
                state.address?.surname || ''
              )}`,
            })}
            ${KeyValueListItem({
              key: 'Personnummer',
              value: maskSSn(state.customer.socialId),
            })}
            ${KeyValueListItem({
              key: 'Adress',
              value: `
                ${maskText(state.address?.givenName || '')} ${maskText(
                state.address?.surname || ''
              )}<br />${state.address?.street}<br />${state.address?.postalCode} ${
                state.address?.city
              }
              `,
            })}
            ${KeyValueListItem({
              key: 'E-post',
              value: state.customer.email,
            })}
            ${KeyValueListItem({
              key: 'Telefonnummer',
              value: state.customer.phone,
            })}
          </ul>
        </div>
        ${
          !this.props.createdOrderId
            ? `
              <div class="waykeecom-stack waykeecom-stack--1">
                <div class="waykeecom-align waykeecom-align--end">
                  <button id="${EDIT_CUSTOMER}" title="Ändra kunduppgifter" class="waykeecom-link">Ändra</button>
                </div>
              </div>
            `
            : ''
        }
      </div>
    `;

    if (!this.props.createdOrderId) {
      const editCustomerIndex = state.stages?.findIndex((x) => x.name === 'customer');
      if (editCustomerIndex !== undefined) {
        document
          .querySelector<HTMLButtonElement>(`#${EDIT_CUSTOMER}`)
          ?.addEventListener('click', () =>
            goTo('main', editCustomerIndex + 1)(this.props.store.dispatch)
          );
      }
    }
  }
}

export default Customer;
