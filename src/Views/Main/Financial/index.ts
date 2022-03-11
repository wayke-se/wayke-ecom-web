import { PaymentType } from '@wayke-se/ecom';
import { PaymentLookupResponse } from '@wayke-se/ecom/dist-types/payments/payment-lookup-response';
import ButtonArrowRight from '../../../Components/Button/ButtonArrowRight';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import InputRadioGroup, { RadioItem } from '../../../Components/Input/InputRadioGroup';
import { goTo, setFinancial } from '../../../Redux/action';
import { WaykeStore } from '../../../Redux/store';
import { Image } from '../../../Utils/constants';
import { prettyNumber } from '../../../Utils/format';
import ListItem from '../../../Templates/ListItem';
import Loan from './Loan';
import StageCompletedFinancial from './StageCompletedFinancial';
import watch from '../../../Redux/watch';

const PROCEED = 'button-financial-proceed';
const PROCEED_NODE = `${PROCEED}-node`;

const FINANCIAL_OPTION_ID = 'financial-option';
const FINANCIAL_OPTION_NODE = `${FINANCIAL_OPTION_ID}-node`;

const FINANCIAL_OPTION_SECOND_ID = 'financial-option-second';
const FINANCIAL_OPTION_SECOND_NODE = `${FINANCIAL_OPTION_SECOND_ID}-node`;

const RADIO_FINANCIAL_CASH = 'radio-financial-cash';
const RADIO_FINANCIAL_LOAN = 'radio-financial-loan';
const RADIO_FINANCIAL_LEASE = 'radio-financial-lease';

const PAYMENT_NODE = 'payment-node';

interface FinancialProps {
  readonly store: WaykeStore;
  readonly index: number;
  readonly lastStage: boolean;
}

class Financial extends HtmlNode {
  private readonly props: FinancialProps;
  private paymentType?: PaymentType;
  private paymentLookupResponse?: PaymentLookupResponse;

  constructor(element: HTMLDivElement, props: FinancialProps) {
    super(element);
    this.props = props;

    watch(this.props.store, 'navigation', () => {
      const state = this.props.store.getState();
      this.paymentType = state.paymentType;
      this.render();
    });

    const state = this.props.store.getState();
    const { paymentLookupResponse, paymentType } = state;

    this.paymentType = paymentType;
    this.paymentLookupResponse = paymentLookupResponse;
    this.render();
  }

  private onChange(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const value = currentTarget.value as PaymentType;
    this.paymentType = value;
    this.render(true);
  }

  private onProceed() {
    if (this.paymentType) {
      setFinancial(this.paymentType, this.props.lastStage)(this.props.store.dispatch);
    }
  }

  private onEdit() {
    goTo('main', this.props.index)(this.props.store.dispatch);
  }

  render(preventScrollIntoView?: boolean) {
    const state = this.props.store.getState();
    const { id, order, paymentLookupResponse } = state;
    if (!order) throw 'No order available';

    const paymentOptions = order.getPaymentOptions();

    const completed = state.topNavigation.stage > this.props.index;
    const content = ListItem(this.node, {
      completed,
      title: 'Finansiering',
      active: state.navigation.stage === this.props.index,
      id: 'financial',
    });

    const part = document.createElement('div');

    if (
      (state.navigation.stage > this.props.index ||
        (completed && state.navigation.stage !== this.props.index)) &&
      this.paymentType
    ) {
      const loan = paymentOptions.find((x) => x.type === PaymentType.Loan);
      new StageCompletedFinancial(content, {
        store: this.props.store,
        loan,
        paymentType: this.paymentType,
        paymentLookupResponse: loan?.loanDetails || paymentLookupResponse,
        onEdit: () => this.onEdit(),
      });
    } else if (state.navigation.stage === this.props.index) {
      const cash = paymentOptions.find((x) => x.type === PaymentType.Cash);
      const loan = paymentOptions.find((x) => x.type === PaymentType.Loan);
      const lease = paymentOptions.find((x) => x.type === PaymentType.Lease);

      part.innerHTML = `
        <div class="waykeecom-stack waykeecom-stack--3">
          <h4 class="waykeecom-heading waykeecom-heading--4 waykeecom-no-margin">Hur vill du finansiera din Volvo XC60?</h4>
        </div>

        ${
          cash || loan
            ? `<div class="waykeecom-stack waykeecom-stack--3" id="${FINANCIAL_OPTION_NODE}"></div>`
            : ''
        }
        ${
          lease
            ? `<div class="waykeecom-stack waykeecom-stack--3" id="${FINANCIAL_OPTION_SECOND_NODE}"></div>`
            : ''
        }

        <div class="waykeecom-stack waykeecom-stack--3" id="${PAYMENT_NODE}"></div>
        ${
          this.paymentType !== PaymentType.Loan
            ? `<div class="waykeecom-stack waykeecom-stack--3" id="${PROCEED_NODE}"></div>`
            : ''
        }
        
      `;

      content.appendChild(part);

      const contactInformation = order.getContactInformation();

      const firstGroupOptions: RadioItem[] = [];
      if (cash) {
        firstGroupOptions.push({
          id: RADIO_FINANCIAL_CASH,
          value: PaymentType.Cash,
          title: 'Kontant',
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

        firstGroupOptions.push({
          id: RADIO_FINANCIAL_LOAN,
          value: PaymentType.Loan,
          title: 'Billån',
          description: `
          <div class="waykeecom-box">
            <div class="waykeecom-stack waykeecom-stack--2">
              <ul class="waykeecom-unordered-list">
                <li class="waykeecom-unordered-list__item">Låneansökan online med Mobilt BankID <img src="${
                  Image.bankid
                }" alt="BankID logotyp" class="waykeecom-image waykeecom-image--inline" aria-hidden="true" /> – svar direkt!</li>
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
        });
      }

      if (cash || loan) {
        new InputRadioGroup(part.querySelector<HTMLDivElement>(`#${FINANCIAL_OPTION_NODE}`), {
          title: 'Köp bilen',
          checked: this.paymentType as string,
          name: 'paymentType',
          options: firstGroupOptions,
          onClick: (e) => this.onChange(e),
        });
      }

      const secondGroupOptions: RadioItem[] = [];
      if (lease) {
        secondGroupOptions.push({
          id: RADIO_FINANCIAL_LEASE,
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
        });
        new InputRadioGroup(
          part.querySelector<HTMLDivElement>(`#${FINANCIAL_OPTION_SECOND_NODE}`),
          {
            title: 'Leasa bilen',
            checked: this.paymentType as string,
            name: 'paymentType',
            options: secondGroupOptions,
            onClick: (e) => this.onChange(e),
          }
        );
      }

      const paymentNode = part.querySelector<HTMLDivElement>(`#${PAYMENT_NODE}`);
      if (paymentNode) {
        if (loan && this.paymentType === PaymentType.Loan) {
          new Loan(paymentNode, {
            store: this.props.store,
            loan,
            vehicleId: id,
            paymentLookupResponse: this.paymentLookupResponse,
            onProceed: () => this.onProceed(),
          });
        } else {
          new ButtonArrowRight(part.querySelector<HTMLDivElement>(`#${PROCEED_NODE}`), {
            title: 'Fortsätt',
            id: PROCEED,
            disabled: !this.paymentType,
            onClick: () => this.onProceed(),
          });
        }
      }
    }

    if (!preventScrollIntoView && state.navigation.stage === this.props.index) {
      content.parentElement?.scrollIntoView();
    }
  }
}

export default Financial;
