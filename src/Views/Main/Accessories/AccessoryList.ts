import { IAccessory } from '@wayke-se/ecom/dist-types/orders/types';
import HtmlNode from '../../../Components/Extension/HtmlNode';

import OverflowGridList from '../../../Components/OverflowGrid/OverflowGridList';
import AccessoryItem from './AccessoryItem';

class AccessoryList extends HtmlNode {
  private accessories: IAccessory[];

  constructor(element: HTMLElement | null, accessories: IAccessory[]) {
    super(element);
    this.accessories = accessories;

    this.render();
  }

  render() {
    const listRef = new OverflowGridList(this.node, 'accessories-list');
    const { overflowElement } = listRef;
    if (overflowElement) {
      overflowElement.innerHTML = '';
      this.accessories.forEach(
        (accessory, index) =>
          new AccessoryItem(overflowElement, accessory, `accessory-${accessory.id}-${index}`)
      );
    }
  }
}

export default AccessoryList;
