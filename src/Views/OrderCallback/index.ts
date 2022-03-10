import HtmlNode from '../../Components/Extension/HtmlNode';
import { WaykeStore } from '../../Redux/store';

interface OrderCallbackProps {
  store: WaykeStore;
  waykeOrderId: string;
}

class OrderCallback extends HtmlNode {
  private props: OrderCallbackProps;

  constructor(element: HTMLElement, props: OrderCallbackProps) {
    super(element);
    this.props = props;
    this.render();
  }

  render() {
    const state = this.props.store.getState();

    if (!state.order) {
      this.node.innerHTML = `
        <p>Tack för ditt köp</p>
        <p>Orderid: ${this.props.waykeOrderId}</p>
      `;
      return;
    }
  }
}

export default OrderCallback;
