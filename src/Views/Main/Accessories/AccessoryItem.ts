import { IAccessory } from '@wayke-se/ecom/dist-types/orders/types';
import HtmlNode from '../../../Components/Extension/HtmlNode';

import GridItem from '../../../Components/OverflowGrid/OverflowGridItem';
import { addOrRemoveAccessory } from '../../../Redux/action';
import store from '../../../Redux/store';
import watch from '../../../Redux/watch';
import { prettyNumber } from '../../../Utils/format';
import { createPortal, destroyPortal } from '../../../Utils/portal';
import AccessoryItemInfo from './AccessoryItemInfo';

class AccessoryItem extends HtmlNode {
  private accessory: IAccessory;
  private key: string;
  private displayInfo = false;

  constructor(element: HTMLElement, accessory: IAccessory, key: string) {
    super(element);
    this.accessory = accessory;
    this.key = key;

    watch('accessories', () => {
      this.render();
    });

    this.render();
  }

  onInfoOpen() {
    this.displayInfo = true;
    this.render();
  }

  onInfoClose() {
    this.displayInfo = false;
    destroyPortal();
    this.render();
    this.node.parentElement?.scrollIntoView();
  }

  onClick() {
    addOrRemoveAccessory(this.accessory);
  }

  render() {
    const state = store.getState();
    const selected =
      state.accessories.findIndex((accessory) => accessory.id === this.accessory.id) > -1;

    if (this.displayInfo) {
      new AccessoryItemInfo(createPortal(), {
        accessory: this.accessory,
        onClose: () => this.onInfoClose(),
      });
    }

    new GridItem(
      this.node,
      {
        id: this.accessory.id,
        title: this.accessory.name,
        description: this.accessory.shortDescription,
        logo: this.accessory.logoUrl,
        image: this.accessory.media?.[0]?.url,
        price: prettyNumber(this.accessory.price, { postfix: 'kr' }),
        selected,
        onClick: () => this.onClick(),
        onInfo: () => this.onInfoOpen(),
      },
      this.key
    );
  }
}

export default AccessoryItem;
