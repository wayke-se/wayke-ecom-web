import WaykeEcomWeb from './App';

declare global {
  interface Window {
    WaykeEcomWeb: typeof WaykeEcomWeb;
  }
}

window.addEventListener('DOMContentLoaded', (_) => {
  const scriptTag = document.querySelector<HTMLScriptElement>('script[src*="wayke-ecom-web"]');
  if (scriptTag) {
    const shouldInject = !scriptTag.getAttribute('disablecssinjection');
    if (shouldInject) {
      const src = scriptTag.src.replace('.js', '.css');
      const allreadyInjected = !!document.head.querySelector(`[href="${src}"]`);
      if (!allreadyInjected) {
        const cssFile = document.createElement('link');
        cssFile.rel = 'stylesheet';
        cssFile.href = src;
        document.head.appendChild(cssFile);
      }
    }
  }
});

window.WaykeEcomWeb = WaykeEcomWeb;
