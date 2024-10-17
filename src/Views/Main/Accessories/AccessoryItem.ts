import { IAccessory } from '@wayke-se/ecom/dist-types/orders/types';
import HtmlNode from '../../../Components/Extension/HtmlNode';

import GridItem from '../../../Components/OverflowGrid/OverflowGridItem';
import { addOrRemoveAccessory } from '../../../Redux/action';
import { WaykeStore } from '../../../Redux/store';
import watch from '../../../Redux/watch';
import ecomEvent, { EcomStep, EcomEvent, EcomView } from '../../../Utils/ecomEvent';
import { prettyNumber } from '../../../Utils/format';
import { createPortal, destroyPortal } from '../../../Utils/portal';
import AccessoryItemInfo from './AccessoryItemInfo';

interface AccessoryItemProps {
  readonly store: WaykeStore;
  readonly accessory: IAccessory;
  readonly key: string;
}

class AccessoryItem extends HtmlNode {
  private readonly props: AccessoryItemProps;
  private displayInfo = false;
  private exposureTracked = false;

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
    const { accessory } = this.props;
    ecomEvent(EcomView.MAIN, EcomEvent.ACCESSORY_INFORMATION_OPEN, EcomStep.ACCESSORY, {
      id: accessory.id,
      label: accessory.name,
    });
    this.displayInfo = true;
    this.render();
  }

  private onInfoClose() {
    const { accessory } = this.props;
    ecomEvent(EcomView.MAIN, EcomEvent.ACCESSORY_INFORMATION_CLOSE, EcomStep.ACCESSORY, {
      id: accessory.id,
      label: accessory.name,
    });
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
      EcomStep.ACCESSORY,
      {
        id: accessory.id,
        label: accessory.name,
      }
    );

    addOrRemoveAccessory(this.props.accessory)(this.props.store.dispatch);
  }

  private trackExposure() {
    const { accessory } = this.props;
    this.exposureTracked = true;
    ecomEvent(EcomView.MAIN, EcomEvent.ACCESSORY_EXPOSURE, EcomStep.ACCESSORY, {
      id: accessory.id,
      label: accessory.name,
    });
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
        inViewPort: this.exposureTracked ? undefined : () => this.trackExposure(),
      },
      key
    );
  }
}

export default AccessoryItem;
