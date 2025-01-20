import { IPaymentOption, PaymentType } from '@wayke-se/ecom';
import i18next from 'i18next';
import { PaymentLookup } from '../../../@types/PaymentLookup';
import Alert from '../../../Templates/Alert';
import KeyValueListItem from '../../../Templates/KeyValueListItem';
import { prettyNumber } from '../../../Utils/format';

interface LoanSummaryProps {
  loan: IPaymentOption;
  paymentLookupResponse: PaymentLookup;
}

const LoanSummary = ({ loan, paymentLookupResponse }: LoanSummaryProps) => {
  const downPayment = paymentLookupResponse.downPaymentSpec.current;
  const duration = paymentLookupResponse.durationSpec.current;
  const creditAmount = paymentLookupResponse.creditAmount;
  const { monthlyCost } = paymentLookupResponse.costs;

  return `
    <div class="waykeecom-stack waykeecom-stack--2">
      <h4 class="waykeecom-heading waykeecom-heading--4">${i18next.t('loanSummary.title')}</h4>
      <div class="waykeecom-content">
        <p class="waykeecom-content__p">${i18next.t('loanSummary.description')}</p>
      </div>
    </div>
    <div class="waykeecom-stack waykeecom-stack--2">
      ${Alert({
        tone: 'success',
        children: `
          <div class="waykeecom-content waykeecom-content--inherit-size">
            <p class="waykeecom-content__p"><span class="waykeecom-text waykeecom-text--font-medium">${i18next.t('loanSummary.successMessage', { loanName: loan.name })}</span></p>
            <p class="waykeecom-content__p">${i18next.t('loanSummary.notReserved')}</p>
          </div>
        `,
      })}
    </div>
    <div class="waykeecom-stack waykeecom-stack--2">
      <div class="waykeecom-stack waykeecom-stack--1">
        <ul class="waykeecom-key-value-list">
          ${KeyValueListItem({
            key: i18next.t('loanSummary.downPayment'),
            value: prettyNumber(downPayment, { postfix: 'kr' }),
          })}
          ${KeyValueListItem({
            key: i18next.t('loanSummary.loanAmount'),
            value: prettyNumber(creditAmount, { postfix: 'kr' }),
          })}
          ${KeyValueListItem({ key: i18next.t('loanSummary.repaymentPeriod'), value: `${duration} mån` })}
          ${KeyValueListItem({
            key: i18next.t('loanSummary.monthlyCost'),
            value: prettyNumber(monthlyCost, { postfix: 'kr*' }),
          })}
        </ul>
      </div>
      <div class="waykeecom-stack waykeecom-stack--1">
        <div class="waykeecom-disclaimer-text">${i18next.t('loanSummary.disclaimer')}</div>
      </div>
    </div>
  `;
};

interface SummaryProps {
  loan?: IPaymentOption;
  paymentLookupResponse?: PaymentLookup;
  paymentType: PaymentType;
  changeButtonId: string;
}

const Summary = ({ paymentType, loan, paymentLookupResponse, changeButtonId }: SummaryProps) => {
  const paymentTypeTitle =
    paymentType === PaymentType.Cash
      ? i18next.t('summary.cash')
      : paymentType === PaymentType.Loan
        ? i18next.t('summary.loan')
        : i18next.t('summary.leasing');
  return `
  ${
    paymentType === PaymentType.Loan && loan && paymentLookupResponse
      ? `
        <div class="waykeecom-stack waykeecom-stack--1">
          ${LoanSummary({ loan, paymentLookupResponse })}
        </div>
      `
      : `
        <div class="waykeecom-stack waykeecom-stack--1">
          <ul class="waykeecom-key-value-list">
            <li class="waykeecom-key-value-list__item">
              <div class="waykeecom-key-value-list__key">${i18next.t('summary.financing')}</div>
              <div class="waykeecom-key-value-list__value">${paymentTypeTitle}</div>
            </li>
          </ul>
        </div>
      `
  }
  <div class="waykeecom-stack waykeecom-stack--1">
    <div class="waykeecom-align waykeecom-align--end">
      <button id="${changeButtonId}" title="${i18next.t('summary.changeButton')}" class="waykeecom-link">${i18next.t('summary.changeButton')}</button>
    </div>
  </div>
`;
};

export default Summary;
