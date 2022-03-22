import { CallbackOrder } from '../../@types/CallbackOrder';
import HtmlNode from '../../Components/Extension/HtmlNode';
import { WaykeStore } from '../../Redux/store';
import { swedbankPayment } from '../../Utils/payment';

interface OrderCallbackProps {
  readonly store: WaykeStore;
  readonly callbackOrder: CallbackOrder;
}

class OrderCallback extends HtmlNode {
  private readonly props: OrderCallbackProps;

  constructor(element: HTMLElement, props: OrderCallbackProps) {
    super(element);
    this.props = props;
    this.render();
    this.init();
  }

  init() {
    const paymentAsString = sessionStorage.getItem('payment');
    if (paymentAsString) {
      const payment = JSON.parse(paymentAsString) as { payment: string; url: string };
      swedbankPayment(payment.url);
    }
    sessionStorage.removeItem('payment');
  }

  render() {
    const { store, callbackOrder } = this.props;
    const state = store.getState();

    if (!state.order) {
      this.node.innerHTML = `
        <p>Tack för ditt köp</p>
        <p>Order id: ${callbackOrder.orderId}</p>
        <p>Wayke id: ${callbackOrder.id}</p>
        <div id="payment-menu" style="padding: 24px;border: 1px solid #ececeb;"></div>
      `;
      return;
    }
  }
}

export default OrderCallback;
