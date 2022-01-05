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
      imageUrls: [
        'https://test-cdn.wayketech.se/media/87290e0d-f0c1-48a7-8e08-e4465aa877b5/c8619c99-466c-4b79-956e-5e33b41493ea/1170x',
        'https://test-cdn.wayketech.se/media/87290e0d-f0c1-48a7-8e08-e4465aa877b5/c8619c99-466c-4b79-956e-5e33b41493ea/1170x',
        'https://test-cdn.wayketech.se/media/80b2852f-d9fb-4fbe-afa7-81bf2f4b8268/58e4a4bf-b983-4e69-819e-f7ad306999f9/1170x',
        'https://test-cdn.wayketech.se/media/a854df5b-c152-48df-94d0-58fee0b1ee60/1d96a0a4-4faf-4123-a1cc-618837e80094/1170x',
      ],
      modelYear: 2015,
      milage: 2885,
      gearBox: 'Automat',
      fuelType: 'Diesel',
    },
  };

  config.bind(newConfig);

  new App(devConfig);
});
