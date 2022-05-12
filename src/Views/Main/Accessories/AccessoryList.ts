import { IAccessory } from '@wayke-se/ecom/dist-types/orders/types';
import HtmlNode from '../../../Components/Extension/HtmlNode';

import OverflowGridList from '../../../Components/OverflowGrid/OverflowGridList';
import { WaykeStore } from '../../../Redux/store';
import ecomEvent, { EcomEvent, EcomView, EcomStep } from '../../../Utils/ecomEvent';
import AccessoryItem from './AccessoryItem';

interface AccessoryListProps {
  readonly store: WaykeStore;
  readonly accessories: IAccessory[];
}

class AccessoryList extends HtmlNode {
  private readonly props: AccessoryListProps;

  constructor(element: HTMLElement | null, props: AccessoryListProps) {
    super(element);
    this.props = props;

    this.render();
  }

  render() {
    const { accessories, store } = this.props;
    const listRef = new OverflowGridList(this.node, {
      id: 'accessories-list',
      onClick: () => ecomEvent(EcomView.MAIN, EcomEvent.ACCESSORY_ARROWS, EcomStep.ACCESSORY),
    });
    const { overflowElement } = listRef;
    if (overflowElement) {
      overflowElement.innerHTML = '';
      accessories.forEach(
        (accessory, index) =>
          new AccessoryItem(overflowElement, {
            store,
            accessory,
            key: `accessory-${accessory.id}-${index}`,
          })
      );
    }
  }
}

export default AccessoryList;
