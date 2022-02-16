import App from './App';
import { devConfig } from './devConfig';

window.addEventListener('DOMContentLoaded', (_) => {
  const newConfig = {
    api: {
      address: 'https://ecom.wayketech.se',
    },
  };

  new App({ ...devConfig.MULTIPLE_FINANCIAL, config: newConfig });
});
