import WaykeEcomWeb from './App';
import { devConfig } from './devConfig';

window.addEventListener('DOMContentLoaded', (_) => {
  const newConfig = {
    api: {
      address: 'https://ecom.wayketech.se',
    },
  };

  new WaykeEcomWeb({ ...devConfig.MULTIPLE_FINANCIAL, config: newConfig });
});
