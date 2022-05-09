import { EcomSdkConfig } from './@types/EcomSdkConfig';
import WaykeEcomWeb from './App';
import { devConfig } from './devConfig';
import { Step, UserEvent } from './Utils/userEvent';

window.addEventListener('DOMContentLoaded', (_) => {
  const ecomSdkConfig: EcomSdkConfig = {
    api: {
      address: 'https://ecom.wayketech.se',
    },
  };

  const context = new WaykeEcomWeb({
    ...devConfig.CENTRAL_STORAGE,
    ecomSdkConfig,
    rootId: 'custom-id',
    // eslint-disable-next-line
    onUserEvent: (userEvent: UserEvent, currentStep: Step) => console.log(userEvent, currentStep),
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
