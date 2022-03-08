import { IAccessory } from '@wayke-se/ecom/dist-types/orders/types';
import HtmlNode from '../../../Components/Extension/HtmlNode';

import GridItem from '../../../Components/OverflowGrid/OverflowGridItem';
import { addOrRemoveAccessory } from '../../../Redux/action';
import store from '../../../Redux/store';
import watch from '../../../Redux/watch';
import { prettyNumber } from '../../../Utils/format';

class AccessoryItem extends HtmlNode {
  private accessory: IAccessory;
  private key: string;

  constructor(element: HTMLElement, accessory: IAccessory, key: string) {
    super(element);
    this.accessory = accessory;
    this.key = key;

    watch('accessories', () => {
      this.render();
    });

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
      this.node,
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
