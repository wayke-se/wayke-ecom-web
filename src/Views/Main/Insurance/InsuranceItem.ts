import { IInsuranceOption } from '@wayke-se/ecom';
import HtmlNode from '../../../Components/Extension/HtmlNode';

import GridItem from '../../../Components/OverflowGrid/OverflowGridItem';
import { addOrRemoveInsurance } from '../../../Redux/action';
import store from '../../../Redux/store';
import watch from '../../../Redux/watch';
import { prettyNumber } from '../../../Utils/format';

class InsuranceItem extends HtmlNode {
  private insurance: IInsuranceOption;
  private key: string;

  constructor(element: HTMLElement, insurance: IInsuranceOption, key: string) {
    super(element);
    this.insurance = insurance;
    this.key = key;

    watch('insurance', () => {
      this.render();
    });

    this.render();
  }

  onClick() {
    addOrRemoveInsurance(this.insurance);
  }

  render() {
    const state = store.getState();
    const logo = state.order?.getInsuranceOption()?.logo;
    const selected = state.insurance
      ? JSON.stringify(state.insurance).localeCompare(JSON.stringify(this.insurance)) === 0
      : false;

    new GridItem(
      this.node,
      {
        logo,
        title: this.insurance.name,
        description: this.insurance.description,
        price: prettyNumber(this.insurance.price, { postfix: 'kr/mån' }),
        selected,
        onClick: () => this.onClick(),
      },
      this.key
    );
  }
}

export default InsuranceItem;
