import { IInsuranceOption } from '@wayke-se/ecom';
import HtmlNode from '../../../../Components/Extension/HtmlNode';

import GridItem from '../../../../Components/OverflowGrid/OverflowGridItem';
import { addOrRemoveInsurance } from '../../../../Redux/action';
import { WaykeStore } from '../../../../Redux/store';
import watch from '../../../../Redux/watch';
import { prettyNumber } from '../../../../Utils/format';

interface InsuranceItemProps {
  store: WaykeStore;
  insurance: IInsuranceOption;
  key: string;
}

class InsuranceItem extends HtmlNode {
  private props: InsuranceItemProps;

  constructor(element: HTMLElement, props: InsuranceItemProps) {
    super(element);
    this.props = props;

    watch(this.props.store, 'insurance', () => {
      this.render();
    });

    this.render();
  }

  onClick() {
    addOrRemoveInsurance(this.props.insurance)(this.props.store.dispatch);
  }

  render() {
    const state = this.props.store.getState();
    const logo = state.order?.getInsuranceOption()?.logo;
    const selected = state.insurance
      ? JSON.stringify(state.insurance).localeCompare(JSON.stringify(this.props.insurance)) === 0
      : false;

    new GridItem(
      this.node,
      {
        logo,
        title: this.props.insurance.name,
        description: this.props.insurance.description,
        price: prettyNumber(this.props.insurance.price, { postfix: 'kr/mån' }),
        selected,
        onClick: () => this.onClick(),
      },
      this.props.key
    );
  }
}

export default InsuranceItem;
