import { CallbackOrder } from '../../@types/CallbackOrder';
import { PaymentOrderResponse } from '../../@types/PaymentOrderResponse';
import HtmlNode from '../../Components/Extension/HtmlNode';
import { WaykeStore } from '../../Redux/store';
// import Loader from '../../Templates/Loader';
// import Summary from '../Summary';
interface OrderCallbackProps {
  readonly store: WaykeStore;
  readonly callbackOrder: CallbackOrder;
  readonly onClose: () => void;
}

class OrderCallback extends HtmlNode {
  private readonly props: OrderCallbackProps;
  private order?: PaymentOrderResponse;
  private orderFetchFailed: boolean = false;

  constructor(element: HTMLElement, props: OrderCallbackProps) {
    super(element);
    this.props = props;
    sessionStorage.removeItem('wayke-ecom-state');
    this.render();
    // this.loadOrder();
  }

  async loadOrder() {
    this.orderFetchFailed = false;
    this.render();
    try {
      const response = await fetch(this.props.callbackOrder.orderUrl);
      this.order = (await response.json()) as PaymentOrderResponse;
    } catch (e) {
      this.orderFetchFailed = true;
    } finally {
      this.render();
    }
  }

  render() {
    const { callbackOrder } = this.props;

    /*
    if (this.order) {
      new Summary(this.node, { store: this.props.store, onClose: this.props.onClose });
      return;
    }
    */

    this.node.innerHTML = `
        <div class="waykeecom-content">
          <p class="waykeecom-content__p">Tack för ditt köp</p>
          <p class="waykeecom-content__p">Order id: ${callbackOrder.orderUrl}</p>
          <p class="waykeecom-content__p">Wayke id: ${callbackOrder.id}</p>
        </div>
      `;
  }
}

export default OrderCallback;
