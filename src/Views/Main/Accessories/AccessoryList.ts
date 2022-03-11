import { IAccessory } from '@wayke-se/ecom/dist-types/orders/types';
import HtmlNode from '../../../Components/Extension/HtmlNode';

import OverflowGridList from '../../../Components/OverflowGrid/OverflowGridList';
import { WaykeStore } from '../../../Redux/store';
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
    const listRef = new OverflowGridList(this.node, 'accessories-list');
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
