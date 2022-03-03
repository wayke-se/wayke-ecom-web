import './styles/styles.scss';
import { config, IOrderOptionsResponse } from '@wayke-se/ecom';
import watch from 'redux-watch';

import packageJson from '../package.json';

import { Vehicle } from './@types/Vehicle';
import store from './Redux/store';
import { setId } from './Redux/action';

import Preview from './Views/Preview';
import Main from './Views/Main';
import Summary from './Views/Summary';
import OrderCallback from './Views/OrderCallback';
import { StageMapKeys } from './Utils/stage';
import { ViewTypes } from './@types/Navigation';
import Modal from './Components/Modal/Modal';
import { EcomSdkConfig } from './@types/EcomSdkConfig';

const OrderIdQueryString = 'wayke-ecom-web-order-id';

export interface AppState {
  stage: number;
  order?: IOrderOptionsResponse;
}

interface AppProps {
  id: string;
  vehicle?: Vehicle;
  ecomSdkConfig: EcomSdkConfig;
  useBankid?: boolean;
}

class App {
  private root: HTMLElement;
  private props: AppProps;
  private view: ViewTypes;
  private stageOrderList: StageMapKeys[];
  contexts: { modal?: Modal } = {};

  constructor(props: AppProps) {
    const root = document.getElementById('wayke-ecom');
    if (!root) throw 'Missing element with id wayke-ecom';
    if (!props.id) throw 'Missing id';
    this.props = props;

    if (!window.process) {
      window.process = {
        ...((window.process || {}) as NodeJS.Process),
        env: {},
      };
    }
    config.bind(props.ecomSdkConfig);

    this.root = root;
    this.root.dataset.version = packageJson.version;

    // Stage order setup
    this.stageOrderList = [
      'customer',
      'centralStorage',
      'financial',
      'tradeIn',
      'accessories',
      'insurance',
      'delivery',
    ];

    setId(props.id);
    this.view = store.getState().navigation.view;

    const w = watch(store.getState, 'navigation.view');
    store.subscribe(
      w((newVal: ViewTypes) => {
        this.view = newVal;
        this.render();
      })
    );

    const params = new URLSearchParams(location.search);
    const waykeOrderId = params.get('wayke-ecom-web-order-id');
    if (waykeOrderId) {
      this.render(waykeOrderId);
    }
  }

  close() {
    const params = new URLSearchParams(location.search);
    const waykeOrderId = params.get(OrderIdQueryString);
    if (waykeOrderId) {
      params.delete(OrderIdQueryString);
      location.search = params.toString();
    }

    this.root.innerHTML = '';
  }

  start() {
    this.render();
  }

  private render(waykeOrderId?: string) {
    this.contexts.modal = new Modal(this.root, {
      title: 'Wayke Ecom',
      id: 'wayke-ecom-modal',
      onClose: () => this.close(),
    });

    if (this.contexts.modal.content) {
      this.contexts.modal.content.innerHTML = '';

      if (waykeOrderId) {
        new OrderCallback(this.contexts.modal.content, waykeOrderId);
        return;
      }
      switch (this.view) {
        case 'preview':
          new Preview(this.contexts.modal.content, this.stageOrderList, this.props.vehicle);
          break;
        case 'main':
          new Main(this.contexts.modal.content);
          break;
        case 'summary':
          new Summary(this.contexts.modal.content);
          break;
        default:
          throw 'Unknown view...';
      }
    }
  }
}

export default App;
