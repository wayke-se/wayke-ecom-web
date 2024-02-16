import StackNode from '../../Components/Extension/StackNode';
import { WaykeStore } from '../../Redux/store';
import KeyValueListItem from '../../Templates/KeyValueListItem';
import { maskSSn, maskText } from '../../Utils/mask';

interface CustomerProps {
  readonly store: WaykeStore;
}

class Customer extends StackNode {
  private readonly props: CustomerProps;
  constructor(element: HTMLElement, props: CustomerProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    const { store } = this.props;
    const state = store.getState();

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
      </div>
    `;
  }
}

export default Customer;
