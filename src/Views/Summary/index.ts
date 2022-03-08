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
import watch from '../../Redux/watch';

const SUMMARY_NODE = 'summary-node';

interface SummaryProps {
  onClose: () => void;
}

class Summary extends HtmlNode {
  private props: SummaryProps;

  constructor(element: HTMLElement, props: SummaryProps) {
    super(element);
    this.props = props;

    watch<number>('navigation.view', (view) => {
      if (view === 3) {
        this.render();
        scrollTop();
      }
    });

    watch('createdOrderId', () => {
      this.render();
    });

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
