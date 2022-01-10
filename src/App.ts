import './styles/styles.scss';
import { OrderOptionsResponse } from '@wayke-se/ecom/dist-types/orders/order-options-response';
import watch from 'redux-watch';

import { Vehicle } from './@types/Vehicle';
import View1v2 from './ViewsV2/View1';
import store from './Redux/store';
import View2v2 from './ViewsV2/View2';
import { setVehicle } from './Redux/action';

export interface AppState {
  stage: number;
  order?: OrderOptionsResponse;
}

interface AppProps {
  vehicle: Vehicle;
}

class App {
  private root: HTMLElement;
  private view: number;

  constructor(props: AppProps) {
    const root = document.getElementById('wayke-ecom');
    if (!root) {
      throw 'Missing element with id wayke-ecom';
    }
    this.root = root;

    setVehicle(props.vehicle);
    this.view = store.getState().view;

    const w = watch(store.getState, 'view');
    store.subscribe(
      w((newVal: number) => {
        this.view = newVal;
        this.render();
      })
    );
    this.render();
  }

  render() {
    const _current = this.view === 1 ? new View1v2(this.root) : new View2v2(this.root);
  }
}

export default App;
