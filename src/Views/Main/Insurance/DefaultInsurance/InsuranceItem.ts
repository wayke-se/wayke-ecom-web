import { IAvailableInsuranceOption } from '@wayke-se/ecom';
import HtmlNode from '../../../../Components/Extension/HtmlNode';

import GridItem from '../../../../Components/OverflowGrid/OverflowGridItem';
import { addOrRemoveFreeInsurance } from '../../../../Redux/action';
import store from '../../../../Redux/store';
import watch from '../../../../Redux/watch';

class InsuranceItem extends HtmlNode {
  private freeInsurance: IAvailableInsuranceOption;
  private key: string;

  constructor(element: HTMLElement, freeInsurance: IAvailableInsuranceOption, key: string) {
    super(element);
    this.freeInsurance = freeInsurance;
    this.key = key;

    watch('freeInsurance', () => {
      this.render();
    });

    this.render();
  }

  onClick() {
    addOrRemoveFreeInsurance(this.freeInsurance);
  }

  render() {
    const state = store.getState();
    const logo = state.order?.getInsuranceOption()?.logo;

    const selected = state.freeInsurance
      ? JSON.stringify(state.freeInsurance).localeCompare(JSON.stringify(this.freeInsurance)) === 0
      : false;

    new GridItem(
      this.node,
      {
        logo,
        title: this.freeInsurance.title,
        description: this.freeInsurance.description,
        price: 'Gratis',
        selected,
        onClick: () => this.onClick(),
      },
      this.key
    );
  }
}

export default InsuranceItem;
