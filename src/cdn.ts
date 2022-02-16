import { config } from '@wayke-se/ecom';
import WaykeEcomWeb from './App';

declare global {
  interface Window {
    process: {};
    WaykeEcomWeb: {
      WaykeEcomWeb: typeof WaykeEcomWeb;
      config: typeof config;
    };
  }
}

if (!window.process) {
  window.process = {
    ...((window.process || {}) as NodeJS.Process),
    env: {},
  };
}

window.WaykeEcomWeb = {
  WaykeEcomWeb,
  config,
};
