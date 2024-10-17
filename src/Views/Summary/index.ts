import HtmlNode from '../../Components/Extension/HtmlNode';
import { WaykeStore } from '../../Redux/store';
import watch from '../../Redux/watch';
import ecomEvent, { EcomEvent, EcomView } from '../../Utils/ecomEvent';
import { scrollTop } from '../../Utils/scroll';
import CentralStorage from './CentralStorage';
import Customer from './Customer';
import Delivery from './Delivery';
import Intro from './Intro';
import Order from './Order';
import TradeIn from './TradeIn';

const SUMMARY_NODE = 'summary-node';

interface SummaryProps {
  readonly store: WaykeStore;
  readonly cdnMedia?: string;
  readonly onClose: () => void;
}

class Summary extends HtmlNode {
  private readonly props: SummaryProps;

  constructor(element: HTMLElement, props: SummaryProps) {
    super(element);
    this.props = props;
    ecomEvent(EcomView.SUMMARY, EcomEvent.SUMMARY_ACTIVE);

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
    const { store, cdnMedia } = this.props;
    const { stages } = store.getState();

    this.node.innerHTML = `
      <div id="${SUMMARY_NODE}"></div>
    `;

    const content = this.node.querySelector<HTMLDivElement>(`#${SUMMARY_NODE}`);
    if (content) {
      new Intro(content, { store });
      new Order(content, { store, cdnMedia });
      if (stages?.find((x) => x.name === 'tradeIn')) {
        new TradeIn(content, { store });
      }

      if (stages?.find((x) => x.name === 'centralStorage')) {
        new CentralStorage(content, { store });
      }
      new Delivery(content, { store });
      new Customer(content, { store });
    }
  }
}

export default Summary;
