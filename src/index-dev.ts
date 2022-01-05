import { config } from '@wayke-se/ecom';

import App from './App';

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

  const devConfig = {
    id: 'e821e7c0-a433-46a2-aeba-283e2357133a',
  };

  config.bind(newConfig);

  new App(devConfig);
});
