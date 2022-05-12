import { IAvailableInsuranceOption } from '@wayke-se/ecom';
import HtmlNode from '../../../../Components/Extension/HtmlNode';
import OverflowGridList from '../../../../Components/OverflowGrid/OverflowGridList';
import { WaykeStore } from '../../../../Redux/store';
import ecomEvent, { EcomEvent, EcomView, Step } from '../../../../Utils/ecomEvent';
import InsuranceItem from './InsuranceItem';

interface InsuranceListProps {
  readonly store: WaykeStore;
  readonly insurances: IAvailableInsuranceOption[];
}

class InsuranceList extends HtmlNode {
  private readonly props: InsuranceListProps;

  constructor(element: HTMLElement | null, props: InsuranceListProps) {
    super(element);
    this.props = props;

    this.render();
  }

  render() {
    const { store, insurances } = this.props;
    const listRef = new OverflowGridList(this.node, {
      id: 'insurance-list',
      onClick: () => ecomEvent(EcomView.MAIN, EcomEvent.INSURANCE_ARROW, Step.INSURANCE),
    });
    const { overflowElement } = listRef;
    if (overflowElement) {
      overflowElement.innerHTML = '';
      insurances.forEach(
        (freeInsurance, index) =>
          new InsuranceItem(overflowElement, {
            store,
            freeInsurance,
            key: `insurance-${index}`,
          })
      );
    }
  }
}

export default InsuranceList;
