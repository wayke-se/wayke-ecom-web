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
import watch from 'redux-watch';

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
    this.render();
    this.element.scrollTop = 0;
  }

  render() {
    const state = store.getState();
    const { order } = state;
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

    new Stage1Customer(stepper);
    new Stage2CentralStorage(stepper);
    new Stage3Delivery(stepper);
    if (state.order?.allowsTradeIn()) {
      new Stage4TradeIn(stepper);
    }
    new Stage5Financial(stepper);
    new Stage6Insurance(stepper);
    new Stage7Summary(stepper);
    new Stage8Confirmation(stepper);
  }
}

export default View2v2;
