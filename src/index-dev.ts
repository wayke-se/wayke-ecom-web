import { EcomSdkConfig } from './@types/EcomSdkConfig';
import { MarketCode } from './@types/MarketCode';
import WaykeEcomWeb from './App';
import { EcomEvent, EcomStep, EcomView } from './Utils/ecomEvent';
import { devConfig } from './devConfig';

window.addEventListener('DOMContentLoaded', (_) => {
  const ecomSdkConfig: EcomSdkConfig = {
    api: {
      address: 'https://ecom.wayketech.se',
    },
  };

  const marketCode: MarketCode = 'NO';

  const context = new WaykeEcomWeb({
    ...devConfig.MULTIPLE_FINANCING,
    ecomSdkConfig,
    rootId: 'custom-id',
    logo: 'https://placehold.co/180x40',
    logoX2: 'https://placehold.co/360x80',
    id: '3c71f1d5-2161-4f2c-8602-855d4fbf99fa',
    onEvent: (_view: EcomView, _event: EcomEvent, _step?: EcomStep, _data?: any) => null,
    marketCode,
  });
  context.start();
  const button = document.querySelector<HTMLButtonElement>('#button');
  if (button) {
    button.addEventListener('click', () => context.start());
  }

  const context2 = new WaykeEcomWeb({
    ...devConfig.CREDIT_ASSESSMENT,
    ecomSdkConfig,
    marketCode,
  });
  const button2 = document.querySelector<HTMLButtonElement>('#button2');
  if (button2) {
    button2.addEventListener('click', () => context2.start());
  }

  const context3 = new WaykeEcomWeb({
    ...devConfig.CENTRAL_STORAGE,
    ecomSdkConfig,
    marketCode,
  });
  const button3 = document.querySelector<HTMLButtonElement>('#button3');
  if (button3) {
    button3.addEventListener('click', () => context3.start());
  }
});
