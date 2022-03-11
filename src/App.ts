import './styles/styles.scss';
import { config, IOrderOptionsResponse } from '@wayke-se/ecom';

import packageJson from '../package.json';

import { Vehicle } from './@types/Vehicle';
import { createStore, WaykeStore } from './Redux/store';
import { reset, setId } from './Redux/action';

import Preview from './Views/Preview';
import Main from './Views/Main';
import Summary from './Views/Summary';
import OrderCallback from './Views/OrderCallback';
import { StageMapKeys } from './Utils/stage';
import { ViewTypes } from './@types/Navigation';
import Modal from './Components/Modal/Modal';
import { EcomSdkConfig } from './@types/EcomSdkConfig';
import watch, { unregisterAllSubscriptions } from './Redux/watch';
import ConfirmClose from './Views/ConfirmClose';
import { creditAssessmentCancelSigning } from './Data/creditAssessmentCancelSigning';

const OrderIdQueryString = 'wayke-ecom-web-order-id';

export const WAYKE_ECOM_MODAL_ID = 'wayke-ecom-modal';

export interface AppState {
  stage: number;
  order?: IOrderOptionsResponse;
}

interface AppProps {
  rootId?: string;
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
  private contexts: {
    store: WaykeStore;
    modal?: Modal;
  } = {
    store: createStore(),
  };

  constructor(props: AppProps) {
    if (!props.id) throw 'Missing id';
    this.props = props;

    if (!window.process) {
      window.process = {
        ...((window.process || {}) as NodeJS.Process),
        env: {},
      };
    }
    config.bind(props.ecomSdkConfig);

    if (this.props.rootId) {
      const rootNode = document.getElementById(this.props.rootId);
      if (!rootNode) throw 'Missing element with id wayke-ecom';
      const createdRoot = document.createElement('div');
      createdRoot.className = 'waykeecom-root';
      this.root = createdRoot;
      rootNode.appendChild(createdRoot);
    } else {
      const createdRoot = document.createElement('div');
      createdRoot.className = 'waykeecom-root';
      this.root = createdRoot;
      document.body.appendChild(this.root);
    }

    this.root.dataset.version = packageJson.version;

    // Stage order setup
    this.stageOrderList = [
      'customer',
      'centralStorage',
      'tradeIn',
      'financial',
      'accessories',
      'insurance',
      'delivery',
    ];

    setId(props.id)(this.contexts.store.dispatch);

    this.view = this.contexts.store.getState().navigation.view;
    watch<ViewTypes>(
      this.contexts.store,
      'navigation.view',
      (newVal) => {
        this.view = newVal;
        if (newVal !== 'preview') {
          this.render();
        }
      },
      true
    );

    const params = new URLSearchParams(location.search);
    const waykeOrderId = params.get('wayke-ecom-web-order-id');
    if (waykeOrderId) {
      this.render(waykeOrderId);
    }
  }

  closeConfirm() {
    const { caseId } = this.contexts.store.getState();
    const params = new URLSearchParams(location.search);
    const waykeOrderId = params.get(OrderIdQueryString);
    if (waykeOrderId) {
      params.delete(OrderIdQueryString);
      location.search = params.toString();
    }

    this.root.innerHTML = '';
    unregisterAllSubscriptions();
    if (caseId) {
      creditAssessmentCancelSigning(caseId);
    }
    reset(this.props.id)(this.contexts.store.dispatch);
  }

  close() {
    const firstView = this.contexts.store.getState().navigation.view === 'preview';
    if (firstView) {
      this.closeConfirm();
      return;
    }

    this.contexts.modal = new Modal(this.root, {
      title: 'Wayke Ecom',
      id: WAYKE_ECOM_MODAL_ID,
    });

    new ConfirmClose(this.contexts.modal.content, {
      onConfirmClose: () => this.closeConfirm(),
      onAbortClose: () => this.render(),
    });
  }

  start() {
    this.render();
  }

  private render(waykeOrderId?: string) {
    this.contexts.modal = new Modal(this.root, {
      title: 'Wayke Ecom',
      id: WAYKE_ECOM_MODAL_ID,
      onClose: () => this.close(),
    });

    if (this.contexts.modal.content) {
      this.contexts.modal.content.innerHTML = '';

      if (waykeOrderId) {
        new OrderCallback(this.contexts.modal.content, {
          store: this.contexts.store,
          waykeOrderId,
        });
        return;
      }

      switch (this.view) {
        case 'preview':
          new Preview(this.contexts.modal.content, {
            store: this.contexts.store,
            stageOrderList: this.stageOrderList,
            vehicle: this.props.vehicle,
          });
          break;
        case 'main':
          new Main(this.contexts.modal.content, { store: this.contexts.store });
          break;
        case 'summary':
          new Summary(this.contexts.modal.content, {
            store: this.contexts.store,
            onClose: () => this.close(),
          });
          break;
        default:
          throw 'Unknown view...';
      }
    }
  }
}

export default App;
