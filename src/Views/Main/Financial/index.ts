import { PaymentType } from '@wayke-se/ecom';
import ButtonArrowRight from '../../../Components/Button/ButtonArrowRight';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import InputRadioGroup, { RadioItem } from '../../../Components/Input/InputRadioGroup';
import { goTo, setFinancial } from '../../../Redux/action';
import { WaykeStore } from '../../../Redux/store';
import { Image } from '../../../Utils/constants';
import { formatShortDescription, prettyNumber } from '../../../Utils/format';
import ListItem from '../../../Templates/ListItem';
import Loan from './Loan';
import StageCompletedFinancial from './StageCompletedFinancial';
import watch from '../../../Redux/watch';
import ecomEvent, { EcomStep, EcomEvent, EcomView } from '../../../Utils/ecomEvent';

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

  constructor(element: HTMLDivElement, props: FinancialProps) {
    super(element);
    this.props = props;

    watch(this.props.store, 'navigation', () => {
      const state = this.props.store.getState();
      this.paymentType = state.paymentType;
      this.render();
    });

    const state = this.props.store.getState();
    const { paymentType } = state;

    this.paymentType = paymentType;
    this.render();
  }

  private onChange(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const value = currentTarget.value as PaymentType;
    this.paymentType = value;
    this.render(true);
    switch (this.paymentType) {
      case PaymentType.Cash:
        ecomEvent(EcomView.MAIN, EcomEvent.FINANCIAL_CASH_SELECTED, EcomStep.FINANCIAL);
        break;
      case PaymentType.Lease:
        ecomEvent(EcomView.MAIN, EcomEvent.FINANCIAL_LEASE_SELECTED, EcomStep.FINANCIAL);
      case PaymentType.Loan:
        ecomEvent(EcomView.MAIN, EcomEvent.FINANCIAL_LOAN_SELECTED, EcomStep.FINANCIAL);
      default:
        break;
    }
  }

  private onProceed() {
    if (this.paymentType) {
      switch (this.paymentType) {
        case PaymentType.Cash:
          ecomEvent(EcomView.MAIN, EcomEvent.FINANCIAL_CASH_SET, EcomStep.FINANCIAL);
          break;
        case PaymentType.Lease:
          ecomEvent(EcomView.MAIN, EcomEvent.FINANCIAL_LEASE_SET, EcomStep.FINANCIAL);
        case PaymentType.Loan:
          ecomEvent(EcomView.MAIN, EcomEvent.FINANCIAL_LOAN_SET, EcomStep.FINANCIAL);
        default:
          break;
      }
      setFinancial(this.paymentType, this.props.lastStage)(this.props.store.dispatch);
    }
  }

  private onEdit() {
    ecomEvent(EcomView.MAIN, EcomEvent.FINANCIAL_EDIT, EcomStep.FINANCIAL);
    goTo('main', this.props.index)(this.props.store.dispatch);
  }

  render(preventScrollIntoView?: boolean) {
    const state = this.props.store.getState();
    const { id, order, paymentLookupResponse } = state;
    if (!order) throw 'No order available';

    const paymentOptions = order.paymentOptions;

    const completed = state.topNavigation.stage > this.props.index;
    const content = ListItem(this.node, {
      completed,
      title: 'Ägandeform',
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
        paymentLookupResponse: paymentLookupResponse || loan?.loanDetails,
        onEdit: !state.createdOrderId ? () => this.onEdit() : undefined,
      });
    } else if (state.navigation.stage === this.props.index) {
      const vehicle = state.order?.orderVehicle;
      const cash = paymentOptions.find((x) => x.type === PaymentType.Cash);
      const loan = paymentOptions.find((x) => x.type === PaymentType.Loan);
      const lease = paymentOptions.find((x) => x.type === PaymentType.Lease);

      part.innerHTML = `
        <div class="waykeecom-stack waykeecom-stack--3">
          <h4 class="waykeecom-heading waykeecom-heading--4 waykeecom-no-margin">Hur vill du finansiera din ${
            vehicle?.title
          } ${formatShortDescription(vehicle)}?</h4>
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

      const contactInformation = order.contactInformation;

      const firstGroupOptions: RadioItem[] = [];
      if (cash) {
        firstGroupOptions.push({
          id: RADIO_FINANCIAL_CASH,
          value: PaymentType.Cash,
          title: 'Kontant',
          description: `
            <div class="waykeecom-box">
              <div class="waykeecom-content waykeecom-content--inherit-size">
                <ul class="waykeecom-content__ul">
                  <li class="waykeecom-content__li">Betalning sker hos ${contactInformation?.name} vid 
                  kontraktskrivning.</li>
                  <li class="waykeecom-content__li">Inga kostnader tillkommer.</li>
                </ul>
              </div>
            </div>`,
          meta: `<div class="waykeecom-text waykeecom-text--font-bold">${prettyNumber(cash.price, {
            postfix: cash.unit,
          })}</div>`,
        });
      }

      if (loan) {
        const loanPrice = loan.price;
        const duration = loan.loanDetails?.durationSpec.default;
        const interest = loan.loanDetails?.interests.interest || NaN;
        const getCreditAmount = loan.loanDetails?.creditAmount || NaN;
        const shouldUseCreditScoring = loan.loanDetails?.shouldUseCreditScoring;

        firstGroupOptions.push({
          id: RADIO_FINANCIAL_LOAN,
          value: PaymentType.Loan,
          title: 'Billån',
          description: `
          <div class="waykeecom-box">
            <div class="waykeecom-stack waykeecom-stack--2">
              <div class="waykeecom-content waykeecom-content--inherit-size">
                <ul class="waykeecom-content__ul">
                ${
                  shouldUseCreditScoring
                    ? `
                  <li class="waykeecom-content__li">
                    <div>
                      <span class="waykeecom-text waykeecom-text--valign-middle">Låneansökan online med BankID </span>
                      <img src="${Image.bankid}" alt="BankID logotyp" class="waykeecom-image waykeecom-image--inline" aria-hidden="true" />
                      <span class="waykeecom-text waykeecom-text--valign-middle"> – svar direkt!</span>
                    </div>
                  </li>
                  `
                    : ''
                }
                  <li class="waykeecom-content__li">Betalning sker hos ${
                    contactInformation?.name
                  } vid 
                  kontraktskrivning.</li>
                  <li class="waykeecom-content__li">Beräknat på ${prettyNumber(getCreditAmount, {
                    postfix: 'kr',
                  })}, ${duration} mån, ${prettyNumber(interest * 100, {
            decimals: 2,
          })}% ränta.</li>
                </ul>
              </div>
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
          meta: `<div class="waykeecom-text waykeecom-text--font-bold">${prettyNumber(loanPrice, {
            postfix: loan.unit,
          })}</div>`,
        });
      }

      if (cash || loan) {
        new InputRadioGroup(part.querySelector<HTMLDivElement>(`#${FINANCIAL_OPTION_NODE}`), {
          title: 'Köp bilen',
          checked: this.paymentType as string,
          name: 'paymentType',
          information: `
            <div class="waykeecom-content waykeecom-content--inherit-size">
              <p class="waykeecom-content__p">Du köper bilen och äger den själv, antingen genom att betala hela bilen med egna medel eller genom ett billån. Du ansvarar själv för försäljningen av bilen och väljer såklart helt fritt när den ska äga rum.</p>
            </div>
          `,
          options: firstGroupOptions,
          onClick: (e) => this.onChange(e),
          onClickInformation: () => {
            ecomEvent(EcomView.MAIN, EcomEvent.FINANCIAL_INFORMATION_TOGGLE, EcomStep.FINANCIAL);
          },
        });
      }

      const secondGroupOptions: RadioItem[] = [];
      if (lease) {
        secondGroupOptions.push({
          id: RADIO_FINANCIAL_LEASE,
          title: 'Privatleasing',
          value: PaymentType.Lease,
          /*
          description: `
            <div class="waykeecom-box">
              <div class="waykeecom-content waykeecom-content--inherit-size">
                <ul class="waykeecom-content__ul">
                  <li class="waykeecom-content__li">Inkl. 1 500 mil/år, 36 mån.</li>
                </ul>
              </div>
            </div>`,
          */
          meta: `<div class="waykeecom-text waykeecom-text--font-bold">Från ${prettyNumber(
            lease?.price,
            {
              postfix: lease.unit,
            }
          )}</div>`,
        });
        new InputRadioGroup(
          part.querySelector<HTMLDivElement>(`#${FINANCIAL_OPTION_SECOND_NODE}`),
          {
            title: 'Leasa bilen',
            checked: this.paymentType as string,
            name: 'paymentType',
            information: `
              <div class="waykeecom-content waykeecom-content--inherit-size">
                <p class="waykeecom-content__p">Du står inte som ägare på bilen utan betalar en avtalad månadsavgift där det mesta ingår. När avtalstiden går ut är det bara att lämna tillbaka bilen till bilhandlaren.</p>
              </div>
            `,
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
            paymentLookupResponse,
            onProceed: () => this.onProceed(),
          });
        } else {
          new ButtonArrowRight(part.querySelector<HTMLDivElement>(`#${PROCEED_NODE}`), {
            title: 'Gå vidare',
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
