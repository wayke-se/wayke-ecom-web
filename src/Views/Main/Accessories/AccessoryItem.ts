import { IAccessory } from '@wayke-se/ecom/dist-types/orders/types';
import watch from 'redux-watch';

import GridItem from '../../../Components/OverflowGrid/OverflowGridItem';
import { addOrRemoveAccessory } from '../../../Redux/action';
import store from '../../../Redux/store';
import { prettyNumber } from '../../../Utils/format';

class AccessoryItem {
  private element: HTMLUListElement;
  private accessory: IAccessory;
  private key: string;

  constructor(element: HTMLUListElement, accessory: IAccessory, key: string) {
    this.element = element;
    this.accessory = accessory;
    this.key = key;

    const w = watch(store.getState, 'accessories');
    store.subscribe(w(() => this.render()));

    this.render();
  }

  onClick() {
    addOrRemoveAccessory(this.accessory);
  }

  render() {
    const state = store.getState();
    const selected =
      state.accessories.findIndex((accessory) => accessory.id === this.accessory.id) > -1;

    new GridItem(
      this.element,
      {
        title: this.accessory.name,
        description: this.accessory.shortDescription,
        logo: this.accessory.logoUrl,
        image: this.accessory.media?.[0]?.url,
        price: prettyNumber(this.accessory.price, { postfix: 'kr' }),
        selected,
        onClick: () => this.onClick(),
      },
      this.key
    );
  }
}

export default AccessoryItem;
