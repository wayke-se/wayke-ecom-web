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
        <div class="waykeecom-page">
          <div class="waykeecom-page__body">
            <div class="waykeecom-container waykeecom-container--narrow">
              <p>Tack för ditt köp</p>
              <p>Orderid: ${this.waykeOrderId}</p>
            </div>
          </div>
        </div>
      `;
      return;
    }
  }
}

export default OrderCallback;
