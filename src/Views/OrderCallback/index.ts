import HtmlNode from '../../Components/Extension/HtmlNode';
import { WaykeStore } from '../../Redux/store';

interface OrderCallbackProps {
  readonly store: WaykeStore;
  readonly waykeOrderId: string;
}

class OrderCallback extends HtmlNode {
  private readonly props: OrderCallbackProps;

  constructor(element: HTMLElement, props: OrderCallbackProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    const { store, waykeOrderId } = this.props;
    const state = store.getState();

    if (!state.order) {
      this.node.innerHTML = `
        <p>Tack för ditt köp</p>
        <p>Orderid: ${waykeOrderId}</p>
      `;
      return;
    }
  }
}

export default OrderCallback;
