import { IPaymentOption, PaymentType } from '@wayke-se/ecom';
import { PaymentLookupResponse } from '@wayke-se/ecom/dist-types/payments/payment-lookup-response';
import AppendChild from '../../../Components/AppendChild';
import Alert from '../../../Templates/Alert';
import KeyValueListItem, { KeyValueListItemProps } from '../../../Templates/KeyValueListItem';
import { prettyNumber } from '../../../Utils/format';

interface StageCompletedFinancialProps {
  loan?: IPaymentOption;
  paymentLookupResponse?: PaymentLookupResponse;
  paymentType: PaymentType;
  onEdit: () => void;
}

class StageCompletedFinancial extends AppendChild {
  private props;

  constructor(element: HTMLDivElement, props: StageCompletedFinancialProps) {
    super(element, { htmlTag: 'div' });
    this.props = props;
    this.render();
  }

  render() {
    if (this.props.paymentType === PaymentType.Loan) {
      const loan = this.props.loan;
      const paymentLookupResponse = this.props.paymentLookupResponse;
      if (!loan || !paymentLookupResponse) throw 'Miissing loan';

      const downPayment = paymentLookupResponse.getDownPaymentSpec().current;
      const creditAmount = paymentLookupResponse.getCreditAmount();
      const duration = paymentLookupResponse.getDurationSpec().current;

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

      this.content.innerHTML = `
      <div class="waykeecom-stack waykeecom-stack--2">
        <h4 class="waykeecom-heading waykeecom-heading--4">Billån</h4>
        <div class="waykeecom-content">
          <p>Ordern är snart klar, här ser du ditt lånebesked:</p>
        </div>
      </div>
      <div class="waykeecom-stack waykeecom-stack--2">
        ${Alert({
          tone: 'success',
          children: `
            <p><strong>Grattis! Din låneansökan har beviljats av ${loan.name}.</strong></p>
            <p> Bilen är inte reserverad ännu. Slutför ordern genom att klicka dig igenom nästkommande steg. Har du frågor under tiden? Kontakta [handlaren] på tel [telefonnummer].</p>
          `,
        })}
      </div>
      <div class="waykeecom-stack waykeecom-stack--2">
        <div class="waykeecom-stack waykeecom-stack--1">
          <ul class="waykeecom-key-value-list">
            ${keyValueList.map((kv) => KeyValueListItem(kv))}
          </ul>
        </div>
        <div class="waykeecom-stack waykeecom-stack--1">
          <div class="waykeecom-disclaimer-text">*Beräknat på X,XX % ränta (effektivt X,XX %). Den ränta du får sätts vid avtalskrivning.</div>
        </div>
      </div>
      <div class="waykeecom-stack waykeecom-stack--1">
        <div class="waykeecom-align waykeecom-align--end">
          <button type="button" title="Ändra finansiering" class="waykeecom-link">Ändra</button>
        </div>
      </div>
    `;
    } else {
      this.content.innerHTML = `
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

    this.content.querySelector('button')?.addEventListener('click', () => this.props.onEdit());
  }
}

export default StageCompletedFinancial;
