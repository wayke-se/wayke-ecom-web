import { PaymentType } from '@wayke-se/ecom';
import { PaymentOption } from '../../../@types/OrderOptions';
import { PaymentLookup } from '../../../@types/PaymentLookup';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import { WaykeStore } from '../../../Redux/store';
import KeyValueListItem, { KeyValueListItemProps } from '../../../Templates/KeyValueListItem';
import { prettyNumber } from '../../../Utils/format';
import StageCompletedFinancialCreditAssessment from './StageCompletedFinancialCreditAssessment';

const CREDIT_ASSESSMENT_RESULT = 'credit-assessment-result';
const CREDIT_ASSESSMENT_RESULT_NODE = `${CREDIT_ASSESSMENT_RESULT}-node`;

interface StageCompletedFinancialProps {
  readonly store: WaykeStore;
  readonly loan?: PaymentOption;
  readonly paymentLookupResponse?: PaymentLookup;
  readonly paymentType: PaymentType;
  readonly onEdit?: () => void;
}

class StageCompletedFinancial extends HtmlNode {
  private readonly props: StageCompletedFinancialProps;

  constructor(element: HTMLDivElement, props: StageCompletedFinancialProps) {
    super(element, { htmlTag: 'div' });
    this.props = props;
    this.render();
  }

  render() {
    const { store, paymentType, loan, paymentLookupResponse, onEdit } = this.props;
    const loanDetails = loan?.loanDetails;

    if (paymentType === PaymentType.Loan) {
      const state = this.props.store.getState();
      const currentPaymentLookupResponse = paymentLookupResponse || loanDetails;
      if (!loanDetails || !currentPaymentLookupResponse) throw 'Missing loan';

      const downPayment = currentPaymentLookupResponse.downPaymentSpec.current;
      const creditAmount = currentPaymentLookupResponse.creditAmount;
      const duration = currentPaymentLookupResponse.durationSpec.current;
      const { interest, effectiveInterest } = currentPaymentLookupResponse.interests;

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

      const decision = state.creditAssessmentResponse?.recommendation;
      const disclaimerText = `*Beräknat på ${interest * 100} % ränta (effektivt ${
        effectiveInterest * 100
      } %). Den ränta du får sätts vid avtalskrivning.`;

      this.node.innerHTML = `
        <div class="waykeecom-stack waykeecom-stack--2">
          <h4 class="waykeecom-heading waykeecom-heading--4">Billån</h4>
          <div class="waykeecom-content">
            <p class="waykeecom-content__p">Ordern är snart klar, här ser du ditt lånebesked:</p>
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
            store,
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
            value: paymentType === PaymentType.Cash ? 'Kontant' : 'Leasing',
          })}
        </ul>
      </div>
      ${
        onEdit
          ? `
          <div class="waykeecom-stack waykeecom-stack--1">
            <div class="waykeecom-align waykeecom-align--end">
              <button type="button" title="Ändra finansiering" class="waykeecom-link">Ändra</button>
            </div>
          </div>
          `
          : ''
      }
    `;
    }

    if (onEdit) {
      this.node.querySelector('button')?.addEventListener('click', () => onEdit());
    }
  }
}

export default StageCompletedFinancial;
