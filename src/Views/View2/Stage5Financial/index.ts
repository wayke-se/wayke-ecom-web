import { PaymentType } from '@wayke-se/ecom';
import { PaymentLookupResponse } from '@wayke-se/ecom/dist-types/payments/payment-lookup-response';
import watch from 'redux-watch';
import ButtonArrowRight from '../../../Components/ButtonArrowRight';
import InputRadioField from '../../../Components/InputRadioField';
import { editFinancial, setFinancial } from '../../../Redux/action';
import store from '../../../Redux/store';
import { prettyNumber } from '../../../Utils/format';
import ListItem from '../ListItem';
import Loan from './Loan';
import Summary from './Summary';

import bankidLogotype from '../../../assets/images/bankid/bankid-logo.svg';

const PROCEED = 'button-financial-proceed';
const PROCEED_NODE = `${PROCEED}-node`;

const CHANGE_BUTTON = 'button-financial-change';
const STAGE = 5;

const RADIO_FINANCIAL_CASH_NODE = 'radio-financial-cash-node';
const RADIO_FINANCIAL_CASH = 'radio-financial-cash';
const RADIO_FINANCIAL_LOAN_NODE = 'radio-financial-loan-node';
const RADIO_FINANCIAL_LOAN = 'radio-financial-loan';
const RADIO_FINANCIAL_LEASE_NODE = 'radio-financial-lease-node';
const RADIO_FINANCIAL_LEASE = 'radio-financial-lease';

const PAYMENT_NODE = 'payment-node';

class Stage5Financial {
  private element: HTMLDivElement;
  private paymentType?: PaymentType;
  private paymentLookupResponse?: PaymentLookupResponse;

  constructor(element: HTMLDivElement) {
    this.element = element;
    const w = watch(store.getState, 'navigation');
    store.subscribe(w(() => this.render()));
    const w2 = watch(store.getState, 'edit');
    store.subscribe(w2(() => this.render()));
    const w3 = watch(store.getState, 'paymentLookupResponse');
    store.subscribe(
      w3(() => {
        const { paymentType, paymentLookupResponse } = store.getState();
        this.paymentType = paymentType || this.paymentType;
        this.paymentLookupResponse = paymentLookupResponse;
        this.render();
      })
    );

    const { paymentType, paymentLookupResponse } = store.getState();
    this.paymentType = paymentType;
    this.paymentLookupResponse = paymentLookupResponse;
    this.render();
  }

  onChange(e: Event) {
    const proceed = this.element.querySelector<HTMLDivElement>(`#${PROCEED}`);
    if (!proceed) return;
    const currentTarget = e.currentTarget as HTMLInputElement;
    const value = currentTarget.value as PaymentType;
    this.paymentType = value;
    this.render();
    proceed.removeAttribute('disabled');
  }

  onProceed() {
    if (this.paymentType) {
      setFinancial(this.paymentType);
    }
  }

  onEdit() {
    editFinancial();
  }

  render() {
    const state = store.getState();
    const { order, vehicle, paymentLookupResponse } = state;
    if (!order || !vehicle) throw 'No order available';

    const paymentOptions = order.getPaymentOptions();

    const content = ListItem(this.element, {
      title: 'Finansiering',
      active: state.navigation.stage === STAGE,
      completed: state.topNavigation.stage > STAGE,
      id: 'financial',
    });

    const part = document.createElement('div');

    if (state.navigation.stage > STAGE && this.paymentType) {
      const loan = paymentOptions.find((x) => x.type === PaymentType.Loan);
      part.innerHTML = Summary({
        paymentType: this.paymentType,
        loan,
        paymentLookupResponse: loan?.loanDetails || paymentLookupResponse,
        changeButtonId: CHANGE_BUTTON,
      });

      part.querySelector(`#${CHANGE_BUTTON}`)?.addEventListener('click', () => this.onEdit());
      content.appendChild(part);
    } else if (state.navigation.stage === STAGE) {
      const cash = paymentOptions.find((x) => x.type === PaymentType.Cash);
      const loan = paymentOptions.find((x) => x.type === PaymentType.Loan);
      const lease = paymentOptions.find((x) => x.type === PaymentType.Lease);

      part.innerHTML = `
        <div class="waykeecom-stack waykeecom-stack--3">
          <h4 class="waykeecom-heading waykeecom-heading--4 waykeecom-no-margin">Hur vill du finansiera din Volvo XC60?</h4>
        </div>

        <div class="waykeecom-stack waykeecom-stack--3">
          <fieldset class="waykeecom-input-group">
            <legend class="waykeecom-input-group__legend">Köp bilen</legend>
            ${
              loan
                ? `
              <div class="waykeecom-stack waykeecom-stack--3" id="${RADIO_FINANCIAL_LOAN_NODE}"></div>
            `
                : ''
            }
            ${
              cash
                ? `
              <div class="waykeecom-stack waykeecom-stack--3" id="${RADIO_FINANCIAL_CASH_NODE}"></div>
            `
                : ''
            }
          </fieldset>
        </div>
        ${
          lease
            ? `
          <div class="waykeecom-stack waykeecom-stack--3">
            <fieldset class="waykeecom-input-group">
              <legend class="waykeecom-input-group__legend">Leasa bilen</legend>
              <div id="${RADIO_FINANCIAL_LEASE_NODE}"></div>
            </fieldset>
          </div>
          `
            : ''
        }
        <div class="waykeecom-stack waykeecom-stack--3" id="${PAYMENT_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--3" id="${PROCEED_NODE}"></div>
      `;

      const contactInformation = order.getContactInformation();

      if (cash) {
        new InputRadioField(part.querySelector<HTMLInputElement>(`#${RADIO_FINANCIAL_CASH_NODE}`), {
          id: RADIO_FINANCIAL_CASH,
          name: 'paymentType',
          title: 'Kontant',
          value: PaymentType.Cash,
          description: `
            <div class="waykeecom-box">
              <ul class="waykeecom-unordered-list">
                <li class="waykeecom-unordered-list__item">Betalning sker hos ${contactInformation?.name} vid 
                kontraktskrivning.</li>
                <li class="waykeecom-unordered-list__item">Inga kostnader tillkommer.</li>
              </ul>
            </div>`,
          meta: `<div class="waykeecom-font-medium">${prettyNumber(cash.price || '???', {
            postfix: cash.unit,
          })}</div>`,
          checked: this.paymentType === PaymentType.Cash,
          onClick: (e) => this.onChange(e),
        });
      }

      if (loan) {
        const loanPrice = this.paymentLookupResponse?.getCosts().monthlyCost || loan.price;
        const duration =
          this.paymentLookupResponse?.getDurationSpec().current ||
          loan.loanDetails?.getDurationSpec().current;

        const interest =
          this.paymentLookupResponse?.getInterests().interest ||
          loan.loanDetails?.getInterests().interest ||
          NaN;

        const getCreditAmount =
          this.paymentLookupResponse?.getCreditAmount() ||
          loan.loanDetails?.getCreditAmount() ||
          NaN;

        new InputRadioField(part.querySelector<HTMLInputElement>(`#${RADIO_FINANCIAL_LOAN_NODE}`), {
          id: RADIO_FINANCIAL_LOAN,
          name: 'paymentType',
          title: 'Billån',
          value: PaymentType.Loan,
          description: `
            <div class="waykeecom-box">
              <div class="waykeecom-stack waykeecom-stack--2">
                <ul class="waykeecom-unordered-list">
                  <li class="waykeecom-unordered-list__item">Låneansökan online med Mobilt BankID <img src="${bankidLogotype}" alt="BankID logotyp" class="waykeecom-image waykeecom-image--inline" aria-hidden="true" /> – svar direkt!</li>
                  <li class="waykeecom-unordered-list__item">Betalning sker hos ${
                    contactInformation?.name
                  } vid 
                  kontraktskrivning.</li>
                  <li class="waykeecom-unordered-list__item">*Beräknat på ${prettyNumber(
                    getCreditAmount,
                    {
                      postfix: 'kr',
                    }
                  )} kr, ${duration} mån, ${interest * 100}% ränta.</li>
                </ul>
              </div>
              ${
                loan.logo
                  ? `<div class="waykeecom-stack waykeecom-stack--2">
                    <div class="waykeecom-align waykeecom-align--center">
                      <img src="${loan.logo}" alt="${loan.name} logotyp" class="waykeecom-image waykeecom-image--loan-logo" />
                    </div>
                  </div>`
                  : ''
              }
            </div>`,
          meta: `<div class="waykeecom-font-medium">${prettyNumber(loanPrice || '???', {
            postfix: loan.unit,
          })}</div>`,
          checked: this.paymentType === PaymentType.Loan,
          onClick: (e) => this.onChange(e),
        });
      }

      if (lease) {
        new InputRadioField(
          part.querySelector<HTMLInputElement>(`#${RADIO_FINANCIAL_LEASE_NODE}`),
          {
            id: RADIO_FINANCIAL_LEASE,
            name: 'paymentType',
            title: 'Privatleasing',
            value: PaymentType.Lease,
            description: `
            <div class="waykeecom-box">
              <ul>
                <li>*Inkl. 1 500 mil/år, 36 mån.</li>
              </ul>
            </div>`,
            meta: `<div class="waykeecom-font-medium">${prettyNumber(lease.price || '???', {
              postfix: lease.unit,
            })}</div>`,
            checked: this.paymentType === PaymentType.Lease,
            onClick: (e) => this.onChange(e),
          }
        );
      }

      const paymentNode = part.querySelector<HTMLDivElement>(`#${PAYMENT_NODE}`);
      if (paymentNode && loan) {
        if (this.paymentType === PaymentType.Loan) {
          new Loan(paymentNode, loan, vehicle.id, this.paymentLookupResponse);
        }
      }

      new ButtonArrowRight(part.querySelector<HTMLDivElement>(`#${PROCEED_NODE}`), {
        title: 'Fortsätt',
        id: PROCEED,
        disabled: !this.paymentType,
        onClick: () => this.onProceed(),
      });
    }

    content.appendChild(part);
  }
}

export default Stage5Financial;
