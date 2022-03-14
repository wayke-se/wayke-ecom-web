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
import CentralStorage from './CentralStorage';

const SUMMARY_NODE = 'summary-node';

interface SummaryProps {
  readonly store: WaykeStore;
  readonly onClose: () => void;
}

class Summary extends HtmlNode {
  private readonly props: SummaryProps;

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
    const { store, onClose } = this.props;
    const state = store.getState();
    const createdOrderId = state.createdOrderId;

    this.node.innerHTML = `
      <div id="${SUMMARY_NODE}"></div>
    `;

    const content = this.node.querySelector<HTMLDivElement>(`#${SUMMARY_NODE}`);
    if (content) {
      new Intro(content, { store, createdOrderId });
      new TradeIn(content, { store, createdOrderId });
      new Order(content, { store, createdOrderId });
      new CentralStorage(content, { store, createdOrderId });
      new Delivery(content, { store, createdOrderId });
      new Customer(content, { store, createdOrderId });
      new ExecuteOrder(content, {
        store,
        createdOrderId,
        onClose,
      });
      if (!createdOrderId) {
        new Disclaimer(content, { store });
      }
    }
  }
}

export default Summary;
