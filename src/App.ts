import './styles/styles.scss';
import { OrderOptionsResponse } from '@wayke-se/ecom/dist-types/orders/order-options-response';
import watch from 'redux-watch';

import packageJson from '../package.json';

import { Vehicle } from './@types/Vehicle';
import store from './Redux/store';
import { setVehicle } from './Redux/action';

import View1 from './Views/View1';
import View2 from './Views/View2';
import View3Summary from './Views/View3Summary';

export interface AppState {
  stage: number;
  order?: OrderOptionsResponse;
}

interface AppProps {
  vehicle: Vehicle;
}

class App {
  private root: HTMLElement;
  private contentNode: HTMLDivElement;
  private versionNode: HTMLDivElement;
  private view: number;

  constructor(props: AppProps) {
    const root = document.getElementById('wayke-ecom');
    if (!root) {
      throw 'Missing element with id wayke-ecom';
    }
    this.root = root;

    const contentNode = document.createElement('div');
    const versionNode = document.createElement('div');

    versionNode.style.display = 'none';
    versionNode.innerHTML = `${packageJson.version}`;

    this.contentNode = contentNode;
    this.versionNode = versionNode;

    this.root.appendChild(contentNode);
    this.root.appendChild(versionNode);

    //setId(props.vehicle.id);
    setVehicle(props.vehicle);
    this.view = store.getState().navigation.view;

    const w = watch(store.getState, 'navigation.view');
    store.subscribe(
      w((newVal: number) => {
        this.view = newVal;
        this.render();
      })
    );
    this.render();
  }

  render() {
    this.contentNode.innerHTML = '';
    switch (this.view) {
      case 1:
        new View1(this.contentNode);
        break;
      case 2:
        new View2(this.contentNode);
        break;
      case 3:
        new View3Summary(this.contentNode);
        break;
      default:
        throw 'Unknown view...';
    }
  }
}

export default App;
