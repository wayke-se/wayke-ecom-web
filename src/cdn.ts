import WaykeEcomWeb from './App';

declare global {
  interface Window {
    WaykeEcomWeb: typeof WaykeEcomWeb;
  }
}

window.WaykeEcomWeb = WaykeEcomWeb;
