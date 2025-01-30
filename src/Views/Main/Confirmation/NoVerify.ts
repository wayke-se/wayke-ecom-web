import i18next from '@i18n';
import { title } from 'process';
import Button from '../../../Components/Button/Button';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import InputCheckbox from '../../../Components/Input/InputCheckbox';
import { createOrder } from '../../../Data/createOrder';
import { setCreatedOrderId } from '../../../Redux/action';
import { WaykeStore } from '../../../Redux/store';
import ecomEvent, { EcomEvent, EcomStep, EcomView } from '../../../Utils/ecomEvent';
import { destroyPortal } from '../../../Utils/portal';

const ACCEPT_CONDITIONS = 'confirm-conditions';
const ACCEPT_CONDITIONS_NODE = `${ACCEPT_CONDITIONS}-node`;

const CONFIRM_BUTTON_NODE = `confirm-button-node`;
const CONFIRM_BUTTON = `confirm-button`;

interface NoVerifyProps {
  store: WaykeStore;
}

class NoVerify extends HtmlNode {
  private props: NoVerifyProps;
  private requestError = false;
  private notAvailable = false;
  private view: number = 1;
  private contexts: {
    acceptConditions?: InputCheckbox;
    confirmButton?: Button;
  } = {};
  private acceptConditions: boolean = false;

  constructor(element: HTMLElement | null, props: NoVerifyProps) {
    super(element, { htmlTag: 'div', className: 'waykeecom-stack waykeecom-stack--2' });
    this.props = props;

    this.render();
  }

  private async onCreateOrder() {
    const { store } = this.props;
    this.notAvailable = false;
    this.requestError = false;

    try {
      ecomEvent(
        EcomView.MAIN,
        EcomEvent.CONFIRMATION_CREATE_ORDER_REQUESTED,
        EcomStep.CONFIRMATION
      );

      const { order } = store.getState();
      const response = await createOrder(store);
      ecomEvent(
        EcomView.MAIN,
        EcomEvent.CONFIRMATION_CREATE_ORDER_SUCCEEDED,
        EcomStep.CONFIRMATION
      );

      const paymentRequired = order?.isPaymentRequired;
      if (paymentRequired) {
        destroyPortal();
      }

      const payment = response.getPayment();

      setCreatedOrderId(response.getOrderNumber(), payment)(store.dispatch);
    } catch (ee) {
      const e = ee as { message?: string };
      this.view = 1;
      ecomEvent(EcomView.MAIN, EcomEvent.CONFIRMATION_CREATE_ORDER_FAILED, EcomStep.CONFIRMATION);
      if (e.message === 'The vehicle is not available for purchase') {
        this.requestError = false;
        this.notAvailable = true;
      } else {
        this.notAvailable = false;
        this.requestError = true;
      }
      destroyPortal();

      this.render();
    }
  }

  private onCheckbox(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    this.acceptConditions = currentTarget.checked;
    this.contexts.acceptConditions?.checked(this.acceptConditions);
    this.render();
  }

  render() {
    const { order, insurance } = this.props.store.getState();

    this.node.innerHTML = `
      <div class="confirmation">
        <h4 class="waykeecom-heading waykeecom-heading--4">${i18next.t('confirmation.heading')}</h4>
        <p class="waykeecom-content__p">${i18next.t('confirmation.description2', { name })}</p>
        <div class="waykeecom-stack waykeecom-stack--2" id="${ACCEPT_CONDITIONS_NODE}"></div>
        <div class="waykeecom-stack waykeecom-stack--2" id="${CONFIRM_BUTTON_NODE}"></div>
      </div>
    `;

    const conditionsPdfUri = order?.conditionsPdfUri;

    this.contexts.acceptConditions = new InputCheckbox(
      this.node.querySelector<HTMLDivElement>(`#${ACCEPT_CONDITIONS_NODE}`),
      {
        checked: this.acceptConditions,
        id: ACCEPT_CONDITIONS,
        disabled: this.notAvailable,
        name: 'acceptConditions',

        title: `<div>${i18next.t('confirmation.confirmConditionsTitle', { conditionsPdfUri, link: `<a href="${conditionsPdfUri}" title="${i18next.t('confirmation.purchaseTermsAndCancellationPolicy')}" target="_blank" rel="noopener noreferrer" class="waykeecom-link">${i18next.t('confirmation.purchaseTermsAndCancellationPolicy')}</a>`, interpolation: { escapeValue: false } })}${
          insurance
            ? ` <span class="waykeecom-text waykeecom-text--margin-left">${i18next.t('confirmation.insuranceText')}</span>`
            : ''
        }.</div>`,
        value: 'acceptConditions',
        onClick: (e) => this.onCheckbox(e),
      }
    );

    this.contexts.confirmButton = new Button(
      this.node.querySelector<HTMLDivElement>(`#${CONFIRM_BUTTON_NODE}`),
      {
        title: i18next.t('confirmation.title'),
        id: CONFIRM_BUTTON,
        disabled: !this.acceptConditions,
        onClick: () => this.onCreateOrder(),
      }
    );
  }
}

export default NoVerify;
