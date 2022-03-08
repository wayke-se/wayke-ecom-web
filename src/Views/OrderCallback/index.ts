import store from '../../Redux/store';

class OrderCallback {
  private element: Element;
  private waykeOrderId: string;

  constructor(element: Element, waykeOrderId: string) {
    this.element = element;
    this.waykeOrderId = waykeOrderId;
    this.render();
  }

  render() {
    const state = store.getState();

    if (!state.order) {
      this.element.innerHTML = `
        <p>Tack för ditt köp</p>
        <p>Orderid: ${this.waykeOrderId}</p>
      `;
      return;
    }
  }
}

export default OrderCallback;
