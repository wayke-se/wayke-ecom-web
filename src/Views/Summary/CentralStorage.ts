import StackNode from '../../Components/Extension/StackNode';
import { WaykeStore } from '../../Redux/store';
import KeyValueListItem from '../../Templates/KeyValueListItem';

interface CentralStorageProps {
  readonly store: WaykeStore;
  readonly createdOrderId?: string;
}

class Delivery extends StackNode {
  private readonly props: CentralStorageProps;

  constructor(element: HTMLElement, props: CentralStorageProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    const { store } = this.props;
    const { dealer, order } = store.getState();

    const dealerName = order?.dealerSites.find((x) => x.id === dealer)?.name;

    this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--2">
        <h4 class="waykeecom-heading waykeecom-heading--4 waykeecom-no-margin">Centrallager</h4>
      </div>
      <div class="waykeecom-stack waykeecom-stack--2">
        <div class="waykeecom-stack waykeecom-stack--1">
          <ul class="waykeecom-key-value-list">
            ${KeyValueListItem({
              key: 'Val av handlare',
              value: dealerName || '',
            })}
          </ul>
        </div>
      </div>
    `;
  }
}

export default Delivery;
