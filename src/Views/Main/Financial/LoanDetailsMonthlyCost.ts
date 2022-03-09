import HtmlNode from '../../../Components/Extension/HtmlNode';
import KeyValueListItem from '../../../Templates/KeyValueListItem';
import { prettyNumber } from '../../../Utils/format';

interface LoanDetailsMonthlyCostProps {
  monthlyCost: number;
}

class LoanDetailsMonthlyCost extends HtmlNode {
  private props: LoanDetailsMonthlyCostProps;

  constructor(element: HTMLElement | null | undefined, props: LoanDetailsMonthlyCostProps) {
    super(element);
    this.props = props;

    this.render();
  }

  update(props: LoanDetailsMonthlyCostProps) {
    this.props = props;
    this.render();
  }

  render() {
    const { monthlyCost } = this.props;
    this.node.innerHTML = `
      <ul class="waykeecom-key-value-list waykeecom-key-value-list--large-value">
        ${KeyValueListItem({
          key: 'Månadskostnad för lånet',
          value: prettyNumber(monthlyCost, {
            postfix: 'kr/mån*',
          }),
        })}
      </ul>
    `;
  }
}

export default LoanDetailsMonthlyCost;
