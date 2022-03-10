import StackNode from '../../Components/Extension/StackNode';
import { goTo } from '../../Redux/action';
import { WaykeStore } from '../../Redux/store';
import KeyValueListItem from '../../Templates/KeyValueListItem';

const EDIT_DELIVERY = 'edit-delivery';

interface DeliveryProps {
  store: WaykeStore;
  createdOrderId?: string;
}

class Delivery extends StackNode {
  private props: DeliveryProps;

  constructor(element: HTMLElement, props: DeliveryProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    const state = this.props.store.getState();

    this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--2">
        <h4 class="waykeecom-heading waykeecom-heading--4 waykeecom-no-margin">Leverans</h4>
      </div>
      <div class="waykeecom-stack waykeecom-stack--2">
        <div class="waykeecom-stack waykeecom-stack--1">
          <ul class="waykeecom-key-value-list">
            ${KeyValueListItem({
              key: 'Leveranssätt',
              value: state.homeDelivery ? 'Hemleverans' : 'Hämta hos handlaren',
            })}
          </ul>
        </div>
        ${
          !this.props.createdOrderId
            ? `
        <div class="waykeecom-stack waykeecom-stack--1">
          <div class="waykeecom-align waykeecom-align--end">
            <button id="${EDIT_DELIVERY}" title="Ändra leveranssätt" class="waykeecom-link">Ändra</button>
          </div>
        </div>
        `
            : ''
        }
      </div>
    `;

    if (!this.props.createdOrderId) {
      const editDeliveryIndex = state.stages?.findIndex((x) => x.name === 'delivery');
      if (editDeliveryIndex !== undefined) {
        document
          .querySelector<HTMLButtonElement>(`#${EDIT_DELIVERY}`)
          ?.addEventListener('click', () =>
            goTo('main', editDeliveryIndex + 1)(this.props.store.dispatch)
          );
      }
    }
  }
}

export default Delivery;
