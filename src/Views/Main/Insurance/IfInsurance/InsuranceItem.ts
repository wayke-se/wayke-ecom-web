import i18next from '@i18n';
import HtmlNode from '../../../../Components/Extension/HtmlNode';

import { IInsuranceOption } from '@wayke-se/ecom';
import GridItem from '../../../../Components/OverflowGrid/OverflowGridItem';
import { addOrRemoveInsurance } from '../../../../Redux/action';
import { WaykeStore } from '../../../../Redux/store';
import watch from '../../../../Redux/watch';
import ecomEvent, { EcomEvent, EcomView, EcomStep } from '../../../../Utils/ecomEvent';
import { prettyNumber } from '../../../../Utils/format';
import { createPortal, destroyPortal } from '../../../../Utils/portal';
import InsuranceItemInfo from './InsuranceItemInfo';

interface InsuranceItemProps {
  readonly store: WaykeStore;
  readonly insurance: IInsuranceOption;
  readonly key: string;
}

class InsuranceItem extends HtmlNode {
  private readonly props: InsuranceItemProps;
  private displayInfo = false;

  constructor(element: HTMLElement, props: InsuranceItemProps) {
    super(element);
    this.props = props;

    watch(this.props.store, 'insurance', () => {
      this.render();
    });

    this.render();
  }

  private onInfoOpen() {
    ecomEvent(EcomView.MAIN, EcomEvent.INSURANCE_INFORMATION_TOGGLE, EcomStep.INSURANCE_IF);
    this.displayInfo = true;
    this.render();
  }

  private onInfoClose() {
    ecomEvent(EcomView.MAIN, EcomEvent.INSURANCE_INFORMATION_TOGGLE, EcomStep.INSURANCE_IF);
    this.displayInfo = false;
    destroyPortal();
    this.render();
    this.node.parentElement?.scrollIntoView();
  }

  private onClick() {
    const { insurance } = this.props.store.getState();
    if (!insurance || (insurance && this.props.insurance.name !== insurance.name)) {
      ecomEvent(EcomView.MAIN, EcomEvent.INSURANCE_SELECTED, EcomStep.INSURANCE_IF);
    } else {
      ecomEvent(EcomView.MAIN, EcomEvent.INSURANCE_UNSELECTED, EcomStep.INSURANCE_IF);
    }

    addOrRemoveInsurance(this.props.insurance)(this.props.store.dispatch);
  }

  render() {
    const { store, insurance, key } = this.props;
    const state = store.getState();
    const logo = state.order?.insuranceOption?.logo;
    const selectedAddons =
      state.insuranceAddOns?.insurance === insurance.name
        ? state.insuranceAddOns.addOns.map((k) => {
            return {
              key: k?.title,
              value: prettyNumber(k?.monthlyPrice, { postfix: i18next.t('insurance.perMonth') }),
            };
          })
        : undefined;
    const selected = state.insurance
      ? JSON.stringify(state.insurance).localeCompare(JSON.stringify(insurance)) === 0
      : false;
    if (this.displayInfo) {
      new InsuranceItemInfo(createPortal(), {
        store: this.props.store,
        insurance,
        selected,
        onClose: () => this.onInfoClose(),
      });
    }

    new GridItem(
      this.node,
      {
        logo,
        selected,
        id: key,
        title: insurance.name,
        description: insurance.description,
        price: prettyNumber(insurance.price, { postfix: i18next.t('insurance.perMonth') }),
        priceDetails: selectedAddons,
        onClick: () => this.onClick(),
        onInfo: () => this.onInfoOpen(),
      },
      key
    );
  }
}

export default InsuranceItem;
