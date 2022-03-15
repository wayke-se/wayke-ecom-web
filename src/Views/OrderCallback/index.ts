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
    this.render();
  }

  render() {
    const { store, callbackOrder } = this.props;
    const state = store.getState();

    if (!state.order) {
      this.node.innerHTML = `
        <p>Tack för ditt köp</p>
        <p>Order id: ${callbackOrder.orderId}</p>
        <p>Wayke id: ${callbackOrder.id}</p>
      `;
      return;
    }
  }
}

export default OrderCallback;
