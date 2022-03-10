import { IAccessory } from '@wayke-se/ecom/dist-types/orders/types';
import HtmlNode from '../../../Components/Extension/HtmlNode';

import OverflowGridList from '../../../Components/OverflowGrid/OverflowGridList';
import { WaykeStore } from '../../../Redux/store';
import AccessoryItem from './AccessoryItem';

interface AccessoryListProps {
  store: WaykeStore;
  accessories: IAccessory[];
}

class AccessoryList extends HtmlNode {
  private props: AccessoryListProps;

  constructor(element: HTMLElement | null, props: AccessoryListProps) {
    super(element);
    this.props = props;

    this.render();
  }

  render() {
    const listRef = new OverflowGridList(this.node, 'accessories-list');
    const { overflowElement } = listRef;
    if (overflowElement) {
      overflowElement.innerHTML = '';
      this.props.accessories.forEach(
        (accessory, index) =>
          new AccessoryItem(overflowElement, {
            store: this.props.store,
            accessory,
            key: `accessory-${accessory.id}-${index}`,
          })
      );
    }
  }
}

export default AccessoryList;
