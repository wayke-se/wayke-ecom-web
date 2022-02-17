import WaykeEcomWeb from './App';
import { devConfig } from './devConfig';

window.addEventListener('DOMContentLoaded', (_) => {
  const newConfig = {
    api: {
      address: 'https://ecom.wayketech.se',
    },
  };

  const context = new WaykeEcomWeb({ ...devConfig.MULTIPLE_FINANCIAL, config: newConfig });
  const button = document.querySelector<HTMLButtonElement>('button');
  if (button) {
    button.addEventListener('click', () => context.start());
  }
});
