import { IPaymentOption, PaymentType } from '@wayke-se/ecom';
import { PaymentLookupResponse } from '@wayke-se/ecom/dist-types/payments/payment-lookup-response';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import { WaykeStore } from '../../../Redux/store';
import KeyValueListItem, { KeyValueListItemProps } from '../../../Templates/KeyValueListItem';
import { prettyNumber } from '../../../Utils/format';
import StageCompletedFinancialCreditAssessment from './StageCompletedFinancialCreditAssessment';

const CREDIT_ASSESSMENT_RESULT = 'credit-assessment-result';
const CREDIT_ASSESSMENT_RESULT_NODE = `${CREDIT_ASSESSMENT_RESULT}-node`;

interface StageCompletedFinancialProps {
  store: WaykeStore;
  loan?: IPaymentOption;
  paymentLookupResponse?: PaymentLookupResponse;
  paymentType: PaymentType;
  onEdit: () => void;
}

class StageCompletedFinancial extends HtmlNode {
  private props: StageCompletedFinancialProps;

  constructor(element: HTMLDivElement, props: StageCompletedFinancialProps) {
    super(element, { htmlTag: 'div' });
    this.props = props;
    this.render();
  }

  render() {
    if (this.props.paymentType === PaymentType.Loan) {
      const state = this.props.store.getState();
      const loan = this.props.loan;
      const paymentLookupResponse =
        this.props.paymentLookupResponse || this.props.loan?.loanDetails;
      if (!loan || !paymentLookupResponse) throw 'Missing loan';

      const downPayment = paymentLookupResponse.getDownPaymentSpec().current;
      const creditAmount = paymentLookupResponse.getCreditAmount();
      const duration = paymentLookupResponse.getDurationSpec().current;
      const { interest, effectiveInterest } = paymentLookupResponse.getInterests();

      const keyValueList: KeyValueListItemProps[] = [
        {
          key: 'Kontantinsats',
          value: prettyNumber(downPayment, {
            postfix: 'kr',
          }),
        },
        {
          key: 'Lånebelopp',
          value: prettyNumber(creditAmount, {
            postfix: 'kr',
          }),
        },
        {
          key: 'Avbetalningsperoid',
          value: `${duration} mån`,
        },
        {
          key: 'Månadskostnad för lånet',
          value: prettyNumber(downPayment, { postfix: 'kr*' }),
        },
      ];

      const decision = state.creditAssessmentResponse?.getRecommendation();
      const disclaimerText = `Beräknat på ${interest * 100} % ränta (effektivt ${
        effectiveInterest * 100
      } %). Den ränta du får sätts vid avtalskrivning.`;

      this.node.innerHTML = `
        <div class="waykeecom-stack waykeecom-stack--2">
          <h4 class="waykeecom-heading waykeecom-heading--4">Billån</h4>
          <div class="waykeecom-content">
            <p>Ordern är snart klar, här ser du ditt lånebesked:</p>
          </div>
        </div>
        ${
          decision
            ? `<div class="waykeecom-stack waykeecom-stack--2" id="${CREDIT_ASSESSMENT_RESULT_NODE}"></div>`
            : ''
        }
        <div class="waykeecom-stack waykeecom-stack--2">
          <div class="waykeecom-stack waykeecom-stack--1">
            <ul class="waykeecom-key-value-list">
              ${keyValueList.map((kv) => KeyValueListItem(kv)).join('')}
            </ul>
          </div>
          <div class="waykeecom-stack waykeecom-stack--1">
            <div class="waykeecom-disclaimer-text">${disclaimerText}</div>
          </div>
        </div>
        <div class="waykeecom-stack waykeecom-stack--1">
          <div class="waykeecom-align waykeecom-align--end">
            <button type="button" title="Ändra finansiering" class="waykeecom-link">Ändra</button>
          </div>
        </div>
      `;

      if (decision) {
        new StageCompletedFinancialCreditAssessment(
          this.node.querySelector(`#${CREDIT_ASSESSMENT_RESULT_NODE}`),
          {
            store: this.props.store,
            decision,
          }
        );
      }
    } else {
      this.node.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--1">
        <ul class="waykeecom-key-value-list">
          ${KeyValueListItem({
            key: 'Finansiering',
            value: this.props.paymentType === PaymentType.Cash ? 'Kontant' : 'Leasing',
          })}
        </ul>
      </div>
      <div class="waykeecom-stack waykeecom-stack--1">
        <div class="waykeecom-align waykeecom-align--end">
          <button type="button" title="Ändra finansiering" class="waykeecom-link">Ändra</button>
        </div>
      </div>
    `;
    }

    this.node.querySelector('button')?.addEventListener('click', () => this.props.onEdit());
  }
}

export default StageCompletedFinancial;
