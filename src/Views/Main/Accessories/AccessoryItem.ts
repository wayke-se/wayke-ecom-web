import { IAccessory } from '@wayke-se/ecom/dist-types/orders/types';
import GridItem from '../../../Components/OverflowGrid/OverflowGridItem';
import { prettyNumber } from '../../../Utils/format';

class AccessoryItem {
  private element: HTMLUListElement;
  private accessory: IAccessory;

  constructor(element: HTMLUListElement, accessory: IAccessory) {
    this.element = element;
    this.accessory = accessory;
    this.render();
  }

  onClick() {}

  render() {
    new GridItem(this.element, {
      title: this.accessory.name,
      description: this.accessory.shortDescription,
      logo: this.accessory.logoUrl,
      image: this.accessory.media?.[0]?.url,
      price: prettyNumber(this.accessory.price, { postfix: 'kr' }),
      onClick: () => this.onClick(),
    });
  }
}

export default AccessoryItem;
