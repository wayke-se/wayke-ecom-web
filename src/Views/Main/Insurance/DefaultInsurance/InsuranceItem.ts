import { IAvailableInsuranceOption } from '@wayke-se/ecom';
import HtmlNode from '../../../../Components/Extension/HtmlNode';

import GridItem from '../../../../Components/OverflowGrid/OverflowGridItem';
import { addOrRemoveFreeInsurance } from '../../../../Redux/action';
import { WaykeStore } from '../../../../Redux/store';
import watch from '../../../../Redux/watch';
import { createPortal, destroyPortal } from '../../../../Utils/portal';
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
