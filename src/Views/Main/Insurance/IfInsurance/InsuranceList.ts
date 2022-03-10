import { IInsuranceOption } from '@wayke-se/ecom';
import HtmlNode from '../../../../Components/Extension/HtmlNode';
import OverflowGridList from '../../../../Components/OverflowGrid/OverflowGridList';
import { WaykeStore } from '../../../../Redux/store';
import InsuranceItem from './InsuranceItem';

interface InsuranceListProps {
  store: WaykeStore;
  insurances: IInsuranceOption[];
}
class InsuranceList extends HtmlNode {
  private props: InsuranceListProps;

  constructor(element: HTMLDivElement | null, props: InsuranceListProps) {
    super(element);
    this.props = props;

    this.render();
  }

  render() {
    const listRef = new OverflowGridList(this.node, 'insurance-list');
    const { overflowElement } = listRef;
    if (overflowElement) {
      overflowElement.innerHTML = '';
      this.props.insurances.forEach(
        (insurance, index) =>
          new InsuranceItem(overflowElement, {
            store: this.props.store,
            insurance,
            key: `insurance-${index}`,
          })
      );
    }
  }
}

export default InsuranceList;
