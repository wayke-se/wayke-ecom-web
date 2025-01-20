import i18next from 'i18next';
import { MarketCode } from '../@types/MarketCode';
import { nbNO, svSE } from '../translation';
import { getLanguage } from './market';

const i18n = (marketCode?: MarketCode) => {
  const locale = getLanguage(marketCode);

  i18next.init({
    lng: locale || 'sv-SE',
    fallbackLng: 'sv-SE',
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

export default i18n;
