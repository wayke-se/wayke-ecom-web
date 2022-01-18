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

class View2v2 {
  private element: Element;

  constructor(element: Element) {
    this.element = element;
    store.subscribe(() => {
      const view = store.getState().navigation.view;
      if (view === 2) {
        this.render();
      }
    });
    this.render();
  }

  render() {
    const state = store.getState();
    this.element.innerHTML = ``;

    const pageForm = document.createElement('div');
    pageForm.className = 'page-form';
    this.element.appendChild(pageForm);

    const pageFormAside = document.createElement('aside');
    pageFormAside.className = 'page-form__aside';
    pageFormAside.innerHTML = `
        <div class="page-form__aside-heading">
          <h3 class="heading heading--4 no-margin">
            Sammanfattning
          </h3>
        </div>
        <div class="page-form__aside-content">
          ${ItemTileSmall({ vehicle: state.vehicle, order: state.order })}
        </div>
      `;
    pageForm.appendChild(pageFormAside);

    const pageFormMain = document.createElement('div');
    pageFormMain.className = 'page-form__main';
    pageForm.appendChild(pageFormMain);

    const stepper = document.createElement('div');
    stepper.className = 'stepper';
    pageFormMain.appendChild(stepper);

    new Stage1Customer(stepper);
    new Stage2CentralStorage(stepper);
    new Stage3Delivery(stepper);
    new Stage4TradeIn(stepper);
    new Stage5Financial(stepper);
    new Stage6Insurance(stepper);
    new Stage7Summary(stepper);
    new Stage8Confirmation(stepper);
  }
}

export default View2v2;
