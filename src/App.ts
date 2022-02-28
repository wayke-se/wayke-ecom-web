import './styles/styles.scss';
import { config, IConfigurationRoot, IOrderOptionsResponse } from '@wayke-se/ecom';
import watch from 'redux-watch';

import packageJson from '../package.json';

import { Vehicle } from './@types/Vehicle';
import store from './Redux/store';
import { setVehicle } from './Redux/action';

import Preview from './Views/Preview';
import Main from './Views/Main';
import Summary from './Views/Summary';
import OrderCallback from './Views/OrderCallback';
import { StageMapKeys } from './Utils/stage';
import { ViewTypes } from './@types/Navigation';

const OrderIdQueryString = 'wayke-ecom-web-order-id';

export interface AppState {
  stage: number;
  order?: IOrderOptionsResponse;
}

interface AppProps {
  id?: string;
  vehicle: Vehicle;
  config: IConfigurationRoot;
  useBankid?: boolean;
}

class App {
  private root: HTMLElement;
  private contentNode?: HTMLDivElement;
  private view: ViewTypes;
  private stageOrderList: StageMapKeys[];

  constructor(props: AppProps) {
    const root = document.getElementById('wayke-ecom');
    if (!root) {
      throw 'Missing element with id wayke-ecom';
    }

    if (!window.process) {
      window.process = {
        ...((window.process || {}) as NodeJS.Process),
        env: {},
      };
    }
    config.bind(props.config);

    this.root = root;

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

    //setId(props.vehicle.id);
    setVehicle(props.vehicle);
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
      this.setUpModal();
      this.render(waykeOrderId);
    }
  }

  private setUpModal() {
    // Create modal
    const modalNode = document.createElement('div');
    modalNode.className = 'waykeecom-modal';
    const modalContainerNode = document.createElement('div');
    modalContainerNode.className = 'waykeecom-modal__container';
    const modalCenterNode = document.createElement('div');
    modalCenterNode.className = 'waykeecom-modal__center';
    const modalDialogNode = document.createElement('div');
    modalDialogNode.className = 'waykeecom-modal__dialog';

    this.root.appendChild(modalNode);
    modalNode.appendChild(modalContainerNode);
    modalContainerNode.appendChild(modalCenterNode);
    modalCenterNode.appendChild(modalDialogNode);

    // Create modal header
    const modalHeader = document.createElement('div');
    modalHeader.innerHTML = `
      <header class="waykeecom-modal__header">
        <div class="waykeecom-container">
          <div class="waykeecom-modal__header-inner">
            <button title="Stäng modalen" class="waykeecom-modal__close-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                class="waykeecom-icon"
              >
                <title>Ikon: stäng</title>
                <path d="M9.1 8l5.9 5.9-1.1 1.1L8 9.1 2.1 15 1 13.9 6.9 8 1 2.1 2.1 1 8 6.9 13.9 1 15 2.1 9.1 8z" />
              </svg>
            </button>
            
            <div class="waykeecom-modal__logo">
              <svg class="waykeecom-modal__logo--wordmark" viewBox="0 0 548.95 123.3" preserveAspectRatio="xMinYMid" xmlns="http://www.w3.org/2000/svg">
                <title>Wayke wordmark</title>
                <g>
                  <path d="M275.16,48.31l-18.69,53.3h-12L219.59,28h15.08l16.84,52.57,18-52.88h12.29l18.08,53L316.68,28h13.64l-24.17,73.65H293.75Z"></path>
                  <path d="M348.51,102c-12.8,0-26.41-9.45-26.41-27s13.61-27,26.41-27c5.12,0,12.39,2,16,7.48l.76,1.16V49h12.92v52.29H365.26V93.18l-.77,1.22C361,100,353,102,348.51,102Zm1.92-41.62c-7.37,0-15,5.48-15,14.65a14.67,14.67,0,0,0,15,14.65c7.39,0,14.87-5,14.87-14.65S357.63,60.36,350.42,60.36Z"></path>
                  <path d="M408.36,123.3H395.14l9.92-22.93L381.51,49h14.88l15.39,35.53L427.16,49h13.43Z"></path>
                  <path d="M456.35,77.54V101.3h-13V25.83h13V70.31l24-21.28h17.25L469.78,73.41,499,101.3H481.34Z"></path>
                  <path d="M548.95,75.88v1.45H507.43c.52,8.16,6.5,14.36,15.18,14.36,8.37,0,11.78-4.23,12.71-5.68h13c-.83,5.37-8,16.63-25.72,16.63-16.94,0-28.4-11.77-28.4-27.47,0-16.22,11.36-27.47,27.37-27.47S548.95,58.84,548.95,75.88Zm-41.11-7.64h27.27c-2-6.61-6.82-10.33-13.53-10.33C514.45,57.92,509.49,61.73,507.84,68.24Z"></path>
                </g>
                <g>
                  <circle cx="4.25" cy="39.68" r="4.25"></circle>
                  <circle cx="25.15" cy="68.03" r="4.96"></circle>
                  <circle cx="46.04" cy="96.38" r="6.38"></circle>
                  <circle cx="66.93" cy="68.03" r="7.09"></circle>
                  <circle cx="87.82" cy="39.68" r="8.5"></circle>
                  <circle cx="108.72" cy="68.03" r="10.63"></circle>
                  <circle cx="129.61" cy="96.38" r="12.76"></circle>
                  <circle cx="150.5" cy="68.03" r="13.47"></circle>
                  <circle cx="171.4" cy="39.68" r="14.17"></circle>
                  <circle cx="129.61" cy="39.68" r="12.05"></circle>
                  <circle cx="66.93" cy="11.34" r="7.09"></circle>
                  <circle cx="150.5" cy="11.34" r="11.34"></circle>
                  <circle cx="108.72" cy="11.34" r="10.63"></circle>
                  <circle cx="46.04" cy="39.68" r="6.38"></circle>
                  <circle cx="25.15" cy="11.34" r="4.96"></circle>
                </g>
              </svg>
              <svg class="waykeecom-modal__logo--symbol" viewBox="0 0 185.57 109.13" preserveAspectRatio="xMinYMid" xmlns="http://www.w3.org/2000/svg">
                <title>Wayke symbol</title>
                <circle cx="4.25" cy="39.68" r="4.25"></circle>
                <circle cx="25.15" cy="68.03" r="4.96"></circle>
                <circle cx="46.04" cy="96.38" r="6.38"></circle>
                <circle cx="66.93" cy="68.03" r="7.09"></circle>
                <circle cx="87.82" cy="39.68" r="8.5"></circle>
                <circle cx="108.72" cy="68.03" r="10.63"></circle>
                <circle cx="129.61" cy="96.38" r="12.76"></circle>
                <circle cx="150.5" cy="68.03" r="13.47"></circle>
                <circle cx="171.4" cy="39.68" r="14.17"></circle>
                <circle cx="129.61" cy="39.68" r="12.05"></circle>
                <circle cx="66.93" cy="11.34" r="7.09"></circle>
                <circle cx="150.5" cy="11.34" r="11.34"></circle>
                <circle cx="108.72" cy="11.34" r="10.63"></circle>
                <circle cx="46.04" cy="39.68" r="6.38"></circle>
                <circle cx="25.15" cy="11.34" r="4.96"></circle>
              </svg>
            </div>
          </div>
        </div>
      </header>
    `;

    modalHeader.querySelectorAll<HTMLButtonElement>('button').forEach((button) => {
      button.addEventListener('click', () => this.close());
    });

    modalDialogNode.appendChild(modalHeader);

    // Append content
    const contentNode = document.createElement('div');
    this.contentNode = contentNode;
    modalDialogNode.appendChild(contentNode);

    // Add version number to root
    this.root.dataset.version = packageJson.version;
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
    this.setUpModal();
    this.render();
  }

  private render(waykeOrderId?: string) {
    if (this.contentNode) {
      this.contentNode.innerHTML = '';
      if (waykeOrderId) {
        new OrderCallback(this.contentNode, waykeOrderId);
        return;
      }

      switch (this.view) {
        case 'preview':
          new Preview(this.contentNode, this.stageOrderList);
          break;
        case 'main':
          new Main(this.contentNode);
          break;
        case 'summary':
          new Summary(this.contentNode);
          break;
        default:
          throw 'Unknown view...';
      }
    }
  }
}

export default App;
