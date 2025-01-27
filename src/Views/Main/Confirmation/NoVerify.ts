import i18next from 'i18next';
import { title } from 'process';
import Button from '../../../Components/Button/Button';
import HtmlNode from '../../../Components/Extension/HtmlNode';
import { createOrder } from '../../../Data/createOrder';
import { setCreatedOrderId } from '../../../Redux/action';
import { WaykeStore } from '../../../Redux/store';
import ecomEvent, { EcomEvent, EcomStep, EcomView } from '../../../Utils/ecomEvent';
import { destroyPortal } from '../../../Utils/portal';

interface NoVerifyProps {
  store: WaykeStore;
}

class NoVerify extends HtmlNode {
  private props: NoVerifyProps;
  private requestError = false;
  private notAvailable = false;
  private view: number = 1;

  constructor(element: HTMLElement | null, props: NoVerifyProps) {
    super(element);
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

  render() {
    this.node.innerHTML = `
      <div class="confirmation">
        <p>${i18next.t('confirmation.noVerifyConfirmMessage')}</p>
        <div id="confirm-button"></div>
      </div>
    `;

    new Button(this.node.querySelector<HTMLDivElement>('#confirm-button'), {
      title: i18next.t('confirmation.title'),
      onClick: () => this.onCreateOrder(),
    });
  }
}

export default NoVerify;
