import watch from 'redux-watch';

import ItemTileSmall from '../../Templates/ItemTileSmall';
import store from '../../Redux/store';
import Customer from './Customer';
import CentralStorage from './CentralStorage';
import Delivery from './Delivery';
import TradeIn from './TradeIn';
import Financial from './Financial';
import Insurance from './Insurance';
import Summary from './Summary';
import Confirmation from './Confirmation';
import { setStages } from '../../Redux/action';
import { StageMapper, StageTypes } from '../../@types/Stages';

const stageMap: StageMapper = {
  customer: { component: Customer, name: 'customer' },
  centralStorage: { component: CentralStorage, name: 'centralStorage' },
  delivery: { component: Delivery, name: 'delivery' },
  tradeIn: { component: TradeIn, name: 'tradeIn' },
  financial: { component: Financial, name: 'financial' },
  insurance: { component: Insurance, name: 'insurance' },
};

type StageMapKeys = keyof typeof stageMap;

class View2v2 {
  private element: Element;

  constructor(element: Element) {
    this.element = element;
    const w = watch(store.getState, 'navigation.view');
    store.subscribe(
      w((view) => {
        if (view === 2) {
          this.render();
        }
      })
    );

    this.setupStages();
    this.element.scrollTop = 0;
  }

  setupStages() {
    const state = store.getState();
    const { order, centralStorage } = state;
    if (!order) throw 'No order available';

    // Stage order setup
    const list: StageMapKeys[] = [
      'customer',
      'centralStorage',
      'delivery',
      'tradeIn',
      'financial',
      'insurance',
    ];

    const stages: StageTypes[] = [];
    list.forEach((key) => {
      if (key === 'centralStorage' && !centralStorage) return;
      if (key === 'tradeIn' && !order.allowsTradeIn) return;

      stages.push(stageMap[key]);
    });
    setStages(stages);
    this.render();
  }

  render() {
    const state = store.getState();
    const { order, stages } = state;
    if (!order) throw 'No order available';

    this.element.innerHTML = ``;

    const pageForm = document.createElement('div');
    pageForm.className = 'waykeecom-page-form';
    this.element.appendChild(pageForm);

    const pageFormAside = document.createElement('aside');
    pageFormAside.className = 'waykeecom-page-form__aside';
    pageFormAside.innerHTML = ItemTileSmall({ vehicle: state.vehicle, order: state.order });
    pageForm.appendChild(pageFormAside);

    const pageFormMain = document.createElement('div');
    pageFormMain.className = 'waykeecom-page-form__main';
    pageForm.appendChild(pageFormMain);

    const stepper = document.createElement('div');
    stepper.className = 'waykeecom-stepper';
    pageFormMain.appendChild(stepper);

    const size = stages?.length;
    // Render stages
    stages?.forEach((stage, index) => new stage.component(stepper, index + 1, size === index + 1));

    new Summary(stepper);
    new Confirmation(stepper);
  }
}

export default View2v2;
