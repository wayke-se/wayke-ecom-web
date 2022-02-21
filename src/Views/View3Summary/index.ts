import watch from 'redux-watch';

import store from '../../Redux/store';
import TradeIn from './TradeIn';
import Summary from './Summary';
import Order from './Order';
import Delivery from './Delivery';
import Customer from './Customer';
import Disclaimer from './Disclaimer';
import ExecuteOrder from './ExecuteOrder';

const summaryNode = 'summary-node';

class View3Summary {
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
          <div id="${summaryNode}" class="waykeecom-container waykeecom-container--narrow">
          </div>
        </div>
      </div>
    `;

    const summary = this.element.querySelector<HTMLDivElement>(`#${summaryNode}`);
    if (summary) {
      new Summary(summary);
      new TradeIn(summary);
      new Order(summary);
      new Delivery(summary);
      new Customer(summary);
      new ExecuteOrder(summary);
      new Disclaimer(summary);
    }
  }
}

export default View3Summary;
