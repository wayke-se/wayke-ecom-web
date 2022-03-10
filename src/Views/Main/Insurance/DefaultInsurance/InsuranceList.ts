import { IAvailableInsuranceOption } from '@wayke-se/ecom';
import HtmlNode from '../../../../Components/Extension/HtmlNode';
import OverflowGridList from '../../../../Components/OverflowGrid/OverflowGridList';
import InsuranceItem from './InsuranceItem';

class InsuranceList extends HtmlNode {
  private insurances: IAvailableInsuranceOption[];

  constructor(element: HTMLDivElement | null, insurances: IAvailableInsuranceOption[]) {
    super(element);
    this.insurances = insurances;

    this.render();
  }

  render() {
    const listRef = new OverflowGridList(this.node, 'insurance-list');
    const { overflowElement } = listRef;
    if (overflowElement) {
      overflowElement.innerHTML = '';
      this.insurances.forEach(
        (insurance, index) => new InsuranceItem(overflowElement, insurance, `insurance-${index}`)
      );
    }
  }
}

export default InsuranceList;
