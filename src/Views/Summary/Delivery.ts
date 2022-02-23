import { goTo } from '../../Redux/action';
import store from '../../Redux/store';
import KeyValueListItem from '../../Templates/KeyValueListItem';
import StackItem from '../Main/TradeIn/StackItem';

const EDIT_DELIVERY = 'edit-delivery';

class Delivery {
  private element: HTMLDivElement;

  constructor(element: HTMLDivElement) {
    this.element = element;
    this.render();
  }

  render() {
    const state = store.getState();

    const content = StackItem(this.element);

    content.innerHTML = `
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
        <div class="waykeecom-stack waykeecom-stack--1">
          <div class="waykeecom-align waykeecom-align--end">
            <button id="${EDIT_DELIVERY}" title="Ändra leveranssätt" class="waykeecom-link">Ändra</button>
          </div>
        </div>
      </div>
    `;

    const editDeliveryIndex = state.stages?.findIndex((x) => x.name === 'delivery');
    if (editDeliveryIndex !== undefined) {
      document
        .querySelector<HTMLButtonElement>(`#${EDIT_DELIVERY}`)
        ?.addEventListener('click', () => goTo('main', editDeliveryIndex + 1));
    }
  }
}

export default Delivery;
