import { IInsuranceOption } from '@wayke-se/ecom';
import OverflowGridList from '../../../Components/OverflowGrid/OverflowGridList';
import InsuranceItem from './InsuranceItem';

class InsuranceList {
  private element: HTMLDivElement;
  private insurances: IInsuranceOption[];

  constructor(element: HTMLDivElement | null, insurances: IInsuranceOption[]) {
    if (!element) throw 'Missing element';
    this.element = element;
    this.insurances = insurances;

    this.render();
  }

  render() {
    const listRef = new OverflowGridList(this.element, 'insurance-list');
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
