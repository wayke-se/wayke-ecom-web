import ItemTileSmall from '../../Components/ItemTileSmall';
import store from '../../Redux/store';
import Stage1 from './Stage1';
import Stage2 from './Stage2';
import Stage3 from './Stage3';

class View2v2 {
  private element: Element;

  constructor(element: Element) {
    this.element = element;
    store.subscribe(() => this.render());
    this.render();
  }

  render() {
    const state = store.getState();
    this.element.innerHTML = ``;

    const aside = document.createElement('aside');
    aside.className = 'aside';
    aside.innerHTML = `
        ${ItemTileSmall({ vehicle: state.vehicle, order: state.order })}
      `;

    this.element.appendChild(aside);

    const stepper = document.createElement('div');
    stepper.className = 'stepper';
    this.element.appendChild(stepper);

    new Stage1(stepper);
    new Stage2(stepper);
    new Stage3(stepper);
  }
}

export default View2v2;
