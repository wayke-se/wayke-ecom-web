import { EcomSdkConfig } from './@types/EcomSdkConfig';
import WaykeEcomWeb from './App';
import { devConfig } from './devConfig';

window.addEventListener('DOMContentLoaded', (_) => {
  const ecomSdkConfig: EcomSdkConfig = {
    api: {
      address: 'https://ecom.wayketech.se',
    },
  };

  const context = new WaykeEcomWeb({
    ...devConfig.ACCESSORIES,
    ecomSdkConfig,
  });
  context.start();
  const button = document.querySelector<HTMLButtonElement>('button');
  if (button) {
    button.addEventListener('click', () => context.start());
  }
});
