import './styles/styles.scss';
import { config, IOrderOptionsResponse } from '@wayke-se/ecom';

import packageJson from '../package.json';

import { Vehicle } from './@types/Vehicle';
import { createStore, WaykeStore } from './Redux/store';
import { reset, setId, setState } from './Redux/action';

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
import { useVwListner } from './Utils/vw';
import { CallbackOrder } from './@types/CallbackOrder';
import { ReducerState } from './Redux/reducer';
import ecomEvent, {
  registerEventListner,
  Step,
  unregisterEventListner,
  EcomEvent,
  EcomView,
  getLastHistory,
} from './Utils/ecomEvent';

const OrderIdQueryString = 'order';
const Payment3DSecurityCallback = 'wayke-ecom-web-payment';
const OrderWaykeIdQueryString = 'wayke-ecom-web-id';

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
  onEvent?: (view: EcomView, event: EcomEvent, currentStep?: Step) => void;
}

class App {
  private root: HTMLElement;
  private readonly props: AppProps;
  private view: ViewTypes;
  private stageOrderList: StageMapKeys[];
  private readonly contexts: {
    store: WaykeStore;
    modal?: Modal;
    unsubribeVwListner?: () => void;
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

    /*
    if (props.onEvent) {
      registerEventListner(props.onEvent);
    }
    */

    config.bind(props.ecomSdkConfig);
    const createdRoot = document.createElement('div');
    createdRoot.className = 'waykeecom-root';
    this.root = createdRoot;
    if (this.props.rootId) {
      const rootNode = document.getElementById(this.props.rootId);
      if (!rootNode) throw 'Missing element with id wayke-ecom';
      rootNode.appendChild(createdRoot);
    } else {
      document.body.appendChild(this.root);
    }

    this.root.dataset.version = packageJson.version;

    // Stage order setup

    /** Original order
      'centralStorage',
      'customer',
      'financial',
      'tradeIn',
      'accessories',
      'insurance',
      'delivery',
    */
    this.stageOrderList = [
      'centralStorage',
      'customer',
      'financial',
      'tradeIn',
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
    const orderUrl = params.get(OrderIdQueryString) || undefined;
    const payment3dSecurityCallback = !!params.get(Payment3DSecurityCallback);
    const waykeId = params.get(OrderWaykeIdQueryString);
    if (waykeId && waykeId === this.props.id && (orderUrl || payment3dSecurityCallback)) {
      if (payment3dSecurityCallback) {
        const stateAsString = sessionStorage.getItem('wayke-ecom-state');
        sessionStorage.removeItem('wayke-ecom-state');
        const state = stateAsString
          ? (JSON.parse(stateAsString) as unknown as ReducerState | undefined)
          : undefined;
        if (state) {
          this.view = state.navigation.view;
          setState({ ...state, stateLoadedFromSession: true } as unknown as ReducerState)(
            this.contexts.store.dispatch
          );
        }
      } else if (orderUrl) {
        this.render({
          orderUrl,
          id: waykeId,
        });
      }
    }
  }

  close() {
    const lastEvent = getLastHistory();
    ecomEvent(lastEvent.view, EcomEvent.CLOSE, lastEvent.currentStep);
    const { caseId } = this.contexts.store.getState();
    const params = new URLSearchParams(location.search);
    const orderId = params.get(OrderIdQueryString);
    const orderWaykeId = params.get(OrderWaykeIdQueryString);
    let urlChanged = false;
    if (orderId) {
      params.delete(OrderIdQueryString);
      urlChanged = true;
      location.search = params.toString();
    }

    if (orderWaykeId) {
      params.delete(OrderWaykeIdQueryString);
      urlChanged = true;
    }

    if (urlChanged) {
      location.search = params.toString();
    }

    this.root.innerHTML = '';
    this.contexts?.unsubribeVwListner?.();

    unregisterAllSubscriptions();
    if (caseId) {
      creditAssessmentCancelSigning(caseId);
    }
    sessionStorage.removeItem('wayke-ecom-state');
    reset(this.props.id)(this.contexts.store.dispatch);
    if (this.props.onEvent) {
      unregisterEventListner(this.props.onEvent);
    }
  }

  private closeWithConfirm() {
    const { navigation, createdOrderId } = this.contexts.store.getState();
    const firstView = navigation.view === 'preview';
    if (firstView || createdOrderId) {
      this.close();
      return;
    }

    this.contexts.modal = new Modal(this.root, {
      title: 'Wayke Ecom',
      id: WAYKE_ECOM_MODAL_ID,
    });

    const lastEvent = getLastHistory();
    ecomEvent(lastEvent.view, EcomEvent.CONFIRM_CLOSE_ACTIVE);
    new ConfirmClose(this.contexts.modal.content, {
      onConfirmClose: () => {
        const lastEvent = getLastHistory();
        ecomEvent(lastEvent.view, EcomEvent.CONFIRM_CLOSE_CONFIRMED, lastEvent.currentStep);
        this.close();
      },
      onAbortClose: () => {
        const lastEvent = getLastHistory();
        ecomEvent(lastEvent.view, EcomEvent.CONFIRM_CLOSE_ABORTED, lastEvent.currentStep);
        this.render();
      },
    });
  }

  start() {
    if (this.props.onEvent) {
      registerEventListner(this.props.onEvent);
    }

    ecomEvent(EcomView.PREVIEW, EcomEvent.START);
    this.render();
  }

  private render(callbackOrder?: CallbackOrder) {
    if (!this.contexts.unsubribeVwListner) {
      this.contexts.unsubribeVwListner = useVwListner();
    }
    this.contexts.modal = new Modal(this.root, {
      title: 'Wayke Ecom',
      id: WAYKE_ECOM_MODAL_ID,
      onClose: () => this.closeWithConfirm(),
    });

    if (this.contexts.modal.content) {
      this.contexts.modal.content.innerHTML = '';

      if (callbackOrder) {
        new OrderCallback(this.contexts.modal.content, {
          store: this.contexts.store,
          callbackOrder,
          onClose: () => this.close(),
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
