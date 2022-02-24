import { IAccessory } from '@wayke-se/ecom/dist-types/orders/types';
import OverflowGridList from '../../../Components/OverflowGrid/OverflowGridList';
import AccessoryItem from './AccessoryItem';

class AccessoryList {
  private element: HTMLDivElement;
  private accessories: IAccessory[];

  constructor(element: HTMLDivElement | null, accessories: IAccessory[]) {
    if (!element) throw 'Missing element';
    this.element = element;
    this.accessories = accessories;

    this.render();
  }

  render() {
    const listRef = new OverflowGridList(this.element, 'accessories-list');
    const { overflowElement } = listRef;
    if (overflowElement) {
      this.accessories.forEach((accessory) => new AccessoryItem(overflowElement, accessory));
    }
  }
}

export default AccessoryList;
