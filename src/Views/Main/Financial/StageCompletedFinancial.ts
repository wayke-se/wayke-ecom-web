import i18next from '@i18n';
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
      const { monthlyCost } = currentPaymentLookupResponse.costs;

      const keyValueList: KeyValueListItemProps[] = [
        {
          key: i18next.t('stageCompletedFinancial.downPayment'),
          value: prettyNumber(downPayment, {
            postfix: 'kr',
          }),
        },
        {
          key: i18next.t('stageCompletedFinancial.loanAmount'),
          value: prettyNumber(creditAmount, {
            postfix: 'kr',
          }),
        },
        {
          key: i18next.t('stageCompletedFinancial.repaymentPeriod'),
          value: `${duration} ${i18next.t('stageCompletedFinancial.months')}`,
        },
        {
          key: i18next.t('stageCompletedFinancial.monthlyCost'),
          value: prettyNumber(monthlyCost, { postfix: 'kr*' }),
        },
      ];

      const decision = state.creditAssessmentResponse?.recommendation;
      const disclaimerText = i18next.t('stageCompletedFinancial.disclaimerText', {
        interest: prettyNumber(interest * 100, { decimals: 2 }),
        effectiveInterest: prettyNumber(effectiveInterest * 100, { decimals: 2 }),
      });

      this.node.innerHTML = `
        <div class="waykeecom-stack waykeecom-stack--2">
          <h4 class="waykeecom-heading waykeecom-heading--4">${loan.name}</h4>
          <div class="waykeecom-content">
            <p class="waykeecom-content__p">${i18next.t('stageCompletedFinancial.orderAlmostReady')}</p>
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
            <button type="button" title="${i18next.t('stageCompletedFinancial.changeFinancing')}" class="waykeecom-link">${i18next.t('stageCompletedFinancial.changeFinancing')}</button>
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
            key: i18next.t('stageCompletedFinancial.financing'),
            value:
              paymentType === PaymentType.Cash
                ? i18next.t('stageCompletedFinancial.cash')
                : i18next.t('stageCompletedFinancial.lease'),
          })}
        </ul>
      </div>
      ${
        onEdit
          ? `
          <div class="waykeecom-stack waykeecom-stack--1">
            <div class="waykeecom-align waykeecom-align--end">
              <button type="button" title="${i18next.t('stageCompletedFinancial.changeFinancing')}" class="waykeecom-link">${i18next.t('stageCompletedFinancial.changeFinancing')}</button>
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
