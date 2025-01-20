import { PaymentType } from '@wayke-se/ecom';
import i18next from 'i18next';
import ButtonArrowRight from '../../../Components/Button/ButtonArrowRight';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import InputRadioGroup, { RadioItem } from '../../../Components/Input/InputRadioGroup';
import { goTo, resetPaymentLookupResponse, setFinancial } from '../../../Redux/action';
import { WaykeStore } from '../../../Redux/store';
import watch from '../../../Redux/watch';
import ListItem from '../../../Templates/ListItem';
import { Image } from '../../../Utils/constants';
import ecomEvent, { EcomStep, EcomEvent, EcomView } from '../../../Utils/ecomEvent';
import { formatShortDescription, prettyNumber } from '../../../Utils/format';
import Loan from './Loan';
import StageCompletedFinancial from './StageCompletedFinancial';
import { extractLoanIndex, extractPaymentType } from './utils';

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
    resetPaymentLookupResponse()(this.props.store.dispatch);
    const currentTarget = e.currentTarget as HTMLInputElement;
    const value = currentTarget.value as PaymentType;
    this.paymentType = value;

    this.render(true);
    const _paymentType = extractPaymentType(this.paymentType);

    switch (_paymentType) {
      case PaymentType.Cash:
        ecomEvent(EcomView.MAIN, EcomEvent.FINANCIAL_CASH_SELECTED, EcomStep.FINANCIAL);
        break;
      case PaymentType.Lease:
        ecomEvent(EcomView.MAIN, EcomEvent.FINANCIAL_LEASE_SELECTED, EcomStep.FINANCIAL);
        break;
      case PaymentType.Loan:
        ecomEvent(EcomView.MAIN, EcomEvent.FINANCIAL_LOAN_SELECTED, EcomStep.FINANCIAL);
      default:
        break;
    }
  }

  private onProceed() {
    const _paymentType = extractPaymentType(this.paymentType);
    if (this.paymentType && _paymentType) {
      switch (_paymentType) {
        case PaymentType.Cash:
          ecomEvent(EcomView.MAIN, EcomEvent.FINANCIAL_CASH_SET, EcomStep.FINANCIAL);
          break;
        case PaymentType.Lease:
          ecomEvent(EcomView.MAIN, EcomEvent.FINANCIAL_LEASE_SET, EcomStep.FINANCIAL);
          break;
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
      title: i18next.t('financial.heading'),
      active: state.navigation.stage === this.props.index,
      id: 'financial',
    });

    const part = document.createElement('div');

    const _paymentType = extractPaymentType(this.paymentType);
    if (
      (state.navigation.stage > this.props.index ||
        (completed && state.navigation.stage !== this.props.index)) &&
      _paymentType
    ) {
      const loan = paymentOptions.find((x) => x.type === PaymentType.Loan);
      new StageCompletedFinancial(content, {
        store: this.props.store,
        loan,
        paymentType: _paymentType,
        paymentLookupResponse: paymentLookupResponse || loan?.loanDetails,
        onEdit: !state.createdOrderId ? () => this.onEdit() : undefined,
      });
    } else if (state.navigation.stage === this.props.index) {
      const vehicle = state.order?.orderVehicle;
      const cash = paymentOptions.find((x) => x.type === PaymentType.Cash);
      const loans = paymentOptions.filter((x) => x.type === PaymentType.Loan);
      const lease = paymentOptions.find((x) => x.type === PaymentType.Lease);

      part.innerHTML = `
        <div class="waykeecom-stack waykeecom-stack--3">
          <h4 class="waykeecom-heading waykeecom-heading--4 waykeecom-no-margin">${i18next.t('financial.howToFinance', { vehicleTitle: vehicle?.title, vehicleDescription: formatShortDescription(vehicle) })}</h4>
        </div>

        ${
          cash || !!loans.length
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
          _paymentType !== PaymentType.Loan
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
          title: i18next.t('financial.cash'),
          description: `
            <div class="waykeecom-box">
              <div class="waykeecom-content waykeecom-content--inherit-size">
                <ul class="waykeecom-content__ul">
                  <li class="waykeecom-content__li">${i18next.t('financial.cashDescription', { contactName: contactInformation?.name })}</li>
                </ul>
              </div>
            </div>`,
          meta: `<div class="waykeecom-text waykeecom-text--font-bold">${prettyNumber(cash.price, {
            postfix: cash.unit,
          })}</div>`,
        });
      }

      loans.forEach((loan, index) => {
        const loanPrice = loan.price;
        const duration = loan.loanDetails?.durationSpec.default;
        const interest = loan.loanDetails?.interests.interest || NaN;
        const getCreditAmount = loan.loanDetails?.creditAmount || NaN;
        const shouldUseCreditScoring = loan.loanDetails?.shouldUseCreditScoring;

        firstGroupOptions.push({
          id: `${RADIO_FINANCIAL_LOAN}-${index}`,
          value: `${PaymentType.Loan}-${index}`,
          title: loan.name,
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
                      <span class="waykeecom-text waykeecom-text--valign-middle">${i18next.t('financial.loanApplicationOnline')} </span>
                      <img src="${Image.bankid}" alt="BankID logotyp" class="waykeecom-image waykeecom-image--inline" aria-hidden="true" />
                      <span class="waykeecom-text waykeecom-text--valign-middle">${i18next.t('financial.loanApplicationResponse')}</span>
                    </div>
                  </li>
                  `
                    : ''
                }
                  <li class="waykeecom-content__li">${i18next.t('financial.paymentAtContract', { contactName: contactInformation?.name })}</li>
                  <li class="waykeecom-content__li">${i18next.t('financial.calculatedOn', { creditAmount: prettyNumber(getCreditAmount, { postfix: 'kr' }), duration, interest: prettyNumber(interest * 100, { decimals: 2 }) })}</li>
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
          </div>
          `,
          meta: `<div class="waykeecom-text waykeecom-text--font-bold">${prettyNumber(loanPrice, {
            postfix: loan.unit,
          })}</div>`,
        });
      });

      if (cash || !!loans.length) {
        new InputRadioGroup(part.querySelector<HTMLDivElement>(`#${FINANCIAL_OPTION_NODE}`), {
          title: i18next.t('financial.buyCar'),
          checked: this.paymentType as string,
          name: 'paymentType',
          information: `
            <div class="waykeecom-content waykeecom-content--inherit-size">
              <p class="waykeecom-content__p">${i18next.t('financial.buyCarDescription')}</p>
            </div>
          `,
          footer: `
            <div class="waykeecom-box">
              <div class="waykeecom-creditor-disclaimer">
                <div class="waykeecom-creditor-disclaimer__icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="59"
                    height="53"
                    viewBox="0 0 59 53"
                    fill="none"
                  >
                    <title>Varning</title>
                    <path
                      d="M29.5255 20.3569V30.5712M29.5255 40.7855H29.551M54.3173 43.3391L33.9335 7.58906C33.4891 6.80308 32.8445 6.14932 32.0657 5.69448C31.2868 5.23964 30.4015 5 29.5001 5C28.5986 5 27.7133 5.23964 26.9344 5.69448C26.1556 6.14932 25.5111 6.80308 25.0666 7.58906L4.68285 43.3391C4.23359 44.1188 3.99802 45.0038 4.00001 45.9042C4.002 46.8046 4.24148 47.6884 4.69417 48.4662C5.14687 49.244 5.79668 49.8879 6.57776 50.3329C7.35883 50.7778 8.2434 51.0079 9.14179 50.9998H49.9093C50.8034 50.9989 51.6815 50.7622 52.4554 50.3136C53.2294 49.865 53.8719 49.2202 54.3186 48.444C54.7652 47.6677 55.0002 46.7874 55 45.8913C54.9998 44.9953 54.7643 44.1151 54.3173 43.3391Z"
                      stroke="#A43333"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <div class="waykeecom-creditor-disclaimer__body">
                  <div class="waykeecom-creditor-disclaimer__heading">Att låna kostar pengar!</div>
                  <p>
                    Om du inte kan betala tillbaka skulden i tid riskerar du en betalningsanmärkning. Det kan
                    leda till svårigheter att få hyra bostad, teckna abonnemang och få nya lån. För stöd, vänd
                    dig till budget- och skuldrådgivningen i din kommun. Kontaktuppgifter finns på 
                    <a
                      href="https://www.konsumentverket.se/"
                      title="Konsumentverket"
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      class="waykeecom-link waykeecom-link--no-external-icon"
                    >
                      konsumentverket.se
                    </a>.
                  </p>
                </div>
              </div>
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
          title: i18next.t('financial.privateLeasing'),
          value: PaymentType.Lease,
          meta: `<div class="waykeecom-text waykeecom-text--font-bold">${i18next.t('financial.from')} ${prettyNumber(
            lease?.price,
            {
              postfix: lease.unit,
            }
          )}</div>`,
        });
        new InputRadioGroup(
          part.querySelector<HTMLDivElement>(`#${FINANCIAL_OPTION_SECOND_NODE}`),
          {
            title: i18next.t('financial.leaseCar'),
            checked: this.paymentType as string,
            name: 'paymentType',
            information: `
              <div class="waykeecom-content waykeecom-content--inherit-size">
                <p class="waykeecom-content__p">${i18next.t('financial.leaseCarDescription')}</p>
              </div>
            `,
            options: secondGroupOptions,
            onClick: (e) => this.onChange(e),
          }
        );
      }

      const paymentNode = part.querySelector<HTMLDivElement>(`#${PAYMENT_NODE}`);
      if (paymentNode) {
        const _paymentType = extractPaymentType(this.paymentType);
        const loanIndex = extractLoanIndex(this.paymentType);

        if (loans.length && _paymentType === PaymentType.Loan && loanIndex !== undefined) {
          new Loan(paymentNode, {
            store: this.props.store,
            loan: JSON.parse(JSON.stringify(loans[loanIndex])),
            vehicleId: id,
            paymentLookupResponse,
            onProceed: () => this.onProceed(),
          });
        } else {
          new ButtonArrowRight(part.querySelector<HTMLDivElement>(`#${PROCEED_NODE}`), {
            title: i18next.t('financial.proceed'),
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
