import { IAvailableInsuranceOption } from '@wayke-se/ecom';
import HtmlNode from '../../../../Components/Extension/HtmlNode';

import GridItem from '../../../../Components/OverflowGrid/OverflowGridItem';
import { addOrRemoveFreeInsurance } from '../../../../Redux/action';
import { WaykeStore } from '../../../../Redux/store';
import watch from '../../../../Redux/watch';

interface InsuranceItemProps {
  store: WaykeStore;
  freeInsurance: IAvailableInsuranceOption;
  key: string;
}

class InsuranceItem extends HtmlNode {
  private props: InsuranceItemProps;

  constructor(element: HTMLElement, props: InsuranceItemProps) {
    super(element);
    this.props = props;

    watch(this.props.store, 'freeInsurance', () => {
      this.render();
    });

    this.render();
  }

  onClick() {
    addOrRemoveFreeInsurance(this.props.freeInsurance)(this.props.store.dispatch);
  }

  render() {
    const state = this.props.store.getState();
    const logo = state.order?.getInsuranceOption()?.logo;

    const selected = state.freeInsurance
      ? JSON.stringify(state.freeInsurance).localeCompare(
          JSON.stringify(this.props.freeInsurance)
        ) === 0
      : false;

    new GridItem(
      this.node,
      {
        logo,
        title: this.props.freeInsurance.title,
        description: this.props.freeInsurance.description,
        price: 'Gratis',
        selected,
        onClick: () => this.onClick(),
      },
      this.props.key
    );
  }
}

export default InsuranceItem;
