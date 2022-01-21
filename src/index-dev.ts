import { config } from '@wayke-se/ecom';

import App from './App';
import { devConfig } from './devConfig';

window.addEventListener('DOMContentLoaded', (_) => {
  if (!window.process) {
    window.process = {
      ...((window.process || {}) as NodeJS.Process),
      env: {},
    };
  }

  const newConfig = {
    api: {
      address: 'https://ecom.wayketech.se',
    },
  };

  config.bind(newConfig);

  new App(devConfig.BANKID_TRADE_IN_HOME_DELIVERY);
});
