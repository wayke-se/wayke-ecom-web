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
import { scrollTop } from '../../Utils/scroll';

const SUMMARY_NODE = 'summary-node';

interface SummaryProps {
  onClose: () => void;
}

class Summary extends HtmlNode {
  private props: SummaryProps;

  constructor(element: HTMLElement, props: SummaryProps) {
    super(element);
    this.props = props;
    const w = watch(store.getState, 'navigation.view');
    store.subscribe(
      w((view) => {
        if (view === 3) {
          this.render();
          scrollTop();
        }
      })
    );

    const w1 = watch(store.getState, 'createdOrderId');
    store.subscribe(w1(() => this.render()));

    this.render();
    scrollTop();
  }

  render() {
    const state = store.getState();
    const createdOrderId = state.createdOrderId;

    this.node.innerHTML = `
      <div class="waykeecom-page">
        <div class="waykeecom-page__body">
          <div id="${SUMMARY_NODE}" class="waykeecom-container waykeecom-container--narrow"></div>
        </div>
      </div>
    `;

    const content = this.node.querySelector<HTMLDivElement>(`#${SUMMARY_NODE}`);
    if (content) {
      new Intro(content, { createdOrderId });
      new TradeIn(content, { createdOrderId });
      new Order(content, { createdOrderId });
      new Delivery(content, { createdOrderId });
      new Customer(content, { createdOrderId });
      new ExecuteOrder(content, { createdOrderId, onClose: this.props.onClose });
      if (!createdOrderId) {
        new Disclaimer(content);
      }
    }
  }
}

export default Summary;
