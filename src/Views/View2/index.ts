import watch from 'redux-watch';

import ItemTileSmall from '../../Templates/ItemTileSmall';
import store from '../../Redux/store';
import Stage1Customer from './Stage1Customer';
import Stage2CentralStorage from './Stage2CentralStorage';
import Stage3Delivery from './Stage3Delivery';
import Stage4TradeIn from './Stage4TradeIn';
import Stage5Financial from './Stage5Financial';
import Stage6Insurance from './Stage6Insurance';
import Stage7Summary from './Stage7Summary';
import Stage8Confirmation from './Stage8Confirmation';
import { setStages } from '../../Redux/action';
import { StageMapper, StageTypes } from '../../@types/Stages';

const stageMap: StageMapper = {
  customer: { component: Stage1Customer, name: 'customer' },
  centralStorage: { component: Stage2CentralStorage, name: 'centralStorage' },
  delivery: { component: Stage3Delivery, name: 'delivery' },
  tradeIn: { component: Stage4TradeIn, name: 'tradeIn' },
  financial: { component: Stage5Financial, name: 'financial' },
  insurance: { component: Stage6Insurance, name: 'insurance' },
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
    stages?.forEach((stage, index) => new stage.component(stepper, index + 1, size === index + 1));

    new Stage7Summary(stepper);
    new Stage8Confirmation(stepper);
  }
}

export default View2v2;
