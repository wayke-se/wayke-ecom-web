import ItemTileSmall from '../../Templates/ItemTileSmall';
import { WaykeStore } from '../../Redux/store';
import Summary from './Summary';
import Confirmation from './Confirmation';
import HtmlNode from '../../Components/Extension/HtmlNode';
import watch from '../../Redux/watch';

interface MainProps {
  readonly store: WaykeStore;
}

class Main extends HtmlNode {
  private readonly props: MainProps;

  constructor(element: HTMLElement, props: MainProps) {
    super(element);
    this.props = props;

    watch<number>(this.props.store, 'navigation.view', (view) => {
      if (view === 2) {
        this.render();
      }
    });

    this.render();
    this.node.scrollTop = 0;
  }

  render() {
    const { store } = this.props;
    const state = store.getState();
    const { order, stages } = state;
    if (!order) throw 'No order available';

    this.node.innerHTML = ``;

    // TODO: Remove Aside and ItemTileSmall elements
    const pageFormAside = document.createElement('aside');
    pageFormAside.setAttribute('aria-label', 'Fordonsinformation');
    pageFormAside.setAttribute('hidden', '');
    pageFormAside.innerHTML = ItemTileSmall({ vehicle: state.vehicle, order: state.order });
    //this.node.appendChild(pageFormAside);

    const stepper = document.createElement('div');
    stepper.className = 'waykeecom-stepper';
    this.node.appendChild(stepper);

    const size = stages?.length;
    // Render stages
    stages?.forEach(
      (stage, index) =>
        new stage.component(stepper, {
          store,
          index: index + 1,
          lastStage: size === index + 1,
        })
    );

    new Summary(stepper);
    new Confirmation(stepper);
  }
}

export default Main;
