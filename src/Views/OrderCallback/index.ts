import { CallbackOrder } from '../../@types/CallbackOrder';
import HtmlNode from '../../Components/Extension/HtmlNode';
import { WaykeStore } from '../../Redux/store';

interface OrderCallbackProps {
  readonly store: WaykeStore;
  readonly callbackOrder: CallbackOrder;
}

class OrderCallback extends HtmlNode {
  private readonly props: OrderCallbackProps;

  constructor(element: HTMLElement, props: OrderCallbackProps) {
    super(element);
    this.props = props;
    sessionStorage.removeItem('wayke-ecom-state');
    this.render();
  }

  render() {
    const { store, callbackOrder } = this.props;
    const state = store.getState();

    if (!state.order) {
      this.node.innerHTML = `
        <div class="waykeecom-content">
          <p class="waykeecom-content__p">Tack för ditt köp</p>
          <p class="waykeecom-content__p">Order id: ${callbackOrder.orderId}</p>
          <p class="waykeecom-content__p">Wayke id: ${callbackOrder.id}</p>
      </div>
      `;
      return;
    }
  }
}

export default OrderCallback;
