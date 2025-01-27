import { PaymentType } from '@wayke-se/ecom';
import i18next from 'i18next';
import { MarketCode } from '../../../@types/MarketCode';
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
  readonly marketCode: MarketCode;
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
      const loans = paymentOptions.filter((x) => {
        switch (this.props.marketCode) {
          case 'NO':
            return x.type === PaymentType.Loan && !x.loanDetails?.shouldUseCreditScoring;
          default:
            return x.type === PaymentType.Loan;
        }
      });
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
          </div>`,
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
