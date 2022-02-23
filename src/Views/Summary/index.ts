import watch from 'redux-watch';

import store from '../../Redux/store';
import TradeIn from './TradeIn';
import Intro from './Intro';
import Order from './Order';
import Delivery from './Delivery';
import Customer from './Customer';
import Disclaimer from './Disclaimer';
import ExecuteOrder from './ExecuteOrder';

const SUMMARY_NODE = 'summary-node';

class Summary {
  private element: Element;

  constructor(element: Element) {
    this.element = element;
    const w = watch(store.getState, 'navigation.view');
    store.subscribe(
      w((view) => {
        if (view === 3) {
          this.render();
        }
      })
    );
    this.render();
  }

  render() {
    this.element.innerHTML = `
      <div class="waykeecom-page">
        <div class="waykeecom-page__body">
          <div id="${SUMMARY_NODE}" class="waykeecom-container waykeecom-container--narrow">
          </div>
        </div>
      </div>
    `;

    const content = this.element.querySelector<HTMLDivElement>(`#${SUMMARY_NODE}`);
    if (content) {
      new Intro(content);
      new TradeIn(content);
      new Order(content);
      new Delivery(content);
      new Customer(content);
      new ExecuteOrder(content);
      new Disclaimer(content);
    }
  }
}

export default Summary;
