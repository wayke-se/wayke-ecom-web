import { IAccessory } from '@wayke-se/ecom/dist-types/orders/types';
import HtmlNode from '../../../Components/Extension/HtmlNode';

import GridItem from '../../../Components/OverflowGrid/OverflowGridItem';
import { addOrRemoveAccessory } from '../../../Redux/action';
import { WaykeStore } from '../../../Redux/store';
import watch from '../../../Redux/watch';
import { prettyNumber } from '../../../Utils/format';
import { createPortal, destroyPortal } from '../../../Utils/portal';
import AccessoryItemInfo from './AccessoryItemInfo';

interface AccessoryItemProps {
  store: WaykeStore;
  accessory: IAccessory;
  key: string;
}

class AccessoryItem extends HtmlNode {
  private props: AccessoryItemProps;
  private displayInfo = false;

  constructor(element: HTMLElement, props: AccessoryItemProps) {
    super(element);
    this.props = props;

    watch<IAccessory[]>(this.props.store, 'accessories', (newValue, oldValue) => {
      if (
        newValue.some((x) => x.id === this.props.accessory.id) !==
        oldValue.some((x) => x.id === this.props.accessory.id)
      ) {
        this.render();
      }
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
    addOrRemoveAccessory(this.props.accessory)(this.props.store.dispatch);
  }

  render() {
    const state = this.props.store.getState();
    const selected =
      state.accessories.findIndex((accessory) => accessory.id === this.props.accessory.id) > -1;

    if (this.displayInfo) {
      new AccessoryItemInfo(createPortal(), {
        accessory: this.props.accessory,
        selected,
        onClick: () => {
          this.onInfoClose();
          this.onClick();
        },
        onClose: () => this.onInfoClose(),
      });
    }

    new GridItem(
      this.node,
      {
        id: this.props.accessory.id,
        title: this.props.accessory.name,
        description: this.props.accessory.shortDescription,
        logo: this.props.accessory.logoUrl,
        image: this.props.accessory.media?.[0]?.url,
        price: prettyNumber(this.props.accessory.price, { postfix: 'kr' }),
        selected,
        onClick: () => this.onClick(),
        onInfo: () => this.onInfoOpen(),
      },
      this.props.key
    );
  }
}

export default AccessoryItem;
