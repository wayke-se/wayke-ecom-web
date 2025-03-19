import i18next from '@i18n';
import StackNode from '../../Components/Extension/StackNode';
import { WaykeStore } from '../../Redux/store';
import KeyValueListItem from '../../Templates/KeyValueListItem';

interface DeliveryProps {
  readonly store: WaykeStore;
  readonly createdOrderId?: string;
}

class Centrallager extends StackNode {
  private readonly props: DeliveryProps;

  constructor(element: HTMLElement, props: DeliveryProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    const { store } = this.props;
    const state = store.getState();

    this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--2">
        <h4 class="waykeecom-heading waykeecom-heading--4 waykeecom-no-margin">${i18next.t('summary.deliveryTitle')}</h4>
      </div>
      <div class="waykeecom-stack waykeecom-stack--2">
        <div class="waykeecom-stack waykeecom-stack--1">
          <ul class="waykeecom-key-value-list">
            ${KeyValueListItem({
              key: i18next.t('summary.deliveryMethod'),
              value: state.homeDelivery
                ? i18next.t('summary.homeDelivery')
                : i18next.t('summary.pickup'),
            })}
          </ul>
        </div>
      </div>
    `;
  }
}

export default Centrallager;
