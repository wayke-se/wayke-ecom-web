import { IInsuranceOption } from '@wayke-se/ecom';
import HtmlNode from '../../../../Components/Extension/HtmlNode';
import OverflowGridList from '../../../../Components/OverflowGrid/OverflowGridList';
import { WaykeStore } from '../../../../Redux/store';
import InsuranceItem from './InsuranceItem';

interface InsuranceListProps {
  readonly store: WaykeStore;
  readonly insurances: IInsuranceOption[];
}
class InsuranceList extends HtmlNode {
  private readonly props: InsuranceListProps;

  constructor(element: HTMLDivElement | null, props: InsuranceListProps) {
    super(element);
    this.props = props;

    this.render();
  }

  render() {
    const { store, insurances } = this.props;
    const listRef = new OverflowGridList(this.node, 'insurance-list');
    const { overflowElement } = listRef;
    if (overflowElement) {
      overflowElement.innerHTML = '';
      insurances.forEach(
        (insurance, index) =>
          new InsuranceItem(overflowElement, {
            store,
            insurance,
            key: `insurance-${index}`,
          })
      );
    }
  }
}

export default InsuranceList;
