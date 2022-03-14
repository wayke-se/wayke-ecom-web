import StackNode from '../../Components/Extension/StackNode';
import { goTo } from '../../Redux/action';
import { WaykeStore } from '../../Redux/store';
import KeyValueListItem from '../../Templates/KeyValueListItem';

const EDIT_CENTRAL_STORAGE = 'edit-central-storage';

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

  private onEdit(index: number) {
    goTo('main', index)(this.props.store.dispatch);
  }

  render() {
    const { store, createdOrderId } = this.props;
    const { stages, dealer, order } = store.getState();

    const dealerName = order?.getDealerSites().find((x) => x.id === dealer)?.name;

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
        ${
          !createdOrderId
            ? `
        <div class="waykeecom-stack waykeecom-stack--1">
          <div class="waykeecom-align waykeecom-align--end">
            <button id="${EDIT_CENTRAL_STORAGE}" title="Ändra centrallager" class="waykeecom-link">Ändra</button>
          </div>
        </div>
        `
            : ''
        }
      </div>
    `;

    if (!createdOrderId) {
      const editDeliveryIndex = stages?.findIndex((x) => x.name === 'centralStorage');
      if (editDeliveryIndex !== undefined) {
        document
          .querySelector<HTMLButtonElement>(`#${EDIT_CENTRAL_STORAGE}`)
          ?.addEventListener('click', () => this.onEdit(editDeliveryIndex + 1));
      }
    }
  }
}

export default Delivery;
