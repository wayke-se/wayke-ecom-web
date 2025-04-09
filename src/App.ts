import './styles/styles.scss';
import { IOrderOptionsResponse, config } from '@wayke-se/ecom';

import packageJson from '../package.json';

import { Vehicle } from './@types/Vehicle';
import { reset, setId, setState } from './Redux/action';
import { WaykeStore, createStore } from './Redux/store';

import i18next, { initializeI18N } from '@i18n';
import { CallbackOrder } from './@types/CallbackOrder';
import { EcomSdkConfig } from './@types/EcomSdkConfig';
import { MarketCode } from './@types/MarketCode';
import { ViewTypes } from './@types/Navigation';
import Modal from './Components/Modal/Modal';
import { creditAssessmentCancelSigning } from './Data/creditAssessmentCancelSigning';
import { ReducerState } from './Redux/reducer';
import watch, { unregisterAllSubscriptions } from './Redux/watch';
import ecomEvent, {
  registerEventListner,
  EcomStep,
  unregisterEventListner,
  EcomEvent,
  EcomView,
  getLastHistory,
} from './Utils/ecomEvent';
import { unregisterAllIntervals } from './Utils/intervals';
import { StageMapKeys } from './Utils/stage';
import { useVwListner } from './Utils/vw';
import ConfirmClose from './Views/ConfirmClose';
import Main from './Views/Main';
import OrderCallback from './Views/OrderCallback';
import Preview from './Views/Preview';
import Summary from './Views/Summary';

const OrderIdQueryString = 'order';
const Payment3DSecurityCallback = 'wayke-ecom-web-payment';
const OrderWaykeIdQueryString = 'wayke-ecom-web-id';

export const WAYKE_ECOM_MODAL_ID = 'wayke-ecom-modal';

const TEST_HOST = 'ecom.wayketech.se';
const PROD_HOST = 'ecom.wayke.se';
const resolveCdnMedia = (url: string) => {
  const _url = new URL(url);
  switch (_url.host) {
    case PROD_HOST:
      return 'https://cdn.wayke.se';
    case TEST_HOST:
      return 'https://test-cdn.wayketech.se';
    default:
      return undefined;
  }
};

export interface AppState {
  stage: number;
  order?: IOrderOptionsResponse;
}

interface AppProps {
  rootId?: string;
  id: string;
  vehicle?: Vehicle;
  ecomSdkConfig: EcomSdkConfig;
  logo?: string;
  logoX2?: string;
  onEvent?: (view: EcomView, event: EcomEvent, currentStep?: EcomStep, data?: any) => void;
  marketCode?: MarketCode;
}

class App {
  private root: HTMLElement;
  private readonly props: AppProps;
  private view: ViewTypes;
  private stageOrderList: StageMapKeys[];
  private readonly cdnMedia?: string;
  private readonly contexts: {
    store: WaykeStore;
    modal?: Modal;
    lastTrigger?: HTMLElement; // The element that triggered the modal
    unsubribeVwListner?: () => void;
  } = {
    store: createStore(),
  };
  private marketCode: MarketCode;

  constructor(props: AppProps) {
    if (!props.id) throw 'Missing id';
    this.props = props;
    this.marketCode = props.marketCode || 'SE';
    initializeI18N(this.marketCode);

    if (!window.process) {
      window.process = {
        ...((window.process || {}) as NodeJS.Process),
        env: {},
      };
    }

    config.bind(props.ecomSdkConfig);
    this.cdnMedia = resolveCdnMedia(props.ecomSdkConfig.api.address);
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
    if (lastEvent) {
      ecomEvent(lastEvent.view, EcomEvent.CLOSE, lastEvent.currentStep);
    }
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

    unregisterAllIntervals();
    unregisterAllSubscriptions();
    if (caseId) {
      creditAssessmentCancelSigning(caseId);
    }
    sessionStorage.removeItem('wayke-ecom-state');
    reset(this.props.id)(this.contexts.store.dispatch);
    if (this.props.onEvent) {
      unregisterEventListner(this.props.onEvent);
    }

    // Set focus back to the element that triggered the modal
    if (this.contexts.lastTrigger) {
      this.contexts.lastTrigger.focus();
      this.contexts.lastTrigger = undefined;
    }
  }

  destroy() {
    this.close();
    this.root.remove();
  }

  private closeWithConfirm() {
    const { navigation, createdOrderId } = this.contexts.store.getState();
    const firstView = navigation.view === 'preview';
    unregisterAllIntervals();
    if (firstView || createdOrderId) {
      this.close();
      return;
    }

    this.contexts.modal = new Modal(this.root, {
      title: i18next.t('glossary.modalTitle'),
      id: WAYKE_ECOM_MODAL_ID,
      logo: this.props.logo,
      logoX2: this.props.logoX2,
      marketCode: this.marketCode,
    });

    const lastEvent = getLastHistory();
    if (lastEvent) {
      ecomEvent(lastEvent.view, EcomEvent.CONFIRM_CLOSE_ACTIVE);
    }
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

  private focusModal() {
    if (this.contexts.modal?.content) {
      this.contexts.modal.content.setAttribute('tabindex', '-1');
      this.contexts.modal.content.focus();
    }
  }

  private render(callbackOrder?: CallbackOrder) {
    if (!this.contexts.lastTrigger) {
      this.contexts.lastTrigger = document.activeElement as HTMLElement;
    }
    if (!this.contexts.unsubribeVwListner) {
      this.contexts.unsubribeVwListner = useVwListner();
    }
    this.contexts.modal = new Modal(this.root, {
      title: i18next.t('glossary.modalTitle'),
      id: WAYKE_ECOM_MODAL_ID,
      logo: this.props.logo,
      logoX2: this.props.logoX2,
      onClose: () => this.closeWithConfirm(),
      marketCode: this.marketCode,
    });

    if (this.contexts.modal.content) {
      this.contexts.modal.content.innerHTML = '';

      if (callbackOrder) {
        new OrderCallback(this.contexts.modal.content, {
          store: this.contexts.store,
          callbackOrder,
          onClose: () => this.close(),
        });

        // Set focus to the modal to trap focus
        this.focusModal();

        return;
      }

      switch (this.view) {
        case 'preview':
          new Preview(this.contexts.modal.content, {
            store: this.contexts.store,
            stageOrderList: this.stageOrderList,
            vehicle: this.props.vehicle,
            cdnMedia: this.cdnMedia,
          });
          break;
        case 'main':
          new Main(this.contexts.modal.content, {
            store: this.contexts.store,
            cdnMedia: this.cdnMedia,
            marketCode: this.marketCode,
          });
          break;
        case 'summary':
          new Summary(this.contexts.modal.content, {
            store: this.contexts.store,
            cdnMedia: this.cdnMedia,
            onClose: () => this.close(),
            marketCode: this.marketCode,
          });
          break;
        default:
          throw 'Unknown view...';
      }

      // Set focus to the modal to trap focus
      this.focusModal();
    }
  }
}

export default App;
