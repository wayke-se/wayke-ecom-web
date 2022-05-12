import { IAvailableInsuranceOption } from '@wayke-se/ecom';
import HtmlNode from '../../../../Components/Extension/HtmlNode';

import GridItem from '../../../../Components/OverflowGrid/OverflowGridItem';
import { addOrRemoveFreeInsurance } from '../../../../Redux/action';
import { WaykeStore } from '../../../../Redux/store';
import watch from '../../../../Redux/watch';
import { createPortal, destroyPortal } from '../../../../Utils/portal';
import ecomEvent, { Step, EcomEvent, EcomView } from '../../../../Utils/ecomEvent';
import InsuranceItemInfo from './InsuranceItemInfo';

interface InsuranceItemProps {
  readonly store: WaykeStore;
  readonly freeInsurance: IAvailableInsuranceOption;
  readonly key: string;
}

class InsuranceItem extends HtmlNode {
  private readonly props: InsuranceItemProps;
  private displayInfo = false;

  constructor(element: HTMLElement, props: InsuranceItemProps) {
    super(element);
    this.props = props;

    watch(this.props.store, 'freeInsurance', () => {
      this.render();
    });

    this.render();
  }

  private onInfoOpen() {
    ecomEvent(EcomView.MAIN, EcomEvent.INSURANCE_INFORMATION_TOGGLE, Step.INSURANCE);
    this.displayInfo = true;
    this.render();
  }

  private onInfoClose() {
    ecomEvent(EcomView.MAIN, EcomEvent.INSURANCE_INFORMATION_TOGGLE, Step.INSURANCE);
    this.displayInfo = false;
    destroyPortal();
    this.render();
    this.node.parentElement?.scrollIntoView();
  }

  private onClick() {
    const { freeInsurance } = this.props.store.getState();
    if (freeInsurance && this.props.freeInsurance !== freeInsurance) {
      ecomEvent(EcomView.MAIN, EcomEvent.INSURANCE_SELECTED, Step.INSURANCE);
    } else {
      ecomEvent(EcomView.MAIN, EcomEvent.INSURANCE_UNSELECTED, Step.INSURANCE);
    }

    addOrRemoveFreeInsurance(this.props.freeInsurance)(this.props.store.dispatch);
  }

  render() {
    const { store, freeInsurance, key } = this.props;
    const state = store.getState();
    const logo = state.order?.insuranceOption?.logo;

    const selected = state.freeInsurance
      ? JSON.stringify(state.freeInsurance).localeCompare(
          JSON.stringify(this.props.freeInsurance)
        ) === 0
      : false;

    if (this.displayInfo) {
      new InsuranceItemInfo(createPortal(), {
        freeInsurance,
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
        logo,
        id: key,
        title: freeInsurance.title,
        description: freeInsurance.description,
        price: 'Gratis',
        selected,
        onClick: () => this.onClick(),
        onInfo: () => this.onInfoOpen(),
      },
      key
    );
  }
}

export default InsuranceItem;
