import { IInsuranceOption } from '@wayke-se/ecom';
import HtmlNode from '../../../../Components/Extension/HtmlNode';

import GridItem from '../../../../Components/OverflowGrid/OverflowGridItem';
import { addOrRemoveInsurance } from '../../../../Redux/action';
import { WaykeStore } from '../../../../Redux/store';
import watch from '../../../../Redux/watch';
import { prettyNumber } from '../../../../Utils/format';

interface InsuranceItemProps {
  readonly store: WaykeStore;
  readonly insurance: IInsuranceOption;
  readonly key: string;
}

class InsuranceItem extends HtmlNode {
  private readonly props: InsuranceItemProps;

  constructor(element: HTMLElement, props: InsuranceItemProps) {
    super(element);
    this.props = props;

    watch(this.props.store, 'insurance', () => {
      this.render();
    });

    this.render();
  }

  private onClick() {
    addOrRemoveInsurance(this.props.insurance)(this.props.store.dispatch);
  }

  render() {
    const { store, insurance, key } = this.props;
    const state = store.getState();
    const logo = state.order?.getInsuranceOption()?.logo;
    const selected = state.insurance
      ? JSON.stringify(state.insurance).localeCompare(JSON.stringify(insurance)) === 0
      : false;

    new GridItem(
      this.node,
      {
        logo,
        title: insurance.name,
        description: insurance.description,
        price: prettyNumber(insurance.price, { postfix: 'kr/mån' }),
        selected,
        onClick: () => this.onClick(),
      },
      key
    );
  }
}

export default InsuranceItem;
