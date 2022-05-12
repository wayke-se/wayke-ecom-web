import { IAccessory } from '@wayke-se/ecom/dist-types/orders/types';
import HtmlNode from '../../../Components/Extension/HtmlNode';

import GridItem from '../../../Components/OverflowGrid/OverflowGridItem';
import { addOrRemoveAccessory } from '../../../Redux/action';
import { WaykeStore } from '../../../Redux/store';
import watch from '../../../Redux/watch';
import { prettyNumber } from '../../../Utils/format';
import { createPortal, destroyPortal } from '../../../Utils/portal';
import ecomEvent, { Step, EcomEvent, EcomView } from '../../../Utils/ecomEvent';
import AccessoryItemInfo from './AccessoryItemInfo';

interface AccessoryItemProps {
  readonly store: WaykeStore;
  readonly accessory: IAccessory;
  readonly key: string;
}

class AccessoryItem extends HtmlNode {
  private readonly props: AccessoryItemProps;
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

  private onInfoOpen() {
    this.displayInfo = true;
    this.render();
  }

  private onInfoClose() {
    this.displayInfo = false;
    destroyPortal();
    this.render();
    this.node.parentElement?.scrollIntoView();
  }

  private onClick() {
    const { store, accessory } = this.props;
    const state = store.getState();
    const selected =
      state.accessories.findIndex((_accessory) => _accessory.id === accessory.id) > -1;
    ecomEvent(
      EcomView.MAIN,
      !selected ? EcomEvent.ACCESSORY_SELECTED : EcomEvent.ACCESSORY_UNSELECTED,
      Step.ACCESSORY
    );

    addOrRemoveAccessory(this.props.accessory)(this.props.store.dispatch);
  }

  render() {
    const { store, accessory, key } = this.props;
    const state = store.getState();
    const selected =
      state.accessories.findIndex((_accessory) => _accessory.id === accessory.id) > -1;

    if (this.displayInfo) {
      new AccessoryItemInfo(createPortal(), {
        accessory,
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
        id: accessory.id,
        title: accessory.name,
        description: accessory.shortDescription,
        logo: accessory.logoUrl,
        image: accessory.media?.[0]?.url,
        price: prettyNumber(accessory.price, { postfix: 'kr' }),
        selected,
        onClick: () => this.onClick(),
        onInfo: () => this.onInfoOpen(),
      },
      key
    );
  }
}

export default AccessoryItem;
