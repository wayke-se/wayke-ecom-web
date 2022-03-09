import HtmlNode from '../../../Components/Extension/HtmlNode';
import KeyValueListItem from '../../../Templates/KeyValueListItem';
import { prettyNumber } from '../../../Utils/format';

interface LoanDetailsBasicProps {
  downPayment: number;
  creditAmount: number;
  downPaymentPercentage: number;
  creditAmountPercentage: number;
}

class LoanDetailsBasic extends HtmlNode {
  private props: LoanDetailsBasicProps;

  constructor(element: HTMLElement | null | undefined, props: LoanDetailsBasicProps) {
    super(element);
    this.props = props;

    this.render();
  }

  update(props: LoanDetailsBasicProps) {
    this.props = props;
    this.render();
  }

  render() {
    const { downPayment, creditAmount, downPaymentPercentage, creditAmountPercentage } = this.props;
    this.node.innerHTML = `
      <ul class="waykeecom-key-value-list">
        ${KeyValueListItem({
          key: `
            <div class="waykeecom-hstack waykeecom-hstack--spacing-1 waykeecom-hstack--align-center">
              <div class="waykeecom-hstack__item waykeecom-hstack__item--no-shrink" aria-hidden="true">
                <div class="waykeecom-chart-indicator waykeecom-chart-indicator--secondary"></div>
              </div>
              <div class="waykeecom-hstack__item">
                Kontantinsats (${downPaymentPercentage} %)
              </div>
            </div>
          `,
          value: prettyNumber(downPayment, { postfix: 'kr' }),
        })}
        ${KeyValueListItem({
          key: `
            <div class="waykeecom-hstack waykeecom-hstack--spacing-1 waykeecom-hstack--align-center">
              <div class="waykeecom-hstack__item waykeecom-hstack__item--no-shrink" aria-hidden="true">
                <div class="waykeecom-chart-indicator waykeecom-chart-indicator--primary"></div>
              </div>
              <div class="waykeecom-hstack__item">
                Lån (${creditAmountPercentage} %)
              </div>
            </div>
          `,
          value: prettyNumber(creditAmount, { postfix: 'kr' }),
        })}
      </ul>
    `;
  }
}

export default LoanDetailsBasic;
