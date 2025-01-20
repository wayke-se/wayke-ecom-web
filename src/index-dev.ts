import { EcomSdkConfig } from './@types/EcomSdkConfig';
import WaykeEcomWeb from './App';
import { EcomEvent, EcomStep, EcomView } from './Utils/ecomEvent';
import { devConfig } from './devConfig';

window.addEventListener('DOMContentLoaded', (_) => {
  const ecomSdkConfig: EcomSdkConfig = {
    api: {
      address: 'https://ecom.wayketech.se',
    },
  };

  const context = new WaykeEcomWeb({
    ...devConfig.MULTIPLE_FINANCING,
    ecomSdkConfig,
    rootId: 'custom-id',
    logo: 'https://placehold.jp/180x40.png',
    id: '4a18e9a4-f7ee-458e-8bb4-9b6b8b778bbf',
    onEvent: (_view: EcomView, _event: EcomEvent, _step?: EcomStep, _data?: any) => null,
    marketCode: 'SE',
  });
  context.start();
  const button = document.querySelector<HTMLButtonElement>('#button');
  if (button) {
    button.addEventListener('click', () => context.start());
  }

  const context2 = new WaykeEcomWeb({
    ...devConfig.CREDIT_ASSESSMENT,
    ecomSdkConfig,
  });
  const button2 = document.querySelector<HTMLButtonElement>('#button2');
  if (button2) {
    button2.addEventListener('click', () => context2.start());
  }

  const context3 = new WaykeEcomWeb({
    ...devConfig.CENTRAL_STORAGE,
    ecomSdkConfig,
  });
  const button3 = document.querySelector<HTMLButtonElement>('#button3');
  if (button3) {
    button3.addEventListener('click', () => context3.start());
  }
});
