import _i18next from 'i18next';
import { MarketCode } from '../@types/MarketCode';
import { nbNO, svSE } from '../translation';
import { getLanguage } from './market';

const i18next: typeof _i18next = _i18next.createInstance();

export const t = (key: string, options?: any) => i18next?.t(key, options);

export const initializeI18N = (marketCode?: MarketCode) => {
  const locale = getLanguage(marketCode);

  i18next.init({
    lng: locale,
    debug: true,
    resources: {
      'sv-SE': {
        translation: svSE,
      },
      'nb-NO': {
        translation: nbNO,
      },
    },
  });
};

export default i18next;
