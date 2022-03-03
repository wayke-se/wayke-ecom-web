import watch from 'redux-watch';

import store from '../../Redux/store';
import TradeIn from './TradeIn';
import Intro from './Intro';
import Order from './Order';
import Delivery from './Delivery';
import Customer from './Customer';
import Disclaimer from './Disclaimer';
import ExecuteOrder from './ExecuteOrder';
import HtmlNode from '../../Components/Extension/HtmlNode';

const SUMMARY_NODE = 'summary-node';

class Summary extends HtmlNode {
  constructor(element: HTMLElement) {
    super(element);
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
    this.node.innerHTML = `
      <div class="waykeecom-page">
        <div class="waykeecom-page__body">
          <div id="${SUMMARY_NODE}" class="waykeecom-container waykeecom-container--narrow"></div>
        </div>
      </div>
    `;

    const content = this.node.querySelector<HTMLDivElement>(`#${SUMMARY_NODE}`);
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
