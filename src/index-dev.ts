import WaykeEcomWeb from './App';
import { devConfig } from './devConfig';

window.addEventListener('DOMContentLoaded', (_) => {
  const newConfig = {
    api: {
      address: 'https://ecom.wayketech.se',
    },
  };

  const context = new WaykeEcomWeb({
    ...devConfig.CREDIT_ASSESSMENT,
    config: newConfig,
  });
  context.start();
  const button = document.querySelector<HTMLButtonElement>('button');
  if (button) {
    button.addEventListener('click', () => context.start());
  }
});
