import { WaykeStore } from '../../Redux/store';
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
  store: WaykeStore;
  onClose: () => void;
}

class Summary extends HtmlNode {
  private props: SummaryProps;

  constructor(element: HTMLElement, props: SummaryProps) {
    super(element);
    this.props = props;

    watch<number>(this.props.store, 'navigation.view', (view) => {
      if (view === 3) {
        this.render();
        scrollTop();
      }
    });

    watch(this.props.store, 'createdOrderId', () => {
      this.render();
    });

    this.render();
    scrollTop();
  }

  render() {
    const state = this.props.store.getState();
    const createdOrderId = state.createdOrderId;

    this.node.innerHTML = `
      <div id="${SUMMARY_NODE}"></div>
    `;

    const content = this.node.querySelector<HTMLDivElement>(`#${SUMMARY_NODE}`);
    if (content) {
      new Intro(content, { store: this.props.store, createdOrderId });
      new TradeIn(content, { store: this.props.store, createdOrderId });
      new Order(content, { store: this.props.store, createdOrderId });
      new Delivery(content, { store: this.props.store, createdOrderId });
      new Customer(content, { store: this.props.store, createdOrderId });
      new ExecuteOrder(content, {
        store: this.props.store,
        createdOrderId,
        onClose: this.props.onClose,
      });
      if (!createdOrderId) {
        new Disclaimer(content, { store: this.props.store });
      }
    }
  }
}

export default Summary;
