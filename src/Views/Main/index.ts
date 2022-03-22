import ItemTileSmall from '../../Templates/ItemTileSmall';
import { WaykeStore } from '../../Redux/store';
import Confirmation from './Confirmation';
import HtmlNode from '../../Components/Extension/HtmlNode';
import watch from '../../Redux/watch';
import { stageMap } from '../../Utils/stage';

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

    // Create a node to append aside and stepper into. Required for portal to work as intended
    const asideStepperWrapper = document.createElement('div');
    this.node.appendChild(asideStepperWrapper);

    const pageFormAside = document.createElement('aside');
    pageFormAside.className = 'waykeecom-cart';
    pageFormAside.setAttribute('aria-label', 'Fordonsinformation');
    pageFormAside.innerHTML = ItemTileSmall({ vehicle: state.vehicle, order: state.order });
    asideStepperWrapper.appendChild(pageFormAside);

    const stepper = document.createElement('div');
    stepper.className = 'waykeecom-stepper';
    asideStepperWrapper.appendChild(stepper);

    const size = stages?.length;
    // Render stages
    stages?.forEach(
      (stage, index) =>
        new stageMap[stage.name].component(stepper, {
          store,
          index: index + 1,
          lastStage: false, //size === index + 1,
        })
    );

    new Confirmation(stepper, { store, index: (size || 0) + 1, lastStage: true });
  }
}

export default Main;
