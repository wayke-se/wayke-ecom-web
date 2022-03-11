import { IAvailableInsuranceOption } from '@wayke-se/ecom';
import HtmlNode from '../../../../Components/Extension/HtmlNode';

import GridItem from '../../../../Components/OverflowGrid/OverflowGridItem';
import { addOrRemoveFreeInsurance } from '../../../../Redux/action';
import { WaykeStore } from '../../../../Redux/store';
import watch from '../../../../Redux/watch';

interface InsuranceItemProps {
  readonly store: WaykeStore;
  readonly freeInsurance: IAvailableInsuranceOption;
  readonly key: string;
}

class InsuranceItem extends HtmlNode {
  private readonly props: InsuranceItemProps;

  constructor(element: HTMLElement, props: InsuranceItemProps) {
    super(element);
    this.props = props;

    watch(this.props.store, 'freeInsurance', () => {
      this.render();
    });

    this.render();
  }

  private onClick() {
    addOrRemoveFreeInsurance(this.props.freeInsurance)(this.props.store.dispatch);
  }

  render() {
    const { store, freeInsurance, key } = this.props;
    const state = store.getState();
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
        title: freeInsurance.title,
        description: freeInsurance.description,
        price: 'Gratis',
        selected,
        onClick: () => this.onClick(),
      },
      key
    );
  }
}

export default InsuranceItem;
