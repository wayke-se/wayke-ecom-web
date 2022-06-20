import { EcomSdkConfig } from './@types/EcomSdkConfig';
import WaykeEcomWeb from './App';
import { devConfig } from './devConfig';
// import { EcomStep, EcomEvent, EcomView } from './Utils/ecomEvent';

window.addEventListener('DOMContentLoaded', (_) => {
  const ecomSdkConfig: EcomSdkConfig = {
    api: {
      address: 'https://ecom.wayketech.se',
    },
  };

  const context = new WaykeEcomWeb({
    ...devConfig.DEFAULT,
    ecomSdkConfig,
    rootId: 'custom-id',
    /*
    onEvent: (view: EcomView, event: EcomEvent, step?: EcomStep) =>
      // eslint-disable-next-line
      console.log({ view, event, step }),
    */
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
