import i18next from '@i18n';
import { MarketCode } from '../../@types/MarketCode';
import HtmlNode from '../../Components/Extension/HtmlNode';
import { WaykeStore } from '../../Redux/store';
import watch from '../../Redux/watch';
import ItemTileSmall from '../../Templates/ItemTileSmall';
import { stageMap } from '../../Utils/stage';
import Confirmation from './Confirmation';

interface MainProps {
  readonly store: WaykeStore;
  cdnMedia?: string;
  marketCode: MarketCode;
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
    const { store, cdnMedia } = this.props;
    const state = store.getState();
    const { order, stages } = state;
    if (!order) throw 'No order available';

    this.node.innerHTML = ``;

    // Create a node to append aside and stepper into. Required for portal to work as intended
    const asideStepperWrapper = document.createElement('div');
    this.node.appendChild(asideStepperWrapper);

    const pageFormAside = document.createElement('aside');
    pageFormAside.className = 'waykeecom-cart';
    pageFormAside.setAttribute('aria-label', i18next.t('vehicleInfo'));
    pageFormAside.innerHTML = ItemTileSmall({
      vehicle: state.vehicle,
      order: state.order,
      cdnMedia,
    });
    asideStepperWrapper.appendChild(pageFormAside);

    const stepper = document.createElement('ol');
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
          marketCode: this.props.marketCode,
        })
    );

    new Confirmation(stepper, {
      store,
      index: (size || 0) + 1,
      lastStage: true,
      bypassBankId: this.props.marketCode === 'NO',
    });
  }
}

export default Main;
