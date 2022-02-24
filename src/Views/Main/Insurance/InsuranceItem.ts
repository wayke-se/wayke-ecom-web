import { IInsuranceOption } from '@wayke-se/ecom';
import watch from 'redux-watch';

import GridItem from '../../../Components/OverflowGrid/OverflowGridItem';
import { addOrRemoveInsurance } from '../../../Redux/action';
import store from '../../../Redux/store';
import { prettyNumber } from '../../../Utils/format';

class InsuranceItem {
  private element: HTMLUListElement;
  private insurance: IInsuranceOption;
  private key: string;

  constructor(element: HTMLUListElement, insurance: IInsuranceOption, key: string) {
    this.element = element;
    this.insurance = insurance;
    this.key = key;

    const w = watch(store.getState, 'insurance');
    store.subscribe(w(() => this.render()));

    this.render();
  }

  onClick() {
    addOrRemoveInsurance(this.insurance);
  }

  render() {
    const state = store.getState();
    const selected = state.insurance
      ? JSON.stringify(state.insurance).localeCompare(JSON.stringify(this.insurance)) === 0
      : false;

    new GridItem(
      this.element,
      {
        title: this.insurance.name,
        description: this.insurance.description,
        logo: this.insurance.brand.logotype,
        image: this.insurance.brand.logotype,
        price: prettyNumber(this.insurance.price, { postfix: 'kr/mån' }),
        selected,
        onClick: () => this.onClick(),
      },
      this.key
    );
  }
}

export default InsuranceItem;
