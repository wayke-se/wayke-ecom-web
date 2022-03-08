import ItemTileSmall from '../../Templates/ItemTileSmall';
import store from '../../Redux/store';
import Summary from './Summary';
import Confirmation from './Confirmation';
import HtmlNode from '../../Components/Extension/HtmlNode';
import watch from '../../Redux/watch';
class Main extends HtmlNode {
  constructor(element: HTMLElement) {
    super(element);

    watch<number>('navigation.view', (view) => {
      if (view === 2) {
        this.render();
      }
    });

    this.render();
    this.node.scrollTop = 0;
  }

  render() {
    const state = store.getState();
    const { order, stages } = state;
    if (!order) throw 'No order available';

    this.node.innerHTML = ``;

    const pageForm = document.createElement('div');
    pageForm.className = 'waykeecom-page-form';
    this.node.appendChild(pageForm);

    const pageFormAside = document.createElement('aside');
    pageFormAside.className = 'waykeecom-page-form__aside';
    pageFormAside.setAttribute('aria-label', 'Fordonsinformation');
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

export default Main;
