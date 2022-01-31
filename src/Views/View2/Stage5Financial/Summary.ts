import { IPaymentOption, PaymentType } from '@wayke-se/ecom';
import { PaymentLookupResponse } from '@wayke-se/ecom/dist-types/payments/payment-lookup-response';
import Alert from '../../../Templates/Alert';
import KeyValueListItem from '../../../Templates/KeyValueListItem';
import { prettyNumber } from '../../../Utils/format';

interface LoanSummaryProps {
  loan: IPaymentOption;
  paymentLookupResponse: PaymentLookupResponse;
}

const LoanSummary = ({ loan, paymentLookupResponse }: LoanSummaryProps) => {
  const downPayment = paymentLookupResponse.getDownPaymentSpec().current;
  const duration = paymentLookupResponse.getDurationSpec().current;
  const creditAmount = paymentLookupResponse.getCreditAmount();
  return `
    <div class="waykeecom-stack waykeecom-stack--1">
      Ordern är snart klar, här ser du ditt lånebesked:
    </div>
    <div class="waykeecom-stack waykeecom-stack--1">
      ${Alert({
        tone: 'success',
        children: `
          <p><b>Grattis! Din låneansökan har beviljats av ${loan.name}.</b></p>
          <p> Bilen är inte reserverad ännu. Slutför ordern genom att klicka dig igenom nästkommande steg. Har du frågor under tiden? Kontakta [handlaren] på tel [telefonnummer].</p>
        `,
      })}
    </div>
    <div class="waykeecom-stack waykeecom-stack--1">
      <ul class="waykeecom-key-value-list">
        ${KeyValueListItem({
          key: 'Kontantinsats',
          value: prettyNumber(downPayment, { postfix: 'kr' }),
        })}
        ${KeyValueListItem({
          key: 'Lånebelopp',
          value: prettyNumber(creditAmount, { postfix: 'kr' }),
        })}
        ${KeyValueListItem({ key: 'Avbetalningsperoid', value: `${duration} mån` })}
        ${KeyValueListItem({
          key: 'Månadskostnad för lånet',
          value: prettyNumber(downPayment, { postfix: 'kr' }),
        })}
      </ul>
    </div>
  `;
};

interface SummaryProps {
  loan?: IPaymentOption;
  paymentLookupResponse?: PaymentLookupResponse;
  paymentType: PaymentType;
  changeButtonId: string;
}

const Summary = ({ paymentType, loan, paymentLookupResponse, changeButtonId }: SummaryProps) => {
  const paymentTypeTitle = PaymentType.Cash ? 'Kontant' : PaymentType.Loan ? 'Billån' : 'Leasing';
  return `
  <div class="waykeecom-stack waykeecom-stack--1">
    <ul class="waykeecom-key-value-list">
      <li class="waykeecom-key-value-list__item">
        <div class="waykeecom-key-value-list__key">Finansiering</div>
        <div class="waykeecom-key-value-list__value">${paymentTypeTitle}</div>
      </li>
    </ul>
  </div>
  ${
    paymentType === PaymentType.Loan && loan && paymentLookupResponse
      ? LoanSummary({ loan, paymentLookupResponse })
      : ''
  }
  
  <div class="waykeecom-stack waykeecom-stack--1">
    <div class="waykeecom-align waykeecom-align--end">
      <button id="${changeButtonId}" title="Ändra finansiering" class="waykeecom-link">Ändra</button>
    </div>
  </div>
`;
};

export default Summary;
