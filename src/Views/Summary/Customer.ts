import i18next from '@i18n';
import { MarketCode } from '../../@types/MarketCode';
import StackNode from '../../Components/Extension/StackNode';
import { WaykeStore } from '../../Redux/store';
import KeyValueListItem from '../../Templates/KeyValueListItem';
import { maskSSn, maskText } from '../../Utils/mask';

interface CustomerProps {
  readonly store: WaykeStore;
  readonly marketCode: MarketCode;
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

    const customerName =
      this.props.marketCode === 'SE'
        ? `${maskText(state.address?.givenName || '')} ${maskText(state.address?.surname || '')}`
        : `${state.address?.givenName} ${state.address?.surname || ''}`;

    this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--2">
        <h4 class="waykeecom-heading waykeecom-heading--4 waykeecom-no-margin">${i18next.t('summary.customerTitle')}</h4>
      </div>
      <div class="waykeecom-stack waykeecom-stack--2">
        <div class="waykeecom-stack waykeecom-stack--1">
          <ul class="waykeecom-key-value-list">
            ${KeyValueListItem({
              key: i18next.t('summary.customerName'),
              value: customerName,
            })}
            ${
              this.props.marketCode === 'SE'
                ? KeyValueListItem({
                    key: i18next.t('summary.customerSSN'),
                    value: maskSSn(state.customer.socialId),
                  })
                : ''
            }
            ${KeyValueListItem({
              key: i18next.t('summary.customerAddress'),
              value: `
                ${customerName}<br />${state.address?.street}<br />${state.address?.postalCode} ${
                  state.address?.city
                }
              `,
            })}
            ${KeyValueListItem({
              key: i18next.t('summary.customerEmail'),
              value: state.customer.email,
            })}
            ${KeyValueListItem({
              key: i18next.t('summary.customerPhone'),
              value: state.customer.phone,
            })}
          </ul>
        </div>
      </div>
    `;
  }
}

export default Customer;
