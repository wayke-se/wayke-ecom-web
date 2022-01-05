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
    vehicle: {
      id: 'e821e7c0-a433-46a2-aeba-283e2357133a',
      title: 'Volvo V70',
      shortDescription: 'D3 Momentum',
      price: 138900,
      imageUrl:
        'https://test-cdn.wayketech.se/media/268b53e8-79e7-4c38-88b5-bae510540971/6d9ecebf-4ca8-497f-9ce7-ba3d4fb680a3/1170x',
      modelYear: 2015,
      milage: 2885,
      gearBox: 'Automat',
      fuelType: 'Diesel',
    },
  };

  config.bind(newConfig);

  new App(devConfig);
});
